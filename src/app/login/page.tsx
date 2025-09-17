"use client"
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('admin@hotel.local')
  const [password, setPassword] = useState('Admin@123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = useSearchParams()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await signIn('credentials', { redirect: false, email, password, callbackUrl: params.get('callbackUrl') ?? '/dashboard' })
      if (res?.error) setError(res.error)
      else if (res?.ok) window.location.href = res.url ?? '/dashboard'
    } catch (e: any) {
      setError(e?.message ?? 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-[#0f172a] text-white shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign in to your account</h1>
        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <div className="text-sm mb-1">Email</div>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <div className="text-sm mb-1">Password</div>
            <input className="w-full rounded bg-white/10 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="w-full rounded bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-3 py-2 disabled:opacity-60" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="text-xs text-white/60 mt-4 text-center">Demo: admin@hotel.local / Admin@123</div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
