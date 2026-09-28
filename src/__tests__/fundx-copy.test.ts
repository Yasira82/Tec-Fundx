import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// C1 — FundX is a preview: legal review, KYC and SYSTEM approval have not happened
// (C-113 §11), so no user-facing copy may promise earnings, compliance or safety of
// funds. This pins the words that were there, in every file that ships copy.
const FILES = [
  'src/lib/i18n/en.ts', 'src/lib/i18n/ar.ts', 'src/app/layout.tsx',
  'src/app/pool/[id]/page.tsx', 'src/app/app/page.tsx',
];
const FORBIDDEN = [
  /\bearn within\b/i, /compliant framework/i, /always held securely/i, /held securely/i,
  /guaranteed return(?!s;)/i,           // "No guaranteed returns;" in the banner is a denial
  /واكسب/, /إطار متوافق/, /محفوظة بأمان/,
];

describe('FundX copy makes no promise (C1)', () => {
  for (const f of FILES) {
    it(`${f} has no promise of earnings, compliance or safe custody`, () => {
      const text = readFileSync(join(process.cwd(), f), 'utf8');
      for (const re of FORBIDDEN) expect(text).not.toMatch(re);
    });
  }
});
