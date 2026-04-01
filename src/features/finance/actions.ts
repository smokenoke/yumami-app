"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { syncStatementImportCounters } from "@/lib/yumami/finance";
import { getHouseholdContextForActions } from "@/lib/yumami/tasks";

function revalidateFinanceRoutes() {
  revalidatePath("/");
  revalidatePath("/finance");
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
  statementMonth: z.string().regex(/^\d{4}-\d{2}$/),
  sourceFileName: z.string().trim().min(1).max(200),
  mimeType: z.string().trim().optional(),
  notes: z.string().trim().max(280).optional(),
});

const createFinanceCategorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  kind: z.enum(["income", "expense"]),
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
  reviewStatus: z.enum(["pending", "categorized", "needs_review"]),
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

  const parsed = createStatementImportSchema.safeParse({
    institutionLabel: formData.get("institutionLabel"),
    statementMonth: formData.get("statementMonth"),
    sourceFileName: fileName,
    mimeType,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Add a bank label, statement month, and PDF file before creating an import entry.",
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
    const { error } = await supabase.from("statement_imports").insert({
      household_id: householdContext.householdId,
      created_by_user_id: householdContext.userId,
      institution_label: parsed.data.institutionLabel,
      statement_month: `${parsed.data.statementMonth}-01`,
      source_file_name: parsed.data.sourceFileName,
      mime_type: parsed.data.mimeType || null,
      parser_status: "queued",
      transaction_count: 0,
      review_needed_count: 0,
      notes: parsed.data.notes || null,
      archived_at: null,
    });

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    revalidateFinanceRoutes();

    return {
      status: "success",
      message: "Statement import created. It is now ready for transaction review and later parser support.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Connect the project to save live statement imports.",
    };
  }
}

export async function archiveStatementImportAction(formData: FormData) {
  try {
    const importId = formData.get("importId");
    const householdContext = await getHouseholdContextForActions();

    if (typeof importId !== "string" || !householdContext) {
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase
      .from("statement_imports")
      .update({
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", importId)
      .eq("household_id", householdContext.householdId)
      .is("archived_at", null);

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
        message:
          error.code === "23505"
            ? "That category already exists for this household."
            : error.message,
      };
    }

    revalidateFinanceRoutes();

    return {
      status: "success",
      message: "Finance category added. You can now map future statement lines into it.",
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
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    await syncStatementImportCounters(parsed.data.statementImportId, householdContext.householdId);
    revalidateFinanceRoutes();

    return {
      status: "success",
      message: reviewStatus === "categorized"
        ? "Transaction saved and categorized."
        : "Transaction saved and flagged for review.",
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
    reviewStatus: formData.get("reviewStatus"),
  });

  if (!parsed.success) {
    return;
  }

  try {
    const householdContext = await getHouseholdContextForActions();
    if (!householdContext) {
      return;
    }

    const nextReviewStatus = parsed.data.financeCategoryId
      ? parsed.data.reviewStatus === "pending"
        ? "categorized"
        : parsed.data.reviewStatus
      : parsed.data.reviewStatus === "categorized"
        ? "needs_review"
        : parsed.data.reviewStatus;

    const supabase = await createSupabaseServerClient();
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

    if (
      typeof transactionId !== "string" ||
      typeof statementImportId !== "string" ||
      !householdContext
    ) {
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



