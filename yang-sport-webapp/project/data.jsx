/* Young Sport — seed data + i18n */

// ─────────────────────────────────────────────────────────────
// i18n
// ─────────────────────────────────────────────────────────────
const I18N = {
  en: {
    appName: 'Young Sport',
    tagline: 'Focus on your passion',
    storeName: 'Young Sport · KL Sports Hub',

    // tabs
    tabHome: 'Home',
    tabCustomers: 'Customers',
    tabStamp: 'Stamp',
    tabPromo: 'Promo',
    tabMore: 'More',

    // dashboard
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    todayHero: 'Stamps today',
    vsYesterday: 'vs yesterday',
    kpiNewToday: 'New today',
    kpiTotalStamps: 'Total stamps',
    kpiRedeemPending: 'Pending rewards',
    kpiCampaigns: 'Active campaigns',
    visits7d: 'Visits · 7 days',
    customerMix: 'Customer mix',
    newCust: 'New',
    returningCust: 'Returning',
    inactiveCust: 'Inactive',
    topReady: 'Ready to redeem',
    viewAll: 'View all',

    // customers
    customersTitle: 'Customers',
    searchPlaceholder: 'Search phone or name',
    filterAll: 'All',
    filterReady: 'Ready',
    filterNew: 'New',
    filterActive: 'Active',
    filterInactive: 'Inactive',
    lastVisit: 'Last visit',
    today: 'today',
    yesterday: 'yesterday',
    daysAgo: 'd ago',
    weeksAgo: 'w ago',
    neverVisited: 'never',
    newCustomer: 'New customer',
    addCustomer: 'Add customer',
    customers: 'customers',

    // customer detail
    member: 'Member',
    memberSince: 'Member since',
    totalVisits: 'Total visits',
    rewardsEarned: 'Rewards earned',
    nextReward: 'Next reward',
    stampsToGo: 'stamps to go',
    addStamp: 'Add stamp',
    redeem: 'Redeem',
    history: 'History',
    earned: 'Earned a stamp',
    redeemed: 'Redeemed reward',
    rewardReady: 'Reward ready!',
    rewardReadySub: 'Customer can redeem now',

    // add stamp flow
    addStampTitle: 'Add stamp',
    enterPhone: 'Enter phone number',
    phoneHint: 'We\'ll find or create the customer',
    findCustomer: 'Find customer',
    notFound: 'Not found',
    createForNumber: 'Create new customer for',
    createAndAdd: 'Create + add stamp',
    stampAdded: 'Stamp added',
    rewardEarned: 'Reward earned!',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    saveAndAdd: 'Save & add stamp',
    optionalName: 'Name (optional)',

    // redeem
    redeemTitle: 'Redeem reward',
    chooseReward: 'Choose reward to redeem',
    deductStamps: 'Deduct',
    stamps: 'stamps',
    redeemSuccess: 'Reward redeemed',
    giveCustomer: 'Give the customer:',

    // promo
    promoTitle: 'Promotions',
    activeCampaigns: 'Active campaigns',
    pastCampaigns: 'Past campaigns',
    newCampaign: 'New campaign',
    campaignTitle: 'Campaign title',
    campaignMessage: 'Message to customers',
    audience: 'Audience',
    audienceAll: 'All customers',
    audienceActive: 'Active members',
    audienceInactive: 'Inactive 30+ days',
    audienceReady: 'Ready to redeem',
    channel: 'Channel',
    schedule: 'Schedule',
    sendNow: 'Send now',
    scheduleLater: 'Schedule later',
    recipients: 'recipients',
    opened: 'opened',
    sent: 'sent',
    draft: 'Draft',
    live: 'Live',
    finished: 'Finished',
    broadcast: 'Broadcast',

    // rewards rules
    rewardRules: 'Reward rules',
    rewardRulesSub: 'Edit thresholds and reward names',
    threshold: 'Threshold',
    rewardName: 'Reward name',
    addRule: 'Add rule',
    active: 'Active',
    paused: 'Paused',

    // more
    moreTitle: 'More',
    storeInfo: 'Store info',
    notifications: 'Notifications',
    language: 'Language',
    rewardRulesLabel: 'Reward rules',
    teamMembers: 'Team members',
    exportData: 'Export data',
    help: 'Help & support',
    signOut: 'Sign out',
  },
  zh: {
    appName: 'Young Sport',
    tagline: '专注你的热爱',
    storeName: 'Young Sport · 吉隆坡运动中心',

    tabHome: '首页',
    tabCustomers: '客户',
    tabStamp: '加章',
    tabPromo: '促销',
    tabMore: '更多',

    greetingMorning: '早上好',
    greetingAfternoon: '下午好',
    greetingEvening: '晚上好',
    todayHero: '今日发章',
    vsYesterday: '较昨日',
    kpiNewToday: '今日新增',
    kpiTotalStamps: '总章数',
    kpiRedeemPending: '待兑换',
    kpiCampaigns: '进行中活动',
    visits7d: '近 7 天访问',
    customerMix: '客户构成',
    newCust: '新客',
    returningCust: '回头客',
    inactiveCust: '沉睡',
    topReady: '可兑换',
    viewAll: '全部',

    customersTitle: '客户',
    searchPlaceholder: '搜索手机号或姓名',
    filterAll: '全部',
    filterReady: '可兑换',
    filterNew: '新客',
    filterActive: '活跃',
    filterInactive: '沉睡',
    lastVisit: '最近访问',
    today: '今天',
    yesterday: '昨天',
    daysAgo: '天前',
    weeksAgo: '周前',
    neverVisited: '从未',
    newCustomer: '新客户',
    addCustomer: '新增客户',
    customers: '位客户',

    member: '会员',
    memberSince: '加入于',
    totalVisits: '累计到访',
    rewardsEarned: '已领奖励',
    nextReward: '下个奖励',
    stampsToGo: '章可兑换',
    addStamp: '加章',
    redeem: '兑换',
    history: '历史记录',
    earned: '获得 1 章',
    redeemed: '兑换奖励',
    rewardReady: '奖励已就绪！',
    rewardReadySub: '客户可以兑换了',

    addStampTitle: '加章',
    enterPhone: '输入手机号',
    phoneHint: '我们会自动查找或创建客户',
    findCustomer: '查找客户',
    notFound: '未找到',
    createForNumber: '为此号码创建新客户',
    createAndAdd: '创建并加章',
    stampAdded: '已加章',
    rewardEarned: '获得奖励！',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    saveAndAdd: '保存并加章',
    optionalName: '姓名（可选）',

    redeemTitle: '兑换奖励',
    chooseReward: '选择要兑换的奖励',
    deductStamps: '扣除',
    stamps: '章',
    redeemSuccess: '兑换成功',
    giveCustomer: '请将以下奖励给客户：',

    promoTitle: '促销活动',
    activeCampaigns: '进行中',
    pastCampaigns: '历史活动',
    newCampaign: '新活动',
    campaignTitle: '活动标题',
    campaignMessage: '推送消息',
    audience: '受众',
    audienceAll: '全部客户',
    audienceActive: '活跃会员',
    audienceInactive: '30 天未到店',
    audienceReady: '可兑换会员',
    channel: '渠道',
    schedule: '发送时间',
    sendNow: '立即发送',
    scheduleLater: '定时发送',
    recipients: '收件人',
    opened: '打开',
    sent: '已发送',
    draft: '草稿',
    live: '进行中',
    finished: '已结束',
    broadcast: '发送',

    rewardRules: '奖励规则',
    rewardRulesSub: '管理章数门槛与奖励',
    threshold: '门槛',
    rewardName: '奖励名',
    addRule: '新增规则',
    active: '启用',
    paused: '暂停',

    moreTitle: '更多',
    storeInfo: '店铺信息',
    notifications: '通知',
    language: '语言',
    rewardRulesLabel: '奖励规则',
    teamMembers: '团队成员',
    exportData: '导出数据',
    help: '帮助与支持',
    signOut: '退出登录',
  },
};

