import 'server-only'

/**
 * Server-only utilities
 * This code will throw error if imported in client components
 */

export async function getSecretData() {
  const secret = process.env.SECRET_API_KEY
  
  const response = await fetch(`https://api.example.com/secret`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  })
  
  return response.json()
}

export async function validateToken(token: string) {
  // Server-only validation logic
  return token === process.env.SECRET_TOKEN
}
