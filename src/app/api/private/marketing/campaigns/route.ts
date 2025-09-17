import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateCampaign = z.object({ name: z.string(), channel: z.string(), startsAt: z.string(), endsAt: z.string(), budget: z.number().nonnegative() })

export const GET = api(async (req: NextRequest) => {
  await requirePermission('marketing.manage')
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? undefined
  const data = await prisma.marketingCampaign.findMany({ where: q ? { OR: [{ name: { contains: q } }, { channel: { contains: q } }] } : undefined, orderBy: { startsAt: 'desc' }, take: 200 })
  return json({ data })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('marketing.manage')
  const parsed = CreateCampaign.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { name, channel, startsAt, endsAt, budget } = parsed.data
  const created = await prisma.marketingCampaign.create({ data: { name, channel, startsAt: new Date(startsAt), endsAt: new Date(endsAt), budget } })
  return json({ data: created }, 201)
})
