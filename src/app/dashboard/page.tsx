import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function Dashboard() {
  const session = await getServerSession(authOptions) as any

  const [roomsTotal, roomsOccupied, paymentsToday, eventsUpcoming] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: 'OCCUPIED' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: new Date(Date.now() - 24*60*60*1000) } } }),
    prisma.event.count({ where: { start: { gte: new Date() } } })
  ])
  const occupancy = roomsTotal ? Math.round(roomsOccupied / roomsTotal * 100) : 0
  const revenueToday = Number(paymentsToday._sum.amount ?? 0)

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-500">Occupancy</div>
          <div className="text-2xl font-semibold">{occupancy}%</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Revenue (24h)</div>
          <div className="text-2xl font-semibold">${revenueToday.toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Rooms Occupied</div>
          <div className="text-2xl font-semibold">{roomsOccupied}/{roomsTotal}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500">Upcoming Events</div>
          <div className="text-2xl font-semibold">{eventsUpcoming}</div>
        </div>
      </div>

      <div className="card">
        <div className="font-medium mb-3">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn" href="/dashboard/frontdesk">Check-in/Check-out</Link>
          <Link className="btn" href="/dashboard/reservations">Create Reservation</Link>
          <Link className="btn" href="/dashboard/billing">Billing</Link>
          <Link className="btn" href="/dashboard/rooms">Room Status</Link>
        </div>
      </div>
    </div>
  )
}
