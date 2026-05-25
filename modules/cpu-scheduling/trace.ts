import { Process, ScheduledSegment } from '../../types'

export type CpuEvent = {
  time: number
  pid: string
  from: 'New' | 'Ready' | 'Running' | 'Waiting' | 'Terminated'
  to: 'New' | 'Ready' | 'Running' | 'Waiting' | 'Terminated'
  explanation: string
}

export function generateCpuTrace(processes: Process[], segments: ScheduledSegment[]): CpuEvent[] {
  const events: CpuEvent[] = []

  // Log arrivals: New -> Ready
  for (const p of processes) {
    events.push({ time: p.arrival, pid: p.id, from: 'New', to: 'Ready', explanation: `Process ${p.id} arrived at time ${p.arrival}, moved New → Ready.` })
  }

  // For each segment, log Ready -> Running at start
  // and Ran -> Ready/Terminated at end
  // segments assumed sorted by start time
  const segs = [...segments].sort((a, b) => a.start - b.start)
  for (const s of segs) {
    events.push({ time: s.start, pid: s.pid, from: 'Ready', to: 'Running', explanation: `Process ${s.pid} moved Ready → Running at time ${s.start}.` })
    // determine if more future work remains for this pid
    const future = segs.find(x => x.pid === s.pid && x.start > s.end)
    if (future) {
      events.push({ time: s.end, pid: s.pid, from: 'Running', to: 'Ready', explanation: `Process ${s.pid} ran until ${s.end} and moved Running → Ready (will run later).` })
    } else {
      events.push({ time: s.end, pid: s.pid, from: 'Running', to: 'Terminated', explanation: `Process ${s.pid} completed at time ${s.end}, Running → Terminated.` })
    }
  }

  // Sort events by time and stable order
  events.sort((a, b) => a.time - b.time || a.pid.localeCompare(b.pid))
  return events
}
