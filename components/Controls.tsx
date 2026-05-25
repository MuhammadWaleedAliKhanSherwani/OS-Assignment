import React, { useState } from 'react'
import { Process } from '../types'

type Props = {
  processes: Process[]
  onAdd: (p: Process) => void
  onRun: () => void
  onReset: () => void
}

export default function Controls({ processes, onAdd, onRun, onReset }: Props) {
  const [arrival, setArrival] = useState(0)
  const [burst, setBurst] = useState(1)
  const [priority, setPriority] = useState(0)

  function add() {
    const id = `P${processes.length + 1}`
    onAdd({ id, arrival: Number(arrival), burst: Number(burst), priority: Number(priority) })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={arrival} onChange={e => setArrival(Number(e.target.value))} type="number" className="w-24 p-2 rounded bg-gray-800/50" />
        <input value={burst} onChange={e => setBurst(Number(e.target.value))} type="number" className="w-24 p-2 rounded bg-gray-800/50" />
        <input value={priority} onChange={e => setPriority(Number(e.target.value))} type="number" className="w-24 p-2 rounded bg-gray-800/50" />
        <button onClick={add} className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 rounded">Add</button>
      </div>

      <div className="flex gap-2">
        <button onClick={onRun} className="px-4 py-2 bg-green-600 rounded">Run Simulation</button>
        <button onClick={onReset} className="px-4 py-2 bg-red-600 rounded">Reset</button>
      </div>
    </div>
  )
}
