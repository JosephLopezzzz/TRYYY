import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

export const GET = api(async () => {
  await requirePermission('inventory.read')
  const items = await prisma.inventoryItem.findMany({
    where: { quantity: { lt: prisma.inventoryItem.fields.threshold } },
    orderBy: { quantity: 'asc' },
    take: 200,
  })
  // Suggestions: order up to threshold * 2
  const suggestions = items.map((it) => ({
    id: it.id,
    sku: it.sku,
    name: it.name,
    quantity: it.quantity,
    threshold: it.threshold,
    suggestedOrderQty: Math.max(0, it.threshold * 2 - it.quantity),
  }))
  return json({ data: { items, suggestions } })
})


