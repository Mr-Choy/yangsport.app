'use client';

import { useEffect, useState } from 'react';
import { Sheet } from '../ui/Sheet';
import { Avatar } from '../ui/Avatar';
import { Label } from '../ui/KPI';
import { Icon } from '../icons';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import { formatPhone } from '@/lib/utils';
import { EQUIPMENT_PRESETS, TENSION_PRESETS } from '@/lib/seed';

export function RecordStringingSheet() {
  const open = useStore((s) => s.sheet === 'stringing');
  const close = useStore((s) => s.closeSheet);
  const customers = useStore((s) => s.customers);
  const stringingFor = useStore((s) => s.stringingFor);
  const recordStringing = useStore((s) => s.recordStringing);
  const { t } = useT();

  const customer = customers.find((c) => c.id === stringingFor) ?? null;
  const idx = customer ? customers.findIndex((c) => c.id === customer.id) : -1;

  const [racketBrand, setRacketBrand] = useState<string | null>(null);
  const [racketModel, setRacketModel] = useState('');
  const [stringBrand, setStringBrand] = useState<string | null>(null);
  const [stringModel, setStringModel] = useState('');
  const [tension, setTension] = useState(26);
  const [customTension, setCustomTension] = useState(false);
  const [serviceDate, setServiceDate] = useState<'today' | 'yesterday'>('today');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setRacketBrand(null); setRacketModel('');
      setStringBrand(null); setStringModel('');
      setTension(26); setCustomTension(false);
      setServiceDate('today'); setNote(''); setDone(false);
    }
  }, [open]);

  const racketBrands = EQUIPMENT_PRESETS.racket_brand;
  const stringBrands = EQUIPMENT_PRESETS.string_brand;
  const racketModels = racketBrand
    ? racketBrands.find((b) => b.name === racketBrand)?.models || []
    : [];
  const stringModels = stringBrand
    ? stringBrands.find((b) => b.name === stringBrand)?.models || []
    : [];

  const canSave = !!(racketBrand && racketModel && stringBrand && stringModel && tension);

  const handleSave = () => {
    if (!canSave || !customer) return;
    setDone(true);
    setTimeout(() => {
      recordStringing(customer.id, {
        racketBrand: racketBrand!, racketModel,
        stringBrand: stringBrand!, stringModel,
        tension, note,
        daysAgo: serviceDate === 'today' ? 0 : 1,
      });
      close();
    }, 1100);
  };

  if (!customer) return null;

  return (
    <Sheet open={open} onClose={close} title={t.stringingService} fullHeight>
      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            margin: '0 auto', display: 'grid', placeItems: 'center',
            background: 'var(--fire)',
            boxShadow: 'var(--shadow-glow)',
            animation: 'stamp-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            color: '#fff',
          }}>
            <Icon.racket width="44" height="44" />
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 18, color: 'var(--ink)' }}>
            {t.stringingSaved}
          </div>
          <div style={{ marginTop: 8, color: 'var(--ink-muted)', fontSize: 13 }}>
            {racketBrand} {racketModel} · {stringModel} @ <span className="fire-text" style={{ fontWeight: 700 }}>{tension} {t.lbsUnit}</span>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Avatar name={customer.name} idx={idx} size={40} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{customer.name}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                {formatPhone(customer.phone)}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label>{t.serviceDate}</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setServiceDate('today')}
                      className="ys-btn ys-btn-sm"
                      style={{
                        flex: 1, background: serviceDate === 'today' ? 'var(--fire)' : 'var(--surface)',
                        color: serviceDate === 'today' ? '#fff' : 'var(--ink-2)',
                        border: serviceDate === 'today' ? '0' : '1px solid var(--line)',
                        height: 44,
                      }}>
                {t.today2}
              </button>
              <button onClick={() => setServiceDate('yesterday')}
                      className="ys-btn ys-btn-sm"
                      style={{
                        flex: 1, background: serviceDate === 'yesterday' ? 'var(--fire)' : 'var(--surface)',
                        color: serviceDate === 'yesterday' ? '#fff' : 'var(--ink-2)',
                        border: serviceDate === 'yesterday' ? '0' : '1px solid var(--line)',
                        height: 44,
                      }}>
                {t.yesterday}
              </button>
              <button className="ys-btn ys-btn-sm ys-btn-ghost" style={{ flex: 1, height: 44 }}>
                <Icon.edit width="14" height="14" /> {t.custom}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Label>{t.racketBrand}</Label>
            <div className="ys-chips" style={{ gap: 8 }}>
              {racketBrands.map((b) => (
                <button key={b.name} onClick={() => { setRacketBrand(b.name); setRacketModel(''); }}
                        className={`eq-card ${racketBrand === b.name ? 'is-active' : ''}`}
                        style={{ minWidth: 76 }}>
                  <Icon.racket width="20" height="20" />
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {racketBrand && (
            <div style={{ marginBottom: 16 }}>
              <Label>{t.racketModel}</Label>
              <div className="ys-chips" style={{ gap: 8 }}>
                {racketModels.map((m) => (
                  <button key={m} onClick={() => setRacketModel(m)}
                          className={`ys-chip ${racketModel === m ? 'is-active' : ''}`}
                          style={{ fontWeight: 600 }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <Label>{t.stringBrand}</Label>
            <div className="ys-chips" style={{ gap: 8 }}>
              {stringBrands.map((b) => (
                <button key={b.name} onClick={() => { setStringBrand(b.name); setStringModel(''); }}
                        className={`eq-card ${stringBrand === b.name ? 'is-active' : ''}`}
                        style={{ minWidth: 76 }}>
                  <Icon.string width="20" height="20" />
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {stringBrand && (
            <div style={{ marginBottom: 16 }}>
              <Label>{t.stringModel}</Label>
              <div className="ys-chips" style={{ gap: 8 }}>
                {stringModels.map((m) => (
                  <button key={m} onClick={() => setStringModel(m)}
                          className={`ys-chip ${stringModel === m ? 'is-active' : ''}`}
                          style={{ fontWeight: 600 }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <Label>{t.tension}</Label>
            <div className="tens-grid">
              {TENSION_PRESETS.map((v) => (
                <button key={v} onClick={() => { setTension(v); setCustomTension(false); }}
                        className={`tens-chip ${tension === v && !customTension ? 'is-active' : ''}`}>
                  {v}
                  <span className="tens-chip-unit">{t.lbsUnit}</span>
                </button>
              ))}
              <button onClick={() => setCustomTension(true)}
                      className={`tens-chip ${customTension ? 'is-active' : ''}`}
                      style={{ padding: 4 }}>
                {customTension ? (
                  <input
                    type="number"
                    autoFocus
                    value={tension}
                    onChange={(e) => setTension(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%', background: 'transparent', border: 0,
                      color: 'inherit', textAlign: 'center',
                      fontFamily: 'inherit', fontWeight: 'inherit',
                      fontStyle: 'inherit', fontSize: 20, outline: 'none',
                    }}
                  />
                ) : (
                  <>
                    <Icon.edit width="16" height="16" />
                    <span className="tens-chip-unit" style={{ marginTop: 4 }}>{t.custom}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <Label>{t.note}</Label>
            <input className="ys-input"
                   placeholder={t.optionalNote}
                   value={note} onChange={(e) => setNote(e.target.value)}
                   style={{ fontFamily: 'var(--font-hanken), Hanken Grotesk, sans-serif' }} />
          </div>

          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg"
                  disabled={!canSave}
                  onClick={handleSave}>
            <Icon.check width="22" height="22" /> {t.saveStringing}
          </button>
        </>
      )}
    </Sheet>
  );
}
