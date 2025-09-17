import { NextRequest } from 'next/server'
import { json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Public endpoint for self-service kiosk to create queue tickets
const Body = z.object({ guestName: z.string().min(1), purpose: z.string().default('checkin') })

export const POST = async (req: NextRequest) => {
  try{
    const parsed = Body.safeParse(await req.json().catch(()=>null))
    if (!parsed.success) return new Response(JSON.stringify({ error: 'Validation failed', hint: parsed.error.flatten() }), { status: 400, headers: { 'content-type':'application/json' } })
    const t = await prisma.queueTicket.create({ data: { guestName: parsed.data.guestName, purpose: parsed.data.purpose } })
    return json({ data: t }, 201)
  }catch(e:any){
    return new Response(JSON.stringify({ error: e?.message ?? 'Internal error' }), { status: 500, headers: { 'content-type':'application/json' } })
  }
}
