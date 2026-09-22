import type { MetadataRoute } from 'next'
import { landingConfig } from '@/lib/landing-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The dashboard and client portal are private, auth-gated
        // product surfaces — nothing there should be indexed.
        disallow: ['/admin', '/admin/', '/login', '/forgot-password', '/reset-password'],
      },
    ],
    sitemap: `${landingConfig.url}/sitemap.xml`,
  }
}
