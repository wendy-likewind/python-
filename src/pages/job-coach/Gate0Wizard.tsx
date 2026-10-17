import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, ShieldAlert } from 'lucide-react';
import { useJobCoach } from '@/contexts/JobCoachContext';
import PositioningCardView from '@/components/job-coach/PositioningCardView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  ELEVATOR_PITCH_MAX_CHARS,
  emptyFiveWhys,
  emptyTwoWheres,
  estimatePitchSeconds,
} from '@/lib/job-coach';
import { FIVE_WHYS_LABELS, type FiveWhys } from '@/types/job-coach';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    id: 'what',
    title: '1 · WHAT',
    hint: '目标职级 + 赛道/领域（示意赛道即可；勿把真实雇主名写进可分享卡）',
  },
  {
    id: 'why',
    title: '2 · WHY',
    hint: '为什么现在动；为什么这类雇主家庭（一句正向动机）',
  },
  {
    id: 'how',
    title: '3 · HOW',
    hint: '为什么是我：1 条增长主线 + 2–3 个已验证交付',
  },
  {
    id: 'pitch',
    title: '4 · 电梯演讲',
    hint: '≤60s：who / what shipped / why care now',
  },
  {
    id: 'whys',
    title: '5 · 5 Whys',
    hint: 'Industry · Company family · Location · Why me · Why not me（缺口已缓解）',
  },
  {
    id: 'wheres',
    title: '6 · 2 Wheres',
    hint: '~5 年与更长弧，需与目标角色一致',
  },
  {
    id: 'mainline',
    title: '7 · 增长主线命名',
    hint: '例：“durable FX/remittance volume & share”；简历与面试锁此主线',
  },
  {
    id: 'lock',
    title: '锁定定位卡',
    hint: '任一项缺失或自相矛盾则硬停 — 不可输出投短名单',
  },
] as const;

