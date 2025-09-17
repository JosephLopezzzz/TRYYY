import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

export const GET = api(async () => {
  await requirePermission('crm.read')
  const members = await prisma.loyaltyMember.findMany({ include: { user: true, transactions: true }, take: 200 })
  return json({ data: members })
})
