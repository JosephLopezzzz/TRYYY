"use client"
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { NotificationProvider } from '@/hooks/useNotification'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
