// A Badge communicates status at a glance.
// It is one of the most reused components in NyaySetu —
// case status, document status, hearing urgency all use it.

import { cva, type VariantProps } from "class-variance-authority"

// cva = class-variance-authority
// It lets us define component variants cleanly
// without messy conditional className strings
// Install it: npm install class-variance-authority

import { cn } from "../../lib/utils"
// cn = className merge utility (comes with ShadCN)
// It merges Tailwind classes and handles conflicts

// ── Define all visual variants using cva ──────────────
const badgeVariants = cva(
  // Base classes applied to every badge regardless of variant
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        success:  "bg-green-100  text-green-800",
        warning:  "bg-amber-100  text-amber-800",
        critical: "bg-red-100    text-red-800",
        info:     "bg-blue-100   text-blue-800",
        neutral:  "bg-slate-100  text-slate-600",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

// ── Props Type ────────────────────────────────────────
// We extend VariantProps so TypeScript knows which
// variant values are valid — autocomplete works too
interface BadgeProps extends VariantProps<typeof badgeVariants> {
  label: string
  dot?: boolean   // optional colored dot indicator
  className?: string
}

// ── Component ─────────────────────────────────────────
export function Badge({ label, variant, dot = true, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current opacity-70"
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  )
}