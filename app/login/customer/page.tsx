'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/lib/useHydratedLang';
import { useStore } from '@/lib/store';
import { useSession, CUSTOMER_DEFAULT_PASSCODE } from '@/lib/session';
import { Icon } from '@/components/icons';
import { formatPhone } from '@/lib/utils';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { t, lang } = useT();
  const toggleLang = useStore((s) => s.toggleLang);
  const loadCustomerByPhone = useStore((s) => s.loadCustomerByPhone);
  const signIn = useSession((s) => s.signIn);

  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [step, setStep] = useState<'phone' | 'passcode'>('phone');
  const [error, setError] = useState(false);
  const [match, setMatch] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (step !== 'phone') return;
    if (phone.length < 10) { setMatch(null); return; }
    let cancelled = false;
    setSearching(true);
    (async () => {
      const m = await loadCustomerByPhone(phone);
      if (cancelled) return;
      setMatch(m ? { id: m.id, name: m.name, phone: m.phone } : null);
      setSearching(false);
    })();
    return () => { cancelled = true; };
  }, [phone, step, loadCustomerByPhone]);

  const onPad = (d: string) => {
    setError(false);
    if (step === 'phone') {
      if (d === 'del') setPhone(phone.slice(0, -1));
      else if (phone.length < 11) setPhone(phone + d);
    } else {
      if (d === 'del') setPasscode(passcode.slice(0, -1));
      else if (passcode.length < 4) {
        const next = passcode + d;
        setPasscode(next);
        if (next.length === 4) {
          setTimeout(() => {
            if (match && next === CUSTOMER_DEFAULT_PASSCODE) {
              signIn({ kind: 'customer', customerId: match.id });
              router.replace('/me');
            } else {
              setError(true);
              setTimeout(() => { setPasscode(''); setError(false); }, 1200);
            }
          }, 200);
        }
      }
    }
  };

  const advance = () => {
    if (step === 'phone' && match) setStep('passcode');
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div className="ys-topbar">
        <button className="ys-iconbtn"
                onClick={() => {
                  if (step === 'passcode') { setStep('phone'); setPasscode(''); }
                  else router.push('/login');
                }}
                aria-label="Back">
          <Icon.arrowL width="20" height="20" />
        </button>
        <button className="ys-iconbtn" onClick={toggleLang}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{lang === 'en' ? 'EN' : '中'}</span>
        </button>
      </div>

      <div className="ys-content" style={{ paddingTop: 64, paddingBottom: 40, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            display: 'grid', placeItems: 'center',
            margin: '0 auto',
            color: 'var(--orange)',
          }}>
            {step === 'phone'
              ? <Icon.phone width="24" height="24" />
              : <Icon.users width="24" height="24" />}
          </div>
          <div className="display" style={{ fontSize: 22, marginTop: 12 }}>{t.customerLogin}</div>
        </div>

        {step === 'phone' ? (
          <div style={{ textAlign: 'center', padding: '6px 0 14px' }}>
            <div className="eyebrow">{t.enterPhone}</div>
            <div className="mono" style={{
              fontSize: 28, marginTop: 6, fontWeight: 600, letterSpacing: '0.02em',
              color: phone ? 'var(--ink)' : 'var(--ink-dim)',
            }}>
              {phone ? formatPhone(phone) : '012-345 6789'}
            </div>
            {searching && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-muted)' }}>
                {lang === 'zh' ? '查找中…' : 'Searching…'}
              </div>
            )}
            {match && (
              <div style={{ marginTop: 8 }}>
                <span className="badge new" style={{ fontSize: 11 }}>✓ {match.name}</span>
              </div>
            )}
            {phone.length >= 10 && !match && !searching && (
              <div style={{ marginTop: 8 }}>
                <span className="badge" style={{
                  color: 'var(--danger)',
                  borderColor: 'rgba(255,77,94,0.3)',
                  background: 'rgba(255,77,94,0.08)',
                }}>
                  {t.notFound}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6px 0 14px' }}>
            <div className="eyebrow">{t.enterPasscode}</div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 14 }}>
              {[0, 1, 2, 3].map((i) => {
                const filled = i < passcode.length;
                return (
                  <div key={i} style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '2px solid',
                    borderColor: error ? 'var(--danger)' : filled ? 'var(--orange)' : 'var(--line-2)',
                    background: error ? 'var(--danger)' : filled ? 'var(--orange)' : 'transparent',
                    transition: 'all 0.15s',
                    animation: error ? 'shake 0.4s' : 'none',
                  }} />
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 14 }}>
              {error ? t.invalidCreds : t.customerHint}
            </div>
          </div>
        )}

        <div className="keypad" style={{ marginTop: 12 }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button key={d} className="keypad-btn" onClick={() => onPad(d)}>{d}</button>
          ))}
          <button className="keypad-btn icon" onClick={() => {
            if (step === 'phone') setPhone('');
            else setPasscode('');
          }}>
            {lang === 'zh' ? '清' : 'C'}
          </button>
          <button className="keypad-btn" onClick={() => onPad('0')}>0</button>
          <button className="keypad-btn icon" onClick={() => onPad('del')}>⌫</button>
        </div>

        {step === 'phone' && (
          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg" style={{ marginTop: 14 }}
                  disabled={!match}
                  onClick={advance}>
            <Icon.arrowR width="20" height="20" /> {t.signIn}
          </button>
        )}

        <div style={{ marginTop: 18, fontSize: 11, color: 'var(--ink-dim)', textAlign: 'center' }}>
          {t.forgotPasscode}
        </div>
      </div>
    </div>
  );
}
