/**
 * 港 fintech 求职包 V1 — types aligned to career-advisor skill pack:
 * fintech · fintech-pm · interview-doc · interview-debrief · archive
 */

export type MarketLocation = 'HK' | 'SG' | 'SZ';

/** fintech-pm verdicts */
export type JobDecision = 'pending' | 'apply' | 'watch' | 'reject';

/** archive / progress statuses */
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

/** Gate 0 · 5 Whys fixed axes from fintech.md */
export interface FiveWhys {
  industry: string;
  companyFamily: string;
  location: string;
  whyMe: string;
  whyNotMe: string;
}

/** Gate 0 · 2 Wheres — ~5y and longer arc */
export interface TwoWheres {
  fiveYear: string;
  longerArc: string;
}

export interface PositioningCard {
  /** WHAT — target level + domain */
  what: string;
  targetLevel: string;
  targetDomain: string;
  /** WHY — why move now / employer family */
  why: string;
  /** HOW — growth mainline + 2–3 proven deliveries */
  how: string;
  provenDeliveries: string[];
  elevatorPitch: string;
  fiveWhys: FiveWhys;
  twoWheres: TwoWheres;
  /** Named growth mainline — resume + interviews lock to this */
  growthMainline: string;
  /** One-line narrative for downstream read-only lock */
  narrative: string;
  lockedAt: string;
}

/** Gate1 scoring card (fintech-pm) */
export interface OpportunityScore {
  jdFit: string;
  levelFit: string;
  salaryNote: string; // band or 薪资不明
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
  salary: string; // shown band or 薪资不明
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

/** METHOD block — 你会怎么做事 (interview-doc / fintech) */
export interface MethodBlock {
  problem: string; // 问题 K/W
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
  /** 用对方产品 → pain → prioritized fix */
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
  bank: '银行',
  virtual_bank: '虚拟银行',
  fintech_other: '其他 fintech',
  unknown: '未标注',
};

export const LENS_LABELS: Record<InterviewerLens, string> = {
  tl: 'Team Leader',
  dh: '主管 / Department Head',
  hr: 'HR',
  mixed: '混合面板',
  unknown: '未定',
};

export const FIVE_WHYS_LABELS: Record<keyof FiveWhys, string> = {
  industry: 'Industry · 为什么这个行业',
  companyFamily: 'Company family · 为什么这类雇主',
  location: 'Location · 为什么这个市场',
  whyMe: 'Why me · 为什么是我',
  whyNotMe: 'Why not me · 缺口与已缓解',
};

export const STORAGE_KEY = 'hk-fintech-jobpack-v1';

/** Pipeline gates shown in UI (fintech.md) */
export const PIPELINE_GATES = [
  { id: 0, name: '投递前反思', v1: 'live' as const },
  { id: 1, name: '筛岗', v1: 'live' as const },
  { id: 2, name: '增长主线简历', v1: 'next' as const },
  { id: 3, name: '面试文档', v1: 'live' as const },
  { id: 4, name: '面试复盘', v1: 'live' as const },
  { id: 5, name: '面后入库', v1: 'live' as const },
  { id: 6, name: '谈薪', v1: 'next' as const },
] as const;
