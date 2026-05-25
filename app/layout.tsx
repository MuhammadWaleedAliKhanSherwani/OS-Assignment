import './globals.css'
import React from 'react'

export const metadata = {
  title: 'OS Vision',
  description: 'Operating System Simulator - OS Vision'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
