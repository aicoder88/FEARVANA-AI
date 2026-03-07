import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Create a typed Supabase client for browser usage
 * @returns Typed Supabase client
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Create a typed Supabase client for server-side usage
 * @returns Typed Supabase client with cookie handling
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Type-safe client with helper methods
 */
export class TypedSupabaseClient {
  constructor(private client: ReturnType<typeof createClient>) {}

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser()
    if (error) throw error
    return user
  }

  /**
   * Get profile for current user
   */
  async getCurrentProfile() {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  }

  /**
   * Execute query with automatic error handling
   */
  async query<T>(queryFn: () => Promise<{ data: T | null; error: any }>) {
    const { data, error } = await queryFn()
    if (error) throw error
    return data
  }

  /**
   * Execute mutation with automatic error handling
   */
  async mutate<T>(mutateFn: () => Promise<{ data: T | null; error: any }>) {
    const { data, error } = await mutateFn()
    if (error) throw error
    return data
  }

  get raw() {
    return this.client
  }
}

/**
 * Create typed client instance
 */
export function createTypedClient() {
  return new TypedSupabaseClient(createClient())
}
