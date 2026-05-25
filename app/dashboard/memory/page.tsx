"use client"
import React, { useState } from 'react'
import MemoryControls from '../../../components/MemoryControls'
import MemoryGrid from '../../../components/MemoryGrid'
import MemoryPlayer from '../../../components/MemoryPlayer'
import * as mem from '../../../modules/memory/algorithms'

export default function MemoryPage() {
  const [steps, setSteps] = useState<mem.MemoryStep[]>([])
  const [faults, setFaults] = useState<number | null>(null)

  function handleRun(frames: number, refs: number[], algorithm: string) {
    let res
    if (algorithm === 'FIFO') res = mem.fifo(frames, refs)
    else res = mem.lru(frames, refs)
    setSteps(res.steps)
    setFaults(res.faults)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Memory Management</h2>
        <div className="text-sm text-slate-400">Visualization: Page Replacement (FIFO / LRU)</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <MemoryControls onRun={handleRun} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-lg bg-gray-900/20 glass">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-300">Simulation Player</div>
              <div className="text-sm text-slate-400">Faults: {faults ?? '-'}</div>
            </div>
          </div>

          <div className="space-y-3">
            <MemoryPlayer steps={steps} />
          </div>
        </div>
      </div>
    </div>
  )
}
