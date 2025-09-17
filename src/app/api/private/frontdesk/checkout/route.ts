import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
// use string literals for statuses to avoid TS enum import issues
import { z } from 'zod'

const Body = z.object({ reservationId: z.string() })

export const POST = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const body = await req.json().catch(() => { const e:any=new Error('Invalid JSON'); e.status=400; throw e })
  const parsed = Body.safeParse(body)
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }

  const resv = await prisma.reservation.findUnique({ where: { id: parsed.data.reservationId }, include: { folio: { include: { items: true, payments: true } } } })
  if (!resv) { const e:any=new Error('Reservation not found'); e.status=404; throw e }
  if (resv.status !== 'CHECKED_IN') { const e:any=new Error('Only CHECKED_IN reservations can be checked out'); e.status=400; throw e }

  const result = await prisma.$transaction(async (tx: any) => {
    // Ensure folio exists
    let folio = resv.folio ?? await tx.folio.create({ data: { guestId: (await tx.reservation.findUnique({ where: { id: resv.id }, select: { guestId: true } }))!.guestId, reservationId: resv.id } })

    // Ensure room charges exist (simple: nightly charge based on stored rate)
    const nights = Math.max(1, Math.ceil((resv.checkOut.getTime() - resv.checkIn.getTime()) / 86400000))
    const needed = nights
    const existingRoomItems = folio.items.filter((i: any) => i.type === 'room')
    const toAdd = Math.max(0, needed - existingRoomItems.length)
    for (let i = 0; i < toAdd; i++) {
      await tx.folioItem.create({ data: { folioId: folio.id, type: 'room', amount: resv.rate, note: 'Room night' } })
    }
    // Reload folio after potential additions
    folio = await tx.folio.findUnique({ where: { id: folio.id }, include: { items: true, payments: true } }) as any
    const charges = folio.items.reduce((s: number, i: any) => s + Number(i.amount), 0)
    const payments = folio.payments.reduce((s: number, p: any) => s + Number(p.amount), 0)
    const balance = charges - payments

    // If settled, create invoice if not exists
    let invoice = await tx.invoice.findUnique({ where: { folioId: folio.id } }).catch(() => null)
    if (balance <= 0 && !invoice) {
      const lastNumber = 'INV-' + Date.now().toString().slice(-8)
      invoice = await tx.invoice.create({ data: { folioId: folio.id, number: lastNumber } })
    }

    // Update reservation and room
    const r = await tx.reservation.update({ where: { id: resv.id }, data: { status: 'CHECKED_OUT' } })
    if (r.roomId) { await tx.room.update({ where: { id: r.roomId }, data: { status: 'DIRTY' } }) }

    return { reservation: r, folio: { id: folio.id, charges, payments, balance }, invoice }
  })

  return json({ data: result })
})
