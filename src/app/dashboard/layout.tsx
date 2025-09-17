import { ReactNode } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SidebarLogout from '@/components/sidebar-logout'

export default async function DashboardLayout({ children }: { children: ReactNode }){
  const session = await getServerSession(authOptions) as any
  const perms: string[] = session?.perms ?? []

  const items: { label: string, href: string, perm?: string }[] = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Front Desk', href: '/dashboard/frontdesk', perm: 'frontdesk.manage' },
    { label: 'Reservations', href: '/dashboard/reservations', perm: 'reservations.read' },
    { label: 'Billing', href: '/dashboard/billing', perm: 'billing.read' },
    { label: 'Guests', href: '/dashboard/guests', perm: 'frontdesk.manage' },
    { label: 'CRM', href: '/dashboard/crm', perm: 'crm.read' },
    { label: 'Rooms', href: '/dashboard/rooms', perm: 'rooms.manage' },
    { label: 'Housekeeping', href: '/dashboard/housekeeping', perm: 'housekeeping.manage' },
    { label: 'Inventory', href: '/dashboard/inventory', perm: 'inventory.read' },
    { label: 'Events', href: '/dashboard/events', perm: 'events.manage' },
    { label: 'Marketing', href: '/dashboard/marketing', perm: 'marketing.manage' },
    { label: 'Channels', href: '/dashboard/channels', perm: 'channels.manage' },
    { label: 'Queue', href: '/dashboard/queue', perm: 'frontdesk.manage' },
    { label: 'Analytics', href: '/dashboard/analytics', perm: 'analytics.read' },
    { label: 'Staff', href: '/dashboard/staff', perm: 'admin' },
  ]

  function canShow(perm?: string){ return !perm || perms.includes('admin') || perms.includes(perm) }

  return (
    <div className="min-h-[calc(100vh-0px)] grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-4">
      <aside className="bg-[#0f172a] text-white rounded-lg h-screen md:h-[calc(100vh-0px)] flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-white/10 flex items-center gap-2">
          <div className="text-lg font-semibold">HMS Core</div>
        </div>
        <nav className="flex-1 overflow-auto py-2">
          {items.filter(i=>canShow(i.perm)).map(i=> (
            <Link key={i.href} href={i.href} className="block px-4 py-2 text-sm hover:bg-white/10">
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 space-y-2">
          <div className="text-xs text-white/70">{session?.name ?? 'User'}</div>
          <div className="inline-block text-[10px] px-2 py-1 rounded bg-white/10">{session?.role ?? 'role'}</div>
          <SidebarLogout />
        </div>
      </aside>
      <section>{children}</section>
    </div>
  )
}
