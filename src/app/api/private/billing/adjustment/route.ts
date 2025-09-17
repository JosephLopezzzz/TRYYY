import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({
  reservationId: z.string(),
  amount: z.number(), // negative for credit
  note: z.string().optional()
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('billing.read')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { reservationId, amount, note } = parsed.data

  const folio = await prisma.folio.findUnique({ where: { reservationId } })
  if (!folio) { const e:any=new Error('Folio not found'); e.status=404; throw e }

  const item = await prisma.folioItem.create({ data: { folioId: folio.id, type: 'adjustment', amount, note } })
  await prisma.auditLog.create({ data: { action: 'billing.adjustment', entity: folio.id, note: `${amount} ${note??''}` } })
  return json({ data: item }, 201)
})
