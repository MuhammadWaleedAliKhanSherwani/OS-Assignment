"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/' // fallback

  function item(href: string, label: string) {
    const active = path.startsWith(href)
    return (
      <Link href={href} className={`px-3 py-2 rounded-md ${active ? 'bg-gradient-to-r from-purple-600/30 to-indigo-500/20 ring-1 ring-purple-700/30' : 'hover:bg-gray-800'}`}>
        {label}
      </Link>
    )
  }

  return (
    <aside className="w-64 bg-gray-900/30 glass p-4 h-screen border-r border-gray-800">
      <nav className="flex flex-col gap-2">
        {item('/dashboard/cpu', 'CPU Scheduling')}
        {item('/dashboard/memory', 'Memory Management')}
        {item('/dashboard/deadlock', 'Deadlock Detection')}
        {item('/dashboard/process', 'Process Monitor')}
      </nav>
    </aside>
  )
}
