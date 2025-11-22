'use client'

import { useOptimistic, useTransition } from 'react'

// Mock add item action for demo purposes
async function addItem(name: string): Promise<{ id: string; name: string }> {
  'use server'
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    id: Math.random().toString(36).slice(2),
    name,
  }
}

/**
 * Optimistic UI with Next.js 16
 */
export function OptimisticList({ items }: { items: string[] }) {
  const [isPending, startTransition] = useTransition()
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: string) => [...state, newItem]
  )

  async function handleSubmit(formData: FormData) {
    const newItem = formData.get('item') as string
    
    // Add optimistically
    addOptimisticItem(newItem)
    
    // Then add to server
    startTransition(async () => {
      await addItem(newItem)
    })
  }

  return (
    <div>
      <ul>
        {optimisticItems.map((item, i) => (
          <li key={i} className={isPending ? 'opacity-50' : ''}>
            {item}
          </li>
        ))}
      </ul>

      <form action={handleSubmit}>
        <input name="item" required />
        <button disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  )
}
