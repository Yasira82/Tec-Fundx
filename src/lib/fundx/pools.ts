// TEC FundX — Pool Charters (C-113). This is a READ-ONLY catalog of educational
// pool DEFINITIONS. It does NOT move capital, take contributions, or compute
// returns — those are hard-gated behind legal review + KYC + SYSTEM approval
// (C-113 §11 P0) and, when built, live in tec-payment-service (§6). Everything
// here is disclosure: what a pool would look like, its rules, and its risks.
//
// Every pool is Phase-1 "educational only", carries NO guaranteed return, and is
// shown as `status: 'preview'` — not open for contribution.

export type PoolStatus = 'preview';   // V0: nothing is 'open' yet (hard-gated)
export type ReturnModel = 'pro-rata (educational)' | 'none — educational only';

export interface PoolCharter {
  id:            string;
  name:          string;
  category:      string;
  status:        PoolStatus;
  summary:       string;
  target:        string;   // display string (e.g. "5,000 π") — never a computed number
  minContribution: string; // display string
  duration:      string;
  returnModel:   ReturnModel;
  risks: string[]; // MUST be disclosed
}

// Disclosure that applies to EVERY pool — shown on every charter (C-113 §5/§6).
export const GLOBAL_DISCLOSURES: string[] = [
  'Educational pool (Phase 1) — participation opens only after legal review, KYC, and SYSTEM approval.',
  'No guaranteed returns. Capital at risk. Past performance is not indicative of future results.',
  'FundX never holds your capital or computes returns — settlement is handled by tec-payment-service.',
  'You must complete KYC and explicitly acknowledge a pool’s charter (with risks) before any contribution.',
];

export const POOLS: PoolCharter[] = [
  {
    id: 'pi-builders-learning',
    name: 'Pi Builders Learning Pool',
    category: 'Education',
    status: 'preview',
    summary: 'A co-learning pool for Pi developers — shared resources for building and shipping Pi apps.',
    target: '5,000 π',
    minContribution: '10 π',
    duration: '90 days',
    returnModel: 'none — educational only',
    risks: [
      'Educational only — no financial return is offered or implied.',
      'Contributions fund shared learning resources, not a return-bearing instrument.',
    ],
  },
  {
    id: 'merchant-growth-circle',
    name: 'Merchant Growth Circle',
    category: 'Community',
    status: 'preview',
    summary: 'A merchant co-op concept — pooled resources for shared storefront tooling and marketing experiments.',
    target: '10,000 π',
    minContribution: '25 π',
    duration: '180 days',
    returnModel: 'pro-rata (educational)',
    risks: [
      'Illustrative return model only; no distribution occurs in this preview.',
      'Outcomes depend on merchant activity — capital would be at risk if opened.',
      'Requires SYSTEM charter approval + legal review before any real contribution.',
    ],
  },
  {
    id: 'community-skill-fund',
    name: 'Community Skill Fund',
    category: 'Education',
    status: 'preview',
    summary: 'A skills pool concept — members fund workshops and certifications, sharing knowledge back to the community.',
    target: '3,000 π',
    minContribution: '5 π',
    duration: '60 days',
    returnModel: 'none — educational only',
    risks: [
      'Educational only — value returned is knowledge, not Pi.',
      'No guaranteed outcome; not an investment product.',
    ],
  },
];

export const getPool = (id: string): PoolCharter | null =>
  POOLS.find((p) => p.id === id) ?? null;
