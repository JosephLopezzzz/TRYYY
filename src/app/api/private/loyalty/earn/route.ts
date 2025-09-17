import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ userId: z.string(), points: z.number().int().positive(), note: z.string().optional() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('crm.write')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { userId, points, note } = parsed.data
  const member = await prisma.loyaltyMember.upsert({
    where: { userId },
    update: { points: { increment: points }, transactions: { create: { points, type: 'earn', note } } },
    create: { userId, points, transactions: { create: { points, type: 'earn', note } } }
  })
  return json({ data: member })
})
