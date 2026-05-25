"use client"
import React from 'react'
import { MemoryStep } from '../modules/memory/algorithms'
import { motion, AnimatePresence } from 'framer-motion'

export default function MemoryGrid({ step, stepIndex }: { step: MemoryStep; stepIndex: number }) {
  return (
    <motion.div layout className="p-4 rounded-lg bg-gray-900/30 glass">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">Step {stepIndex + 1} — Reference: {step.reference}</div>
        <div className={`text-sm font-medium ${step.hit ? 'text-green-400' : 'text-red-400'}`}>{step.hit ? 'Hit' : 'Fault'}</div>
      </div>

      <div className="text-sm text-slate-300 mb-3">{step.explanation}</div>

      <div className="grid grid-cols-4 gap-3">
        {step.frames.map((f, i) => {
          const isRef = f === step.reference
          const empty = f === null
          const bg = isRef && step.hit ? 'from-green-600 to-green-500' : empty && !step.hit ? 'from-red-700 to-red-600' : 'from-gray-800 to-gray-700'
          const evicted = step.evicted && step.evicted.frame === i ? step.evicted.page : null
          return (
            <motion.div key={i} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`relative p-3 rounded bg-gradient-to-br ${bg} text-white`}>
              <div className="text-xs text-slate-300">Frame {i}</div>
              <div className="text-2xl font-semibold mt-1">{f ?? '-'}</div>

              <AnimatePresence>
                {evicted !== null && (
                  <motion.div
                    key={`evict-${i}`}
                    initial={{ x: 0, opacity: 1 }}
                    animate={{ x: 36, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-red-700/70 rounded"
                  >
                    <div className="text-sm font-semibold">Evict {evicted}</div>
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
