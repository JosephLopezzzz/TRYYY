import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ days: z.number().int().min(1).max(90).default(30) })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('analytics.read')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { days } = parsed.data
  const start = new Date(); start.setDate(start.getDate() - (days - 1))

  // Build daily buckets
  const payments = await prisma.payment.findMany({ where: { createdAt: { gte: start } } })
  const rooms = await prisma.room.findMany()
  const reservations = await prisma.reservation.findMany({ where: { createdAt: { gte: start } } })

  const buckets: Record<string, { revenue: number; reservations: number; occupancy: number }> = {}
  for (let i = 0; i < days; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i)
    const key = d.toISOString().slice(0,10)
    buckets[key] = { revenue: 0, reservations: 0, occupancy: 0 }
  }

  payments.forEach(p => {
    const key = p.createdAt.toISOString().slice(0,10)
    if (buckets[key]) buckets[key].revenue += Number(p.amount)
  })
  reservations.forEach(r => {
    const key = r.createdAt.toISOString().slice(0,10)
    if (buckets[key]) buckets[key].reservations += 1
  })

  // Approx occupancy: count rooms occupied per day / total rooms
  const totalRooms = rooms.length || 1
  const activeRes = await prisma.reservation.findMany({ where: { status: { in: ['BOOKED','CHECKED_IN'] } }, select: { checkIn: true, checkOut: true } })
  Object.keys(buckets).forEach(key => {
    const day = new Date(key)
    const dayEnd = new Date(day.getTime()+86400000)
    const occupied = activeRes.filter(r => r.checkIn < dayEnd && r.checkOut > day).length
    buckets[key].occupancy = Math.round((occupied / totalRooms) * 100)
  })

  const series = Object.entries(buckets).map(([date, v]) => ({ date, ...v }))
  return json({ data: series })
})


