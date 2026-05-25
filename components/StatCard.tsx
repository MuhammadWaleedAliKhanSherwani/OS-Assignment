"use client"
import React from 'react'

export default function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-black/30 glass shadow-inner">
      <div className="text-sm text-slate-300">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-400">{subtitle}</div>}
    </div>
  )
}
