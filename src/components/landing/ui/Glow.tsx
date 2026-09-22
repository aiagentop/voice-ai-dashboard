// Decorative ambient glow — purely visual, never obstructs content.
export function Glow({
  className = '',
  color = 'var(--color-void-accent)',
}: {
  className?: string
  color?: string
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-[110px] ${className}`}
      style={{
        background: `radial-gradient(circle, ${color}33, transparent 70%)`,
      }}
    />
  )
}
