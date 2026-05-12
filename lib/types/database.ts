export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      Users: {
        Row: {
          id: string;
          user_id: string;
          email: string | null;
          elevenlabs_voice_id: string | null;
          subscription_status: "trial" | "active" | "past_due" | "canceled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email?: string | null;
          elevenlabs_voice_id?: string | null;
          subscription_status?: "trial" | "active" | "past_due" | "canceled";
        };
        Update: {
          email?: string | null;
          elevenlabs_voice_id?: string | null;
          subscription_status?: "trial" | "active" | "past_due" | "canceled";
        };
        Relationships: [];
      };
      LivingProfiles: {
        Row: {
          id: string;
          user_id: string;
          child_name: string;
          age: number | null;
          visual_anchor: Json;
          companion_mode_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          child_name: string;
          age?: number | null;
          visual_anchor?: Json;
          companion_mode_enabled?: boolean;
        };
        Update: {
          child_name?: string;
          age?: number | null;
          visual_anchor?: Json;
          companion_mode_enabled?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "LivingProfiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      Stories: {
        Row: {
          id: string;
          user_id: string;
          living_profile_id: string;
          hurdle: string;
          title: string;
          status: "baking" | "ready" | "failed";
          master_anchor_prompt: string;
          story_json: Json;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          living_profile_id: string;
          hurdle: string;
          title?: string;
          status?: "baking" | "ready" | "failed";
          master_anchor_prompt: string;
          story_json?: Json;
          error_message?: string | null;
        };
        Update: {
          hurdle?: string;
          title?: string;
          status?: "baking" | "ready" | "failed";
          master_anchor_prompt?: string;
          story_json?: Json;
          error_message?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Stories_living_profile_id_fkey";
            columns: ["living_profile_id"];
            isOneToOne: false;
            referencedRelation: "LivingProfiles";
            referencedColumns: ["id"];
          },
        ];
      };
      Images: {
        Row: {
          id: string;
          user_id: string;
          story_id: string;
          living_profile_id: string;
          page_number: number;
          prompt: string;
          consistency_anchor: string;
          storage_bucket: string;
          storage_path: string;
          generation_provider: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          story_id: string;
          living_profile_id: string;
          page_number: number;
          prompt: string;
          consistency_anchor: string;
          storage_bucket?: string;
          storage_path: string;
          generation_provider?: string;
        };
        Update: {
          page_number?: number;
          prompt?: string;
          consistency_anchor?: string;
          storage_bucket?: string;
          storage_path?: string;
          generation_provider?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Images_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "Stories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Images_living_profile_id_fkey";
            columns: ["living_profile_id"];
            isOneToOne: false;
            referencedRelation: "LivingProfiles";
            referencedColumns: ["id"];
          },
        ];
      };
      VoiceProfiles: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          provider: string;
          provider_voice_id: string;
          status: "training" | "ready" | "failed";
          training_script: string;
          consent_confirmed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          provider?: string;
          provider_voice_id: string;
          status?: "training" | "ready" | "failed";
          training_script: string;
          consent_confirmed?: boolean;
        };
        Update: {
          label?: string;
          provider?: string;
          provider_voice_id?: string;
          status?: "training" | "ready" | "failed";
          training_script?: string;
          consent_confirmed?: boolean;
        };
        Relationships: [];
      };
      TreasuryBalances: {
        Row: {
          id: string;
          user_id: string;
          living_profile_id: string;
          star_dust_total: number;
          reading_streak: number;
          last_rewarded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          living_profile_id: string;
          star_dust_total?: number;
          reading_streak?: number;
          last_rewarded_at?: string | null;
        };
        Update: {
          star_dust_total?: number;
          reading_streak?: number;
          last_rewarded_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "TreasuryBalances_living_profile_id_fkey";
            columns: ["living_profile_id"];
            isOneToOne: false;
            referencedRelation: "LivingProfiles";
            referencedColumns: ["id"];
          },
        ];
      };
      ReadingAttempts: {
        Row: {
          id: string;
          user_id: string;
          living_profile_id: string;
          story_id: string | null;
          page_number: number;
          target_text: string;
          transcript: string;
          accuracy_score: number;
          completion_score: number;
          status: "needs_practice" | "completed";
          star_dust_awarded: number;
          assessment_provider: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          living_profile_id: string;
          story_id?: string | null;
          page_number?: number;
          target_text: string;
          transcript: string;
          accuracy_score?: number;
          completion_score?: number;
          status?: "needs_practice" | "completed";
          star_dust_awarded?: number;
          assessment_provider?: string;
        };
        Update: {
          transcript?: string;
          accuracy_score?: number;
          completion_score?: number;
          status?: "needs_practice" | "completed";
          star_dust_awarded?: number;
          assessment_provider?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ReadingAttempts_living_profile_id_fkey";
            columns: ["living_profile_id"];
            isOneToOne: false;
            referencedRelation: "LivingProfiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ReadingAttempts_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "Stories";
            referencedColumns: ["id"];
          },
        ];
      };
      WordAssessments: {
        Row: {
          id: string;
          user_id: string;
          reading_attempt_id: string;
          word_index: number;
          expected_word: string;
          spoken_word: string | null;
          accuracy_score: number;
          status: "correct" | "close" | "missed";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reading_attempt_id: string;
          word_index: number;
          expected_word: string;
          spoken_word?: string | null;
          accuracy_score?: number;
          status?: "correct" | "close" | "missed";
        };
        Update: {
          spoken_word?: string | null;
          accuracy_score?: number;
          status?: "correct" | "close" | "missed";
        };
        Relationships: [
          {
            foreignKeyName: "WordAssessments_reading_attempt_id_fkey";
            columns: ["reading_attempt_id"];
            isOneToOne: false;
            referencedRelation: "ReadingAttempts";
            referencedColumns: ["id"];
          },
        ];
      };
      StarDustLedger: {
        Row: {
          id: string;
          user_id: string;
          living_profile_id: string;
          reading_attempt_id: string | null;
          delta: number;
          balance_after: number;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          living_profile_id: string;
          reading_attempt_id?: string | null;
          delta: number;
          balance_after: number;
          reason: string;
        };
        Update: {
          delta?: number;
          balance_after?: number;
          reason?: string;
        };
        Relationships: [
          {
            foreignKeyName: "StarDustLedger_living_profile_id_fkey";
            columns: ["living_profile_id"];
            isOneToOne: false;
            referencedRelation: "LivingProfiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "StarDustLedger_reading_attempt_id_fkey";
            columns: ["reading_attempt_id"];
            isOneToOne: false;
            referencedRelation: "ReadingAttempts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
