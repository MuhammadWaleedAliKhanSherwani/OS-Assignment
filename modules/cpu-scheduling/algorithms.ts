import { Process, AlgorithmResult, ScheduledSegment } from '../../types'

function computeMetrics(segments: ScheduledSegment[], procs: Process[]): AlgorithmResult {
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}

  const finishTimes: Record<string, number> = {}
  const startTimes: Record<string, number> = {}

  for (const s of segments) {
    if (!(s.pid in startTimes)) startTimes[s.pid] = s.start
    finishTimes[s.pid] = s.end
  }

  let totalBurst = 0
  procs.forEach(p => (totalBurst += p.burst))

  for (const p of procs) {
    const start = startTimes[p.id] ?? p.arrival
    const finish = finishTimes[p.id] ?? start
    waitingTimes[p.id] = Math.max(0, start - p.arrival)
    turnaroundTimes[p.id] = finish - p.arrival
  }

  const avgWaiting = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / procs.length
  const avgTurnaround = Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / procs.length

  const makespan = segments.length ? segments[segments.length - 1].end : 0
  const cpuUtil = makespan > 0 ? (totalBurst / makespan) * 100 : 0

  return {
    segments,
    waitingTimes,
    turnaroundTimes,
    avgWaitingTime: Number(avgWaiting.toFixed(2)),
    avgTurnaroundTime: Number(avgTurnaround.toFixed(2)),
    cpuUtilization: Number(cpuUtil.toFixed(2))
  }
}

export function fcfs(processes: Process[]): AlgorithmResult {
  const procs = [...processes].sort((a, b) => a.arrival - b.arrival)
  const segments: ScheduledSegment[] = []
  let time = 0

  for (const p of procs) {
    if (time < p.arrival) time = p.arrival
    const start = time
    time += p.burst
    segments.push({ pid: p.id, start, end: time })
  }

  return computeMetrics(segments, procs)
}

export function sjf(processes: Process[]): AlgorithmResult {
  const procs = [...processes].map(p => ({ ...p }))
  const n = procs.length
  const segments: ScheduledSegment[] = []
  let time = 0
  const finished = new Set<string>()

  while (finished.size < n) {
    const ready = procs.filter(p => p.arrival <= time && !finished.has(p.id))
    if (ready.length === 0) {
      // advance to next arrival
      const next = procs.filter(p => !finished.has(p.id)).reduce((a, b) => (a.arrival < b.arrival ? a : b))
      time = Math.max(time, next.arrival)
      continue
    }
    ready.sort((a, b) => a.burst - b.burst)
    const p = ready[0]
    const start = time
    time += p.burst
    segments.push({ pid: p.id, start, end: time })
    finished.add(p.id)
  }

  return computeMetrics(segments, procs)
}

export function roundRobin(processes: Process[], quantum: number): AlgorithmResult {
  if (quantum <= 0) quantum = 1
  const procs = [...processes].map(p => ({ ...p }))
  const remaining: Record<string, number> = {}
  for (const p of procs) remaining[p.id] = p.burst

  const segments: ScheduledSegment[] = []
  let time = 0
  const queue: string[] = []
  const arrived = new Set<string>()

  while (Object.values(remaining).some(v => v > 0)) {
    // add arrivals
    for (const p of procs) {
      if (p.arrival <= time && !arrived.has(p.id)) {
        queue.push(p.id)
        arrived.add(p.id)
      }
    }

    if (queue.length === 0) {
      // next arrival
      const next = procs.filter(p => remaining[p.id] > 0 && !arrived.has(p.id)).reduce((a, b) => (a.arrival < b.arrival ? a : b), procs[0])
      time = Math.max(time, next.arrival)
      continue
    }

    const pid = queue.shift() as string
    const proc = procs.find(p => p.id === pid) as Process
    const rem = remaining[pid]
    const run = Math.min(quantum, rem)
    const start = time
    time += run
    remaining[pid] -= run
    segments.push({ pid, start, end: time })

    // enqueue newly arrived during this quantum
    for (const p of procs) {
      if (p.arrival > start && p.arrival <= time && !arrived.has(p.id)) {
        queue.push(p.id)
        arrived.add(p.id)
      }
    }

    if (remaining[pid] > 0) queue.push(pid)
  }

  return computeMetrics(segments, procs)
}

export function priorityScheduling(processes: Process[]): AlgorithmResult {
  // non-preemptive priority (lower number = higher priority)
  const procs = [...processes].map(p => ({ ...p }))
  const n = procs.length
  const segments: ScheduledSegment[] = []
  let time = 0
  const finished = new Set<string>()

  while (finished.size < n) {
    const ready = procs.filter(p => p.arrival <= time && !finished.has(p.id))
    if (ready.length === 0) {
      const next = procs.filter(p => !finished.has(p.id)).reduce((a, b) => (a.arrival < b.arrival ? a : b))
      time = Math.max(time, next.arrival)
      continue
    }
    ready.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    const p = ready[0]
    const start = time
    time += p.burst
    segments.push({ pid: p.id, start, end: time })
    finished.add(p.id)
  }

  return computeMetrics(segments, procs)
}
