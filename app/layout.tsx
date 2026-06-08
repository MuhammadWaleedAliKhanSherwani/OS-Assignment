import './globals.css'
import { ThemeProvider } from '../hooks/useTheme'

export const metadata = {
  title: 'OS Vision — Interactive OS Simulator',
  description: 'Visualize CPU scheduling, memory management, deadlocks, and process lifecycles'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
