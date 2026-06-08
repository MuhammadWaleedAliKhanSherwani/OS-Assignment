'use client'

import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { Button } from './ui/button'

export default function Navbar({ title }: { title?: string }) {
  const { theme, toggle, mounted } = useTheme()

  return (
    <motion.header
      layout
      className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-gray-950/60 px-4 py-3 backdrop-blur-xl lg:px-6 dark:bg-gray-950/60 light:bg-white/80"
    >
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <h3 className="text-lg font-semibold tracking-tight">{title ?? 'OS Vision'}</h3>
      </div>
      <Button variant="secondary" size="sm" onClick={toggle} disabled={!mounted}>
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {mounted ? (theme === 'dark' ? 'Light' : 'Dark') : 'Theme'}
      </Button>
    </motion.header>
  )
}
