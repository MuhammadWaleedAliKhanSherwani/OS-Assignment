'use client'

import { motion } from 'framer-motion'
import { MonitoredProcess, ProcessState } from '../types'
import { cn } from '../lib/utils'

const stateColors: Record<ProcessState, string> = {
  New: 'from-slate-600 to-slate-700',
  Ready: 'from-blue-600 to-indigo-600',
  Running: 'from-emerald-500 to-green-600',
  Waiting: 'from-amber-600 to-orange-600',
  Terminated: 'from-gray-700 to-gray-800'
}

export default function AnimatedProcessNode({
  process,
  highlight
}: {
  process: MonitoredProcess
  highlight?: boolean
}) {
  return (
    <motion.div
      layout
      layoutId={`${process.id}-${process.state}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: highlight ? 1.05 : 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'rounded-xl bg-gradient-to-br p-3 text-white shadow-lg',
        stateColors[process.state],
        highlight && 'ring-2 ring-white/50'
      )}
    >
      <div className="text-sm font-semibold">{process.id}</div>
      <div className="mt-1 text-xs text-white/80">Burst: {process.burst}</div>
      <div className="text-xs text-white/70">Remaining: {process.remaining}</div>
      <div className="mt-2 text-[10px] uppercase tracking-wider text-white/60">{process.state}</div>
    </motion.div>
  )
}
