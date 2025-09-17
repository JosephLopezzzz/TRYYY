"use client"
import { useEffect, useState } from 'react'

export default function HousekeepingPage(){
  const [tasks, setTasks] = useState<any[]|null>(null)
  const [rooms, setRooms] = useState<any[]|null>(null)
  const [roomId, setRoomId] = useState('')
  const [type, setType] = useState('cleaning')
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  async function load(){
    setLoading(true)
    try {
      const [tRes, rRes] = await Promise.all([
        fetch('/api/private/housekeeping/tasks'),
        fetch('/api/private/rooms')
      ])
      const t = await tRes.json(); const r = await rRes.json()
      if (!tRes.ok) throw new Error(t.error||'Failed to load tasks')
      if (!rRes.ok) throw new Error(r.error||'Failed to load rooms')
      setTasks(t.data); setRooms(r.data)
    } catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function createTask(e: React.FormEvent){
    e.preventDefault(); if (!roomId) return
    setBusy(true)
    try { 
      const res = await fetch('/api/private/housekeeping/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ roomId, type }) })
      const j = await res.json(); if (!res.ok) return alert(j.error||'Failed to create task')
      setRoomId(''); setType('cleaning'); await load()
    } catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  async function setStatus(id: string, status: string){
    setBusy(true)
    try { 
      const res = await fetch('/api/private/housekeeping/tasks', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status }) })
      const j = await res.json(); if (!res.ok) return alert(j.error||'Failed to update')
      await load()
    } catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Housekeeping</div>
          <div className="text-sm text-gray-500">Create and track cleaning tasks</div>
        </div>
        <button className="btn" onClick={load} disabled={loading}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      <div className="card">
        <form onSubmit={createTask} className="grid md:grid-cols-3 gap-3">
          <div>
            <div className="label">Room</div>
            <select className="input" value={roomId} onChange={e=>setRoomId(e.target.value)}>
              <option value="">Select room</option>
              {rooms?.map((r:any)=>(<option key={r.id} value={r.id}>{r.number} ({r.status})</option>))}
            </select>
          </div>
          <div>
            <div className="label">Type</div>
            <select className="input" value={type} onChange={e=>setType(e.target.value)}>
              <option value="cleaning">Cleaning</option>
              <option value="turndown">Turndown</option>
              <option value="inspection">Inspection</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button className="btn" disabled={busy}>{busy?'Creating...':'Create Task'}</button>
          </div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Room</th>
              <th className="p-2">Type</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (<tr><td className="p-2" colSpan={4}>Loading...</td></tr>)}
            {tasks?.map((t:any)=>(
              <tr key={t.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{t.room?.number}</td>
                <td className="p-2">{t.type}</td>
                <td className="p-2">{t.status}</td>
                <td className="p-2 flex gap-2">
                  <button className="btn" disabled={busy} onClick={()=>setStatus(t.id,'in_progress')}>Start</button>
                  <button className="btn" disabled={busy} onClick={()=>setStatus(t.id,'done')}>Complete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
