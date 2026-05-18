import type { Reward, StringingService, Lang } from './types';
import type { Strings } from './i18n';
import { FATIGUE } from './seed';

export function relTime(daysAgo: number, _lang: Lang, t: Strings): string {
  if (daysAgo === 0) return t.today;
  if (daysAgo === 1) return t.yesterday;
  if (daysAgo < 7)   return `${daysAgo}${t.daysAgo}`;
  return `${Math.floor(daysAgo / 7)}${t.weeksAgo}`;
}

export function formatPhone(p: string): string {
  if (!p) return '';
  if (p.length <= 3) return p;
  if (p.length <= 6) return `${p.slice(0, 3)}-${p.slice(3)}`;
  return `${p.slice(0, 3)}-${p.slice(3, 6)} ${p.slice(6)}`;
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarClass(idx: number): string {
  return `avatar-${(idx % 6) + 1}`;
}

export function getNextReward(stamps: number, rewards: Reward[]): Reward | null {
  const active = rewards.filter(r => r.active).sort((a, b) => a.threshold - b.threshold);
  return active.find(r => stamps < r.threshold) || null;
}

export function getRedeemable(stamps: number, rewards: Reward[]): Reward[] {
  return rewards
    .filter(r => r.active && stamps >= r.threshold)
    .sort((a, b) => b.threshold - a.threshold);
}

export function stringStatus(daysAgo: number): 'healthy' | 'aging' | 'fatigue' {
  if (daysAgo < FATIGUE.healthy) return 'healthy';
  if (daysAgo < FATIGUE.fatigue) return 'aging';
  return 'fatigue';
}

export interface RacketAggregate {
  brand: string;
  model: string;
  latest: StringingService;
  services: StringingService[];
}

export function getRackets(services: StringingService[]): RacketAggregate[] {
  const map = new Map<string, RacketAggregate>();
  const sorted = [...services].sort((a, b) => a.daysAgo - b.daysAgo);
  for (const s of sorted) {
    const key = `${s.racketBrand}|${s.racketModel}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { brand: s.racketBrand, model: s.racketModel, latest: s, services: [s] });
    } else {
      existing.services.push(s);
    }
  }
  return [...map.values()];
}

export interface StringUsage {
  brand: string;
  model: string;
  count: number;
}

export function getStringUsage(services: StringingService[]): StringUsage[] {
  const map = new Map<string, StringUsage>();
  for (const s of services) {
    const key = `${s.stringBrand}|${s.stringModel}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { brand: s.stringBrand, model: s.stringModel, count: 1 });
    } else {
      existing.count++;
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getTensionTrend(services: StringingService[]): StringingService[] {
  return [...services].sort((a, b) => b.daysAgo - a.daysAgo);
}
