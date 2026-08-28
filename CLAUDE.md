# TEC FundX — Claude Code Instructions

> ⚡ **SESSION START:** اقرأ `knowledge-base/C-02___CURRENT_STATE_.md` + **app charter
> `knowledge-base/C-113___FUNDX_INSTITUTIONAL_CHARTER.md`** من `yasira82/tec-knowledge-base` (branch: `main`).

## What This App Is

**System of Production — Capital Coordination Infrastructure** (C-113). FundX
enables **governed collective capital formation** on Pi: users pool Pi, co-invest
in shared goals, and earn returns within a legally + technically sound framework.

**FundX is the highest financial-risk app in TEC** (C-113 §6) — a breach = multi-user
loss. Treat every change with that gravity.

Built from `tec-template-base` (Next.js 15 frontend).

**Current Phase: FundX V0 — App Scaffold & Portal Readiness.** Identity / domain /
slug / legal + themed home + **FundX Pro payment surface** (the Pi Portal "Process a
Transaction" gate) + a **read-only Pool Charters catalog** (definitions only). Real
pool contributions are **NOT built** — they are hard-gated (below). Deployed (Mainnet) · Pi App ID registered · env set · payment live · referral growth loop wired (C-133).

---

## Pi App Identity

| Field | Value |
|-------|-------|
| **App** | TEC FundX |
| **Domain** | `https://fundx.tecosystem.app` |
| **Pi App ID** | ✅ Registered (Mainnet) · Vercel `NEXT_PUBLIC_PI_APP_ID` |
| **APP_SOURCE slug** | `fundx` (payment-service resolves `PI_API_KEY_FUNDX`) |
| **PI_SANDBOX** | `false` (Mainnet) |

---

## FundX-Specific Rules (C-113) — READ BEFORE ANY POOL CODE

### 🔴 Hard gates — DO NOT build pool mechanics without ALL of these (C-113 §11 P0)
1. **Legal consultation FIRST** — no line of pool-contribution code before a documented legal review of Pi-denominated investment pools (jurisdiction + Pi DeFi rules).
2. **KYC maturity** — `tec-kyc-service` at ≥90% success; **KYC is mandatory** before any participation (no anonymous pools).
3. **SYSTEM pool governance** (C-110) — SYSTEM defines permitted pool types + return models + charter-approval workflow. FundX is governed BY SYSTEM, not self-governing.

Until all three exist, FundX ships **read-only** (browse charters) + FundX Pro subscription only. **No contribute button, no capital movement.**

### The ownership boundary
FundX **OWNS**: pool-creation UI, contribution/withdrawal *flows* (UI), a portfolio *view*, pool-charter *display*. FundX does **NOT OWN**:
- **Pool capital custody** → `tec-payment-service` holds all Pi balances (DECIMAL(20,8)). FundX never holds capital.
- **Distribution computation** → server-side only. **FundX UI displays, never computes** returns.
- **Pool governance** → SYSTEM (C-110). **Legal compliance** → external counsel. **Collateral** → tec-asset-service.

### Invariants (extend C-47)
- Pool balance NEVER goes negative. No distribution without confirmed returns.
- Immutable pool charter: once a pool is live, terms cannot change.
- Every pool action has full ActorContext + audit trail. Investor must explicitly acknowledge the charter (with risks) before contributing.
- **Educational pools only (Phase 1). No guaranteed-return promises. All risks disclosed.**

**Reference of record:** `yasira82/tec-knowledge-base` —
`C-113___FUNDX_INSTITUTIONAL_CHARTER.md` (charter) + `C-12_Dual_Mode_Payment.md`
(payment anti-regression) + `C-123` (session/cookies) + `C-71` (financial integrity).

---

## Stack

- Next.js 15 App Router + TypeScript strict · React 18
- `@yasser172/tec-ui` (design system) · `@yasser172/tec-auth` · `@yasser172/tec-sdk`
- Vitest (unit) + Playwright (e2e) · Deployment: Vercel

---

## Architecture Rules (non-negotiable)

### CSRF — middleware ONLY (P2 single source of truth)
CSRF is enforced in **`middleware.ts`** and **nowhere else**: a request is trusted
if the double-submit token matches **OR** it is first-party (Origin host === Host /
`*.tecosystem.app`).
- ❌ **NEVER** add a CSRF check inside a route handler (`csrfCookie !== csrfHeader`
  → 403). It 403's legit Mode-2 payments in Pi Browser (drops `sameSite=None`
  cookies). The CI `payment-policy` job fails the build if you do. (KB C-12 §11)
- ✅ A route may *forward* `x-csrf-token` to a downstream call; it must never *validate* it.

### ADR-007 — Dual-mode payment (Pi foreign session)
Every buy handler MUST guard before touching `window.Pi`:
```typescript
const isHubNavigation = () =>
  document.referrer.toLowerCase().includes('hub.tecosystem.app');
if (isHubNavigation() || !(window as any).Pi || !piReady) {
  redirectToHubPayment(...);   // Mode 1: Hub modal → /hub?pay=1&...
  return;
}
// Mode 2: standalone — createPaymentRecord() then createU2APayment() (src/lib/pi-payment.ts)
```
> The hub-entry signal is `__tec_hub_entry` (sessionStorage) **OR** referrer — the
> landing page (C-123 LAW 2) made referrer-alone unreliable (C-12 §3). Do not remove it.

