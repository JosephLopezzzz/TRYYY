import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateEvent = z.object({ title: z.string(), organizer: z.string(), contact: z.string().optional(), start: z.string(), end: z.string(), venue: z.string(), notes: z.string().optional() })

export const GET = api(async (req: NextRequest) => {
  await requirePermission('events.manage')
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? undefined
  const events = await prisma.event.findMany({
    where: q ? { OR: [ { title: { contains: q } }, { organizer: { contains: q } }, { venue: { contains: q } } ] } : undefined,
    orderBy: { start: 'desc' },
    take: 200
  })
  return json({ data: events })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('events.manage')
  const parsed = CreateEvent.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { title, organizer, contact, start, end, venue, notes } = parsed.data
  const ev = await prisma.event.create({ data: { title, organizer, contact, start: new Date(start), end: new Date(end), venue, notes } })
  return json({ data: ev }, 201)
})
