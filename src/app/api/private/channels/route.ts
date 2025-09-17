import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateChannel = z.object({ name: z.string(), apiKey: z.string().optional(), active: z.boolean().default(true) })

export const GET = api(async (req: NextRequest) => {
  await requirePermission('channels.manage')
  const data = await prisma.channel.findMany({ orderBy: { name: 'asc' }, take: 200 })
  return json({ data })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('channels.manage')
  const parsed = CreateChannel.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const created = await prisma.channel.create({ data: parsed.data })
  return json({ data: created }, 201)
})
