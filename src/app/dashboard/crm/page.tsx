"use client"
import { useEffect, useState } from 'react'

export default function CRMPage(){
  const [list, setList] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', tags:'', guestId:'' })
  const [busy, setBusy] = useState(false)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/private/crm/contacts')
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to load contacts')
      setList(j.data)
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function create(e: React.FormEvent){
    e.preventDefault(); setBusy(true)
    try{
      const res = await fetch('/api/private/crm/contacts',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: form.name, email: form.email||undefined, phone: form.phone||undefined, tags: form.tags||undefined, guestId: form.guestId||undefined }) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to create contact')
      setForm({ name:'', email:'', phone:'', tags:'', guestId:'' }); await load()
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">CRM Contacts</div>
          <div className="text-sm text-gray-500">Manage guest contacts and tags</div>
        </div>
        <button className="btn" disabled={loading} onClick={load}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      <div className="card">
        <form onSubmit={create} className="grid md:grid-cols-5 gap-3">
          <div><div className="label">Name</div><input className="input" value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} required /></div>
          <div><div className="label">Email</div><input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email:e.target.value }))} /></div>
          <div><div className="label">Phone</div><input className="input" value={form.phone} onChange={e=>setForm(f=>({ ...f, phone:e.target.value }))} /></div>
          <div><div className="label">Tags</div><input className="input" value={form.tags} onChange={e=>setForm(f=>({ ...f, tags:e.target.value }))} placeholder="vip,business" /></div>
          <div><div className="label">Guest ID (optional)</div><input className="input" value={form.guestId} onChange={e=>setForm(f=>({ ...f, guestId:e.target.value }))} /></div>
          <div className="md:col-span-5"><button className="btn" disabled={busy}>{busy?'Creating...':'Create Contact'}</button></div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Phone</th><th className="p-2">Tags</th></tr>
          </thead>
          <tbody>
            {loading && (<tr><td colSpan={4} className="p-2">Loading...</td></tr>)}
            {list?.map((c:any)=>(
              <tr key={c.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email ?? '-'}</td>
                <td className="p-2">{c.phone ?? '-'}</td>
                <td className="p-2">{c.tags ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
