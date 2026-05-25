"use client"
import React from 'react'
import { ScheduledSegment } from '../types'
import { motion } from 'framer-motion'

function totalLength(segments: ScheduledSegment[]) {
  if (!segments.length) return 0
  return segments[segments.length - 1].end
}

export default function GanttChart({ segments }: { segments: ScheduledSegment[] }) {
  const total = totalLength(segments) || 1
  return (
    <div className="w-full bg-gray-900/30 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">Gantt Chart</div>
      <div className="w-full h-14 bg-gray-800/40 rounded overflow-hidden flex items-stretch">
        {segments.map((s, idx) => {
          const width = ((s.end - s.start) / total) * 100
          const color = `linear-gradient(90deg, hsl(${(idx * 75) % 360} 70% 50%), hsl(${(idx * 75 + 40) % 360} 70% 35%))`
          return (
            <motion.div
              layout
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 + idx * 0.02 }}
              className={`h-full flex items-center justify-center text-xs font-medium text-white border-r border-black/20`}
              style={{ width: `${width}%`, background: color }}
            >
              <div className="px-2 py-1 rounded">{s.pid}</div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <div>Timeline: 0 — {total}</div>
        <div className="italic">Segments: {segments.length}</div>
      </div>
    </div>
  )
}
