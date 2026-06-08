import { cn } from '../../lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-purple-500/20 text-purple-200 border border-purple-500/30',
        success: 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30',
        danger: 'bg-red-500/20 text-red-200 border border-red-500/30',
        warning: 'bg-amber-500/20 text-amber-200 border border-amber-500/30',
        muted: 'bg-white/5 text-slate-400 border border-white/10'
      }
    },
    defaultVariants: { variant: 'default' }
  }
)

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
