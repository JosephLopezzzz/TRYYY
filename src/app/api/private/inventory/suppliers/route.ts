import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Upsert = z.object({ id: z.string().optional(), name: z.string(), email: z.string().email().optional(), phone: z.string().optional() })

export const GET = api(async () => {
  await requirePermission('inventory.read')
  const data = await prisma.supplier.findMany({ include: { items: true, purchaseOrders: true }, orderBy: { name: 'asc' } })
  return json({ data })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('inventory.read')
  const parsed = Upsert.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id, name, email, phone } = parsed.data
  const s = id
    ? await prisma.supplier.update({ where: { id }, data: { name, email, phone } })
    : await prisma.supplier.create({ data: { name, email, phone } })
  return json({ data: s })
})
