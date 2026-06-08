'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Cpu,
  HardDrive,
  GitBranch,
  Activity,
  Menu,
  X,
  Sparkles
} from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { href: '/dashboard/cpu', label: 'CPU Scheduling', icon: Cpu },
  { href: '/dashboard/memory', label: 'Memory Management', icon: HardDrive },
  { href: '/dashboard/deadlock', label: 'Deadlock Detection', icon: GitBranch },
  { href: '/dashboard/process', label: 'Process Monitor', icon: Activity }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const content = (
    <>
      <Link href="/" className="mb-8 flex items-center gap-3 px-2 transition-opacity hover:opacity-80">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-500 shadow-lg shadow-purple-900/40">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold">OS Vision</div>
          <div className="text-xs text-slate-500">Simulator</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                active
                  ? 'bg-gradient-to-r from-purple-600/25 to-indigo-500/15 text-white ring-1 ring-purple-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-slate-500">
        Interactive OS learning platform with real-time visualizations.
      </div>
    </>
  )

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-lg border border-white/10 bg-gray-900/90 p-2 lg:hidden"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : undefined }}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-gray-950/80 p-4 backdrop-blur-xl transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {content}
      </motion.aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}
