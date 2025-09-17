import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'
import { sendEmail } from '@/lib/notify'

const Body = z.object({ id: z.string() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('reservations.write')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id } = parsed.data
  const r = await prisma.reservation.findUnique({ where: { id }, include: { guest: true, room: { include: { roomType: true } } } })
  if (!r) { const e:any=new Error('Reservation not found'); e.status=404; throw e }
  const content = `Booking Confirmation for ${r.guest.firstName} ${r.guest.lastName} (Code: ${r.code})\nRoom: ${r.room?.number ?? '-'} ${r.room?.roomType?.name ?? ''}\nDates: ${r.checkIn.toDateString()} - ${r.checkOut.toDateString()}`
  await prisma.auditLog.create({ data: { actorId: r.userId ?? null, action: 'reservation.confirm', entity: id, note: content } })
  if (r.guest.email) {
    await sendEmail(r.guest.email, 'Your Booking Confirmation', content)
  }
  return json({ data: { message: 'Confirmation queued', preview: content } })
})
