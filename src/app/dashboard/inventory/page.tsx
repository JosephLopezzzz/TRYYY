"use client"
import { useEffect, useState } from 'react'

export default function InventoryPage() {
  const [items, setItems] = useState<any[]|null>(null)
  const [low, setLow] = useState<{ items:any[], suggestions:any[] }|null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', sku:'', quantity:0, location:'', threshold:10, unit:'unit' })
  const [busy, setBusy] = useState(false)

  async function load(){
    setLoading(true)
    try {
      const res = await fetch('/api/private/inventory/items')
      const j = await res.json()
      if (!res.ok) throw new Error(j.error||'Failed to load')
      setItems(j.data)
      const r2 = await fetch('/api/private/inventory/low-stock')
      const j2 = await r2.json(); if (r2.ok) setLow(j2.data)
    } catch(e:any){ alert(e?.message ?? 'Network error') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  async function createItem(e: React.FormEvent){
    e.preventDefault(); setBusy(true)
    try {
      const res = await fetch('/api/private/inventory/items',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, quantity: Number(form.quantity), threshold: Number(form.threshold), location: form.location || undefined }) })
      const j = await res.json()
      if (!res.ok) return alert(j.error || 'Failed to create item')
      setForm({ name:'', sku:'', quantity:0, location:'', threshold:10, unit:'unit' }); await load()
    } catch(e:any){ alert(e?.message ?? 'Network error') } finally { setBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Inventory</div>
          <div className="text-sm text-gray-500">Manage stock items</div>
        </div>
        <button className="btn" onClick={load} disabled={loading}>{loading?'Refreshing...':'Refresh'}</button>
      </div>

      {low && low.items.length>0 && (
        <div className="card">
          <div className="font-medium mb-2">Low Stock Alerts</div>
          <div className="text-sm text-gray-500 mb-2">Items below threshold. Suggested reorder quantities provided.</div>
          <div className="max-h-64 overflow-auto text-sm">
            {low.suggestions.map((s:any)=>(
              <div key={s.id} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800">
                <div>{s.name} ({s.sku}) — Qty: {s.quantity} / Threshold: {s.threshold}</div>
                <div>Suggest Order: <span className="font-semibold">{s.suggestedOrderQty}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <form onSubmit={createItem} className="grid md:grid-cols-6 gap-3">
          <div>
            <div className="label">Name</div>
            <input className="input" value={form.name} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <div className="label">SKU</div>
            <input className="input" value={form.sku} onChange={e=>setForm(f=>({ ...f, sku: e.target.value }))} required />
          </div>
          <div>
            <div className="label">Qty</div>
            <input className="input" type="number" min={0} value={form.quantity} onChange={e=>setForm(f=>({ ...f, quantity: Number(e.target.value) }))} />
          </div>
          <div>
            <div className="label">Location</div>
            <input className="input" value={form.location} onChange={e=>setForm(f=>({ ...f, location: e.target.value }))} />
          </div>
          <div>
            <div className="label">Threshold</div>
            <input className="input" type="number" min={0} value={form.threshold} onChange={e=>setForm(f=>({ ...f, threshold: Number(e.target.value) }))} />
          </div>
          <div>
            <div className="label">Unit</div>
            <input className="input" value={form.unit} onChange={e=>setForm(f=>({ ...f, unit: e.target.value }))} />
          </div>
          <div className="md:col-span-6"><button className="btn" disabled={busy}>{busy?'Creating...':'Create Item'}</button></div>
        </form>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th className="p-2">SKU</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Location</th>
              <th className="p-2">Threshold</th>
              <th className="p-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            {loading && (<tr><td colSpan={6} className="p-2">Loading...</td></tr>)}
            {items?.map((it:any)=>(
              <tr key={it.id} className="border-t border-gray-200 dark:border-gray-800">
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.sku}</td>
                <td className="p-2">{it.quantity}</td>
                <td className="p-2">{it.location ?? '-'}</td>
                <td className="p-2">{it.threshold}</td>
                <td className="p-2">{it.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
