"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseKbcStatementPdf } from "@/lib/yumami/statement-parser";
import { syncStatementImportCounters } from "@/lib/yumami/finance";
import { getHouseholdContextForActions } from "@/lib/yumami/tasks";
import type { FinanceCategory, MerchantCategoryRule } from "@/types/domain";

function revalidateFinanceRoutes() {
  revalidatePath("/");
  revalidatePath("/finance");
  revalidatePath("/finance/imports");
  revalidatePath("/finance/categories");
  revalidatePath("/finance/review");
}

function normalizeMerchant(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

async function upsertMerchantRule(
  householdId: string,
  userId: string,
  financeCategoryId: string,
  merchant: string | null | undefined,
) {
  const normalizedMerchant = normalizeMerchant(merchant);
  if (!normalizedMerchant) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.from("merchant_category_rules").upsert(
    {
      household_id: householdId,
      finance_category_id: financeCategoryId,
      normalized_merchant: normalizedMerchant,
      created_by_user_id: userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "household_id,normalized_merchant" },
  );
}

export interface StatementImportFormState {
  status: "idle" | "success" | "error";
  message: string;
}

export interface FinanceCategoryFormState {
  status: "idle" | "success" | "error";
  message: string;
}

export interface TransactionFormState {
  status: "idle" | "success" | "error";
  message: string;
}

const createStatementImportSchema = z.object({
  institutionLabel: z.string().trim().min(1).max(120),
  sourceFileName: z.string().trim().min(1).max(200),
  mimeType: z.string().trim().optional(),
  notes: z.string().trim().max(280).optional(),
});

const createFinanceCategorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  kind: z.enum(["income", "expense"]),
});

const createCategoryFromSuggestionSchema = z.object({
  transactionId: z.string().uuid(),
  statementImportId: z.string().uuid(),
  suggestedCategoryName: z.string().trim().min(1).max(80),
  suggestedCategoryKind: z.enum(["income", "expense"]),
});

