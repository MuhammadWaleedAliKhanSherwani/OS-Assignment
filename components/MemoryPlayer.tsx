"use client"
import React, { useEffect, useState, useRef } from 'react'
import { MemoryStep } from '../modules/memory/algorithms'
import MemoryGrid from './MemoryGrid'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  steps: MemoryStep[]
}

export default function MemoryPlayer({ steps }: Props) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [delay, setDelay] = useState(800) // ms per step
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (playing && steps.length) {
      timerRef.current = window.setInterval(() => {
        setIndex(i => {
          if (i >= steps.length - 1) {
            setPlaying(false)
            return i
          }
          return i + 1
        })
      }, delay)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [playing, delay, steps.length])

  useEffect(() => {
    // when steps change, reset index
    setIndex(0)
    setPlaying(false)
  }, [steps])

  function togglePlay() {
    if (!steps.length) return
    setPlaying(p => !p)
  }

  function stepForward() {
    setIndex(i => Math.min(steps.length - 1, i + 1))
  }

  function stepBack() {
    setIndex(i => Math.max(0, i - 1))
  }

  function handleExport() {
    const data = JSON.stringify(steps, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'memory-simulation.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button onClick={togglePlay} className="px-3 py-2 rounded bg-indigo-600/80">{playing ? 'Pause' : 'Play'}</button>
        <button onClick={stepBack} className="px-3 py-2 rounded bg-gray-800/40">Prev</button>
        <button onClick={stepForward} className="px-3 py-2 rounded bg-gray-800/40">Next</button>
        <div className="ml-4 text-sm text-slate-400">Speed</div>
        <input type="range" min={200} max={2000} value={delay} onChange={e => setDelay(Number(e.target.value))} className="w-48" />
        <div className="ml-auto flex gap-2">
          <button onClick={handleExport} className="px-3 py-2 rounded bg-green-600/80">Export</button>
        </div>
      </div>

      <div>
        <AnimatePresence mode="wait">
          {steps.length ? (
            <motion.div key={index} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <MemoryGrid step={steps[index]} stepIndex={index} />
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded bg-gray-900/20 text-slate-400">No steps yet — run a simulation.</motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">History</div>
          <div className="text-xs text-slate-400">Click an item to jump</div>
        </div>
        <div className="max-h-44 overflow-auto mt-2 rounded bg-gray-900/20 p-2">
          {steps.length === 0 && <div className="text-sm text-slate-400 p-2">No history yet</div>}
          {steps.map((s, i) => (
            <button key={i} onClick={() => { setIndex(i); setPlaying(false) }} className={`w-full text-left p-2 rounded mb-1 ${i === index ? 'bg-indigo-700/30' : 'hover:bg-gray-800/30'}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Step {i + 1} — Ref {s.reference}</div>
                <div className={`text-xs font-semibold ${s.hit ? 'text-green-400' : 'text-red-400'}`}>{s.hit ? 'Hit' : 'Fault'}</div>
              </div>
              <div className="text-xs text-slate-400 mt-1 truncate">{s.explanation}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
