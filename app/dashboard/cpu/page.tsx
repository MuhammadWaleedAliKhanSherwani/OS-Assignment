"use client"
import React, { useState } from 'react'
import { CpuEvent } from '../../../modules/cpu-scheduling/trace'
import Controls from '../../../components/Controls'
import ProcessTable from '../../../components/ProcessTable'
import GanttChart from '../../../components/GanttChart'
import StatCard from '../../../components/StatCard'
import { Process, AlgorithmResult } from '../../../types'
import * as alg from '../../../modules/cpu-scheduling/algorithms'
import { generateCpuTrace } from '../../../modules/cpu-scheduling/trace'
import CpuTracePlayer from '../../../components/CpuTracePlayer'

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

  function run() {
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
    // generate trace events
    const events = generateCpuTrace(processes, r.segments)
    setEvents(events)
  }

  function resetAll() {
    setProcesses([])
    setResult(null)
    setEvents([])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">CPU Scheduling</h2>
            <div className="flex items-center gap-2">
              <select value={algorithm} onChange={e => setAlgorithm(e.target.value)} className="p-2 rounded bg-gray-800/50">
                <option value="FCFS">FCFS</option>
                <option value="SJF">SJF</option>
                <option value="RR">Round Robin</option>
                <option value="PRIORITY">Priority</option>
              </select>
              {algorithm === 'RR' && (
                <input type="number" value={quantum} onChange={e => setQuantum(Number(e.target.value))} className="w-20 p-2 rounded bg-gray-800/50" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controls processes={processes} onAdd={handleAdd} onRun={run} onReset={resetAll} />
            <ProcessTable processes={processes} />
          </div>

          <div className="mt-4">
            <GanttChart segments={result?.segments ?? []} />
          </div>
          {result && (
            <div className="mt-4">
              <CpuTracePlayer events={events} />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <StatCard title="Avg Waiting" value={result ? result.avgWaitingTime : '--'} />
          <StatCard title="Avg Turnaround" value={result ? result.avgTurnaroundTime : '--'} />
          <StatCard title="CPU Utilization" value={result ? `${result.cpuUtilization}%` : '--'} />
        </aside>
      </div>

      {result && (
        <div className="rounded-lg bg-gray-800/40 p-4 glass">
          <h3 className="font-semibold">Per-Process Metrics</h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
            {Object.keys(result.waitingTimes).map((pid: string) => (
              <div key={pid} className="p-2 bg-gray-900/40 rounded">
                <div className="text-sm text-slate-400">{pid}</div>
                <div className="font-medium">Waiting: {result.waitingTimes[pid]}</div>
                <div className="font-medium">Turnaround: {result.turnaroundTimes[pid]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
