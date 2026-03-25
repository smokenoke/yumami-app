import type { Database, TaskStatus } from "@/types/database";

export type Household = Database["public"]["Tables"]["households"]["Row"];
export type HouseholdMember =
  Database["public"]["Tables"]["household_members"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type FileLink = Database["public"]["Tables"]["file_links"]["Row"];
export type StatementImport = Database["public"]["Tables"]["statement_imports"]["Row"];
export type FinanceCategory = Database["public"]["Tables"]["finance_categories"]["Row"];
export type StatementTransaction =
  Database["public"]["Tables"]["statement_transactions"]["Row"];
export type HouseholdCalendar = Database["public"]["Tables"]["household_calendars"]["Row"];
export type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];

export interface DashboardSummary {
  householdName: string;
  totalTasks: number;
  openTasks: number;
  upcomingTasks: number;
  nextCalendarEventLabel: string;
  financeReviewLabel: string;
  filesHubLabel: string;
}

export interface FinanceMonthlyRollup {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  net: number;
  reviewCount: number;
  categorizedCount: number;
  uncategorizedCount: number;
  topCategories: Array<{
    name: string;
    total: number;
  }>;
}

export interface TaskDraft {
  title: string;
  notes?: string;
  assignedToUserId?: string | null;
  dueAt?: string | null;
  status?: TaskStatus;
}

export interface TaskWorkspace {
  mode: "demo" | "live";
  householdName: string;
  tasks: Task[];
  canMutate: boolean;
  statusMessage: string;
}

export interface FileWorkspace {
  mode: "demo" | "live";
  householdName: string;
  files: FileLink[];
  canMutate: boolean;
  statusMessage: string;
}

export interface FinanceWorkspace {
  mode: "demo" | "live";
  householdName: string;
  imports: StatementImport[];
  categories: FinanceCategory[];
  transactions: StatementTransaction[];
  rollups: FinanceMonthlyRollup[];
  canMutate: boolean;
  statusMessage: string;
}

export interface CalendarWorkspace {
  mode: "demo" | "live";
  householdName: string;
  calendars: HouseholdCalendar[];
  events: CalendarEvent[];
  canMutate: boolean;
  statusMessage: string;
}
