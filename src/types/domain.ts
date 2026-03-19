import type { Database, TaskStatus } from "@/types/database";

export type Household = Database["public"]["Tables"]["households"]["Row"];
export type HouseholdMember =
  Database["public"]["Tables"]["household_members"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];

export interface DashboardSummary {
  householdName: string;
  totalTasks: number;
  openTasks: number;
  upcomingTasks: number;
  nextCalendarEventLabel: string;
  financeReviewLabel: string;
  filesHubLabel: string;
}

export interface TaskDraft {
  title: string;
  notes?: string;
  assignedToUserId?: string | null;
  dueAt?: string | null;
  status?: TaskStatus;
}
