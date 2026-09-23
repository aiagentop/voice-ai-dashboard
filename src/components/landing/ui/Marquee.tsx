import type { ReactNode } from 'react'

// Infinite horizontal marquee — the track is duplicated once and
// translated by exactly -50%, so the loop is seamless. Runs
// continuously (no pause-on-hover) per spec.
export function Marquee({
  children,
  durationS = 28,
  className = '',
}: {
  children: ReactNode
  durationS?: number
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="agentop-marquee-track items-center"
        style={{ animationDuration: `${durationS}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
