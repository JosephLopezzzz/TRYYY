"use client"
import { useEffect, useState } from 'react'

export default function ChannelsPage(){
  const [list, setList] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', apiKey:'', active:true })
  const [busy, setBusy] = useState(false)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/private/channels')
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to load channels')
      setList(j.data)
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function create(e: React.FormEvent){
    e.preventDefault(); setBusy(true)
    try{
      const res = await fetch('/api/private/channels',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: form.name, apiKey: form.apiKey || undefined, active: !!form.active }) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to create channel')
      setForm({ name:'', apiKey:'', active:true }); await load()
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Channels</div>
          <div className="text-sm text-gray-500">Manage OTA distribution channels</div>
        </div>
        <button className="btn" onClick={load} disabled={loading}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      <div className="card">
        <form onSubmit={create} className="grid md:grid-cols-3 gap-3">
          <div><div className="label">Name</div><input className="input" value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} required/></div>
          <div><div className="label">API Key (optional)</div><input className="input" value={form.apiKey} onChange={e=>setForm(f=>({ ...f, apiKey:e.target.value }))}/></div>
          <div><div className="label">Active</div>
            <select className="input" value={String(form.active)} onChange={e=>setForm(f=>({ ...f, active: e.target.value==='true' }))}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="md:col-span-3"><button className="btn" disabled={busy}>{busy?'Creating...':'Create Channel'}</button></div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">Name</th><th className="p-2">Active</th><th className="p-2">API Key</th></tr></thead>
          <tbody>
            {loading && (<tr><td colSpan={3} className="p-2">Loading...</td></tr>)}
            {list?.map((c:any)=>(
              <tr key={c.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.active ? 'Yes' : 'No'}</td>
                <td className="p-2">{c.apiKey ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
