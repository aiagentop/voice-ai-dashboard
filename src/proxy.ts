import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

// Next.js 16: this file replaces middleware.ts. Runs before each request to
// refresh the auth session and gate protected routes.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Run on everything except API routes (they handle their own auth/webhooks),
  // static assets, image files, and the public SEO files the landing page
  // serves (robots.txt/sitemap.xml — these must stay reachable by crawlers
  // without being redirected to /login).
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
