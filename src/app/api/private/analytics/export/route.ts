import { NextRequest, NextResponse } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

function toCSV(rows: any[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: any) => ('"' + String(v ?? '').replace(/"/g,'""') + '"')
  const lines = [headers.join(',')]
  for (const r of rows) lines.push(headers.map(h=>escape(r[h])).join(','))
  return lines.join('\n')
}

export const GET = api(async (req: NextRequest) => {
  await requirePermission('analytics.read')
  const url = new URL(req.url)
  const type = url.searchParams.get('type') || 'reservations'
  const format = (url.searchParams.get('format') || 'csv').toLowerCase()

  let rows: any[] = []
  if (type === 'reservations') {
    const items = await prisma.reservation.findMany({ include: { guest: true, room: true }, orderBy: { createdAt: 'desc' }, take: 1000 })
    rows = items.map((r:any)=>({ code: r.code, guest: `${r.guest.firstName} ${r.guest.lastName}`.trim(), room: r.room?.number ?? '', checkIn: r.checkIn.toISOString(), checkOut: r.checkOut.toISOString(), status: r.status }))
  } else if (type === 'revenue') {
    const items = await prisma.payment.findMany({ include: { folio: { include: { reservation: true } } }, orderBy: { createdAt: 'desc' }, take: 2000 })
    rows = items.map((p:any)=>({ amount: p.amount.toString(), method: p.method, currency: p.currency, createdAt: p.createdAt.toISOString(), resCode: p.folio.reservation?.code ?? '' }))
  } else if (type === 'occupancy') {
    const rooms = await prisma.room.findMany({ include: { reservations: true } })
    rows = rooms.map((r:any)=>({ room: r.number, status: r.status, futureBookings: r.reservations.filter((x:any)=>x.status!=='CANCELED').length }))
  } else {
    return json({ error: 'Unknown type' } as any, 400)
  }

  if (format !== 'csv') {
    return json({ data: rows })
  }
  const csv = toCSV(rows)
  return new NextResponse(csv, { headers: { 'content-type': 'text/csv', 'content-disposition': `attachment; filename=${type}.csv` } })
})
