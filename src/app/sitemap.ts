import type { MetadataRoute } from 'next'
import { landingConfig } from '@/lib/landing-config'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: landingConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
