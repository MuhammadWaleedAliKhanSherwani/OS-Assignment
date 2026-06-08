'use client'

import { useEffect, useRef, useState } from 'react'
import { CpuEvent } from '../modules/cpu-scheduling/trace'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import CpuStateBoard from './CpuStateBoard'

type Props = { events: CpuEvent[] }

export default function CpuTracePlayer({ events }: Props) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [delay, setDelay] = useState(700)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!playing || !events.length) return
    timer.current = window.setInterval(() => {
      setIndex(i => {
        if (i >= events.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, delay)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [playing, delay, events])

  useEffect(() => {
    setIndex(0)
    setPlaying(false)
  }, [events])

  if (!events.length) return null

  const current = events[index]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Process State Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setPlaying(p => !p)}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIndex(i => Math.max(0, i - 1))}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIndex(i => Math.min(events.length - 1, i + 1))}>
            <SkipForward className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-400">Speed</span>
          <input
            type="range"
            min={200}
            max={2000}
            value={delay}
            onChange={e => setDelay(Number(e.target.value))}
            className="w-32 md:w-48"
          />
          <span className="ml-auto text-xs text-slate-500">
            {index + 1} / {events.length}
          </span>
        </div>

        <CpuStateBoard events={events} index={index} />

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="text-xs text-slate-400">Time: {current.time}</div>
            <div className="mt-1 text-sm font-medium">{current.explanation}</div>
            <div className="mt-2 text-xs text-purple-300">
              {current.pid}: {current.from} → {current.to}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="max-h-40 overflow-auto rounded-xl bg-black/20 p-2">
          {events.map((e, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i)
                setPlaying(false)
              }}
              className={`mb-1 w-full rounded-lg p-2 text-left text-sm transition-colors ${
                i === index ? 'bg-purple-600/30' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>
                  t={e.time} — {e.pid}
                </span>
                <span className="text-xs text-slate-400">
                  {e.from}→{e.to}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
