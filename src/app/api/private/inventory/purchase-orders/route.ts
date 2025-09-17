import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Upsert = z.object({ id: z.string().optional(), supplierId: z.string(), total: z.number().nonnegative(), status: z.string().optional() })

export const GET = api(async () => {
  await requirePermission('inventory.read')
  const data = await prisma.purchaseOrder.findMany({ include: { supplier: true }, orderBy: { createdAt: 'desc' } })
  return json({ data })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('inventory.read')
  const parsed = Upsert.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id, supplierId, total, status } = parsed.data
  const po = id
    ? await prisma.purchaseOrder.update({ where: { id }, data: { supplierId, total, status: status ?? undefined } })
    : await prisma.purchaseOrder.create({ data: { supplierId, total, status: status ?? 'open' } })
  return json({ data: po })
})
