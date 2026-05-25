"use client"
import React, { useEffect, useRef, useState } from 'react'
import { CpuEvent } from '../modules/cpu-scheduling/trace'
import { motion, AnimatePresence } from 'framer-motion'

type Props = { events: CpuEvent[] }

export default function CpuTracePlayer({ events }: Props) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [delay, setDelay] = useState(700)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (playing && events.length) {
      timer.current = window.setInterval(() => {
        setIndex(i => {
          if (i >= events.length - 1) {
            setPlaying(false)
            return i
          }
          return i + 1
        })
      }, delay)
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
        timer.current = null
      }
    }
  }, [playing, delay, events.length])

  useEffect(() => {
    setIndex(0)
    setPlaying(false)
  }, [events])

  return (
    <div className="space-y-3 p-3 rounded bg-gray-900/20">
      <div className="flex items-center gap-2">
        <button onClick={() => setPlaying(p => !p)} className="px-3 py-2 rounded bg-indigo-600/80">{playing ? 'Pause' : 'Play'}</button>
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="px-3 py-2 rounded bg-gray-800/40">Prev</button>
        <button onClick={() => setIndex(i => Math.min(events.length - 1, i + 1))} className="px-3 py-2 rounded bg-gray-800/40">Next</button>
        <div className="ml-4 text-sm text-slate-400">Speed</div>
        <input type="range" min={200} max={2000} value={delay} onChange={e => setDelay(Number(e.target.value))} className="w-48" />
      </div>

      <div className="mt-2">
        <AnimatePresence mode="wait">
          {events.length ? (
            <motion.div key={index} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-3 bg-gray-900/40 rounded">
              <div className="text-xs text-slate-400">Time: {events[index].time}</div>
              <div className="text-sm font-medium mt-1">{events[index].explanation}</div>
              <div className="text-xs text-slate-400 mt-2">{events[index].pid}: {events[index].from} → {events[index].to}</div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 text-slate-400">No events</motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-h-40 overflow-auto mt-2 rounded bg-gray-900/10 p-2">
        {events.map((e, i) => (
          <button key={i} onClick={() => { setIndex(i); setPlaying(false) }} className={`w-full text-left p-2 rounded mb-1 ${i === index ? 'bg-indigo-700/30' : 'hover:bg-gray-800/20'}`}>
            <div className="flex items-center justify-between">
              <div className="text-sm">t={e.time} — {e.pid}</div>
              <div className="text-xs text-slate-400">{e.from}→{e.to}</div>
            </div>
            <div className="text-xs text-slate-400 mt-1 truncate">{e.explanation}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
