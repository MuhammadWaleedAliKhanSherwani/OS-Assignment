"use client"
import React, { useMemo, useState } from 'react'
import MemoryControls from '../../../components/MemoryControls'
import MemoryPlayer from '../../../components/MemoryPlayer'
import StatCard from '../../../components/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import * as mem from '../../../modules/memory/algorithms'
import { motion } from 'framer-motion'

export default function MemoryPage() {
  const [steps, setSteps] = useState<mem.MemoryStep[]>([])
  const [faults, setFaults] = useState<number | null>(null)
  const [refs, setRefs] = useState<number[]>([])

  function handleRun(frames: number, referenceString: number[], algorithm: string) {
    const res = algorithm === 'FIFO' ? mem.fifo(frames, referenceString) : mem.lru(frames, referenceString)
    setSteps(res.steps)
    setFaults(res.faults)
    setRefs(referenceString)
  }

  const hits = useMemo(() => steps.filter(s => s.hit).length, [steps])
  const total = steps.length
  const hitRate = total ? ((hits / total) * 100).toFixed(1) : '—'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Memory Management</h2>
          <p className="text-sm text-slate-400">FIFO & LRU page replacement with paging visualization</p>
        </div>
      </div>

      {refs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Page Reference String</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {refs.map((r, i) => {
                const step = steps[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                      step?.hit
                        ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                        : step
                          ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/30'
                          : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {r}
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard title="Page Faults" value={faults ?? '—'} icon="gauge" />
        <StatCard title="Hits" value={hits || '—'} icon="trend" />
        <StatCard title="Total References" value={total || '—'} icon="clock" />
        <StatCard title="Hit Rate" value={hitRate !== '—' ? `${hitRate}%` : '—'} icon="trend" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MemoryControls onRun={handleRun} />
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Badge variant={faults && faults > 0 ? 'danger' : 'muted'}>
              {faults !== null ? `${faults} page fault(s)` : 'Run a simulation'}
            </Badge>
          </div>
          <MemoryPlayer steps={steps} />
        </div>
      </div>
    </div>
  )
}
