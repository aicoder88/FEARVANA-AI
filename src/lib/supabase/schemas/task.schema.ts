import { z } from 'zod'

/**
 * Task validation schemas
 */

export const TaskSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  level_id: z.string().uuid().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  points: z.number().int(),
  completed: z.boolean(),
  due_date: z.string(), // date string
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const TaskInsertSchema = z.object({
  profile_id: z.string().uuid(),
  level_id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  points: z.number().int().min(0).default(0),
  completed: z.boolean().default(false),
  due_date: z.string().optional(), // ISO date string
})

export const TaskUpdateSchema = z
  .object({
    title: z.string().min(1).max(255),
    description: z.string().max(1000).nullable(),
    points: z.number().int().min(0),
    completed: z.boolean(),
    due_date: z.string(),
    level_id: z.string().uuid().nullable(),
  })
  .partial()

// Infer TypeScript types
export type TaskValidated = z.infer<typeof TaskSchema>
export type TaskInsertInput = z.infer<typeof TaskInsertSchema>
export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>

/**
 * Validate task data
 */
export function validateTask(data: unknown) {
  return TaskSchema.parse(data)
}

/**
 * Validate task insert data
 */
export function validateTaskInsert(data: unknown) {
  return TaskInsertSchema.parse(data)
}

/**
 * Validate task update data
 */
export function validateTaskUpdate(data: unknown) {
  return TaskUpdateSchema.parse(data)
}

/**
 * Safe validation
 */
export function safeValidateTask(data: unknown) {
  return TaskSchema.safeParse(data)
}

export function safeValidateTaskInsert(data: unknown) {
  return TaskInsertSchema.safeParse(data)
}

export function safeValidateTaskUpdate(data: unknown) {
  return TaskUpdateSchema.safeParse(data)
}
