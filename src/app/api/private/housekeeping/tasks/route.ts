import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateTask = z.object({ roomId: z.string(), type: z.string().default('cleaning') })
const UpdateTask = z.object({ id: z.string(), status: z.enum(['pending','in_progress','done']) })

export const GET = api(async () => {
  await requirePermission('housekeeping.manage')
  const tasks = await prisma.housekeepingTask.findMany({ include: { room: true }, orderBy: { createdAt: 'desc' }, take: 100 })
  return json({ data: tasks })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('housekeeping.manage')
  const body = await req.json().catch(()=>null)
  const create = CreateTask.safeParse(body)
  if (!create.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=create.error.flatten(); throw e }
  const task = await prisma.housekeepingTask.create({ data: { roomId: create.data.roomId, type: create.data.type } })
  return json({ data: task }, 201)
})

export const PATCH = api(async (req: NextRequest) => {
  await requirePermission('housekeeping.manage')
  const body = await req.json().catch(()=>null)
  const upd = UpdateTask.safeParse(body)
  if (!upd.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=upd.error.flatten(); throw e }
  const updated = await prisma.housekeepingTask.update({ where: { id: upd.data.id }, data: { status: upd.data.status } })
  return json({ data: updated })
})
