import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Basic RBAC gate: protect /dashboard and /api/private/*
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/api/private')
  if (!isProtected) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Route-to-permission mapping (prefix-based)
  const rules: { prefix: string; perms: string[] }[] = [
    { prefix: '/dashboard', perms: ['frontdesk.manage','analytics.read'] },
    { prefix: '/dashboard/frontdesk', perms: ['frontdesk.manage'] },
    { prefix: '/dashboard/reservations', perms: ['reservations.read'] },
    { prefix: '/dashboard/billing', perms: ['billing.read'] },
    { prefix: '/dashboard/inventory', perms: ['inventory.read'] },
    { prefix: '/dashboard/housekeeping', perms: ['housekeeping.manage'] },
    { prefix: '/dashboard/rooms', perms: ['rooms.manage'] },
    { prefix: '/dashboard/analytics', perms: ['analytics.read'] },
    { prefix: '/dashboard/crm', perms: ['crm.read'] },
    { prefix: '/dashboard/guests', perms: ['frontdesk.manage'] },
    { prefix: '/dashboard/events', perms: ['events.manage'] },
    { prefix: '/dashboard/marketing', perms: ['marketing.manage'] },
    { prefix: '/dashboard/channels', perms: ['channels.manage'] },
    { prefix: '/dashboard/loyalty', perms: ['crm.read'] },
    { prefix: '/dashboard/queue', perms: ['frontdesk.manage'] },
    { prefix: '/dashboard/staff', perms: ['admin'] },
    { prefix: '/dashboard/settings', perms: ['admin'] },
    // API prefixes
    { prefix: '/api/private/reservations', perms: ['reservations.read'] },
    { prefix: '/api/private/frontdesk', perms: ['frontdesk.manage'] },
    { prefix: '/api/private/billing', perms: ['billing.read'] },
    { prefix: '/api/private/inventory', perms: ['inventory.read'] },
    { prefix: '/api/private/housekeeping', perms: ['housekeeping.manage'] },
    { prefix: '/api/private/rooms', perms: ['rooms.manage'] },
    { prefix: '/api/private/analytics', perms: ['analytics.read'] },
    { prefix: '/api/private/crm', perms: ['crm.read'] },
    { prefix: '/api/private/guests', perms: ['frontdesk.manage'] },
    { prefix: '/api/private/events', perms: ['events.manage'] },
    { prefix: '/api/private/marketing', perms: ['marketing.manage'] },
    { prefix: '/api/private/channels', perms: ['channels.manage'] },
    { prefix: '/api/private/loyalty', perms: ['crm.read'] },
    { prefix: '/api/private/staff', perms: ['admin'] },
    { prefix: '/api/private/settings', perms: ['admin'] },
  ]

  const rule = rules.find(r => pathname.startsWith(r.prefix))
  const perms = (token as any)?.perms as string[] | undefined
  const ok = !rule || perms?.includes('admin') || rule.perms.some(p => perms?.includes(p))
  if (!ok) {
    // If API, return 403 JSON; if page, redirect
    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden', hint: `Missing permission: one of [${rule.perms.join(', ')}]` }), { status: 403, headers: { 'content-type': 'application/json' } })
    }
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    url.searchParams.set('denied', rule.perms.join(','))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*', '/api/private/:path*'] }
