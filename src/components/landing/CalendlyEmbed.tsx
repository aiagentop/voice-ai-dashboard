'use client'

// ========================================
// CALENDLY — inline booking widget
// ========================================
// Calendly's standard inline embed (their own script + a marker div —
// see https://help.calendly.com/hc/en-us/articles/223147027). Colors
// are passed via URL params so the widget's own iframe matches the
// site's dark theme instead of showing as a plain white box.

import Script from 'next/script'

const CALENDLY_URL =
  'https://calendly.com/eyalecome/30min?background_color=0a0f17&text_color=f8fafc&primary_color=38bdf8'

export function CalendlyEmbed() {
  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-void-border">
      <div
        className="calendly-inline-widget"
        data-url={CALENDLY_URL}
        style={{ minWidth: '320px', height: '700px' }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </div>
  )
}
