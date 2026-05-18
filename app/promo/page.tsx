'use client';

import { useStore } from '@/lib/store';
import { useT } from '@/lib/useHydratedLang';
import { TopBar } from '@/components/ui/TopBar';
import { Icon } from '@/components/icons';
import type { Campaign, Lang } from '@/lib/types';
import type { Strings } from '@/lib/i18n';

export default function PromoPage() {
  const campaigns = useStore((s) => s.campaigns);
  const openSheet = useStore((s) => s.openSheet);
  const { t, lang } = useT();

  const active = campaigns.filter((c) => c.status === 'live');
  const past = campaigns.filter((c) => c.status === 'finished');

  return (
    <>
      <TopBar title={t.promoTitle} />
      <div className="ys-content ys-pad-top ys-pad-btm">
        <div style={{ marginTop: 14, marginBottom: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div className="display" style={{ fontSize: 34 }}>{t.promoTitle}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 2 }}>
              {campaigns.length} {lang === 'zh' ? '个活动' : 'campaigns'}
            </div>
          </div>
          <button className="ys-btn ys-btn-primary ys-btn-sm" onClick={() => openSheet('newCampaign')}>
            <Icon.plus width="16" height="16" /> {t.newCampaign}
          </button>
        </div>

        {active.length > 0 && (
          <>
            <div className="sect-row">
              <div className="sect-title">{t.activeCampaigns}</div>
              <span className="badge fire">●  LIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {active.map((c) => (
                <CampaignCard key={c.id} c={c} t={t} lang={lang} />
              ))}
            </div>
          </>
        )}

        {past.length > 0 && (
          <>
            <div className="sect-row">
              <div className="sect-title">{t.pastCampaigns}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {past.map((c) => (
                <CampaignCard key={c.id} c={c} t={t} lang={lang} muted />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function CampaignCard({ c, t, lang, muted = false }: { c: Campaign; t: Strings; lang: Lang; muted?: boolean }) {
  const openRate = c.recipients ? Math.round((c.opened / c.recipients) * 100) : 0;
  const isLive = c.status === 'live';
  return (
    <div className="ys-card" style={{
      cursor: 'pointer',
      opacity: muted ? 0.85 : 1,
      borderColor: isLive ? 'rgba(255,122,24,0.25)' : 'var(--line)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isLive && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', boxShadow: '0 0 8px var(--orange)' }} />}
            <span style={{ fontWeight: 700, fontSize: 15 }}>
              {lang === 'zh' ? c.titleZh : c.title}
            </span>
          </div>
          <div style={{
            fontSize: 12, color: 'var(--ink-muted)', marginTop: 6, lineHeight: 1.45,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {lang === 'zh' ? c.messageZh : c.message}
          </div>
        </div>
        {c.channel === 'whatsapp' && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(56,214,138,0.12)',
                        color: '#38d68a', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <Icon.whatsapp width="18" height="18" />
          </div>
        )}
        {c.channel === 'sms' && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--surface-2)',
                        color: 'var(--ink-muted)', display: 'grid', placeItems: 'center', flex: 'none', fontSize: 10, fontWeight: 700 }}>
            SMS
          </div>
        )}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
        marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)',
      }}>
        <CampStat label={t.recipients} value={c.recipients} />
        <CampStat label={t.opened} value={`${openRate}%`} sub={`${c.opened}`} />
        <CampStat label={lang === 'zh' ? '兑换' : 'Redeems'} value={c.redeemed} accent />
      </div>
    </div>
  );
}

function CampStat({ label, value, sub, accent = false }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
        {label}
      </div>
      <div className={`display-num ${accent ? 'fire-text' : ''}`} style={{ fontSize: 22, marginTop: 2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: 'var(--ink-dim)' }}>/{sub}</div>}
    </div>
  );
}
