export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskArchivedReason =
  | "completed"
  | "dismissed"
  | "cancelled"
  | "duplicate"
  | "other";
export type ParserStatus = "queued" | "parsed" | "manual_review" | "failed";
export type FinanceCategoryKind = "income" | "expense";
export type TransactionDirection = "debit" | "credit";
export type TransactionReviewStatus = "pending" | "categorized" | "needs_review";
export type HouseholdInviteStatus = "pending" | "accepted" | "revoked" | "expired";
export type CalendarProvider = "icloud" | "google" | "outlook" | "other";
export type CalendarSourceKind = "manual" | "linked";

type HouseholdRow = {
  id: string;
  name: string;
  created_at: string;
};

type HouseholdMemberRow = {
  id: string;
  household_id: string;
  user_id: string;
  role: "owner" | "member";
  display_name: string | null;
  created_at: string;
};

type HouseholdInviteRow = {
  id: string;
  household_id: string;
  invited_by_user_id: string;
  invited_email: string;
  role: "owner" | "member";
  token: string;
  status: HouseholdInviteStatus;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

type TaskRow = {
  id: string;
  household_id: string;
  created_by_user_id: string;
  assigned_to_user_id: string | null;
  title: string;
  notes: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_at: string | null;
  completed_at: string | null;
  archived_at: string | null;
  archived_reason: TaskArchivedReason | null;
  created_at: string;
  updated_at: string;
};

type FileLinkRow = {
  id: string;
  household_id: string;
  created_by_user_id: string;
  label: string;
  url: string;
  description: string | null;
  category: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type StatementImportRow = {
  id: string;
  household_id: string;
  created_by_user_id: string;
  institution_label: string;
  statement_month: string;
  source_file_name: string;
  mime_type: string | null;
  parser_status: ParserStatus;
  transaction_count: number;
  review_needed_count: number;
  notes: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type FinanceCategoryRow = {
  id: string;
  household_id: string;
  created_by_user_id: string;
  name: string;
  kind: FinanceCategoryKind;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type MerchantCategoryRuleRow = {
  id: string;
  household_id: string;
  finance_category_id: string;
  normalized_merchant: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
};

type StatementTransactionRow = {
  id: string;
  household_id: string;
  statement_import_id: string;
  finance_category_id: string | null;
  transaction_date: string;
  booking_date: string | null;
  counterparty: string | null;
  description: string;
  amount: number;
  currency: string;
  direction: TransactionDirection;
  review_status: TransactionReviewStatus;
  confidence_score: number | null;
  source_row_key: string | null;
  notes: string | null;
  suggested_category_name: string | null;
  suggested_category_kind: FinanceCategoryKind | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type HouseholdCalendarRow = {
  id: string;
  household_id: string;
  created_by_user_id: string;
  label: string;
  provider: CalendarProvider;
  url: string | null;
  color_token: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type CalendarEventRow = {
  id: string;
  household_id: string;
  household_calendar_id: string | null;
  created_by_user_id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  notes: string | null;
  source_kind: CalendarSourceKind;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      households: {
        Row: HouseholdRow;
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      household_members: {
        Row: HouseholdMemberRow;
        Insert: {
          id?: string;
          household_id: string;
          user_id: string;
          role?: "owner" | "member";
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          user_id?: string;
          role?: "owner" | "member";
          display_name?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      household_invites: {
        Row: HouseholdInviteRow;
        Insert: {
          id?: string;
          household_id: string;
          invited_by_user_id: string;
          invited_email: string;
          role?: "owner" | "member";
          token: string;
          status?: HouseholdInviteStatus;
          expires_at: string;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          invited_by_user_id?: string;
          invited_email?: string;
          role?: "owner" | "member";
          token?: string;
          status?: HouseholdInviteStatus;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "household_invites_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: TaskRow;
        Insert: {
          id?: string;
          household_id: string;
          created_by_user_id: string;
          assigned_to_user_id?: string | null;
          title: string;
          notes?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_at?: string | null;
          completed_at?: string | null;
          archived_at?: string | null;
          archived_reason?: TaskArchivedReason | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          created_by_user_id?: string;
          assigned_to_user_id?: string | null;
          title?: string;
          notes?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_at?: string | null;
          completed_at?: string | null;
          archived_at?: string | null;
          archived_reason?: TaskArchivedReason | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      file_links: {
        Row: FileLinkRow;
        Insert: {
          id?: string;
          household_id: string;
          created_by_user_id: string;
          label: string;
          url: string;
          description?: string | null;
          category?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          created_by_user_id?: string;
          label?: string;
          url?: string;
          description?: string | null;
          category?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "file_links_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      statement_imports: {
        Row: StatementImportRow;
        Insert: {
          id?: string;
          household_id: string;
          created_by_user_id: string;
          institution_label: string;
          statement_month: string;
          source_file_name: string;
          mime_type?: string | null;
          parser_status?: ParserStatus;
          transaction_count?: number;
          review_needed_count?: number;
          notes?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          created_by_user_id?: string;
          institution_label?: string;
          statement_month?: string;
          source_file_name?: string;
          mime_type?: string | null;
          parser_status?: ParserStatus;
          transaction_count?: number;
          review_needed_count?: number;
          notes?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "statement_imports_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      finance_categories: {
        Row: FinanceCategoryRow;
        Insert: {
          id?: string;
          household_id: string;
          created_by_user_id: string;
          name: string;
          kind: FinanceCategoryKind;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          created_by_user_id?: string;
          name?: string;
          kind?: FinanceCategoryKind;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "finance_categories_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      merchant_category_rules: {
        Row: MerchantCategoryRuleRow;
        Insert: {
          id?: string;
          household_id: string;
          finance_category_id: string;
          normalized_merchant: string;
          created_by_user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          finance_category_id?: string;
          normalized_merchant?: string;
          created_by_user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "merchant_category_rules_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "merchant_category_rules_finance_category_id_fkey";
            columns: ["finance_category_id"];
            isOneToOne: false;
            referencedRelation: "finance_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      statement_transactions: {
        Row: StatementTransactionRow;
        Insert: {
          id?: string;
          household_id: string;
          statement_import_id: string;
          finance_category_id?: string | null;
          transaction_date: string;
          booking_date?: string | null;
          counterparty?: string | null;
          description: string;
          amount: number;
          currency?: string;
          direction: TransactionDirection;
          review_status?: TransactionReviewStatus;
          confidence_score?: number | null;
          source_row_key?: string | null;
          notes?: string | null;
          suggested_category_name?: string | null;
          suggested_category_kind?: FinanceCategoryKind | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          statement_import_id?: string;
          finance_category_id?: string | null;
          transaction_date?: string;
          booking_date?: string | null;
          counterparty?: string | null;
          description?: string;
          amount?: number;
          currency?: string;
          direction?: TransactionDirection;
          review_status?: TransactionReviewStatus;
          confidence_score?: number | null;
          source_row_key?: string | null;
          notes?: string | null;
          suggested_category_name?: string | null;
          suggested_category_kind?: FinanceCategoryKind | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "statement_transactions_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "statement_transactions_statement_import_id_fkey";
            columns: ["statement_import_id"];
            isOneToOne: false;
            referencedRelation: "statement_imports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "statement_transactions_finance_category_id_fkey";
            columns: ["finance_category_id"];
            isOneToOne: false;
            referencedRelation: "finance_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      household_calendars: {
        Row: HouseholdCalendarRow;
        Insert: {
          id?: string;
          household_id: string;
          created_by_user_id: string;
          label: string;
          provider: CalendarProvider;
          url?: string | null;
          color_token?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          created_by_user_id?: string;
          label?: string;
          provider?: CalendarProvider;
          url?: string | null;
          color_token?: string | null;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "household_calendars_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          }
        ];
      };
      calendar_events: {
        Row: CalendarEventRow;
        Insert: {
          id?: string;
          household_id: string;
          household_calendar_id?: string | null;
          created_by_user_id: string;
          title: string;
          starts_at: string;
          ends_at?: string | null;
          location?: string | null;
          notes?: string | null;
          source_kind?: CalendarSourceKind;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          household_calendar_id?: string | null;
          created_by_user_id?: string;
          title?: string;
          starts_at?: string;
          ends_at?: string | null;
          location?: string | null;
          notes?: string | null;
          source_kind?: CalendarSourceKind;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_household_calendar_id_fkey";
            columns: ["household_calendar_id"];
            isOneToOne: false;
            referencedRelation: "household_calendars";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
