import { z } from 'zod'

/**
 * Profile validation schemas using Zod
 * Provides runtime type safety for database operations
 */

// Base profile schema
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// Schema for profile updates (all fields optional)
export const ProfileUpdateSchema = z
  .object({
    display_name: z.string().min(1).max(255),
    avatar_url: z.string().url(),
  })
  .partial()

// Schema for profile creation
export const ProfileInsertSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string().min(1).max(255).optional(),
  avatar_url: z.string().url().optional(),
})

// Infer TypeScript types from schemas
export type ProfileValidated = z.infer<typeof ProfileSchema>
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>
export type ProfileInsertInput = z.infer<typeof ProfileInsertSchema>

/**
 * Validate profile data
 */
export function validateProfile(data: unknown) {
  return ProfileSchema.parse(data)
}

/**
 * Validate profile update data
 */
export function validateProfileUpdate(data: unknown) {
  return ProfileUpdateSchema.parse(data)
}

/**
 * Safe validation that returns success/error
 */
export function safeValidateProfile(data: unknown) {
  return ProfileSchema.safeParse(data)
}

/**
 * Safe validation for updates
 */
export function safeValidateProfileUpdate(data: unknown) {
  return ProfileUpdateSchema.safeParse(data)
}