// ─────────────────────────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────────────────────────
const REWARDS = [
  { id: 'r1', threshold: 3,  name: 'Wristband + Sport towel',  nameZh: '运动手环 + 毛巾',  active: true,  emoji: '🎽' },
  { id: 'r2', threshold: 6,  name: 'RM30 store voucher',        nameZh: 'RM30 抵用券',     active: true,  emoji: '🎟' },
  { id: 'r3', threshold: 10, name: 'Young Sport jersey',        nameZh: 'Young Sport 球衣', active: true,  emoji: '👕' },
];

const SEED_CUSTOMERS = [
  { id: 'c1', name: 'Aaron Tan',   phone: '0123450011', stamps: 8, total_earned: 14, total_redeemed: 6, lastVisitDays: 0, joinDays: 142, status: 'active'   },
  { id: 'c2', name: 'Priya Nair',  phone: '0193381122', stamps: 6, total_earned: 12, total_redeemed: 6, lastVisitDays: 0, joinDays: 87,  status: 'active'   },
  { id: 'c3', name: 'Wei Ming',    phone: '0167778899', stamps: 10, total_earned: 10, total_redeemed: 0, lastVisitDays: 1, joinDays: 53,  status: 'active'   },
  { id: 'c4', name: 'Siti Aishah', phone: '0145566021', stamps: 3, total_earned: 6,  total_redeemed: 3, lastVisitDays: 2, joinDays: 198, status: 'active'   },
  { id: 'c5', name: 'Daniel Lim',  phone: '0177012345', stamps: 1, total_earned: 1,  total_redeemed: 0, lastVisitDays: 0, joinDays: 0,   status: 'new'      },
  { id: 'c6', name: 'Farah K.',    phone: '0119234567', stamps: 2, total_earned: 5,  total_redeemed: 3, lastVisitDays: 4, joinDays: 65,  status: 'active'   },
  { id: 'c7', name: 'Kenny Goh',   phone: '0182233445', stamps: 0, total_earned: 9,  total_redeemed: 9, lastVisitDays: 38, joinDays: 312, status: 'inactive' },
  { id: 'c8', name: 'Mei Lin',     phone: '0136655443', stamps: 5, total_earned: 8,  total_redeemed: 3, lastVisitDays: 3, joinDays: 110, status: 'active'   },
  { id: 'c9', name: 'Raj Kumar',   phone: '0148877665', stamps: 0, total_earned: 13, total_redeemed: 13, lastVisitDays: 56, joinDays: 401, status: 'inactive' },
  { id: 'c10', name: 'Hui Min',    phone: '0153344556', stamps: 4, total_earned: 4,  total_redeemed: 0, lastVisitDays: 0, joinDays: 7,   status: 'new'      },
];

