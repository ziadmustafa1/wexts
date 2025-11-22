'use client'

import { useActionState } from 'react'

// Mock login action for demo purposes
async function loginUser(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  'use server'
  
  const email = formData.get('email')
  const password = formData.get('password')
  
  // Simulate validation
  if (!email || !password) {
    return { error: 'All fields are required', success: false }
  }
  
  // Simulate async login
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { error: null, success: true }
}

/**
 * Form with useActionState hook (React 19 + Next.js 16)
 */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    { error: null, success: false }
  )

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
        />
      </div>

      {state.error && (
        <div className="text-red-500">{state.error}</div>
      )}

      {state.success && (
        <div className="text-green-500">Login successful!</div>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
