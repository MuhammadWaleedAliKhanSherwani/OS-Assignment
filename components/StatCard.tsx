'use client'

import { motion } from 'framer-motion'
import { Clock, TrendingUp, Gauge } from 'lucide-react'
import { cn } from '../lib/utils'

type Props = {
  title: string
  value: string | number
  subtitle?: string
  icon?: 'clock' | 'trend' | 'gauge'
}

const icons = { clock: Clock, trend: TrendingUp, gauge: Gauge }

export default function StatCard({ title, value, subtitle, icon }: Props) {
  const Icon = icon ? icons[icon] : null
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 shadow-xl backdrop-blur-md'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">{title}</div>
        {Icon && <Icon className="h-4 w-4 text-purple-400" />}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
    </motion.div>
  )
}
