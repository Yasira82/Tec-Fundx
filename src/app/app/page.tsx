'use client';

// TEC FundX — Capital Coordination Infrastructure (C-113). FundX enables governed
// collective capital formation on Pi. V0 shows the FundX Pro subscription + a
// READ-ONLY catalog of educational pool charters (definitions only). It moves no
// capital and computes no returns — real contributions are hard-gated behind
// legal review + KYC + SYSTEM approval (C-113 §6/§11). App shell: Home / Pools /
// Pro / Settings bottom nav.
import Link from 'next/link';
import { useState } from 'react';
import { usePiAuth } from '@yasser172/tec-auth';
import { useMe } from '@/lib-client/hooks/useMe';
import { useTranslation } from '@/lib/i18n';
import { TEC_COLORS } from '@yasser172/tec-ui';
import { InviteCard } from '@/components/referral/InviteCard';
import { FundXPro } from './components/FundXPro';
import { BottomNav, type FxTab } from './components/BottomNav';
import { SettingsView } from './components/SettingsView';
import { POOLS } from '@/lib/fundx/pools';

// Compliance banner — FundX is the highest-risk app; be explicit up front (C-113).
function ComplianceBanner() {
  return (
    <div style={{ marginTop: 18, background: `${TEC_COLORS.gold}11`, border: `1px solid ${TEC_COLORS.gold}33`, borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ fontSize: 12, color: TEC_COLORS.text, lineHeight: 1.55 }}>
        ⚖️ <strong>Preview.</strong> Contributions are not open yet. Pools are
        educational definitions — they open only after legal review, KYC, and SYSTEM
        approval. No guaranteed returns; capital would be at risk. FundX never holds
        your capital.
      </div>
    </div>
  );
}

export default function FundXHome() {
  const { user, isLoading } = usePiAuth();
  const me = useMe(); // server-resolved Pi username (Pi Browser hides tec_user from client JS — C-123 §3)
  const { t } = useTranslation();
  const [tab, setTab] = useState<FxTab>('home');

  const piName = me.username ?? user?.piUsername ?? null;
  const name = piName ? `@${piName}` : '';

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

  const title =
    tab === 'pools' ? t.fundx.nav.pools
    : tab === 'pro' ? t.fundx.nav.pro
    : tab === 'settings' ? t.fundx.nav.settings
    : (isLoading || !name ? t.fundx.welcome : t.fundx.welcomeName.replace('{name}', name));

  return (
    <main style={{ minHeight: '100vh', background: TEC_COLORS.bg, color: TEC_COLORS.text, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 22px calc(96px + env(safe-area-inset-bottom))' }}>
        <header>
          <div style={{ fontSize: 12, letterSpacing: 1, color: TEC_COLORS.subtext, textTransform: 'uppercase' }}>{t.fundx.brand}</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: TEC_COLORS.gold, margin: '6px 0 0' }}>{title}</h1>
          {tab === 'home' && (
            <p style={{ fontSize: 14, color: TEC_COLORS.subtext, margin: '6px 0 0', lineHeight: 1.6 }}>{t.fundx.subtitle}</p>
          )}
        </header>

        {tab === 'home' && (
          <>
            <ComplianceBanner />
            <p style={{ fontSize: 11, color: TEC_COLORS.subtext, margin: '24px 0 0', lineHeight: 1.5 }}>{t.fundx.footer}</p>
          </>
        )}

        {tab === 'pools' && (
          <>
            <ComplianceBanner />
            {/* Pool Charters — read-only educational definitions (C-113 §5). */}
            <section style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: TEC_COLORS.text, margin: 0 }}>{t.fundx.poolCharters}</h2>
                <span style={{ fontSize: 11, color: TEC_COLORS.subtext, border: `1px solid ${TEC_COLORS.gold}33`, borderRadius: 999, padding: '2px 10px' }}>{t.fundx.poolsPreview}</span>
              </div>
              <p style={{ fontSize: 12, color: TEC_COLORS.subtext, margin: '6px 0 14px', lineHeight: 1.5 }}>{t.fundx.poolsDesc}</p>

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
          </>
        )}

        {tab === 'pro' && (
          /* FundX Pro — real Pi U2A payment (subscription, NOT a pool contribution). */
          <FundXPro />
        )}

        {tab === 'settings' && <SettingsView />}
      </div>

      <BottomNav active={tab} onSelect={setTab} />
    </main>
  );
}
