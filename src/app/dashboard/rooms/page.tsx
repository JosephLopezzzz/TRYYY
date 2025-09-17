"use client"
import { useEffect, useState } from 'react'
import { useNotification } from '@/hooks/useNotification'

export default function RoomsPage(){
  const [rooms, setRooms] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'floor_map' | 'housekeeping' | 'maintenance' | 'reports'>('floor_map')
  const { showSuccess, showError } = useNotification()

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/private/rooms')
      const j = await res.json()
      if(!res.ok) throw new Error(j.error||'Failed to load rooms')
      setRooms(j.data)
    }catch(e:any){ 
      showError(e?.message ?? 'Network error') 
    } finally { setLoading(false) }
  }

  async function setStatus(id: string, status: string){
    setBusy(id)
    try{
      const res = await fetch('/api/private/rooms', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status }) })
      const j = await res.json(); if(!res.ok) {
        showError(j.error||'Failed to update')
        return
      }
      showSuccess('Room status updated successfully')
      await load()
    }catch(e:any){ 
      showError(e?.message ?? 'Network error') 
    } finally { setBusy(null) }
  }

  useEffect(()=>{ load() }, [])

  const groups = (rooms??[]).reduce((acc:any, r:any)=>{ const f = r.floor ?? r.roomType?.floor ?? 0; (acc[f] ||= []).push(r); return acc }, {})
  const floors = Object.keys(groups).map(n=>Number(n)).sort((a,b)=>a-b)

  function getStatusColor(status: string) {
    switch(status) {
      case 'AVAILABLE': return 'bg-green-500'
      case 'OCCUPIED': return 'bg-red-500'
      case 'DIRTY': return 'bg-yellow-500'
      case 'OUT_OF_ORDER': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  function getStatusLabel(status: string) {
    switch(status) {
      case 'AVAILABLE': return 'Vacant Clean'
      case 'OCCUPIED': return 'Occupied'
      case 'DIRTY': return 'Vacant Dirty'
      case 'OUT_OF_ORDER': return 'Out of Order'
      default: return status
    }
  }

  function getRoomTypeAbbr(roomType: string) {
    switch(roomType?.toLowerCase()) {
      case 'standard': return 'Sta'
      case 'deluxe': return 'Del'
      case 'suite': return 'Sui'
      case 'premium': return 'Pre'
      default: return 'Std'
    }
  }

  const statusCounts = rooms?.reduce((acc, room) => {
    const status = room.status
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const statusData = [
    { key: 'AVAILABLE', label: 'Vacant Clean', color: 'bg-green-500', count: statusCounts.AVAILABLE || 0 },
    { key: 'OCCUPIED', label: 'Occupied', color: 'bg-red-500', count: statusCounts.OCCUPIED || 0 },
    { key: 'DIRTY', label: 'Vacant Dirty', color: 'bg-yellow-500', count: statusCounts.DIRTY || 0 },
    { key: 'OUT_OF_ORDER', label: 'Out of Order', color: 'bg-orange-500', count: statusCounts.OUT_OF_ORDER || 0 },
    { key: 'CLEANING', label: 'Being Cleaned', color: 'bg-blue-500', count: 0 } // Placeholder for future cleaning status
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Room & Housekeeping Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor room status and manage housekeeping operations.</p>
        </div>
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={load}
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        {statusData.map((status) => (
          <div key={status.key} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{status.count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{status.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {[
          { key: 'floor_map', label: 'Floor Map' },
          { key: 'housekeeping', label: 'Housekeeping' },
          { key: 'maintenance', label: 'Maintenance' },
          { key: 'reports', label: 'Reports' }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.key as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Room Status Map */}
      {activeTab === 'floor_map' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏠</span>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Room Status Map</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-8">
            {floors.map(floor => (
              <div key={floor} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Floor {floor}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{groups[floor].length} rooms</span>
                </div>
                
                <div className="grid grid-cols-15 gap-2">
                  {groups[floor].map((room: any) => (
                    <div
                      key={room.id}
                      className={`relative rounded-lg p-3 text-center cursor-pointer transition-all hover:shadow-md ${getStatusColor(room.status)} text-white`}
                      onClick={() => {
                        // Cycle through statuses on click
                        const statuses = ['AVAILABLE', 'OCCUPIED', 'DIRTY', 'OUT_OF_ORDER']
                        const currentIndex = statuses.indexOf(room.status)
                        const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                        setStatus(room.id, nextStatus)
                      }}
                    >
                      <div className="font-bold text-lg">{room.number}</div>
                      <div className="text-xs opacity-90">{getRoomTypeAbbr(room.roomType?.name)}</div>
                      {busy === room.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab !== 'floor_map' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">
              {activeTab === 'housekeeping' && '🧹'}
              {activeTab === 'maintenance' && '🔧'}
              {activeTab === 'reports' && '📊'}
            </div>
            <div className="text-lg font-medium mb-2">
              {activeTab === 'housekeeping' && 'Housekeeping Management'}
              {activeTab === 'maintenance' && 'Maintenance Management'}
              {activeTab === 'reports' && 'Room Reports'}
            </div>
            <div className="text-sm">
              This module is coming soon. Use the Floor Map to manage room statuses.
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          {statusData.map((status) => (
            <div key={status.key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${status.color}`}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{status.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
