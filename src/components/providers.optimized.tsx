'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'

// Lazy load React Query DevTools only in development
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then(mod => ({ default: mod.ReactQueryDevtools })),
  {
    ssr: false,
    loading: () => null
  }
)

export function Providers({ children }: { children: React.ReactNode }) {
  // Memoize QueryClient creation to ensure it's only created once
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Error && 'status' in error) {
                const status = (error as Error & { status: number }).status
                if (status >= 400 && status < 500) {
                  return false
                }
              }
              return failureCount < 3
            },
            // Network mode optimization
            networkMode: 'online',
            // Refetch on window focus only if data is stale
            refetchOnWindowFocus: 'always',
            refetchOnMount: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false,
            // Network mode optimization
            networkMode: 'online',
          },
        },
      })
  )

  // Only show devtools in development
  const shouldShowDevtools = useMemo(
    () => process.env.NODE_ENV === 'development',
    []
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="fearvana-theme"
    >
      <QueryClientProvider client={queryClient}>
        {children}
        {shouldShowDevtools && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
