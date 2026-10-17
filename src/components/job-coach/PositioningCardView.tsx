import { RefreshCw } from 'lucide-react';
import type { PositioningCard } from '@/types/job-coach';
import { FIVE_WHYS_LABELS } from '@/types/job-coach';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  card: PositioningCard;
  onUnlock?: () => void;
  compact?: boolean;
}

export default function PositioningCardView({ card, onUnlock, compact }: Props) {
  if (compact) {
    return (
      <div className="rounded-2xl bg-white/80 border border-[#A8C6A1]/20 px-4 py-3 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-medium tracking-wide text-[#A8C6A1]">我的定位</span>
            <p className="text-sm font-medium text-[#2C3531] truncate">{card.narrative}</p>
            {card.personaLabel && (
              <p className="text-xs text-[#2C3531]/40">{card.personaLabel}</p>
            )}
          </div>
          <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
            <Badge className="bg-[#5B8FA8]/10 text-[#5B8FA8] border-none font-normal">
              {card.targetLevel}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="rounded-3xl bg-white border border-[#A8C6A1]/15 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-[#A8C6A1]/20 via-white to-[#5B8FA8]/10 px-6 py-5 border-b border-[#A8C6A1]/10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-medium tracking-wide text-[#A8C6A1]">我的定位</h2>
          {onUnlock && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onUnlock}
              className="text-[#2C3531]/50 hover:text-[#5B8FA8] gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              重新填写
            </Button>
          )}
        </div>
        {card.personaLabel && (
          <p className="mt-2 text-xs text-[#2C3531]/45">{card.personaLabel}</p>
        )}
        <p className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-[#2C3531] leading-snug">
          {card.narrative}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className="bg-[#5B8FA8] text-white border-none font-normal">
            {card.targetLevel}
          </Badge>
          <Badge className="bg-[#A8C6A1] text-white border-none font-normal">
            {card.targetDomain}
          </Badge>
        </div>
      </div>
      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <Block title="我想做什么" body={card.what} />
        <Block title="为什么现在" body={card.why} />
        <Block title="凭什么是我" body={card.how} />
      </div>
      <div className="px-6 pb-5 space-y-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-[#A8C6A1] mb-2">已验证的交付</p>
          <ul className="space-y-1.5 text-sm text-[#2C3531]/70">
            {card.provenDeliveries.filter(Boolean).map((d, i) => (
              <li key={i} className="pl-3 border-l-2 border-[#A8C6A1]/30">
                {d}
              </li>
            ))}
          </ul>
        </div>
        <Block title="一分钟介绍" body={card.elevatorPitch} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-[#A8C6A1] mb-2">五个为什么</p>
            <ul className="space-y-2 text-sm text-[#2C3531]/70">
              {(Object.keys(FIVE_WHYS_LABELS) as (keyof typeof FIVE_WHYS_LABELS)[]).map(
                (key) => (
                  <li key={key}>
                    <span className="text-[#2C3531]/40 text-xs block mb-0.5">
                      {FIVE_WHYS_LABELS[key]}
                    </span>
                    {card.fiveWhys[key] || '—'}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-[#5B8FA8] mb-2">两个去向</p>
            <ul className="space-y-2 text-sm text-[#2C3531]/70">
              <li className="pl-3 border-l-2 border-[#5B8FA8]/25">
                <span className="text-xs text-[#2C3531]/40 block mb-0.5">大约五年</span>
                {card.twoWheres.fiveYear || '—'}
              </li>
              <li className="pl-3 border-l-2 border-[#5B8FA8]/25">
                <span className="text-xs text-[#2C3531]/40 block mb-0.5">更长远</span>
                {card.twoWheres.longerArc || '—'}
              </li>
            </ul>
          </div>
        </div>
        <Block title="增长主线" body={card.growthMainline} />
      </div>
    </article>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium tracking-wide text-[#A8C6A1]">{title}</p>
      <p className="text-sm text-[#2C3531]/75 leading-relaxed whitespace-pre-wrap">{body || '—'}</p>
    </div>
  );
}
