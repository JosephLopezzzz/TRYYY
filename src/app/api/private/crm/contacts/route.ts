import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateContact = z.object({ name: z.string(), email: z.string().email().optional(), phone: z.string().optional(), tags: z.string().optional(), guestId: z.string().optional() })

export const GET = api(async (req: NextRequest) => {
  await requirePermission('crm.read')
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? undefined
  const contacts = await prisma.cRMContact.findMany({
    where: q ? { OR: [ { name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } } ] } : undefined,
    include: { guest: true },
    orderBy: { name: 'asc' },
    take: 200
  })
  return json({ data: contacts })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('crm.write')
  const parsed = CreateContact.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const c = await prisma.cRMContact.create({ data: parsed.data })
  return json({ data: c }, 201)
})
