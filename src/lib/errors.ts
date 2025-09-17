import { NextRequest, NextResponse } from 'next/server'

export type ApiHandler<T = any> = (req: NextRequest) => Promise<NextResponse<T>>

export function json(data: any, init: number | ResponseInit = 200) {
  const status = typeof init === 'number' ? init : (init as any).status ?? 200
  return NextResponse.json(data, typeof init === 'number' ? { status } : init)
}

export function api(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (e: any) {
      const status = e?.status ?? 500
      const message = e?.message ?? 'Internal Server Error'
      const hint = e?.hint
      return json({ error: message, hint }, status)
    }
  }
}
