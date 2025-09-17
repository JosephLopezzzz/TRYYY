import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { requirePermission } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const Body = z.object({ reservationId: z.string(), amount: z.number().positive().optional() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('billing.read')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { reservationId } = parsed.data

  const folio = await prisma.folio.findUnique({ where: { reservationId }, include: { items: true, payments: true } })
  if (!folio) { const e:any=new Error('Folio not found'); e.status=404; throw e }
  const due = Number(folio.items.reduce((s,i)=>s+Number(i.amount),0) - folio.payments.reduce((s,p)=>s+Number(p.amount),0))
  const amount = parsed.data.amount ?? Math.max(0, due)

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    // Scaffold: return a mock intent id so UI can proceed in test mode
    const intentId = 'pi_mock_' + Date.now().toString(36)
    return json({ data: { id: intentId, clientSecret: intentId+'_secret', amount } })
  }

  // NOTE: Real Stripe integration would go here (omitted on purpose)
  const intentId = 'pi_live_stub_' + Date.now().toString(36)
  return json({ data: { id: intentId, clientSecret: intentId+'_secret', amount } })
})
