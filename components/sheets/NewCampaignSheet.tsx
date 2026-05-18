'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { Sheet } from '../ui/Sheet';
import { Label } from '../ui/KPI';
import { Icon } from '../icons';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import type { Audience, Channel } from '@/lib/types';

export function NewCampaignSheet() {
  const open = useStore((s) => s.sheet === 'newCampaign');
  const close = useStore((s) => s.closeSheet);
  const customers = useStore((s) => s.customers);
  const sendCampaign = useStore((s) => s.sendCampaign);
  const { t, lang } = useT();

  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [audience, setAudience] = useState<Audience>('all');
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [step, setStep] = useState<'compose' | 'sending' | 'sent'>('compose');

  useEffect(() => {
    if (!open) {
      setTitle(''); setMsg(''); setAudience('all'); setChannel('whatsapp'); setStep('compose');
    }
  }, [open]);

  const audienceCounts: Record<Audience, number> = {
    all: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    inactive: customers.filter((c) => c.status === 'inactive').length,
    ready: customers.filter((c) => c.stamps >= 3).length,
  };
  const recipients = audienceCounts[audience];

  const audienceOpts: { id: Audience; label: string }[] = [
    { id: 'all',      label: t.audienceAll },
    { id: 'active',   label: t.audienceActive },
    { id: 'inactive', label: t.audienceInactive },
    { id: 'ready',    label: t.audienceReady },
  ];

  const handleSend = () => {
    setStep('sending');
    setTimeout(() => setStep('sent'), 900);
    setTimeout(() => {
      sendCampaign({
        title: title || (lang === 'zh' ? '新活动' : 'New campaign'),
        titleZh: title || '新活动',
        message: msg,
        messageZh: msg,
        audience, channel, recipients,
      });
      close();
    }, 2200);
  };

  return (
    <Sheet open={open} onClose={close} title={t.newCampaign} fullHeight>
      {step === 'sent' ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            margin: '0 auto', display: 'grid', placeItems: 'center',
            background: 'var(--fire)',
            boxShadow: 'var(--shadow-glow)',
            animation: 'stamp-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <Icon.send width="40" height="40" color="#fff" />
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 18, color: 'var(--ink)' }}>
            {lang === 'zh' ? '已送达！' : 'SENT!'}
          </div>
          <div style={{ marginTop: 6, color: 'var(--ink-muted)', fontSize: 13 }}>
            {recipients} {t.recipients}
          </div>
        </div>
      ) : step === 'sending' ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="display fire-text" style={{ fontSize: 22 }}>
            {lang === 'zh' ? '发送中…' : 'BROADCASTING…'}
          </div>
          <div style={{ marginTop: 12, color: 'var(--ink-muted)', fontSize: 12 }}>
            {recipients} {t.recipients}
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 14 }}>
            <Label>{t.campaignTitle}</Label>
            <input className="ys-input" placeholder={lang === 'zh' ? '例如：周末加倍' : 'e.g. Weekend bonus'}
                   value={title} onChange={(e) => setTitle(e.target.value)}
                   style={{ fontFamily: 'var(--font-hanken), Hanken Grotesk, sans-serif' }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <Label>{t.campaignMessage}</Label>
            <textarea className="ys-textarea" rows={3}
                      placeholder={lang === 'zh' ? '写一条让客户回来的消息…' : 'Write a message that brings them back…'}
                      value={msg} onChange={(e) => setMsg(e.target.value)} />
            <div style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 4, textAlign: 'right' }}>
              {msg.length} / 160
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <Label>{t.audience}</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {audienceOpts.map((o) => (
                <button key={o.id}
                        className="ys-card-tight"
                        style={{
                          textAlign: 'left',
                          border: `2px solid ${audience === o.id ? 'var(--orange)' : 'var(--line)'}`,
                          background: 'var(--surface)',
                          cursor: 'pointer',
                          color: 'inherit',
                        }}
                        onClick={() => setAudience(o.id)}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{o.label}</div>
                  <div className="display-num" style={{ fontSize: 22, marginTop: 4, color: audience === o.id ? 'var(--orange)' : 'var(--ink)' }}>
                    {audienceCounts[o.id]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <Label>{t.channel}</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              <ChannelBtn icon={<Icon.whatsapp width="18" height="18" />}
                          label="WhatsApp"
                          active={channel === 'whatsapp'}
                          onClick={() => setChannel('whatsapp')} />
              <ChannelBtn label="SMS"
                          active={channel === 'sms'}
                          onClick={() => setChannel('sms')} />
              <ChannelBtn icon={<Icon.bell width="18" height="18" />}
                          label="Push"
                          active={channel === 'push'}
                          onClick={() => setChannel('push')} />
            </div>
          </div>

          <button className="ys-btn ys-btn-primary ys-btn-block ys-btn-lg"
                  onClick={handleSend}
                  disabled={!msg.trim()}>
            <Icon.send width="20" height="20" /> {t.sendNow}
            <span style={{ opacity: 0.8, fontWeight: 600, fontStyle: 'normal', fontSize: 13 }}>· {recipients}</span>
          </button>
        </>
      )}
    </Sheet>
  );
}

function ChannelBtn({ icon, label, active, onClick }: {
  icon?: ReactNode; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
            className="ys-card-tight"
            style={{
              flex: 1,
              border: `2px solid ${active ? 'var(--orange)' : 'var(--line)'}`,
              background: 'var(--surface)',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '10px 6px',
            }}>
      {icon && <div style={{ color: active ? 'var(--orange)' : 'var(--ink-2)' }}>{icon}</div>}
      <div style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--orange)' : 'var(--ink)' }}>{label}</div>
    </button>
  );
}
