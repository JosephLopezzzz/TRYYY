"use client"
import { useEffect, useState } from 'react'

export default function EventsPage(){
  const [list, setList] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title:'', organizer:'', contact:'', start:'', end:'', venue:'', notes:'' })
  const [busy, setBusy] = useState(false)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/private/events')
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to load events')
      setList(j.data)
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function create(e: React.FormEvent){
    e.preventDefault(); setBusy(true)
    try{
      const res = await fetch('/api/private/events',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: form.title, organizer: form.organizer, contact: form.contact||undefined, start: form.start, end: form.end, venue: form.venue, notes: form.notes||undefined }) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to create event')
      setForm({ title:'', organizer:'', contact:'', start:'', end:'', venue:'', notes:'' }); await load()
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Events</div>
          <div className="text-sm text-gray-500">Manage conferences, weddings, and meetings</div>
        </div>
        <button className="btn" onClick={load} disabled={loading}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      <div className="card">
        <form onSubmit={create} className="grid md:grid-cols-3 gap-3">
          <div><div className="label">Title</div><input className="input" value={form.title} onChange={e=>setForm(f=>({ ...f, title:e.target.value }))} required/></div>
          <div><div className="label">Organizer</div><input className="input" value={form.organizer} onChange={e=>setForm(f=>({ ...f, organizer:e.target.value }))} required/></div>
          <div><div className="label">Contact</div><input className="input" value={form.contact} onChange={e=>setForm(f=>({ ...f, contact:e.target.value }))}/></div>
          <div><div className="label">Start</div><input className="input" type="datetime-local" value={form.start} onChange={e=>setForm(f=>({ ...f, start:e.target.value }))} required/></div>
          <div><div className="label">End</div><input className="input" type="datetime-local" value={form.end} onChange={e=>setForm(f=>({ ...f, end:e.target.value }))} required/></div>
          <div><div className="label">Venue</div><input className="input" value={form.venue} onChange={e=>setForm(f=>({ ...f, venue:e.target.value }))} required/></div>
          <div className="md:col-span-3"><div className="label">Notes</div><textarea className="input" value={form.notes} onChange={e=>setForm(f=>({ ...f, notes:e.target.value }))}/></div>
          <div className="md:col-span-3"><button className="btn" disabled={busy}>{busy?'Creating...':'Create Event'}</button></div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left"><th className="p-2">Title</th><th className="p-2">Organizer</th><th className="p-2">When</th><th className="p-2">Venue</th></tr>
          </thead>
          <tbody>
            {loading && (<tr><td colSpan={4} className="p-2">Loading...</td></tr>)}
            {list?.map((ev:any)=>(
              <tr key={ev.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{ev.title}</td>
                <td className="p-2">{ev.organizer}</td>
                <td className="p-2">{new Date(ev.start).toLocaleString()} - {new Date(ev.end).toLocaleString()}</td>
                <td className="p-2">{ev.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
