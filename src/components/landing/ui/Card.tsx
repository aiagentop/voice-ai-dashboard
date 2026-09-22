import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`group relative rounded-2xl border border-void-border bg-void-surface/60 p-6 transition-colors duration-300 hover:border-white/20 sm:p-7 ${className}`}
    >
      {children}
    </div>
  )
}
