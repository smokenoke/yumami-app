import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getHouseholdContextForActions } from "@/lib/yumami/tasks";
import type {
  FinanceCategory,
  FinanceMonthlyRollup,
  FinanceWorkspace,
  StatementImport,
  StatementTransaction,
} from "@/types/domain";

const demoImports: StatementImport[] = [
  {
    id: "demo-import-1",
    household_id: "demo-household",
    created_by_user_id: "demo-user",
    institution_label: "KBC Shared",
    statement_month: "2026-02-01",
    source_file_name: "260201-260228.pdf",
    mime_type: "application/pdf",
    parser_status: "manual_review",
    transaction_count: 8,
    review_needed_count: 2,
    notes: "Example statement import based on your monthly workflow.",
    archived_at: null,
    created_at: "2026-03-22T10:00:00.000Z",
    updated_at: "2026-03-22T10:00:00.000Z",
  },
];

const defaultHouseholdCategories = [
  { name: "Input Maxim", kind: "income" },
  { name: "Input Yuxi", kind: "income" },
  { name: "Teruggave vrienden", kind: "income" },
  { name: "Teruggave Pidpa", kind: "income" },
  { name: "Huur", kind: "expense" },
  { name: "Apartment verzekering", kind: "expense" },
  { name: "Elektriciteit Bolt", kind: "expense" },
  { name: "Pidpa", kind: "expense" },
  { name: "Telecom", kind: "expense" },
  { name: "Boodschappen", kind: "expense" },
  { name: "Uiteten", kind: "expense" },
  { name: "Uitgaan", kind: "expense" },
  { name: "Meubelen", kind: "expense" },
  { name: "Sporten", kind: "expense" },
  { name: "Shoppen", kind: "expense" },
  { name: "TV abonnementen", kind: "expense" },
  { name: "Provinciebelasting?", kind: "expense" },
  { name: "Boete", kind: "expense" },
  { name: "Cadeaus", kind: "expense" },
  { name: "KBC plusrekening", kind: "expense" },
  { name: "Vakantie totaal", kind: "expense" },
  { name: "Parking", kind: "expense" },
  { name: "Totaal boodschappen met Edenred", kind: "expense" },
] as const satisfies ReadonlyArray<{ name: string; kind: FinanceCategory["kind"] }>;

const demoCategories: FinanceCategory[] = defaultHouseholdCategories.map((category, index) => ({
  id: `demo-category-${index + 1}`,
  household_id: "demo-household",
  created_by_user_id: "demo-user",
  name: category.name,
  kind: category.kind,
  archived_at: null,
  created_at: "2026-03-23T09:00:00.000Z",
  updated_at: "2026-03-23T09:00:00.000Z",
}));

function findDemoCategoryId(name: string) {
  return demoCategories.find((category) => category.name === name)?.id ?? null;
}

