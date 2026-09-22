import { NextResponse } from 'next/server'
import { landingConfig } from '@/lib/landing-config'

// Explicit Route Handler (rather than the robots.ts metadata convention) —
// the [slug] dynamic page segment was winning routing precedence over the
// metadata-convention route for this exact path, redirecting crawlers to
// /login. A literal route.ts here resolves unambiguously.
export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /login',
    'Disallow: /forgot-password',
    'Disallow: /reset-password',
    '',
    `Sitemap: ${landingConfig.url}/sitemap.xml`,
    '',
  ].join('\n')

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
