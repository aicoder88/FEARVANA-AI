export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      life_levels: {
        Row: {
          id: string
          profile_id: string
          category: LifeLevelCategory
          goal_jsonb: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          category: LifeLevelCategory
          goal_jsonb: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          category?: LifeLevelCategory
          goal_jsonb?: Json
          created_at?: string
          updated_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          level_id: string
          ts: string
          metric: Json
          created_at: string
        }
        Insert: {
          id?: string
          level_id: string
          ts?: string
          metric: Json
          created_at?: string
        }
        Update: {
          id?: string
          level_id?: string
          ts?: string
          metric?: Json
          created_at?: string
        }
      }
      coach_actions: {
        Row: {
          id: string
          level_id: string
          ts: string
          suggestion: string
          ai_metadata: Json
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          level_id: string
          ts?: string
          suggestion: string
          ai_metadata?: Json
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          level_id?: string
          ts?: string
          suggestion?: string
          ai_metadata?: Json
          completed?: boolean
          created_at?: string
        }
      }
      supplements: {
        Row: {
          id: string
          profile_id: string
          name: string
          qty_on_hand: number
          dosage_schema: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          qty_on_hand: number
          dosage_schema: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          qty_on_hand?: number
          dosage_schema?: Json
          created_at?: string
          updated_at?: string
        }
      }
      spiral_journey_states: {
        Row: {
          id: string
          profile_id: string
          current_step: number
          step_progress: number
          readiness_signals: Json
          problem_pressure_score: number
          cognitive_bandwidth_score: number
          window_opportunity_open: boolean
          next_level_glimpses_count: number
          supportive_container_strength: number
          practice_integration_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          current_step?: number
          step_progress?: number
          readiness_signals?: Json
          problem_pressure_score?: number
          cognitive_bandwidth_score?: number
          window_opportunity_open?: boolean
          next_level_glimpses_count?: number
          supportive_container_strength?: number
          practice_integration_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          current_step?: number
          step_progress?: number
          readiness_signals?: Json
          problem_pressure_score?: number
          cognitive_bandwidth_score?: number
          window_opportunity_open?: boolean
          next_level_glimpses_count?: number
          supportive_container_strength?: number
          practice_integration_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      growth_challenges: {
        Row: {
          id: string
          spiral_level: string
          target_step: number
          challenge_type: string
          title: string
          description: string
          upgrade_tools: Json
          xp_reward: number
          difficulty_level: number
          estimated_time: string
          success_criteria: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          spiral_level: string
          target_step: number
          challenge_type: string
          title: string
          description: string
          upgrade_tools?: Json
          xp_reward?: number
          difficulty_level?: number
          estimated_time?: string
          success_criteria?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          spiral_level?: string
          target_step?: number
          challenge_type?: string
          title?: string
          description?: string
          upgrade_tools?: Json
          xp_reward?: number
          difficulty_level?: number
          estimated_time?: string
          success_criteria?: Json
          is_active?: boolean
          created_at?: string
        }
      }
      progression_triggers: {
        Row: {
          id: string
          profile_id: string
          trigger_type: string
          trigger_data: Json
          is_active: boolean
          fired_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          trigger_type: string
          trigger_data?: Json
          is_active?: boolean
          fired_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          trigger_type?: string
          trigger_data?: Json
          is_active?: boolean
          fired_at?: string | null
          created_at?: string
        }
      }
      level_transitions: {
        Row: {
          id: string
          profile_id: string
          from_level: string
          to_level: string
          transition_date: string
          preparation_duration: string | null
          integration_score: number
          success_indicators: Json
          is_completed: boolean
        }
        Insert: {
          id?: string
          profile_id: string
          from_level: string
          to_level: string
          transition_date?: string
          preparation_duration?: string | null
          integration_score?: number
          success_indicators?: Json
          is_completed?: boolean
        }
        Update: {
          id?: string
          profile_id?: string
          from_level?: string
          to_level?: string
          transition_date?: string
          preparation_duration?: string | null
          integration_score?: number
          success_indicators?: Json
          is_completed?: boolean
        }
      }
      challenge_completions: {
        Row: {
          id: string
          profile_id: string
          challenge_id: string
          completed_at: string
          xp_earned: number
          quality_score: number | null
          insights: Json
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          challenge_id: string
          completed_at?: string
          xp_earned?: number
          quality_score?: number | null
          insights?: Json
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          challenge_id?: string
          completed_at?: string
          xp_earned?: number
          quality_score?: number | null
          insights?: Json
          created_at?: string
        }
      }
      spiral_xp_log: {
        Row: {
          id: string
          profile_id: string
          xp_type: string
          xp_amount: number
          source_type: string
          source_id: string | null
          spiral_level: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          xp_type: string
          xp_amount: number
          source_type: string
          source_id?: string | null
          spiral_level: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          xp_type?: string
          xp_amount?: number
          source_type?: string
          source_id?: string | null
          spiral_level?: string
          description?: string | null
          created_at?: string
        }
      }
      spiral_achievements: {
        Row: {
          id: string
          profile_id: string
          achievement_type: string
          achievement_name: string
          description: string | null
          spiral_level: string | null
          earned_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          profile_id: string
          achievement_type: string
          achievement_name: string
          description?: string | null
          spiral_level?: string | null
          earned_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          profile_id?: string
          achievement_type?: string
          achievement_name?: string
          description?: string | null
          spiral_level?: string | null
          earned_at?: string
          metadata?: Json
        }
      }
      spiral_assessments: {
        Row: {
          id: string
          profile_id: string
          primary_level: string
          secondary_level: string | null
          level_scores: Json
          assessment_responses: Json
          insights: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          primary_level: string
          secondary_level?: string | null
          level_scores?: Json
          assessment_responses?: Json
          insights?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          primary_level?: string
          secondary_level?: string | null
          level_scores?: Json
          assessment_responses?: Json
          insights?: Json
          created_at?: string
          updated_at?: string
        }
      }
      spiral_progress: {
        Row: {
          id: string
          profile_id: string
          current_level: string
          progress_in_level: number
          unlocked_levels: string[]
          level_completion_dates: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          current_level: string
          progress_in_level?: number
          unlocked_levels?: string[]
          level_completion_dates?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          current_level?: string
          progress_in_level?: number
          unlocked_levels?: string[]
          level_completion_dates?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      life_level_category: LifeLevelCategory
    }
  }
}

export type LifeLevelCategory = 
  | 'mindset_maturity'
  | 'family_relationships'
  | 'money'
  | 'fitness'
  | 'health'
  | 'skill_building'
  | 'fun_joy'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type LifeLevel = Database['public']['Tables']['life_levels']['Row']
export type Entry = Database['public']['Tables']['entries']['Row']
export type CoachAction = Database['public']['Tables']['coach_actions']['Row']
export type Supplement = Database['public']['Tables']['supplements']['Row']

// Spiral Dynamics types
export type SpiralJourneyState = Database['public']['Tables']['spiral_journey_states']['Row']
export type GrowthChallenge = Database['public']['Tables']['growth_challenges']['Row']
export type ProgressionTrigger = Database['public']['Tables']['progression_triggers']['Row']
export type LevelTransition = Database['public']['Tables']['level_transitions']['Row']
export type ChallengeCompletion = Database['public']['Tables']['challenge_completions']['Row']
export type SpiralXpLog = Database['public']['Tables']['spiral_xp_log']['Row']
export type SpiralAchievement = Database['public']['Tables']['spiral_achievements']['Row']
export type SpiralAssessment = Database['public']['Tables']['spiral_assessments']['Row']
export type SpiralProgress = Database['public']['Tables']['spiral_progress']['Row']

// Spiral Dynamics enums and interfaces
export type SpiralLevel = 'beige' | 'purple' | 'red' | 'blue' | 'orange' | 'green' | 'yellow' | 'turquoise' | 'coral'
export type XpType = 'foundation' | 'growth_edge' | 'integration' | 'mastery' | 'transition'
export type ProgressionStep = 1 | 2 | 3 | 4 | 5 | 6 // The 6 mechanics of moving up

export interface SpiralJourneyMetrics {
  current_step: ProgressionStep
  step_progress: number // 0-100
  problem_pressure_score: number
  cognitive_bandwidth_score: number
  window_opportunity_open: boolean
  next_level_glimpses_count: number
  supportive_container_strength: number
  practice_integration_score: number
}

export interface ChallengeSuccessCriteria {
  completion_time?: number
  quality_threshold?: number
  specific_actions?: string[]
  reflection_required?: boolean
}

export interface UpgradeTools {
  type: string
  description: string
  resources?: string[]
  practices?: string[]
}

// Specific metric types for different categories
export interface FitnessMetrics {
  weight?: number
  body_fat_percentage?: number
  muscle_mass?: number
  hrv?: number
  resting_heart_rate?: number
  workout_duration?: number
  calories_burned?: number
}

export interface MoneyMetrics {
  net_worth?: number
  income?: number
  expenses?: number
  savings_rate?: number
  investment_return?: number
}

export interface HealthMetrics {
  sleep_hours?: number
  sleep_quality?: number
  stress_level?: number
  energy_level?: number
  mood_score?: number
}

export interface RelationshipMetrics {
  quality_time_hours?: number
  communication_score?: number
  conflict_resolution_score?: number
  intimacy_score?: number
}

export interface SkillMetrics {
  study_hours?: number
  courses_completed?: number
  certifications_earned?: number
  practice_sessions?: number
  skill_level?: number
}

export interface MindsetMetrics {
  meditation_minutes?: number
  gratitude_entries?: number
  goal_progress?: number
  self_reflection_score?: number
  growth_mindset_score?: number
}

export interface FunMetrics {
  leisure_hours?: number
  social_activities?: number
  hobbies_time?: number
  adventure_score?: number
  creativity_score?: number
}