const demoTransactions: StatementTransaction[] = [
  {
    id: "demo-tx-1",
    household_id: "demo-household",
    statement_import_id: "demo-import-1",
    finance_category_id: findDemoCategoryId("Huur"),
    transaction_date: "2026-02-01",
    booking_date: "2026-02-01",
    counterparty: "Landlord",
    description: "Monthly rent",
    amount: 1035,
    currency: "EUR",
    direction: "debit",
    review_status: "categorized",
    confidence_score: 1,
    source_row_key: null,
    notes: null,
    archived_at: null,
    created_at: "2026-03-23T09:10:00.000Z",
    updated_at: "2026-03-23T09:10:00.000Z",
  },
  {
    id: "demo-tx-2",
    household_id: "demo-household",
    statement_import_id: "demo-import-1",
    finance_category_id: findDemoCategoryId("Input Maxim"),
    transaction_date: "2026-02-03",
    booking_date: "2026-02-03",
    counterparty: "Maxim",
    description: "Household contribution",
    amount: 2100,
    currency: "EUR",
    direction: "credit",
    review_status: "categorized",
    confidence_score: 1,
    source_row_key: null,
    notes: null,
    archived_at: null,
    created_at: "2026-03-23T09:11:00.000Z",
    updated_at: "2026-03-23T09:11:00.000Z",
  },
  {
    id: "demo-tx-3",
    household_id: "demo-household",
    statement_import_id: "demo-import-1",
    finance_category_id: findDemoCategoryId("Boodschappen"),
    transaction_date: "2026-02-07",
    booking_date: "2026-02-07",
    counterparty: "Albert Heijn",
    description: "Groceries",
    amount: 142.45,
    currency: "EUR",
    direction: "debit",
    review_status: "categorized",
    confidence_score: 0.9,
    source_row_key: null,
    notes: null,
    archived_at: null,
    created_at: "2026-03-23T09:12:00.000Z",
    updated_at: "2026-03-23T09:12:00.000Z",
  },
  {
    id: "demo-tx-4",
    household_id: "demo-household",
    statement_import_id: "demo-import-1",
    finance_category_id: null,
    transaction_date: "2026-02-10",
    booking_date: "2026-02-10",
    counterparty: "Unknown merchant",
    description: "Card payment pending review",
    amount: 24.6,
    currency: "EUR",
    direction: "debit",
    review_status: "needs_review",
    confidence_score: 0.2,
    source_row_key: null,
    notes: "Needs manual category selection.",
    archived_at: null,
    created_at: "2026-03-23T09:13:00.000Z",
    updated_at: "2026-03-23T09:13:00.000Z",
  },
];

function buildFinanceRollups(
  imports: StatementImport[],
  transactions: StatementTransaction[],
  categories: FinanceCategory[],
): FinanceMonthlyRollup[] {
  const importMonthById = new Map(imports.map((item) => [item.id, item.statement_month.slice(0, 7)]));
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const monthMap = new Map<string, FinanceMonthlyRollup>();

  for (const transaction of transactions) {
    const month = importMonthById.get(transaction.statement_import_id) ?? transaction.transaction_date.slice(0, 7);
    const existing = monthMap.get(month) ?? {
      month,
      totalIncome: 0,
      totalExpenses: 0,
      net: 0,
      reviewCount: 0,
      categorizedCount: 0,
      uncategorizedCount: 0,
      topCategories: [],
    };

    const amount = Number(transaction.amount);
    if (transaction.direction === "credit") {
      existing.totalIncome += amount;
    } else {
      existing.totalExpenses += amount;
    }

    if (transaction.review_status === "categorized") {
      existing.categorizedCount += 1;
    } else if (transaction.review_status === "needs_review" || transaction.review_status === "pending") {
      existing.reviewCount += 1;
      if (!transaction.finance_category_id) {
        existing.uncategorizedCount += 1;
      }
    }

    const category = transaction.finance_category_id
      ? categoryMap.get(transaction.finance_category_id)?.name ?? "Unmapped"
      : "Unmapped";
    const existingCategory = existing.topCategories.find((item) => item.name === category);
    if (existingCategory) {
      existingCategory.total += amount;
    } else {
      existing.topCategories.push({ name: category, total: amount });
    }

    existing.net = existing.totalIncome - existing.totalExpenses;
    monthMap.set(month, existing);
  }

  return [...monthMap.values()]
    .map((rollup) => ({
      ...rollup,
      topCategories: [...rollup.topCategories].sort((a, b) => b.total - a.total).slice(0, 4),
    }))
    .sort((a, b) => b.month.localeCompare(a.month));
}

async function ensureDefaultFinanceCategories(householdId: string, userId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const existingCategoryResult = await supabase
    .from("finance_categories")
    .select("id")
    .eq("household_id", householdId)
    .limit(1);

  if (existingCategoryResult.error || (existingCategoryResult.data?.length ?? 0) > 0) {
    return;
  }

  await supabase.from("finance_categories").insert(
    defaultHouseholdCategories.map((category) => ({
      household_id: householdId,
      created_by_user_id: userId,
      name: category.name,
      kind: category.kind,
    })),
  );
}

