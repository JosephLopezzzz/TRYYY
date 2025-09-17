import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

// Simple segmentation by tag or email/phone search
const SegmentPost = z.object({ tag: z.string().optional(), q: z.string().optional() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('crm.read')
  const parsed = SegmentPost.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { tag, q } = parsed.data
  const data = await prisma.cRMContact.findMany({
    where: {
      ...(tag ? { tags: { contains: tag } } : {}),
      ...(q ? { OR: [{ email: { contains: q } }, { phone: { contains: q } }, { name: { contains: q } }] } : {})
    },
    orderBy: { name: 'asc' }
  })
  return json({ data })
})

export const GET = api(async (req: NextRequest) => {
  await requirePermission('crm.read')
  const url = new URL(req.url)
  const tag = url.searchParams.get('tag') ?? undefined
  const q = url.searchParams.get('q') ?? undefined
  const data = await prisma.cRMContact.findMany({
    where: {
      ...(tag ? { tags: { contains: tag } } : {}),
      ...(q ? { OR: [{ email: { contains: q } }, { phone: { contains: q } }, { name: { contains: q } }] } : {})
    },
    orderBy: { name: 'asc' }
  })
  return json({ data })
})
