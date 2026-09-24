'use client'

// Thin client-component wrapper — Next.js only allows next/dynamic's
// ssr:false from inside a Client Component, and page.tsx (which
// mounts this) is a Server Component for its metadata export.
// Renders the galaxy fixed behind the whole page. The dark scrim that
// keeps text readable now lives inside GalaxyBackground itself, since
// its opacity is driven per-frame by the scroll journey's brightness
// value rather than being a flat constant.
import dynamic from 'next/dynamic'

const GalaxyBackground = dynamic(
  () => import('./GalaxyBackground').then((m) => m.GalaxyBackground),
  { ssr: false }
)

export function GalaxyBackgroundLoader() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <GalaxyBackground />
    </div>
  )
}
