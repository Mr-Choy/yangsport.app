export type Lang = 'en' | 'zh';
export type Theme = 'fire' | 'red' | 'yellow' | 'blue';

export type CustomerStatus = 'new' | 'active' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  stamps: number;
  total_earned: number;
  total_redeemed: number;
  lastVisitDays: number;
  joinDays: number;
  status: CustomerStatus;
}

export interface Reward {
  id: string;
  threshold: number;
  name: string;
  nameZh: string;
  active: boolean;
  emoji: string;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'redeem';
  change: number;
  daysAgo: number;
  note: string;
}

export interface StringingService {
  id: string;
  daysAgo: number;
  racketBrand: string;
  racketModel: string;
  stringBrand: string;
  stringModel: string;
  tension: number;
  note: string;
}

export type CampaignStatus = 'draft' | 'live' | 'finished';
export type Channel = 'whatsapp' | 'sms' | 'push';
export type Audience = 'all' | 'active' | 'inactive' | 'ready';

export interface Campaign {
  id: string;
  title: string;
  titleZh: string;
  message: string;
  messageZh: string;
  audience: Audience;
  channel: Channel;
  status: CampaignStatus;
  sentAt: string;
  recipients: number;
  opened: number;
  redeemed: number;
}

export interface ToastData {
  id?: number;
  type: 'earn' | 'reward' | 'redeem';
  title: string;
  sub?: string;
}

export interface MergedHistory {
  id: string;
  type: 'earn' | 'redeem' | 'stringing';
  daysAgo: number;
  change?: number;
  note?: string;
  racketBrand?: string;
  racketModel?: string;
  stringBrand?: string;
  stringModel?: string;
  tension?: number;
}
