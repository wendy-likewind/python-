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
  getInterviewsForOpportunity,
  isPositioningComplete,
  loadState,
  roundLabelFor,
  saveState,
  SHORTLIST_MAX,
} from '@/lib/job-coach';
import type {
  CaseStatus,
  FireReview,
  InterviewCase,
  InterviewerLens,
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
  step1Done: boolean;
  opportunities: Opportunity[];
  interviews: InterviewCase[];
  lockPositioning: (draft: PositioningDraft) => void;
  resetPositioning: () => void;
  addOpportunity: (input: AddOpportunityInput) => Opportunity | null;
  setDecision: (id: string, decision: JobDecision) => boolean;
  setCaseStatus: (id: string, status: CaseStatus) => void;
  ensureInterview: (opportunityId: string, roundIndex?: number) => InterviewCase;
  addRound: (opportunityId: string, lens: InterviewerLens) => InterviewCase;
  updatePrep: (interviewId: string, prep: Partial<InterviewPrep>) => void;
  updateFire: (interviewId: string, fire: Partial<FireReview>) => void;
  archiveCase: (interviewId: string) => void;
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

  const step1Done = isPositioningComplete(state.positioning);

  const lockPositioning = useCallback((draft: PositioningDraft) => {
    const card: PositioningCard = {
      ...draft,
      narrative: buildNarrative(draft),
      lockedAt: new Date().toISOString(),
    };
    if (!isPositioningComplete(card)) {
      toast.error('请先完成定位：目标、动机、方法、电梯演讲、五个为什么、两个去向、增长主线');
      return;
    }
    setState((prev) => ({ ...prev, positioning: card }));
    toast.success('定位已保存。完成定位后，才可以把机会标为「投」');
  }, []);

  const resetPositioning = useCallback(() => {
    setState((prev) => ({
      ...prev,
      positioning: null,
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
    toast.message('已清空定位；原「投」项已改为「观望」');
  }, []);

  const addOpportunity = useCallback((input: AddOpportunityInput): Opportunity | null => {
    const ts = new Date().toISOString();
    const created: Opportunity = {
      id: createId('job'),
      ...input,
      salary: input.salary.trim() || '薪资不明',
      decision: 'pending',
      status: 'discovered',
      isIllustrative: false,
      createdAt: ts,
      updatedAt: ts,
    };
    setState((prev) => ({ ...prev, opportunities: [created, ...prev.opportunities] }));
    toast.success('已加入机会列表');
    return created;
  }, []);

  const setDecision = useCallback(
    (id: string, decision: JobDecision): boolean => {
      if (decision === 'apply' && !isPositioningComplete(state.positioning)) {
        toast.error('请先完成第一步定位，再标「投」；现在最多「观望」');
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
            toast.error(`建议机会列表不超过 ${SHORTLIST_MAX} 条，请先调整其他岗位`);
            ok = false;
            return prev;
          }
        }

        if (decision === 'apply') {
          const score = target.score;
          if (!score.jdFit.trim() || !score.levelFit.trim()) {
            toast.error('标「投」前请填写岗位匹配与级别匹配说明');
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

  const ensureInterview = useCallback(
    (opportunityId: string, roundIndex?: number): InterviewCase => {
      let result: InterviewCase | undefined;
      setState((prev) => {
        const existing = getInterviewForOpportunity(prev.interviews, opportunityId, roundIndex);
        if (existing) {
          result = existing;
          return prev;
        }
        const list = getInterviewsForOpportunity(prev.interviews, opportunityId);
        const nextIndex = roundIndex ?? (list.length > 0 ? list[list.length - 1].roundIndex : 1);
        const again = getInterviewForOpportunity(prev.interviews, opportunityId, nextIndex);
        if (again) {
          result = again;
          return prev;
        }
        const ts = new Date().toISOString();
        const created: InterviewCase = {
          id: createId('iv'),
          opportunityId,
          roundIndex: nextIndex,
          roundLabel: roundLabelFor(nextIndex, 'unknown'),
          prep: emptyPrep(),
          fire: emptyFire(),
          status: nextIndex >= 2 ? 'round2' : nextIndex === 1 ? 'round1' : 'applied',
          createdAt: ts,
          updatedAt: ts,
        };
        result = created;
        const oppStatus: CaseStatus =
          nextIndex >= 2 ? 'round2' : nextIndex === 1 ? 'round1' : 'applied';
        return {
          ...prev,
          opportunities: prev.opportunities.map((o) =>
            o.id === opportunityId
              ? {
                  ...o,
                  status: o.status === 'discovered' ? 'applied' : oppStatus,
                  updatedAt: ts,
                }
              : o,
          ),
          interviews: [...prev.interviews, created],
        };
      });
      return result!;
    },
    [],
  );

  const addRound = useCallback((opportunityId: string, lens: InterviewerLens): InterviewCase => {
    let result: InterviewCase | undefined;
    setState((prev) => {
      const list = getInterviewsForOpportunity(prev.interviews, opportunityId);
      const nextIndex = (list[list.length - 1]?.roundIndex ?? 0) + 1;
      const ts = new Date().toISOString();
      const created: InterviewCase = {
        id: createId('iv'),
        opportunityId,
        roundIndex: nextIndex,
        roundLabel: roundLabelFor(nextIndex, lens),
        prep: {
          ...emptyPrep(),
          interviewerLens: lens,
          interviewerName:
            lens === 'tl'
              ? '面试官X（团队负责人 · 示例）'
              : lens === 'dh'
                ? '面试官X（部门负责人 · 示例）'
                : '面试官X',
        },
        fire: emptyFire(),
        status: nextIndex >= 2 ? 'round2' : 'round1',
        createdAt: ts,
        updatedAt: ts,
      };
      result = created;
      const oppStatus: CaseStatus = nextIndex >= 2 ? 'round2' : 'round1';
      return {
        ...prev,
        opportunities: prev.opportunities.map((o) =>
          o.id === opportunityId ? { ...o, status: oppStatus, updatedAt: ts } : o,
        ),
        interviews: [...prev.interviews, created],
      };
    });
    toast.success('已添加新一轮面试准备');
    return result!;
  }, []);

  const updatePrep = useCallback((interviewId: string, prep: Partial<InterviewPrep>) => {
    setState((prev) => ({
      ...prev,
      interviews: prev.interviews.map((i) => {
        if (i.id !== interviewId) return i;
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

  const updateFire = useCallback((interviewId: string, fire: Partial<FireReview>) => {
    setState((prev) => ({
      ...prev,
      interviews: prev.interviews.map((i) =>
        i.id === interviewId
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

  const archiveCase = useCallback((interviewId: string) => {
    const ts = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      interviews: prev.interviews.map((i) =>
        i.id === interviewId
          ? { ...i, fire: { ...i.fire, archivedAt: ts }, updatedAt: ts }
          : i,
      ),
    }));
    toast.success('已写入我的案例');
  }, []);

  const resetDemo = useCallback(() => {
    setState(emptyState());
    toast.message('已恢复 Tina（示例）演示数据');
  }, []);

  const value = useMemo<JobCoachContextValue>(
    () => ({
      ready,
      positioning: state.positioning,
      step1Done,
      opportunities: state.opportunities,
      interviews: state.interviews,
      lockPositioning,
      resetPositioning,
      addOpportunity,
      setDecision,
      setCaseStatus,
      ensureInterview,
      addRound,
      updatePrep,
      updateFire,
      archiveCase,
      resetDemo,
    }),
    [
      ready,
      state,
      step1Done,
      lockPositioning,
      resetPositioning,
      addOpportunity,
      setDecision,
      setCaseStatus,
      ensureInterview,
      addRound,
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
