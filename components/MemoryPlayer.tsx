'use client'

import { useEffect, useRef, useState } from 'react'
import { MemoryStep } from '../modules/memory/algorithms'
import MemoryGrid from './MemoryGrid'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type Props = {
  steps: MemoryStep[]
}

export default function MemoryPlayer({ steps }: Props) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [delay, setDelay] = useState(800)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    setIndex(0)
    setPlaying(false)
  }, [steps])

  useEffect(() => {
    if (!playing || !steps.length) return
    timerRef.current = window.setInterval(() => {
      setIndex(i => {
        if (i >= steps.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, delay)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playing, delay, steps])

  function handleExport() {
    const blob = new Blob([JSON.stringify(steps, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'memory-simulation.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Paging Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => steps.length && setPlaying(p => !p)} disabled={!steps.length}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={!steps.length}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIndex(i => Math.min(steps.length - 1, i + 1))}
            disabled={!steps.length}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-400">Interval (ms)</span>
          <input
            type="range"
            min={200}
            max={2000}
            value={delay}
            onChange={e => setDelay(Number(e.target.value))}
            className="w-32 md:w-48"
          />
          <span className="ml-auto text-xs text-slate-500">
            {steps.length ? `${index + 1} / ${steps.length}` : '0 / 0'}
          </span>
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={!steps.length}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {steps.length ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <MemoryGrid step={steps[index]} stepIndex={index} />
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
              Run a simulation to see paging steps
            </div>
          )}
        </AnimatePresence>

        {steps.length > 0 && (
          <div className="max-h-44 overflow-auto rounded-xl bg-black/20 p-2">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i)
                  setPlaying(false)
                }}
                className={`mb-1 w-full rounded-lg p-2 text-left text-sm ${
                  i === index ? 'bg-purple-600/30' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>
                    Step {i + 1} — Ref {s.reference}
                  </span>
                  <span className={s.hit ? 'text-emerald-400' : 'text-red-400'}>{s.hit ? 'Hit' : 'Fault'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
