export type Process = {
  id: string
  arrival: number
  burst: number
  priority?: number
}

export type ScheduledSegment = {
  pid: string
  start: number
  end: number
}

export type AlgorithmResult = {
  segments: ScheduledSegment[]
  waitingTimes: Record<string, number>
  turnaroundTimes: Record<string, number>
  avgWaitingTime: number
  avgTurnaroundTime: number
  cpuUtilization: number
}
