import { NextResponse } from 'next/server';
import { POOLS, GLOBAL_DISCLOSURES } from '@/lib/fundx/pools';

// GET /api/bff/fundx/pools — public, read-only catalog of educational pool
// charters (C-113 §5). These are DEFINITIONS, not open pools: no contribution,
// no capital, no computed returns (C-113 §6). No auth/gateway needed — it's
// disclosure. Real pools are hard-gated (legal + KYC + SYSTEM, §11).
export async function GET() {
  return NextResponse.json(
    { status: 'preview', contributionsOpen: false, disclosures: GLOBAL_DISCLOSURES, pools: POOLS, count: POOLS.length },
    { headers: { 'Cache-Control': 'public, max-age=300' } },
  );
}
