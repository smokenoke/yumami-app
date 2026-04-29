import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { FinanceCategory, StatementTransaction } from "@/types/domain";

export type ParsedStatementTransaction = Pick<
  StatementTransaction,
  | "transaction_date"
  | "booking_date"
  | "counterparty"
  | "description"
  | "amount"
  | "currency"
  | "direction"
  | "review_status"
  | "confidence_score"
  | "source_row_key"
  | "notes"
> & {
  matchedCategoryName: string | null;
  suggestedCategoryKind: FinanceCategory["kind"] | null;
};

export interface ParsedStatementImport {
  statementMonth: string;
  periodStart: string;
  periodEnd: string;
  transactions: ParsedStatementTransaction[];
}

type CategoryRule = {
  category: string;
  kind?: FinanceCategory["kind"];
  keywords: string[];
  confidence: number;
};

const TRANSACTION_START_PATTERN = /^(\d{2}-\d{2}-\d{4})\s+(.+?)\s+(-?[\d.,]+)\s+EUR$/;
const PERIOD_PATTERN = /Datum van (\d{2}-\d{2}-\d{4}) tot en met (\d{2}-\d{2}-\d{4})/;
const HEADER_PATTERNS = [
  /^KBC Bank NV /,
  /^BTW BE /,
  /^Een onderneming van de KBC-groep$/,
  /^\d{4}-\d{2}-\d{2}-\d{2}\.\d{2}\.\d{2}-A\d+-BE\d+ Export KBC Touch \d+\/\d+$/,
  /^ALESHIN MAXIM & WU YUXI$/,
  /^KBC-Rekening$/,
  /^BE\d{2}\s/,
  /^Datum van \d{2}-\d{2}-\d{4} tot en met \d{2}-\d{2}-\d{4}$/,
  /^Saldo op \d{2}-\d{2}-\d{4} om \d{2}:\d{2} [\d.,-]+ EUR$/,
  /^-- \d+ of \d+ --$/,
];
const STOP_LABELS = new Set([
  "Rekeningnummer",
  "BIC:",
  "Tijdstip",
  "Met",
  "Referte schuldeiser",
  "Mandaatreferte",
  "Domiciliëring",
  "Datum",
  "Debetkaart",
  "Virtueel kaartnummer contactloze betaling",
  "Kaarthouder",
  "via Debit Mastercard",
  "via Bancontact",
  "Overschrijving",
  "Instantoverschrijving",
  "Betaling met Apple Pay",
  "Betaling met Google Pay",
  "Betaling met KBC-Debetkaart",
]);

const CATEGORY_RULES: CategoryRule[] = [
  { category: "Rent", kind: "expense", keywords: ["huur", "algemene kosten", "winketkaai"], confidence: 0.98 },
  { category: "Insurance", kind: "expense", keywords: ["verzekering", "familiale"], confidence: 0.97 },
  { category: "Utilities", kind: "expense", keywords: ["bolt energie", "pidpa", "elektriciteit", "water"], confidence: 0.97 },
  { category: "Internet & telecom", kind: "expense", keywords: ["telenet", "telecom", "proximus", "orange"], confidence: 0.96 },
  { category: "Groceries", kind: "expense", keywords: ["albert heijn", "carrefour", "lidl", "spar", "delhaize"], confidence: 0.95 },
  { category: "Dining out", kind: "expense", keywords: ["hawaiian poke bowl", "welcome asia", "pain quotidien", "ice cream", "restaurant"], confidence: 0.92 },
  { category: "Home & living", kind: "expense", keywords: ["dille en kamille", "ikea", "meubel", "melunex"], confidence: 0.88 },
  { category: "Shopping", kind: "expense", keywords: ["action", "kruidvat", "smartphoto", "tiger store"], confidence: 0.88 },
  { category: "Health & sport", kind: "expense", keywords: ["basic-fit", "sport"], confidence: 0.95 },
  { category: "Fees & taxes", kind: "expense", keywords: ["bijdrage kbc-plusrekening", "belasting", "boete", "fee"], confidence: 0.94 },
  { category: "Transport & parking", kind: "expense", keywords: ["parking", "nmbs", "de lijn", "bolt ride", "uber"], confidence: 0.9 },
  { category: "Travel", kind: "expense", keywords: ["vakantie", "hotel", "booking.com", "ryanair", "brussels airlines"], confidence: 0.88 },
  { category: "Gifts", kind: "expense", keywords: ["cadeau", "gift"], confidence: 0.86 },
  { category: "Shared contribution", kind: "income", keywords: ["aleshin maxim", "wu yuxi"], confidence: 0.82 },
  { category: "Refund", kind: "income", keywords: ["refund", "teruggave", "terugbetaling"], confidence: 0.86 },
];

function normalizeLine(line: string) {
  return line.replace(/\s+/g, " ").trim();
}

function parseBelgianAmount(rawAmount: string) {
  return Number(rawAmount.replace(/\./g, "").replace(",", "."));
}

function toIsoDate(rawDate: string) {
  const [day, month, year] = rawDate.split("-");
  return `${year}-${month}-${day}`;
}

function getStatementMonth(rawDate: string) {
  const [, month, year] = rawDate.split("-");
  return `${year}-${month}-01`;
}

function getValueAfterLabel(lines: string[], label: string) {
  const index = lines.findIndex((line) => line === label);
  if (index === -1) {
    return null;
  }

  const values: string[] = [];
  for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
    const line = lines[cursor];
    if (STOP_LABELS.has(line) || TRANSACTION_START_PATTERN.test(line)) {
      break;
    }
    values.push(line);
  }

  return values.length > 0 ? values.join(" ").trim() : null;
}

