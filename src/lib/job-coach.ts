import type {
  FiveWhys,
  InterviewCase,
  InterviewerLens,
  InterviewPrep,
  JobCoachState,
  MarketLocation,
  MethodBlock,
  Opportunity,
  PositioningCard,
  TwoWheres,
} from '@/types/job-coach';
import { STORAGE_KEY } from '@/types/job-coach';
import {
  PLACEHOLDER_BANK_A,
  PLACEHOLDER_BANK_B,
  PLACEHOLDER_BANK_C,
  PLACEHOLDER_CURRENT_EMPLOYER,
  PLACEHOLDER_INTERVIEWER,
} from '@/lib/job-coach-privacy';

export const DEFAULT_MARKETS: MarketLocation[] = ['HK', 'SG', 'SZ'];
export const SHORTLIST_MIN = 3;
export const SHORTLIST_MAX = 8;
export const ELEVATOR_PITCH_MAX_CHARS = 280;

export function emptyFiveWhys(): FiveWhys {
  return {
    industry: '',
    companyFamily: '',
    location: '',
    whyMe: '',
    whyNotMe: '',
  };
}

export function emptyTwoWheres(): TwoWheres {
  return { fiveYear: '', longerArc: '' };
}

export function emptyMethod(): MethodBlock {
  return {
    problem: '',
    goals: '',
    strategy: '',
    execution: '',
    fireRetro: '',
    institutionalize: '',
  };
}

export function emptyPrep(): InterviewPrep {
  return {
    method: emptyMethod(),
    starStories: [
      {
        id: 'star-1',
        title: '故事 1',
        situation: '',
        task: '',
        action: '',
        result: '',
        lensTag: 'unknown',
        retired: false,
      },
    ],
    useTheirProduct: '',
    reverseQuestions: '',
    opener: '',
    interviewerName: PLACEHOLDER_INTERVIEWER,
    interviewerLens: 'unknown',
    interviewerBrief: '',
    fiveWhysAnswers: '',
  };
}

export function emptyFire() {
  return {
    facts: '',
    insights: '',
    recommendations: '',
    execution: '',
    oneLineVerdict: '',
    landed: '',
    misfired: '',
    storiesToRetire: '',
    reverseQFixes: '',
    nextActions: '',
    nextDocFeed: '',
  };
}

/** Tina（示例）— Step 1 positioning already filled for demo */
export const TINA_POSITIONING: PositioningCard = {
  personaLabel: 'Tina（示例）· 32 岁',
  targetLevel: '电子银行 · 外汇产品经理',
  targetDomain: '香港外资银行 · 外汇/跨境支付',
  what: 'Tina（示例）目标：跳槽至其他香港外资银行，继续做电子银行外汇产品经理。',
  why: '希望在更大平台上放大外汇交易量与份额主线；当前窗口适合换轨同城外资行。',
  how: '主线是电子银行外汇交易量与活跃客户增长；用线上开户/兑换漏斗与合规协作交付证明。',
  provenDeliveries: [
    '示意：主导外汇兑换漏斗优化，提升完成率（示例指标，非真实披露）',
    '示意：协同合规上线一版电子银行外汇相关能力',
    '示意：用数据周报机制把增长复盘固化为模板',
  ],
  elevatorPitch:
    '我是 Tina，在香港某外资银行做电子银行外汇产品。过去专注线上外汇体验与交易量增长，希望到新的外资银行平台把同一条主线做深。',
  fiveWhys: {
    industry: '银行数字化与外汇仍是港人高频需求，产品有可持续的量与份额空间。',
    companyFamily: '外资银行在合规、品牌与跨境能力上匹配我的交付证据。',
    location: '香港是我的生活与职业根据地，目标仍锁定本港外资行。',
    whyMe: '有电子银行外汇从漏斗到合规落地的完整经历，能讲清增长主线。',
    whyNotMe: '若对方要纯对公交易台经验会偏弱——已用零售电子银行外汇案例与学习计划缓解。',
  },
  twoWheres: {
    fiveYear: '约 5 年：港资/外资银行电子银行外汇或跨境支付产品负责人方向（示例）。',
    longerArc: '更长弧：区域跨境财富/支付产品，仍以香港为锚点（示例）。',
  },
  growthMainline: '电子银行外汇 · 可持续交易量与份额',
  narrative: '电子银行 · 外汇产品经理 · 香港外资银行｜主线：电子银行外汇 · 可持续交易量与份额',
  lockedAt: '2026-10-01T08:00:00.000Z',
};

const now = '2026-10-16T08:00:00.000Z';

