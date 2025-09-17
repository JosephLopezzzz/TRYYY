import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ id: z.string(), reason: z.string().optional() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('reservations.write')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id, reason } = parsed.data

  const resv = await prisma.reservation.findUnique({ where: { id } })
  if (!resv) { const e:any=new Error('Reservation not found'); e.status=404; throw e }

  const updated = await prisma.reservation.update({ where: { id }, data: { status: 'CANCELED' } })
  await prisma.auditLog.create({ data: { actorId: resv.userId ?? null, action: 'reservation.cancel', entity: id, note: reason ?? undefined } })
  return json({ data: updated })
})
