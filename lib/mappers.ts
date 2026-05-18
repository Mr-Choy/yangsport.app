import type {
  Customer, CustomerStatus, Reward, StringingService, Transaction,
} from './types';

// ─── time helpers ──────────────────────────────────────────────
const MS_PER_DAY = 86_400_000;

function daysSince(when: string | null | undefined): number {
  if (!when) return 0;
  const t = new Date(when).getTime();
  if (Number.isNaN(t)) return 0;
  const diff = Date.now() - t;
  return Math.max(0, Math.floor(diff / MS_PER_DAY));
}

function statusFor(createdAt: string | null, lastVisit: string | null): CustomerStatus {
  const joinDays = daysSince(createdAt);
  if (joinDays <= 14) return 'new';
  if (!lastVisit) return 'inactive';
  const visitDays = daysSince(lastVisit);
  if (visitDays > 30) return 'inactive';
  return 'active';
}

// ─── DB row shapes (loose — we use the Supabase REST shape) ────
export interface CustomerRow {
  id: string;
  phone: string;
  name: string | null;
  stamps: number;
  total_earned: number;
  total_redeemed: number;
  last_visit: string | null;
  created_at: string | null;
}

export interface TransactionRow {
  id: string;
  customer_id: string;
  type: 'earn' | 'redeem' | 'stringing_service';
  stamp_change: number;
  note: string | null;
  created_at: string | null;
}

export interface StringingRow {
  id: string;
  customer_id: string;
  racket_brand: string;
  racket_model: string;
  string_brand: string;
  string_model: string;
  tension_lbs: number;
  service_date: string | null;
  note: string | null;
  created_at: string | null;
}

export interface RewardRow {
  id: string;
  name: string;
  name_zh: string | null;
  threshold: number;
  is_active: boolean;
  created_at: string | null;
}

// ─── DB → App ──────────────────────────────────────────────────
export function customerFromRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name ?? '',
    stamps: row.stamps ?? 0,
    total_earned: row.total_earned ?? 0,
    total_redeemed: row.total_redeemed ?? 0,
    lastVisitDays: daysSince(row.last_visit),
    joinDays: daysSince(row.created_at),
    status: statusFor(row.created_at, row.last_visit),
  };
}

export function transactionFromRow(row: TransactionRow): Transaction {
  // The DB allows 'stringing_service' too, but the app's Transaction type only
  // models earn/redeem (stringing has its own table). Coerce/skip upstream.
  const type: 'earn' | 'redeem' = row.type === 'redeem' ? 'redeem' : 'earn';
  return {
    id: row.id,
    type,
    change: row.stamp_change ?? 0,
    daysAgo: daysSince(row.created_at),
    note: row.note ?? '',
  };
}

export function stringingFromRow(row: StringingRow): StringingService {
  const dateRef = row.service_date ?? row.created_at;
  return {
    id: row.id,
    daysAgo: daysSince(dateRef),
    racketBrand: row.racket_brand,
    racketModel: row.racket_model,
    stringBrand: row.string_brand,
    stringModel: row.string_model,
    tension: row.tension_lbs,
    note: row.note ?? '',
  };
}

export function rewardFromRow(row: RewardRow): Reward {
  return {
    id: row.id,
    threshold: row.threshold,
    name: row.name,
    nameZh: row.name_zh ?? row.name,
    active: row.is_active,
    emoji: '',
  };
}
