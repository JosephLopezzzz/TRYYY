"use client"
import { signOut } from 'next-auth/react'

export default function SidebarLogout(){
  async function onClick(){
    await signOut({ redirect: true, callbackUrl: '/login' })
  }
  return (
    <button onClick={onClick} className="mt-2 block w-full text-center bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded px-3 py-2">
      Logout
    </button>
  )
}
