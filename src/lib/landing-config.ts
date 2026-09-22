// ============================================================
//  Landing page content — single source of truth.
//  Nothing here is fabricated: unset business facts (phone,
//  booking link, socials) are explicit placeholders, not guesses.
// ============================================================

export const landingConfig = {
  name: 'Agentop',
  tagline: 'Your AI employee, on every call.',
  description:
    'Agentop builds intelligent AI voice agents for U.S. service businesses. Automate calls, qualify leads, book appointments, and never miss a customer again.',
  url: 'https://agentop-ai.com',
  email: 'support@agentop-ai.com',

  // Genuine placeholders — not real values. See PLACEHOLDER_* below.
  phone: '[PLACEHOLDER_PHONE]',
  bookingUrl: '[PLACEHOLDER_CALENDLY_URL]',

  social: {
    linkedin: '',
    instagram: '',
    x: '',
  },
} as const

// Fields still needing a real value before launch.
export const PLACEHOLDERS = {
  phone: landingConfig.phone,
  bookingUrl: landingConfig.bookingUrl,
} as const

export function isPlaceholder(value: string) {
  return value.startsWith('[PLACEHOLDER')
}

// ── Nav ──────────────────────────────────────────────────────
export const navLinks = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'FAQ', href: '#faq' },
] as const

// ── CTAs ─────────────────────────────────────────────────────
export const cta = {
  primary: 'Have My AI Call Me Now',
  secondary: 'Hear It In Action',
  tertiary: 'Talk to an AI Specialist',
  booking: 'Book a Strategy Call',
} as const

// ── Problem section ─────────────────────────────────────────
export const problems = [
  {
    title: 'Missed Calls',
    body: 'Every unanswered call is a potential customer calling your competitor next.',
  },
  {
    title: 'Slow Follow-Up',
    body: 'Leads go cold in minutes. Manual follow-up is too slow.',
  },
  {
    title: 'After-Hours Gaps',
    body: 'Your business closes at 5pm. Your customers don’t.',
  },
] as const

// ── Services ─────────────────────────────────────────────────
export const services = [
  {
    title: 'AI Receptionist',
    body: 'Answers every inbound call, 24/7. Handles FAQs, captures leads, routes qualified callers.',
  },
  {
    title: 'Lead Qualification',
    body: 'Asks the right questions. Scores intent. Forwards only the leads worth your time.',
  },
  {
    title: 'Appointment Booking',
    body: 'Checks your calendar in real time. Books, confirms, and reminds. Zero back and forth.',
  },
  {
    title: 'Outbound Demo Calls',
    body: 'When someone requests a demo, your AI calls them within seconds and performs a live demo in their industry.',
  },
  {
    title: 'After-Hours Coverage',
    body: 'Your AI never sleeps. Handle calls at 11pm like it’s 11am.',
  },
  {
    title: 'CRM Automation',
    body: 'Every call. Every lead. Every outcome. Logged automatically in your CRM.',
  },
] as const

// ── Business outcomes ───────────────────────────────────────
export const outcomes = [
  { value: '24/7', label: 'Availability' },
  { value: '< 60 sec', label: 'Response time' },
  { value: 'Zero', label: 'Missed after-hours calls' },
  { value: 'One setup', label: 'Runs forever' },
] as const

// ── How it works ────────────────────────────────────────────
export const process = [
  {
    step: '01',
    title: 'Discovery',
    body: 'We map your call flows, understand your customers, and define what needs automating.',
  },
  {
    step: '02',
    title: 'Build',
    body: 'We design your AI agent, conversation logic, and integrations specific to your business.',
  },
  {
    step: '03',
    title: 'Connect',
    body: 'We connect your phone system, CRM, calendar, and automation tools.',
  },
  {
    step: '04',
    title: 'Launch & Optimize',
    body: 'Your agent goes live. We monitor every call and improve continuously.',
  },
] as const

// ── Use cases by industry ───────────────────────────────────
export const useCases = [
  {
    industry: 'Medical / Dental',
    body: 'Answer patient calls, book appointments, handle insurance questions after hours.',
  },
  {
    industry: 'Real Estate',
    body: 'Qualify buyers and sellers, schedule showings, capture leads from property listings.',
  },
  {
    industry: 'Legal',
    body: 'Intake new clients, capture case details, route urgent calls to the right attorney.',
  },
  {
    industry: 'Home Services',
    body: 'Book service calls, dispatch technicians, handle quote requests 24/7.',
  },
  {
    industry: 'Automotive',
    body: 'Answer sales inquiries, schedule test drives, handle service appointments.',
  },
  {
    industry: 'Restaurants & Hospitality',
    body: 'Take reservations, answer hours and menu questions, handle large-party requests.',
  },
] as const

// ── Integrations ─────────────────────────────────────────────
export const integrations = [
  'Retell AI',
  'Make.com',
  'Twilio',
  'Google Calendar',
  'Calendly',
  'GoHighLevel',
  'HubSpot',
  'Google Sheets',
  'Slack',
] as const

export const trustBarIntegrations = [
  'Retell AI',
  'Make.com',
  'Twilio',
  'Google Calendar',
  'Calendly',
  'GoHighLevel',
] as const

// ── FAQ ──────────────────────────────────────────────────────
export const faq = [
  {
    q: 'What can an Agentop voice agent do?',
    a: 'It can answer inbound calls, qualify leads, book appointments, handle FAQs, perform outbound demo calls, and automatically log everything to your CRM.',
  },
  {
    q: 'Will it actually call me after I fill out the form?',
    a: 'Yes. Within seconds, our AI will call your number and perform a live demo acting as a receptionist in your specific industry.',
  },
  {
    q: 'Can it book appointments in my calendar?',
    a: 'Yes. We integrate with Google Calendar, Calendly, and most scheduling platforms.',
  },
  {
    q: 'Can it transfer calls to a human?',
    a: 'Yes. We configure warm transfer rules so the agent hands off to your team when the situation requires it.',
  },
  {
    q: 'Does it work after business hours?',
    a: 'Yes. Your AI agent works 24 hours a day, 7 days a week, including weekends and holidays.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most agents are live within 3–7 business days, depending on the complexity of your call flows.',
  },
  {
    q: 'Can the AI sound natural?',
    a: 'Yes. We use state-of-the-art voice AI with near-human latency and natural conversation flow.',
  },
  {
    q: 'How do you monitor performance?',
    a: 'Every call is recorded, transcribed, and analyzed. You get a dashboard showing call outcomes, sentiment, and bookings.',
  },
  {
    q: 'What happens if the AI doesn’t know the answer?',
    a: 'It captures the caller’s information and routes or escalates the call appropriately. It never leaves a customer without a response.',
  },
  {
    q: 'What do I need to get started?',
    a: 'Just a phone number, a calendar or CRM, and 30 minutes for a discovery call.',
  },
] as const

// ── Demo form ────────────────────────────────────────────────
export const industries = [
  'Medical / Dental',
  'Real Estate',
  'Legal',
  'Home Services',
  'Automotive',
  'Restaurant / Hospitality',
  'Other',
] as const

// ── Footer ───────────────────────────────────────────────────
export const footerColumns = {
  solutions: [
    'AI Receptionist',
    'Lead Qualification',
    'Appointment Booking',
    'Outbound Calling',
  ],
  company: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: `mailto:${landingConfig.email}` },
  ],
} as const
