import { useEffect, useMemo, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, ArrowLeft, CheckCircle2, Clock, Lock } from 'lucide-react';
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
  type InterviewerLens,
  type MethodBlock,
  type Opportunity,
  type StarStory,
} from '@/types/job-coach';
import { getInterviewForOpportunity, isFireComplete } from '@/lib/job-coach';
import { cn } from '@/lib/utils';

export default function InterviewWorkspace() {
  const { opportunityId } = useParams<{ opportunityId?: string }>();
  const navigate = useNavigate();
  const {
    positioning,
    gate0Passed,
    opportunities,
    interviews,
    ensureInterview,
    updatePrep,
    updateFire,
    archiveCase,
    setCaseStatus,
  } = useJobCoach();

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

  const selectedId = opportunityId || eligible[0]?.id;
  const job = opportunities.find((o) => o.id === selectedId);

  useEffect(() => {
    if (selectedId) ensureInterview(selectedId);
  }, [selectedId, ensureInterview]);

  const interview = selectedId
    ? getInterviewForOpportunity(interviews, selectedId)
    : undefined;

  const fireReady = interview ? isFireComplete(interview.fire) : false;

  if (!job) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageIntro />
        <div className="rounded-3xl bg-white border border-[#A8C6A1]/15 px-6 py-12 text-center space-y-4">
          <p className="text-sm text-[#2C3531]/55">
            还没有进入面试流程的岗位。请先在 Gate1 看板将机会标为「投」（需 Gate0 已通过）。
          </p>
          <Button asChild className="rounded-full bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white">
            <Link to="/job-coach/board">返回筛岗看板</Link>
          </Button>
        </div>
      </div>
    );
  }

  const method = interview?.prep.method;
  const setMethod = (patch: Partial<MethodBlock>) => {
    if (!method) return;
    updatePrep(job.id, { method: { ...method, ...patch } });
  };

  const updateStar = (storyId: string, patch: Partial<StarStory>) => {
    const stories = interview?.prep.starStories ?? [];
    updatePrep(job.id, {
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
          定位卡缺失：Gate3 面试文档要求先有 Gate0。开场白与主线应对齐定位卡。
          <Link to="/job-coach/gate0" className="underline ml-2">
            去 Gate0
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
            <ArrowLeft className="w-3.5 h-3.5" /> 看板
          </Link>
        </Button>
      </div>

      <JobHeader job={job} onStatus={(s) => setCaseStatus(job.id, s)} />

      <Tabs defaultValue="prep" className="space-y-5">
        <TabsList className="bg-white border border-[#A8C6A1]/15 rounded-full h-auto p-1 flex flex-wrap">
          <TabsTrigger
            value="prep"
            className="rounded-full data-[state=active]:bg-[#A8C6A1] data-[state=active]:text-white px-4"
          >
            Gate3 面试文档
          </TabsTrigger>
          <TabsTrigger
            value="fire"
            className="rounded-full data-[state=active]:bg-[#5B8FA8] data-[state=active]:text-white px-4"
          >
            Gate4 FIRE 复盘
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="rounded-full data-[state=active]:bg-[#2C3531] data-[state=active]:text-white px-4"
          >
            Gate5 案例库
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prep" className="mt-0 space-y-4">
          <section className="rounded-3xl bg-white border border-[#A8C6A1]/15 shadow-sm p-6 space-y-5">
            <p className="text-sm text-[#2C3531]/50 leading-relaxed">
              对齐「面试文档生成」：METHOD、5 Whys、电梯/开场锁定位卡主线、
              <strong className="font-medium text-[#2C3531]/70">用对方产品</strong>
              痛点 drill、STAR 库、TL vs 主管镜头。同角色轮次 2+ 必须先吃上轮复盘。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="开场 / 电梯（对齐定位卡）">
                <Textarea
                  value={interview?.prep.opener ?? ''}
                  onChange={(e) => updatePrep(job.id, { opener: e.target.value })}
                  rows={3}
                  placeholder={
                    positioning
                      ? `锁主线：${positioning.growthMainline}`
                      : '先完成 Gate0'
                  }
                  className="rounded-xl bg-[#F7F9F6] border-none resize-none"
                  disabled={!gate0Passed}
                />
              </Field>
              <Field label="5 Whys 回答要点（动机）">
                <Textarea
                  value={interview?.prep.fiveWhysAnswers ?? ''}
                  onChange={(e) => updatePrep(job.id, { fiveWhysAnswers: e.target.value })}
                  rows={3}
                  placeholder="Industry / Company / Location / Why me / Why not me"
                  className="rounded-xl bg-[#F7F9F6] border-none resize-none"
                />
              </Field>
            </div>

            <div className="rounded-2xl border border-[#A8C6A1]/20 p-4 space-y-3">
              <p className="text-xs font-medium tracking-wide uppercase text-[#A8C6A1]">
                METHOD · 你会怎么做事
              </p>
              <p className="text-xs text-[#2C3531]/40">
                问题(K/W) → 目标 → 策略 → 执行 → FIRE → 机制化
              </p>
              {(
                [
                  ['problem', '1. 问题（KPI 缺口 / 用户-业务 why）'],
                  ['goals', '2. 目标（1–2 north stars + 过程指标）'],
                  ['strategy', '3. 策略（产品 / 运营 / 渠道 / 合规）'],
                  ['execution', '4. 执行（里程碑、依赖、canary、监控）'],
                  ['fireRetro', '5. FIRE 复盘钩子'],
                  ['institutionalize', '6. 机制化（规则/模板/看板）'],
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

            <Field label="用对方产品 → 痛点 → 优先级修复（24–48h 必做 drill）">
              <Textarea
                value={interview?.prep.useTheirProduct ?? ''}
                onChange={(e) => updatePrep(job.id, { useTheirProduct: e.target.value })}
                rows={4}
                placeholder="真实使用对方 app/flow；记 2–3 条 UX 观察 → 一个痛点 → 优先级修复（思考 drill，勿假装已拥有）"
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>

            <div className="rounded-2xl border border-[#5B8FA8]/20 p-4 space-y-3">
              <p className="text-xs font-medium tracking-wide uppercase text-[#5B8FA8]">
                面试官背景速研 + 镜头
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="面试官（共享/示意请用 面试官X；真实姓名仅留本机）">
                  <Input
                    value={interview?.prep.interviewerName ?? ''}
                    onChange={(e) => updatePrep(job.id, { interviewerName: e.target.value })}
                    placeholder="面试官X（勿把真实姓名写进可分享草稿）"
                    className="rounded-xl bg-[#F7F9F6] border-none"
                  />
                </Field>
                <Field label="镜头">
                  <Select
                    value={interview?.prep.interviewerLens ?? 'unknown'}
                    onValueChange={(v) =>
                      updatePrep(job.id, { interviewerLens: v as InterviewerLens })
                    }
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
              <LensHint lens={interview?.prep.interviewerLens ?? 'unknown'} />
              <Field label="速研笔记（只读你指向的公开页）">
                <Textarea
                  value={interview?.prep.interviewerBrief ?? ''}
                  onChange={(e) => updatePrep(job.id, { interviewerBrief: e.target.value })}
                  rows={3}
                  placeholder="title / 范围 / 预测主题 / 2 条商业目标反问"
                  className="rounded-xl bg-[#F7F9F6] border-none resize-none"
                />
              </Field>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wide uppercase text-[#A8C6A1]">
                STAR 故事库
              </p>
              {(interview?.prep.starStories ?? []).map((story) => (
                <div
                  key={story.id}
                  className={cn(
                    'rounded-2xl border p-4 space-y-2',
                    story.retired
                      ? 'border-amber-200 bg-amber-50/50'
                      : 'border-[#A8C6A1]/15',
                  )}
                >
                  <div className="flex flex-wrap gap-2 items-center">
                    <Input
                      value={story.title}
                      onChange={(e) => updateStar(story.id, { title: e.target.value })}
                      className="rounded-xl bg-white border-none max-w-xs"
                      placeholder="故事标题"
                    />
                    <Select
                      value={story.lensTag}
                      onValueChange={(v) =>
                        updateStar(story.id, { lensTag: v as InterviewerLens })
                      }
                    >
                      <SelectTrigger className="w-[180px] rounded-full bg-white border-[#A8C6A1]/20">
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
                    <Field key={k} label={k.toUpperCase()}>
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

            <Field label="反问（偏商业目标：增长 vs 降本、90 天成功标准）">
              <Textarea
                value={interview?.prep.reverseQuestions ?? ''}
                onChange={(e) => updatePrep(job.id, { reverseQuestions: e.target.value })}
                rows={3}
                placeholder="早期勿问薪资、表现如何、内部技术栈细节"
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
          </section>
        </TabsContent>

        <TabsContent value="fire" className="mt-0">
          <section className="rounded-3xl bg-white border border-[#A8C6A1]/15 shadow-sm p-6 space-y-5">
            <div className="flex items-start gap-2 rounded-2xl bg-[#5B8FA8]/5 px-4 py-3">
              <Clock className="w-4 h-4 text-[#5B8FA8] mt-0.5 shrink-0" />
              <p className="text-sm text-[#5B8FA8] leading-relaxed">
                Gate4 · 面试后 24–48h：FIRE = 事实 → 洞察 → 建议 → 执行。含故事退役、反问校准、TL↔主管镜头检查；输出喂给同角色下一轮面试文档。
              </p>
            </div>

            <Field label="一句 verdict（本轮真正在选什么）">
              <Input
                value={interview?.fire.oneLineVerdict ?? ''}
                onChange={(e) => updateFire(job.id, { oneLineVerdict: e.target.value })}
                className="rounded-xl bg-[#F7F9F6] border-none"
                placeholder="执行深度 vs 稳定性+交付…"
              />
            </Field>

            {(
              [
                ['facts', 'F · 事实'],
                ['insights', 'I · 洞察'],
                ['recommendations', 'R · 建议'],
                ['execution', 'E · 执行（下一步机制）'],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <Textarea
                  value={interview?.fire[key] ?? ''}
                  onChange={(e) => updateFire(job.id, { [key]: e.target.value })}
                  rows={3}
                  className="rounded-xl bg-[#F7F9F6] border-none resize-none"
                />
              </Field>
            ))}

            <Field label="What landed（可复用 · 标 TL/主管）">
              <Textarea
                value={interview?.fire.landed ?? ''}
                onChange={(e) => updateFire(job.id, { landed: e.target.value })}
                rows={2}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <Field label="What misfired">
              <Textarea
                value={interview?.fire.misfired ?? ''}
                onChange={(e) => updateFire(job.id, { misfired: e.target.value })}
                rows={2}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <Field label="故事退役 / 替换主题">
              <Textarea
                value={interview?.fire.storiesToRetire ?? ''}
                onChange={(e) => updateFire(job.id, { storiesToRetire: e.target.value })}
                rows={2}
                placeholder="点名替换主题，不只写「下次更好」"
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <Field label="反问校准（改向商业目标）">
              <Textarea
                value={interview?.fire.reverseQFixes ?? ''}
                onChange={(e) => updateFire(job.id, { reverseQFixes: e.target.value })}
                rows={2}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <Field label="Next-round actions（≤5）">
              <Textarea
                value={interview?.fire.nextActions ?? ''}
                onChange={(e) => updateFire(job.id, { nextActions: e.target.value })}
                rows={2}
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>
            <Field label="Next-doc feed（同角色下一轮必读）">
              <Textarea
                value={interview?.fire.nextDocFeed ?? ''}
                onChange={(e) => updateFire(job.id, { nextDocFeed: e.target.value })}
                rows={3}
                placeholder="banned stories / 雇主信号 / 校准反问 / 下一镜头建议"
                className="rounded-xl bg-[#F7F9F6] border-none resize-none"
              />
            </Field>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                disabled={!fireReady || Boolean(interview?.fire.archivedAt)}
                onClick={() => archiveCase(job.id)}
                className="rounded-full bg-[#A8C6A1] hover:bg-[#A8C6A1]/90 text-white gap-1.5"
              >
                <Archive className="w-4 h-4" />
                {interview?.fire.archivedAt ? '已入库' : 'Gate5 入库'}
              </Button>
              {!fireReady && (
                <p className="text-xs text-[#2C3531]/40 self-center">
                  请填完 FIRE 四项后再入库
                </p>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="library" className="mt-0">
          <CaseLibrary
            opportunities={opportunities}
            interviews={interviews}
            onOpen={(id) => navigate(`/job-coach/interview/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PageIntro() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-widest uppercase text-[#A8C6A1]">
        Gate3–5 · 面试文档 / 复盘 / 入库
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">单场面试工作台</h1>
      <p className="text-base text-[#2C3531]/55 max-w-2xl leading-relaxed">
        状态流：发现 → 已投 → 一轮 → 二轮 → 终面 → 通过 / 拒信 / 放弃。同角色下一轮必须读入库复盘。
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
              示意数据
            </Badge>
          )}
        </div>
        <p className="text-sm text-[#2C3531]/50">
          {job.company} · {MARKET_LABELS[job.location]}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#2C3531]/40">进度状态</span>
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
      ? 'TL 优化执行细节：how / 排序 / 协作 / unblock；案例+数字。'
      : lens === 'dh'
        ? '主管优化稳定性与实质交付：持久 ownership、持续指标、风控、90 天系统。'
        : lens === 'hr'
          ? 'HR：动机、稳定、薪资区间（非单点数字），与表格一致。'
          : '选镜头后显示打法差异；混合面板请给故事打 TL/主管标签。';
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
  interviews: ReturnType<typeof useJobCoach>['interviews'];
  onOpen: (id: string) => void;
}) {
  const rows = interviews
    .map((iv) => ({
      iv,
      job: opportunities.find((o) => o.id === iv.opportunityId),
    }))
    .filter((r) => r.job);

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl bg-white border border-[#A8C6A1]/15 px-6 py-10 text-center text-sm text-[#2C3531]/45">
        案例库为空。完成 Gate4 FIRE 并点击「Gate5 入库」后出现 stub。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#2C3531]/40 flex items-center gap-1">
        <Lock className="w-3 h-3" />{' '}
        本地示意入库（公司A/面试官X/候选人）。正式案例库由用户自命名；勿粘贴真实
        Notion URL、雇主名或薪酬包到共享视图。
      </p>
      {rows.map(({ iv, job }) => (
        <button
          key={iv.id}
          type="button"
          onClick={() => onOpen(job!.id)}
          className={cn(
            'w-full text-left rounded-2xl bg-white border border-[#A8C6A1]/15 px-5 py-4',
            'hover:border-[#A8C6A1]/40 hover:shadow-sm transition-all',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <p className="font-medium truncate">{job!.title}</p>
              <p className="text-sm text-[#2C3531]/45 truncate">
                {job!.company}
                {job!.isIllustrative ? '' : '（本机）'} · {MARKET_LABELS[job!.location]} ·{' '}
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
              Verdict: {iv.fire.oneLineVerdict}
            </p>
          )}
          {iv.fire.storiesToRetire && (
            <p className="mt-1 text-xs text-amber-700/80 line-clamp-1">
              勿复用：{iv.fire.storiesToRetire}
            </p>
          )}
        </button>
      ))}
      <p className="text-xs text-[#2C3531]/35 px-1">
        发现 → 已投 → 一轮 → 二轮 → 终面 → 通过 / 拒信 / 放弃
      </p>
    </div>
  );
}
