"use client"
import { useEffect, useState } from 'react'

export default function MarketingPage(){
  const [list, setList] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', channel:'Email', startsAt:'', endsAt:'', budget:0 })
  const [busy, setBusy] = useState(false)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/private/marketing/campaigns')
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to load')
      setList(j.data)
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function create(e: React.FormEvent){
    e.preventDefault(); setBusy(true)
    try{
      const res = await fetch('/api/private/marketing/campaigns',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: form.name, channel: form.channel, startsAt: form.startsAt, endsAt: form.endsAt, budget: Number(form.budget) }) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to create campaign')
      setForm({ name:'', channel:'Email', startsAt:'', endsAt:'', budget:0 }); await load()
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Marketing</div>
          <div className="text-sm text-gray-500">Create and track campaigns</div>
        </div>
        <button className="btn" onClick={load} disabled={loading}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      <div className="card">
        <form onSubmit={create} className="grid md:grid-cols-5 gap-3">
          <div><div className="label">Name</div><input className="input" value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} required/></div>
          <div><div className="label">Channel</div>
            <select className="input" value={form.channel} onChange={e=>setForm(f=>({ ...f, channel:e.target.value }))}>
              <option>Email</option><option>Social</option><option>Ads</option>
            </select>
          </div>
          <div><div className="label">Start</div><input className="input" type="date" value={form.startsAt} onChange={e=>setForm(f=>({ ...f, startsAt:e.target.value }))} required/></div>
          <div><div className="label">End</div><input className="input" type="date" value={form.endsAt} onChange={e=>setForm(f=>({ ...f, endsAt:e.target.value }))} required/></div>
          <div><div className="label">Budget</div><input className="input" type="number" min={0} value={form.budget} onChange={e=>setForm(f=>({ ...f, budget:Number(e.target.value) }))}/></div>
          <div className="md:col-span-5"><button className="btn" disabled={busy}>{busy?'Creating...':'Create Campaign'}</button></div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">Name</th><th className="p-2">Channel</th><th className="p-2">Period</th><th className="p-2">Budget</th></tr></thead>
          <tbody>
            {loading && (<tr><td colSpan={4} className="p-2">Loading...</td></tr>)}
            {list?.map((c:any)=>(
              <tr key={c.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.channel}</td>
                <td className="p-2">{new Date(c.startsAt).toLocaleDateString()} - {new Date(c.endsAt).toLocaleDateString()}</td>
                <td className="p-2">${Number(c.budget).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
