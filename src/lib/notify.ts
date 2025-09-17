import { prisma } from '@/lib/prisma'

type NotifyChannel = 'email' | 'sms'

export type NotificationPayload = {
  to: string
  subject?: string
  message: string
  channel: NotifyChannel
  meta?: Record<string, any>
}

// NOTE: This is a stub transport that records notifications to AuditLog.
// Integrate real providers (SMTP, SendGrid, Twilio) here later.
export async function sendNotification(payload: NotificationPayload) {
  await prisma.auditLog.create({
    data: {
      action: `notify.${payload.channel}`,
      entity: payload.to,
      note: `${payload.subject ? payload.subject + ' — ' : ''}${payload.message}`,
    },
  })
  return { ok: true }
}

export async function sendEmail(to: string, subject: string, message: string, meta?: Record<string, any>) {
  return sendNotification({ to, subject, message, channel: 'email', meta })
}

export async function sendSMS(to: string, message: string, meta?: Record<string, any>) {
  return sendNotification({ to, message, channel: 'sms', meta })
}