const createCategoryFromCustomSchema = z.object({
  transactionId: z.string().uuid(),
  statementImportId: z.string().uuid(),
  categoryName: z.string().trim().min(1).max(80),
  categoryKind: z.enum(["income", "expense"]),
});
const createTransactionSchema = z.object({
  statementImportId: z.string().uuid(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  counterparty: z.string().trim().max(120).optional(),
  description: z.string().trim().min(1).max(180),
  amount: z.coerce.number().positive(),
  direction: z.enum(["debit", "credit"]),
  financeCategoryId: z.string().uuid().optional().or(z.literal("")),
  notes: z.string().trim().max(280).optional(),
});

const updateTransactionSchema = z.object({
  transactionId: z.string().uuid(),
  statementImportId: z.string().uuid(),
  financeCategoryId: z.string().uuid().optional().or(z.literal("")),
});

export async function createStatementImportAction(
  _previousState: StatementImportFormState,
  formData: FormData,
): Promise<StatementImportFormState> {
  const fileField = formData.get("statementFile");
  const fileName =
    typeof fileField === "object" && fileField && "name" in fileField
      ? String(fileField.name)
      : typeof formData.get("sourceFileName") === "string"
        ? String(formData.get("sourceFileName"))
        : "";
  const mimeType =
    typeof fileField === "object" && fileField && "type" in fileField
      ? String(fileField.type)
      : "application/pdf";
  const isFileUpload =
    typeof fileField === "object" &&
    fileField !== null &&
    "arrayBuffer" in fileField &&
    typeof fileField.arrayBuffer === "function";

  const parsed = createStatementImportSchema.safeParse({
    institutionLabel: formData.get("institutionLabel"),
    sourceFileName: fileName,
    mimeType,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Add a bank label and PDF file before importing a statement.",
    };
  }

  if (!isFileUpload) {
    return {
      status: "error",
      message: "Choose a PDF file so Yumami can read the statement lines automatically.",
    };
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return {
        status: "error",
        message:
          "A signed-in household member is required before real statement imports can be created.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const [categoryResult, ruleResult] = await Promise.all([
      supabase
        .from("finance_categories")
        .select("*")
        .eq("household_id", householdContext.householdId)
        .is("archived_at", null)
        .order("kind", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("merchant_category_rules")
        .select("*")
        .eq("household_id", householdContext.householdId),
    ]);

    if (categoryResult.error || ruleResult.error) {
      return {
        status: "error",
        message:
          categoryResult.error?.message ??
          ruleResult.error?.message ??
          "Finance setup could not be loaded.",
      };
    }

    const categories = (categoryResult.data ?? []) as FinanceCategory[];
    const merchantRules = (ruleResult.data ?? []) as MerchantCategoryRule[];
    const pdfBytes = Buffer.from(await fileField.arrayBuffer());
    const parsedStatement = await parseKbcStatementPdf(pdfBytes, categories);

    if (parsedStatement.transactions.length === 0) {
      return {
        status: "error",
        message: "The PDF was uploaded, but Yumami could not find any transaction rows in it.",
      };
    }

    const insertImportResult = await supabase
      .from("statement_imports")
      .insert({
        household_id: householdContext.householdId,
        created_by_user_id: householdContext.userId,
        institution_label: parsed.data.institutionLabel,
        statement_month: parsedStatement.statementMonth,
        source_file_name: parsed.data.sourceFileName,
        mime_type: parsed.data.mimeType || null,
        parser_status: "queued",
        transaction_count: 0,
        review_needed_count: 0,
        notes:
          [
            parsed.data.notes || null,
            `Detected period: ${parsedStatement.periodStart} to ${parsedStatement.periodEnd}.`,
          ]
            .filter(Boolean)
            .join(" ") || null,
        archived_at: null,
      })
      .select("id")
      .single();

    if (insertImportResult.error || !insertImportResult.data) {
      return {
        status: "error",
        message: insertImportResult.error?.message ?? "The statement import could not be created.",
      };
    }

    const statementImportId = insertImportResult.data.id;
    const categoryMap = new Map(categories.map((category) => [category.name.toLowerCase(), category]));
    const ruleMap = new Map(merchantRules.map((rule) => [rule.normalized_merchant, rule.finance_category_id]));

    const transactionInsertResult = await supabase.from("statement_transactions").insert(
      parsedStatement.transactions.map((transaction) => {
        const learnedCategoryId = ruleMap.get(normalizeMerchant(transaction.counterparty));
        const suggestedCategory = transaction.matchedCategoryName
          ? categoryMap.get(transaction.matchedCategoryName.toLowerCase())
          : null;
        const financeCategoryId = learnedCategoryId ?? suggestedCategory?.id ?? null;
        const reviewStatus = financeCategoryId ? ("categorized" as const) : ("needs_review" as const);

        return {
          household_id: householdContext.householdId,
          statement_import_id: statementImportId,
          finance_category_id: financeCategoryId,
          transaction_date: transaction.transaction_date,
          booking_date: transaction.booking_date,
          counterparty: transaction.counterparty,
          description: transaction.description,
          amount: transaction.amount,
          currency: transaction.currency,
          direction: transaction.direction,
          review_status: reviewStatus,
          confidence_score: transaction.confidence_score,
          source_row_key: transaction.source_row_key,
          notes: transaction.notes,
          suggested_category_name: transaction.matchedCategoryName,
          suggested_category_kind: transaction.suggestedCategoryKind,
        };
      }),
    );

    if (transactionInsertResult.error) {
      await supabase
        .from("statement_imports")
        .delete()
        .eq("id", statementImportId)
        .eq("household_id", householdContext.householdId);

      revalidateFinanceRoutes();
      return {
        status: "error",
        message: transactionInsertResult.error.message,
      };
    }

    await syncStatementImportCounters(statementImportId, householdContext.householdId);

    const reviewCount = parsedStatement.transactions.filter((transaction) => {
      const learnedCategoryId = ruleMap.get(normalizeMerchant(transaction.counterparty));
      const suggestedCategory = transaction.matchedCategoryName
        ? categoryMap.get(transaction.matchedCategoryName.toLowerCase())
        : null;
      return !(learnedCategoryId ?? suggestedCategory?.id);
    }).length;

    await supabase
      .from("statement_imports")
      .update({
        parser_status: reviewCount > 0 ? "manual_review" : "parsed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", statementImportId)
      .eq("household_id", householdContext.householdId);

    revalidateFinanceRoutes();

    return {
      status: "success",
      message:
        reviewCount > 0
          ? `Statement imported for ${parsedStatement.periodStart} to ${parsedStatement.periodEnd}. Yumami read ${parsedStatement.transactions.length} transactions and left ${reviewCount} for review.`
          : `Statement imported for ${parsedStatement.periodStart} to ${parsedStatement.periodEnd}. Yumami read and categorized ${parsedStatement.transactions.length} transactions automatically.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Supabase is not configured yet. Connect the project to save live statement imports.",
    };
  }
}

export async function deleteStatementImportAction(formData: FormData) {
  try {
    const importId = formData.get("importId");
    const householdContext = await getHouseholdContextForActions();

    if (typeof importId !== "string" || !householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("statement_imports")
      .delete()
      .eq("id", importId)
      .eq("household_id", householdContext.householdId);

    revalidateFinanceRoutes();
  } catch {
    return;
  }
}

export async function createFinanceCategoryAction(
  _previousState: FinanceCategoryFormState,
  formData: FormData,
): Promise<FinanceCategoryFormState> {
  const parsed = createFinanceCategorySchema.safeParse({
    name: formData.get("name"),
    kind: formData.get("kind"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Add a category name and choose whether it belongs to income or expenses.",
    };
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return {
        status: "error",
        message:
          "A signed-in household member is required before live finance categories can be created.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("finance_categories").insert({
      household_id: householdContext.householdId,
      created_by_user_id: householdContext.userId,
      name: parsed.data.name,
      kind: parsed.data.kind,
      archived_at: null,
    });

    if (error) {
      return {
        status: "error",
        message: error.code === "23505" ? "That category already exists for this household." : error.message,
      };
    }

    revalidateFinanceRoutes();
    return {
      status: "success",
      message: "Finance category added.",
    };
  } catch {
    return {
      status: "error",
      message: "Supabase is not configured yet. Connect the project to save live finance categories.",
    };
  }
}

export async function archiveFinanceCategoryAction(formData: FormData) {
  try {
    const categoryId = formData.get("categoryId");
    const householdContext = await getHouseholdContextForActions();

    if (typeof categoryId !== "string" || !householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("finance_categories")
      .update({
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", categoryId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    revalidateFinanceRoutes();
  } catch {
    return;
  }
}

export async function archiveAllFinanceCategoriesAction() {
  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("finance_categories")
      .update({ archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    revalidateFinanceRoutes();
  } catch {
    return;
  }
}

export async function createCategoryFromSuggestionAction(formData: FormData) {
  const parsed = createCategoryFromSuggestionSchema.safeParse({
    transactionId: formData.get("transactionId"),
    statementImportId: formData.get("statementImportId"),
    suggestedCategoryName: formData.get("suggestedCategoryName"),
    suggestedCategoryKind: formData.get("suggestedCategoryKind"),
  });

  if (!parsed.success) {
    return;
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    let categoryId: string | null = null;

    const existing = await supabase
      .from("finance_categories")
      .select("id")
      .eq("household_id", householdContext.householdId)
      .ilike("name", parsed.data.suggestedCategoryName)
      .is("archived_at", null)
      .maybeSingle();

    if (existing.data?.id) {
      categoryId = existing.data.id;
    } else {
      const inserted = await supabase
        .from("finance_categories")
        .insert({
          household_id: householdContext.householdId,
          created_by_user_id: householdContext.userId,
          name: parsed.data.suggestedCategoryName,
          kind: parsed.data.suggestedCategoryKind,
          archived_at: null,
        })
        .select("id")
        .single();
      categoryId = inserted.data?.id ?? null;
    }

    if (!categoryId) {
      return;
    }

    const transactionResult = await supabase
      .from("statement_transactions")
      .select("counterparty")
      .eq("id", parsed.data.transactionId)
      .eq("household_id", householdContext.householdId)
      .maybeSingle();

    await supabase
      .from("statement_transactions")
      .update({
        finance_category_id: categoryId,
        review_status: "categorized",
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.transactionId)
      .eq("household_id", householdContext.householdId);

    await upsertMerchantRule(
      householdContext.householdId,
      householdContext.userId,
      categoryId,
      transactionResult.data?.counterparty,
    );
    await syncStatementImportCounters(parsed.data.statementImportId, householdContext.householdId);
    revalidateFinanceRoutes();
  } catch {
    return;
  }
}

export async function createCategoryFromCustomAction(formData: FormData) {
  const parsed = createCategoryFromCustomSchema.safeParse({
    transactionId: formData.get("transactionId"),
    statementImportId: formData.get("statementImportId"),
    categoryName: formData.get("categoryName"),
    categoryKind: formData.get("categoryKind"),
  });

  if (!parsed.success) {
    return;
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    let categoryId: string | null = null;

    const existing = await supabase
      .from("finance_categories")
      .select("id")
      .eq("household_id", householdContext.householdId)
      .ilike("name", parsed.data.categoryName)
      .is("archived_at", null)
      .maybeSingle();

    if (existing.data?.id) {
      categoryId = existing.data.id;
    } else {
      const inserted = await supabase
        .from("finance_categories")
        .insert({
          household_id: householdContext.householdId,
          created_by_user_id: householdContext.userId,
          name: parsed.data.categoryName,
          kind: parsed.data.categoryKind,
          archived_at: null,
        })
        .select("id")
        .single();
      categoryId = inserted.data?.id ?? null;
    }

    if (!categoryId) {
      return;
    }

    const transactionResult = await supabase
      .from("statement_transactions")
      .select("counterparty")
      .eq("id", parsed.data.transactionId)
      .eq("household_id", householdContext.householdId)
      .maybeSingle();

    await supabase
      .from("statement_transactions")
      .update({
        finance_category_id: categoryId,
        review_status: "categorized",
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.transactionId)
      .eq("household_id", householdContext.householdId);

    await upsertMerchantRule(
      householdContext.householdId,
      householdContext.userId,
      categoryId,
      transactionResult.data?.counterparty,
    );
    await syncStatementImportCounters(parsed.data.statementImportId, householdContext.householdId);
    revalidateFinanceRoutes();
  } catch {
    return;
  }
}
export async function createTransactionAction(
  _previousState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const parsed = createTransactionSchema.safeParse({
    statementImportId: formData.get("statementImportId"),
    transactionDate: formData.get("transactionDate"),
    bookingDate: formData.get("bookingDate") || "",
    counterparty: formData.get("counterparty") || undefined,
    description: formData.get("description"),
    amount: formData.get("amount"),
    direction: formData.get("direction"),
    financeCategoryId: formData.get("financeCategoryId") || "",
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Add the import, date, description, and a positive amount before saving a transaction.",
    };
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return {
        status: "error",
        message: "A signed-in household member is required before saving live transactions.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const reviewStatus = parsed.data.financeCategoryId ? "categorized" : "needs_review";
    const { error } = await supabase.from("statement_transactions").insert({
      household_id: householdContext.householdId,
      statement_import_id: parsed.data.statementImportId,
      finance_category_id: parsed.data.financeCategoryId || null,
      transaction_date: parsed.data.transactionDate,
      booking_date: parsed.data.bookingDate || null,
      counterparty: parsed.data.counterparty || null,
      description: parsed.data.description,
      amount: parsed.data.amount,
      direction: parsed.data.direction,
      review_status: reviewStatus,
      currency: "EUR",
      notes: parsed.data.notes || null,
      suggested_category_name: null,
      suggested_category_kind: parsed.data.direction === "credit" ? "income" : "expense",
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    if (parsed.data.financeCategoryId) {
      await upsertMerchantRule(
        householdContext.householdId,
        householdContext.userId,
        parsed.data.financeCategoryId,
        parsed.data.counterparty,
      );
    }

    await syncStatementImportCounters(parsed.data.statementImportId, householdContext.householdId);
    revalidateFinanceRoutes();

    return {
      status: "success",
      message: reviewStatus === "categorized" ? "Transaction saved and categorized." : "Transaction saved for review.",
    };
  } catch {
    return {
      status: "error",
      message: "Supabase is not configured yet. Connect the project to save live transactions.",
    };
  }
}

export async function updateTransactionReviewAction(formData: FormData) {
  const parsed = updateTransactionSchema.safeParse({
    transactionId: formData.get("transactionId"),
    statementImportId: formData.get("statementImportId"),
    financeCategoryId: formData.get("financeCategoryId") || "",
  });

  if (!parsed.success) {
    return;
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return;
    }

    const nextReviewStatus = parsed.data.financeCategoryId ? "categorized" : "needs_review";

    const supabase = await createSupabaseServerClient();
    const transactionResult = await supabase
      .from("statement_transactions")
      .select("counterparty")
      .eq("id", parsed.data.transactionId)
      .eq("household_id", householdContext.householdId)
      .maybeSingle();

    await supabase
      .from("statement_transactions")
      .update({
        finance_category_id: parsed.data.financeCategoryId || null,
        review_status: nextReviewStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.transactionId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    if (parsed.data.financeCategoryId) {
      await upsertMerchantRule(
        householdContext.householdId,
        householdContext.userId,
        parsed.data.financeCategoryId,
        transactionResult.data?.counterparty,
      );
    }

    await syncStatementImportCounters(parsed.data.statementImportId, householdContext.householdId);
    revalidateFinanceRoutes();
  } catch {
    return;
  }
}

export async function archiveTransactionAction(formData: FormData) {
  try {
    const transactionId = formData.get("transactionId");
    const statementImportId = formData.get("statementImportId");
    const householdContext = await getHouseholdContextForActions();

    if (typeof transactionId !== "string" || typeof statementImportId !== "string" || !householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("statement_transactions")
      .update({
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", transactionId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

    await syncStatementImportCounters(statementImportId, householdContext.householdId);
    revalidateFinanceRoutes();
  } catch {
    return;
  }
}



