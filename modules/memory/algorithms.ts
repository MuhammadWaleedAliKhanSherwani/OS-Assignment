export type MemoryStep = {
  frames: (number | null)[]
  reference: number
  hit: boolean
  explanation: string
  evicted?: { page: number; frame: number } | null
}

function guardFrames(framesCount: number, refs: number[]) {
  if (framesCount <= 0 || refs.length === 0) {
    return { steps: [] as MemoryStep[], faults: 0 }
  }
  return null
}

/** Stack tracks pages in frames; index 0 = LRU, last = MRU */
function touchStack(stack: number[], page: number) {
  const i = stack.indexOf(page)
  if (i >= 0) stack.splice(i, 1)
  stack.push(page)
}

export function fifo(framesCount: number, refs: number[]): { steps: MemoryStep[]; faults: number } {
  const guard = guardFrames(framesCount, refs)
  if (guard) return guard

  const frames: (number | null)[] = Array(framesCount).fill(null)
  /** Pages in memory, FIFO order (oldest at front) */
  const queue: number[] = []
  const steps: MemoryStep[] = []
  let faults = 0

  for (const r of refs) {
    if (frames.includes(r)) {
      const idx = frames.indexOf(r)
      steps.push({
        frames: [...frames],
        reference: r,
        hit: true,
        explanation: `Page ${r} found in frame ${idx} (hit). No page fault.`,
        evicted: null
      })
      continue
    }

    faults++
    const emptyIdx = frames.indexOf(null)
    let evicted: MemoryStep['evicted'] = null

    if (emptyIdx >= 0) {
      frames[emptyIdx] = r
      queue.push(r)
      steps.push({
        frames: [...frames],
        reference: r,
        hit: false,
        explanation: `Page ${r} loaded into frame ${emptyIdx} (empty slot). Page fault.`,
        evicted: null
      })
      continue
    }

    const victim = queue.shift() as number
    const idx = frames.indexOf(victim)
    if (idx >= 0) frames[idx] = r
    queue.push(r)
    evicted = { page: victim, frame: idx }
    steps.push({
      frames: [...frames],
      reference: r,
      hit: false,
      explanation: `Page ${r} loaded into frame ${idx}, evicting page ${victim} (FIFO). Page fault.`,
      evicted
    })
  }

  return { steps, faults }
}

export function lru(framesCount: number, refs: number[]): { steps: MemoryStep[]; faults: number } {
  const guard = guardFrames(framesCount, refs)
  if (guard) return guard

  const frames: (number | null)[] = Array(framesCount).fill(null)
  const stack: number[] = []
  const steps: MemoryStep[] = []
  let faults = 0

  for (const r of refs) {
    if (frames.includes(r)) {
      touchStack(stack, r)
      const idx = frames.indexOf(r)
      steps.push({
        frames: [...frames],
        reference: r,
        hit: true,
        explanation: `Page ${r} found in frame ${idx} (hit). Marked most-recently-used.`,
        evicted: null
      })
      continue
    }

    faults++
    const emptyIdx = frames.indexOf(null)
    let evicted: MemoryStep['evicted'] = null

    if (emptyIdx >= 0) {
      frames[emptyIdx] = r
      touchStack(stack, r)
      steps.push({
        frames: [...frames],
        reference: r,
        hit: false,
        explanation: `Page ${r} loaded into frame ${emptyIdx} (empty slot). Page fault.`,
        evicted: null
      })
      continue
    }

    const victim = stack.shift() as number
    const idx = frames.indexOf(victim)
    if (idx >= 0) frames[idx] = r
    touchStack(stack, r)
    evicted = { page: victim, frame: idx }
    steps.push({
      frames: [...frames],
      reference: r,
      hit: false,
      explanation: `Page ${r} loaded into frame ${idx}; evicted least-recently-used page ${victim} (LRU). Page fault.`,
      evicted
    })
  }

  return { steps, faults }
}
