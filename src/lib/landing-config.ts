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
  bookingUrl: 'https://calendly.com/eyalecome/30min',

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
// Each entry is illustrative — a pattern the agent handles, not a real
// customer story or measured result.
export const useCases = [
  {
    industry: 'Medical / Dental',
    body: 'Answer patient calls, book appointments, handle insurance questions after hours.',
    painPoint: 'Front desk staff are busy with patients, so calls go to voicemail — and voicemail rarely gets a callback the same day.',
    solution: 'Agentop answers every line, verifies the patient and reason for the call, and books directly into your scheduling system.',
    example: 'Example: a patient calls at 7pm to reschedule a cleaning. The agent finds the next open slot and confirms it by text — no message left, no morning callback needed.',
  },
  {
    industry: 'Real Estate',
    body: 'Qualify buyers and sellers, schedule showings, capture leads from property listings.',
    painPoint: 'Listing calls spike right when you\'re in a showing — the first agent to respond usually wins the lead.',
    solution: 'Agentop answers instantly, asks qualifying questions (budget, timeline, financing), and schedules a showing on your calendar.',
    example: 'Example: a caller inquires about a listing from a yard sign. The agent qualifies them and books a showing for Saturday morning while you\'re still with another client.',
  },
  {
    industry: 'Legal',
    body: 'Intake new clients, capture case details, route urgent calls to the right attorney.',
    painPoint: 'Every new-client call needs the same intake details, and missing that first call often means losing the case to another firm.',
    solution: 'Agentop runs your intake script, captures case details accurately, and flags urgent matters for immediate attorney follow-up.',
    example: 'Example: someone calls after a workplace injury. The agent collects the incident details and contact info, then alerts the on-call attorney the same hour.',
  },
  {
    industry: 'Home Services',
    body: 'Book service calls, dispatch technicians, handle quote requests 24/7.',
    painPoint: 'Emergency calls (a burst pipe, no AC in summer) come in nights and weekends when no one is at the office to answer.',
    solution: 'Agentop triages the request, captures the address and issue, and books the next available technician slot automatically.',
    example: 'Example: a homeowner\'s AC fails on a Saturday. The agent captures the address and urgency, then books the first available technician for Monday morning.',
  },
  {
    industry: 'Automotive',
    body: 'Answer sales inquiries, schedule test drives, handle service appointments.',
    painPoint: 'Sales floor staff can\'t answer the phone while helping a customer, so inbound inquiries about inventory go unanswered.',
    solution: 'Agentop answers, checks inventory questions against your info, and books a test drive or service appointment on the spot.',
    example: 'Example: a shopper calls asking if a specific trim is in stock. The agent confirms availability and books a test drive for the next day.',
  },
  {
    industry: 'Restaurants & Hospitality',
    body: 'Take reservations, answer hours and menu questions, handle large-party requests.',
    painPoint: 'During a dinner rush, no one has a free hand to answer the phone — so reservation calls go straight to a busy signal or voicemail.',
    solution: 'Agentop takes reservations, answers hours/menu questions, and flags large-party requests for the manager to confirm.',
    example: 'Example: a caller wants a table for 8 on Friday night. The agent checks your reservation rules for large parties and confirms the booking directly.',
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

// ── Agent Library — 24 cards, 4 categories, periodic-table style ──
export const agentLibraryCategories = {
  agents: { label: 'Agents', color: '#38bdf8' }, // void-accent (cyan)
  industries: { label: 'Industries', color: '#6366f1' }, // void-accent-2 (indigo)
  intelligence: { label: 'Intelligence', color: '#ffb37a' }, // warm, ties back to the galaxy core
  stack: { label: 'Stack', color: '#34d399' }, // emerald
} as const

export type AgentLibraryCategory = keyof typeof agentLibraryCategories

export const agentLibrary: {
  n: number
  symbol: string
  name: string
  category: AgentLibraryCategory
}[] = [
  { n: 1, symbol: 'AR', name: 'Answering', category: 'agents' },
  { n: 2, symbol: 'QL', name: 'Qualifying', category: 'agents' },
  { n: 3, symbol: 'BK', name: 'Booking', category: 'agents' },
  { n: 4, symbol: 'FU', name: 'Follow-Up', category: 'agents' },
  { n: 5, symbol: 'OD', name: 'Outbound Demo', category: 'agents' },
  { n: 6, symbol: 'AH', name: 'After-Hours', category: 'agents' },

  { n: 7, symbol: 'MD', name: 'Medical / Dental', category: 'industries' },
  { n: 8, symbol: 'RE', name: 'Real Estate', category: 'industries' },
  { n: 9, symbol: 'LG', name: 'Legal', category: 'industries' },
  { n: 10, symbol: 'HS', name: 'Home Services', category: 'industries' },
  { n: 11, symbol: 'AU', name: 'Automotive', category: 'industries' },
  { n: 12, symbol: 'RH', name: 'Hospitality', category: 'industries' },

  { n: 13, symbol: 'TR', name: 'Transcript', category: 'intelligence' },
  { n: 14, symbol: 'SE', name: 'Sentiment', category: 'intelligence' },
  { n: 15, symbol: 'SC', name: 'Lead Score', category: 'intelligence' },
  { n: 16, symbol: 'RC', name: 'Recording', category: 'intelligence' },
  { n: 17, symbol: 'CO', name: 'CRM Log', category: 'intelligence' },
  { n: 18, symbol: 'AN', name: 'Analytics', category: 'intelligence' },

  { n: 19, symbol: 'CA', name: 'Calendar', category: 'stack' },
  { n: 20, symbol: 'CL', name: 'Calendly', category: 'stack' },
  { n: 21, symbol: 'TW', name: 'Twilio', category: 'stack' },
  { n: 22, symbol: 'HG', name: 'GoHighLevel', category: 'stack' },
  { n: 23, symbol: 'HB', name: 'HubSpot', category: 'stack' },
  { n: 24, symbol: 'SH', name: 'Sheets', category: 'stack' },
]

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