export async function syncStatementImportCounters(statementImportId: string, householdId: string) {
  const supabase = await createSupabaseServerClient();
  const transactionResult = await supabase
    .from("statement_transactions")
    .select("review_status, finance_category_id")
    .eq("statement_import_id", statementImportId)
    .eq("household_id", householdId)
    .is("archived_at", null);

  if (transactionResult.error) {
    return;
  }

  const transactions = transactionResult.data ?? [];
  const transactionCount = transactions.length;
  const reviewNeededCount = transactions.filter(
    (transaction) =>
      transaction.review_status !== "categorized" || transaction.finance_category_id == null,
  ).length;

  const parserStatus = transactionCount === 0
    ? "queued"
    : reviewNeededCount > 0
      ? "manual_review"
      : "parsed";

  await supabase
    .from("statement_imports")
    .update({
      transaction_count: transactionCount,
      review_needed_count: reviewNeededCount,
      parser_status: parserStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", statementImportId)
    .eq("household_id", householdId);
}

export async function getFinanceWorkspace(): Promise<FinanceWorkspace> {
  try {
    const householdContext = await getHouseholdContextForActions();

    if (!householdContext) {
      return {
        mode: "demo",
        householdName: "Demo household",
        imports: demoImports,
        categories: demoCategories,
        transactions: demoTransactions,
        rollups: buildFinanceRollups(demoImports, demoTransactions, demoCategories),
        canMutate: false,
        statusMessage:
          "Attach a signed-in user to a household to track live statement imports, transactions, and finance categories.",
      };
    }

    await ensureDefaultFinanceCategories(householdContext.householdId, householdContext.userId);

    const supabase = await createSupabaseServerClient();
    const [importResult, categoryResult, transactionResult] = await Promise.all([
      supabase
        .from("statement_imports")
        .select("*")
        .eq("household_id", householdContext.householdId)
        .is("archived_at", null)
        .order("statement_month", { ascending: false }),
      supabase
        .from("finance_categories")
        .select("*")
        .eq("household_id", householdContext.householdId)
        .is("archived_at", null)
        .order("kind", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("statement_transactions")
        .select("*")
        .eq("household_id", householdContext.householdId)
        .is("archived_at", null)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);

    if (importResult.error || categoryResult.error || transactionResult.error) {
      return {
        mode: "demo",
        householdName: householdContext.householdName,
        imports: demoImports,
        categories: demoCategories,
        transactions: demoTransactions,
        rollups: buildFinanceRollups(demoImports, demoTransactions, demoCategories),
        canMutate: false,
        statusMessage:
          "The household was found, but live finance data could not be loaded yet. Demo finance data is shown instead.",
      };
    }

    const imports = (importResult.data ?? []) as StatementImport[];
    const categories = (categoryResult.data ?? []) as FinanceCategory[];
    const transactions = (transactionResult.data ?? []) as StatementTransaction[];

    return {
      mode: "live",
      householdName: householdContext.householdName,
      imports,
      categories,
      transactions,
      rollups: buildFinanceRollups(imports, transactions, categories),
      canMutate: true,
      statusMessage:
        "Live finance intake is active. Statement imports, transactions, and household categories now reflect your spreadsheet workflow and are ready for later parsing and monthly rollups.",
    };
  } catch {
    return {
      mode: "demo",
      householdName: "Demo household",
      imports: demoImports,
      categories: demoCategories,
      transactions: demoTransactions,
      rollups: buildFinanceRollups(demoImports, demoTransactions, demoCategories),
      canMutate: false,
      statusMessage:
        "Supabase is not configured yet, so Yumami is showing a safe demo finance intake flow.",
    };
  }
}
