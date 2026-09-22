import type { ReactNode } from 'react'
import { Badge } from './Badge'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'center' | 'left'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <div className={align === 'center' ? 'mb-5 flex justify-center' : 'mb-5'}>
          <Badge>{eyebrow}</Badge>
        </div>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-void-fg sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-balance text-base leading-relaxed text-void-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
