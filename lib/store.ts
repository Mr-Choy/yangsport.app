'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Customer, Reward, Transaction, StringingService, Campaign,
  Lang, Theme, ToastData, Audience, Channel,
} from './types';
import {
  REWARDS, SEED_CUSTOMERS, SEED_CAMPAIGNS,
  TX_HISTORY, STRINGING_HISTORY,
} from './seed';
import { isDbEnabled } from './supabase';
import * as db from './db';

type SheetKind = null | 'addStamp' | 'redeem' | 'newCampaign' | 'rules' | 'stringing';

interface StoreState {
  // persisted prefs
  lang: Lang;
  theme: Theme;

  // data
  customers: Customer[];
  campaigns: Campaign[];
  rewards: Reward[];
  txMap: Record<string, Transaction[]>;
  stringMap: Record<string, StringingService[]>;

  // db status
  loadedAll: boolean;
  loadedCustomer: Record<string, boolean>;
  dbError: string | null;

  // UI
  sheet: SheetKind;
  redeemFor: string | null;
  stringingFor: string | null;
  toast: ToastData | null;

  // pref actions
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  setTheme: (theme: Theme) => void;

  // UI actions
  openSheet: (k: SheetKind) => void;
  closeSheet: () => void;
  openRedeem: (customerId: string) => void;
  openRecordStringing: (customerId: string) => void;
  showToast: (toast: ToastData) => void;
  clearToast: () => void;

  // data actions (mostly async when DB enabled, sync when not)
  loadAll: () => Promise<void>;
  loadCustomerData: (customerId: string) => Promise<void>;
  loadCustomerByPhone: (phone: string) => Promise<Customer | null>;

  addStamp: (customerId: string) => Promise<void>;
  redeem: (customerId: string, threshold: number, reward: Reward | null) => Promise<void>;
  createCustomer: (data: { phone: string; name: string; addStamp?: boolean }) => Promise<void>;
  recordStringing: (customerId: string, data: Omit<StringingService, 'id'>) => Promise<void>;
  sendCampaign: (data: {
    title: string; titleZh: string; message: string; messageZh: string;
    audience: Audience; channel: Channel; recipients: number;
  }) => void;
  updateRewards: (next: Reward[]) => Promise<void>;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

// Initial data depends on whether DB is enabled. If DB is enabled we start
// EMPTY and let loadAll/loadCustomerData populate; otherwise fall back to seed.
const initialCustomers  = isDbEnabled ? [] : SEED_CUSTOMERS;
const initialRewards    = isDbEnabled ? [] : REWARDS;
const initialTxMap      = isDbEnabled ? {} : TX_HISTORY;
const initialStringMap  = isDbEnabled ? {} : STRINGING_HISTORY;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      lang: 'en',
      theme: 'fire',

      customers: initialCustomers,
      campaigns: SEED_CAMPAIGNS,    // no DB table for campaigns; always seed
      rewards: initialRewards,
      txMap: initialTxMap,
      stringMap: initialStringMap,

      loadedAll: !isDbEnabled,
      loadedCustomer: {},
      dbError: null,

