import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const CreateStaff = z.object({ name: z.string(), email: z.string().email(), role: z.string(), password: z.string().min(6) })
const UpdateStaff = z.object({ id: z.string(), role: z.string().optional(), password: z.string().min(6).optional() })

export const GET = api(async () => {
  await requirePermission('admin')
  const users = await prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' }, take: 200 })
  const roles = await prisma.role.findMany({ orderBy: { name: 'asc' } })
  return json({ data: { users, roles } })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('admin')
  const parsed = CreateStaff.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const role = await prisma.role.findUnique({ where: { name: parsed.data.role } })
  if (!role) { const e:any=new Error('Role not found'); e.status=404; throw e }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.user.create({ data: { name: parsed.data.name, email: parsed.data.email, passwordHash, roleId: role.id } })
  return json({ data: user }, 201)
})

export const PATCH = api(async (req: NextRequest) => {
  await requirePermission('admin')
  const parsed = UpdateStaff.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { id, role: roleName, password } = parsed.data
  let roleId: string | undefined
  if (roleName) {
    const role = await prisma.role.findUnique({ where: { name: roleName } })
    if (!role) { const e:any=new Error('Role not found'); e.status=404; throw e }
    roleId = role.id
  }
  const data: any = {}
  if (roleId) data.roleId = roleId
  if (password) data.passwordHash = await bcrypt.hash(password, 10)
  const updated = await prisma.user.update({ where: { id }, data, include: { role: true } })
  return json({ data: updated })
})
