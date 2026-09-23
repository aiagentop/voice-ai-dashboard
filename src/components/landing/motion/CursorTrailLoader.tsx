'use client'

// Thin client-component wrapper — Next.js only allows next/dynamic's
// ssr:false from inside a Client Component, and page.tsx (which
// mounts this) is a Server Component for its metadata export.
import dynamic from 'next/dynamic'

const CursorTrail = dynamic(() => import('./CursorTrail').then((m) => m.CursorTrail), {
  ssr: false,
})

export function CursorTrailLoader() {
  return <CursorTrail />
}
