/** Shared sample copy so previews read like a real product, not lorem ipsum. */
export const BRAND = 'Lumen';

export interface Feature {
  id: string;
  kicker: string;
  title: string;
  body: string;
  stat?: string;
}

export const FEATURES: Feature[] = [
  { id: 'capture', kicker: 'Capture', title: 'Everything lands in one place', body: 'Pull in tickets, calls, docs and chats. Lumen deduplicates and links them automatically, so nothing lives in a silo.', stat: '40+ sources' },
  { id: 'organize', kicker: 'Organize', title: 'Structure that builds itself', body: 'Projects, owners and due dates are inferred from context. Correct one and the rest of the workspace learns.', stat: '3× faster triage' },
  { id: 'automate', kicker: 'Automate', title: 'Workflows without the wiring', body: 'Describe a rule in plain language. Lumen drafts the automation, shows what it would have done last week, then switches it on.', stat: '120 templates' },
  { id: 'collaborate', kicker: 'Collaborate', title: 'Decisions with a paper trail', body: 'Comment on the exact line, assign it, resolve it. Every decision keeps its context for the next person who asks why.', stat: '99.99% uptime' },
  { id: 'measure', kicker: 'Measure', title: 'Dashboards that answer back', body: 'Ask a question in a sentence and get a chart you can pin, share, or schedule into a weekly digest.', stat: '< 200 ms queries' },
  { id: 'secure', kicker: 'Secure', title: 'Controls your security team signs off', body: 'SSO, audit logs, field-level permissions and regional data residency, available on every plan that needs them.', stat: 'SOC 2 Type II' },
];

export const STEPS = [
  { title: 'Connect your tools', body: 'Authorise the apps you already use. Setup takes about four minutes and never touches your data without consent.' },
  { title: 'Map your workflow', body: 'Pick a template or sketch your own. Lumen suggests owners, statuses and handoffs from your history.' },
  { title: 'Run a small pilot', body: 'Start with one team for two weeks. Compare cycle time against last quarter before you roll out wider.' },
  { title: 'Roll out and refine', body: 'Invite everyone, set guardrails, and review the weekly digest to see what to improve next.' },
];

export const STATS = [
  { value: 12400, suffix: '+', label: 'Teams onboarded', note: 'across 62 countries' },
  { value: 98, suffix: '%', label: 'Renewal rate', note: 'trailing twelve months' },
  { value: 4.9, suffix: '/5', label: 'Average rating', note: 'from 3,100 reviews', decimals: 1 },
  { value: 38, suffix: ' min', label: 'Saved per person, daily', note: 'median across pilots' },
];
