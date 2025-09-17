import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({ contactId: z.string(), channel: z.string(), message: z.string(), sentiment: z.string().optional() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('crm.write')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { contactId, channel, message, sentiment } = parsed.data
  const item = await prisma.interaction.create({ data: { contactId, channel, message, sentiment: sentiment ?? null } })
  return json({ data: item }, 201)
})
