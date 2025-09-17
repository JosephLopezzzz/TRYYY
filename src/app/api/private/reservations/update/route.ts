import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({
  id: z.string(),
  idScanUrl: z.string().url().optional(),
  digitalKeyIssued: z.boolean().optional(),
  checkInVerified: z.boolean().optional(),
  preferences: z.record(z.any()).optional(),
})

export const PATCH = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id, idScanUrl, digitalKeyIssued, checkInVerified, preferences } = parsed.data

  const resv = await prisma.reservation.findUnique({ where: { id }, include: { guest: true } })
  if (!resv) { const e:any=new Error('Reservation not found'); e.status=404; throw e }

  const updated = await prisma.$transaction(async (tx) => {
    if (preferences) {
      await tx.guest.update({ where: { id: resv.guestId }, data: { preferences } })
    }
    const r = await tx.reservation.update({ where: { id }, data: { idScanUrl, digitalKeyIssued, checkInVerified } })
    return r
  })

  return json({ data: updated })
})
