import React from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="OS Vision — Simulator" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
