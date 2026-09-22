// Agentop mark — a minimal rounded square with a forward/automation chevron.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`h-9 w-9 ${className}`}
      fill="none"
      aria-hidden
    >
      <rect width="48" height="48" rx="11" fill="var(--color-ink)" />
      <path
        d="M18 15 L31 24 L18 33"
        stroke="var(--color-paper)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo />
      <span className="font-sans text-[17px] font-bold tracking-tight text-ink">
        Agentop
      </span>
    </div>
  )
}
