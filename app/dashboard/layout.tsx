import React from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <Navbar title="OS Vision — Simulator" />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