function getPaymentMethod(lines: string[]) {
  return (
    lines.find(
      (line) =>
        line === "Domiciliëring" ||
        line === "Instantoverschrijving" ||
        line === "Overschrijving" ||
        line.startsWith("Betaling met "),
    ) ?? null
  );
}

function cleanStatementLines(text: string) {
  return text
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter((line) => line.length > 0)
    .filter((line) => !HEADER_PATTERNS.some((pattern) => pattern.test(line)));
}

function splitIntoTransactionBlocks(lines: string[]) {
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  for (const line of lines) {
    if (TRANSACTION_START_PATTERN.test(line)) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
      }
      currentBlock = [line];
      continue;
    }

    if (currentBlock.length > 0) {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
}

function matchCategory(
  direction: StatementTransaction["direction"],
  searchBlob: string,
  categoriesByName: Map<string, FinanceCategory>,
) {
  const matchedRule = CATEGORY_RULES.find((rule) => {
    if (
      rule.kind &&
      ((direction === "credit" && rule.kind !== "income") ||
        (direction === "debit" && rule.kind !== "expense"))
    ) {
      return false;
    }

    return rule.keywords.some((keyword) => searchBlob.includes(keyword));
  });

  if (!matchedRule) {
    return {
      matchedCategoryName: null,
      suggestedCategoryKind: direction === "credit" ? ("income" as const) : ("expense" as const),
      confidenceScore: 0.2,
      reviewStatus: "needs_review" as const,
    };
  }

  const category = categoriesByName.get(matchedRule.category.toLowerCase());
  return {
    matchedCategoryName: matchedRule.category,
    suggestedCategoryKind: matchedRule.kind ?? (direction === "credit" ? ("income" as const) : ("expense" as const)),
    confidenceScore: matchedRule.confidence,
    reviewStatus: category ? ("categorized" as const) : ("needs_review" as const),
  };
}

function parseTransactionBlock(
  block: string[],
  categoriesByName: Map<string, FinanceCategory>,
): ParsedStatementTransaction | null {
  const headerMatch = block[0]?.match(TRANSACTION_START_PATTERN);
  if (!headerMatch) {
    return null;
  }

  const [, rawDate, rawCounterparty, rawAmount] = headerMatch;
  const signedAmount = parseBelgianAmount(rawAmount);
  const direction: StatementTransaction["direction"] = signedAmount < 0 ? "debit" : "credit";
  const message = getValueAfterLabel(block, "Mededeling");
  const accountHolder = getValueAfterLabel(block, "Kaarthouder");
  const paymentMethod = getPaymentMethod(block);
  const bookingDateValue = getValueAfterLabel(block, "Datum");
  const bookingDate = bookingDateValue?.match(/^(\d{2}-\d{2}-\d{4})/)?.[1] ?? rawDate;
  const description = (message ?? rawCounterparty).replace(/\s+/g, " ").trim();
  const counterparty = rawCounterparty.trim();
  const searchBlob = [counterparty, description, accountHolder, paymentMethod]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const categoryMatch = matchCategory(direction, searchBlob, categoriesByName);
  const noteParts = [
    paymentMethod ? `Method: ${paymentMethod}` : null,
    accountHolder ? `Cardholder: ${accountHolder}` : null,
    message && message !== description ? `Message: ${message}` : null,
  ].filter(Boolean);

  return {
    transaction_date: toIsoDate(rawDate),
    booking_date: toIsoDate(bookingDate),
    counterparty,
    description,
    amount: Math.abs(signedAmount),
    currency: "EUR",
    direction,
    review_status: categoryMatch.reviewStatus,
    confidence_score: categoryMatch.confidenceScore,
    source_row_key: `${toIsoDate(rawDate)}|${counterparty}|${signedAmount.toFixed(2)}`,
    notes: noteParts.length > 0 ? noteParts.join(" | ") : null,
    matchedCategoryName: categoryMatch.matchedCategoryName,
    suggestedCategoryKind: categoryMatch.suggestedCategoryKind,
  };
}

function extractPdfText(pdfBuffer: Buffer) {
  const tempDir = mkdtempSync(join(tmpdir(), "yumami-pdf-"));
  const pdfPath = join(tempDir, "statement.pdf");
  const scriptPath = join(process.cwd(), "scripts", "extract_pdf_text.py");

  try {
    writeFileSync(pdfPath, pdfBuffer);
    return execFileSync("python", [scriptPath, pdfPath], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function extractStatementPeriod(text: string) {
  const match = text.match(PERIOD_PATTERN);
  if (!match) {
    throw new Error("Yumami could not detect the statement period from this PDF yet.");
  }

  const [, periodStart, periodEnd] = match;
  return {
    periodStart: toIsoDate(periodStart),
    periodEnd: toIsoDate(periodEnd),
    statementMonth: getStatementMonth(periodEnd),
  };
}

export async function parseKbcStatementPdf(
  pdfBuffer: Buffer,
  categories: FinanceCategory[],
): Promise<ParsedStatementImport> {
  const text = extractPdfText(pdfBuffer);

  if (!text.includes("KBC") || !text.includes("Export KBC Touch")) {
    throw new Error(
      "This statement format is not supported yet. Yumami currently auto-reads KBC Touch exports.",
    );
  }

  const categoriesByName = new Map(
    categories.map((category) => [category.name.toLowerCase(), category]),
  );
  const period = extractStatementPeriod(text);
  const transactions = splitIntoTransactionBlocks(cleanStatementLines(text))
    .map((block) => parseTransactionBlock(block, categoriesByName))
    .filter((transaction): transaction is ParsedStatementTransaction => transaction !== null);

  return {
    ...period,
    transactions,
  };
}
