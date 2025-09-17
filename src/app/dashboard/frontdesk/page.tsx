"use client"
import { useEffect, useState } from 'react'
import { Modal } from '@/components/modal'
import { useNotification } from '@/hooks/useNotification'

export default function FrontDeskPage() {
  const [data, setData] = useState<any[] | null>(null)
  const [queue, setQueue] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'status'|'checkin'|'code'>('status')
  const [loyalty, setLoyalty] = useState<Record<string, any>>({})
  const [redeem, setRedeem] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<'reservations' | 'queue' | 'walkin'>('reservations')
  
  // Modal states
  const [checkinModal, setCheckinModal] = useState<{open: boolean, reservation?: any}>({open: false})
  const [checkoutModal, setCheckoutModal] = useState<{open: boolean, reservation?: any}>({open: false})
  const [billingModal, setBillingModal] = useState<{open: boolean, reservation?: any}>({open: false})
  const [walkinModal, setWalkinModal] = useState(false)
  
  // Walk-in form
  const [walkinForm, setWalkinForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    checkIn: new Date().toISOString().slice(0, 16),
    checkOut: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    adults: 1, children: 0, roomTypeId: '', paymentMethod: 'cash' as 'cash' | 'card' | 'online',
    idType: '', idNumber: '', notes: ''
  })
  
  const [roomTypes, setRoomTypes] = useState<any[]>([])
  const { showSuccess, showError } = useNotification()

  async function load() {
    setLoading(true)
    try {
      const [resRes, queueRes, roomTypesRes] = await Promise.all([
        fetch('/api/private/reservations'),
        fetch('/api/private/queue'),
        fetch('/api/private/rooms')
      ])
      
      const [resData, queueData, roomTypesData] = await Promise.all([
        resRes.json(),
        queueRes.json(),
        roomTypesRes.json()
      ])
      
      if (!resRes.ok) throw new Error(resData.error || 'Failed to load reservations')
      if (!queueRes.ok) throw new Error(queueData.error || 'Failed to load queue')
      if (!roomTypesRes.ok) throw new Error(roomTypesData.error || 'Failed to load room types')
      
      setData(resData.data)
      setQueue(queueData.data)
      setRoomTypes(roomTypesData.data?.roomTypes || [])
    } catch (e: any) {
      showError(e?.message ?? 'Network error')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function act(reservationId: string, action: 'checkin'|'checkout') {
    setBusy(reservationId)
    try {
      const res = await fetch(`/api/private/frontdesk/${action}`,{ method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ reservationId }) })
      const j = await res.json()
      if (!res.ok) {
        showError(j.error || 'Operation failed')
        return
      }
      showSuccess(`${action === 'checkin' ? 'Check-in' : 'Check-out'} successful`)
      await load()
    } catch(e:any){ 
      showError(e?.message ?? 'Network error') 
    } finally { setBusy(null) }
  }

  async function createWalkin() {
    try {
      const res = await fetch('/api/private/frontdesk/walkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walkinForm)
      })
      const j = await res.json()
      if (!res.ok) {
        showError(j.error || 'Walk-in creation failed')
        return
      }
      showSuccess(`Walk-in reservation created: ${j.data.reservation.code}`)
      setWalkinModal(false)
      setWalkinForm({
        firstName: '', lastName: '', email: '', phone: '',
        checkIn: new Date().toISOString().slice(0, 16),
        checkOut: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        adults: 1, children: 0, roomTypeId: '', paymentMethod: 'cash',
        idType: '', idNumber: '', notes: ''
      })
      await load()
    } catch (e: any) {
      showError(e?.message ?? 'Network error')
    }
  }

  async function updateQueueTicket(id: string, status: string) {
    try {
      const res = await fetch('/api/private/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      const j = await res.json()
      if (!res.ok) {
        showError(j.error || 'Queue update failed')
        return
      }
      showSuccess('Queue updated')
      await load()
    } catch (e: any) {
      showError(e?.message ?? 'Network error')
    }
  }

  async function loadLoyalty(resv: any){
    const key = resv.id
    const email = resv?.guest?.email
    if (!email) return
    const r = await fetch(`/api/private/loyalty/member?email=${encodeURIComponent(email)}`)
    const j = await r.json()
    if (r.ok) setLoyalty(v=>({ ...v, [key]: j.data }))
  }

  async function redeemPoints(resv: any){
    const key = resv.id
    const member = loyalty[key]
    const pts = Number(redeem[key]||0)
    if (!member?.userId || !pts) return
    const r = await fetch('/api/private/loyalty/redeem',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: member.userId, reservationId: resv.id, points: pts, note: 'Redeem at front desk' }) })
    const j = await r.json(); if(!r.ok) return showError(j.error||'Redeem failed')
    setRedeem(v=>({ ...v, [key]: 0 })); await loadLoyalty(resv)
    showSuccess('Points redeemed successfully')
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Front Desk</div>
          <div className="text-sm text-gray-500">Reservations, Queue & Walk-ins</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button 
              className={`px-3 py-1 rounded text-sm ${activeTab === 'reservations' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              onClick={() => setActiveTab('reservations')}
            >
              Reservations
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${activeTab === 'queue' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              onClick={() => setActiveTab('queue')}
            >
              Queue
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${activeTab === 'walkin' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              onClick={() => setActiveTab('walkin')}
            >
              Walk-in
            </button>
          </div>
          <button className="btn" onClick={load} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>

      {activeTab === 'reservations' && (
        <div className="card overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Code</th>
                <th className="p-2">Guest</th>
                <th className="p-2">Room</th>
                <th className="p-2">Dates</th>
                <th className="p-2">Status</th>
                <th className="p-2">Loyalty</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td className="p-2" colSpan={7}>Loading...</td></tr>
              )}
              {data?.slice().sort((a:any,b:any)=>{
                if (sortBy==='status') {
                  const order: Record<string, number> = { CHECKED_IN: 0, BOOKED: 1, CHECKED_OUT: 2, CANCELLED: 3 }
                  return (order[a.status] ?? 99) - (order[b.status] ?? 99)
                }
                if (sortBy==='checkin') return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
                return String(a.code).localeCompare(String(b.code))
              }).map((r:any)=>(
                <tr key={r.id} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="p-2">{r.code}</td>
                  <td className="p-2">{r.guest.firstName} {r.guest.lastName}</td>
                  <td className="p-2">{r.room?.number ?? '-'}</td>
                  <td className="p-2">{new Date(r.checkIn).toLocaleDateString()} - {new Date(r.checkOut).toLocaleDateString()}</td>
                  <td className="p-2">
                    <span className={
                      "inline-block px-2 py-1 rounded text-xs font-medium " +
                      (r.status==='CHECKED_IN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      r.status==='BOOKED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                      r.status==='CHECKED_OUT' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300')
                    }>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <button className="btn" onClick={()=>loadLoyalty(r)}>Load</button>
                      {loyalty[r.id] && (
                        <div className="text-xs">
                          <div className="font-medium">{loyalty[r.id].tier ?? 'member'}</div>
                          <div>Pts: {loyalty[r.id].points}</div>
                          <div className="flex gap-1 mt-1">
                            <input className="input max-w-20" type="number" min={1} value={redeem[r.id]||''} onChange={e=>setRedeem(v=>({ ...v, [r.id]: parseInt(e.target.value||'0') }))} />
                            <button className="btn" onClick={()=>redeemPoints(r)} disabled={!redeem[r.id]}>Redeem</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="btn" disabled={busy===r.id || r.status!=='BOOKED'} onClick={()=>setCheckinModal({open: true, reservation: r})}>
                      {busy===r.id?'...':'Check-in'}
                    </button>
                    <button className="btn" disabled={busy===r.id || r.status!=='CHECKED_IN'} onClick={()=>setCheckoutModal({open: true, reservation: r})}>
                      {busy===r.id?'...':'Check-out'}
                    </button>
                    <button className="btn" onClick={()=>setBillingModal({open: true, reservation: r})}>
                      Billing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="card overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Guest Name</th>
                <th className="p-2">Purpose</th>
                <th className="p-2">Status</th>
                <th className="p-2">Arrived</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue?.map((ticket:any)=>(
                <tr key={ticket.id} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="p-2">{ticket.guestName}</td>
                  <td className="p-2">{ticket.purpose}</td>
                  <td className="p-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      ticket.status === 'waiting' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      ticket.status === 'serving' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-2">{new Date(ticket.createdAt).toLocaleTimeString()}</td>
                  <td className="p-2 flex gap-2">
                    {ticket.status === 'waiting' && (
                      <button className="btn" onClick={()=>updateQueueTicket(ticket.id, 'serving')}>
                        Start Serving
                      </button>
                    )}
                    {ticket.status === 'serving' && (
                      <button className="btn" onClick={()=>updateQueueTicket(ticket.id, 'done')}>
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'walkin' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium">Walk-in Reservations</div>
              <div className="text-sm text-gray-500">Create instant reservations for walk-in guests</div>
            </div>
            <button className="btn" onClick={()=>setWalkinModal(true)}>
              New Walk-in
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Walk-in reservations will be created with immediate check-in status and dynamic pricing based on current occupancy.
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={checkinModal.open} onClose={()=>setCheckinModal({open: false})} title="Check-in Guest" size="md">
        {checkinModal.reservation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Guest</div>
                <div>{checkinModal.reservation.guest.firstName} {checkinModal.reservation.guest.lastName}</div>
              </div>
              <div>
                <div className="font-medium">Reservation Code</div>
                <div>{checkinModal.reservation.code}</div>
              </div>
              <div>
                <div className="font-medium">Room</div>
                <div>{checkinModal.reservation.room?.number || 'Not assigned'}</div>
              </div>
              <div>
                <div className="font-medium">Check-in Date</div>
                <div>{new Date(checkinModal.reservation.checkIn).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={()=>act(checkinModal.reservation.id, 'checkin')}>
                Confirm Check-in
              </button>
              <button className="btn" onClick={()=>setCheckinModal({open: false})}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={checkoutModal.open} onClose={()=>setCheckoutModal({open: false})} title="Check-out Guest" size="md">
        {checkoutModal.reservation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Guest</div>
                <div>{checkoutModal.reservation.guest.firstName} {checkoutModal.reservation.guest.lastName}</div>
              </div>
              <div>
                <div className="font-medium">Reservation Code</div>
                <div>{checkoutModal.reservation.code}</div>
              </div>
              <div>
                <div className="font-medium">Room</div>
                <div>{checkoutModal.reservation.room?.number || 'Not assigned'}</div>
              </div>
              <div>
                <div className="font-medium">Check-out Date</div>
                <div>{new Date(checkoutModal.reservation.checkOut).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={()=>act(checkoutModal.reservation.id, 'checkout')}>
                Confirm Check-out
              </button>
              <button className="btn" onClick={()=>setCheckoutModal({open: false})}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={walkinModal} onClose={()=>setWalkinModal(false)} title="Create Walk-in Reservation" size="lg">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="label">First Name</div>
              <input className="input" value={walkinForm.firstName} onChange={e=>setWalkinForm(f=>({...f, firstName: e.target.value}))} required />
            </div>
            <div>
              <div className="label">Last Name</div>
              <input className="input" value={walkinForm.lastName} onChange={e=>setWalkinForm(f=>({...f, lastName: e.target.value}))} required />
            </div>
            <div>
              <div className="label">Email</div>
              <input className="input" type="email" value={walkinForm.email} onChange={e=>setWalkinForm(f=>({...f, email: e.target.value}))} />
            </div>
            <div>
              <div className="label">Phone</div>
              <input className="input" value={walkinForm.phone} onChange={e=>setWalkinForm(f=>({...f, phone: e.target.value}))} />
            </div>
            <div>
              <div className="label">Check-in</div>
              <input className="input" type="datetime-local" value={walkinForm.checkIn} onChange={e=>setWalkinForm(f=>({...f, checkIn: e.target.value}))} />
            </div>
            <div>
              <div className="label">Check-out</div>
              <input className="input" type="datetime-local" value={walkinForm.checkOut} onChange={e=>setWalkinForm(f=>({...f, checkOut: e.target.value}))} />
            </div>
            <div>
              <div className="label">Room Type</div>
              <select className="input" value={walkinForm.roomTypeId} onChange={e=>setWalkinForm(f=>({...f, roomTypeId: e.target.value}))}>
                <option value="">Select room type</option>
                {roomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.name} - ${rt.baseRate}/night</option>
                ))}
              </select>
            </div>
            <div>
              <div className="label">Payment Method</div>
              <select className="input" value={walkinForm.paymentMethod} onChange={e=>setWalkinForm(f=>({...f, paymentMethod: e.target.value as any}))}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <div className="label">Adults</div>
              <input className="input" type="number" min="1" max="6" value={walkinForm.adults} onChange={e=>setWalkinForm(f=>({...f, adults: parseInt(e.target.value)}))} />
            </div>
            <div>
              <div className="label">Children</div>
              <input className="input" type="number" min="0" max="6" value={walkinForm.children} onChange={e=>setWalkinForm(f=>({...f, children: parseInt(e.target.value)}))} />
            </div>
            <div>
              <div className="label">ID Type</div>
              <select className="input" value={walkinForm.idType} onChange={e=>setWalkinForm(f=>({...f, idType: e.target.value}))}>
                <option value="">Select ID type</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <div>
              <div className="label">ID Number</div>
              <input className="input" value={walkinForm.idNumber} onChange={e=>setWalkinForm(f=>({...f, idNumber: e.target.value}))} />
            </div>
          </div>
          <div>
            <div className="label">Notes</div>
            <textarea className="input" value={walkinForm.notes} onChange={e=>setWalkinForm(f=>({...f, notes: e.target.value}))} />
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={createWalkin}>
              Create Walk-in Reservation
            </button>
            <button className="btn" onClick={()=>setWalkinModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