### ADR-009 — Unified payment contract
`amount` is a **number**; gateway path is **`/api/payment/*`** (singular); the only
inter-service header is **`x-internal-key`** + `INTERNAL_SECRET`. Don't re-declare
payment Zod locally — shapes live in `@yasser172/tec-sdk`. Approve under
`PI_API_KEY_FUNDX` (never the default Hub key — the Analytics approve→502 lesson, C-12 §11).

### Two-SDK boundary
```
Client components → src/lib-client/*  (browser state, Pi hooks)
API routes (BFF)  → @yasser172/tec-sdk via /api/bff/*  (server-only)
```

### Auth / cookies (LOCKED)
SSO via Hub cookies `tec_access_token`, `tec_csrf`, `tec_user`. Never localStorage.
Identity is derived from the `tec_user` cookie server-side — **never from the request body**.

---

## Setup status + Roadmap (C-113 §10)

```
FundX V0 — App Scaffold & Portal Readiness (customized from template):
  ✅ package.json name = tec-fundx · APP_SOURCE = 'fundx'
  ✅ sso-callback ALLOWED_AUDIENCES → fundx.tecosystem.app + tec-fundx.vercel.app
  ✅ privacy + terms → TEC FundX / fundx.tecosystem.app
  ✅ NEW-A: no NEXT_PUBLIC_API_GATEWAY_URL / Railway host in the client bundle
  ✅ layout Pi init is hub-entry-aware (C-12 §3 / ADR-007 foreign-session skip)
  ✅ /app themed as the Capital-Coordination home + FundX Pro (real Pi U2A payment)
  ✅ read-only Pool Charters catalog (definitions only — NO contribute, NO capital movement)

Live on Mainnet — all complete (SSoT: architecture/app-fleet.yaml):
  ✅ Register Pi App ID (Pi Developer Portal) → set Vercel NEXT_PUBLIC_PI_APP_ID +
    API_GATEWAY_URL · INTERNAL_SECRET · SSO_SECRET · PI_SANDBOX=false.
  ✅ payment-service: set PI_API_KEY_FUNDX on Railway (approve→502 otherwise, C-12 §11).
  ✅ Hub SSO: add fundx.tecosystem.app + tec-fundx.vercel.app to Hub /api/auth/sso
    ALLOWED_TARGETS + Hub domain registry (both in this change).
  ✅ Deploy (Vercel) + runtime-verify login (C-123) + a real FundX Pro payment
    Mode 1 (Hub) AND Mode 2 (standalone) — completes the Portal "Process a Transaction" gate.

FundX V1+ (POST hard-gates — legal + KYC + SYSTEM, C-113 §11): educational pools only,
  admin-approved charters, contributions to a payment-service escrow, server-side
  pro-rata distribution. NONE of this ships until the three P0 gates are documented-done.
```

> FundX monetization (C-113 §7) is pool-management + success fees + premium pool
> creation. The payment scaffold + `isHubNavigation()` guard are kept for the Portal
> gate; any direct buy MUST keep the ADR-007 guard and needs `PI_API_KEY_FUNDX`.

---

## What NOT To Do

- Do NOT build pool contribution/withdrawal/distribution mechanics before the 3 P0 gates (legal + KYC + SYSTEM) — C-113 §11
- Do NOT hold pooled capital in FundX or compute distributions client-side — payment-service owns capital + computes (C-113 §6)
- Do NOT allow anonymous participation — KYC is mandatory
- Do NOT promise guaranteed returns; every pool charter must disclose risks
- Do NOT validate CSRF in a route handler — middleware only (CI blocks it)
- Do NOT send `amount` as a string, or use `/payments` / `x-service-secret`
- Do NOT skip the ADR-007 `isHubNavigation()` guard before `window.Pi`
- Do NOT store tokens in localStorage; do NOT derive identity from the body
- Do NOT add `NEXT_PUBLIC_*` for internal service URLs or `INTERNAL_SECRET`

---

## Commit Convention

```
feat(fundx):  new capital feature   fix(payment): payment flow fix (test carefully)
fix(fundx):   bug fix               chore(scope):  build/config
```

---

## Skills

Available via plugin — invoke automatically when the situation matches:

| Situation | Skill |
|-----------|-------|
| Writing new feature or fixing a bug → use TDD | `/tdd` |
| Bug, regression, or unexpected behavior | `/diagnose` |
| Writing or modifying tests | `/test-guard` |
| Writing or modifying BFF routes, payment handlers, or API contracts | `/clean-code-guard` |
| Updating docs, CLAUDE.md, or knowledge-base entries | `/docs-guard` |
| Planning a new feature or architectural decision | `/grill-with-docs` |
| Breaking down a roadmap item into GitHub Issues | `/to-issues` |
| Session is getting long or context is filling up | `/handoff` |
| Adding pre-commit hooks to this repo | `/setup-pre-commit` |
