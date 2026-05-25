"use client"
import React from 'react'
import { Process } from '../types'
import { motion } from 'framer-motion'

export default function ProcessTable({ processes }: { processes: Process[] }) {
  return (
    <div className="overflow-auto rounded-xl bg-gray-800/40 p-3 glass">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 text-left">
            <th className="p-2">PID</th>
            <th className="p-2">Arrival</th>
            <th className="p-2">Burst</th>
            <th className="p-2">Priority</th>
          </tr>
        </thead>
        <tbody>
          {processes.map(p => (
            <motion.tr key={p.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="border-t border-gray-800">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.arrival}</td>
              <td className="p-2">{p.burst}</td>
              <td className="p-2">{p.priority ?? '-'}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
