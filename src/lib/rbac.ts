import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requirePermission(perm: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    const error = new Error('Unauthorized') as Error & { status?: number; hint?: string }
    error.status = 401
    error.hint = 'Login required.'
    throw error
  }
  const perms = (session as any).perms as string[] | undefined
  if (!perms?.includes(perm) && !(perms?.includes('admin'))) {
    const error = new Error('Forbidden') as Error & { status?: number; hint?: string }
    error.status = 403
    error.hint = `Missing permission: ${perm}`
    throw error
  }
  return session
}

export function hasPermission(session: any, perm: string) {
  const perms = session?.perms as string[] | undefined
  return !!perms?.includes(perm) || !!perms?.includes('admin')
}
