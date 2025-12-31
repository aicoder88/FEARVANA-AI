import { z } from 'zod'
import type { LifeLevelCategory } from '@/lib/database.types'

/**
 * Entry and metrics validation schemas
 * Provides type-safe validation for JSONB metric fields
 */

// Base metric schemas for each category
export const FitnessMetricsSchema = z.object({
  weight: z.number().min(0).max(1000).optional(),
  body_fat_percentage: z.number().min(0).max(100).optional(),
  muscle_mass: z.number().min(0).max(500).optional(),
  hrv: z.number().min(0).max(300).optional(),
  resting_heart_rate: z.number().min(20).max(200).optional(),
  workout_duration: z.number().min(0).max(1440).optional(), // minutes
  calories_burned: z.number().min(0).max(10000).optional(),
})

export const MoneyMetricsSchema = z.object({
  net_worth: z.number().optional(),
  income: z.number().min(0).optional(),
  expenses: z.number().min(0).optional(),
  savings_rate: z.number().min(0).max(100).optional(),
  investment_return: z.number().optional(),
})

export const HealthMetricsSchema = z.object({
  sleep_hours: z.number().min(0).max(24).optional(),
  sleep_quality: z.number().min(0).max(10).optional(),
  stress_level: z.number().min(0).max(10).optional(),
  energy_level: z.number().min(0).max(10).optional(),
  mood_score: z.number().min(0).max(10).optional(),
})

export const RelationshipMetricsSchema = z.object({
  quality_time_hours: z.number().min(0).max(24).optional(),
  communication_score: z.number().min(0).max(10).optional(),
  conflict_resolution_score: z.number().min(0).max(10).optional(),
  intimacy_score: z.number().min(0).max(10).optional(),
})

export const SkillMetricsSchema = z.object({
  study_hours: z.number().min(0).max(24).optional(),
  courses_completed: z.number().int().min(0).optional(),
  certifications_earned: z.number().int().min(0).optional(),
  practice_sessions: z.number().int().min(0).optional(),
  skill_level: z.number().min(0).max(10).optional(),
})

export const MindsetMetricsSchema = z.object({
  meditation_minutes: z.number().min(0).max(1440).optional(),
  gratitude_entries: z.number().int().min(0).optional(),
  goal_progress: z.number().min(0).max(100).optional(),
  self_reflection_score: z.number().min(0).max(10).optional(),
  growth_mindset_score: z.number().min(0).max(10).optional(),
})

export const FunMetricsSchema = z.object({
  leisure_hours: z.number().min(0).max(24).optional(),
  social_activities: z.number().int().min(0).optional(),
  hobbies_time: z.number().min(0).max(1440).optional(),
  adventure_score: z.number().min(0).max(10).optional(),
  creativity_score: z.number().min(0).max(10).optional(),
})

// Generic metric schema (allows any of the above)
export const MetricSchema = z.union([
  FitnessMetricsSchema,
  MoneyMetricsSchema,
  HealthMetricsSchema,
  RelationshipMetricsSchema,
  SkillMetricsSchema,
  MindsetMetricsSchema,
  FunMetricsSchema,
])

// Entry schemas
export const EntrySchema = z.object({
  id: z.string().uuid(),
  level_id: z.string().uuid(),
  ts: z.string().datetime(),
  metric: MetricSchema,
  created_at: z.string().datetime(),
})

export const EntryInsertSchema = z.object({
  level_id: z.string().uuid(),
  ts: z.string().datetime().optional(),
  metric: MetricSchema,
})

export const EntryUpdateSchema = z.object({
  ts: z.string().datetime(),
  metric: MetricSchema,
}).partial()

// Infer TypeScript types
export type FitnessMetricsValidated = z.infer<typeof FitnessMetricsSchema>
export type MoneyMetricsValidated = z.infer<typeof MoneyMetricsSchema>
export type HealthMetricsValidated = z.infer<typeof HealthMetricsSchema>
export type RelationshipMetricsValidated = z.infer<typeof RelationshipMetricsSchema>
export type SkillMetricsValidated = z.infer<typeof SkillMetricsSchema>
export type MindsetMetricsValidated = z.infer<typeof MindsetMetricsSchema>
export type FunMetricsValidated = z.infer<typeof FunMetricsSchema>
export type MetricValidated = z.infer<typeof MetricSchema>
export type EntryValidated = z.infer<typeof EntrySchema>
export type EntryInsertInput = z.infer<typeof EntryInsertSchema>
export type EntryUpdateInput = z.infer<typeof EntryUpdateSchema>

/**
 * Get the appropriate metric schema for a life level category
 */
export function getMetricSchemaForCategory(category: LifeLevelCategory) {
  const schemaMap: Record<LifeLevelCategory, z.ZodType> = {
    mindset_maturity: MindsetMetricsSchema,
    family_relationships: RelationshipMetricsSchema,
    money: MoneyMetricsSchema,
    fitness: FitnessMetricsSchema,
    health: HealthMetricsSchema,
    skill_building: SkillMetricsSchema,
    fun_joy: FunMetricsSchema,
  }

  return schemaMap[category] || MetricSchema
}

/**
 * Validate entry data
 */
export function validateEntry(data: unknown) {
  return EntrySchema.parse(data)
}

/**
 * Validate entry insert data
 */
export function validateEntryInsert(data: unknown) {
  return EntryInsertSchema.parse(data)
}

/**
 * Validate metric based on category
 */
export function validateMetricForCategory(
  metric: unknown,
  category: LifeLevelCategory
) {
  const schema = getMetricSchemaForCategory(category)
  return schema.parse(metric)
}

/**
 * Safe validation
 */
export function safeValidateEntry(data: unknown) {
  return EntrySchema.safeParse(data)
}

export function safeValidateEntryInsert(data: unknown) {
  return EntryInsertSchema.safeParse(data)
}
