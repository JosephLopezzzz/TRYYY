"use client"
import { useEffect, useState } from 'react'

export default function AnalyticsPage(){
  const [data, setData] = useState<any|null>(null)
  const [loading, setLoading] = useState(false)
  const [series, setSeries] = useState<{ date:string, revenue:number, reservations:number, occupancy:number }[]|null>(null)
  const [days, setDays] = useState<number>(30)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/private/analytics/summary')
      const j = await res.json()
      if(!res.ok) throw new Error(j.error||'Failed to load')
      setData(j.data)
    }catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  async function loadSeries(){
    try{
      const res = await fetch('/api/private/analytics/timeseries',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ days }) })
      const j = await res.json(); if(!res.ok) throw new Error(j.error||'Failed to load series')
      setSeries(j.data)
    }catch(e:any){ alert(e?.message ?? 'Network error') }
  }
  useEffect(()=>{ loadSeries() }, [days])

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Analytics</div>
          <div className="text-sm text-gray-500">Occupancy and revenue at a glance</div>
        </div>
        <button className="btn" onClick={load} disabled={loading}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      {data && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card"><div className="text-sm text-gray-500">Rooms Total</div><div className="text-2xl font-semibold">{data.roomsTotal}</div></div>
          <div className="card"><div className="text-sm text-gray-500">Rooms Occupied</div><div className="text-2xl font-semibold">{data.roomsOccupied}</div></div>
          <div className="card"><div className="text-sm text-gray-500">Occupancy</div><div className="text-2xl font-semibold">{data.occupancy}%</div></div>
          <div className="card"><div className="text-sm text-gray-500">Total Payments</div><div className="text-2xl font-semibold">${Number(data.revenue).toFixed(2)}</div></div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">Trends</div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">Days</div>
            <select className="input" value={days} onChange={e=>setDays(parseInt(e.target.value))}>
              <option value={7}>7</option>
              <option value={14}>14</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="label">Revenue</div>
            <div className="max-h-64 overflow-auto">
              {series?.map(p=> (<div key={p.date} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800"><div>{p.date}</div><div>${p.revenue.toFixed(2)}</div></div>))}
            </div>
          </div>
          <div>
            <div className="label">Reservations</div>
            <div className="max-h-64 overflow-auto">
              {series?.map(p=> (<div key={p.date} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800"><div>{p.date}</div><div>{p.reservations}</div></div>))}
            </div>
          </div>
          <div>
            <div className="label">Occupancy</div>
            <div className="max-h-64 overflow-auto">
              {series?.map(p=> (<div key={p.date} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800"><div>{p.date}</div><div>{p.occupancy}%</div></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
