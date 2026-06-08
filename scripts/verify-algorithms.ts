import { fcfs, sjf, roundRobin, priorityScheduling } from '../modules/cpu-scheduling/algorithms'
import { fifo, lru } from '../modules/memory/algorithms'
import { detectDeadlock, createSampleGraph, createSafeGraph } from '../modules/deadlock/algorithms'
import { generateLifecycleSimulation, createSampleProcesses } from '../modules/process-monitor/simulator'

let passed = 0
let failed = 0

function assert(cond: boolean, msg: string) {
  if (cond) passed++
  else {
    failed++
    console.error('FAIL:', msg)
  }
}

const procs = [
  { id: 'P1', arrival: 0, burst: 5, priority: 2 },
  { id: 'P2', arrival: 2, burst: 3, priority: 1 },
  { id: 'P3', arrival: 4, burst: 1, priority: 3 }
]

const fcfsR = fcfs(procs)
assert(fcfsR.segments[0].pid === 'P1' && fcfsR.segments[0].start === 0, 'FCFS P1 starts at 0')
assert(fcfsR.segments[fcfsR.segments.length - 1].end === 9, 'FCFS makespan 9')
assert(fcfsR.waitingTimes['P2'] === 3, 'FCFS P2 waiting 3')

const sjfR = sjf(procs)
assert(sjfR.segments.find(s => s.pid === 'P3')!.start === 5, 'SJF P3 runs before P2 at t=5')

const rrR = roundRobin(procs, 2)
assert(rrR.segments.length > 3, 'RR has multiple segments')
assert(rrR.segments[rrR.segments.length - 1].end === 9, 'RR makespan 9')

const priR = priorityScheduling(procs)
assert(priR.segments.find(s => s.pid === 'P2')!.start === 5, 'Priority P2 after P1 at 5')

const refs = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
const fifoR = fifo(3, refs)
assert(fifoR.faults === 10, `FIFO faults expected 10 got ${fifoR.faults}`)
assert(fifoR.steps.length === refs.length, 'FIFO one step per reference')

const lruR = lru(3, refs)
assert(lruR.faults === 9, `LRU faults expected 9 got ${lruR.faults}`)
assert(lruR.faults <= fifoR.faults, 'LRU faults <= FIFO faults')
assert(lruR.steps.every(s => s.frames.filter(f => f !== null).length <= 3), 'LRU respects frame count')

const dead = detectDeadlock(createSampleGraph())
assert(dead.hasDeadlock && dead.cycle.length > 0, 'Sample graph has deadlock cycle')

const safe = detectDeadlock(createSafeGraph())
assert(!safe.hasDeadlock, 'Safe graph no deadlock')

const life = generateLifecycleSimulation(createSampleProcesses())
assert(life.transitions.some(t => t.to === 'Waiting'), 'Lifecycle includes Waiting')
assert(life.transitions[life.transitions.length - 1].to === 'Terminated', 'Lifecycle ends terminated')

const empty = fcfs([])
assert(empty.avgWaitingTime === 0 && !Number.isNaN(empty.avgWaitingTime), 'Empty FCFS safe')

const badFrames = fifo(0, refs)
assert(badFrames.steps.length === 0 && badFrames.faults === 0, 'FIFO 0 frames returns empty')

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
