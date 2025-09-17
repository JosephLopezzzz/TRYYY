"use client"
import { useEffect, useState } from 'react'
import { useNotification } from '@/hooks/useNotification'

export default function BillingPage() {
  const [reservationId, setReservationId] = useState('')
  const [reservations, setReservations] = useState<any[]|null>(null)
  const [code, setCode] = useState('')
  const [folio, setFolio] = useState<any | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [note, setNote] = useState('')
  const [payAmount, setPayAmount] = useState<number>(0)
  const [method, setMethod] = useState('card')
  const [member, setMember] = useState<any|null>(null)
  const [redeemPoints, setRedeemPoints] = useState<number>(0)
  const [refundAmount, setRefundAmount] = useState<number>(0)
  const [adjustAmount, setAdjustAmount] = useState<number>(0)
  const [adjustNote, setAdjustNote] = useState<string>('')
  const { showSuccess, showError } = useNotification()

  async function loadReservations(){
    const res = await fetch('/api/private/reservations')
    const j = await res.json()
    if (res.ok) setReservations(j.data)
  }

  async function load() {
    if (!reservationId) return
    const res = await fetch(`/api/private/billing/folio/${reservationId}`)
    const j = await res.json()
    if (!res.ok) { showError(j.error || 'Folio not found'); setFolio(null); return }
    setFolio(j.data)
    // try load loyalty member by reservation's user email (if any)
    const email = j.data?.reservation?.user?.email || j.data?.reservation?.guest?.email
    if (email) {
      const r2 = await fetch(`/api/private/loyalty/member?email=${encodeURIComponent(email)}`)
      const j2 = await r2.json()
      if (r2.ok) setMember(j2.data)
      else setMember(null)
    } else {
      setMember(null)
    }
  }

  async function addCharge() {
    if (!reservationId || !amount) return
    const res = await fetch('/api/private/billing/charge',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reservationId, type: 'room', amount: Number(amount), note: note || undefined }) })
    const j = await res.json()
    if (!res.ok) return showError(j.error || 'Failed to add charge')
    showSuccess('Charge added successfully')
    setAmount(0); setNote(''); await load()
  }

  async function addPayment() {
    if (!reservationId || !payAmount) return
    const res = await fetch('/api/private/billing/payment',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reservationId, method, amount: Number(payAmount) }) })
    const j = await res.json()
    if (!res.ok) return showError(j.error || 'Failed to add payment')
    showSuccess('Payment recorded successfully')
    setPayAmount(0); await load()
  }

  async function payWithIntent(){
    if (!reservationId) return
    try{
      const res = await fetch('/api/private/payments/intent',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reservationId }) })
      const j = await res.json(); if(!res.ok) return showError(j.error||'Failed to create payment intent')
      // For scaffold: immediately record payment of suggested amount
      const amt = Number(j.data.amount||0)
      if (amt<=0) return showError('Nothing due')
      const p = await fetch('/api/private/billing/payment',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reservationId, method:'card', amount: amt, ref: j.data.id }) })
      const pj = await p.json(); if(!p.ok) return showError(pj.error||'Failed to record payment')
      await load()
      showSuccess('Payment recorded successfully')
    }catch(e:any){ showError(e?.message ?? 'Network error') }
  }

  async function generateInvoice(){
    if (!reservationId) return
    try{
      const res = await fetch('/api/private/billing/invoice',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reservationId }) })
      const j = await res.json(); if(!res.ok) return showError(j.error||'Failed to generate invoice')
      showSuccess(`Invoice ${j.data.number} generated successfully`)
      await load()
    }catch(e:any){ showError(e?.message ?? 'Network error') }
  }

  async function redeem(){
    if (!member?.userId || !reservationId || redeemPoints<=0) return
    try{
      const res = await fetch('/api/private/loyalty/redeem',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: member.userId, reservationId, points: redeemPoints, note: 'Redeem at billing' }) })
      const j = await res.json(); if(!res.ok) return showError(j.error||'Redeem failed')
      showSuccess('Points redeemed successfully')
      setRedeemPoints(0); await load()
    }catch(e:any){ showError(e?.message ?? 'Network error') }
  }

  async function addAdjustment(){
    if (!reservationId || !adjustAmount) return
    const res = await fetch('/api/private/billing/adjustment',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reservationId, amount: Number(adjustAmount), note: adjustNote || undefined }) })
    const j = await res.json(); if(!res.ok) return showError(j.error||'Failed to add adjustment')
    showSuccess('Adjustment added successfully')
    setAdjustAmount(0); setAdjustNote(''); await load()
  }

  async function issueRefund(){
    if (!reservationId || !refundAmount) return
    const res = await fetch('/api/private/billing/refund',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reservationId, amount: Number(refundAmount), method }) })
    const j = await res.json(); if(!res.ok) return showError(j.error||'Refund failed')
    showSuccess('Refund processed successfully')
    setRefundAmount(0); await load()
  }

  useEffect(()=>{ loadReservations() }, [])

  function pickByCode(){
    if (!reservations) return
    const found = reservations.find(r=>String(r.code).toLowerCase()===code.trim().toLowerCase())
    if (!found) return showError('Reservation code not found')
    setReservationId(found.id)
    setFolio(null)
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="text-lg font-semibold flex items-center gap-2">
          <span>💳</span>
          Billing
        </div>
        <div className="text-sm text-gray-500">Lookup reservation folio, add charges and payments</div>
      </div>

      <div className="card grid md:grid-cols-3 gap-3 items-end">
        <div className="md:col-span-1">
          <div className="label">Pick Reservation</div>
          <select className="input" value={reservationId} onChange={e=>{ setReservationId(e.target.value); setFolio(null) }}>
            <option value="">Select…</option>
            {reservations?.map((r:any)=>(
              <option key={r.id} value={r.id}>{r.code} — {r.guest.firstName} {r.guest.lastName} ({new Date(r.checkIn).toLocaleDateString()})</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <div className="label">Or Enter Reservation Code</div>
          <div className="flex gap-2">
            <input className="input" value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. R123456" />
            <button className="btn" onClick={pickByCode}>Find</button>
          </div>
        </div>
        <div className="md:col-span-1 flex items-end">
          <button className="btn" onClick={load} disabled={!reservationId}>Load Folio</button>
        </div>
      </div>

      {folio && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">Folio</div>
                <div className="text-sm text-gray-500">Guest: {folio.reservation?.guest?.firstName} {folio.reservation?.guest?.lastName} | Room: {folio.reservation?.room?.number ?? '-'}</div>
                <div className="mt-2 text-sm">Balance: <span className="font-semibold">${(folio.balance).toFixed(2)}</span></div>
              </div>
              {member && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Loyalty</div>
                  <div className="font-medium">{member.tier ?? 'member'}</div>
                  <div className="text-sm">Points: {member.points}</div>
                  <div className="flex gap-2 mt-2">
                    <input className="input max-w-24" type="number" min={1} value={redeemPoints||''} onChange={e=>setRedeemPoints(parseInt(e.target.value||'0'))} placeholder="Points" />
                    <button className="btn" onClick={redeem} disabled={!redeemPoints}>Redeem</button>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn" onClick={payWithIntent}>Pay</button>
              <button className="btn" onClick={generateInvoice}>Generate Invoice</button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <div className="font-medium mb-2">Charges</div>
              <div className="flex gap-2 mb-3">
                <input className="input" type="number" min={0} step={0.01} value={amount || ''} onChange={e=>setAmount(parseFloat(e.target.value||'0'))} placeholder="Amount" />
                <input className="input" value={note} onChange={e=>setNote(e.target.value)} placeholder="Note" />
                <button className="btn" onClick={addCharge}>Add</button>
              </div>
              <div className="max-h-64 overflow-auto text-sm">
                {folio.items?.map((i:any)=>(
                  <div key={i.id} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800">
                    <div>{i.type} {i.note?`- ${i.note}`:''}</div>
                    <div>${Number(i.amount).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="font-medium mb-2">Payments</div>
              <div className="flex gap-2 mb-3">
                <select className="input max-w-32" value={method} onChange={e=>setMethod(e.target.value)}>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="wallet">Wallet</option>
                </select>
                <input className="input" type="number" min={0} step={0.01} value={payAmount || ''} onChange={e=>setPayAmount(parseFloat(e.target.value||'0'))} placeholder="Amount" />
                <button className="btn" onClick={addPayment}>Record</button>
              </div>
              <div className="max-h-64 overflow-auto text-sm">
                {folio.payments?.map((p:any)=>(
                  <div key={p.id} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800">
                    <div>{p.method}</div>
                    <div>${Number(p.amount).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid md:grid-cols-2 gap-2">
                <div className="flex gap-2">
                  <input className="input" type="number" value={adjustAmount || ''} onChange={e=>setAdjustAmount(parseFloat(e.target.value||'0'))} placeholder="Adjustment amt (neg for credit)" />
                  <input className="input" value={adjustNote} onChange={e=>setAdjustNote(e.target.value)} placeholder="Note" />
                  <button className="btn" onClick={addAdjustment}>Post</button>
                </div>
                <div className="flex gap-2">
                  <input className="input" type="number" value={refundAmount || ''} onChange={e=>setRefundAmount(parseFloat(e.target.value||'0'))} placeholder="Refund amt" />
                  <select className="input max-w-32" value={method} onChange={e=>setMethod(e.target.value)}>
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                  </select>
                  <button className="btn" onClick={issueRefund}>Refund</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
