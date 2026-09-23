'use client'

// Thin client-component wrapper — Next.js only allows `ssr: false` in
// next/dynamic from inside a Client Component, and page.tsx (which
// mounts this) is a Server Component for its metadata export.
import dynamic from 'next/dynamic'

const StarField = dynamic(() => import('./StarField').then((m) => m.StarField), {
  ssr: false,
})

export function StarFieldLoader() {
  return <StarField />
}
