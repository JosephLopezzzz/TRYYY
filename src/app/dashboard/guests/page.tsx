"use client"
import { useEffect, useState } from 'react'

export default function GuestsPage(){
  const [list, setList] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'' })
  const [busy, setBusy] = useState(false)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/private/guests')
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to load')
      setList(j.data)
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function create(e: React.FormEvent){
    e.preventDefault(); setBusy(true)
    try{
      const res = await fetch('/api/private/guests',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email||undefined, phone: form.phone||undefined }) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to create guest')
      setForm({ firstName:'', lastName:'', email:'', phone:'' }); await load()
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Guests</div>
          <div className="text-sm text-gray-500">Manage guest profiles</div>
        </div>
        <button className="btn" onClick={load} disabled={loading}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      <div className="card">
        <form onSubmit={create} className="grid md:grid-cols-4 gap-3">
          <div><div className="label">First Name</div><input className="input" value={form.firstName} onChange={e=>setForm(f=>({ ...f, firstName:e.target.value }))} required/></div>
          <div><div className="label">Last Name</div><input className="input" value={form.lastName} onChange={e=>setForm(f=>({ ...f, lastName:e.target.value }))} required/></div>
          <div><div className="label">Email</div><input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email:e.target.value }))} /></div>
          <div><div className="label">Phone</div><input className="input" value={form.phone} onChange={e=>setForm(f=>({ ...f, phone:e.target.value }))} /></div>
          <div className="md:col-span-4"><button className="btn" disabled={busy}>{busy?'Creating...':'Create Guest'}</button></div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Phone</th><th className="p-2">Created</th></tr>
          </thead>
          <tbody>
            {loading && (<tr><td colSpan={4} className="p-2">Loading...</td></tr>)}
            {list?.map((g:any)=>(
              <tr key={g.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{g.firstName} {g.lastName}</td>
                <td className="p-2">{g.email ?? '-'}</td>
                <td className="p-2">{g.phone ?? '-'}</td>
                <td className="p-2">{new Date(g.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
