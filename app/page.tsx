'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  Cpu,
  HardDrive,
  GitBranch,
  Activity,
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const features = [
  {
    icon: Cpu,
    title: 'CPU Scheduling',
    description: 'FCFS, SJF, Round Robin, and Priority scheduling with animated Gantt charts and metrics.'
  },
  {
    icon: HardDrive,
    title: 'Memory Management',
    description: 'FIFO and LRU page replacement with step-by-step paging visualization and fault tracking.'
  },
  {
    icon: GitBranch,
    title: 'Deadlock Detection',
    description: 'Build resource allocation graphs and detect cycles with interactive node editing.'
  },
  {
    icon: Activity,
    title: 'Process Monitor',
    description: 'Watch processes transition through New, Ready, Running, Waiting, and Terminated states.'
  }
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">OS Vision</span>
          </div>
          <Link href="/dashboard/cpu">
            <Button variant="secondary" size="sm">
              Dashboard
            </Button>
          </Link>
        </nav>

        <section className="mt-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-200">
              <Zap className="h-4 w-4" />
              Interactive Operating System Simulator
            </div>
            <h1 className="bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
              Visualize OS Concepts
              <br />
              in Real Time
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              OS Vision transforms abstract operating system theory into interactive simulations.
              Explore CPU scheduling, memory paging, deadlock detection, and process lifecycles
              with production-quality animations.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/dashboard/cpu">
                <Button size="lg">
                  Launch Simulator <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/memory">
                <Button variant="secondary" size="lg">
                  Try Memory Module
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="mt-28">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold">Four Core Modules</h2>
            <p className="mt-2 text-slate-400">Everything you need to understand OS behavior visually</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="h-full transition-colors hover:border-purple-500/30">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                      <f.icon className="h-5 w-5 text-purple-300" />
                    </div>
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-28 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/40 to-gray-950/60 p-10 text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-purple-400" />
          <h2 className="mt-4 text-2xl font-semibold">Built for Students & Educators</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Real algorithm implementations with exportable results, saved presets, and responsive design
            for lectures, labs, and self-study.
          </p>
          <Link href="/dashboard/cpu" className="mt-6 inline-block">
            <Button size="lg">Get Started</Button>
          </Link>
        </section>

        <footer className="mt-20 border-t border-white/10 py-8 text-center text-sm text-slate-500">
          OS Vision — Interactive Operating System Simulator
        </footer>
      </div>
    </main>
  )
}
