"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar({ title }: { title?: string }) {
  const [dark, setDark] = useState(true)

  function toggleTheme() {
    setDark(v => !v)
    if (typeof window !== 'undefined') document.documentElement.classList.toggle('dark')
  }

  return (
    <motion.div layout className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gradient-to-b from-transparent to-black/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center font-bold shadow-lg">OV</div>
        <h3 className="text-lg font-semibold">{title ?? 'OS Vision'}</h3>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="px-3 py-1 bg-gray-800/40 hover:bg-gray-800 rounded flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: dark ? '#7c5cff' : '#94a3b8' }} />
          <span className="text-sm">{dark ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </motion.div>
  )
}
