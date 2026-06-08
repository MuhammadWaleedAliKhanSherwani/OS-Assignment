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

export type ProcessState = 'New' | 'Ready' | 'Running' | 'Waiting' | 'Terminated'

export type MonitoredProcess = {
  id: string
  state: ProcessState
  burst: number
  remaining: number
  priority: number
}

export type DeadlockNode = {
  id: string
  type: 'process' | 'resource'
  label: string
  x: number
  y: number
}

export type DeadlockEdge = {
  id: string
  from: string
  to: string
  type: 'request' | 'assignment'
}

export type DeadlockGraph = {
  nodes: DeadlockNode[]
  edges: DeadlockEdge[]
}

export type DeadlockDetectionResult = {
  hasDeadlock: boolean
  cycle: string[]
  waitForGraph: Record<string, string[]>
  explanation: string
}
