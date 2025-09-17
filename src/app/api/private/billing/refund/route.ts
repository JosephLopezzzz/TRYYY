import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ reservationId: z.string(), amount: z.number().positive(), method: z.string().default('card'), note: z.string().optional() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('billing.write')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { reservationId, amount, method, note } = parsed.data

  const folio = await prisma.folio.findUnique({ where: { reservationId } })
  if (!folio) { const e:any=new Error('Folio not found'); e.status=404; throw e }

  // Record refund as negative payment and an adjustment for clarity
  const pay = await prisma.payment.create({ data: { folioId: folio.id, method, amount: -Math.abs(amount), currency: 'USD', ref: 'refund' } })
  await prisma.folioItem.create({ data: { folioId: folio.id, type: 'refund', amount: -Math.abs(amount), note } })
  await prisma.auditLog.create({ data: { action: 'billing.refund', entity: folio.id, note: `Refund ${amount} via ${method} ${note??''}` } })

  return json({ data: pay }, 201)
})


