import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { ReservationStatus, RoomStatus } from '@prisma/client'
import { z } from 'zod'

const Body = z.object({ reservationId: z.string() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const body = await req.json().catch(() => { const e:any=new Error('Invalid JSON'); e.status=400; throw e })
  const parsed = Body.safeParse(body)
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }

  const resv = await prisma.reservation.findUnique({ where: { id: parsed.data.reservationId } })
  if (!resv) { const e:any=new Error('Reservation not found'); e.status=404; throw e }
  if (resv.status !== ReservationStatus.BOOKED) { const e:any=new Error('Only BOOKED reservations can be checked in'); e.status=400; throw e }

  const updated = await prisma.$transaction(async (tx) => {
    const r = await tx.reservation.update({ where: { id: resv.id }, data: { status: ReservationStatus.CHECKED_IN } })
    if (r.roomId) { await tx.room.update({ where: { id: r.roomId }, data: { status: RoomStatus.OCCUPIED } }) }
    return r
  })

  return json({ data: updated })
})
