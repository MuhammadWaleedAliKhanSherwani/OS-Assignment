'use client'

import { motion } from 'framer-motion'
import { CpuEvent } from '../modules/cpu-scheduling/trace'
import { ProcessState } from '../types'

const LANES: ProcessState[] = ['Ready', 'Running', 'Waiting', 'Terminated']

const laneColors: Record<ProcessState, string> = {
  New: 'bg-slate-600',
  Ready: 'bg-blue-600',
  Running: 'bg-emerald-600',
  Waiting: 'bg-amber-600',
  Terminated: 'bg-gray-600'
}

function buildStateMap(events: CpuEvent[], upToIndex: number): Record<string, ProcessState> {
  const states: Record<string, ProcessState> = {}
  for (let i = 0; i <= upToIndex; i++) {
    const e = events[i]
    if (!e) continue
    states[e.pid] = e.to
  }
  return states
}

export default function CpuStateBoard({ events, index }: { events: CpuEvent[]; index: number }) {
  const states = buildStateMap(events, index)
  const pids = [...new Set(events.map(e => e.pid))]

  const lanes = LANES.map(lane => ({
    lane,
    processes: pids.filter(pid => states[pid] === lane)
  }))

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {lanes.map(({ lane, processes }) => (
        <div key={lane} className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">{lane}</div>
          <div className="flex min-h-[48px] flex-wrap gap-2">
            {processes.map(pid => (
              <motion.div
                key={pid}
                layoutId={`cpu-${pid}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${laneColors[lane]}`}
              >
                {pid}
              </motion.div>
            ))}
            {processes.length === 0 && <span className="text-xs text-slate-600">—</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
