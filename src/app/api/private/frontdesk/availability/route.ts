import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  adults: z.number().int().min(1).default(1),
  children: z.number().int().min(0).default(0),
  roomTypeId: z.string().optional()
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { checkIn, checkOut, adults, children, roomTypeId } = parsed.data

  const ci = new Date(checkIn)
  const co = new Date(checkOut)
  if (!(ci < co)) { const e:any = new Error('checkIn must be before checkOut'); e.status=400; throw e }

  // Rooms not overlapping existing reservations (BOOKED or CHECKED_IN)
  const overlapping = await prisma.reservation.findMany({
    where: {
      status: { in: ['BOOKED','CHECKED_IN'] },
      OR: [
        { checkIn: { lt: co }, checkOut: { gt: ci } },
      ],
    },
    select: { roomId: true }
  })
  const unavailableIds = new Set(overlapping.map(r=>r.roomId).filter(Boolean) as string[])

  const rooms = await prisma.room.findMany({
    where: {
      status: { notIn: ['OUT_OF_ORDER'] },
      ...(roomTypeId ? { roomTypeId } : {}),
    },
    include: { roomType: true }
  })
  const available = rooms.filter(r => !unavailableIds.has(r.id))

  // Simple rate suggestion: use RoomType.baseRate
  const suggestions = available.map(r => ({
    roomId: r.id,
    number: r.number,
    floor: r.floor,
    roomType: r.roomType?.name,
    suggestedRate: r.roomType?.baseRate ?? 0
  }))

  return json({ data: { available: suggestions, criteria: { checkIn: ci, checkOut: co, adults, children } } })
})
