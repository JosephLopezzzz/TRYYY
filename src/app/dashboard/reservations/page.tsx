"use client"
import { useEffect, useState } from 'react'

export default function ReservationsPage() {
  const [list, setList] = useState<any[] | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', checkIn: '', checkOut: '', adults: 1, children: 0, notes: '' })
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'list'|'calendar'>('list')
  const [month, setMonth] = useState<number>(new Date().getMonth()+1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [calendar, setCalendar] = useState<{ date: string, available: number, minStay: number }[]|null>(null)
  const [drawer, setDrawer] = useState<{ open:boolean, checkIn:string, checkOut:string, roomTypeId?:string, rate?:number, adults:number, children:number }>({ open:false, checkIn:'', checkOut:'', adults:1, children:0 })
  const [avail, setAvail] = useState<any[]|null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/private/reservations')
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Failed to load')
      setList(j.data)
    } catch(e:any) { alert(e?.message ?? 'Network error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function loadCalendar(m=month, y=year){
    try{
      const res = await fetch('/api/private/reservations/calendar',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ month:m, year:y }) })
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to load calendar')
      setCalendar(j.data.days)
    }catch(e:any){ alert(e?.message ?? 'Network error') }
  }
  useEffect(()=>{ if(tab==='calendar') loadCalendar() },[tab])

  async function createReservation(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/private/reservations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest: { firstName: form.firstName, lastName: form.lastName, email: form.email || undefined, phone: form.phone || undefined }, checkIn: form.checkIn, checkOut: form.checkOut, adults: Number(form.adults), children: Number(form.children), notes: form.notes || undefined })
      })
      const j = await res.json()
      if (!res.ok) alert(j.error || 'Failed to create reservation')
      else { setForm({ firstName:'', lastName:'', email:'', phone:'', checkIn:'', checkOut:'', adults:1, children:0, notes:'' }); await load() }
    } catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  async function act(reservationId: string, action: 'checkin'|'checkout') {
    try {
      const res = await fetch(`/api/private/frontdesk/${action}`,{ method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ reservationId }) })
      const j = await res.json()
      if (!res.ok) alert(j.error || 'Operation failed')
      await load()
    } catch(e:any){ alert(e?.message ?? 'Network error') }
  }

  function firstOfMonth(y:number,m:number){ return new Date(y, m-1, 1) }
  function weeksInMonth(y:number,m:number){ const start = firstOfMonth(y,m); const end = new Date(y,m,0); const startDay = (start.getDay()+6)%7; return Math.ceil((startDay + end.getDate())/7) }
  function dayCell(date: Date){ const iso = date.toISOString().slice(0,10); const d = calendar?.find(x=>x.date===iso); return (
    <button key={iso} className={"h-20 w-full p-1 rounded border text-left "+(d? (d.available>0? 'border-green-300':'border-red-300'):'border-gray-200')} onClick={()=>setDrawer(v=>({ ...v, open:true, checkIn: iso, checkOut: iso, adults:1, children:0 }))}>
      <div className="text-xs text-gray-500">{date.getDate()}</div>
      {d && (<div className="text-[10px]">Avail: {d.available}</div>)}
    </button>
  )}

  async function findAvailability(){
    try{
      const res = await fetch('/api/private/frontdesk/availability',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ checkIn: drawer.checkIn, checkOut: drawer.checkOut, adults: drawer.adults, children: drawer.children }) })
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to check availability'); setAvail(j.data.available)
      const rt = j.data.available[0]?.roomTypeId ? j.data.available[0].roomTypeId : undefined
      if(rt){ const r2 = await fetch('/api/private/reservations/rate',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ checkIn: drawer.checkIn, checkOut: drawer.checkOut, roomTypeId: rt }) }); const j2 = await r2.json(); if(r2.ok) setDrawer(v=>({ ...v, rate: j2.data.suggestedRate })) }
    }catch(e:any){ alert(e?.message ?? 'Network error') }
  }

  async function quickBook(){
    setBusy(true)
    try{
      const res = await fetch('/api/private/reservations',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ guest: { firstName: 'Walk', lastName: 'In' }, checkIn: drawer.checkIn, checkOut: drawer.checkOut, adults: drawer.adults, children: drawer.children, notes: 'Quick book' }) })
      const j = await res.json(); if(!res.ok) return alert(j.error||'Failed to create reservation'); setDrawer(v=>({ ...v, open:false })); await load()
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Reservations</div>
          <div className="text-sm text-gray-500">Create and view reservations</div>
        </div>
        <div className="flex items-center gap-2">
          <button className={"btn "+(tab==='list'?'':'opacity-60')} onClick={()=>setTab('list')}>List</button>
          <button className={"btn "+(tab==='calendar'?'':'opacity-60')} onClick={()=>setTab('calendar')}>Calendar</button>
          <button className="btn" onClick={load} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>
      {tab==='list' && (
      <div className="card">
        <form onSubmit={createReservation} className="grid md:grid-cols-3 gap-3">
          <div>
            <div className="label">First Name</div>
            <input className="input" value={form.firstName} onChange={e=>setForm(f=>({ ...f, firstName: e.target.value }))} required />
          </div>
          <div>
            <div className="label">Last Name</div>
            <input className="input" value={form.lastName} onChange={e=>setForm(f=>({ ...f, lastName: e.target.value }))} required />
          </div>
          <div>
            <div className="label">Email</div>
            <input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <div className="label">Phone</div>
            <input className="input" value={form.phone} onChange={e=>setForm(f=>({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <div className="label">Check-in</div>
            <input className="input" type="date" value={form.checkIn} onChange={e=>setForm(f=>({ ...f, checkIn: e.target.value }))} required />
          </div>
          <div>
            <div className="label">Check-out</div>
            <input className="input" type="date" value={form.checkOut} onChange={e=>setForm(f=>({ ...f, checkOut: e.target.value }))} required />
          </div>
          <div>
            <div className="label">Adults</div>
            <input className="input" type="number" min={1} max={6} value={form.adults} onChange={e=>setForm(f=>({ ...f, adults: Number(e.target.value) }))} />
          </div>
          <div>
            <div className="label">Children</div>
            <input className="input" type="number" min={0} max={6} value={form.children} onChange={e=>setForm(f=>({ ...f, children: Number(e.target.value) }))} />
          </div>
          <div className="md:col-span-3">
            <div className="label">Notes</div>
            <textarea className="input" value={form.notes} onChange={e=>setForm(f=>({ ...f, notes: e.target.value }))} />
          </div>
          <div className="md:col-span-3">
            <button className="btn" disabled={busy}>{busy?'Creating...':'Create Reservation'}</button>
          </div>
        </form>
      </div>)}

      {tab==='list' && (
      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Code</th>
              <th className="p-2">Guest</th>
              <th className="p-2">Dates</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (<tr><td className="p-2" colSpan={5}>Loading...</td></tr>)}
            {list?.map((r:any)=>(
              <tr key={r.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{r.code}</td>
                <td className="p-2">{r.guest.firstName} {r.guest.lastName}</td>
                <td className="p-2">{new Date(r.checkIn).toLocaleDateString()} - {new Date(r.checkOut).toLocaleDateString()}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2 flex gap-2">
                  <button className="btn" disabled={r.status!=='BOOKED'} onClick={()=>act(r.id,'checkin')}>Check-in</button>
                  <button className="btn" disabled={r.status!=='CHECKED_IN'} onClick={()=>act(r.id,'checkout')}>Check-out</button>
                  <a className="btn" href={`/dashboard/billing?res=${r.id}`}>Billing</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}

      {tab==='calendar' && (
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <button className="btn" onClick={()=>{ const d=new Date(year,month-2,1); setYear(d.getFullYear()); setMonth(d.getMonth()+1); loadCalendar(d.getMonth()+1,d.getFullYear()) }}>Prev</button>
          <div className="font-medium">{new Date(year,month-1,1).toLocaleString(undefined,{ month:'long', year:'numeric' })}</div>
          <button className="btn" onClick={()=>{ const d=new Date(year,month,1); setYear(d.getFullYear()); setMonth(d.getMonth()+1); loadCalendar(d.getMonth()+1,d.getFullYear()) }}>Next</button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(<div key={d} className="text-xs text-gray-500 p-1">{d}</div>))}
          {(() => {
            const cells: any[] = []
            const start = new Date(year, month-1, 1)
            const startDay = (start.getDay()+6)%7
            for(let i=0;i<startDay;i++) cells.push(<div key={'lead-'+i} />)
            const daysInMonth = new Date(year, month, 0).getDate()
            for(let d=1; d<=daysInMonth; d++){ cells.push(dayCell(new Date(year,month-1,d))) }
            return cells
          })()}
        </div>
      </div>)}

      {drawer.open && (
        <div className="card">
          <div className="font-medium mb-2">Quick Book</div>
          <div className="grid md:grid-cols-5 gap-2">
            <div><div className="label">Check-in</div><input className="input" type="date" value={drawer.checkIn} onChange={e=>setDrawer(v=>({ ...v, checkIn:e.target.value }))} /></div>
            <div><div className="label">Check-out</div><input className="input" type="date" value={drawer.checkOut} onChange={e=>setDrawer(v=>({ ...v, checkOut:e.target.value }))} /></div>
            <div><div className="label">Adults</div><input className="input" type="number" min={1} value={drawer.adults} onChange={e=>setDrawer(v=>({ ...v, adults:Number(e.target.value) }))} /></div>
            <div><div className="label">Children</div><input className="input" type="number" min={0} value={drawer.children} onChange={e=>setDrawer(v=>({ ...v, children:Number(e.target.value) }))} /></div>
            <div className="md:col-span-5 flex gap-2"><button className="btn" onClick={findAvailability}>Check Availability</button><button className="btn" onClick={quickBook} disabled={busy}>{busy?'Creating...':'Create'}</button><button className="btn" onClick={()=>setDrawer(v=>({ ...v, open:false }))}>Close</button></div>
          </div>
          {avail && (<div className="text-sm mt-2">Available Rooms: {avail.length} {drawer.rate?`| Suggested rate: $${drawer.rate.toFixed(2)}`:''}</div>)}
        </div>
      )}

    </div>
  )
}
