"use client"
import React from 'react'
import { ScheduledSegment } from '../types'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

function totalLength(segments: ScheduledSegment[]) {
  if (!segments.length) return 0
  return segments[segments.length - 1].end
}

const colors = ['#7c5cff', '#34d399', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']

export default function GanttChart({ segments }: { segments: ScheduledSegment[] }) {
  const total = totalLength(segments) || 1

  if (!segments.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gantt Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-16 items-center justify-center rounded-xl bg-white/5 text-sm text-slate-500">
            Run a simulation to see the Gantt chart
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <div className="flex h-16 items-stretch">
            {segments.map((s, idx) => {
              const width = ((s.end - s.start) / total) * 100
              const color = colors[idx % colors.length]
              return (
                <motion.div
                  layout
                  key={`${s.pid}-${s.start}-${idx}`}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                  className="flex items-center justify-center border-r border-black/30 text-xs font-semibold text-white"
                  style={{ width: `${width}%`, background: color, transformOrigin: 'left' }}
                  title={`${s.pid}: ${s.start}-${s.end}`}
                >
                  {width > 8 && s.pid}
                </motion.div>
              )
            })}
          </div>
          <div className="flex justify-between px-3 py-2 text-xs text-slate-500">
            <span>0</span>
            <span>Timeline: {total} time units</span>
            <span>{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
