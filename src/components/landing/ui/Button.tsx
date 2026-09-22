import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Common = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  className?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-void-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void'

const sizes = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const variants = {
  primary:
    'text-void bg-gradient-to-r from-void-accent to-void-accent-2 hover:brightness-110 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_30px_-8px_rgba(56,189,248,0.55)]',
  secondary:
    'text-void-fg bg-transparent border border-void-border hover:border-white/25 hover:bg-white/[0.04]',
  ghost: 'text-void-muted hover:text-void-fg',
}

function classes(variant: Common['variant'], size: Common['size'], className?: string) {
  return [base, sizes[size ?? 'md'], variants[variant ?? 'primary'], className]
    .filter(Boolean)
    .join(' ')
}

// Link-style CTA (navigates / anchors).
export function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
  ...rest
}: Common & { href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  )
}

// Real <button> (form submit, JS-driven actions).
export function Button({
  children,
  variant,
  size,
  className,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}
