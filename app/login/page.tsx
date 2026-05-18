'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/lib/useHydratedLang';
import { useSession } from '@/lib/session';
import { YLogo } from '@/components/brand';
import { Icon } from '@/components/icons';

export default function LoginGatePage() {
  const router = useRouter();
  const { t, lang } = useT();
  const toggleLang = () => {
    // toggle lang via the prefs store
    import('@/lib/store').then(({ useStore }) => useStore.getState().toggleLang());
  };

  // sanity — if already signed in, the Shell will redirect us
  useSession();

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <button onClick={toggleLang}
              className="ys-iconbtn"
              style={{ position: 'absolute', top: 22, right: 18, zIndex: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>{lang === 'en' ? 'EN' : '中'}</span>
      </button>

      <div className="ys-content" style={{ paddingTop: 64, paddingBottom: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: 28, marginTop: 24 }}>
            <div style={{
              width: 84, height: 84, borderRadius: 28,
              background: 'radial-gradient(60% 60% at 30% 30%, rgba(255,122,24,0.2), transparent 70%), var(--surface)',
              border: '1px solid var(--line)',
              display: 'grid', placeItems: 'center',
              margin: '0 auto',
              boxShadow: 'var(--shadow-card)',
            }}>
              <YLogo size={48} gradient />
            </div>
            <div className="display" style={{ fontSize: 32, marginTop: 18, textAlign: 'center', letterSpacing: '0.01em' }}>
              {t.welcome}
            </div>
            <div className="fire-text display" style={{ fontSize: 22, marginTop: 4, textAlign: 'center' }}>
              YANG SPORT
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 8, textAlign: 'center', fontStyle: 'italic' }}>
              {t.tagline}
            </div>
          </div>

          <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 16 }}>
            {t.chooseRole}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <RoleCard
              icon={<Icon.settings width="22" height="22" />}
              title={t.asAdmin}
              sub={t.asAdminSub}
              accent
              onClick={() => router.push('/login/admin')} />
            <RoleCard
              icon={<Icon.users width="22" height="22" />}
              title={t.asCustomer}
              sub={t.asCustomerSub}
              onClick={() => router.push('/login/customer')} />
          </div>
        </div>

        <div style={{ marginTop: 28, textAlign: 'center', opacity: 0.4 }}>
          <YLogo size={28} color="#3a3a44" />
          <div className="display" style={{ fontSize: 11, marginTop: 6, color: 'var(--ink-dim)' }}>
            YANG SPORT · {t.tagline.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon, title, sub, accent = false, onClick }: {
  icon: ReactNode; title: string; sub: string; accent?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
            style={{
              padding: 18, borderRadius: 18,
              background: accent
                ? 'linear-gradient(135deg, rgba(255,45,45,0.10) 0%, rgba(255,122,24,0.10) 50%, rgba(255,208,0,0.10) 100%), var(--surface)'
                : 'var(--surface)',
              border: accent ? '1px solid rgba(255,122,24,0.35)' : '1px solid var(--line)',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: accent ? '0 8px 32px -10px rgba(255,122,24,0.35)' : 'var(--shadow-card)',
              transition: 'transform 0.1s',
            }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: accent ? 'var(--fire)' : 'var(--surface-2)',
        color: accent ? '#fff' : 'var(--ink-2)',
        display: 'grid', placeItems: 'center',
        flex: 'none',
        boxShadow: accent ? '0 4px 16px -2px rgba(255,122,24,0.5)' : 'none',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Saira Condensed, sans-serif',
          fontWeight: 800, fontStyle: 'italic',
          fontSize: 18, letterSpacing: '0.01em',
          textTransform: 'uppercase',
        }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>{sub}</div>
      </div>
      <Icon.chev width="18" height="18" color={accent ? 'var(--orange)' : 'var(--ink-muted)'} />
    </button>
  );
}
