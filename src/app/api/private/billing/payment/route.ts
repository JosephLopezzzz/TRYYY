import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ reservationId: z.string(), method: z.string().default('card'), amount: z.number().positive(), currency: z.string().default('USD'), ref: z.string().optional() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('billing.write')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { reservationId, method, amount, currency, ref } = parsed.data
  const folio = await prisma.folio.findFirst({ where: { reservationId } })
  if (!folio) { const e:any=new Error('Folio not found'); e.status=404; throw e }
  const pay = await prisma.payment.create({ data: { folioId: folio.id, method, amount, currency, ref } })
  return json({ data: pay }, 201)
})
