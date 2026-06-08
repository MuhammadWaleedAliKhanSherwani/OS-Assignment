'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type Props = {
  waitingTimes: Record<string, number>
  turnaroundTimes: Record<string, number>
}

export default function MetricsChart({ waitingTimes, turnaroundTimes }: Props) {
  const data = Object.keys(waitingTimes).map(pid => ({
    pid,
    waiting: waitingTimes[pid],
    turnaround: turnaroundTimes[pid]
  }))

  if (!data.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Process Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="pid" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="waiting" fill="#7c5cff" name="Waiting Time" radius={[4, 4, 0, 0]} />
              <Bar dataKey="turnaround" fill="#34d399" name="Turnaround Time" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
