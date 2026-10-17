/**
 * 港 fintech 求职包 V1 — types aligned to career-advisor skill pack.
 * User-facing copy uses 第一步/第二步…; "GateN" stays in comments only.
 */

export type MarketLocation = 'HK' | 'SG' | 'SZ';

/** Verdicts: 投 / 观望 / 不投 */
export type JobDecision = 'pending' | 'apply' | 'watch' | 'reject';

/** Progress statuses from 面后复盘入库 */
export type CaseStatus =
  | 'discovered' // 发现
  | 'applied' // 已投
  | 'round1' // 一轮
  | 'round2' // 二轮
  | 'final' // 终面
  | 'offer' // 通过
  | 'rejected' // 拒信
  | 'withdrawn'; // 放弃

export type CompanyType = 'bank' | 'virtual_bank' | 'fintech_other' | 'unknown';

export type InterviewerLens = 'tl' | 'dh' | 'hr' | 'mixed' | 'unknown';

/** Step 1 · 5 Whys axes from methodology */
export interface FiveWhys {
  industry: string;
  companyFamily: string;
  location: string;
  whyMe: string;
  whyNotMe: string;
}

export interface TwoWheres {
  fiveYear: string;
  longerArc: string;
}

export interface PositioningCard {
  what: string;
  targetLevel: string;
  targetDomain: string;
  why: string;
  how: string;
  provenDeliveries: string[];
  elevatorPitch: string;
  fiveWhys: FiveWhys;
  twoWheres: TwoWheres;
  growthMainline: string;
  narrative: string;
  lockedAt: string;
  /** Illustrative persona label, e.g. Tina（示例） */
  personaLabel?: string;
}

export interface OpportunityScore {
  jdFit: string;
  levelFit: string;
  salaryNote: string;
  companyType: CompanyType;
  mainlineAlignment: string;
  verdictWhy: string;
}

export interface Opportunity {
  id: string;
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
  decision: JobDecision;
  status: CaseStatus;
  isIllustrative: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MethodBlock {
  problem: string;
  goals: string;
  strategy: string;
  execution: string;
  fireRetro: string;
  institutionalize: string;
}

export interface StarStory {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  lensTag: InterviewerLens;
  retired: boolean;
}

export interface InterviewPrep {
  method: MethodBlock;
  starStories: StarStory[];
  useTheirProduct: string;
  reverseQuestions: string;
  opener: string;
  interviewerName: string;
  interviewerLens: InterviewerLens;
  interviewerBrief: string;
  fiveWhysAnswers: string;
}

/** FIRE = 事实 → 洞察 → 建议 → 执行 */
export interface FireReview {
  facts: string;
  insights: string;
  recommendations: string;
  execution: string;
  oneLineVerdict: string;
  landed: string;
  misfired: string;
  storiesToRetire: string;
  reverseQFixes: string;
  nextActions: string;
  nextDocFeed: string;
  reviewedAt?: string;
  archivedAt?: string;
}

export interface InterviewCase {
  id: string;
  opportunityId: string;
  /** 1 = 一轮, 2 = 二轮, … */
  roundIndex: number;
  /** User-facing, e.g. 一轮 · 团队负责人面 */
  roundLabel: string;
  prep: InterviewPrep;
  fire: FireReview;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobCoachState {
  positioning: PositioningCard | null;
  opportunities: Opportunity[];
  interviews: InterviewCase[];
}

export const MARKET_LABELS: Record<MarketLocation, string> = {
  HK: '香港',
  SG: '新加坡',
  SZ: '深圳',
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  discovered: '发现',
  applied: '已投',
  round1: '一轮',
  round2: '二轮',
  final: '终面',
  offer: '通过',
  rejected: '拒信',
  withdrawn: '放弃',
};

export const DECISION_LABELS: Record<JobDecision, string> = {
  pending: '待定',
  apply: '投',
  watch: '观望',
  reject: '不投',
};

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  bank: '外资银行',
  virtual_bank: '虚拟银行',
  fintech_other: '其他 fintech',
  unknown: '未标注',
};

export const LENS_LABELS: Record<InterviewerLens, string> = {
  tl: '团队负责人',
  dh: '部门负责人',
  hr: 'HR',
  mixed: '混合面板',
  unknown: '未定',
};

export const FIVE_WHYS_LABELS: Record<keyof FiveWhys, string> = {
  industry: '为什么这个行业',
  companyFamily: '为什么这类雇主',
  location: '为什么这个市场',
  whyMe: '为什么是我',
  whyNotMe: '缺口与已缓解',
};

export const STORAGE_KEY = 'hk-fintech-jobpack-v1-tina';

/** User-facing pipeline steps (methodology G0–G6 → 第一步…第七步) */
export const PIPELINE_STEPS = [
  { id: 0, step: '第一步', name: '定位', v1: 'live' as const },
  { id: 1, step: '第二步', name: '机会', v1: 'live' as const },
  { id: 2, step: '第三步', name: '简历主线', v1: 'next' as const },
  { id: 3, step: '第四步', name: '准备面试', v1: 'live' as const },
  { id: 4, step: '第五步', name: '面后复盘', v1: 'live' as const },
  { id: 5, step: '第六步', name: '我的案例', v1: 'live' as const },
  { id: 6, step: '第七步', name: '谈薪', v1: 'next' as const },
] as const;