export const TINA_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'tina-bank-a',
    title: '电子银行外汇产品经理（示例）',
    company: PLACEHOLDER_BANK_A,
    location: 'HK',
    postedAt: '2026-09-20',
    salary: '目标年薪示意 90万 HKD（示例）· 岗位公开带：薪资不明',
    matchPoints: ['外汇/电子银行主线高度对齐', '香港外资银行平台', '已完成两轮面试（示例）'],
    riskPoints: ['部门负责人更看重稳定性与持续指标', '英语面试强度需再压 talk track'],
    sourceUrl: 'https://example.com/jobs/illustrative-bank-a',
    jdText:
      '【示例 JD · 非真实岗位 · 已脱敏】目标外资银行A 招聘电子银行外汇产品经理，负责零售外汇交易量与体验增长，协同合规与科技。',
    score: {
      jdFit: '示例：must-have 与 Tina 外汇主线对齐',
      levelFit: '示例：级别匹配电子银行 PM',
      salaryNote: '薪资不明 · 个人目标示意 90万 HKD（示例）',
      companyType: 'bank',
      mainlineAlignment: '强对齐 · 电子银行外汇交易量与份额',
      verdictWhy: '主线匹配，已推进至二轮（示例旅程）',
    },
    decision: 'apply',
    status: 'round2',
    isIllustrative: true,
    createdAt: '2026-09-20T08:00:00.000Z',
    updatedAt: now,
  },
  {
    id: 'tina-bank-b',
    title: '数字银行 · 外汇产品经理（示例）',
    company: PLACEHOLDER_BANK_B,
    location: 'HK',
    postedAt: '2026-10-05',
    salary: '薪资不明',
    matchPoints: ['外汇产品', '数字化银行条线', '香港'],
    riskPoints: ['JD 偏对公则观望', '级别带宽较宽'],
    sourceUrl: 'https://example.com/jobs/illustrative-bank-b',
    jdText:
      '【示例 JD · 已脱敏】目标外资银行B 数字银行团队，外汇与跨境相关产品（示例描述）。',
    score: {
      jdFit: '示例：部分命中',
      levelFit: '示例：待当面核对',
      salaryNote: '薪资不明',
      companyType: 'bank',
      mainlineAlignment: '中等 · 需确认是否零售电子银行',
      verdictWhy: '可进短名单观望',
    },
    decision: 'watch',
    status: 'discovered',
    isIllustrative: true,
    createdAt: '2026-10-05T08:00:00.000Z',
    updatedAt: now,
  },
  {
    id: 'tina-bank-c',
    title: '零售外汇产品经理（示例）',
    company: PLACEHOLDER_BANK_C,
    location: 'HK',
    postedAt: '2026-10-08',
    salary: '薪资不明',
    matchPoints: ['零售外汇', '可映射漏斗增长证据'],
    riskPoints: ['与现平台业务重叠度未知'],
    sourceUrl: 'https://example.com/jobs/illustrative-bank-c',
    jdText: '【示例 JD · 已脱敏】目标外资银行C 零售外汇产品岗位（示例）。',
    score: {
      jdFit: '示例：方向接近',
      levelFit: '示例：匹配',
      salaryNote: '薪资不明',
      companyType: 'bank',
      mainlineAlignment: '可对齐交易量主线',
      verdictWhy: '待 Tina 决定是否投',
    },
    decision: 'pending',
    status: 'discovered',
    isIllustrative: true,
    createdAt: '2026-10-08T08:00:00.000Z',
    updatedAt: now,
  },
  {
    id: 'tina-bank-a-wealth',
    title: '电子银行 · 财富入口产品（示例）',
    company: PLACEHOLDER_BANK_A,
    location: 'HK',
    postedAt: '2026-10-10',
    salary: '薪资不明',
    matchPoints: ['同雇主族可复用叙事', '电子银行经验'],
    riskPoints: ['主线若非外汇则对齐偏弱 → 倾向观望'],
    sourceUrl: 'https://example.com/jobs/illustrative-bank-a-2',
    jdText: '【示例 JD · 已脱敏】目标外资银行A 另一条电子银行财富入口岗位（示例）。',
    score: {
      jdFit: '示例：旁路机会',
      levelFit: '示例：匹配',
      salaryNote: '薪资不明',
      companyType: 'bank',
      mainlineAlignment: '弱于外汇岗 · 建议观望',
      verdictWhy: '补充短名单广度',
    },
    decision: 'watch',
    status: 'discovered',
    isIllustrative: true,
    createdAt: '2026-10-10T08:00:00.000Z',
    updatedAt: now,
  },
];

