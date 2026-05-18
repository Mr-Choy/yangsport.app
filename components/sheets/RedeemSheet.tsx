'use client';

import { useEffect, useState } from 'react';
import { Sheet } from '../ui/Sheet';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../icons';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import { getRedeemable } from '@/lib/utils';
import type { Reward } from '@/lib/types';

export function RedeemSheet() {
  const open = useStore((s) => s.sheet === 'redeem');
  const close = useStore((s) => s.closeSheet);
  const customers = useStore((s) => s.customers);
  const rewards = useStore((s) => s.rewards);
  const redeemAction = useStore((s) => s.redeem);
  const redeemFor = useStore((s) => s.redeemFor);
  const { t, lang } = useT();

  const customer = customers.find((c) => c.id === redeemFor) ?? null;
  const idx = customer ? customers.findIndex((c) => c.id === customer.id) : -1;
  const redeemables = customer ? getRedeemable(customer.stamps, rewards) : [];

  const [selected, setSelected] = useState<Reward | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open && customer) {
      setSelected(redeemables[0] ?? null);
      setDone(false);
    }
  }, [open, customer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!customer) return null;

  const handleConfirm = () => {
    if (!selected) return;
    setDone(true);
    setTimeout(() => {
      redeemAction(customer.id, selected.threshold, selected);
      close();
    }, 1200);
  };

  return (
    <Sheet open={open} onClose={close} title={t.redeemTitle}>
      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            margin: '0 auto', display: 'grid', placeItems: 'center',
            background: 'var(--fire)',
            boxShadow: 'var(--shadow-glow)',
            animation: 'stamp-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <Icon.gift width="44" height="44" color="#fff" />
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 18, color: 'var(--ink)' }}>
            {t.redeemSuccess}
          </div>
          <div style={{ marginTop: 6, color: 'var(--ink-muted)', fontSize: 13 }}>
            {t.giveCustomer}
          </div>
          <div className="fire-text display" style={{ fontSize: 22, marginTop: 8 }}>
            {selected && (lang === 'zh' ? selected.nameZh : selected.name)}
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={customer.name} idx={idx} />
              <div>
                <div style={{ fontWeight: 700 }}>{customer.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  {customer.stamps} {t.stamps}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {redeemables.map((r) => (
              <div key={r.id}
                   onClick={() => setSelected(r)}
                   style={{
                     padding: 14,
                     borderRadius: 14,
                     background: 'var(--surface)',
                     border: `2px solid ${selected?.id === r.id ? 'var(--orange)' : 'var(--line)'}`,
                     cursor: 'pointer',
                     display: 'flex', alignItems: 'center', gap: 14,
                     transition: 'border-color 0.15s',
                   }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'var(--fire-soft)',
                  display: 'grid', placeItems: 'center',
                  border: '1px solid rgba(255,122,24,0.3)',
                }}>
                  <Icon.gift width="22" height="22" color="var(--orange)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{lang === 'zh' ? r.nameZh : r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                    {t.deductStamps} <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{r.threshold}</span> {t.stamps}
                  </div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${selected?.id === r.id ? 'var(--orange)' : 'var(--line-2)'}`,
                  background: selected?.id === r.id ? 'var(--orange)' : 'transparent',
                  display: 'grid', placeItems: 'center',
                }}>
                  {selected?.id === r.id && <Icon.check width="12" height="12" color="#fff" />}
                </div>
              </div>
            ))}
          </div>

          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg"
                  disabled={!selected}
                  onClick={handleConfirm}>
            <Icon.gift width="20" height="20" /> {t.confirm}
          </button>
        </>
      )}
    </Sheet>
  );
}
