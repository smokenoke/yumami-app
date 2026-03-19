import type { DashboardSummary } from "@/types/domain";

export const dashboardSeedSummary: DashboardSummary = {
  householdName: "Your shared household",
  totalTasks: 0,
  openTasks: 0,
  upcomingTasks: 0,
  nextCalendarEventLabel: "Calendar visibility will land after shared tasks.",
  financeReviewLabel: "Finance import starts with one bank PDF format.",
  filesHubLabel: "Files hub begins as a curated shared access point.",
};

export const phaseTwoChecklist = [
  "Connect Supabase project credentials through .env.local",
  "Create households, household_members, and tasks tables in Supabase",
  "Add the first auth flow for the two-user household",
  "Build the first shared task slice on top of the schema",
] as const;
