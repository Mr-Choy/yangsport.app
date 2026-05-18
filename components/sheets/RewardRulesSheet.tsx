'use client';

import { useEffect, useState } from 'react';
import { Sheet } from '../ui/Sheet';
import { Icon } from '../icons';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import type { Reward } from '@/lib/types';

export function RewardRulesSheet() {
  const open = useStore((s) => s.sheet === 'rules');
  const close = useStore((s) => s.closeSheet);
  const rewards = useStore((s) => s.rewards);
  const updateRewards = useStore((s) => s.updateRewards);
  const { t, lang } = useT();

  const [editing, setEditing] = useState<Reward[]>(rewards);

  useEffect(() => { if (open) setEditing(rewards); }, [open, rewards]);

  const toggle = (id: string) =>
    setEditing(editing.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));

  return (
    <Sheet open={open} onClose={close} title={t.rewardRules} fullHeight>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 16 }}>
        {t.rewardRulesSub}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {editing.map((r) => (
          <div key={r.id} className="ys-card" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            opacity: r.active ? 1 : 0.55,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: r.active ? 'var(--fire-soft)' : 'var(--surface-2)',
              display: 'grid', placeItems: 'center',
              border: `1px solid ${r.active ? 'rgba(255,122,24,0.3)' : 'var(--line)'}`,
            }}>
              <span className="display-num fire-text" style={{ fontSize: 22 }}>{r.threshold}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {lang === 'zh' ? r.nameZh : r.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                {t.deductStamps} {r.threshold} {t.stamps}
              </div>
            </div>
            <button onClick={() => toggle(r.id)}
                    className="ys-iconbtn" style={{
                      width: 'auto', padding: '6px 10px',
                      background: r.active ? 'var(--fire)' : 'var(--surface-2)',
                      color: r.active ? '#fff' : 'var(--ink-muted)',
                      border: 0,
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
              {r.active ? t.active : t.paused}
            </button>
          </div>
        ))}
      </div>

      <button className="ys-btn ys-btn-ghost ys-btn-block" style={{ marginTop: 16 }}>
        <Icon.plus width="18" height="18" /> {t.addRule}
      </button>

      <button className="ys-btn ys-btn-primary ys-btn-block" style={{ marginTop: 12 }}
              onClick={() => { updateRewards(editing); close(); }}>
        {t.save}
      </button>
    </Sheet>
  );
}
