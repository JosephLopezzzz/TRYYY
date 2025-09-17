import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const CreateReservation = z.object({
  guest: z.object({ firstName: z.string(), lastName: z.string(), email: z.string().email().optional(), phone: z.string().optional() }),
  roomId: z.string().optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  adults: z.number().int().min(1).max(6).default(1),
  children: z.number().int().min(0).max(6).default(0),
  notes: z.string().optional()
})

export const GET = api(async (req: NextRequest) => {
  await requirePermission('reservations.read')
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? undefined
  const data = await prisma.reservation.findMany({
    where: q ? { OR: [
      { code: { contains: q } },
      { guest: { OR: [{ firstName: { contains: q } }, { lastName: { contains: q } }] } }
    ] } : undefined,
    include: { guest: true, room: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
  return json({ data })
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('reservations.write')
  const body = await req.json().catch(() => { const e:any=new Error('Invalid JSON'); e.status=400; throw e })
  const parsed = CreateReservation.safeParse(body)
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { guest, roomId, checkIn, checkOut, adults, children, notes } = parsed.data

  const start = new Date(checkIn); const end = new Date(checkOut)
  if (!(end > start)) { const e:any=new Error('checkOut must be after checkIn'); e.status=400; throw e }

  const room = roomId ? await prisma.room.findUnique({ where: { id: roomId } }) : null
  if (roomId && !room) { const e:any=new Error('Room not found'); e.status=404; throw e }

  const createdGuest = await prisma.guest.create({ data: { ...guest } })
  const code = `R${Date.now().toString().slice(-6)}`
  const reservation = await prisma.reservation.create({
    data: {
      code,
      guestId: createdGuest.id,
      roomId: room?.id,
      checkIn: start,
      checkOut: end,
      adults, children,
      rate: room ? (await prisma.roomType.findUnique({ where: { id: room.roomTypeId } }))!.baseRate : 0,
      notes: notes ?? undefined
    },
    include: { guest: true, room: true }
  })

  // create folio
  await prisma.folio.create({ data: { guestId: createdGuest.id, reservationId: reservation.id } })

  return json({ data: reservation }, 201)
})
