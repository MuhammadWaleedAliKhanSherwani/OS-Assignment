import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold">OS Vision</h1>
          <Link href="/dashboard/cpu" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg">Launch Simulator</Link>
        </div>

        <div className="mt-10 bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-medium">Visual Operating System Simulator</h2>
          <p className="mt-4 text-slate-300">Explore CPU scheduling, memory management, deadlock detection, and process lifecycle with interactive animations and realtime metrics.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-800/60">CPU Scheduling</div>
            <div className="p-4 rounded-lg bg-gray-800/60">Memory Management</div>
            <div className="p-4 rounded-lg bg-gray-800/60">Deadlock Detection</div>
          </div>
        </div>
      </section>
    </main>
  )
}
