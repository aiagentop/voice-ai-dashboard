import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { stripe, setDefaultPaymentMethodFromSetup } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInvoiceEmail } from '@/lib/email'

// Mirrors Stripe invoice state back into our `invoices` table.
export async function POST(request: NextRequest) {
  const raw = await request.text()
  const sig = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig!, secret!)
  } catch {
    return new NextResponse('invalid signature', { status: 400 })
  }

  // Client finished adding a card via hosted Checkout (setup mode):
  // make it their default and flip the subscription to auto-charge.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (
      session.mode === 'setup' &&
      session.setup_intent &&
      typeof session.customer === 'string'
    ) {
      const setupIntentId =
        typeof session.setup_intent === 'string'
          ? session.setup_intent
          : session.setup_intent.id
      try {
        await setDefaultPaymentMethodFromSetup(session.customer, setupIntentId)
      } catch {
        // best effort
      }
    }
  }

  if (event.type.startsWith('invoice.')) {
    const inv = event.data.object as Stripe.Invoice
    const supabase = createAdminClient()
    const { data: client } = await supabase
      .from('clients')
      .select('id, name')
      .eq('stripe_customer_id', inv.customer as string)
      .maybeSingle()

    if (client && inv.id) {
      const day = (ts: number | null | undefined) =>
        ts ? new Date(ts * 1000).toISOString().slice(0, 10) : null
      const status =
        inv.status === 'paid' ? 'paid' : inv.status === 'void' ? 'void' : 'open'
      const row = {
        client_id: client.id,
        stripe_invoice_id: inv.id,
        total_cents: inv.amount_due,
        status,
        period_start: day(inv.period_start),
        period_end: day(inv.period_end),
      }
      const { data: existing } = await supabase
        .from('invoices')
        .select('id')
        .eq('stripe_invoice_id', inv.id)
        .maybeSingle()
      if (existing) {
        await supabase.from('invoices').update(row).eq('id', existing.id)
      } else {
        await supabase.from('invoices').insert(row)
      }

      // Notify the client on payment — receipt-style, with a link to Stripe's
      // hosted invoice for their records.
      if (event.type === 'invoice.paid' && inv.hosted_invoice_url) {
        try {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('email')
            .eq('client_id', client.id)
            .eq('role', 'client')
          const periodLabel = inv.period_end
            ? new Date(inv.period_end * 1000).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })
            : 'this period'
          for (const p of profiles ?? []) {
            if (!p.email) continue
            await sendInvoiceEmail({
              to: p.email,
              clientName: client.name,
              amountCents: inv.amount_paid,
              periodLabel,
              invoiceUrl: inv.hosted_invoice_url,
              status: 'paid',
            })
          }
        } catch (e) {
          console.error(`invoice email failed for invoice ${inv.id}`, e)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
