'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/lib/useHydratedLang';
import { useStore } from '@/lib/store';
import { useSession, ADMIN_USER } from '@/lib/session';
import { Icon } from '@/components/icons';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t, lang } = useT();
  const toggleLang = useStore((s) => s.toggleLang);
  const signIn = useSession((s) => s.signIn);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        signIn({ kind: 'admin', username });
        router.replace('/');
      } else {
        setError(true);
        setLoading(false);
        setTimeout(() => setError(false), 1800);
      }
    }, 500);
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div className="ys-topbar">
        <button className="ys-iconbtn" onClick={() => router.push('/login')} aria-label="Back">
          <Icon.arrowL width="20" height="20" />
        </button>
        <button className="ys-iconbtn" onClick={toggleLang}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{lang === 'en' ? 'EN' : '中'}</span>
        </button>
      </div>

      <div className="ys-content" style={{ paddingTop: 88, paddingBottom: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--fire)',
            display: 'grid', placeItems: 'center',
            margin: '0 auto',
            boxShadow: 'var(--shadow-glow)',
            color: '#fff',
          }}>
            <Icon.settings width="28" height="28" />
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 14 }}>{t.adminLogin}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 6 }}>{t.defaultHint}</div>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{t.username}</div>
            <input
              className="ys-input"
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }} />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{t.password}</div>
            <input
              className="ys-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.3em' }} />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,77,94,0.1)',
              border: '1px solid rgba(255,77,94,0.3)',
              color: 'var(--danger)',
              fontSize: 13, fontWeight: 600,
              textAlign: 'center',
              animation: 'shake 0.4s',
            }}>
              {t.invalidCreds}
            </div>
          )}

          <button type="submit"
                  className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg"
                  style={{ marginTop: 8 }}
                  disabled={loading}>
            {loading ? '...' : (
              <>
                <Icon.arrowR width="20" height="20" /> {t.signIn}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
