export type MemoryStep = {
  frames: (number | null)[]
  reference: number
  hit: boolean
  explanation: string
  evicted?: { page: number; frame: number } | null
}

export function fifo(framesCount: number, refs: number[]): { steps: MemoryStep[]; faults: number } {
  const frames: (number | null)[] = Array(framesCount).fill(null)
  const queue: number[] = []
  const steps: MemoryStep[] = []
  let faults = 0

  for (const r of refs) {
    const hit = frames.includes(r)
    let explanation = ''
    if (hit) {
      const idx = frames.indexOf(r)
      explanation = `Page ${r} found in frame ${idx} (hit). No page fault.`
      steps.push({ frames: [...frames], reference: r, hit, explanation, evicted: null })
      continue
    }

    faults++
    if (queue.length < framesCount) {
      // place in next empty slot
      const emptyIdx = frames.indexOf(null)
      const placeIdx = emptyIdx >= 0 ? emptyIdx : queue.length
      frames[placeIdx] = r
      queue.push(r)
      explanation = `Page ${r} loaded into frame ${placeIdx} (empty slot). Page fault.`
      steps.push({ frames: [...frames], reference: r, hit, explanation, evicted: null })
      continue
    }

    const evict = queue.shift() as number
    const idx = frames.indexOf(evict)
    if (idx >= 0) frames[idx] = r
    queue.push(r)
    explanation = `Page ${r} loaded into frame ${idx}, evicting page ${evict} (FIFO). Page fault.`
    steps.push({ frames: [...frames], reference: r, hit, explanation, evicted: { page: evict, frame: idx } })
  }

  return { steps, faults }
}

export function lru(framesCount: number, refs: number[]): { steps: MemoryStep[]; faults: number } {
  const frames: (number | null)[] = Array(framesCount).fill(null)
  const recent: number[] = [] // most recent at end
  const steps: MemoryStep[] = []
  let faults = 0

  for (const r of refs) {
    const hit = frames.includes(r)
    let explanation = ''
    if (!hit) {
      faults++
      if (recent.length < framesCount) {
        const empty = frames.indexOf(null)
        const place = empty >= 0 ? empty : frames.indexOf(null)
        if (place >= 0) frames[place] = r
        recent.push(r)
        explanation = `Page ${r} loaded into frame ${place} (empty slot). Page fault.`
        steps.push({ frames: [...frames], reference: r, hit, explanation, evicted: null })
        continue
      } else {
        const lru = recent.shift() as number
        const idx = frames.indexOf(lru)
        if (idx >= 0) frames[idx] = r
        recent.push(r)
        explanation = `Page ${r} loaded into frame ${idx}; evicted least-recently-used page ${lru} (LRU). Page fault.`
        steps.push({ frames: [...frames], reference: r, hit, explanation, evicted: { page: lru, frame: idx } })
        continue
      }
    }

    // move to most recent
    const idxR = recent.indexOf(r)
    if (idxR >= 0) {
      recent.splice(idxR, 1)
      recent.push(r)
    }
    const idx = frames.indexOf(r)
    explanation = `Page ${r} is already in frame ${idx} (hit). Marked most-recently-used.`
    steps.push({ frames: [...frames], reference: r, hit, explanation, evicted: null })
  }

  return { steps, faults }
}
