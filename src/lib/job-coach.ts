import type {
  FiveWhys,
  InterviewCase,
  InterviewPrep,
  JobCoachState,
  MarketLocation,
  MethodBlock,
  Opportunity,
  PositioningCard,
  TwoWheres,
} from '@/types/job-coach';
import { STORAGE_KEY } from '@/types/job-coach';
import { PLACEHOLDER_INTERVIEWER } from '@/lib/job-coach-privacy';

export const DEFAULT_MARKETS: MarketLocation[] = ['HK', 'SG', 'SZ'];

/** fintech-pm: shortlist 3–8 */
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

/**
 * Illustrative seed — synthetic only.
 * Companies: 公司A/B/C. No real employers, interviewers, Notion URLs, or package numbers.
 */
export const ILLUSTRATIVE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'demo-hk-fx-pm',
    title: '跨境支付产品经理（示意）',
    company: '公司A · 虚拟银行条线（示意）',
    location: 'HK',
    postedAt: '2026-10-10',
    salary: '薪资不明',
    matchPoints: ['跨境支付/汇款经验可映射（示意）', '增长主线可对齐 volume/share', '香港市场'],
    riskPoints: ['牌照深度要求需候选人自行核对', '面试语言强度未知'],
    sourceUrl: 'https://example.com/jobs/illustrative-co-a',
    jdText:
      '【示意 JD · 非真实岗位 · 已脱敏】公司A 招聘跨境支付/汇款方向 PM。推动可持续交易量与份额，协同合规。要求 fintech/bank PM 经验（示意条件）。',
    score: {
      jdFit: '示意：must-have 与跨境交付可部分映射',
      levelFit: '示意：偏中高级 PM',
      salaryNote: '薪资不明',
      companyType: 'virtual_bank',
      mainlineAlignment: '需对照定位卡增长主线后判定',
      verdictWhy: '示意岗位，仅供走通流程',
    },
    decision: 'pending',
    status: 'discovered',
    isIllustrative: true,
    createdAt: '2026-10-10T08:00:00.000Z',
    updatedAt: '2026-10-10T08:00:00.000Z',
  },
  {
    id: 'demo-hk-wealth-pm',
    title: '财富数字化产品经理（示意）',
    company: '公司B · 持牌银行条线（示意）',
    location: 'HK',
    postedAt: '2026-10-12',
    salary: '薪资不明',
    matchPoints: ['理财模块搭建可作证据（示意）', '银行协作经验（示意）'],
    riskPoints: ['主线若偏支付则对齐偏弱 → 倾向观望'],
    sourceUrl: 'https://example.com/jobs/illustrative-co-b',
    jdText:
      '【示意 JD · 非真实岗位 · 已脱敏】公司B 推动数字财富旅程；协同合规与运营。偏好银行 PM 背景（示意）。',
    score: {
      jdFit: '示意：部分命中财富数字化',
      levelFit: '示意：级别待核对',
      salaryNote: '薪资不明',
      companyType: 'bank',
      mainlineAlignment: '若主线非财富增长 → 观望',
      verdictWhy: '示意数据',
    },
    decision: 'pending',
    status: 'discovered',
    isIllustrative: true,
    createdAt: '2026-10-12T08:00:00.000Z',
    updatedAt: '2026-10-12T08:00:00.000Z',
  },
  {
    id: 'demo-sg-pm',
    title: '跨境产品经理（示意）',
    company: '公司C · Fintech（示意）',
    location: 'SG',
    postedAt: '2026-10-14',
    salary: '薪资不明',
    matchPoints: ['跨境叙事可复用（示意）', '三角市场扩展场景'],
    riskPoints: ['筛岗技能默认 HK-only；扩展需用户确认'],
    sourceUrl: 'https://example.com/jobs/illustrative-co-c',
    jdText:
      '【示意 JD · 非真实岗位 · 已脱敏】公司C · 新加坡基地 · 跨境支付产品（示意描述，无真实链接）。',
    score: {
      jdFit: '示意',
      levelFit: '示意',
      salaryNote: '薪资不明',
      companyType: 'fintech_other',
      mainlineAlignment: '地理扩展需用户显式打开三角模式',
      verdictWhy: '示意 · 新加坡',
    },
    decision: 'pending',
    status: 'discovered',
    isIllustrative: true,
    createdAt: '2026-10-14T08:00:00.000Z',
    updatedAt: '2026-10-14T08:00:00.000Z',
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

export function emptyState(): JobCoachState {
  return {
    positioning: null,
    opportunities: ILLUSTRATIVE_OPPORTUNITIES,
    interviews: [],
  };
}

export function loadState(): JobCoachState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as JobCoachState;
    return {
      positioning: parsed.positioning ?? null,
      opportunities:
        Array.isArray(parsed.opportunities) && parsed.opportunities.length > 0
          ? parsed.opportunities
          : ILLUSTRATIVE_OPPORTUNITIES,
      interviews: Array.isArray(parsed.interviews) ? parsed.interviews : [],
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

export function getInterviewForOpportunity(
  interviews: InterviewCase[],
  opportunityId: string,
): InterviewCase | undefined {
  return interviews.find((i) => i.opportunityId === opportunityId);
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
