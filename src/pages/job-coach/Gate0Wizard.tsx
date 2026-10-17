import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
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
  TINA_CURRENT_COMP,
  TINA_TARGET_COMP,
} from '@/lib/job-coach';
import { FIVE_WHYS_LABELS, type FiveWhys } from '@/types/job-coach';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'what', title: '我想做什么', hint: '目标职级和赛道，例如：电子银行外汇产品经理' },
  { id: 'why', title: '为什么现在', hint: '为什么换工作、为什么这类公司' },
  { id: 'how', title: '凭什么是我', hint: '一条增长主线 + 两到三条已验证的交付' },
  { id: 'pitch', title: '一分钟介绍', hint: '大约 60 秒讲清：我是谁、做成过什么、为什么现在合适' },
  { id: 'whys', title: '五个为什么', hint: '行业、雇主类型、城市、为什么是我、缺口如何补' },
  { id: 'wheres', title: '两个去向', hint: '大约五年，以及更长远一点的方向' },
  { id: 'mainline', title: '增长主线', hint: '用一句话命名，后面简历和面试都围着它讲' },
  { id: 'lock', title: '保存定位', hint: '保存后，选机会、准备面试都会沿用这份定位' },
] as const;

export default function Gate0Wizard() {
  const { positioning, lockPositioning, resetPositioning } = useJobCoach();
  const [step, setStep] = useState(0);
  const [targetLevel, setTargetLevel] = useState('电子银行 · 外汇产品经理');
  const [targetDomain, setTargetDomain] = useState('香港外资银行 · 外汇/跨境支付');
  const [what, setWhat] = useState('');
  const [why, setWhy] = useState('');
  const [how, setHow] = useState('');
  const [provenDeliveries, setProvenDeliveries] = useState(['', '', '']);
  const [elevatorPitch, setElevatorPitch] = useState('');
  const [fiveWhys, setFiveWhys] = useState<FiveWhys>(emptyFiveWhys());
  const [twoWheres, setTwoWheres] = useState(emptyTwoWheres());
  const [growthMainline, setGrowthMainline] = useState('');
  const [personaLabel, setPersonaLabel] = useState('Tina（示例）· 32 岁');

  const pitchSeconds = estimatePitchSeconds(elevatorPitch);
  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext = useMemo(() => {
    switch (STEPS[step].id) {
      case 'what':
        return what.trim().length > 4 && targetLevel.trim() && targetDomain.trim();
      case 'why':
        return why.trim().length > 4;
      case 'how':
        return how.trim().length > 4 && provenDeliveries.filter((d) => d.trim()).length >= 2;
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
      personaLabel: personaLabel.trim() || undefined,
    });
  };

  if (positioning) {
    return (
      <div className="space-y-8 animate-fade-in">
        <PageIntro
          eyebrow="第一步 · 定位"
          title="定位已保存"
          desc="后面选机会、准备面试时都会按这份定位来。薪资意向变化时，建议回来改一版。"
        />
        <div className="rounded-2xl bg-white border border-[#A8C6A1]/15 px-4 py-3 text-sm text-[#2C3531]/60 space-y-1">
          <p>{TINA_CURRENT_COMP}</p>
          <p>{TINA_TARGET_COMP}</p>
        </div>
        <PositioningCardView
          card={positioning}
          onUnlock={() => {
            resetPositioning();
            setStep(0);
          }}
        />
        <div className="flex flex-wrap gap-3 items-center">
          <Button
            asChild
            className="bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white rounded-full px-6 gap-2"
          >
            <Link to="/job-coach/board">
              下一步：看机会 <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <p className="text-xs text-[#2C3531]/40">接下来可以去看机会、准备面试</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageIntro
        eyebrow="第一步 · 定位"
        title="先想清楚自己要什么"
        desc="写清目标、动机、方法和一分钟介绍。没写完之前，机会列表里不能标「投」。"
      />

      <div className="rounded-2xl bg-[#5B8FA8]/5 border border-[#5B8FA8]/15 px-4 py-3 text-sm text-[#5B8FA8]">
        完成定位前，机会最多只能「观望」。
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#2C3531]/45">
          <span>
            {step + 1} / {STEPS.length} · {STEPS[step].title}
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
            <Field label="怎么称呼这份示例（可选）">
              <Input
                value={personaLabel}
                onChange={(e) => setPersonaLabel(e.target.value)}
                className="rounded-xl bg-[#F7F9F6] border-none"
              />
            </Field>
            <Field label="目标职级">
              <Input
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="rounded-xl bg-[#F7F9F6] border-none"
              />
            </Field>
            <Field label="目标赛道">
              <Input
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="例如：香港外资银行 · 外汇"
                className="rounded-xl bg-[#F7F9F6] border-none"
              />
            </Field>
            <Field label="一句话目标">
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
          <Field label="为什么现在换 / 为什么这类公司">
            <Textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              rows={5}
              className="rounded-xl bg-[#F7F9F6] border-none resize-none"
            />
          </Field>
        )}

        {STEPS[step].id === 'how' && (
          <div className="space-y-4">
            <Field label="凭什么是我（概述）">
              <Textarea
                value={how}
                onChange={(e) => setHow(e.target.value)}
                rows={3}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <div className="space-y-2">
              <Label className="text-[#2C3531]/70">已验证的交付（至少 2 条）</Label>
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
            <Field label={`一分钟介绍（约 ${ELEVATOR_PITCH_MAX_CHARS} 字内）`}>
              <Textarea
                value={elevatorPitch}
                onChange={(e) =>
                  setElevatorPitch(e.target.value.slice(0, ELEVATOR_PITCH_MAX_CHARS))
                }
                rows={6}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <p
              className={cn(
                'text-xs',
                pitchSeconds > 60 ? 'text-amber-600' : 'text-[#2C3531]/40',
              )}
            >
              {elevatorPitch.length}/{ELEVATOR_PITCH_MAX_CHARS} 字 · 大约 {pitchSeconds} 秒
              {pitchSeconds > 60 ? '（可以再短一点）' : ''}
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
            <Field label="大约五年">
              <Textarea
                value={twoWheres.fiveYear}
                onChange={(e) => setTwoWheres({ ...twoWheres, fiveYear: e.target.value })}
                rows={3}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <Field label="更长远">
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
          <Field label="增长主线（一句话）">
            <Input
              value={growthMainline}
              onChange={(e) => setGrowthMainline(e.target.value)}
              placeholder="例如：电子银行外汇 · 可持续交易量与份额"
              className="rounded-xl bg-[#F7F9F6] border-none"
            />
          </Field>
        )}

        {STEPS[step].id === 'lock' && (
          <div className="rounded-2xl bg-[#F7F9F6] border border-[#A8C6A1]/20 p-5 space-y-3">
            <p className="text-sm text-[#2C3531]/70 leading-relaxed">
              即将保存：
              <span className="font-medium text-[#2C3531]">
                {' '}
                {targetLevel} · {targetDomain}｜主线：{growthMainline || '—'}
              </span>
            </p>
            <p className="text-xs text-[#2C3531]/40">保存后才可以在机会里标「投」。</p>
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
              <Check className="w-4 h-4" /> 保存定位
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
