"use client"
import React, { useState } from 'react'

type Props = {
  onRun: (frames: number, refs: number[], algorithm: string) => void
}

export default function MemoryControls({ onRun }: Props) {
  const [frames, setFrames] = useState(3)
  const [refs, setRefs] = useState('7,0,1,2,0,3,0,4,2,3,0,3,2')
  const [algorithm, setAlgorithm] = useState('FIFO')

  function run() {
    const parsed = refs.split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n))
    onRun(frames, parsed, algorithm)
  }

  return (
    <div className="p-4 rounded-lg bg-gray-900/20 glass space-y-3">
      <div className="flex gap-2">
        <label className="text-sm text-slate-400">Frames</label>
        <input type="number" value={frames} onChange={e => setFrames(Number(e.target.value))} className="w-20 p-2 rounded bg-gray-800/40" />
        <select value={algorithm} onChange={e => setAlgorithm(e.target.value)} className="p-2 rounded bg-gray-800/40">
          <option>FIFO</option>
          <option>LRU</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-slate-400">Reference String (comma separated)</label>
        <input value={refs} onChange={e => setRefs(e.target.value)} className="w-full p-2 rounded bg-gray-800/40 mt-1" />
      </div>

      <div className="flex gap-2">
        <button onClick={run} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded">Run</button>
      </div>
    </div>
  )
}
