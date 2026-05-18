'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../icons';
import { YLogo } from '../brand';
import { useStore } from '@/lib/store';

interface TopBarProps {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  showBrand?: boolean;
}

export function TopBar({ title, onBack, right, showBrand = false }: TopBarProps) {
  const router = useRouter();
  const lang = useStore((s) => s.lang);
  const toggleLang = useStore((s) => s.toggleLang);
  const back = onBack ?? (() => router.back());

  return (
    <div className="ys-topbar">
      {onBack !== undefined ? (
        <button className="ys-iconbtn" onClick={back} aria-label="Back">
          <Icon.arrowL width="20" height="20" />
        </button>
      ) : showBrand ? (
        <div className="ys-brand">
          <YLogo size={26} gradient />
          <span className="ys-brand-text" style={{ whiteSpace: 'nowrap', color: 'var(--orange)' }}>
            YOUNG <span style={{ color: 'var(--yellow)' }}>SPORT</span>
          </span>
        </div>
      ) : (
        <div className="ys-brand">
          <span className="ys-brand-text" style={{ whiteSpace: 'nowrap' }}>{title}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        {right}
        <button className="ys-iconbtn" onClick={toggleLang} aria-label="Toggle language">
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
            {lang === 'en' ? 'EN' : '中'}
          </span>
        </button>
      </div>
    </div>
  );
}
