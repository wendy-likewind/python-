import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  buildNarrative,
  createId,
  emptyFire,
  emptyPrep,
  emptyState,
  getInterviewForOpportunity,
  isPositioningComplete,
  loadState,
  saveState,
  SHORTLIST_MAX,
} from '@/lib/job-coach';
import type {
  CaseStatus,
  FireReview,
  InterviewCase,
  InterviewPrep,
  JobCoachState,
  JobDecision,
  MarketLocation,
  Opportunity,
  OpportunityScore,
  PositioningCard,
} from '@/types/job-coach';
import { toast } from 'sonner';

type PositioningDraft = Omit<PositioningCard, 'narrative' | 'lockedAt'>;

interface AddOpportunityInput {
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
}

interface JobCoachContextValue {
  ready: boolean;
  positioning: PositioningCard | null;
  gate0Passed: boolean;
  opportunities: Opportunity[];
  interviews: InterviewCase[];
  lockPositioning: (draft: PositioningDraft) => void;
  resetPositioning: () => void;
  addOpportunity: (input: AddOpportunityInput) => Opportunity | null;
  setDecision: (id: string, decision: JobDecision) => boolean;
  setCaseStatus: (id: string, status: CaseStatus) => void;
  ensureInterview: (opportunityId: string) => InterviewCase;
  updatePrep: (opportunityId: string, prep: Partial<InterviewPrep>) => void;
  updateFire: (opportunityId: string, fire: Partial<FireReview>) => void;
  archiveCase: (opportunityId: string) => void;
  resetDemo: () => void;
}

const JobCoachContext = createContext<JobCoachContextValue | null>(null);

function decisionToStatus(decision: JobDecision, current: CaseStatus): CaseStatus {
  if (decision === 'apply') {
    if (current === 'discovered' || current === 'withdrawn') return 'applied';
    return current;
  }
  if (decision === 'reject') return 'withdrawn';
  return current;
}

