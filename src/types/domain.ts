import type { Database, TaskPriority, TaskStatus } from "@/types/database";

export type Household = Database["public"]["Tables"]["households"]["Row"];
export type HouseholdMember =
  Database["public"]["Tables"]["household_members"]["Row"];
export type HouseholdInvite =
  Database["public"]["Tables"]["household_invites"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type FileLink = Database["public"]["Tables"]["file_links"]["Row"];
export type StatementImport = Database["public"]["Tables"]["statement_imports"]["Row"];
export type FinanceCategory = Database["public"]["Tables"]["finance_categories"]["Row"];
export type MerchantCategoryRule = Database["public"]["Tables"]["merchant_category_rules"]["Row"];
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
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface HouseholdParticipant {
  userId: string;
  displayName: string;
  role: HouseholdMember["role"];
}

export interface HouseholdMembershipOption {
  householdId: string;
  householdName: string;
  role: HouseholdMember["role"];
  displayName: string | null;
}

export interface PendingHouseholdInvite {
  inviteId: string;
  householdId: string;
  householdName: string;
  invitedEmail: string;
  role: HouseholdInvite["role"];
  token: string;
  status: HouseholdInvite["status"];
  expiresAt: string;
  isEligible: boolean;
  isExpired: boolean;
}

export interface ViewerHouseholdState {
  memberships: HouseholdMembershipOption[];
  activeHousehold: HouseholdMembershipOption | null;
  pendingInvite: PendingHouseholdInvite | null;
  needsOnboarding: boolean;
  needsHouseholdSelection: boolean;
}

export interface HouseholdSettingsMember {
  userId: string;
  displayName: string;
  role: HouseholdMember["role"];
  createdAt: string;
}

export interface HouseholdSettingsInvite {
  inviteId: string;
  invitedEmail: string;
  role: HouseholdInvite["role"];
  status: HouseholdInvite["status"];
  expiresAt: string;
  acceptedAt: string | null;
}

export interface TaskWorkspace {
  mode: "demo" | "live";
  householdName: string;
  tasks: Task[];
  archivedTasks: Task[];
  members: HouseholdParticipant[];
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
  merchantRules: MerchantCategoryRule[];
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
