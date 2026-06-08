'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
  variant?: 'danger' | 'default'
}

export function AlertDialog({ open, onOpenChange, title, description, children, variant = 'default' }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-2xl',
            variant === 'danger'
              ? 'border-red-500/40 bg-gradient-to-br from-red-950/90 to-gray-950/95'
              : 'border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-950/95'
          )}
        >
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          {description && <Dialog.Description className="mt-2 text-sm text-slate-400">{description}</Dialog.Description>}
          {children && <div className="mt-4">{children}</div>}
          <Dialog.Close asChild>
            <Button variant="secondary" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
