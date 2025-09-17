import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ checkIn: z.string(), checkOut: z.string(), roomTypeId: z.string() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('reservations.read')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { checkIn, checkOut, roomTypeId } = parsed.data
  const ci = new Date(checkIn); const co = new Date(checkOut)

  const totalRooms = await prisma.room.count({ where: { roomTypeId } })
  const overlapping = await prisma.reservation.count({
    where: { status: { in: ['BOOKED','CHECKED_IN'] }, room: { roomTypeId }, OR: [{ checkIn: { lt: co }, checkOut: { gt: ci } }] }
  })
  const occ = totalRooms ? overlapping/totalRooms : 0
  const base = (await prisma.roomType.findUnique({ where: { id: roomTypeId } }))!.baseRate as unknown as number
  // simple yield: +0..30% by occupancy, +10% if event in range (placeholder: if any event exists)
  const eventDays = await prisma.event.count({ where: { start: { lt: co }, end: { gt: ci } } })
  const rate = base * (1 + 0.3*occ) * (eventDays>0 ? 1.1 : 1)
  return json({ data: { suggestedRate: Number(rate.toFixed(2)), occupancy: occ } })
})
