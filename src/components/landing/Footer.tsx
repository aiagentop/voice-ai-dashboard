// ========================================
// FOOTER
// ========================================

import { landingConfig, footerColumns, isPlaceholder } from '@/lib/landing-config'
import { Mark } from './ui/Mark'

export function Footer() {
  const year = new Date().getFullYear()
  const hasPhone = !isPlaceholder(landingConfig.phone)
  const socials = Object.entries(landingConfig.social).filter(([, url]) => url)

  return (
    <footer className="border-t border-void-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark className="h-8 w-8" />
              <span className="text-[17px] font-bold tracking-tight text-void-fg">
                {landingConfig.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-void-muted">
              AI voice agents for U.S. service businesses.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-void-muted">
              Solutions
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerColumns.solutions.map((s) => (
                <li key={s} className="text-sm text-void-muted">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-void-muted">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerColumns.company.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="text-sm text-void-muted transition-colors hover:text-void-fg"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-void-muted">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-void-muted">
              <li>
                <a
                  href={`mailto:${landingConfig.email}`}
                  className="transition-colors hover:text-void-fg"
                >
                  {landingConfig.email}
                </a>
              </li>
              {hasPhone && (
                <li>
                  <a href={`tel:${landingConfig.phone}`} className="transition-colors hover:text-void-fg">
                    {landingConfig.phone}
                  </a>
                </li>
              )}
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="capitalize transition-colors hover:text-void-fg"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-void-border pt-8 text-xs text-void-muted sm:flex-row">
          <p>
            © {year} {landingConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
