'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_PREFIX = 'os-vision-preset-'

export function usePresets<T>(key: string, defaultValue: T) {
  const storageKey = `${STORAGE_PREFIX}${key}`
  const [presets, setPresets] = useState<Record<string, T>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setPresets(JSON.parse(raw))
    } catch {
      setPresets({})
    }
  }, [storageKey])

  const savePreset = useCallback(
    (name: string, value: T) => {
      setPresets(prev => {
        const next = { ...prev, [name]: value }
        localStorage.setItem(storageKey, JSON.stringify(next))
        return next
      })
    },
    [storageKey]
  )

  const deletePreset = useCallback(
    (name: string) => {
      setPresets(prev => {
        const next = { ...prev }
        delete next[name]
        localStorage.setItem(storageKey, JSON.stringify(next))
        return next
      })
    },
    [storageKey]
  )

  const loadPreset = useCallback(
    (name: string): T | null => {
      return presets[name] ?? null
    },
    [presets]
  )

  return { presets, savePreset, deletePreset, loadPreset, defaultValue }
}
