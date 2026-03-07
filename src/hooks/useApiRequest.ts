'use client'

import { useState, useCallback } from 'react'

export interface ApiRequestState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface UseApiRequestOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

/**
 * Custom hook for handling API requests with loading, error, and data states
 *
 * @param options - Callback options for success and error
 * @returns An object with data, loading, error, and execute function
 */
export function useApiRequest<T = any>(options?: UseApiRequestOptions) {
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (
      url: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      body?: any,
      headers?: Record<string, string>
    ) => {
      setState({ data: null, loading: true, error: null })

      try {
        const requestOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        }

        if (body && method !== 'GET') {
          requestOptions.body = JSON.stringify(body)
        }

        const response = await fetch(url, requestOptions)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Request failed with status ${response.status}`)
        }

        setState({ data, loading: false, error: null })
        options?.onSuccess?.(data)

        return { success: true, data }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        setState({ data: null, loading: false, error: errorMessage })
        options?.onError?.(errorMessage)

        return { success: false, error: errorMessage }
      }
    },
    [options]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  }
}
