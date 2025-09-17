import { NextRequest, NextResponse } from 'next/server'
import { json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

export async function GET(_req: NextRequest, ctx: { params: { reservationId: string } }) {
  try {
    await requirePermission('billing.read')
    const { reservationId } = ctx.params
    const folio = await prisma.folio.findFirst({
      where: { reservationId },
      include: { items: true, payments: true, reservation: { include: { guest: true, room: true } } }
    })
    if (!folio) return json({ error: 'Folio not found', hint: 'Ensure reservation exists and has a folio' }, 404)
    const charges = folio.items.reduce((s: number, i) => s + Number(i.amount), 0)
    const payments = folio.payments.reduce((s: number, p) => s + Number(p.amount), 0)
    const balance = charges - payments
    return json({ data: { ...folio, balance } })
  } catch (e: any) {
    const status = e?.status ?? 500
    const message = e?.message ?? 'Internal Server Error'
    const hint = e?.hint
    return new NextResponse(JSON.stringify({ error: message, hint }), { status, headers: { 'content-type': 'application/json' } })
  }
}
