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
    interviewerName: '',
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

/** Illustrative seed — labeled in UI; not real openings. */
export const ILLUSTRATIVE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'demo-hk-fx-pm',
    title: 'FX / Payments Product Manager',
    company: '示例虚拟银行 · 零售产品',
    location: 'HK',
    postedAt: '2026-10-10',
    salary: '薪资不明',
    matchPoints: ['跨境支付/汇款相关经验可映射', '增长主线可对齐 volume/share', '香港市场'],
    riskPoints: ['JD 要求深度牌照经验需核对', '英语面试强度未知'],
    sourceUrl: 'https://example.com/jobs/illustrative-hk-fx-pm',
    jdText:
      '【示意 JD · 非真实岗位】Responsible for FX/remittance product growth in Hong Kong. Drive durable volume and share with compliance partnership. 3–5 years fintech/bank PM preferred.',
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
    title: 'Wealth Digital Product Manager',
    company: '示例持牌银行 · 财富科技',
    location: 'HK',
    postedAt: '2026-10-12',
    salary: '示意：HKD 公开带未核实',
    matchPoints: ['理财模块搭建可作证据', '银行协作经验'],
    riskPoints: ['主线若偏 FX 则对齐偏弱 → 倾向观望'],
    sourceUrl: 'https://example.com/jobs/illustrative-hk-wealth',
    jdText:
      '【示意 JD】Drive digital wealth journeys; partner with compliance and ops. Prefer bank PM background.',
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
    title: 'Product Manager, Cross-border',
    company: '示例 Fintech · 区域产品',
    location: 'SG',
    postedAt: '2026-10-14',
    salary: '薪资不明',
    matchPoints: ['跨境叙事可复用', '三角市场扩展场景'],
    riskPoints: ['筛岗技能默认 HK-only；扩展需用户确认'],
    sourceUrl: 'https://example.com/jobs/illustrative-sg',
    jdText: '【示意 JD】Cross-border payments product for SEA; Singapore-based.',
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