function tinaPrepTl(): InterviewPrep {
  return {
    method: {
      problem: '示例：外汇兑换完成率低于目标，用户在汇率确认步流失。',
      goals: '示例：完成率 + 月活跃外汇交易客户（示意指标）。',
      strategy: '产品简化确认步 + 运营教育 + 合规文案并行。',
      execution: '双周迭代、灰度、监控看板。',
      fireRetro: '用周复盘把有效实验固化。',
      institutionalize: '漏斗模板 + 合规检查清单。',
    },
    starStories: [
      {
        id: 'star-fx-funnel',
        title: '外汇漏斗优化（示例）',
        situation: '在香港某外资银行电子银行，外汇完成率承压（示例）。',
        task: '找出流失点并提升完成率。',
        action: '拆步排查、改交互、协同合规改文案。',
        result: '完成率回升（示例口径，非真实披露）。',
        lensTag: 'tl',
        retired: false,
      },
    ],
    useTheirProduct:
      '示例：实际点开目标外资银行A App 外汇流程，观察汇率展示与确认步；记下 2 条体验问题 → 一个优先级修复（思考 drill）。',
    reverseQuestions: '团队本季外汇增长目标是量还是份额？90 天成功长什么样？',
    opener: '对齐定位卡：电子银行外汇交易量与份额主线；用 1 个漏斗案例开场（示例）。',
    interviewerName: '面试官X（团队负责人 · 示例）',
    interviewerLens: 'tl',
    interviewerBrief: '示例速研：团队负责人镜头 → 执行细节、协作、unblock；勿填写真实姓名。',
    fiveWhysAnswers: '行业/雇主族/香港/为什么是我/缺口缓解 — 见定位卡（示例）。',
  };
}

function tinaPrepDh(): InterviewPrep {
  return {
    method: {
      problem: '示例：部门要的是可持续外汇份额，而非一次性活动。',
      goals: '示例：季度交易量与留存客户双北星。',
      strategy: '主线项目制 + 风控前置 + 90 天里程碑。',
      execution: '跨科技/合规 RACI，月度经营回顾。',
      fireRetro: '把复盘写进案例库喂下一轮。',
      institutionalize: '经营看板 + 决策日志。',
    },
    starStories: [
      {
        id: 'star-durable',
        title: '持续交易量经营（示例）',
        situation: '需要证明不是一锤子创意。',
        task: '建立可复用的增长经营节奏。',
        action: '周数据会 + 实验池 + 合规并行。',
        result: '份额/量的趋势可解释（示例）。',
        lensTag: 'dh',
        retired: false,
      },
    ],
    useTheirProduct: '示例：复用上轮 App 观察，升级为「90 天系统」叙事给部门负责人。',
    reverseQuestions: '部门更看重增长还是降本？成功的外汇产品负责人一年后画像？',
    opener: '部门负责人镜头：先讲业务判断与稳定交付，再补执行细节（示例）。',
    interviewerName: '面试官X（部门负责人 · 示例）',
    interviewerLens: 'dh',
    interviewerBrief: '示例：主管镜头 → 稳定性、持续指标、风控；已吃一轮复盘。',
    fiveWhysAnswers: '强调为什么现在换轨、为什么外资银行族（示例）。',
  };
}

export const TINA_INTERVIEWS: InterviewCase[] = [
  {
    id: 'tina-iv-r1',
    opportunityId: 'tina-bank-a',
    roundIndex: 1,
    roundLabel: '一轮 · 团队负责人面',
    prep: tinaPrepTl(),
    fire: {
      facts: '示例：团队负责人追问漏斗每一步的数据口径与协作方式。',
      insights: '房间要的是执行深度与 unblock，不是愿景口号。',
      recommendations: '下一轮压缩 talk track；把「最难项目」换成持续经营故事。',
      execution: '已更新故事库标签为团队负责人适配；反问改为业务目标。',
      oneLineVerdict: '示例：一轮在选执行深度',
      landed: '漏斗案例数字讲清楚（示例）。',
      misfired: '开场略长；一处内部实现细节问多了。',
      storiesToRetire: '过长的创意 brainstorm 故事（示例）',
      reverseQFixes: '改问 90 天成功标准 / 增长 vs 降本',
      nextActions: '准备部门负责人版开场；补 90 天系统一页纸',
      nextDocFeed:
        'banned: 过长创意故事；镜头切部门负责人；雇主信号：要可持续量；反问已校准。',
      reviewedAt: '2026-10-08T12:00:00.000Z',
      archivedAt: '2026-10-08T12:30:00.000Z',
    },
    status: 'round1',
    createdAt: '2026-10-05T08:00:00.000Z',
    updatedAt: '2026-10-08T12:30:00.000Z',
  },
  {
    id: 'tina-iv-r2',
    opportunityId: 'tina-bank-a',
    roundIndex: 2,
    roundLabel: '二轮 · 部门负责人面',
    prep: tinaPrepDh(),
    fire: {
      facts: '示例：部门负责人关心风险控制与 90 天经营节奏。',
      insights: '稳定性 + 实质交付压过单点创意。',
      recommendations: '终面若遇 HR，区间谈薪不报单点；保持与表格一致。',
      execution: '案例入库；等待进度回填。',
      oneLineVerdict: '示例：二轮在选稳定性与持续交付',
      landed: '90 天系统与风控并行讲清楚（示例）。',
      misfired: '有一问对标同业时信息偏薄——已标示意、不编造。',
      storiesToRetire: '无新增退役；沿用一轮列表',
      reverseQFixes: '继续问业务目标，不问内部栈',
      nextActions: '若进终面：准备动机与稳定叙事',
      nextDocFeed: '同角色终面：读两轮 FIRE；镜头可能混 HR。',
      reviewedAt: '2026-10-15T12:00:00.000Z',
      archivedAt: '2026-10-15T12:30:00.000Z',
    },
    status: 'round2',
    createdAt: '2026-10-12T08:00:00.000Z',
    updatedAt: '2026-10-15T12:30:00.000Z',
  },
];

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function buildNarrative(
  card: Pick<PositioningCard, 'targetLevel' | 'targetDomain' | 'growthMainline'>,
): string {
  return `${card.targetLevel} · ${card.targetDomain}｜主线：${card.growthMainline}`;
}

