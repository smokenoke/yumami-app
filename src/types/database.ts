export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
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
        Row: {
          id: string;
          household_id: string;
          user_id: string;
          role: "owner" | "member";
          display_name: string | null;
          created_at: string;
        };
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
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          household_id: string;
          created_by_user_id: string;
          assigned_to_user_id: string | null;
          title: string;
          notes: string | null;
          status: TaskStatus;
          due_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          created_by_user_id: string;
          assigned_to_user_id?: string | null;
          title: string;
          notes?: string | null;
          status?: TaskStatus;
          due_at?: string | null;
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
          due_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
  };
}
