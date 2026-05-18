'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '../icons';
import { useStore } from '@/lib/store';
import { getStrings } from '@/lib/i18n';

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = useStore((s) => s.lang);
  const openSheet = useStore((s) => s.openSheet);
  const t = getStrings(lang);

  const isActive = (prefix: string) => {
    if (prefix === '/') return pathname === '/';
    return pathname === prefix || pathname.startsWith(prefix + '/');
  };

  return (
    <div className="ys-tabs">
      <button className={`ys-tab ${isActive('/') ? 'is-active' : ''}`} onClick={() => router.push('/')}>
        <Icon.home />
        <span className="ys-tab-label">{t.tabHome}</span>
      </button>
      <button className={`ys-tab ${isActive('/customers') ? 'is-active' : ''}`} onClick={() => router.push('/customers')}>
        <Icon.users />
        <span className="ys-tab-label">{t.tabCustomers}</span>
      </button>
      <button className="ys-tab-fab" onClick={() => openSheet('addStamp')} aria-label={t.tabStamp}>
        <Icon.plus width="28" height="28" />
      </button>
      <button className={`ys-tab ${isActive('/promo') ? 'is-active' : ''}`} onClick={() => router.push('/promo')}>
        <Icon.megaphone />
        <span className="ys-tab-label">{t.tabPromo}</span>
      </button>
      <button className={`ys-tab ${isActive('/more') ? 'is-active' : ''}`} onClick={() => router.push('/more')}>
        <Icon.grid />
        <span className="ys-tab-label">{t.tabMore}</span>
      </button>
    </div>
  );
}
