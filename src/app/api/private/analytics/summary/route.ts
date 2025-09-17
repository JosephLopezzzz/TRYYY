import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

export const GET = api(async () => {
  await requirePermission('analytics.read')
  const [roomsTotal, roomsOccupied, reservationsToday, revenue] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: 'OCCUPIED' } }),
    prisma.reservation.count({
      where: {
        OR: [
          { checkIn: { gte: new Date(new Date().toDateString()) } },
          { checkOut: { gte: new Date(new Date().toDateString()) } }
        ]
      }
    }),
    prisma.payment.aggregate({ _sum: { amount: true } })
  ])
  const occupancy = roomsTotal ? Math.round((roomsOccupied/roomsTotal)*100) : 0
  return json({ data: { roomsTotal, roomsOccupied, occupancy, reservationsToday, revenue: Number(revenue._sum.amount ?? 0) } })
})
