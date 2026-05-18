import type { Customer, Reward, Transaction, StringingService, Campaign } from './types';

export const REWARDS: Reward[] = [
  { id: 'r1', threshold: 3,  name: 'Wristband + Sport towel', nameZh: '运动手环 + 毛巾',   active: true, emoji: '🎽' },
  { id: 'r2', threshold: 6,  name: 'RM30 store voucher',      nameZh: 'RM30 抵用券',       active: true, emoji: '🎟' },
  { id: 'r3', threshold: 10, name: 'Young Sport jersey',      nameZh: 'Young Sport 球衣', active: true, emoji: '👕' },
];

export const SEED_CUSTOMERS: Customer[] = [
  { id: 'c1',  name: 'Aaron Tan',   phone: '0123450011', stamps: 8,  total_earned: 14, total_redeemed: 6,  lastVisitDays: 0,  joinDays: 142, status: 'active'   },
  { id: 'c2',  name: 'Priya Nair',  phone: '0193381122', stamps: 6,  total_earned: 12, total_redeemed: 6,  lastVisitDays: 0,  joinDays: 87,  status: 'active'   },
  { id: 'c3',  name: 'Wei Ming',    phone: '0167778899', stamps: 10, total_earned: 10, total_redeemed: 0,  lastVisitDays: 1,  joinDays: 53,  status: 'active'   },
  { id: 'c4',  name: 'Siti Aishah', phone: '0145566021', stamps: 3,  total_earned: 6,  total_redeemed: 3,  lastVisitDays: 2,  joinDays: 198, status: 'active'   },
  { id: 'c5',  name: 'Daniel Lim',  phone: '0177012345', stamps: 1,  total_earned: 1,  total_redeemed: 0,  lastVisitDays: 0,  joinDays: 0,   status: 'new'      },
  { id: 'c6',  name: 'Farah K.',    phone: '0119234567', stamps: 2,  total_earned: 5,  total_redeemed: 3,  lastVisitDays: 4,  joinDays: 65,  status: 'active'   },
  { id: 'c7',  name: 'Kenny Goh',   phone: '0182233445', stamps: 0,  total_earned: 9,  total_redeemed: 9,  lastVisitDays: 38, joinDays: 312, status: 'inactive' },
  { id: 'c8',  name: 'Mei Lin',     phone: '0136655443', stamps: 5,  total_earned: 8,  total_redeemed: 3,  lastVisitDays: 3,  joinDays: 110, status: 'active'   },
  { id: 'c9',  name: 'Raj Kumar',   phone: '0148877665', stamps: 0,  total_earned: 13, total_redeemed: 13, lastVisitDays: 56, joinDays: 401, status: 'inactive' },
  { id: 'c10', name: 'Hui Min',     phone: '0153344556', stamps: 4,  total_earned: 4,  total_redeemed: 0,  lastVisitDays: 0,  joinDays: 7,   status: 'new'      },
];

export const TX_HISTORY: Record<string, Transaction[]> = {
  c1: [
    { id: 't1', type: 'earn',   change:  1, daysAgo: 0,  note: '' },
    { id: 't2', type: 'earn',   change:  1, daysAgo: 0,  note: '' },
    { id: 't3', type: 'redeem', change: -6, daysAgo: 4,  note: 'RM30 voucher' },
    { id: 't4', type: 'earn',   change:  1, daysAgo: 5,  note: '' },
    { id: 't5', type: 'earn',   change:  1, daysAgo: 8,  note: '' },
    { id: 't6', type: 'earn',   change:  1, daysAgo: 12, note: '' },
    { id: 't7', type: 'redeem', change: -3, daysAgo: 18, note: 'Sport towel' },
    { id: 't8', type: 'earn',   change:  1, daysAgo: 22, note: '' },
  ],
};

export const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: 'k1', title: 'Weekend warrior bonus',
    titleZh: '周末战士加倍',
    message: 'Double stamps all weekend on running shoes & jerseys. Power up your collection 🔥',
    messageZh: '周末双倍盖章！跑鞋、球衣全场加倍。',
    audience: 'all', channel: 'whatsapp',
    status: 'live',
    sentAt: '2026-05-12',
    recipients: 248, opened: 162, redeemed: 31,
  },
  {
    id: 'k2', title: 'We miss you · 20% off',
    titleZh: '想你了 · 八折回归',
    message: "It's been a while! Come back this week and grab any item at 20% off.",
    messageZh: '好久不见！本周回归全场八折，欢迎回来运动。',
    audience: 'inactive', channel: 'sms',
    status: 'live',
    sentAt: '2026-05-09',
    recipients: 84, opened: 41, redeemed: 12,
  },
  {
    id: 'k3', title: 'New badminton stock',
    titleZh: '新到羽毛球装备',
    message: 'Yonex Astrox 100ZZ — limited stock. Members get free string service.',
    messageZh: 'Yonex Astrox 100ZZ 到货！会员免费穿线。',
    audience: 'active', channel: 'whatsapp',
    status: 'finished',
    sentAt: '2026-04-28',
    recipients: 192, opened: 138, redeemed: 47,
  },
  {
    id: 'k4', title: 'Year-end clearance',
    titleZh: '年终清仓',
    message: 'Up to 50% off. Limited time.',
    messageZh: '全场最低五折，限时一周。',
    audience: 'all', channel: 'whatsapp',
    status: 'finished',
    sentAt: '2026-04-10',
    recipients: 312, opened: 244, redeemed: 89,
  },
];

