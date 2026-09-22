'use client'

// ========================================
// LEAD CAPTURE FORM — "Demo inside a Demo"
// ========================================
// Client-side validation, then POSTs to our own /api/landing/submit
// route (never the raw Make.com webhook — see that route for why).

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Loader2, PhoneCall, CheckCircle2, AlertCircle } from 'lucide-react'
import { industries, landingConfig, cta } from '@/lib/landing-config'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputCls =
  'w-full rounded-xl border border-void-border bg-white/[0.03] px-4 py-3 text-sm text-void-fg placeholder:text-void-muted/60 outline-none transition-colors focus:border-void-accent min-h-[44px]'
const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-void-muted'

function digitsOnly(v: string) {
  return v.replace(/\D/g, '')
}

export function DemoForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(fd: FormData) {
    const next: Record<string, string> = {}
    const required = ['firstName', 'lastName', 'company', 'phone', 'industry', 'email']
    for (const f of required) {
      if (!String(fd.get(f) ?? '').trim()) next[f] = 'Required'
    }
    const phone = digitsOnly(String(fd.get('phone') ?? ''))
    if (phone && phone.length < 10) next.phone = 'Enter a valid US phone number'
    const email = String(fd.get('email') ?? '')
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email'
    return next
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const validation = validate(fd)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setStatus('loading')
    try {
      const res = await fetch('/api/landing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fd.get('firstName'),
          lastName: fd.get('lastName'),
          company: fd.get('company'),
          phone: digitsOnly(String(fd.get('phone'))),
          industry: fd.get('industry'),
          email: fd.get('email'),
        }),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
          <CheckCircle2 size={28} aria-hidden />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-void-fg">
          Your AI agent is calling you now.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-void-muted">
          Pick up — it will do a live demo for your industry.
          <br />
          We&apos;ll also send a summary to your email.
        </p>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-xl">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelCls}>
              First name
            </label>
            <input id="firstName" name="firstName" className={inputCls} autoComplete="given-name" />
            {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className={labelCls}>
              Last name
            </label>
            <input id="lastName" name="lastName" className={inputCls} autoComplete="family-name" />
            {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="company" className={labelCls}>
            Company name
          </label>
          <input id="company" name="company" className={inputCls} autoComplete="organization" />
          {errors.company && <p className="mt-1 text-xs text-red-400">{errors.company}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelCls}>
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="(555) 123-4567"
              className={inputCls}
              autoComplete="tel"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="industry" className={labelCls}>
              Industry
            </label>
            <select id="industry" name="industry" defaultValue="" className={inputCls}>
              <option value="" disabled>
                Select…
              </option>
              {industries.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            {errors.industry && <p className="mt-1 text-xs text-red-400">{errors.industry}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input id="email" name="email" type="email" className={inputCls} autoComplete="email" />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        {status === 'error' && (
          <div className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              Something went wrong. Please try again or email us at{' '}
              <a href={`mailto:${landingConfig.email}`} className="underline">
                {landingConfig.email}
              </a>
              .
            </span>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <motion.span
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 size={16} className="animate-spin" /> Calling you…
            </motion.span>
          ) : (
            <span className="flex items-center gap-2">
              <PhoneCall size={16} aria-hidden />
              {cta.primary}
            </span>
          )}
        </Button>
      </form>
    </Card>
  )
}
