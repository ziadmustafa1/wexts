/**
 * Custom fetch hook using TanStack Query (Senior Stack 2025)
 * Industry-standard data fetching & caching
 */
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

export function useFetch<T = unknown>(
  url: string,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey: [url],
    queryFn: () => api.get<T>(url),
    ...options,
  })
}
