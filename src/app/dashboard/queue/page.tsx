"use client"
import { useEffect, useState } from 'react'

export default function QueuePage(){
  const [list, setList] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ guestName:'', purpose:'checkin' })

  async function load(){
    setLoading(true)
    try{ const r = await fetch('/api/private/queue'); const j = await r.json(); if(!r.ok) throw new Error(j.error||'Failed to load'); setList(j.data) }
    catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function create(e: React.FormEvent){
    e.preventDefault(); setBusy(true)
    try{ const r = await fetch('/api/private/queue',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) }); const j = await r.json(); if(!r.ok) return alert(j.error||'Failed to create ticket'); setForm({ guestName:'', purpose:'checkin' }); await load() }
    catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  async function setStatus(id: string, status: string){
    setBusy(true)
    try{ const r = await fetch('/api/private/queue',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status }) }); const j = await r.json(); if(!r.ok) return alert(j.error||'Failed to update'); await load() }
    catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Front Desk Queue</div>
          <div className="text-sm text-gray-500">Manage walk-ins and service queue</div>
        </div>
        <button className="btn" disabled={loading} onClick={load}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      <div className="card">
        <form onSubmit={create} className="grid md:grid-cols-3 gap-3">
          <div><div className="label">Guest Name</div><input className="input" value={form.guestName} onChange={e=>setForm(f=>({ ...f, guestName:e.target.value }))} required/></div>
          <div><div className="label">Purpose</div>
            <select className="input" value={form.purpose} onChange={e=>setForm(f=>({ ...f, purpose:e.target.value }))}>
              <option value="checkin">Check-in</option>
              <option value="checkout">Check-out</option>
              <option value="inquiry">Inquiry</option>
            </select>
          </div>
          <div className="md:col-span-3"><button className="btn" disabled={busy}>{busy?'Adding...':'Add Ticket'}</button></div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">Guest</th><th className="p-2">Purpose</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
          <tbody>
            {loading && (<tr><td colSpan={4} className="p-2">Loading...</td></tr>)}
            {list?.map((t:any)=>(
              <tr key={t.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{t.guestName}</td>
                <td className="p-2">{t.purpose}</td>
                <td className="p-2">{t.status}</td>
                <td className="p-2 flex gap-2">
                  <button className="btn" disabled={busy} onClick={()=>setStatus(t.id,'serving')}>Serve</button>
                  <button className="btn" disabled={busy} onClick={()=>setStatus(t.id,'done')}>Done</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
