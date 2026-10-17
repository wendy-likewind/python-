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
import { shortlistCount, SHORTLIST_MAX, SHORTLIST_MIN, TINA_TARGET_COMP } from '@/lib/job-coach';
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
    step1Done,
    opportunities,
    setDecision,
    addOpportunity,
    ensureInterview,
  } = useJobCoach();

  const [markets, setMarkets] = useState<MarketLocation[]>(['HK']);
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
          第二步 · 机会
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">机会短名单</h1>
            <p className="text-base text-[#2C3531]/55 max-w-xl leading-relaxed">
              看岗位、写匹配点，再决定投 / 观望 / 不投。完成定位后才能标「投」。这一版请自己粘贴职位描述，不会自动抓岗。
            </p>
            <p className="text-sm text-[#2C3531]/45">{TINA_TARGET_COMP}</p>
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
          <p className="text-sm text-amber-800">还没完成定位：现在不能标「投」，只能先看看或观望。</p>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-[#5B8FA8] hover:bg-[#5B8FA8]/90 text-white shrink-0"
          >
            <Link to="/job-coach/gate0">去写定位</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <LockedNext
          icon={FileText}
          title="第三步 · 简历主线（下一步）"
          body="这一版先不做。投递前记得简历要围着增长主线写。"
        />
        <LockedNext
          icon={Banknote}
          title="第七步 · 谈薪（下一步）"
          body="公开薪资对照默认先看香港；要对比新加坡/深圳需你自己打开。这一版不做谈判流。"
        />
      </div>

      <div className="rounded-2xl bg-white border border-[#A8C6A1]/15 px-4 py-3 space-y-2">
        <p className="text-xs font-medium tracking-wide text-[#A8C6A1]">投之前快速核对</p>
        <ul className="text-sm text-[#2C3531]/60 space-y-1">
          <li>· 定位还有效吗？{step1Done ? '是' : '还没有'}</li>
          <li>· 这份岗位要不要先改一版主线简历？（这一版：下一步）</li>
          <li>· 公开薪资带对过了吗？（没有就写「薪资不明」）</li>
          <li>
            · 状态请自己改成「已投」——我们不会替你投 · 当前投 {applyCount} / 列表{' '}
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
              <SelectValue placeholder="决定" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部决定</SelectItem>
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
            已关注 {shortlisted}/{SHORTLIST_MAX}
            {shortlisted < SHORTLIST_MIN ? ` · 建议至少 ${SHORTLIST_MIN} 个` : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            step1Done={step1Done}
            growthMainline={positioning?.growthMainline}
            onDecision={(d) => setDecision(job.id, d)}
            onOpenInterview={() => ensureInterview(job.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl bg-white/60 border border-[#A8C6A1]/15 px-6 py-12 text-center text-sm text-[#2C3531]/45">
            当前筛选下没有岗位。可以粘贴职位描述新增，或放宽地点/决定过滤。
          </div>
        )}
      </div>
    </div>
  );
}

function LockedNext({
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
        <p className="text-xs font-medium">{title}</p>
      </div>
      <p className="text-xs text-[#2C3531]/45 leading-relaxed">{body}</p>
    </div>
  );
}

function JobCard({
  job,
  step1Done,
  growthMainline,
  onDecision,
  onOpenInterview,
}: {
  job: Opportunity;
  step1Done: boolean;
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
                示例
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
            const blocked = key === 'apply' && !step1Done;
            return (
              <Button
                key={key}
                size="sm"
                variant={job.decision === key ? 'default' : 'outline'}
                disabled={blocked}
                title={blocked ? '请先完成定位' : undefined}
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
        <ScoreLine label="岗位匹配" value={job.score.jdFit} />
        <ScoreLine label="级别匹配" value={job.score.levelFit} />
        <ScoreLine label="薪资" value={job.score.salaryNote} />
        <ScoreLine label="主线是否对得上" value={job.score.mainlineAlignment} />
        {job.decision === 'apply' && growthMainline && (
          <p className="md:col-span-2 text-xs text-[#A8C6A1]">投递理由对齐主线：{growthMainline}</p>
        )}
        {job.score.verdictWhy && (
          <p className="md:col-span-2 text-xs text-[#2C3531]/45">说明：{job.score.verdictWhy}</p>
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
        <span className="text-xs text-[#2C3531]/35">决定：{DECISION_LABELS[job.decision]}</span>
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
              <Mic2 className="w-3.5 h-3.5" /> 准备面试
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
          'text-xs font-medium tracking-wide flex items-center gap-1',
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
  const [companyType, setCompanyType] = useState<CompanyType>('bank');
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
    setCompanyType('bank');
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
        jdFit: jdFit.trim() || '待写',
        levelFit: levelFit.trim() || '待写',
        salaryNote: salary.trim() || '薪资不明',
        companyType,
        mainlineAlignment: mainlineAlignment.trim() || '待对照定位主线',
        verdictWhy: verdictWhy.trim(),
      },
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white gap-1.5 px-5">
          <Plus className="w-4 h-4" /> 粘贴职位描述
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>添加一个机会</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-xs text-[#2C3531]/40">
            粘贴公开职位描述。演示请用「目标外资银行A」等占位，勿写入真实雇主品牌或私密薪酬包。
          </p>
          <Field label="岗位名称 *">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" />
          </Field>
          <Field label="公司 *（示例可用 目标外资银行A）">
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="目标外资银行A"
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
              <Select value={companyType} onValueChange={(v) => setCompanyType(v as CompanyType)}>
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
            <Field label="薪资（默认薪资不明）">
              <Input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="rounded-xl"
              />
            </Field>
          </div>
          <Field label="岗位匹配">
            <Input value={jdFit} onChange={(e) => setJdFit(e.target.value)} className="rounded-xl" />
          </Field>
          <Field label="级别匹配">
            <Input
              value={levelFit}
              onChange={(e) => setLevelFit(e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="主线是否对得上">
            <Input
              value={mainlineAlignment}
              onChange={(e) => setMainlineAlignment(e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="一句话说明">
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
          <Field label="职位描述 *">
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
            加入列表
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
