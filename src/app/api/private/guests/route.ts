import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateGuest = z.object({ firstName: z.string(), lastName: z.string(), email: z.string().email().optional(), phone: z.string().optional(), preferences: z.any().optional() })

export const GET = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? undefined
  const guests = await prisma.guest.findMany({
    where: q ? { OR: [ { firstName: { contains: q } }, { lastName: { contains: q } }, { email: { contains: q } } ] } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200
  })
  return json({ data: guests })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const parsed = CreateGuest.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const g = await prisma.guest.create({ data: parsed.data })
  return json({ data: g }, 201)
})
