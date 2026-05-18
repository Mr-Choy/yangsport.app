'use client';

import { Icon } from '../icons';
import { useStore } from '@/lib/store';

export function Toast() {
  const toast = useStore((s) => s.toast);
  if (!toast) return null;
  const isReward = toast.type === 'reward';
  const isRedeem = toast.type === 'redeem';
  return (
    <div className="toast" key={toast.id}>
      <div className="toast-icon" style={{
        background: isReward ? 'var(--fire)' : isRedeem ? 'rgba(255,208,0,0.15)' : 'rgba(56,214,138,0.15)',
        color: isReward ? '#fff' : isRedeem ? 'var(--yellow)' : 'var(--success)',
      }}>
        {isReward ? <Icon.flame width="18" height="18" /> :
         isRedeem ? <Icon.gift width="18" height="18" /> :
                    <Icon.check width="18" height="18" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{toast.title}</div>
        {toast.sub && <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>{toast.sub}</div>}
      </div>
    </div>
  );
}