// Pre-built transactions for one customer (Aaron) to show history
const TX_HISTORY = {
  c1: [
    { id: 't1', type: 'earn',   change: 1,  daysAgo: 0,   note: '' },
    { id: 't2', type: 'earn',   change: 1,  daysAgo: 0,   note: '' },
    { id: 't3', type: 'redeem', change: -6, daysAgo: 4,   note: 'RM30 voucher' },
    { id: 't4', type: 'earn',   change: 1,  daysAgo: 5,   note: '' },
    { id: 't5', type: 'earn',   change: 1,  daysAgo: 8,   note: '' },
    { id: 't6', type: 'earn',   change: 1,  daysAgo: 12,  note: '' },
    { id: 't7', type: 'redeem', change: -3, daysAgo: 18,  note: 'Sport towel' },
    { id: 't8', type: 'earn',   change: 1,  daysAgo: 22,  note: '' },
  ],
};

const SEED_CAMPAIGNS = [
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
    message: 'It\'s been a while! Come back this week and grab any item at 20% off.',
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

// 7-day visit data (Mon-Sun, Sun = today)
const VISITS_7D = [
  { day: 'Mon', dayZh: '一', count: 18 },
  { day: 'Tue', dayZh: '二', count: 23 },
  { day: 'Wed', dayZh: '三', count: 14 },
  { day: 'Thu', dayZh: '四', count: 29 },
  { day: 'Fri', dayZh: '五', count: 41 },
  { day: 'Sat', dayZh: '六', count: 47 },
  { day: 'Sun', dayZh: '日', count: 34 },
];

// helpers
function relTime(daysAgo, lang, t) {
  if (daysAgo === 0)      return t.today;
  if (daysAgo === 1)      return t.yesterday;
  if (daysAgo < 7)        return lang === 'zh' ? `${daysAgo}${t.daysAgo}` : `${daysAgo}${t.daysAgo}`;
  return lang === 'zh' ? `${Math.floor(daysAgo/7)}${t.weeksAgo}` : `${Math.floor(daysAgo/7)}${t.weeksAgo}`;
}

function formatPhone(p) {
  // 0123450011 → 012-345 0011
  if (!p) return '';
  if (p.length <= 3) return p;
  if (p.length <= 6) return `${p.slice(0,3)}-${p.slice(3)}`;
  return `${p.slice(0,3)}-${p.slice(3,6)} ${p.slice(6)}`;
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarClass(idx) {
  return `avatar-${(idx % 6) + 1}`;
}

function getNextReward(stamps, rewards) {
  const active = rewards.filter(r => r.active).sort((a,b) => a.threshold - b.threshold);
  return active.find(r => stamps < r.threshold) || null;
}

function getRedeemable(stamps, rewards) {
  return rewards
    .filter(r => r.active && stamps >= r.threshold)
    .sort((a,b) => b.threshold - a.threshold);
}

Object.assign(window, {
  I18N, REWARDS, SEED_CUSTOMERS, SEED_CAMPAIGNS, VISITS_7D, TX_HISTORY,
  relTime, formatPhone, getInitials, getAvatarClass, getNextReward, getRedeemable,
});
