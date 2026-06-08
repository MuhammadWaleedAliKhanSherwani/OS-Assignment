'use client'

import React from 'react'
import { MemoryStep } from '../modules/memory/algorithms'
import { motion, AnimatePresence } from 'framer-motion'

export default function MemoryGrid({ step, stepIndex, frameCount }: { step: MemoryStep; stepIndex: number; frameCount?: number }) {
  const cols = frameCount ?? step.frames.length
  return (
    <motion.div layout className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Step {stepIndex + 1} — Reference: <span className="font-semibold text-white">{step.reference}</span>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${step.hit ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
          {step.hit ? 'HIT' : 'PAGE FAULT'}
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-300">{step.explanation}</div>

      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${Math.min(cols, 6)}, minmax(0, 1fr))` }}>
        {step.frames.map((f, i) => {
          const isRef = f === step.reference
          const empty = f === null
          const bg = isRef && step.hit
            ? 'from-emerald-600 to-emerald-500 ring-2 ring-emerald-300/50'
            : !step.hit && (empty || step.evicted?.frame === i)
              ? 'from-red-700 to-red-600 ring-2 ring-red-400/40'
              : 'from-gray-800 to-gray-700'
          const evicted = step.evicted && step.evicted.frame === i ? step.evicted.page : null

          return (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`relative rounded-xl bg-gradient-to-br ${bg} p-4 text-white shadow-lg`}
            >
              <div className="text-xs text-white/60">Frame {i}</div>
              <div className="mt-1 text-2xl font-bold">{f ?? '—'}</div>
              <AnimatePresence>
                {evicted !== null && (
                  <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.5, y: -20 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-800/80"
                  >
                    <span className="text-sm font-bold">Evict {evicted}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
