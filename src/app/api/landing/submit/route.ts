import { NextResponse, type NextRequest } from 'next/server'

// ========================================
// LANDING LEAD SUBMIT — proxies to Make.com
// ========================================
// Keeps LANDING_WEBHOOK_URL server-only. The client never sees it —
// see components/landing/DemoForm.tsx, which only ever calls this route.

type Payload = {
  firstName: string
  lastName: string
  company: string
  phone: string
  industry: string
  email: string
}

function isValid(body: Partial<Payload>): body is Payload {
  const required: (keyof Payload)[] = [
    'firstName',
    'lastName',
    'company',
    'phone',
    'industry',
    'email',
  ]
  for (const key of required) {
    if (!String(body[key] ?? '').trim()) return false
  }
  const phoneDigits = String(body.phone).replace(/\D/g, '')
  if (phoneDigits.length < 10) return false
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) return false
  return true
}

export async function POST(request: NextRequest) {
  let body: Partial<Payload>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Basic string sanitization — strip control characters, cap length.
  const clean = (v: unknown) => String(v ?? '').replace(/[\r\n\t]/g, ' ').trim().slice(0, 200)
  const payload: Payload = {
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    company: clean(body.company),
    phone: String(body.phone ?? '').replace(/\D/g, '').slice(0, 15),
    industry: clean(body.industry),
    email: clean(body.email),
  }

  if (!isValid(payload)) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const webhookUrl = process.env.LANDING_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn(
      '[landing submit] LANDING_WEBHOOK_URL is not set — logging submission instead of forwarding it:',
      payload
    )
    return NextResponse.json({ ok: true, dev: true })
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error(`[landing submit] webhook responded ${res.status}`)
      return NextResponse.json({ error: 'Webhook rejected submission' }, { status: 502 })
    }
  } catch (e) {
    console.error('[landing submit] webhook request failed', e)
    return NextResponse.json({ error: 'Webhook request failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
