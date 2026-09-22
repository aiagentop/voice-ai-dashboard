// Agentop mark, dark-theme variant — same chevron shape as the dashboard's
// brand mark, recolored for a near-black background instead of the warm
// paper one. Keeps the mark recognizable across the whole product.
export function Mark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect width="48" height="48" rx="11" fill="url(#agentop-mark-gradient)" />
      <path
        d="M18 15 L31 24 L18 33"
        stroke="#05070B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="agentop-mark-gradient" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  )
}
