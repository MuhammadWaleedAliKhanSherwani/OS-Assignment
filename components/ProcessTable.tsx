"use client"
import React from 'react'
import { Process } from '../types'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function ProcessTable({ processes }: { processes: Process[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Process Queue</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0 pt-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400">
              <th className="p-3">PID</th>
              <th className="p-3">Arrival</th>
              <th className="p-3">Burst</th>
              <th className="p-3">Priority</th>
            </tr>
          </thead>
          <tbody>
            {processes.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  No processes — add one to begin
                </td>
              </tr>
            )}
            {processes.map(p => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-white/5"
              >
                <td className="p-3 font-medium">{p.id}</td>
                <td className="p-3">{p.arrival}</td>
                <td className="p-3">{p.burst}</td>
                <td className="p-3">{p.priority ?? '—'}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
