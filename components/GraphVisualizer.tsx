'use client'

import { motion } from 'framer-motion'
import { DeadlockEdge, DeadlockGraph, DeadlockNode } from '../types'
import { cn } from '../lib/utils'

type Props = {
  graph: DeadlockGraph
  cycle: string[]
  onNodeClick?: (node: DeadlockNode) => void
}

function edgePath(from: DeadlockNode, to: DeadlockNode) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const cx = from.x + dx * 0.5
  const cy = from.y + dy * 0.5 + (from.type === to.type ? 0 : 40)
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`
}

export default function GraphVisualizer({ graph, cycle, onNodeClick }: Props) {
  const cycleSet = new Set(cycle)

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20">
      <svg viewBox="0 0 480 320" className="h-[320px] w-full">
        <defs>
          <marker id="arrow-request" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#f87171" />
          </marker>
          <marker id="arrow-assign" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#34d399" />
          </marker>
        </defs>

        {graph.edges.map(edge => {
          const from = graph.nodes.find(n => n.id === edge.from)
          const to = graph.nodes.find(n => n.id === edge.to)
          if (!from || !to) return null
          const inCycle =
            cycleSet.has(edge.from) && cycleSet.has(edge.to) && edge.type === 'request'
          return (
            <motion.path
              key={edge.id}
              d={edgePath(from, to)}
              fill="none"
              stroke={inCycle ? '#ef4444' : edge.type === 'request' ? '#f87171' : '#34d399'}
              strokeWidth={inCycle ? 3 : 2}
              strokeDasharray={edge.type === 'request' ? '6 4' : undefined}
              markerEnd={`url(#arrow-${edge.type === 'request' ? 'request' : 'assign'})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )
        })}

        {graph.nodes.map(node => {
          const inCycle = cycleSet.has(node.id)
          const isProcess = node.type === 'process'
          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              className="cursor-pointer"
              onClick={() => onNodeClick?.(node)}
            >
              {isProcess ? (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={28}
                  className={cn(
                    'fill-indigo-600 stroke-2',
                    inCycle ? 'stroke-red-400' : 'stroke-indigo-300'
                  )}
                />
              ) : (
                <rect
                  x={node.x - 24}
                  y={node.y - 24}
                  width={48}
                  height={48}
                  rx={6}
                  className={cn(
                    'fill-emerald-700 stroke-2',
                    inCycle ? 'stroke-red-400' : 'stroke-emerald-300'
                  )}
                />
              )}
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="fill-white text-sm font-semibold"
              >
                {node.label}
              </text>
            </motion.g>
          )
        })}
      </svg>

      <div className="absolute bottom-3 left-3 flex gap-3 text-xs">
        <span className="flex items-center gap-1 text-red-300">
          <span className="h-0.5 w-4 bg-red-400" /> Request
        </span>
        <span className="flex items-center gap-1 text-emerald-300">
          <span className="h-0.5 w-4 bg-emerald-400" /> Assignment
        </span>
      </div>
    </div>
  )
}
