'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Generic form action with error handling
 */
export async function submitForm(
  _prevState: { message: string } | null,
  formData: FormData
) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    }

    // Validate
    if (!data.name || !data.email) {
      return { message: 'All fields are required' }
    }

    // Process (e.g., save to database)
    // await db.create({ data })

    // Revalidate the page
    revalidatePath('/')

    return { message: 'Success!' }
  } catch (_error) {
    return { message: 'Failed to submit form' }
  }
}

/**
 * Delete action with redirect
 */
export async function deleteItem(_id: string) {
  try {
    // await db.delete({ where: { id: _id } })

    revalidatePath('/items')
    redirect('/items')
  } catch (_error) {
    throw new Error('Failed to delete item')
  }
}

/**
 * Update action with tag revalidation
 */
export async function updateItem(id: string, _data: unknown) {
  try {
    // await db.update({ where: { id }, data: _data })

    // Revalidate specific tags
    revalidateTag(`item-${id}`, 'fetch')
    revalidateTag('items', 'fetch')

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}
