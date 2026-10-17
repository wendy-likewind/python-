import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Archive, ArrowLeft, CheckCircle2, Clock, Plus } from 'lucide-react';
import { useJobCoach } from '@/contexts/JobCoachContext';
import PositioningCardView from '@/components/job-coach/PositioningCardView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CASE_STATUS_LABELS,
  LENS_LABELS,
  MARKET_LABELS,
  type CaseStatus,
  type InterviewCase,
  type InterviewerLens,
  type MethodBlock,
  type Opportunity,
  type StarStory,
} from '@/types/job-coach';
import { getInterviewsForOpportunity, isFireComplete } from '@/lib/job-coach';
import { cn } from '@/lib/utils';

export default function InterviewWorkspace() {
  const { opportunityId } = useParams<{ opportunityId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    positioning,
    step1Done,
    opportunities,
    interviews,
    ensureInterview,
    addRound,
    updatePrep,
    updateFire,
    archiveCase,
    setCaseStatus,
  } = useJobCoach();

  const tabParam = searchParams.get('tab');
  const defaultTab =
    tabParam === 'library' ? 'library' : tabParam === 'fire' ? 'fire' : 'prep';

  const eligible = useMemo(
    () =>
      opportunities.filter(
        (o) =>
          o.decision === 'apply' ||
          ['applied', 'round1', 'round2', 'final', 'offer', 'rejected'].includes(o.status) ||
          interviews.some((i) => i.opportunityId === o.id),
      ),
    [opportunities, interviews],
  );

  const selectedId = opportunityId || eligible[0]?.id || 'tina-bank-a';
  const job = opportunities.find((o) => o.id === selectedId);
  const rounds = selectedId ? getInterviewsForOpportunity(interviews, selectedId) : [];

  const [activeRoundId, setActiveRoundId] = useState<string | undefined>();

  useEffect(() => {
    if (!selectedId) return;
    ensureInterview(selectedId);
  }, [selectedId, ensureInterview]);

  useEffect(() => {
    const list = selectedId ? getInterviewsForOpportunity(interviews, selectedId) : [];
    if (list.length === 0) {
      setActiveRoundId(undefined);
      return;
    }
    if (!activeRoundId || !list.some((r) => r.id === activeRoundId)) {
      setActiveRoundId(list[list.length - 1].id);
    }
  }, [selectedId, interviews, activeRoundId]);

  const interview = rounds.find((r) => r.id === activeRoundId) ?? rounds[rounds.length - 1];
  const fireReady = interview ? isFireComplete(interview.fire) : false;

  const setTab = (v: string) => {
    if (v === 'library') setSearchParams({ tab: 'library' });
    else if (v === 'fire') setSearchParams({ tab: 'fire' });
    else setSearchParams({});
  };

  if (!job) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageIntro />
        <div className="rounded-3xl bg-white border border-[#A8C6A1]/15 px-6 py-12 text-center space-y-4">
          <p className="text-sm text-[#2C3531]/55">
            还没有进入面试的岗位。请先在「机会」里把岗位标为「投」（需先完成定位）。
          </p>
          <Button asChild className="rounded-full bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white">
            <Link to="/job-coach/board">返回机会</Link>
          </Button>
        </div>
      </div>
    );
  }

  const method = interview?.prep.method;
  const setMethod = (patch: Partial<MethodBlock>) => {
    if (!method || !interview) return;
    updatePrep(interview.id, { method: { ...method, ...patch } });
  };

  const updateStar = (storyId: string, patch: Partial<StarStory>) => {
    if (!interview) return;
    const stories = interview.prep.starStories ?? [];
    updatePrep(interview.id, {
      starStories: stories.map((s) => (s.id === storyId ? { ...s, ...patch } : s)),
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageIntro />

      {positioning ? (
        <PositioningCardView card={positioning} compact />
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          还没有定位：准备面试前建议先写好定位。
          <Link to="/job-coach/gate0" className="underline ml-2">
            去写定位
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Select
          value={job.id}
          onValueChange={(id) => navigate(`/job-coach/interview/${id}`)}
        >
          <SelectTrigger className="w-full sm:max-w-md rounded-full bg-white border-[#A8C6A1]/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {eligible.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.company} · {o.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button asChild variant="ghost" size="sm" className="text-[#2C3531]/45 gap-1 self-start">
          <Link to="/job-coach/board">
            <ArrowLeft className="w-3.5 h-3.5" /> 机会
          </Link>
        </Button>
      </div>

      <JobHeader job={job} onStatus={(s) => setCaseStatus(job.id, s)} />

      <div className="flex flex-wrap items-center gap-2">
        {rounds.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setActiveRoundId(r.id)}
            className={cn(
              'text-sm px-3 py-1.5 rounded-full transition-colors',
              r.id === interview?.id
                ? 'bg-[#5B8FA8] text-white'
                : 'bg-white border border-[#A8C6A1]/20 text-[#2C3531]/60',
            )}
          >
            {r.roundLabel}
            {r.fire.archivedAt ? ' · 已复盘' : ''}
          </button>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="rounded-full gap-1"
          onClick={() => {
            const created = addRound(job.id, rounds.length === 0 ? 'tl' : 'dh');
            setActiveRoundId(created.id);
          }}
        >
          <Plus className="w-3.5 h-3.5" /> 加一轮
        </Button>
      </div>

      <Tabs value={defaultTab} onValueChange={setTab} className="space-y-5">
        <TabsList className="bg-white border border-[#A8C6A1]/15 rounded-full h-auto p-1 flex flex-wrap">
          <TabsTrigger
            value="prep"
            className="rounded-full data-[state=active]:bg-[#A8C6A1] data-[state=active]:text-white px-4"
          >
            准备面试
          </TabsTrigger>
          <TabsTrigger
            value="fire"
            className="rounded-full data-[state=active]:bg-[#5B8FA8] data-[state=active]:text-white px-4"
          >
            面后复盘
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="rounded-full data-[state=active]:bg-[#2C3531] data-[state=active]:text-white px-4"
          >
            我的案例
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prep" className="mt-0 space-y-4">
          {!interview ? (
            <p className="text-sm text-[#2C3531]/45">请先选择或添加一轮面试。</p>
          ) : (
            <PrepPanel
              interview={interview}
              step1Done={step1Done}
              growthMainline={positioning?.growthMainline}
              onPrep={(p) => updatePrep(interview.id, p)}
              setMethod={setMethod}
              updateStar={updateStar}
              method={method}
            />
          )}
        </TabsContent>

        <TabsContent value="fire" className="mt-0">
          {!interview ? null : (
            <FirePanel
              interview={interview}
              fireReady={fireReady}
              onFire={(f) => updateFire(interview.id, f)}
              onArchive={() => archiveCase(interview.id)}
            />
          )}
        </TabsContent>

        <TabsContent value="library" className="mt-0">
          <CaseLibrary
            opportunities={opportunities}
            interviews={interviews}
            onOpen={(id, roundId) => {
              navigate(`/job-coach/interview/${id}`);
              if (roundId) setActiveRoundId(roundId);
              setSearchParams({});
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PrepPanel({
  interview,
  step1Done,
  growthMainline,
  onPrep,
  setMethod,
  updateStar,
  method,
}: {
  interview: InterviewCase;
  step1Done: boolean;
  growthMainline?: string;
  onPrep: (p: Partial<InterviewCase['prep']>) => void;
  setMethod: (p: Partial<MethodBlock>) => void;
  updateStar: (id: string, p: Partial<StarStory>) => void;
  method?: MethodBlock;
}) {
  return (
    <section className="rounded-3xl bg-white border border-[#A8C6A1]/15 shadow-sm p-6 space-y-5">
      <p className="text-sm text-[#2C3531]/50 leading-relaxed">
        当前：{interview.roundLabel}。写清做事方法、一分钟开场、用对方产品的观察、故事和反问。
        {interview.roundIndex > 1 ? ' 这一轮请先读上一轮复盘。' : ''}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="开场（对齐定位主线）">
          <Textarea
            value={interview.prep.opener}
            onChange={(e) => onPrep({ opener: e.target.value })}
            rows={3}
            placeholder={growthMainline ? `主线：${growthMainline}` : '先完成定位'}
            className="rounded-xl bg-[#F7F9F6] border-none resize-none"
            disabled={!step1Done}
          />
        </Field>
        <Field label="五个为什么 · 回答要点">
          <Textarea
            value={interview.prep.fiveWhysAnswers}
            onChange={(e) => onPrep({ fiveWhysAnswers: e.target.value })}
            rows={3}
            className="rounded-xl bg-[#F7F9F6] border-none resize-none"
          />
        </Field>
      </div>

      <div className="rounded-2xl border border-[#A8C6A1]/20 p-4 space-y-3">
        <p className="text-xs font-medium tracking-wide text-[#A8C6A1]">你会怎么做事</p>
        <p className="text-xs text-[#2C3531]/40">问题 → 目标 → 策略 → 执行 → 复盘 → 变成习惯</p>
        {(
          [
            ['problem', '1. 问题'],
            ['goals', '2. 目标'],
            ['strategy', '3. 策略'],
            ['execution', '4. 执行'],
            ['fireRetro', '5. 复盘钩子'],
            ['institutionalize', '6. 固化成机制'],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <Textarea
              value={method?.[key] ?? ''}
              onChange={(e) => setMethod({ [key]: e.target.value })}
              rows={2}
              className="rounded-xl bg-[#F7F9F6] border-none resize-none"
            />
          </Field>
        ))}
      </div>

      <Field label="用对方产品 → 痛点 → 优先怎么改">
        <Textarea
          value={interview.prep.useTheirProduct}
          onChange={(e) => onPrep({ useTheirProduct: e.target.value })}
          rows={4}
          placeholder="真的点开对方 App；记下观察 → 一个痛点 → 优先级修复（思考练习，别假装已经负责）"
          className="rounded-xl bg-[#F7F9F6] border-none resize-none"
        />
      </Field>

      <div className="rounded-2xl border border-[#5B8FA8]/20 p-4 space-y-3">
        <p className="text-xs font-medium tracking-wide text-[#5B8FA8]">面试官（示例请用面试官X）</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="称呼">
            <Input
              value={interview.prep.interviewerName}
              onChange={(e) => onPrep({ interviewerName: e.target.value })}
              placeholder="面试官X"
              className="rounded-xl bg-[#F7F9F6] border-none"
            />
          </Field>
          <Field label="对方更像">
            <Select
              value={interview.prep.interviewerLens}
              onValueChange={(v) => onPrep({ interviewerLens: v as InterviewerLens })}
            >
              <SelectTrigger className="rounded-xl bg-[#F7F9F6] border-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LENS_LABELS) as InterviewerLens[]).map((l) => (
                  <SelectItem key={l} value={l}>
                    {LENS_LABELS[l]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <LensHint lens={interview.prep.interviewerLens} />
        <Field label="背景笔记（只写你看到的公开信息）">
          <Textarea
            value={interview.prep.interviewerBrief}
            onChange={(e) => onPrep({ interviewerBrief: e.target.value })}
            rows={3}
            className="rounded-xl bg-[#F7F9F6] border-none resize-none"
          />
        </Field>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium tracking-wide text-[#A8C6A1]">故事库（情境-任务-行动-结果）</p>
        {interview.prep.starStories.map((story) => (
          <div
            key={story.id}
            className={cn(
              'rounded-2xl border p-4 space-y-2',
              story.retired ? 'border-amber-200 bg-amber-50/50' : 'border-[#A8C6A1]/15',
            )}
          >
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                value={story.title}
                onChange={(e) => updateStar(story.id, { title: e.target.value })}
                className="rounded-xl bg-white border-none max-w-xs"
              />
              <Select
                value={story.lensTag}
                onValueChange={(v) => updateStar(story.id, { lensTag: v as InterviewerLens })}
              >
                <SelectTrigger className="w-[160px] rounded-full bg-white border-[#A8C6A1]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(LENS_LABELS) as InterviewerLens[]).map((l) => (
                    <SelectItem key={l} value={l}>
                      {LENS_LABELS[l]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateStar(story.id, { retired: !story.retired })}
                className="text-xs text-amber-700"
              >
                {story.retired ? '已退役' : '标记退役'}
              </Button>
            </div>
            {(['situation', 'task', 'action', 'result'] as const).map((k) => (
              <Field key={k} label={{ situation: '情境', task: '任务', action: '行动', result: '结果' }[k]}>
                <Textarea
                  value={story[k]}
                  onChange={(e) => updateStar(story.id, { [k]: e.target.value })}
                  rows={2}
                  className="rounded-xl bg-[#F7F9F6] border-none resize-none"
                />
              </Field>
            ))}
          </div>
        ))}
      </div>

      <Field label="反问（偏业务目标：增长还是降本、90 天怎样算成功）">
        <Textarea
          value={interview.prep.reverseQuestions}
          onChange={(e) => onPrep({ reverseQuestions: e.target.value })}
          rows={3}
          className="rounded-xl bg-[#F7F9F6] border-none resize-none"
        />
      </Field>
    </section>
  );
}

function FirePanel({
  interview,
  fireReady,
  onFire,
  onArchive,
}: {
  interview: InterviewCase;
  fireReady: boolean;
  onFire: (f: Partial<InterviewCase['fire']>) => void;
  onArchive: () => void;
}) {
  return (
    <section className="rounded-3xl bg-white border border-[#A8C6A1]/15 shadow-sm p-6 space-y-5">
      <div className="flex items-start gap-2 rounded-2xl bg-[#5B8FA8]/5 px-4 py-3">
        <Clock className="w-4 h-4 text-[#5B8FA8] mt-0.5 shrink-0" />
        <p className="text-sm text-[#5B8FA8] leading-relaxed">
          建议面试后 24–48 小时内写完：事实 → 洞察 → 建议 → 执行。标出该退役的故事，并把反问改得更像在聊业务目标。
        </p>
      </div>
      <p className="text-xs text-[#2C3531]/40">本轮：{interview.roundLabel}</p>

      <Field label="一句话：这轮到底在选什么">
        <Input
          value={interview.fire.oneLineVerdict}
          onChange={(e) => onFire({ oneLineVerdict: e.target.value })}
          className="rounded-xl bg-[#F7F9F6] border-none"
        />
      </Field>

      {(
        [
          ['facts', '事实'],
          ['insights', '洞察'],
          ['recommendations', '建议'],
          ['execution', '执行（下一步）'],
        ] as const
      ).map(([key, label]) => (
        <Field key={key} label={label}>
          <Textarea
            value={interview.fire[key]}
            onChange={(e) => onFire({ [key]: e.target.value })}
            rows={3}
            className="rounded-xl bg-[#F7F9F6] border-none resize-none"
          />
        </Field>
      ))}

      <Field label="讲顺了的部分">
        <Textarea
          value={interview.fire.landed}
          onChange={(e) => onFire({ landed: e.target.value })}
          rows={2}
          className="rounded-xl bg-[#F7F9F6] border-none resize-none"
        />
      </Field>
      <Field label="没讲好的部分">
        <Textarea
          value={interview.fire.misfired}
          onChange={(e) => onFire({ misfired: e.target.value })}
          rows={2}
          className="rounded-xl bg-[#F7F9F6] border-none resize-none"
        />
      </Field>
      <Field label="故事退役 / 替换成什么">
        <Textarea
          value={interview.fire.storiesToRetire}
          onChange={(e) => onFire({ storiesToRetire: e.target.value })}
          rows={2}
          className="rounded-xl bg-[#F7F9F6] border-none resize-none"
        />
      </Field>
      <Field label="反问怎么改">
        <Textarea
          value={interview.fire.reverseQFixes}
          onChange={(e) => onFire({ reverseQFixes: e.target.value })}
          rows={2}
          className="rounded-xl bg-[#F7F9F6] border-none resize-none"
        />
      </Field>
      <Field label="下一轮要做的事（不超过 5 条）">
        <Textarea
          value={interview.fire.nextActions}
          onChange={(e) => onFire({ nextActions: e.target.value })}
          rows={2}
          className="rounded-xl bg-[#F7F9F6] border-none resize-none"
        />
      </Field>
      <Field label="留给下一轮准备的备注">
        <Textarea
          value={interview.fire.nextDocFeed}
          onChange={(e) => onFire({ nextDocFeed: e.target.value })}
          rows={3}
          className="rounded-xl bg-[#F7F9F6] border-none resize-none"
        />
      </Field>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          disabled={!fireReady || Boolean(interview.fire.archivedAt)}
          onClick={onArchive}
          className="rounded-full bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white gap-1.5"
        >
          <Archive className="w-4 h-4" />
          {interview.fire.archivedAt ? '已写入我的案例' : '写入我的案例'}
        </Button>
        {!fireReady && (
          <p className="text-xs text-[#2C3531]/40 self-center">请先写完事实、洞察、建议、执行</p>
        )}
      </div>
    </section>
  );
}

function PageIntro() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-[#A8C6A1]">
        准备面试 · 面后复盘 · 我的案例
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">面试工作台</h1>
      <p className="text-base text-[#2C3531]/55 max-w-2xl leading-relaxed">
        进度：发现 → 已投 → 一轮 → 二轮 → 终面 → 通过 / 拒信 / 放弃。同一家公司下一轮请先读复盘。
      </p>
    </div>
  );
}

function JobHeader({
  job,
  onStatus,
}: {
  job: Opportunity;
  onStatus: (s: CaseStatus) => void;
}) {
  return (
    <div className="rounded-3xl bg-white border border-[#A8C6A1]/15 shadow-sm px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold truncate">{job.title}</h2>
          {job.isIllustrative && (
            <Badge className="bg-amber-50 text-amber-700 border-none font-normal text-[11px]">
              示例
            </Badge>
          )}
        </div>
        <p className="text-sm text-[#2C3531]/50">
          {job.company} · {MARKET_LABELS[job.location]}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#2C3531]/40">进度</span>
        <Select value={job.status} onValueChange={(v) => onStatus(v as CaseStatus)}>
          <SelectTrigger className="w-[140px] rounded-full bg-[#F7F9F6] border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(CASE_STATUS_LABELS) as CaseStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {CASE_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function LensHint({ lens }: { lens: InterviewerLens }) {
  const tip =
    lens === 'tl'
      ? '团队负责人更关心：怎么做、顺序、协作、怎么解开卡点。'
      : lens === 'dh'
        ? '部门负责人更关心：稳不稳、有没有持续结果、风险怎么控、90 天怎么铺。'
        : lens === 'hr'
          ? 'HR 更关心：动机、稳定、薪资区间（别报单点数字）。'
          : '选好对方角色后，故事和开场按这个镜头调整。';
  return <p className="text-xs text-[#5B8FA8] leading-relaxed">{tip}</p>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[#2C3531]/70 text-sm">{label}</Label>
      {children}
    </div>
  );
}

function CaseLibrary({
  opportunities,
  interviews,
  onOpen,
}: {
  opportunities: Opportunity[];
  interviews: InterviewCase[];
  onOpen: (opportunityId: string, roundId?: string) => void;
}) {
  const rows = interviews
    .map((iv) => ({
      iv,
      job: opportunities.find((o) => o.id === iv.opportunityId),
    }))
    .filter((r) => r.job)
    .sort((a, b) => a.iv.roundIndex - b.iv.roundIndex);

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl bg-white border border-[#A8C6A1]/15 px-6 py-10 text-center text-sm text-[#2C3531]/45">
        还没有案例。写完面后复盘并点「写入我的案例」后会出现在这里。
      </div>
    );
  }

  const trail = opportunities.find((o) => o.id === 'tina-bank-a');

  return (
    <div className="space-y-4">
      {trail && (
        <div className="rounded-2xl bg-[#F7F9F6] border border-[#A8C6A1]/15 px-4 py-3">
          <p className="text-xs font-medium text-[#A8C6A1] mb-2">
            {trail.company} · 进度轨迹（示例）
          </p>
          <p className="text-sm text-[#2C3531]/70">
            发现 → 已投 → 一轮 → 二轮
            {trail.status === 'round2' ? '（当前）' : `（当前：${CASE_STATUS_LABELS[trail.status]}）`}
          </p>
        </div>
      )}
      <p className="text-xs text-[#2C3531]/40">
        本地示例入库。正式记录请用你自己的库名；勿粘贴真实 Notion 链接、雇主品牌或薪酬包。
      </p>
      {rows.map(({ iv, job }) => (
        <button
          key={iv.id}
          type="button"
          onClick={() => onOpen(job!.id, iv.id)}
          className={cn(
            'w-full text-left rounded-2xl bg-white border border-[#A8C6A1]/15 px-5 py-4',
            'hover:border-[#A8C6A1]/40 hover:shadow-sm transition-all',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <p className="font-medium truncate">
                {job!.title} · {iv.roundLabel}
              </p>
              <p className="text-sm text-[#2C3531]/45 truncate">
                {job!.company} · {MARKET_LABELS[job!.location]} ·{' '}
                {CASE_STATUS_LABELS[job!.status]}
              </p>
            </div>
            {iv.fire.archivedAt ? (
              <Badge className="bg-[#A8C6A1]/15 text-[#2C3531] border-none font-normal gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" /> 已入库
              </Badge>
            ) : (
              <Badge className="bg-[#5B8FA8]/10 text-[#5B8FA8] border-none font-normal shrink-0">
                待入库
              </Badge>
            )}
          </div>
          {iv.fire.oneLineVerdict && (
            <p className="mt-2 text-xs text-[#2C3531]/50 line-clamp-2">
              {iv.fire.oneLineVerdict}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
