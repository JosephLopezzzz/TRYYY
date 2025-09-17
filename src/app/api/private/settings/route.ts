import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { requirePermission } from '@/lib/rbac'
import { promises as fs } from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'src', 'config', 'app.config.json')

export const GET = api(async () => {
  await requirePermission('admin')
  const raw = await fs.readFile(CONFIG_PATH, 'utf8').catch(async (e)=>{
    if ((e as any)?.code === 'ENOENT') {
      const def = { hotelName: 'Demo Hotel', timezone: 'Asia/Manila', currency: 'USD', theme: 'dark' }
      await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true })
      await fs.writeFile(CONFIG_PATH, JSON.stringify(def, null, 2), 'utf8')
      return JSON.stringify(def)
    }
    throw e
  })
  return json({ data: JSON.parse(raw) })
})

export const PUT = api(async (req: NextRequest) => {
  await requirePermission('admin')
  const body = await req.json().catch(()=>{ const e:any=new Error('Invalid JSON'); e.status=400; throw e })
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true })
  await fs.writeFile(CONFIG_PATH, JSON.stringify(body, null, 2), 'utf8')
  return json({ data: body })
})
