import { DeadlockDetectionResult, DeadlockGraph } from '../../types'

/**
 * Build wait-for graph from Resource Allocation Graph (RAG).
 * P1 -> R (request), R -> P2 (assignment) implies P1 waits for P2.
 */
function buildWaitForGraph(graph: DeadlockGraph): Record<string, string[]> {
  const waitFor: Record<string, string[]> = {}
  const processIds = graph.nodes.filter(n => n.type === 'process').map(n => n.id)

  for (const pid of processIds) waitFor[pid] = []

  for (const edge of graph.edges) {
    if (edge.type !== 'request') continue
    const fromNode = graph.nodes.find(n => n.id === edge.from)
    const toNode = graph.nodes.find(n => n.id === edge.to)
    if (!fromNode || !toNode || fromNode.type !== 'process' || toNode.type !== 'resource') continue

    const resourceId = toNode.id
    const requester = fromNode.id

    // Find who holds this resource (assignment edge: resource -> process)
    const holderEdge = graph.edges.find(
      e => e.type === 'assignment' && e.from === resourceId
    )
    if (!holderEdge) continue

    const holder = holderEdge.to
    if (holder !== requester && waitFor[requester]) {
      if (!waitFor[requester].includes(holder)) waitFor[requester].push(holder)
    }
  }

  return waitFor
}

function detectCycle(waitFor: Record<string, string[]>): string[] {
  const visited = new Set<string>()
  const stack = new Set<string>()
  const path: string[] = []
  let cycle: string[] = []

  function dfs(node: string): boolean {
    visited.add(node)
    stack.add(node)
    path.push(node)

    for (const next of waitFor[node] ?? []) {
      if (!visited.has(next)) {
        if (dfs(next)) return true
      } else if (stack.has(next)) {
        const start = path.indexOf(next)
        cycle = [...path.slice(start), next]
        return true
      }
    }

    stack.delete(node)
    path.pop()
    return false
  }

  for (const node of Object.keys(waitFor)) {
    if (!visited.has(node) && dfs(node)) break
  }

  return cycle
}

export function detectDeadlock(graph: DeadlockGraph): DeadlockDetectionResult {
  const waitForGraph = buildWaitForGraph(graph)
  const cycle = detectCycle(waitForGraph)

  if (cycle.length > 0) {
    const unique = [...new Set(cycle)]
    return {
      hasDeadlock: true,
      cycle: unique,
      waitForGraph,
      explanation: `Deadlock detected! Cycle in wait-for graph: ${unique.join(' → ')} → ${unique[0]}`
    }
  }

  const requestCount = graph.edges.filter(e => e.type === 'request').length
  return {
    hasDeadlock: false,
    cycle: [],
    waitForGraph,
    explanation:
      requestCount === 0
        ? 'No resource requests defined. Add request edges (Process → Resource) to analyze.'
        : 'No cycle detected in the wait-for graph. System is deadlock-free.'
  }
}

export function createSampleGraph(): DeadlockGraph {
  return {
    nodes: [
      { id: 'P1', type: 'process', label: 'P1', x: 120, y: 80 },
      { id: 'P2', type: 'process', label: 'P2', x: 120, y: 220 },
      { id: 'R1', type: 'resource', label: 'R1', x: 320, y: 80 },
      { id: 'R2', type: 'resource', label: 'R2', x: 320, y: 220 }
    ],
    edges: [
      { id: 'e1', from: 'R1', to: 'P1', type: 'assignment' },
      { id: 'e2', from: 'R2', to: 'P2', type: 'assignment' },
      { id: 'e3', from: 'P1', to: 'R2', type: 'request' },
      { id: 'e4', from: 'P2', to: 'R1', type: 'request' }
    ]
  }
}

export function createSafeGraph(): DeadlockGraph {
  return {
    nodes: [
      { id: 'P1', type: 'process', label: 'P1', x: 100, y: 100 },
      { id: 'R1', type: 'resource', label: 'R1', x: 300, y: 100 }
    ],
    edges: [{ id: 'e1', from: 'R1', to: 'P1', type: 'assignment' }]
  }
}
