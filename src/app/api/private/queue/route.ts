import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateTicket = z.object({ guestName: z.string(), purpose: z.string().default('checkin') })
const UpdateTicket = z.object({ id: z.string(), status: z.enum(['waiting','serving','done']).default('serving') })

export const GET = api(async () => {
  await requirePermission('frontdesk.manage')
  const tickets = await prisma.queueTicket.findMany({ orderBy: { createdAt: 'asc' }, take: 200 })
  return json({ data: tickets })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const parsed = CreateTicket.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { guestName, purpose } = parsed.data
  const t = await prisma.queueTicket.create({ data: { guestName, purpose } })
  return json({ data: t }, 201)
})

export const PATCH = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const parsed = UpdateTicket.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id, status } = parsed.data
  const updated = await prisma.queueTicket.update({ where: { id }, data: { status } })
  return json({ data: updated })
})
