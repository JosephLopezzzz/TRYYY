import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

export const GET = api(async (req: NextRequest) => {
  await requirePermission('crm.read')
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId') || undefined
  const email = url.searchParams.get('email') || undefined

  let user = null
  if (userId) user = await prisma.user.findUnique({ where: { id: userId } })
  else if (email) user = await prisma.user.findUnique({ where: { email } })
  if (!user) { const e:any=new Error('User not found'); e.status=404; throw e }

  let member = await prisma.loyaltyMember.findUnique({ where: { userId: user.id } })
  if (!member) member = await prisma.loyaltyMember.create({ data: { userId: user.id, points: 0 } })
  return json({ data: member })
})
