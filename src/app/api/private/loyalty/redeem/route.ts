import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ userId: z.string(), reservationId: z.string(), points: z.number().int().positive(), note: z.string().optional() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('crm.write')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { userId, reservationId, points, note } = parsed.data

  const folio = await prisma.folio.findUnique({ where: { reservationId } })
  if (!folio) { const e:any=new Error('Folio not found'); e.status=404; throw e }

  const member = await prisma.loyaltyMember.upsert({
    where: { userId },
    update: { points: { decrement: points }, transactions: { create: { points, type: 'redeem', note } } },
    create: { userId, points: 0, transactions: { create: { points, type: 'redeem', note } } }
  })

  // Apply folio credit as negative amount
  await prisma.folioItem.create({ data: { folioId: folio.id, type: 'loyalty-redeem', amount: -Math.abs(points), note: note ?? undefined } })
  await prisma.auditLog.create({ data: { actorId: userId, action: 'loyalty.redeem', entity: reservationId, note: `Redeemed ${points} points` } })

  return json({ data: member })
})