export default function Gate0Wizard() {
  const { positioning, lockPositioning, resetPositioning } = useJobCoach();
  const [step, setStep] = useState(0);
  const [targetLevel, setTargetLevel] = useState('高级产品经理（示意）');
  const [targetDomain, setTargetDomain] = useState('港 fintech · 跨境支付（示意赛道）');
  const [what, setWhat] = useState('');
  const [why, setWhy] = useState('');
  const [how, setHow] = useState('');
  const [provenDeliveries, setProvenDeliveries] = useState(['', '', '']);
  const [elevatorPitch, setElevatorPitch] = useState('');
  const [fiveWhys, setFiveWhys] = useState<FiveWhys>(emptyFiveWhys());
  const [twoWheres, setTwoWheres] = useState(emptyTwoWheres());
  const [growthMainline, setGrowthMainline] = useState('');

  const pitchSeconds = estimatePitchSeconds(elevatorPitch);
  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext = useMemo(() => {
    switch (STEPS[step].id) {
      case 'what':
        return what.trim().length > 4 && targetLevel.trim() && targetDomain.trim();
      case 'why':
        return why.trim().length > 4;
      case 'how':
        return (
          how.trim().length > 4 &&
          provenDeliveries.filter((d) => d.trim()).length >= 2
        );
      case 'pitch':
        return (
          elevatorPitch.trim().length > 10 && elevatorPitch.length <= ELEVATOR_PITCH_MAX_CHARS
        );
      case 'whys':
        return (Object.values(fiveWhys) as string[]).every((v) => v.trim());
      case 'wheres':
        return twoWheres.fiveYear.trim() && twoWheres.longerArc.trim();
      case 'mainline':
        return growthMainline.trim().length > 2;
      case 'lock':
        return true;
      default:
        return false;
    }
  }, [
    step,
    what,
    why,
    how,
    provenDeliveries,
    elevatorPitch,
    fiveWhys,
    twoWheres,
    growthMainline,
    targetLevel,
    targetDomain,
  ]);

  const handleLock = () => {
    lockPositioning({
      what: what.trim(),
      targetLevel: targetLevel.trim(),
      targetDomain: targetDomain.trim(),
      why: why.trim(),
      how: how.trim(),
      provenDeliveries: provenDeliveries.map((d) => d.trim()).filter(Boolean),
      elevatorPitch: elevatorPitch.trim(),
      fiveWhys: {
        industry: fiveWhys.industry.trim(),
        companyFamily: fiveWhys.companyFamily.trim(),
        location: fiveWhys.location.trim(),
        whyMe: fiveWhys.whyMe.trim(),
        whyNotMe: fiveWhys.whyNotMe.trim(),
      },
      twoWheres: {
        fiveYear: twoWheres.fiveYear.trim(),
        longerArc: twoWheres.longerArc.trim(),
      },
      growthMainline: growthMainline.trim(),
    });
  };

  if (positioning) {
    return (
      <div className="space-y-8 animate-fade-in">
        <PageIntro
          eyebrow="Gate0 · 投递前反思 · 已通过"
          title="定位卡已硬锁定"
          desc="筛岗标「投」、面试文档开场与增长主线简历都必须只读沿用此卡。意图/薪资/关键词变化时需重新完成 Gate0。"
        />
        <PositioningCardView
          card={positioning}
          onUnlock={() => {
            resetPositioning();
            setStep(0);
          }}
        />
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white rounded-full px-6 gap-2"
          >
            <Link to="/job-coach/board">
              进入 Gate1 筛岗 <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <LockedNextHint />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageIntro
        eyebrow="Gate0 · 投递前反思（硬门禁）"
        title="先写完反思表，再谈短名单"
        desc="来自「港fintech求职工作方法论」：WHAT / WHY / HOW、电梯演讲、5 Whys + 2 Wheres、增长主线命名。缺一或自相矛盾则硬停，不输出投短名单。"
      />

      <div className="flex items-start gap-2 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800 leading-relaxed">
          硬门禁：定位卡未锁定前，看板最多「观望」，不可标「投」。不代投、不代私信。
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#2C3531]/45">
          <span>
            步骤 {step + 1} / {STEPS.length} · {STEPS[step].title}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-[#A8C6A1]/15 [&>div]:bg-[#A8C6A1]" />
      </div>

      <div className="rounded-3xl bg-white/80 border border-[#A8C6A1]/15 shadow-sm p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">{STEPS[step].title}</h2>
          <p className="text-sm text-[#2C3531]/50">{STEPS[step].hint}</p>
        </div>

        {STEPS[step].id === 'what' && (
          <div className="space-y-4">
            <Field label="目标职级">
              <Input
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="rounded-xl bg-[#F7F9F6] border-none"
              />
            </Field>
            <Field label="目标领域 / 雇主家庭">
              <Input
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="例：港 fintech · 跨境支付 PM（示意赛道，勿填真实雇主名）"
                className="rounded-xl bg-[#F7F9F6] border-none"
              />
            </Field>
            <Field label="WHAT — 一句话目标">
              <Textarea
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                rows={3}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
          </div>
        )}

        {STEPS[step].id === 'why' && (
          <Field label="WHY — 为什么现在 / 为什么这类雇主">
            <Textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              rows={5}
              placeholder="一句正向动机即可，勿编造雇主内部信息"
              className="rounded-xl bg-[#F7F9F6] border-none resize-none"
            />
          </Field>
        )}

        {STEPS[step].id === 'how' && (
          <div className="space-y-4">
            <Field label="HOW — 为什么是我（概述）">
              <Textarea
                value={how}
                onChange={(e) => setHow(e.target.value)}
                rows={3}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <div className="space-y-2">
              <Label className="text-[#2C3531]/70">已验证交付（至少 2 条，最多 3）</Label>
              {provenDeliveries.map((d, i) => (
                <Input
                  key={i}
                  value={d}
                  onChange={(e) => {
                    const next = [...provenDeliveries];
                    next[i] = e.target.value;
                    setProvenDeliveries(next);
                  }}
                  placeholder={`交付 ${i + 1}`}
                  className="rounded-xl bg-[#F7F9F6] border-none"
                />
              ))}
            </div>
          </div>
        )}

        {STEPS[step].id === 'pitch' && (
          <div className="space-y-3">
            <Field label={`电梯演讲（≤ ${ELEVATOR_PITCH_MAX_CHARS} 字 · 约 60 秒）`}>
              <Textarea
                value={elevatorPitch}
                onChange={(e) =>
                  setElevatorPitch(e.target.value.slice(0, ELEVATOR_PITCH_MAX_CHARS))
                }
                rows={6}
                placeholder="who / what shipped / why care now"
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <p
              className={cn(
                'text-xs',
                pitchSeconds > 60 ? 'text-amber-600' : 'text-[#2C3531]/40',
              )}
            >
              {elevatorPitch.length}/{ELEVATOR_PITCH_MAX_CHARS} 字 · 估时约 {pitchSeconds} 秒
              {pitchSeconds > 60 ? '（建议再压缩）' : ''}
            </p>
          </div>
        )}

        {STEPS[step].id === 'whys' && (
          <div className="space-y-3">
            {(Object.keys(FIVE_WHYS_LABELS) as (keyof FiveWhys)[]).map((key) => (
              <Field key={key} label={FIVE_WHYS_LABELS[key]}>
                <Textarea
                  value={fiveWhys[key]}
                  onChange={(e) => setFiveWhys({ ...fiveWhys, [key]: e.target.value })}
                  rows={2}
                  className="rounded-xl bg-[#F7F9F6] border-none resize-none"
                />
              </Field>
            ))}
          </div>
        )}

        {STEPS[step].id === 'wheres' && (
          <div className="space-y-4">
            <Field label="Where · 约 5 年">
              <Textarea
                value={twoWheres.fiveYear}
                onChange={(e) => setTwoWheres({ ...twoWheres, fiveYear: e.target.value })}
                rows={3}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <Field label="Where · 更长弧">
              <Textarea
                value={twoWheres.longerArc}
                onChange={(e) => setTwoWheres({ ...twoWheres, longerArc: e.target.value })}
                rows={3}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
          </div>
        )}

        {STEPS[step].id === 'mainline' && (
          <Field label="增长主线命名（简历 + 面试锁此句）">
            <Input
              value={growthMainline}
              onChange={(e) => setGrowthMainline(e.target.value)}
              placeholder='例：durable FX/remittance volume & share'
              className="rounded-xl bg-[#F7F9F6] border-none"
            />
          </Field>
        )}

        {STEPS[step].id === 'lock' && (
          <div className="rounded-2xl bg-[#F7F9F6] border border-[#A8C6A1]/20 p-5 space-y-3">
            <p className="text-sm text-[#2C3531]/70 leading-relaxed">
              即将锁定：
              <span className="font-medium text-[#2C3531]">
                {' '}
                {targetLevel} · {targetDomain}｜主线：{growthMainline || '—'}
              </span>
            </p>
            <p className="text-xs text-[#2C3531]/40">
              锁定后 Gate1 才允许「投」。Gate2 增长主线简历 / Gate6 谈薪在 V1 标为下一步。
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="gap-1.5 text-[#2C3531]/50"
          >
            <ArrowLeft className="w-4 h-4" /> 上一步
          </Button>
          {STEPS[step].id === 'lock' ? (
            <Button
              type="button"
              disabled={!canNext}
              onClick={handleLock}
              className="bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white rounded-full px-6 gap-2"
            >
              <Check className="w-4 h-4" /> 锁定定位卡
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canNext}
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="bg-[#5B8FA8] hover:bg-[#5B8FA8]/90 text-white rounded-full px-6 gap-2"
            >
              下一步 <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function LockedNextHint() {
  return (
    <div className="text-xs text-[#2C3531]/40 self-center px-2">
      Gate2 增长主线简历 · Gate6 谈薪 → V1 锁定为下一步
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-[#A8C6A1]">{eyebrow}</p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="text-base text-[#2C3531]/55 max-w-2xl leading-relaxed">{desc}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[#2C3531]/70">{label}</Label>
      {children}
    </div>
  );
}
