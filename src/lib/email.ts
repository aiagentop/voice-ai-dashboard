import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM_EMAIL || 'Agentop <noreply@agentop-ai.com>'

export function resendClient() {
  return new Resend(process.env.RESEND_API_KEY!)
}

// Zen-styled, email-safe HTML (inline styles, table layout, web-safe fonts only).
function shell(opts: {
  heading: string
  intro: string
  bodyHtml?: string
  ctaText?: string
  ctaUrl?: string
  footnote?: string
}) {
  const { heading, intro, bodyHtml = '', ctaText, ctaUrl, footnote } = opts

  // Mark: minimal rounded square with a forward/automation chevron — matches public/logo.svg.
  const enso = `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;margin-right:8px"><rect width="28" height="28" rx="7" fill="#201d16"/><path d="M10.5 8.5 L18 14 L10.5 19.5" stroke="#f7f3ea" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`

  // Wordmark: "Agentop", dark ink, clean sans — minimal modern lockup.
  const wordmark = `<span style="font-family:Helvetica,Arial,sans-serif;font-size:17px;font-weight:700;letter-spacing:-0.01em;color:#201d16">Agentop</span>`

  // Primary CTA button — ink background, a tiny vermilion seal dot before the label.
  const cta =
    ctaText && ctaUrl
      ? `<tr>
           <td style="padding:32px 48px 0">
             <table role="presentation" cellpadding="0" cellspacing="0">
               <tr>
                 <td style="background:#201d16;border-radius:2px">
                   <a href="${ctaUrl}"
                      style="display:inline-block;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#f7f3ea;text-decoration:none;padding:14px 30px">
                     <span style="display:inline-block;width:6px;height:6px;background:#b1442b;border-radius:50%;vertical-align:middle;margin-right:9px;position:relative;top:-1px"></span>${ctaText}
                   </a>
                 </td>
               </tr>
             </table>
           </td>
         </tr>`
      : ''

  const bodySection = bodyHtml
    ? `<tr><td style="padding:16px 48px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#3a362c">${bodyHtml}</td></tr>`
    : ''

  const footnoteSection = footnote
    ? `<tr><td style="padding:20px 48px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#7c7461;font-style:italic">${footnote}</td></tr>`
    : ''

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agentop</title></head>
<body style="margin:0;padding:0;background-color:#efe9da;font-family:Helvetica,Arial,sans-serif;color:#201d16">
  <!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#efe9da;min-width:100%">
    <tr>
      <td align="center" style="padding:48px 16px">

        <!-- Card -->
        <table role="presentation" width="520" cellpadding="0" cellspacing="0"
          style="background-color:#f7f3ea;border:1px solid rgba(32,29,22,.15);max-width:520px;width:100%">

          <!-- Header band -->
          <tr>
            <td style="padding:28px 48px 28px;border-bottom:1px solid rgba(32,29,22,.10)">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="vertical-align:middle">${enso}${wordmark}</td>
                  <td align="right" style="vertical-align:middle">
                    <span style="font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#7c7461">Transactional</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Eyebrow + Heading -->
          <tr>
            <td style="padding:36px 48px 0">
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#b1442b;margin-bottom:12px">&#9642;&nbsp; Agentop</div>
              <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;line-height:1.25;margin:0;color:#201d16">${heading}</h1>
            </td>
          </tr>

          <!-- Hairline rule under heading -->
          <tr>
            <td style="padding:20px 48px 0">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px;background:rgba(32,29,22,.12);font-size:0;line-height:0">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:24px 48px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#3a362c">${intro}</td>
          </tr>

          ${bodySection}
          ${cta}
          ${footnoteSection}

          <!-- Footer -->
          <tr>
            <td style="padding:40px 48px 36px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px;background:rgba(32,29,22,.12);font-size:0;line-height:0">&nbsp;</td></tr>
              </table>
              <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#7c7461">
                Sent by <strong style="color:#7c7461">Agentop</strong>
                &nbsp;&middot;&nbsp; You're receiving this because you have an account with us.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`
}

// Generic transactional send.
export async function sendEmail(args: {
  to: string
  subject: string
  heading: string
  intro: string
  bodyHtml?: string
  ctaText?: string
  ctaUrl?: string
}) {
  const resend = resendClient()
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: args.subject,
    html: shell(args),
  })
  if (error) {
    throw new Error(`Resend send failed: ${error.message}`)
  }
  return data
}

// New client onboarding / welcome.
export async function sendWelcomeEmail(args: {
  to: string
  clientName: string
  dashboardUrl: string
}) {
  return sendEmail({
    to: args.to,
    subject: `Welcome to your ${args.clientName} dashboard`,
    heading: 'Your dashboard is ready',
    intro: `Hi ${args.clientName} — your voice AI dashboard is live. You can sign in any time to review your calls, listen to recordings, and see your usage for the month.`,
    bodyHtml: `Everything is in one calm place. No setup needed on your end.`,
    ctaText: 'Open my dashboard',
    ctaUrl: args.dashboardUrl,
  })
}

// Client account invite (set password + first sign-in).
export async function sendInviteEmail(args: {
  to: string
  clientName: string
  inviteUrl: string
}) {
  return sendEmail({
    to: args.to,
    subject: `Set up your ${args.clientName} account`,
    heading: 'Set your password',
    intro: `You've been given access to the ${args.clientName} voice AI dashboard. Set a password to get in.`,
    ctaText: 'Set my password',
    ctaUrl: args.inviteUrl,
  })
}
