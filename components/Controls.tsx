'use client'

import { useState } from 'react'
import { Download, Save, Trash2 } from 'lucide-react'
import { Process } from '../types'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { usePresets } from '../hooks/usePresets'

type Props = {
  processes: Process[]
  onAdd: (p: Process) => void
  onRemove: (id: string) => void
  onRun: () => void
  onReset: () => void
  onExport: () => void
  onLoadPreset: (processes: Process[]) => void
}

export default function Controls({
  processes,
  onAdd,
  onRemove,
  onRun,
  onReset,
  onExport,
  onLoadPreset
}: Props) {
  const [arrival, setArrival] = useState(0)
  const [burst, setBurst] = useState(1)
  const [priority, setPriority] = useState(1)
  const [presetName, setPresetName] = useState('')
  const { presets, savePreset, deletePreset, loadPreset } = usePresets<Process[]>('cpu-processes', [])

  function nextId() {
    const nums = processes.map(p => parseInt(p.id.replace(/\D/g, ''), 10)).filter(n => !Number.isNaN(n))
    const max = nums.length ? Math.max(...nums) : 0
    return `P${max + 1}`
  }

  function add() {
    if (Number(burst) < 1) return
    onAdd({ id: nextId(), arrival: Number(arrival), burst: Number(burst), priority: Number(priority) })
  }

  function handleSavePreset() {
    if (!presetName.trim() || !processes.length) return
    savePreset(presetName.trim(), processes)
    setPresetName('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Process Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Arrival</label>
            <Input type="number" value={arrival} onChange={e => setArrival(Number(e.target.value))} min={0} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Burst</label>
            <Input type="number" value={burst} onChange={e => setBurst(Number(e.target.value))} min={1} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Priority</label>
            <Input type="number" value={priority} onChange={e => setPriority(Number(e.target.value))} min={1} />
          </div>
        </div>

        <Button onClick={add} className="w-full">
          Add Process
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="success" onClick={onRun}>
            Run Simulation
          </Button>
          <Button variant="destructive" onClick={onReset}>
            Reset
          </Button>
          <Button variant="secondary" onClick={onExport}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="mb-2 text-xs text-slate-400">Save / Load Presets</div>
          <div className="flex gap-2">
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={e => setPresetName(e.target.value)}
            />
            <Button variant="secondary" size="icon" onClick={handleSavePreset}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 max-h-24 space-y-1 overflow-auto">
            {Object.keys(presets).map(name => (
              <div key={name} className="flex items-center justify-between rounded bg-white/5 px-2 py-1 text-sm">
                <button
                  className="hover:text-purple-300"
                  onClick={() => {
                    const p = loadPreset(name)
                    if (p) onLoadPreset(p)
                  }}
                >
                  {name}
                </button>
                <button onClick={() => deletePreset(name)} className="text-red-400">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {processes.length > 0 && (
          <div className="space-y-1">
            {processes.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded bg-white/5 px-3 py-1.5 text-sm">
                <span>
                  {p.id} — A:{p.arrival} B:{p.burst} P:{p.priority}
                </span>
                <button onClick={() => onRemove(p.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
