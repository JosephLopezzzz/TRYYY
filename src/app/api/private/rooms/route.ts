import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const UpdateBody = z.object({ id: z.string(), status: z.enum(['AVAILABLE','OCCUPIED','DIRTY','OUT_OF_ORDER']) })

export const GET = api(async () => {
  await requirePermission('rooms.manage')
  const rooms = await prisma.room.findMany({ include: { roomType: true }, orderBy: { number: 'asc' } })
  return json({ data: rooms })
})

export const PATCH = api(async (req: NextRequest) => {
  await requirePermission('rooms.manage')
  const parsed = UpdateBody.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const updated = await prisma.room.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } })
  return json({ data: updated })
})
