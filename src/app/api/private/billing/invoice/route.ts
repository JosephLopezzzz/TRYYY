import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ reservationId: z.string() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('billing.read')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { reservationId } = parsed.data

  const folio = await prisma.folio.findUnique({ where: { reservationId }, include: { items: true, payments: true } })
  if (!folio) { const e:any=new Error('Folio not found'); e.status=404; throw e }

  const charges = folio.items.reduce((s:any,i:any)=> s + Number(i.amount), 0)
  const payments = folio.payments.reduce((s:any,p:any)=> s + Number(p.amount), 0)
  const balance = charges - payments
  if (balance > 0) { const e:any = new Error('Folio not settled'); e.status=400; e.hint={ balance }; throw e }

  const number = 'INV-' + Date.now().toString().slice(-8)
  const invoice = await prisma.invoice.upsert({ where: { folioId: folio.id }, update: {}, create: { folioId: folio.id, number } })
  return json({ data: invoice })
})
