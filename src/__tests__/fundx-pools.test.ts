import { describe, it, expect } from 'vitest';
import { POOLS, getPool, GLOBAL_DISCLOSURES } from '@/lib/fundx/pools';

describe('TEC FundX — Pool Charters (C-113, read-only)', () => {
  it('every pool is a non-open preview (no contribution in V0, C-113 §11)', () => {
    for (const p of POOLS) {
      expect(p.status).toBe('preview');
    }
  });

  it('every pool discloses at least one risk (C-113 §5)', () => {
    for (const p of POOLS) {
      expect(p.risks.length).toBeGreaterThan(0);
    }
  });

  it('global disclosures cover capital-at-risk + no-guaranteed-return + FundX-holds-no-capital', () => {
    const all = GLOBAL_DISCLOSURES.join(' ').toLowerCase();
    expect(all).toContain('no guaranteed returns');
    expect(all).toContain('capital at risk');
    expect(all).toContain('never holds your capital');
  });

  it('no pool exposes a numeric balance/computed field (FundX displays, never computes — §6)', () => {
    for (const p of POOLS) {
      // target/min are display strings, not numbers
      expect(typeof p.target).toBe('string');
      expect(typeof p.minContribution).toBe('string');
    }
  });

  it('getPool fails closed for an unknown id', () => {
    expect(getPool('nope')).toBeNull();
    expect(getPool('pi-builders-learning')?.name).toBe('Pi Builders Learning Pool');
  });
});
