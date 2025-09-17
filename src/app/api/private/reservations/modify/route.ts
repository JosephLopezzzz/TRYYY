import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({
  id: z.string(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  roomId: z.string().optional(),
  adults: z.number().int().min(1).max(6).optional(),
  children: z.number().int().min(0).max(6).optional(),
  notes: z.string().optional()
})

export const PATCH = api(async (req: NextRequest) => {
  await requirePermission('reservations.write')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id, checkIn, checkOut, roomId, adults, children, notes } = parsed.data

  const resv = await prisma.reservation.findUnique({ where: { id } })
  if (!resv) { const e:any=new Error('Reservation not found'); e.status=404; throw e }

  const ci = checkIn ? new Date(checkIn) : resv.checkIn
  const co = checkOut ? new Date(checkOut) : resv.checkOut
  if (!(ci < co)) { const e:any=new Error('checkIn must be before checkOut'); e.status=400; throw e }

  // overlap check if room is set
  if (roomId) {
    const overlap = await prisma.reservation.findFirst({
      where: {
        id: { not: id },
        roomId,
        status: { in: ['BOOKED','CHECKED_IN'] },
        OR: [{ checkIn: { lt: co }, checkOut: { gt: ci } }]
      }
    })
    if (overlap) { const e:any=new Error('Selected room is not available for the new dates'); e.status=400; throw e }
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { checkIn: ci, checkOut: co, roomId: roomId ?? resv.roomId, adults: adults ?? resv.adults, children: children ?? resv.children, notes: notes ?? resv.notes }
  })

  return json({ data: updated })
})
