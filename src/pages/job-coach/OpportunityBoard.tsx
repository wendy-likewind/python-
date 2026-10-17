import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  MapPin,
  Plus,
  Mic2,
  Eye,
  X,
  Send,
  AlertTriangle,
  ShieldAlert,
  FileText,
  Banknote,
} from 'lucide-react';
import { useJobCoach } from '@/contexts/JobCoachContext';
import PositioningCardView from '@/components/job-coach/PositioningCardView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { shortlistCount, SHORTLIST_MAX, SHORTLIST_MIN } from '@/lib/job-coach';
import {
  CASE_STATUS_LABELS,
  COMPANY_TYPE_LABELS,
  DECISION_LABELS,
  MARKET_LABELS,
  type CompanyType,
  type JobDecision,
  type MarketLocation,
  type Opportunity,
  type OpportunityScore,
} from '@/types/job-coach';
import { cn } from '@/lib/utils';

const ALL_MARKETS: MarketLocation[] = ['HK', 'SG', 'SZ'];

export default function OpportunityBoard() {
  const {
    positioning,
    gate0Passed,
    opportunities,
    setDecision,
    addOpportunity,
    ensureInterview,
  } = useJobCoach();

  const [markets, setMarkets] = useState<MarketLocation[]>([...ALL_MARKETS]);
  const [decisionFilter, setDecisionFilter] = useState<'all' | JobDecision>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (!markets.includes(o.location)) return false;
      if (decisionFilter !== 'all' && o.decision !== decisionFilter) return false;
      return true;
    });
  }, [opportunities, markets, decisionFilter]);

  const shortlisted = shortlistCount(opportunities);
  const applyCount = opportunities.filter((o) => o.decision === 'apply').length;

  const toggleMarket = (m: MarketLocation) => {
    setMarkets((prev) => {
      if (prev.includes(m)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== m);
      }
      return [...prev, m];
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-widest uppercase text-[#A8C6A1]">
          Gate1 · 香港 fintech-PM 筛岗
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">机会短名单</h1>
            <p className="text-base text-[#2C3531]/55 max-w-xl leading-relaxed">
              评分卡后裁决 投 / 观望 / 不投。Gate0 未过不可投。V1 人工粘贴 JD，不自动抓取、不代投。
            </p>
          </div>
          <AddJobDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={(data) => {
              const created = addOpportunity(data);
              if (created) setDialogOpen(false);
            }}
          />
        </div>
      </div>

      {positioning ? (
        <PositioningCardView card={positioning} compact />
      ) : (
        <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              Gate0 硬门禁未过：不可标「投」，仅可浏览/观望。请先完成投递前反思。
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-[#5B8FA8] hover:bg-[#5B8FA8]/90 text-white shrink-0"
          >
            <Link to="/job-coach/gate0">去 Gate0</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <LockedGateCard
          icon={FileText}
          title="Gate2 · 增长主线简历"
          body="V1 锁定为下一步。投递包离开前需主线优先 + 绝对指标；此处仅提示。"
        />
        <LockedGateCard
          icon={Banknote}
          title="Gate6 · 谈薪 / 薪资对照"
          body="港新深公开薪资对照默认 HK-only；三角（港+新+深）需显式打开。V1 不建谈判流。"
        />
      </div>

      <div className="rounded-2xl bg-white border border-[#A8C6A1]/15 px-4 py-3 space-y-2">
        <p className="text-xs font-medium tracking-wide uppercase text-[#A8C6A1]">
          投递前 checklist（短名单交付时）
        </p>
        <ul className="text-sm text-[#2C3531]/60 space-y-1">
          <li>· 定位卡仍有效？{gate0Passed ? '是' : '否 — 硬停'}</li>
          <li>· 该岗是否需要先跑 Gate2 增长主线简历？（V1：下一步）</li>
          <li>· 公开薪资带是否已对照期望？（不明则标「薪资不明」）</li>
          <li>
            · 进度记「已投」由你回填 — 助手不自动投递 · 当前投 {applyCount} / 短名单{' '}
            {shortlisted}
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {ALL_MARKETS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMarket(m)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all',
                markets.includes(m)
                  ? 'bg-[#A8C6A1] text-white'
                  : 'bg-white text-[#2C3531]/45 border border-[#A8C6A1]/15',
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              {MARKET_LABELS[m]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={decisionFilter}
            onValueChange={(v) => setDecisionFilter(v as 'all' | JobDecision)}
          >
            <SelectTrigger className="w-[130px] rounded-full bg-white border-[#A8C6A1]/20">
              <SelectValue placeholder="裁决" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部裁决</SelectItem>
              <SelectItem value="pending">待定</SelectItem>
              <SelectItem value="apply">投</SelectItem>
              <SelectItem value="watch">观望</SelectItem>
              <SelectItem value="reject">不投</SelectItem>
            </SelectContent>
          </Select>
          <span
            className={cn(
              'text-xs px-3 py-1.5 rounded-full',
              shortlisted >= SHORTLIST_MIN && shortlisted <= SHORTLIST_MAX
                ? 'bg-[#A8C6A1]/15 text-[#2C3531]'
                : 'bg-amber-50 text-amber-700',
            )}
          >
            短名单 {shortlisted}/{SHORTLIST_MAX}
            {shortlisted < SHORTLIST_MIN ? ` · 建议 ≥${SHORTLIST_MIN}` : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            gate0Passed={gate0Passed}
            growthMainline={positioning?.growthMainline}
            onDecision={(d) => setDecision(job.id, d)}
            onOpenInterview={() => ensureInterview(job.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl bg-white/60 border border-[#A8C6A1]/15 px-6 py-12 text-center text-sm text-[#2C3531]/45">
            当前筛选下暂无岗位。可粘贴 JD 新增，或放宽地点/裁决过滤。
          </div>
        )}
      </div>
    </div>
  );
}

function LockedGateCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof FileText;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#2C3531]/15 bg-white/50 px-4 py-3 space-y-1">
      <div className="flex items-center gap-2 text-[#2C3531]/40">
        <Icon className="w-3.5 h-3.5" />
        <p className="text-xs font-medium">{title} · 下一步</p>
      </div>
      <p className="text-xs text-[#2C3531]/45 leading-relaxed">{body}</p>
    </div>
  );
}

function JobCard({
  job,
  gate0Passed,
  growthMainline,
  onDecision,
  onOpenInterview,
}: {
  job: Opportunity;
  gate0Passed: boolean;
  growthMainline?: string;
  onDecision: (d: JobDecision) => void;
  onOpenInterview: () => void;
}) {
  return (
    <article className="rounded-3xl bg-white border border-[#A8C6A1]/15 shadow-sm p-5 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">{job.title}</h2>
            {job.isIllustrative && (
              <Badge className="bg-amber-50 text-amber-700 border-none font-normal text-[11px]">
                示意数据
              </Badge>
            )}
            <Badge className="bg-[#5B8FA8]/10 text-[#5B8FA8] border-none font-normal">
              {MARKET_LABELS[job.location]}
            </Badge>
            <Badge className="bg-[#A8C6A1]/15 text-[#2C3531] border-none font-normal">
              {CASE_STATUS_LABELS[job.status]}
            </Badge>
            <Badge className="bg-[#F7F9F6] text-[#2C3531]/60 border-none font-normal">
              {COMPANY_TYPE_LABELS[job.score.companyType]}
            </Badge>
          </div>
          <p className="text-sm text-[#2C3531]/55">
            {job.company} · 发布 {job.postedAt} · {job.salary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {(
            [
              ['apply', Send, '投'],
              ['watch', Eye, '观望'],
              ['reject', X, '不投'],
            ] as const
          ).map(([key, Icon, label]) => {
            const blocked = key === 'apply' && !gate0Passed;
            return (
              <Button
                key={key}
                size="sm"
                variant={job.decision === key ? 'default' : 'outline'}
                disabled={blocked}
                title={blocked ? 'Gate0 未过，不可投' : undefined}
                onClick={() => onDecision(key)}
                className={cn(
                  'rounded-full gap-1',
                  job.decision === key
                    ? key === 'apply'
                      ? 'bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white border-transparent'
                      : key === 'watch'
                        ? 'bg-[#5B8FA8] hover:bg-[#5B8FA8]/90 text-white border-transparent'
                        : 'bg-[#2C3531]/70 hover:bg-[#2C3531] text-white border-transparent'
                    : 'border-[#A8C6A1]/25 text-[#2C3531]/60',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-[#F7F9F6] px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <ScoreLine label="JD fit" value={job.score.jdFit} />
        <ScoreLine label="Level fit" value={job.score.levelFit} />
        <ScoreLine label="薪资" value={job.score.salaryNote} />
        <ScoreLine label="主线对齐" value={job.score.mainlineAlignment} />
        {job.decision === 'apply' && growthMainline && (
          <p className="md:col-span-2 text-xs text-[#A8C6A1]">
            投递理由对齐 HOW/主线：{growthMainline}
          </p>
        )}
        {job.score.verdictWhy && (
          <p className="md:col-span-2 text-xs text-[#2C3531]/45">
            裁决说明：{job.score.verdictWhy}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PointList title="匹配点" items={job.matchPoints} tone="match" />
        <PointList title="风险点" items={job.riskPoints} tone="risk" />
      </div>

      <p className="text-sm text-[#2C3531]/55 leading-relaxed line-clamp-3 whitespace-pre-wrap">
        {job.jdText}
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[#5B8FA8] hover:underline"
        >
          原文链接 <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <span className="text-xs text-[#2C3531]/35">
          裁决：{DECISION_LABELS[job.decision]}
        </span>
        <div className="flex-1" />
        {(job.decision === 'apply' ||
          job.status === 'round1' ||
          job.status === 'round2' ||
          job.status === 'final' ||
          job.status === 'applied') && (
          <Button
            asChild
            size="sm"
            onClick={onOpenInterview}
            className="rounded-full bg-[#5B8FA8] hover:bg-[#5B8FA8]/90 text-white gap-1.5"
          >
            <Link to={`/job-coach/interview/${job.id}`}>
              <Mic2 className="w-3.5 h-3.5" /> 面试工作台
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}

function ScoreLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[#2C3531]/65">
      <span className="text-[#2C3531]/40 text-xs mr-2">{label}</span>
      {value || '—'}
    </p>
  );
}

function PointList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'match' | 'risk';
}) {
  return (
    <div className="space-y-2">
      <p
        className={cn(
          'text-xs font-medium tracking-wide uppercase flex items-center gap-1',
          tone === 'match' ? 'text-[#A8C6A1]' : 'text-amber-600',
        )}
      >
        {tone === 'risk' && <AlertTriangle className="w-3 h-3" />}
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className={cn(
              'text-sm pl-3 border-l-2',
              tone === 'match'
                ? 'border-[#A8C6A1]/40 text-[#2C3531]/70'
                : 'border-amber-300 text-[#2C3531]/70',
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddJobDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: {
    title: string;
    company: string;
    location: MarketLocation;
    postedAt: string;
    salary: string;
    matchPoints: string[];
    riskPoints: string[];
    sourceUrl: string;
    jdText: string;
    score: OpportunityScore;
  }) => void;
}) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState<MarketLocation>('HK');
  const [postedAt, setPostedAt] = useState(new Date().toISOString().slice(0, 10));
  const [salary, setSalary] = useState('薪资不明');
  const [matchPoints, setMatchPoints] = useState('');
  const [riskPoints, setRiskPoints] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [jdText, setJdText] = useState('');
  const [jdFit, setJdFit] = useState('');
  const [levelFit, setLevelFit] = useState('');
  const [mainlineAlignment, setMainlineAlignment] = useState('');
  const [companyType, setCompanyType] = useState<CompanyType>('unknown');
  const [verdictWhy, setVerdictWhy] = useState('');

  const reset = () => {
    setTitle('');
    setCompany('');
    setLocation('HK');
    setPostedAt(new Date().toISOString().slice(0, 10));
    setSalary('薪资不明');
    setMatchPoints('');
    setRiskPoints('');
    setSourceUrl('');
    setJdText('');
    setJdFit('');
    setLevelFit('');
    setMainlineAlignment('');
    setCompanyType('unknown');
    setVerdictWhy('');
  };

  const handleSubmit = () => {
    if (!title.trim() || !company.trim() || !jdText.trim()) return;
    onSubmit({
      title: title.trim(),
      company: company.trim(),
      location,
      postedAt,
      salary: salary.trim() || '薪资不明',
      matchPoints: matchPoints
        .split(/[,，\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      riskPoints: riskPoints
        .split(/[,，\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      sourceUrl: sourceUrl.trim() || 'https://example.com/manual-jd',
      jdText: jdText.trim(),
      score: {
        jdFit: jdFit.trim() || '待评',
        levelFit: levelFit.trim() || '待评',
        salaryNote: salary.trim() || '薪资不明',
        companyType,
        mainlineAlignment: mainlineAlignment.trim() || '待对照定位卡主线',
        verdictWhy: verdictWhy.trim(),
      },
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white gap-1.5 px-5">
          <Plus className="w-4 h-4" /> 粘贴 JD 新增
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>手动添加机会（Gate1）</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-xs text-[#2C3531]/40">
            V1 不抓取 JobsDB/LinkedIn。粘贴公开 JD；无薪资带请填「薪资不明」，勿臆造。
          </p>
          <Field label="岗位名称 *">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" />
          </Field>
          <Field label="公司 *">
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="地点">
              <Select value={location} onValueChange={(v) => setLocation(v as MarketLocation)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_MARKETS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {MARKET_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="公司类型">
              <Select
                value={companyType}
                onValueChange={(v) => setCompanyType(v as CompanyType)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(COMPANY_TYPE_LABELS) as CompanyType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {COMPANY_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="发布日期">
              <Input
                type="date"
                value={postedAt}
                onChange={(e) => setPostedAt(e.target.value)}
                className="rounded-xl"
              />
            </Field>
            <Field label="薪资（不明请写薪资不明）">
              <Input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="rounded-xl"
              />
            </Field>
          </div>
          <Field label="JD fit">
            <Input value={jdFit} onChange={(e) => setJdFit(e.target.value)} className="rounded-xl" />
          </Field>
          <Field label="Level fit">
            <Input
              value={levelFit}
              onChange={(e) => setLevelFit(e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="增长主线对齐">
            <Input
              value={mainlineAlignment}
              onChange={(e) => setMainlineAlignment(e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="裁决说明（一句话）">
            <Input
              value={verdictWhy}
              onChange={(e) => setVerdictWhy(e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="匹配点（逗号或换行）">
            <Input
              value={matchPoints}
              onChange={(e) => setMatchPoints(e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="风险点（逗号或换行）">
            <Input
              value={riskPoints}
              onChange={(e) => setRiskPoints(e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="原文链接">
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://"
              className="rounded-xl"
            />
          </Field>
          <Field label="JD 原文 *">
            <Textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={5}
              className="rounded-xl resize-none"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !company.trim() || !jdText.trim()}
            className="rounded-full bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white"
          >
            加入看板（发现）
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[#2C3531]/60">{label}</Label>
      {children}
    </div>
  );
}
