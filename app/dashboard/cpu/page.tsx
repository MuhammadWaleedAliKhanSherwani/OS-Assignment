"use client"
import React, { useState } from 'react'
import { CpuEvent, generateCpuTrace } from '../../../modules/cpu-scheduling/trace'
import Controls from '../../../components/Controls'
import ProcessTable from '../../../components/ProcessTable'
import GanttChart from '../../../components/GanttChart'
import StatCard from '../../../components/StatCard'
import MetricsChart from '../../../components/MetricsChart'
import { Process, AlgorithmResult } from '../../../types'
import * as alg from '../../../modules/cpu-scheduling/algorithms'
import CpuTracePlayer from '../../../components/CpuTracePlayer'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { downloadJson } from '../../../utils/export'

const ALGORITHMS = [
  { value: 'FCFS', label: 'FCFS' },
  { value: 'SJF', label: 'SJF (Non-preemptive)' },
  { value: 'RR', label: 'Round Robin' },
  { value: 'PRIORITY', label: 'Priority (Non-preemptive)' }
]

export default function CPUPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrival: 0, burst: 5, priority: 2 },
    { id: 'P2', arrival: 2, burst: 3, priority: 1 },
    { id: 'P3', arrival: 4, burst: 1, priority: 3 }
  ])
  const [result, setResult] = useState<AlgorithmResult | null>(null)
  const [events, setEvents] = useState<CpuEvent[]>([])
  const [algorithm, setAlgorithm] = useState('FCFS')
  const [quantum, setQuantum] = useState(2)

  function handleAdd(p: Process) {
    setProcesses(prev => [...prev, p])
  }

  function handleRemove(id: string) {
    setProcesses(prev => prev.filter(p => p.id !== id))
  }

  function run() {
    if (!processes.length) return
    let r
    switch (algorithm) {
      case 'FCFS':
        r = alg.fcfs(processes)
        break
      case 'SJF':
        r = alg.sjf(processes)
        break
      case 'RR':
        r = alg.roundRobin(processes, quantum)
        break
      case 'PRIORITY':
        r = alg.priorityScheduling(processes)
        break
      default:
        r = alg.fcfs(processes)
    }
    setResult(r)
    setEvents(generateCpuTrace(processes, r.segments))
  }

  function resetAll() {
    setProcesses([
      { id: 'P1', arrival: 0, burst: 5, priority: 2 },
      { id: 'P2', arrival: 2, burst: 3, priority: 1 },
      { id: 'P3', arrival: 4, burst: 1, priority: 3 }
    ])
    setResult(null)
    setEvents([])
  }

  function handleExport() {
    downloadJson(
      { algorithm, quantum, processes, result, events },
      `cpu-scheduling-${algorithm.toLowerCase()}.json`
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">CPU Scheduling</h2>
          <p className="text-sm text-slate-400">Compare scheduling algorithms with live Gantt charts</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={algorithm}
            onChange={e => setAlgorithm(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm"
          >
            {ALGORITHMS.map(a => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          {algorithm === 'RR' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Quantum</span>
              <input
                type="number"
                value={quantum}
                onChange={e => setQuantum(Number(e.target.value))}
                min={1}
                className="w-16 rounded-lg border border-white/10 bg-white/5 p-2 text-sm"
              />
            </div>
          )}
          <Badge>{processes.length} processes</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controls
              processes={processes}
              onAdd={handleAdd}
              onRemove={handleRemove}
              onRun={run}
              onReset={resetAll}
              onExport={handleExport}
              onLoadPreset={setProcesses}
            />
            <ProcessTable processes={processes} />
          </div>

          <GanttChart segments={result?.segments ?? []} />

          {result && (
            <>
              <MetricsChart waitingTimes={result.waitingTimes} turnaroundTimes={result.turnaroundTimes} />
              <CpuTracePlayer events={events} />
            </>
          )}
        </div>

        <aside className="space-y-4">
          <StatCard title="Avg Waiting Time" value={result ? result.avgWaitingTime : '—'} subtitle="time units" />
          <StatCard title="Avg Turnaround Time" value={result ? result.avgTurnaroundTime : '—'} subtitle="time units" />
          <StatCard title="CPU Utilization" value={result ? `${result.cpuUtilization}%` : '—'} subtitle="busy / makespan" />

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Per-Process Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(result.waitingTimes).map(pid => (
                  <div key={pid} className="rounded-lg bg-white/5 p-3 text-sm">
                    <div className="font-medium">{pid}</div>
                    <div className="text-slate-400">Waiting: {result.waitingTimes[pid]}</div>
                    <div className="text-slate-400">Turnaround: {result.turnaroundTimes[pid]}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}
