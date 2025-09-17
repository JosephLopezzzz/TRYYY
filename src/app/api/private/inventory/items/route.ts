import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateItem = z.object({ name: z.string(), sku: z.string(), quantity: z.number().int().nonnegative().default(0), location: z.string().optional(), threshold: z.number().int().nonnegative().default(10), unit: z.string().default('unit') })

export const GET = api(async (req: NextRequest) => {
  await requirePermission('inventory.read')
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? undefined
  const items = await prisma.inventoryItem.findMany({ where: q ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }] } : undefined, orderBy: { name: 'asc' }, take: 200 })
  return json({ data: items })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('inventory.write')
  const parsed = CreateItem.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const item = await prisma.inventoryItem.create({ data: parsed.data })
  return json({ data: item }, 201)
})
