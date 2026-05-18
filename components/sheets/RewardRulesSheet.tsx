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

  const addRule = () => {
    const newRule: Reward = {
      id: `temp-${Date.now()}`,
      threshold: 5,
      name: 'New Reward',
      nameZh: '新奖励',
      active: true,
      emoji: '',
    };
    setEditing([...editing, newRule]);
  };

  const removeRule = (id: string) => {
    setEditing(editing.filter((r) => r.id !== id));
  };

  return (
    <Sheet open={open} onClose={close} title={t.rewardRules} fullHeight>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 16 }}>
        {t.rewardRulesSub}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1, paddingBottom: 16 }}>
        {editing.map((r) => (
          <div key={r.id} className="ys-card" style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            opacity: r.active ? 1 : 0.6,
            position: 'relative',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Threshold Number Input */}
              <div style={{ display: 'flex', flexDirection: 'column', width: 60 }}>
                <span style={{ fontSize: 10, color: 'var(--ink-muted)', marginBottom: 2 }}>
                  {lang === 'zh' ? '印章数' : 'Stamps'}
                </span>
                <input
                  type="number"
                  min="1"
                  value={r.threshold}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setEditing(editing.map((item) => item.id === r.id ? { ...item, threshold: val } : item));
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: '6px 4px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 16,
                    color: 'var(--fire)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Name Inputs */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 9, color: 'var(--ink-muted)', marginBottom: 1 }}>EN</span>
                  <input
                    type="text"
                    placeholder="English reward name"
                    value={r.name}
                    onChange={(e) => {
                      setEditing(editing.map((item) => item.id === r.id ? { ...item, name: e.target.value } : item));
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--line)',
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '2px 0',
                      color: 'var(--ink)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 9, color: 'var(--ink-muted)', marginBottom: 1 }}>中文</span>
                  <input
                    type="text"
                    placeholder="中文奖励名称"
                    value={r.nameZh}
                    onChange={(e) => {
                      setEditing(editing.map((item) => item.id === r.id ? { ...item, nameZh: e.target.value } : item));
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--line)',
                      fontSize: 12,
                      padding: '2px 0',
                      color: 'var(--ink-muted)',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                <button
                  onClick={() => toggle(r.id)}
                  className="ys-iconbtn"
                  style={{
                    width: 'auto', padding: '4px 8px',
                    background: r.active ? 'var(--fire)' : 'var(--surface-2)',
                    color: r.active ? '#fff' : 'var(--ink-muted)',
                    border: 0,
                    fontSize: 10, fontWeight: 700,
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  {r.active ? t.active : t.paused}
                </button>
                <button
                  onClick={() => removeRule(r.id)}
                  className="ys-iconbtn"
                  style={{
                    width: 'auto', padding: '4px 8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'rgb(239, 68, 68)',
                    border: 0,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Icon.trash width="12" height="12" />
                  {lang === 'zh' ? '删除' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <button onClick={addRule} className="ys-btn ys-btn-ghost ys-btn-block" style={{ marginBottom: 12 }}>
          <Icon.plus width="18" height="18" /> {t.addRule}
        </button>

        <button className="ys-btn ys-btn-primary ys-btn-block"
                onClick={() => { updateRewards(editing); close(); }}>
          {t.save}
        </button>
      </div>
    </Sheet>
  );
}
