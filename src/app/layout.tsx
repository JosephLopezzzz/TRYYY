import './globals.css'
import { ReactNode } from 'react'
import { Providers } from '@/components/providers'

export const metadata = {
  title: 'HMS Core 2',
  description: 'Hotel Management System Core',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <main className="min-h-screen p-3 md:p-4">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
