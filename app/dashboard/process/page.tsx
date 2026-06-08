'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Download } from 'lucide-react'
import AnimatedProcessNode from '../../../components/AnimatedProcessNode'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import {
  createSampleProcesses,
  generateLifecycleSimulation,
  getProcessesByState,
  rebuildFromTransitions
} from '../../../modules/process-monitor/simulator'
import { MonitoredProcess, ProcessState } from '../../../types'
import { downloadJson } from '../../../utils/export'

const STATE_ORDER: ProcessState[] = ['New', 'Ready', 'Running', 'Waiting', 'Terminated']

export default function ProcessMonitorPage() {
  const initial = useMemo(() => createSampleProcesses(), [])
  const [transitions, setTransitions] = useState<ReturnType<typeof generateLifecycleSimulation>['transitions']>([])
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(900)
  const timer = useRef<number | null>(null)

  const processes = useMemo(
    () => (index < 0 ? initial : rebuildFromTransitions(initial, transitions, index)),
    [initial, transitions, index]
  )

  function reset() {
    setTransitions([])
    setIndex(-1)
    setPlaying(false)
  }

  function startSimulation() {
    if (timer.current) clearInterval(timer.current)
    const sim = generateLifecycleSimulation(initial)
    setTransitions(sim.transitions)
    setIndex(-1)
    setPlaying(true)
  }

  useEffect(() => {
    if (!playing || !transitions.length) return
    timer.current = window.setInterval(() => {
      setIndex(i => {
        if (i >= transitions.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, speed)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [playing, speed, transitions])

  const buckets = getProcessesByState(processes)
  const currentEvent = index >= 0 ? transitions[index] : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Process Monitor</h2>
          <p className="text-sm text-slate-400">Real-time process state lifecycle visualization</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={startSimulation}>
            <Play className="h-4 w-4" /> Start Simulation
          </Button>
          <Button variant="secondary" onClick={() => setPlaying(p => !p)} disabled={!transitions.length}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="secondary" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              downloadJson({ processes, transitions, currentIndex: index }, 'process-monitor.json')
            }
          >
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-slate-400">Speed</span>
        <input
          type="range"
          min={300}
          max={2000}
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="w-48"
        />
        <Badge variant="muted">
          Step {Math.max(0, index + 1)} / {transitions.length || 0}
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        {currentEvent && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm"
          >
            <span className="text-purple-300">t={currentEvent.time}</span> — {currentEvent.reason}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATE_ORDER.map(state => (
          <Card key={state} className="min-h-[180px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{state}</CardTitle>
              <CardDescription>{buckets[state].length} process(es)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <AnimatePresence>
                {buckets[state].map(p => (
                  <AnimatedProcessNode
                    key={p.id}
                    process={p}
                    highlight={currentEvent?.processId === p.id}
                  />
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Process Table</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="p-2">PID</th>
                <th className="p-2">State</th>
                <th className="p-2">Burst</th>
                <th className="p-2">Remaining</th>
                <th className="p-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(p => (
                <motion.tr
                  key={p.id}
                  layout
                  className="border-b border-white/5"
                  animate={{
                    backgroundColor:
                      currentEvent?.processId === p.id ? 'rgba(124,92,255,0.1)' : 'transparent'
                  }}
                >
                  <td className="p-2 font-medium">{p.id}</td>
                  <td className="p-2">
                    <Badge
                      variant={
                        p.state === 'Running' ? 'success' : p.state === 'Waiting' ? 'warning' : 'muted'
                      }
                    >
                      {p.state}
                    </Badge>
                  </td>
                  <td className="p-2">{p.burst}</td>
                  <td className="p-2">{p.remaining}</td>
                  <td className="p-2">{p.priority}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
