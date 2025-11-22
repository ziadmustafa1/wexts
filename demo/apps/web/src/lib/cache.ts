'use cache'

import { 
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag 
} from 'next/cache'

/**
 * Cache utility with tags and lifecycle
 */
export async function getCachedData(id: string) {
  // Define cache lifecycle
  cacheLife('hours')
  
  // Add cache tags for invalidation
  cacheTag('data', `data-${id}`)

  // Fetch data
  const data = await fetch(`https://api.example.com/data/${id}`)
  return data.json()
}

/**
 * Custom cache wrapper
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  tags: string[],
  life: 'minutes' | 'hours' | 'days' = 'hours'
): T {
  return (async (...args: Parameters<T>) => {
    'use cache'
    
    cacheLife(life)
    tags.forEach(tag => cacheTag(tag))
    
    return await fn(...args)
  }) as T
}

// Usage example:
export const getUser = withCache(
  async (id: string) => {
    const res = await fetch(`https://api.example.com/users/${id}`)
    return res.json()
  },
  ['users'],
  'hours'
)
