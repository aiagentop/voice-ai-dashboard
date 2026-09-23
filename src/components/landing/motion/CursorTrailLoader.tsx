'use client'

// Thin client-component wrapper — see StarFieldLoader for why this
// indirection exists (Next.js only allows next/dynamic's ssr:false
// from inside a Client Component, and page.tsx is a Server Component).
import dynamic from 'next/dynamic'

const CursorTrail = dynamic(() => import('./CursorTrail').then((m) => m.CursorTrail), {
  ssr: false,
})

export function CursorTrailLoader() {
  return <CursorTrail />
}
