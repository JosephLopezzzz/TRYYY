# HMS Core 2 (Next.js + Prisma + MySQL)

Modular Hotel Management System core built with Next.js 14 (App Router), Prisma 5 and MySQL. Includes RBAC, NextAuth credentials login, secured APIs, Tailwind UI, and Windows PowerShell scripts for setup and configuration.

## Quick Start (Windows 10)
1. Create MySQL DB: HMSCORE2 (or let Prisma create it).
2. Copy env and configure:
   - `copy .env.example .env`
   - Edit `DATABASE_URL` and `NEXTAUTH_SECRET`.
3. Setup and run:
   - `./scripts/setup.ps1 -DatabaseUrl "mysql://root:password@localhost:3306/HMSCORE2"`
   - App: http://localhost:3000
   - Demo login: admin@hotel.local / Admin@123

## Key Modules (implemented minimally)
- Front Desk: `check-in`/`check-out` APIs, UI in `src/app/dashboard/frontdesk/page.tsx`.
- Reservations: List/create in `src/app/dashboard/reservations/page.tsx` and `src/app/api/private/reservations/route.ts`.
- Billing, Inventory, Events, CRM, Rooms, Housekeeping, Marketing, Channels, Analytics: schema foundations for future expansion.

## Security / RBAC
- Auth: NextAuth credentials in `src/lib/auth.ts` with JWT sessions.
- RBAC: `src/lib/rbac.ts` and middleware `src/middleware.ts` protecting `/dashboard/*` and `/api/private/*`.
- Sessions: JWT; set `NEXTAUTH_SECRET`.

## Scripts
- `scripts/setup.ps1`: Installs deps, configures `.env`, runs Prisma generate/migrate/seed, starts dev.
- `scripts/configure.ps1`: Interactive-like toggles for theme and modules via params. Edits `src/config/app.config.json`.
- `scripts/git-init.ps1`: Initializes git, makes initial commit and tag `v0.1.0`.
- `scripts/deploy.ps1`: Builds artifacts for hosting and optional zip.

## Algorithms
- Reservation creation: validation via Zod; simple code generator `R{timestamp}`; default rate via `RoomType.baseRate`.
- Check-in/out: transactional status updates to `Reservation.status` and `Room.status` ensuring consistency.
- RBAC gate: permission check `perms.includes(perm) || perms.includes('admin')`.

## Error Handling
- API wrapper `api()` in `src/lib/errors.ts` catches errors and returns JSON `{ error, hint }` with proper HTTP status.
- Setup script prints remediation tips (Node version, MySQL running, credentials).

## Versions
- Node >= 18.18 < 21
- Next 14.2.6, React 18.2, Prisma 5.16.1, Tailwind 3.4.10, pnpm 9.6.0

## Continue Development
- Add module pages under `src/app/dashboard/*`.
- Extend APIs in `src/app/api/private/*`.
- Update schema in `prisma/schema.prisma`; run `pnpm prisma migrate dev`.
- Use `scripts/configure.ps1` to toggle modules/theme.
