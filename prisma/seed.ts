import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Permissions
  const perms = [
    'reservations.read','reservations.write','frontdesk.manage','billing.read','billing.write','inventory.read','inventory.write','events.manage','crm.read','crm.write','rooms.manage','housekeeping.manage','marketing.manage','channels.manage','analytics.read','admin']
  const permissions = await Promise.all(perms.map(name => prisma.permission.upsert({ where: { name }, update: {}, create: { name } })))

  // Roles
  const roleMap: Record<string,string[]> = {
    Admin: perms,
    FrontDesk: ['reservations.read','reservations.write','frontdesk.manage','billing.read','rooms.manage','housekeeping.manage'],
    Manager: ['analytics.read','inventory.read','events.manage','crm.read','billing.read','rooms.manage'],
    Housekeeping: ['housekeeping.manage','rooms.manage'],
    Accountant: ['billing.read','billing.write']
  }

  const roles = await Promise.all(Object.entries(roleMap).map(async ([name, p]) => {
    const rp = permissions.filter(x => p.includes(x.name))
    return prisma.role.upsert({ where: { name }, update: { permissions: { set: rp.map(x=>({ id: x.id })) } }, create: { name, permissions: { connect: rp.map(x=>({ id: x.id })) } } })
  }))

  // Users
  const adminRole = roles.find(r => r.name === 'Admin')!
  const passwordHash = await bcrypt.hash('Admin@123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@hotel.local' },
    update: {},
    create: { email: 'admin@hotel.local', name: 'Administrator', passwordHash, roleId: adminRole.id }
  })

  // Sample staff for each role
  const createUser = async (email: string, name: string, roleName: string) => {
    const role = roles.find(r => r.name === roleName)!
    const hash = await bcrypt.hash('Password@123', 10)
    return prisma.user.upsert({ where: { email }, update: {}, create: { email, name, passwordHash: hash, roleId: role.id } })
  }
  await Promise.all([
    createUser('frontdesk@hotel.local','Front Desk','FrontDesk'),
    createUser('manager@hotel.local','Manager','Manager'),
    createUser('housekeeping@hotel.local','House Keeping','Housekeeping'),
    createUser('accountant@hotel.local','Accountant','Accountant')
  ])

  // Room types and rooms
  const standard = await prisma.roomType.upsert({ where: { name: 'Standard' }, update: {}, create: { name: 'Standard', capacity: 2, baseRate: 100.00 } })
  const deluxe = await prisma.roomType.upsert({ where: { name: 'Deluxe' }, update: {}, create: { name: 'Deluxe', capacity: 3, baseRate: 180.00 } })
  const suite = await prisma.roomType.upsert({ where: { name: 'Suite' }, update: {}, create: { name: 'Suite', capacity: 4, baseRate: 250.00 } })
  const premium = await prisma.roomType.upsert({ where: { name: 'Premium' }, update: {}, create: { name: 'Premium', capacity: 2, baseRate: 200.00 } })
  
  // Floor 1 - 15 rooms (101-115)
  const roomTypes1 = [suite, suite, standard, suite, suite, suite, deluxe, standard, deluxe, suite, premium, deluxe, standard, premium, deluxe]
  for (let i=101;i<=115;i++) {
    const roomType = roomTypes1[i-101]
    await prisma.room.upsert({ 
      where: { number: String(i) }, 
      update: {}, 
      create: { 
        number: String(i), 
        floor: 1, 
        roomTypeId: roomType.id,
        status: i % 3 === 0 ? 'OCCUPIED' : i % 5 === 0 ? 'DIRTY' : 'AVAILABLE'
      } 
    })
  }
  
  // Floor 2 - 15 rooms (201-215)
  const roomTypes2 = [suite, deluxe, standard, premium, suite, deluxe, standard, premium, suite, deluxe, standard, premium, suite, deluxe, standard]
  for (let i=201;i<=215;i++) {
    const roomType = roomTypes2[i-201]
    await prisma.room.upsert({ 
      where: { number: String(i) }, 
      update: {}, 
      create: { 
        number: String(i), 
        floor: 2, 
        roomTypeId: roomType.id,
        status: i % 4 === 0 ? 'OCCUPIED' : i % 6 === 0 ? 'DIRTY' : 'AVAILABLE'
      } 
    })
  }
  
  // Floor 3 - 15 rooms (301-315)
  const roomTypes3 = [premium, suite, deluxe, suite, standard, premium, deluxe, premium, standard, premium, suite, premium, standard, deluxe, suite]
  for (let i=301;i<=315;i++) {
    const roomType = roomTypes3[i-301]
    await prisma.room.upsert({ 
      where: { number: String(i) }, 
      update: {}, 
      create: { 
        number: String(i), 
        floor: 3, 
        roomTypeId: roomType.id,
        status: i % 5 === 0 ? 'OCCUPIED' : i % 7 === 0 ? 'DIRTY' : i % 11 === 0 ? 'OUT_OF_ORDER' : 'AVAILABLE'
      } 
    })
  }
  
  // Floor 4 - 15 rooms (401-415)
  const roomTypes4 = [suite, deluxe, standard, premium, suite, deluxe, standard, premium, suite, deluxe, standard, premium, suite, deluxe, standard]
  for (let i=401;i<=415;i++) {
    const roomType = roomTypes4[i-401]
    await prisma.room.upsert({ 
      where: { number: String(i) }, 
      update: {}, 
      create: { 
        number: String(i), 
        floor: 4, 
        roomTypeId: roomType.id,
        status: i % 3 === 0 ? 'OCCUPIED' : i % 5 === 0 ? 'DIRTY' : i % 8 === 0 ? 'OUT_OF_ORDER' : 'AVAILABLE'
      } 
    })
  }

  // RatePlan demo
  const rp = await prisma.ratePlan.upsert({ where: { name: 'BAR' }, update: {}, create: { name: 'BAR', desc: 'Best Available Rate' } })
  const today = new Date();
  for (let d=0; d<7; d++) {
    const date = new Date(today); date.setDate(today.getDate()+d)
    await prisma.rate.upsert({
      where: { roomTypeId_ratePlanId_date: { roomTypeId: standard.id, ratePlanId: rp.id, date } },
      update: { price: 100 + d*2 },
      create: { roomTypeId: standard.id, ratePlanId: rp.id, date, price: 100 + d*2 }
    })
  }

  // Sample guests (email is not unique => emulate upsert)
  const ensureGuest = async (firstName: string, lastName: string, email?: string | null, phone?: string | null) => {
    const existing = email ? await prisma.guest.findFirst({ where: { email } }) : null
    if (existing) return existing
    return prisma.guest.create({ data: { firstName, lastName, email: email ?? undefined, phone: phone ?? undefined } })
  }
  const g1 = await ensureGuest('John','Doe','john.doe@example.com','555-0100')
  const g2 = await ensureGuest('Jane','Smith','jane.smith@example.com','555-0101')

  // Sample reservations with folios
  const res1 = await prisma.reservation.upsert({
    where: { code: 'R100001' },
    update: {},
    create: { 
      code: 'R100001', 
      guestId: g1.id, 
      roomId: (await prisma.room.findUnique({ where: { number: '101' } }))!.id, 
      checkIn: new Date(), 
      checkOut: new Date(Date.now()+86400000), 
      adults: 1, 
      children: 0, 
      rate: 100,
      idScanUrl: null,
      digitalKeyIssued: false,
      checkInVerified: false,
      walkIn: false
    }
  })
  await prisma.folio.upsert({ where: { reservationId: res1.id }, update: {}, create: { guestId: g1.id, reservationId: res1.id } })

  const res2 = await prisma.reservation.upsert({
    where: { code: 'R100002' },
    update: {},
    create: { 
      code: 'R100002', 
      guestId: g2.id, 
      roomId: (await prisma.room.findUnique({ where: { number: '201' } }))!.id, 
      checkIn: new Date(), 
      checkOut: new Date(Date.now()+2*86400000), 
      adults: 2, 
      children: 1, 
      rate: 180,
      idScanUrl: null,
      digitalKeyIssued: false,
      checkInVerified: false,
      walkIn: false
    }
  })
  await prisma.folio.upsert({ where: { reservationId: res2.id }, update: {}, create: { guestId: g2.id, reservationId: res2.id } })

  // Inventory sample
  await Promise.all([
    prisma.inventoryItem.upsert({ where: { sku: 'LIN-STD' }, update: {}, create: { name: 'Linens - Standard', sku: 'LIN-STD', quantity: 120, unit: 'pcs', threshold: 40 } }),
    prisma.inventoryItem.upsert({ where: { sku: 'TOIL-SET' }, update: {}, create: { name: 'Toiletries Set', sku: 'TOIL-SET', quantity: 500, unit: 'sets', threshold: 100 } })
  ])

  // Marketing campaigns (name not unique => emulate upsert)
  const ensureCampaign = async (name: string, channel: string, startsAt: Date, endsAt: Date, budget: number) => {
    const existing = await prisma.marketingCampaign.findFirst({ where: { name, channel } })
    if (existing) return existing
    return prisma.marketingCampaign.create({ data: { name, channel, startsAt, endsAt, budget } })
  }
  await Promise.all([
    ensureCampaign('Autumn Promo', 'Email', new Date(), new Date(Date.now()+30*86400000), 1000),
    ensureCampaign('Weekend Flash Sale', 'Social', new Date(), new Date(Date.now()+7*86400000), 500)
  ])

  // Channels (name may not be unique => emulate upsert)
  const ensureChannel = async (name: string, apiKey?: string) => {
    const existing = await prisma.channel.findFirst({ where: { name } })
    if (existing) return existing
    return prisma.channel.create({ data: { name, apiKey } })
  }
  await Promise.all([
    ensureChannel('Booking.com', 'demo-booking'),
    ensureChannel('Expedia', 'demo-expedia')
  ])

  // Loyalty sample
  const admin = await prisma.user.findUnique({ where: { email: 'admin@hotel.local' } })
  if (admin) {
    await prisma.loyaltyMember.upsert({ where: { userId: admin.id }, update: { points: 100 }, create: { userId: admin.id, points: 100 } })
  }

  // Queue sample tickets (only if table exists)
  try {
    const rows = await prisma.$queryRawUnsafe("SELECT COUNT(*) as c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'queueticket'") as any[]
    const exists = Array.isArray(rows) && rows[0] && Number((rows[0] as any).c) > 0
    if (exists) {
      const qtCount = await prisma.queueTicket.count()
      if (qtCount === 0) {
        await prisma.queueTicket.createMany({ data: [
          { guestName: 'John Doe', purpose: 'checkin', status: 'waiting' },
          { guestName: 'Jane Smith', purpose: 'inquiry', status: 'waiting' },
          { guestName: 'Alex Cruz', purpose: 'checkout', status: 'waiting' },
        ] })
      }
    }
  } catch {}

  console.log('Seed complete')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(()=> prisma.$disconnect())