export function isPositioningComplete(card: PositioningCard | null): boolean {
  if (!card) return false;
  const whys = card.fiveWhys;
  return Boolean(
    card.what.trim() &&
      card.targetLevel.trim() &&
      card.targetDomain.trim() &&
      card.why.trim() &&
      card.how.trim() &&
      card.provenDeliveries.filter((d) => d.trim()).length >= 2 &&
      card.elevatorPitch.trim() &&
      whys.industry.trim() &&
      whys.companyFamily.trim() &&
      whys.location.trim() &&
      whys.whyMe.trim() &&
      whys.whyNotMe.trim() &&
      card.twoWheres.fiveYear.trim() &&
      card.twoWheres.longerArc.trim() &&
      card.growthMainline.trim(),
  );
}

/** Default demo state — Tina（示例）journey */
export function emptyState(): JobCoachState {
  return {
    positioning: TINA_POSITIONING,
    opportunities: TINA_OPPORTUNITIES,
    interviews: TINA_INTERVIEWS,
  };
}

export function loadState(): JobCoachState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as JobCoachState;
    return {
      positioning: parsed.positioning ?? TINA_POSITIONING,
      opportunities:
        Array.isArray(parsed.opportunities) && parsed.opportunities.length > 0
          ? parsed.opportunities
          : TINA_OPPORTUNITIES,
      interviews: Array.isArray(parsed.interviews) ? parsed.interviews : TINA_INTERVIEWS,
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: JobCoachState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function shortlistCount(opportunities: Opportunity[]): number {
  return opportunities.filter((o) => o.decision === 'apply' || o.decision === 'watch').length;
}

export function getInterviewsForOpportunity(
  interviews: InterviewCase[],
  opportunityId: string,
): InterviewCase[] {
  return interviews
    .filter((i) => i.opportunityId === opportunityId)
    .sort((a, b) => a.roundIndex - b.roundIndex);
}

export function getInterviewForOpportunity(
  interviews: InterviewCase[],
  opportunityId: string,
  roundIndex?: number,
): InterviewCase | undefined {
  const list = getInterviewsForOpportunity(interviews, opportunityId);
  if (roundIndex != null) return list.find((i) => i.roundIndex === roundIndex);
  return list[list.length - 1];
}

export function estimatePitchSeconds(text: string): number {
  return Math.ceil(text.trim().length / 4);
}

export function isFireComplete(fire: ReturnType<typeof emptyFire>): boolean {
  return Boolean(
    fire.facts.trim() &&
      fire.insights.trim() &&
      fire.recommendations.trim() &&
      fire.execution.trim(),
  );
}

export function roundLabelFor(index: number, lens: InterviewerLens): string {
  const round =
    index === 1 ? '一轮' : index === 2 ? '二轮' : index === 3 ? '终面相关' : `第 ${index} 轮`;
  const lensBit =
    lens === 'tl' ? '团队负责人面' : lens === 'dh' ? '部门负责人面' : lens === 'hr' ? 'HR 面' : '面试';
  return `${round} · ${lensBit}`;
}

export const TINA_CURRENT_COMP = `现薪示意 60万 HKD（示例）· 雇主：${PLACEHOLDER_CURRENT_EMPLOYER}`;
export const TINA_TARGET_COMP = '目标年薪示意 90万 HKD（示例）';
