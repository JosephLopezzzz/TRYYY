"use client"
import { useEffect, useState } from 'react'

export default function StaffPage(){
  const [users, setUsers] = useState<any[]|null>(null)
  const [roles, setRoles] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', role:'', password:'' })

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/private/staff')
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to load staff')
      setUsers(j.data.users); setRoles(j.data.roles)
      if (!form.role && j.data.roles?.[0]) setForm(f=>({ ...f, role: j.data.roles[0].name }))
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function create(e: React.FormEvent){
    e.preventDefault(); setBusy(true)
    try{
      const res = await fetch('/api/private/staff',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to create user')
      setForm({ name:'', email:'', role: roles?.[0]?.name ?? '', password:'' }); await load()
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  async function setRole(id: string, role: string){
    setBusy(true)
    try{
      const res = await fetch('/api/private/staff',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, role }) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to update')
      await load()
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  async function resetPassword(id: string){
    const pw = prompt('New password (min 6 chars):')
    if (!pw) return
    setBusy(true)
    try{
      const res = await fetch('/api/private/staff',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, password: pw }) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to reset password')
      alert('Password updated')
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Staff Management</div>
          <div className="text-sm text-gray-500">Create users and assign roles</div>
        </div>
        <button className="btn" disabled={loading} onClick={load}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      <div className="card">
        <form onSubmit={create} className="grid md:grid-cols-4 gap-3">
          <div><div className="label">Name</div><input className="input" value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} required/></div>
          <div><div className="label">Email</div><input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email:e.target.value }))} required/></div>
          <div><div className="label">Role</div>
            <select className="input" value={form.role} onChange={e=>setForm(f=>({ ...f, role:e.target.value }))}>
              {roles?.map((r:any)=>(<option key={r.id} value={r.name}>{r.name}</option>))}
            </select>
          </div>
          <div><div className="label">Password</div><input className="input" type="password" value={form.password} onChange={e=>setForm(f=>({ ...f, password:e.target.value }))} required/></div>
          <div className="md:col-span-4"><button className="btn" disabled={busy}>{busy?'Creating...':'Create User'}</button></div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Actions</th></tr></thead>
          <tbody>
            {loading && (<tr><td colSpan={4} className="p-2">Loading...</td></tr>)}
            {users?.map((u:any)=>(
              <tr key={u.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <select className="input" value={u.role?.name} onChange={e=>setRole(u.id, e.target.value)}>
                    {roles?.map((r:any)=>(<option key={r.id} value={r.name}>{r.name}</option>))}
                  </select>
                </td>
                <td className="p-2"><button className="btn" onClick={()=>resetPassword(u.id)} disabled={busy}>Reset Password</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