export const VISITS_7D = [
  { day: 'Mon', dayZh: '一', count: 18 },
  { day: 'Tue', dayZh: '二', count: 23 },
  { day: 'Wed', dayZh: '三', count: 14 },
  { day: 'Thu', dayZh: '四', count: 29 },
  { day: 'Fri', dayZh: '五', count: 41 },
  { day: 'Sat', dayZh: '六', count: 47 },
  { day: 'Sun', dayZh: '日', count: 34 },
];

export const EQUIPMENT_PRESETS = {
  racket_brand: [
    { name: 'Yonex',   models: ['Astrox 99 Pro', 'Astrox 100 ZZ', 'Nanoflare 800', 'Duora 10', 'Arcsaber 11 Pro'] },
    { name: 'Victor',  models: ['Thruster K Falcon', 'Auraspeed 90K', 'DriveX 9X', 'Brave Sword 12'] },
    { name: 'Li-Ning', models: ['Aeronaut 9000', 'Axforce 90', 'Halbertec 9000'] },
    { name: 'Mizuno',  models: ['Fortius 10 Power', 'JPX'] },
    { name: 'Apacs',   models: ['Z Ziggler', 'Feather Weight 75'] },
  ],
  string_brand: [
    { name: 'Yonex',   models: ['BG66 Ultimax', 'BG80 Power', 'Exbolt 63', 'Aerobite Boost', 'Nanogy 99'] },
    { name: 'Victor',  models: ['VBS-66N', 'VBS-69N', 'VBS-70'] },
    { name: 'Li-Ning', models: ['No.1', 'No.7', 'Aypro 67'] },
    { name: 'Ashaway', models: ['Zymax 66 Fire', 'Zymax 62 Fire'] },
  ],
};

export const TENSION_PRESETS = [22, 24, 25, 26, 27, 28, 30];

export const STRINGING_HISTORY: Record<string, StringingService[]> = {
  c1: [
    { id: 's1', daysAgo: 3,   racketBrand: 'Yonex',  racketModel: 'Astrox 99 Pro',  stringBrand: 'Yonex',   stringModel: 'BG66 Ultimax',   tension: 28, note: '' },
    { id: 's2', daysAgo: 28,  racketBrand: 'Yonex',  racketModel: 'Astrox 99 Pro',  stringBrand: 'Yonex',   stringModel: 'BG66 Ultimax',   tension: 27, note: 'broken main' },
    { id: 's3', daysAgo: 38,  racketBrand: 'Yonex',  racketModel: 'Nanoflare 800',  stringBrand: 'Yonex',   stringModel: 'Exbolt 63',      tension: 27, note: '' },
    { id: 's4', daysAgo: 62,  racketBrand: 'Yonex',  racketModel: 'Astrox 99 Pro',  stringBrand: 'Yonex',   stringModel: 'BG66 Ultimax',   tension: 27, note: '' },
    { id: 's5', daysAgo: 95,  racketBrand: 'Yonex',  racketModel: 'Astrox 99 Pro',  stringBrand: 'Ashaway', stringModel: 'Zymax 66 Fire',  tension: 26, note: 'trial' },
    { id: 's6', daysAgo: 130, racketBrand: 'Yonex',  racketModel: 'Nanoflare 800',  stringBrand: 'Yonex',   stringModel: 'Aerobite Boost', tension: 26, note: '' },
    { id: 's7', daysAgo: 168, racketBrand: 'Yonex',  racketModel: 'Astrox 99 Pro',  stringBrand: 'Yonex',   stringModel: 'BG80 Power',     tension: 25, note: '' },
  ],
  c2: [
    { id: 's8',  daysAgo: 6,  racketBrand: 'Victor', racketModel: 'Auraspeed 90K', stringBrand: 'Victor', stringModel: 'VBS-66N',   tension: 26, note: '' },
    { id: 's9',  daysAgo: 42, racketBrand: 'Victor', racketModel: 'Auraspeed 90K', stringBrand: 'Victor', stringModel: 'VBS-66N',   tension: 26, note: '' },
    { id: 's10', daysAgo: 88, racketBrand: 'Victor', racketModel: 'Auraspeed 90K', stringBrand: 'Yonex',  stringModel: 'BG80 Power', tension: 25, note: '' },
  ],
  c3: [
    { id: 's11', daysAgo: 91,  racketBrand: 'Li-Ning', racketModel: 'Aeronaut 9000', stringBrand: 'Li-Ning', stringModel: 'No.1', tension: 24, note: '' },
    { id: 's12', daysAgo: 175, racketBrand: 'Li-Ning', racketModel: 'Aeronaut 9000', stringBrand: 'Li-Ning', stringModel: 'No.1', tension: 24, note: '' },
  ],
};

export const FATIGUE = { healthy: 45, aging: 75, fatigue: 90 };
