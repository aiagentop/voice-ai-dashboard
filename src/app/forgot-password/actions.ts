'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { sendPasswordResetEmail } from '@/lib/email'

export type ForgotState = { ok?: boolean; error?: string } | undefined

export async function requestReset(
  _prev: ForgotState,
  formData: FormData
): Promise<ForgotState> {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) return { error: 'Enter your email.' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Generate the link ourselves (rather than supabase.auth.resetPasswordForEmail)
  // so we can send it through our own branded Resend template instead of
  // Supabase's default auth email.
  try {
    const admin = createAdminClient()
    const { data } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${appUrl}/reset-password` },
    })
    const resetUrl = data?.properties?.action_link
    if (resetUrl) {
      await sendPasswordResetEmail({ to: email, resetUrl })
    }
  } catch {
    /* fall through — never reveal whether the email exists */
  }

  // Always report success so we don't leak which emails exist.
  return { ok: true }
}
