'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useSession } from '@/lib/session';
import { useT } from '@/lib/useHydratedLang';
import { TopBar } from '@/components/ui/TopBar';
import { Icon } from '@/components/icons';
import { YLogo, YMini } from '@/components/brand';

export default function MorePage() {
  const router = useRouter();
  const customers = useStore((s) => s.customers);
  const campaigns = useStore((s) => s.campaigns);
  const rewards = useStore((s) => s.rewards);
  const openSheet = useStore((s) => s.openSheet);
  const toggleLang = useStore((s) => s.toggleLang);
  const signOut = useSession((s) => s.signOut);
  const { t, lang } = useT();

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  interface MoreItem { id: string; icon: ReactNode; label: string; sub: string; onClick?: () => void }
  const items: MoreItem[] = [
    { id: 'rules',  icon: <Icon.gift width="20" height="20" />,  label: t.rewardRulesLabel, sub: `${rewards.filter((r) => r.active).length} ${lang === 'zh' ? '条规则' : 'rules'}`, onClick: () => openSheet('rules') },
    { id: 'store',  icon: <YMini size={20} />,                     label: t.storeInfo,        sub: t.storeName },
    { id: 'notif',  icon: <Icon.bell width="20" height="20" />,    label: t.notifications,    sub: lang === 'zh' ? '开启' : 'On' },
    { id: 'team',   icon: <Icon.users width="20" height="20" />,   label: t.teamMembers,      sub: `2 ${lang === 'zh' ? '人' : 'members'}` },
    { id: 'export', icon: <Icon.copy width="20" height="20" />,    label: t.exportData,       sub: 'CSV / Excel' },
    { id: 'lang',   icon: <Icon.globe width="20" height="20" />,   label: t.language,         sub: lang === 'en' ? 'English' : '中文', onClick: toggleLang },
    { id: 'help',   icon: <Icon.spark width="20" height="20" />,   label: t.help,             sub: '' },
  ];

  return (
    <>
      <TopBar title={t.moreTitle} />
      <div className="ys-content ys-pad-top ys-pad-btm">
        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <div className="display" style={{ fontSize: 34 }}>{t.moreTitle}</div>
        </div>

        <div className="ys-card-hero" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              display: 'grid', placeItems: 'center',
            }}>
              <YLogo size={36} gradient />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                {t.storeInfo}
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, marginTop: 4 }}>{t.storeName}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2, fontStyle: 'italic' }}>
                {t.tagline}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
            <Stat label={lang === 'zh' ? '客户' : 'Members'} value={customers.length} />
            <Stat label={lang === 'zh' ? '活动' : 'Campaigns'} value={campaigns.length} />
            <Stat label={lang === 'zh' ? '奖励' : 'Rewards'} value={rewards.length} />
          </div>
        </div>

        <div className="ys-card" style={{ padding: 0 }}>
          {items.map((it, i) => (
            <div key={it.id} onClick={it.onClick}
                 style={{
                   display: 'flex', alignItems: 'center', gap: 14,
                   padding: '14px 16px',
                   borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none',
                   cursor: it.onClick ? 'pointer' : 'default',
                 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--surface-2)',
                display: 'grid', placeItems: 'center',
                color: 'var(--ink-2)',
                flex: 'none',
              }}>{it.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{it.label}</div>
                {it.sub && <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 1 }}>{it.sub}</div>}
              </div>
              {it.onClick && <Icon.chev width="14" height="14" color="var(--ink-muted)" />}
            </div>
          ))}
        </div>

        <button className="ys-btn ys-btn-ghost ys-btn-block"
                style={{ marginTop: 16, color: 'var(--danger)' }}
                onClick={handleSignOut}>
          {t.signOut}
        </button>

        <div style={{ textAlign: 'center', marginTop: 28, opacity: 0.4 }}>
          <YLogo size={36} color="#3a3a44" />
          <div className="display" style={{ fontSize: 12, marginTop: 6, color: 'var(--ink-dim)' }}>
            YOUNG SPORT · {t.tagline.toUpperCase()}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
        {label}
      </div>
      <div className="display-num" style={{ fontSize: 24, marginTop: 2 }}>{value}</div>
    </div>
  );
}
