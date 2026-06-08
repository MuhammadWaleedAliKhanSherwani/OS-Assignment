'use client'

import React, { useState } from 'react'
import { Save, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { usePresets } from '../hooks/usePresets'

type Preset = { frames: number; refs: string; algorithm: string }

type Props = {
  onRun: (frames: number, refs: number[], algorithm: string) => void
}

export default function MemoryControls({ onRun }: Props) {
  const [frames, setFrames] = useState(3)
  const [refs, setRefs] = useState('7,0,1,2,0,3,0,4,2,3,0,3,2')
  const [algorithm, setAlgorithm] = useState('FIFO')
  const [presetName, setPresetName] = useState('')
  const { presets, savePreset, deletePreset, loadPreset } = usePresets<Preset>('memory', {
    frames: 3,
    refs: '7,0,1,2,0,3,0,4,2,3,0,3,2',
    algorithm: 'FIFO'
  })

  function run() {
    const parsed = refs
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => Number(s))
      .filter(n => !Number.isNaN(n))
    if (!parsed.length || frames < 1) return
    onRun(Math.min(frames, 10), parsed, algorithm)
  }

  function handleSavePreset() {
    if (!presetName.trim()) return
    savePreset(presetName.trim(), { frames, refs, algorithm })
    setPresetName('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Simulation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Frames</label>
            <Input type="number" value={frames} onChange={e => setFrames(Number(e.target.value))} min={1} max={10} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">Algorithm</label>
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm"
            >
              <option>FIFO</option>
              <option>LRU</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">Page Reference String</label>
          <Input value={refs} onChange={e => setRefs(e.target.value)} placeholder="7,0,1,2,0,3,0,4" />
        </div>

        <Button onClick={run} className="w-full">
          Run Simulation
        </Button>

        <div className="border-t border-white/10 pt-4">
          <div className="mb-2 text-xs text-slate-400">Presets</div>
          <div className="flex gap-2">
            <Input placeholder="Preset name" value={presetName} onChange={e => setPresetName(e.target.value)} />
            <Button variant="secondary" size="icon" onClick={handleSavePreset}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 space-y-1">
            {Object.keys(presets).map(name => (
              <div key={name} className="flex items-center justify-between rounded bg-white/5 px-2 py-1 text-sm">
                <button
                  className="hover:text-purple-300"
                  onClick={() => {
                    const p = loadPreset(name)
                    if (p) {
                      setFrames(p.frames)
                      setRefs(p.refs)
                      setAlgorithm(p.algorithm)
                    }
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
      </CardContent>
    </Card>
  )
}
