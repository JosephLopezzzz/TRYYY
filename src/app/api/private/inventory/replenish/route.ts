import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({
  items: z.array(z.object({ id: z.string().optional(), sku: z.string().optional(), quantity: z.number().int().positive() })).min(1)
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('inventory.read')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }

  const updates = [] as any[]
  for (const it of parsed.data.items) {
    let item = null
    if (it.id) item = await prisma.inventoryItem.findUnique({ where: { id: it.id } })
    else if (it.sku) item = await prisma.inventoryItem.findUnique({ where: { sku: it.sku } })
    if (!item) continue
    const up = await prisma.inventoryItem.update({ where: { id: item.id }, data: { quantity: { increment: it.quantity } } })
    updates.push(up)
  }
  return json({ data: updates })
})
