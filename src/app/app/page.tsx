'use client';

// TEC FundX — Capital Coordination Infrastructure (C-113). FundX enables governed
// collective capital formation on Pi. V0 shows the FundX Pro subscription + a
// READ-ONLY catalog of educational pool charters (definitions only). It moves no
// capital and computes no returns — real contributions are hard-gated behind
// legal review + KYC + SYSTEM approval (C-113 §6/§11). FundX displays; it never
// holds capital or computes distributions (payment-service owns that).
import Link from 'next/link';
import { usePiAuth } from '@yasser172/tec-auth';
import { TEC_COLORS } from '@yasser172/tec-ui';
import { FundXPro } from './components/FundXPro';
import { POOLS } from '@/lib/fundx/pools';

export default function FundXHome() {
  const { user, isLoading } = usePiAuth();
  const name = user?.piUsername ? `@${user.piUsername}` : 'there';

  const poolCard: React.CSSProperties = {
    display: 'block', textDecoration: 'none',
    background: TEC_COLORS.surface, border: `1px solid ${TEC_COLORS.gold}22`,
    borderRadius: 12, padding: 14,
  };
  const previewBadge: React.CSSProperties = {
    fontSize: 10, fontWeight: 800, color: TEC_COLORS.subtext,
    border: `1px solid ${TEC_COLORS.subtext}55`, borderRadius: 999, padding: '2px 8px',
    whiteSpace: 'nowrap',
  };

  return (
    <main style={{ minHeight: '100vh', background: TEC_COLORS.bg, color: TEC_COLORS.text, padding: '32px 22px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <header>
          <div style={{ fontSize: 12, letterSpacing: 1, color: TEC_COLORS.subtext, textTransform: 'uppercase' }}>TEC FundX · Capital Coordination</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: TEC_COLORS.gold, margin: '6px 0 0' }}>
            {isLoading ? 'Welcome' : `Welcome, ${name}`}
          </h1>
          <p style={{ fontSize: 14, color: TEC_COLORS.subtext, margin: '6px 0 0', lineHeight: 1.6 }}>
            Governed collective capital on Pi — pool resources, co-invest in shared goals,
            and earn within a compliant framework (C-113).
          </p>
        </header>

        {/* Compliance banner — FundX is the highest-risk app; be explicit up front. */}
        <div style={{ marginTop: 18, background: `${TEC_COLORS.gold}11`, border: `1px solid ${TEC_COLORS.gold}33`, borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: TEC_COLORS.text, lineHeight: 1.55 }}>
            ⚖️ <strong>Preview.</strong> Contributions are not open yet. Pools below are
            educational definitions — they open only after legal review, KYC, and SYSTEM
            approval. No guaranteed returns; capital would be at risk. FundX never holds
            your capital (C-113 §6).
          </div>
        </div>

        {/* FundX Pro — real Pi U2A payment (subscription, NOT a pool contribution). */}
        <FundXPro />

        {/* Pool Charters — read-only educational definitions (C-113 §5). */}
        <section style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: TEC_COLORS.text, margin: 0 }}>Pool Charters</h2>
            <span style={{ fontSize: 11, color: TEC_COLORS.subtext, border: `1px solid ${TEC_COLORS.gold}33`, borderRadius: 999, padding: '2px 10px' }}>preview · not open</span>
          </div>
          <p style={{ fontSize: 12, color: TEC_COLORS.subtext, margin: '6px 0 14px', lineHeight: 1.5 }}>
            Educational pool definitions — target, minimum, duration, return model, and
            disclosed risks. Tap a pool to read its charter. No contribution is possible
            in this preview.
          </p>

          <div style={{ display: 'grid', gap: 10 }}>
            {POOLS.map((p) => (
              <Link key={p.id} href={`/pool/${p.id}`} style={poolCard}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: TEC_COLORS.text }}>{p.name}</span>
                  <span style={previewBadge}>Preview</span>
                </div>
                <div style={{ fontSize: 11, color: TEC_COLORS.gold, marginTop: 3 }}>{p.category} · target {p.target} · {p.duration}</div>
                <div style={{ fontSize: 12, color: TEC_COLORS.subtext, marginTop: 5, lineHeight: 1.5 }}>{p.summary}</div>
              </Link>
            ))}
          </div>
        </section>

        <p style={{ fontSize: 11, color: TEC_COLORS.subtext, margin: '24px 0 0', lineHeight: 1.5 }}>
          FundX owns the pool UI and charter display; it never owns capital custody,
          distribution computation, pool governance (SYSTEM), or legal compliance
          (external counsel) — C-113 §4. Pool balances live in tec-payment-service at
          DECIMAL(20,8) and are computed server-side only.
        </p>
      </div>
    </main>
  );
}