export function JobCoachProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<JobCoachState>(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState(state);
  }, [state, ready]);

  const gate0Passed = isPositioningComplete(state.positioning);

  const lockPositioning = useCallback((draft: PositioningDraft) => {
    const card: PositioningCard = {
      ...draft,
      narrative: buildNarrative(draft),
      lockedAt: new Date().toISOString(),
    };
    if (!isPositioningComplete(card)) {
      toast.error('Gate0 硬门禁未过：WHAT/WHY/HOW、电梯演讲、5 Whys、2 Wheres、增长主线均需填写');
      return;
    }
    setState((prev) => ({ ...prev, positioning: card }));
    toast.success('定位卡已锁定 — 下游只读；未过 Gate0 不可标「投」');
  }, []);

  const resetPositioning = useCallback(() => {
    setState((prev) => ({
      ...prev,
      positioning: null,
      // Clear apply decisions when unlocking Gate0
      opportunities: prev.opportunities.map((o) =>
        o.decision === 'apply'
          ? {
              ...o,
              decision: 'watch' as const,
              status: o.status === 'applied' ? ('discovered' as const) : o.status,
              updatedAt: new Date().toISOString(),
            }
          : o,
      ),
    }));
    toast.message('已清空定位卡；原「投」项已降为「观望」');
  }, []);

  const addOpportunity = useCallback((input: AddOpportunityInput): Opportunity | null => {
    const now = new Date().toISOString();
    const created: Opportunity = {
      id: createId('job'),
      ...input,
      salary: input.salary.trim() || '薪资不明',
      decision: 'pending',
      status: 'discovered',
      isIllustrative: false,
      createdAt: now,
      updatedAt: now,
    };
    setState((prev) => ({ ...prev, opportunities: [created, ...prev.opportunities] }));
    toast.success('已加入机会看板（状态：发现）');
    return created;
  }, []);

  const setDecision = useCallback(
    (id: string, decision: JobDecision): boolean => {
      if (decision === 'apply' && !isPositioningComplete(state.positioning)) {
        toast.error('Gate0 硬门禁：定位卡未通过前不可标「投」，最多观望');
        return false;
      }

      let ok = true;
      setState((prev) => {
        const target = prev.opportunities.find((o) => o.id === id);
        if (!target) {
          ok = false;
          return prev;
        }

        if (decision === 'apply' || decision === 'watch') {
          const others = prev.opportunities.filter(
            (o) => o.id !== id && (o.decision === 'apply' || o.decision === 'watch'),
          ).length;
          if (others >= SHORTLIST_MAX) {
            toast.error(`短名单上限 ${SHORTLIST_MAX}（fintech-pm），请先调整其他岗位`);
            ok = false;
            return prev;
          }
        }

        if (decision === 'apply') {
          const score = target.score;
          if (!score.jdFit.trim() || !score.levelFit.trim()) {
            toast.error('Gate1：投递前需填写评分卡的 JD fit 与 Level fit');
            ok = false;
            return prev;
          }
        }

        const status = decisionToStatus(decision, target.status);
        return {
          ...prev,
          opportunities: prev.opportunities.map((o) =>
            o.id === id
              ? { ...o, decision, status, updatedAt: new Date().toISOString() }
              : o,
          ),
        };
      });
      return ok;
    },
    [state.positioning],
  );

  const setCaseStatus = useCallback((id: string, status: CaseStatus) => {
    setState((prev) => ({
      ...prev,
      opportunities: prev.opportunities.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o,
      ),
      interviews: prev.interviews.map((i) =>
        i.opportunityId === id
          ? { ...i, status, updatedAt: new Date().toISOString() }
          : i,
      ),
    }));
  }, []);

  const ensureInterview = useCallback((opportunityId: string): InterviewCase => {
    let result: InterviewCase | undefined;
    setState((prev) => {
      const existing = getInterviewForOpportunity(prev.interviews, opportunityId);
      if (existing) {
        result = existing;
        return prev;
      }
      const now = new Date().toISOString();
      const opp = prev.opportunities.find((o) => o.id === opportunityId);
      const created: InterviewCase = {
        id: createId('iv'),
        opportunityId,
        prep: emptyPrep(),
        fire: emptyFire(),
        status: opp?.status === 'discovered' ? 'applied' : (opp?.status ?? 'applied'),
        createdAt: now,
        updatedAt: now,
      };
      result = created;
      return {
        ...prev,
        opportunities: prev.opportunities.map((o) => {
          if (o.id !== opportunityId) return o;
          // Opening prep does not invent rounds; keep 已投 until user advances status
          return {
            ...o,
            status: o.status === 'discovered' ? 'applied' : o.status,
            updatedAt: now,
          };
        }),
        interviews: [...prev.interviews, created],
      };
    });
    return result!;
  }, []);

  const updatePrep = useCallback((opportunityId: string, prep: Partial<InterviewPrep>) => {
    setState((prev) => ({
      ...prev,
      interviews: prev.interviews.map((i) => {
        if (i.opportunityId !== opportunityId) return i;
        const nextPrep: InterviewPrep = {
          ...i.prep,
          ...prep,
          method: prep.method ? { ...i.prep.method, ...prep.method } : i.prep.method,
          starStories: prep.starStories ?? i.prep.starStories,
        };
        return { ...i, prep: nextPrep, updatedAt: new Date().toISOString() };
      }),
    }));
  }, []);

  const updateFire = useCallback((opportunityId: string, fire: Partial<FireReview>) => {
    setState((prev) => ({
      ...prev,
      interviews: prev.interviews.map((i) =>
        i.opportunityId === opportunityId
          ? {
              ...i,
              fire: {
                ...i.fire,
                ...fire,
                reviewedAt: i.fire.reviewedAt ?? new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : i,
      ),
    }));
  }, []);

  const archiveCase = useCallback((opportunityId: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      interviews: prev.interviews.map((i) =>
        i.opportunityId === opportunityId
          ? {
              ...i,
              fire: { ...i.fire, archivedAt: now },
              updatedAt: now,
            }
          : i,
      ),
    }));
    toast.success('已写入案例库 stub（Gate5 · 面后入库）');
  }, []);

  const resetDemo = useCallback(() => {
    setState(emptyState());
    toast.message('已恢复示意数据');
  }, []);

  const value = useMemo<JobCoachContextValue>(
    () => ({
      ready,
      positioning: state.positioning,
      gate0Passed,
      opportunities: state.opportunities,
      interviews: state.interviews,
      lockPositioning,
      resetPositioning,
      addOpportunity,
      setDecision,
      setCaseStatus,
      ensureInterview,
      updatePrep,
      updateFire,
      archiveCase,
      resetDemo,
    }),
    [
      ready,
      state,
      gate0Passed,
      lockPositioning,
      resetPositioning,
      addOpportunity,
      setDecision,
      setCaseStatus,
      ensureInterview,
      updatePrep,
      updateFire,
      archiveCase,
      resetDemo,
    ],
  );

  return <JobCoachContext.Provider value={value}>{children}</JobCoachContext.Provider>;
}

export function useJobCoach() {
  const ctx = useContext(JobCoachContext);
  if (!ctx) throw new Error('useJobCoach must be used within JobCoachProvider');
  return ctx;
}
