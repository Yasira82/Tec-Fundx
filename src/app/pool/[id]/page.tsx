// TEC FundX — Pool Charter detail (C-113 §5). Read-only disclosure of an
// educational pool: its rules and its risks. There is NO contribute action — real
// participation is hard-gated (legal + KYC + SYSTEM, §11) and settled by
// tec-payment-service, never here. FundX displays; it never holds capital or
// computes returns (§6).
import Link from 'next/link';
import type { Metadata } from 'next';
import { TEC_COLORS } from '@yasser172/tec-ui';
import { getPool, POOLS, GLOBAL_DISCLOSURES } from '@/lib/fundx/pools';

export function generateStaticParams() {
  return POOLS.map((p) => ({ id: p.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const p = getPool(id);
  return { title: p ? `${p.name} — TEC FundX` : 'TEC FundX — Pool', description: p?.summary ?? 'TEC FundX pool charter.' };
}

export default async function PoolPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const pool = getPool(id);

  const wrap: React.CSSProperties = {
    minHeight: '100vh', background: TEC_COLORS.bg, color: TEC_COLORS.text,
    padding: '32px 22px', fontFamily: 'system-ui, -apple-system, sans-serif',
  };
  const inner: React.CSSProperties = { maxWidth: 680, margin: '0 auto' };

  if (!pool) {
    return (
      <main style={wrap}>
        <div style={inner}>
          <Link href="/app" style={{ fontSize: 13, color: TEC_COLORS.gold, textDecoration: 'none' }}>← Pool Charters</Link>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: TEC_COLORS.text, marginTop: 16 }}>Unknown pool</h1>
          <p style={{ fontSize: 13, color: TEC_COLORS.subtext, lineHeight: 1.6 }}>No pool charter with id <code>{id}</code>.</p>
        </div>
      </main>
    );
  }

  const fact = (label: string, value: string) => (
    <div style={{ background: TEC_COLORS.surface, border: `1px solid ${TEC_COLORS.gold}22`, borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 11, color: TEC_COLORS.subtext, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: TEC_COLORS.text, marginTop: 3 }}>{value}</div>
    </div>
  );

  return (
    <main style={wrap}>
      <div style={inner}>
        <Link href="/app" style={{ fontSize: 13, color: TEC_COLORS.gold, textDecoration: 'none' }}>← Pool Charters</Link>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 1, color: TEC_COLORS.subtext, textTransform: 'uppercase' }}>{pool.category}</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: TEC_COLORS.text, margin: '4px 0 0' }}>{pool.name}</h1>
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: TEC_COLORS.subtext, border: `1px solid ${TEC_COLORS.subtext}66`, borderRadius: 999, padding: '6px 12px', whiteSpace: 'nowrap' }}>
            Preview · not open
          </div>
        </div>

        <p style={{ fontSize: 14, color: TEC_COLORS.subtext, margin: '14px 0 0', lineHeight: 1.6 }}>{pool.summary}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginTop: 18 }}>
          {fact('Target', pool.target)}
          {fact('Min contribution', pool.minContribution)}
          {fact('Duration', pool.duration)}
          {fact('Return model', pool.returnModel)}
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 800, color: TEC_COLORS.text, margin: '26px 0 4px' }}>Risks (pool-specific)</h2>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
          {pool.risks.map((r, i) => (
            <li key={i} style={{ fontSize: 13, color: TEC_COLORS.subtext, lineHeight: 1.6 }}>{r}</li>
          ))}
        </ul>

        <h2 style={{ fontSize: 15, fontWeight: 800, color: TEC_COLORS.text, margin: '22px 0 4px' }}>Required disclosures</h2>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
          {GLOBAL_DISCLOSURES.map((d, i) => (
            <li key={i} style={{ fontSize: 13, color: TEC_COLORS.subtext, lineHeight: 1.6 }}>{d}</li>
          ))}
        </ul>

        <div style={{ marginTop: 24, background: `${TEC_COLORS.gold}11`, border: `1px solid ${TEC_COLORS.gold}33`, borderRadius: 12, padding: '12px 14px', fontSize: 12, color: TEC_COLORS.text, lineHeight: 1.55 }}>
          Contributions are <strong>not open</strong>. When (and if) this pool opens, it will
          require completed KYC and an explicit charter acknowledgement, and all capital
          will be held securely and only move with your approval.
        </div>
      </div>
    </main>
  );
}
