"use client"
import { createContext, useContext, useState, ReactNode } from 'react'
import { Notification } from '@/components/modal'

interface NotificationState {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  id: string
}

interface NotificationContextType {
  showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showWarning: (message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationState[]>([])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { type, message, id }])
  }

  const showSuccess = (message: string) => showNotification('success', message)
  const showError = (message: string) => showNotification('error', message)
  const showInfo = (message: string) => showNotification('info', message)
  const showWarning = (message: string) => showNotification('warning', message)

  return (
    <NotificationContext.Provider value={{ showNotification, showSuccess, showError, showInfo, showWarning }}>
      {children}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
