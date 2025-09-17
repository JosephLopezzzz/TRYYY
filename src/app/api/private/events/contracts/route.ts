import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Upsert = z.object({ id: z.string().optional(), title: z.string(), organizer: z.string(), contact: z.string().optional(), start: z.string(), end: z.string(), venue: z.string(), notes: z.string().optional() })

export const GET = api(async () => {
  await requirePermission('events.manage')
  const data = await prisma.event.findMany({ include: { resources: true }, orderBy: { start: 'desc' } })
  return json({ data })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('events.manage')
  const parsed = Upsert.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id, title, organizer, contact, start, end, venue, notes } = parsed.data
  const data = { title, organizer, contact: contact ?? null, start: new Date(start), end: new Date(end), venue, notes: notes ?? null }
  const ev = id ? await prisma.event.update({ where: { id }, data }) : await prisma.event.create({ data })
  return json({ data: ev })
})
