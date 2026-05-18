# Young Sport — Merchant Loyalty (Next.js)

Production port of the prototype in `../project/`. Mobile-first, dark canvas, fire-gradient accents, chevron-Y brand mark. UI matches the prototype verbatim; the iOS device frame has been dropped.

## Stack

- Next.js 15 (App Router) + React 18 + TypeScript
- Zustand for state
- Supabase (Postgres + REST) — optional, graceful fallback to in-memory seed
- Plain CSS (CSS variables) ported from `../project/styles.css`
- Google Fonts via `<link>`: Saira Condensed (italic display), Hanken Grotesk, JetBrains Mono

## Quick start (without backend)

```bash
npm install
npm run dev      # http://localhost:3000
```

Without a `.env.local`, the app runs on the in-memory seed (10 prototype customers, 12 stringing services, mock campaigns). All mutations work but reset on reload.

## Connect to Supabase

1. **Create the schema** — paste `supabase-schema.sql` into your Supabase SQL editor → Run. Idempotent.
2. **(optional) Seed demo data** — paste `supabase-seed.sql` → Run. Skips rows that already exist.
3. **Configure env** — copy `.env.example` to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
   ```
4. `npm run dev` — browser console should show `[Yang Sport] Supabase connected: …`.

The data layer (`lib/db.ts`) is a thin wrapper over Supabase's REST client. All mutations go through the Postgres functions defined in the schema (`add_stamp`, `redeem_stamp`, `record_stringing`).

## Auth (frontend-only gate)

The MVP spec says no real auth — this matches the prototype design:

- **Merchant**: `/login/admin` — username `admin`, password `1234`
- **Customer**: `/login/customer` — any seed phone (e.g. Aaron `0123450011`), 4-digit passcode `1234`
- Session persists in `localStorage` under `yang_sport_session`
- Sign out from More tab (admin) or top-right avatar dropdown (customer)

⚠️ **This is demo-grade security.** Anyone with the Supabase URL + publishable key + open RLS can read/write the DB. For production: swap in Supabase Auth, add a `merchant_id` column to every table, and rewrite RLS policies as `merchant_id = auth.uid()`.

## Routes

| Route | Role | What |
|---|---|---|
| `/login` | none | Role picker |
| `/login/admin` | none | Merchant login |
| `/login/customer` | none | Customer phone + passcode |
| `/` | admin | Home / dashboard |
| `/customers` | admin | Customer list + filters |
| `/customers/[id]` | admin | Customer detail (Loyalty + Arsenal tabs) |
| `/promo` | admin | Promotions (in-memory only; no `campaigns` table in schema) |
| `/more` | admin | Settings + sign out |
| `/me` | customer | Read-only customer dashboard (4 sections) |

Route guard lives in `components/Shell.tsx`.

## Structure

```
app/
  layout.tsx
  page.tsx                       # Home (admin)
  customers/page.tsx
  customers/[id]/page.tsx
  promo/page.tsx
  more/page.tsx
  me/page.tsx                    # Customer dashboard
  login/page.tsx                 # Role picker
  login/admin/page.tsx
  login/customer/page.tsx
  globals.css

components/
  Shell.tsx                      # Viewport + route guard + admin chrome + Toast
  brand.tsx                      # YLogo, YMini, ChevronStamp
  icons.tsx
  ui/                            # TopBar, TabBar, Sheet, Toast, Avatar, KPI, StampGrid
  sheets/                        # AddStamp, Redeem, NewCampaign, RewardRules, RecordStringing
  screens/                       # CustomerDetail (admin), CustomerDashboard (customer), ArsenalPanel

lib/
  types.ts                       # Customer, Reward, …
  i18n.ts                        # EN + 中
  seed.ts                        # Used as fallback when Supabase env not set
  utils.ts                       # formatPhone, relTime, status helpers
  store.ts                       # Zustand: data + UI + load* + mutations (DB or seed)
  session.ts                     # Session (admin/customer) persisted in localStorage
  supabase.ts                    # Supabase client init (null if env missing)
  mappers.ts                     # DB row ↔ App type conversions (+ status / daysAgo derivation)
  db.ts                          # Typed CRUD/RPC wrappers
  useHydratedLang.ts

supabase-schema.sql              # Schema + RPC + RLS (idempotent)
supabase-seed.sql                # Demo data matching the prototype (idempotent)
```

## Notes on the DB → App mapping

The DB shape differs from the prototype types — `mappers.ts` handles the conversion:

| DB | App | How |
|---|---|---|
| `customers.last_visit` (timestamp) | `lastVisitDays` (int) | `daysSince(last_visit)` |
| `customers.created_at` (timestamp) | `joinDays` (int) | `daysSince(created_at)` |
| *no `status` column* | `status` ('new'\|'active'\|'inactive') | computed: ≤14d → new; no visit or >30d → inactive; else active |
| `transactions.stamp_change` | `change` | direct rename |
| `transactions.created_at` | `daysAgo` | computed |
| `stringing_services.tension_lbs` | `tension` | direct rename |
| `stringing_services.service_date` | `daysAgo` | computed |
| `rewards.is_active` | `active` | direct rename |
| `rewards.name_zh` | `nameZh` | added column (see schema) |

`campaigns` has no DB table — promotions are in-memory only.

## Not ported

- `Young Sport-print.html` / `print-app.jsx` / `print.css` (PDF export tooling)
