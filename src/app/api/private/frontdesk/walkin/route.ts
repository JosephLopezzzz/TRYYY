import { NextRequest } from 'next/server'
import { api, json } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const Body = z.object({
  guest: z.object({ firstName: z.string(), lastName: z.string(), email: z.string().email().optional(), phone: z.string().optional() }),
  checkIn: z.string(),
  checkOut: z.string(),
  adults: z.number().int().min(1).max(6).default(1),
  children: z.number().int().min(0).max(6).default(0),
  roomTypeId: z.string().optional(),
  paymentMethod: z.enum(['cash', 'card', 'online']).default('cash'),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  notes: z.string().optional()
})

export const POST = api(async (req: NextRequest) => {
  await requirePermission('frontdesk.manage')
  const parsed = Body.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) { const e:any=new Error('Validation failed'); e.status=400; e.hint=parsed.error.flatten(); throw e }
  const { guest, checkIn, checkOut, adults, children, roomTypeId, paymentMethod, idType, idNumber, notes } = parsed.data

  const start = new Date(checkIn); const end = new Date(checkOut)
  if (!(end > start)) { const e:any=new Error('checkOut must be after checkIn'); e.status=400; throw e }

  // Find available room
  let room = null
  if (roomTypeId) {
    const availableRooms = await prisma.room.findMany({
      where: { 
        roomTypeId, 
        status: 'AVAILABLE',
        reservations: { none: { status: { in: ['BOOKED', 'CHECKED_IN'] }, OR: [{ checkIn: { lt: end }, checkOut: { gt: start } }] } }
      },
      include: { roomType: true },
      take: 1
    })
    room = availableRooms[0] || null
  }

  // Calculate dynamic rate
  const baseRate = room ? Number(room.roomType.baseRate) : 100
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))
  const occupancy = await prisma.room.count({ where: { status: 'OCCUPIED' } }) / await prisma.room.count() || 0
  const dynamicRate = baseRate * (1 + 0.3 * occupancy) * nights

  // Create guest
  const createdGuest = await prisma.guest.create({ data: { ...guest } })
  
  // Create walk-in reservation
  const code = `W${Date.now().toString().slice(-6)}`
  const reservation = await prisma.reservation.create({
    data: {
      code,
      guestId: createdGuest.id,
      roomId: room?.id,
      checkIn: start,
      checkOut: end,
      adults, children,
      rate: dynamicRate,
      notes: notes ?? undefined,
      walkIn: true,
      idScanUrl: idNumber ? `id_scan_${Date.now()}` : undefined,
      checkInVerified: true
    },
    include: { guest: true, room: { include: { roomType: true } } }
  })

  // Create folio
  await prisma.folio.create({ data: { guestId: createdGuest.id, reservationId: reservation.id } })

  // Add room charges
  const folio = await prisma.folio.findUnique({ where: { reservationId: reservation.id } })
  if (folio) {
    await prisma.folioItem.create({ 
      data: { 
        folioId: folio.id, 
        type: 'room', 
        amount: dynamicRate, 
        note: `${nights} night(s) - ${room?.roomType.name || 'Standard'}` 
      } 
    })
  }

  return json({ data: { reservation, room, rate: dynamicRate, paymentMethod } }, 201)
})
