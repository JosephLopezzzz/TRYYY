import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  roomTypeId: z.string().optional(),
  minStay: z.number().int().min(1).max(30).default(1)
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('reservations.read')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { month, year, roomTypeId, minStay } = parsed.data

  const start = new Date(Date.UTC(year, month-1, 1))
  const end = new Date(Date.UTC(year, month, 1))

  // total rooms by type
  const roomWhere: any = roomTypeId ? { roomTypeId } : {}
  const totalRooms = await prisma.room.count({ where: roomWhere })

  // reservations that overlap month
  const resvs = await prisma.reservation.findMany({
    where: {
      status: { in: ['BOOKED','CHECKED_IN'] },
      OR: [ { checkIn: { lt: end }, checkOut: { gt: start } } ],
      ...(roomTypeId ? { room: { roomTypeId } } : {})
    },
    select: { checkIn: true, checkOut: true }
  })

  const days: { date: string, available: number, minStay: number }[] = []
  for (let d = new Date(start); d < end; d = new Date(d.getTime()+86400000)){
    const dayEnd = new Date(d.getTime()+86400000)
    const overlapping = resvs.filter(r => r.checkIn < dayEnd && r.checkOut > d).length
    const available = Math.max(0, totalRooms - overlapping)
    days.push({ date: d.toISOString().slice(0,10), available, minStay })
  }

  return json({ data: { totalRooms, days } })
})
