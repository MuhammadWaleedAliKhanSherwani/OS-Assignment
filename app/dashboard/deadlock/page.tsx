'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Search, AlertTriangle } from 'lucide-react'
import GraphVisualizer from '../../../components/GraphVisualizer'
import { AlertDialog } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import {
  createSafeGraph,
  createSampleGraph,
  detectDeadlock
} from '../../../modules/deadlock/algorithms'
import { DeadlockEdge, DeadlockGraph, DeadlockNode } from '../../../types'
import { downloadJson } from '../../../utils/export'

let nodeCounter = 5

export default function DeadlockPage() {
  const [graph, setGraph] = useState<DeadlockGraph>(() => createSampleGraph())
  const [result, setResult] = useState(() => detectDeadlock(createSampleGraph()))
  const [showAlert, setShowAlert] = useState(false)
  const [edgeFrom, setEdgeFrom] = useState('')
  const [edgeTo, setEdgeTo] = useState('')
  const [edgeType, setEdgeType] = useState<'request' | 'assignment'>('request')
  useEffect(() => {
    setResult(detectDeadlock(graph))
  }, [graph])

  function runDetection() {
    const r = detectDeadlock(graph)
    setResult(r)
    if (r.hasDeadlock) setShowAlert(true)
  }

  function loadSample(sample: DeadlockGraph) {
    setGraph(sample)
    const r = detectDeadlock(sample)
    setResult(r)
    if (r.hasDeadlock) setShowAlert(true)
  }

  function addProcess() {
    nodeCounter++
    const id = `P${nodeCounter}`
    const node: DeadlockNode = {
      id,
      type: 'process',
      label: id,
      x: 80 + (nodeCounter % 3) * 40,
      y: 60 + (nodeCounter % 4) * 50
    }
    setGraph(g => ({ ...g, nodes: [...g.nodes, node] }))
  }

  function addResource() {
    nodeCounter++
    const id = `R${nodeCounter}`
    const node: DeadlockNode = {
      id,
      type: 'resource',
      label: id,
      x: 280 + (nodeCounter % 3) * 40,
      y: 60 + (nodeCounter % 4) * 50
    }
    setGraph(g => ({ ...g, nodes: [...g.nodes, node] }))
  }

  function addEdge() {
    if (!edgeFrom || !edgeTo || edgeFrom === edgeTo) return
    const fromNode = graph.nodes.find(n => n.id === edgeFrom)
    const toNode = graph.nodes.find(n => n.id === edgeTo)
    if (!fromNode || !toNode) return

    // Validate edge direction: request = process→resource, assignment = resource→process
    if (edgeType === 'request' && (fromNode.type !== 'process' || toNode.type !== 'resource')) return
    if (edgeType === 'assignment' && (fromNode.type !== 'resource' || toNode.type !== 'process')) return

    const edge: DeadlockEdge = {
      id: `e-${Date.now()}`,
      from: edgeFrom,
      to: edgeTo,
      type: edgeType
    }
    setGraph(g => ({ ...g, edges: [...g.edges, edge] }))
    setEdgeFrom('')
    setEdgeTo('')
  }

  function removeNode(id: string) {
    setGraph(g => ({
      nodes: g.nodes.filter(n => n.id !== id),
      edges: g.edges.filter(e => e.from !== id && e.to !== id)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Deadlock Detection</h2>
          <p className="text-sm text-slate-400">Resource Allocation Graph with cycle detection</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => loadSample(createSampleGraph())}>
            Deadlock Sample
          </Button>
          <Button variant="secondary" size="sm" onClick={() => loadSample(createSafeGraph())}>
            Safe Sample
          </Button>
          <Button onClick={runDetection}>
            <Search className="h-4 w-4" /> Detect Deadlock
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => downloadJson({ graph, result }, 'deadlock-analysis.json')}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Resource Allocation Graph</CardTitle>
            <CardDescription>Processes (circles) and Resources (squares)</CardDescription>
          </CardHeader>
          <CardContent>
            <GraphVisualizer graph={graph} cycle={result.cycle} />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant={result.hasDeadlock ? 'danger' : 'success'}>
                {result.hasDeadlock ? 'DEADLOCK DETECTED' : 'NO DEADLOCK'}
              </Badge>
              <span className="text-sm text-slate-400">{result.explanation}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Nodes</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={addProcess}>
                <Plus className="h-4 w-4" /> Process
              </Button>
              <Button variant="secondary" size="sm" onClick={addResource}>
                <Plus className="h-4 w-4" /> Resource
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Edge</CardTitle>
              <CardDescription>Request: Process → Resource. Assignment: Resource → Process.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                value={edgeFrom}
                onChange={e => setEdgeFrom(e.target.value)}
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm"
              >
                <option value="">From...</option>
                {graph.nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.type})
                  </option>
                ))}
              </select>
              <select
                value={edgeTo}
                onChange={e => setEdgeTo(e.target.value)}
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm"
              >
                <option value="">To...</option>
                {graph.nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.type})
                  </option>
                ))}
              </select>
              <select
                value={edgeType}
                onChange={e => setEdgeType(e.target.value as 'request' | 'assignment')}
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm"
              >
                <option value="request">Request (P→R)</option>
                <option value="assignment">Assignment (R→P)</option>
              </select>
              <Button className="w-full" onClick={addEdge}>
                Add Edge
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nodes & Edges</CardTitle>
            </CardHeader>
            <CardContent className="max-h-48 space-y-2 overflow-auto">
              {graph.nodes.map(n => (
                <div
                  key={n.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
                >
                  <span>
                    {n.label}{' '}
                    <Badge variant="muted" className="ml-1">
                      {n.type}
                    </Badge>
                  </span>
                  <button onClick={() => removeNode(n.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {graph.edges.length > 0 && (
                <div className="mt-2 border-t border-white/10 pt-2 text-xs text-slate-500">
                  {graph.edges.length} edge(s) defined
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={showAlert}
        onOpenChange={setShowAlert}
        variant="danger"
        title="Deadlock Detected!"
        description={result.explanation}
      >
        <div className="flex items-center gap-2 text-red-200">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm">Cycle: {result.cycle.join(' → ')}</span>
        </div>
      </AlertDialog>
    </div>
  )
}
