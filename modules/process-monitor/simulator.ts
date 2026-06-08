import { MonitoredProcess, ProcessState } from '../../types'

export type ProcessTransition = {
  time: number
  processId: string
  from: ProcessState
  to: ProcessState
  reason: string
  remainingAfter?: number
}

export function createSampleProcesses(): MonitoredProcess[] {
  return [
    { id: 'P1', state: 'New', burst: 4, remaining: 4, priority: 2 },
    { id: 'P2', state: 'New', burst: 3, remaining: 3, priority: 1 },
    { id: 'P3', state: 'New', burst: 2, remaining: 2, priority: 3 }
  ]
}

/**
 * Deterministic FCFS lifecycle with a mid-run I/O block on P1.
 * Each transition carries remainingAfter for accurate UI rebuild.
 */
export function generateLifecycleSimulation(processes: MonitoredProcess[]): {
  transitions: ProcessTransition[]
  finalProcesses: MonitoredProcess[]
} {
  const transitions: ProcessTransition[] = []
  const remaining: Record<string, number> = {}
  for (const p of processes) remaining[p.id] = p.burst

  let time = 0

  function admit(pid: string) {
    transitions.push({
      time,
      processId: pid,
      from: 'New',
      to: 'Ready',
      reason: `${pid} admitted to ready queue`,
      remainingAfter: remaining[pid]
    })
  }

  function dispatch(pid: string) {
    transitions.push({
      time,
      processId: pid,
      from: 'Ready',
      to: 'Running',
      reason: `CPU dispatched to ${pid}`,
      remainingAfter: remaining[pid]
    })
  }

  function block(pid: string) {
    transitions.push({
      time,
      processId: pid,
      from: 'Running',
      to: 'Waiting',
      reason: `${pid} blocked waiting for I/O`,
      remainingAfter: remaining[pid]
    })
  }

  function unblock(pid: string) {
    transitions.push({
      time,
      processId: pid,
      from: 'Waiting',
      to: 'Ready',
      reason: `${pid} I/O complete — back to ready queue`,
      remainingAfter: remaining[pid]
    })
  }

  function complete(pid: string) {
    remaining[pid] = 0
    transitions.push({
      time,
      processId: pid,
      from: 'Running',
      to: 'Terminated',
      reason: `${pid} finished execution`,
      remainingAfter: 0
    })
  }

  function run(pid: string, ticks: number) {
    remaining[pid] = Math.max(0, remaining[pid] - ticks)
    time += ticks
  }

  // All processes created
  for (const p of processes) admit(p.id)
  time += 1

  // P1 runs 2 ticks, blocks on I/O
  dispatch('P1')
  run('P1', 2)
  block('P1')
  time += 2 // I/O in progress

  // P2 runs to completion (FCFS while P1 waits)
  dispatch('P2')
  run('P2', 3)
  complete('P2')

  // P3 runs to completion
  dispatch('P3')
  run('P3', 2)
  complete('P3')

  // P1 resumes and finishes
  unblock('P1')
  dispatch('P1')
  run('P1', 2)
  complete('P1')

  const finalProcesses = processes.map(p => ({
    ...p,
    state: 'Terminated' as ProcessState,
    remaining: 0
  }))

  return { transitions, finalProcesses }
}

export function rebuildFromTransitions(
  initial: MonitoredProcess[],
  transitions: ProcessTransition[],
  upToIndex: number
): MonitoredProcess[] {
  const map = Object.fromEntries(
    initial.map(p => [p.id, { ...p, state: 'New' as ProcessState, remaining: p.burst }])
  ) as Record<string, MonitoredProcess>

  for (let i = 0; i <= upToIndex; i++) {
    const t = transitions[i]
    if (!t) continue
    const proc = map[t.processId]
    if (!proc) continue
    proc.state = t.to
    if (t.remainingAfter !== undefined) proc.remaining = t.remainingAfter
  }

  return Object.values(map)
}

export function getProcessesByState(processes: MonitoredProcess[]): Record<ProcessState, MonitoredProcess[]> {
  const buckets: Record<ProcessState, MonitoredProcess[]> = {
    New: [],
    Ready: [],
    Running: [],
    Waiting: [],
    Terminated: []
  }
  for (const p of processes) buckets[p.state].push(p)
  return buckets
}