      sheet: null,
      redeemFor: null,
      stringingFor: null,
      toast: null,

      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === 'en' ? 'zh' : 'en' }),
      setTheme: (theme) => set({ theme }),

      openSheet: (sheet) => set({ sheet }),
      closeSheet: () => set({ sheet: null }),
      openRedeem: (id) => set({ redeemFor: id, sheet: 'redeem' }),
      openRecordStringing: (id) => set({ stringingFor: id, sheet: 'stringing' }),

      showToast: (toast) => {
        if (toastTimer) clearTimeout(toastTimer);
        set({ toast: { ...toast, id: Date.now() } });
        toastTimer = setTimeout(() => set({ toast: null }), 2400);
      },
      clearToast: () => set({ toast: null }),

      // ── DATA LOADERS ───────────────────────────────────────────
      loadAll: async () => {
        if (!isDbEnabled) return;
        try {
          const [customers, rewards] = await Promise.all([
            db.fetchCustomers(),
            db.fetchRewards(),
          ]);
          set({ customers, rewards, loadedAll: true, dbError: null });
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Failed to load';
          set({ dbError: msg });
          get().showToast({ type: 'redeem', title: 'DB error', sub: msg });
        }
      },

      loadCustomerData: async (customerId) => {
        if (!isDbEnabled) return;
        try {
          const [customer, txs, services] = await Promise.all([
            db.fetchCustomerById(customerId),
            db.fetchTransactions(customerId),
            db.fetchStringing(customerId),
          ]);
          set((s) => ({
            customers: customer
              ? upsertCustomer(s.customers, customer)
              : s.customers,
            txMap: { ...s.txMap, [customerId]: txs },
            stringMap: { ...s.stringMap, [customerId]: services },
            loadedCustomer: { ...s.loadedCustomer, [customerId]: true },
            dbError: null,
          }));
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Failed to load';
          set({ dbError: msg });
          get().showToast({ type: 'redeem', title: 'DB error', sub: msg });
        }
      },

      loadCustomerByPhone: async (phone) => {
        if (!isDbEnabled) {
          return get().customers.find((c) => c.phone === phone) ?? null;
        }
        try {
          const customer = await db.fetchCustomerByPhone(phone);
          if (customer) {
            set((s) => ({ customers: upsertCustomer(s.customers, customer) }));
          }
          return customer;
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Failed';
          set({ dbError: msg });
          return null;
        }
      },

      // ── MUTATIONS ──────────────────────────────────────────────
      addStamp: async (customerId) => {
        const { lang, rewards, customers, txMap, showToast } = get();
        const rewardEarned = lang === 'zh' ? '获得奖励！' : 'Reward earned!';
        const stampedTxt   = lang === 'zh' ? '已加章' : 'Stamp added';
        const stampsLabel  = lang === 'zh' ? '章' : 'stamps';

        const before = customers.find((c) => c.id === customerId)?.stamps ?? 0;

        if (isDbEnabled) {
          try {
            await db.rpcAddStamp(customerId);
            const [customer, txs] = await Promise.all([
              db.fetchCustomerById(customerId),
              db.fetchTransactions(customerId),
            ]);
            if (customer) {
              set((s) => ({
                customers: upsertCustomer(s.customers, customer),
                txMap: { ...s.txMap, [customerId]: txs },
              }));
              const crossed = rewards.find((r) => r.active && r.threshold === customer.stamps && before < r.threshold);
              if (crossed) {
                setTimeout(() => showToast({
                  type: 'reward',
                  title: rewardEarned,
                  sub: lang === 'zh' ? crossed.nameZh : crossed.name,
                }), 250);
              } else {
                showToast({ type: 'earn', title: stampedTxt, sub: `+1 ${stampsLabel}` });
              }
            }
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed';
            showToast({ type: 'redeem', title: 'DB error', sub: msg });
          }
          return;
        }

        // ── seed mode (in-memory) ──
        let crossed: Reward | null = null;
        const nextCustomers = customers.map((c) => {
          if (c.id !== customerId) return c;
          const newStamps = c.stamps + 1;
          const r = rewards.find((r) => r.active && r.threshold === newStamps);
          if (r) crossed = r;
          return { ...c, stamps: newStamps, total_earned: c.total_earned + 1, lastVisitDays: 0 };
        });
        const newTx: Transaction = {
          id: `t-${Date.now()}`, type: 'earn', change: 1, daysAgo: 0, note: '',
        };
        const arr = txMap[customerId] || [];
        set({
          customers: nextCustomers,
          txMap: { ...txMap, [customerId]: [newTx, ...arr] },
        });
        if (crossed) {
          const c: Reward = crossed;
          setTimeout(() => showToast({
            type: 'reward', title: rewardEarned,
            sub: lang === 'zh' ? c.nameZh : c.name,
          }), 250);
        } else {
          showToast({ type: 'earn', title: stampedTxt, sub: `+1 ${stampsLabel}` });
        }
      },

      redeem: async (customerId, threshold, reward) => {
        const { lang, customers, txMap, showToast } = get();
        const successTitle = lang === 'zh' ? '兑换成功' : 'Reward redeemed';
        const note = reward ? (lang === 'zh' ? reward.nameZh : reward.name) : '';

        if (isDbEnabled) {
          try {
            await db.rpcRedeem(customerId, threshold);
            const [customer, txs] = await Promise.all([
              db.fetchCustomerById(customerId),
              db.fetchTransactions(customerId),
            ]);
            if (customer) {
              set((s) => ({
                customers: upsertCustomer(s.customers, customer),
                txMap: { ...s.txMap, [customerId]: txs },
              }));
            }
            showToast({ type: 'redeem', title: successTitle, sub: note });
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed';
            showToast({ type: 'redeem', title: 'DB error', sub: msg });
          }
          return;
        }

        // seed mode
        const nextCustomers = customers.map((c) =>
          c.id !== customerId
            ? c
            : { ...c, stamps: c.stamps - threshold, total_redeemed: c.total_redeemed + threshold }
        );
        const newTx: Transaction = {
          id: `t-${Date.now()}`, type: 'redeem', change: -threshold, daysAgo: 0, note,
        };
        const arr = txMap[customerId] || [];
        set({
          customers: nextCustomers,
          txMap: { ...txMap, [customerId]: [newTx, ...arr] },
        });
        showToast({ type: 'redeem', title: successTitle, sub: note });
      },

      createCustomer: async ({ phone, name, addStamp = false }) => {
        const { lang, customers, txMap, showToast } = get();
        const createdTitle = addStamp
          ? (lang === 'zh' ? '已创建并加章' : 'Created · stamped')
          : (lang === 'zh' ? '已创建客户' : 'Customer created');

        if (isDbEnabled) {
          try {
            let newC = await db.createCustomerRow({ phone, name });
            if (addStamp) {
              await db.rpcAddStamp(newC.id);
              const refreshed = await db.fetchCustomerById(newC.id);
              if (refreshed) newC = refreshed;
              const txs = await db.fetchTransactions(newC.id);
              set((s) => ({
                customers: [newC, ...s.customers.filter((c) => c.id !== newC.id)],
                txMap: { ...s.txMap, [newC.id]: txs },
              }));
            } else {
              set((s) => ({
                customers: [newC, ...s.customers.filter((c) => c.id !== newC.id)],
              }));
            }
            showToast({ type: 'earn', title: createdTitle, sub: name });
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed';
            showToast({ type: 'redeem', title: 'DB error', sub: msg });
          }
          return;
        }

        // seed mode
        const newC: Customer = {
          id: `c-${Date.now()}`,
          name, phone,
          stamps: addStamp ? 1 : 0,
          total_earned: addStamp ? 1 : 0,
          total_redeemed: 0,
          lastVisitDays: 0,
          joinDays: 0,
          status: 'new',
        };
        const nextCustomers = [newC, ...customers];
        let nextTx = txMap;
        if (addStamp) {
          nextTx = {
            ...txMap,
            [newC.id]: [{ id: `t-${Date.now()}`, type: 'earn', change: 1, daysAgo: 0, note: '' }],
          };
        }
        set({ customers: nextCustomers, txMap: nextTx });
        showToast({ type: 'earn', title: createdTitle, sub: name });
      },

      recordStringing: async (customerId, data) => {
        const { lang, customers, stringMap, showToast } = get();
        const titleStr = lang === 'zh' ? '穿线已记录' : 'Stringing logged';
        const lbs = lang === 'zh' ? '磅' : 'lbs';
        const toastSub = `${data.racketModel} · ${data.tension} ${lbs}`;

        if (isDbEnabled) {
          try {
            await db.rpcRecordStringing(customerId, {
              racketBrand: data.racketBrand, racketModel: data.racketModel,
              stringBrand: data.stringBrand, stringModel: data.stringModel,
              tension: data.tension,
              // map prototype's daysAgo (0=today, 1=yesterday) to a date string
              serviceDate: data.daysAgo
                ? new Date(Date.now() - data.daysAgo * 86_400_000).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10),
            });
            const [services, customer] = await Promise.all([
              db.fetchStringing(customerId),
              db.fetchCustomerById(customerId),
            ]);
            set((s) => ({
              stringMap: { ...s.stringMap, [customerId]: services },
              customers: customer ? upsertCustomer(s.customers, customer) : s.customers,
            }));
            showToast({ type: 'redeem', title: titleStr, sub: toastSub });
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed';
            showToast({ type: 'redeem', title: 'DB error', sub: msg });
          }
          return;
        }

        // seed mode
        const newS: StringingService = { id: `s-${Date.now()}`, ...data };
        const nextString = { ...stringMap, [customerId]: [newS, ...(stringMap[customerId] || [])] };
        const nextCustomers = customers.map((c) =>
          c.id === customerId ? { ...c, lastVisitDays: 0 } : c
        );
        set({ stringMap: nextString, customers: nextCustomers });
        showToast({ type: 'redeem', title: titleStr, sub: toastSub });
      },

      sendCampaign: (data) => {
        // No DB table for campaigns — local only.
        const { lang, campaigns, showToast } = get();
        const newCamp: Campaign = {
          id: `k-${Date.now()}`,
          ...data,
          status: 'live',
          sentAt: new Date().toISOString().slice(0, 10),
          opened: 0,
          redeemed: 0,
        };
        set({ campaigns: [newCamp, ...campaigns] });
        const recipientsLabel = lang === 'zh' ? '收件人' : 'recipients';
        showToast({
          type: 'earn',
          title: lang === 'zh' ? '已发送' : 'Sent',
          sub: `${data.recipients} ${recipientsLabel}`,
        });
      },

      updateRewards: async (next) => {
        const prev = get().rewards;
        if (isDbEnabled) {
          try {
            // diff active flag and persist any changes
            const updates: Promise<void>[] = [];
            for (const r of next) {
              const before = prev.find((p) => p.id === r.id);
              if (before && before.active !== r.active) {
                updates.push(db.updateRewardActive(r.id, r.active));
              }
            }
            await Promise.all(updates);
            const fresh = await db.fetchRewards();
            set({ rewards: fresh });
          } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed';
            get().showToast({ type: 'redeem', title: 'DB error', sub: msg });
          }
          return;
        }
        set({ rewards: next });
      },
    }),
    {
      name: 'ys-prefs',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lang: s.lang, theme: s.theme }),
    },
  ),
);

function upsertCustomer(list: Customer[], c: Customer): Customer[] {
  const idx = list.findIndex((x) => x.id === c.id);
  if (idx < 0) return [c, ...list];
  const next = list.slice();
  next[idx] = c;
  return next;
}
