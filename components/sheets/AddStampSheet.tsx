'use client';

import { useEffect, useState } from 'react';
import { Sheet } from '../ui/Sheet';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../icons';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import { formatPhone } from '@/lib/utils';

export function AddStampSheet() {
  const open = useStore((s) => s.sheet === 'addStamp');
  const close = useStore((s) => s.closeSheet);
  const customers = useStore((s) => s.customers);
  const addStamp = useStore((s) => s.addStamp);
  const createCustomer = useStore((s) => s.createCustomer);
  const { t, lang } = useT();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'input' | 'found' | 'not-found'>('input');
  const [match, setMatch] = useState<typeof customers[number] | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!open) {
      setPhone(''); setStep('input'); setMatch(null); setName('');
    }
  }, [open]);

  useEffect(() => {
    if (phone.length < 7) { setStep('input'); setMatch(null); return; }
    const m = customers.find((c) => c.phone === phone);
    if (m) { setMatch(m); setStep('found'); }
    else if (phone.length >= 10) { setStep('not-found'); setMatch(null); }
    else { setStep('input'); setMatch(null); }
  }, [phone, customers]);

  const onPad = (digit: string) => {
    if (digit === 'del') setPhone(phone.slice(0, -1));
    else if (phone.length < 11) setPhone(phone + digit);
  };

  const confirmExisting = () => {
    if (!match) return;
    addStamp(match.id);
    close();
  };

  const confirmCreate = () => {
    createCustomer({
      phone,
      name: name.trim() || (lang === 'zh' ? '新会员' : 'New member'),
      addStamp: true,
    });
    close();
  };

  return (
    <Sheet open={open} onClose={close} title={t.addStampTitle} fullHeight>
      <div style={{ textAlign: 'center', padding: '14px 0 20px' }}>
        <div className="eyebrow">{t.enterPhone}</div>
        <div className="mono" style={{
          fontSize: 32, marginTop: 6, fontWeight: 600, letterSpacing: '0.02em',
          color: phone ? 'var(--ink)' : 'var(--ink-dim)',
        }}>
          {phone ? formatPhone(phone) : '012-345 6789'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>{t.phoneHint}</div>
      </div>

      {step === 'found' && match && (
        <div className="ys-card" style={{
          marginBottom: 16,
          borderColor: 'rgba(56,214,138,0.3)',
          background: 'linear-gradient(96deg, rgba(56,214,138,0.08), transparent 60%), var(--surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={match.name} idx={customers.indexOf(match)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{match.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                {match.stamps} {t.stamps} · {match.total_earned} {lang === 'zh' ? '次到访' : 'visits'}
              </div>
            </div>
            <span className="badge new">{lang === 'zh' ? '找到了' : 'FOUND'}</span>
          </div>
        </div>
      )}

      {step === 'not-found' && (
        <div className="ys-card" style={{
          marginBottom: 16,
          borderColor: 'rgba(255,122,24,0.3)',
          background: 'linear-gradient(96deg, rgba(255,122,24,0.08), transparent 60%), var(--surface)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{t.notFound}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
            {t.createForNumber} <span className="mono" style={{ color: 'var(--ink)' }}>{formatPhone(phone)}</span>
          </div>
          <input
            className="ys-input"
            placeholder={t.optionalName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginTop: 12, fontFamily: 'var(--font-hanken), Hanken Grotesk, sans-serif' }}
          />
        </div>
      )}

      <div className="keypad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} className="keypad-btn" onClick={() => onPad(d)}>{d}</button>
        ))}
        <button className="keypad-btn icon" onClick={() => setPhone('')}>{lang === 'zh' ? '清除' : 'C'}</button>
        <button className="keypad-btn" onClick={() => onPad('0')}>0</button>
        <button className="keypad-btn icon" onClick={() => onPad('del')}>⌫</button>
      </div>

      <div style={{ marginTop: 16 }}>
        {step === 'found' && (
          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg" onClick={confirmExisting}>
            <Icon.plus width="22" height="22" /> {t.addStamp}
          </button>
        )}
        {step === 'not-found' && (
          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg" onClick={confirmCreate}>
            <Icon.zap width="20" height="20" /> {t.createAndAdd}
          </button>
        )}
        {step === 'input' && (
          <button className="ys-btn ys-btn-ghost ys-btn-block ys-btn-lg" disabled style={{ opacity: 0.5 }}>
            {t.findCustomer}
          </button>
        )}
      </div>
    </Sheet>
  );
}
