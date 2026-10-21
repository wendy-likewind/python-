import Home from './pages/Home';
import Workbench from './pages/Workbench';
import JobCoachLayout from './components/job-coach/JobCoachLayout';
import JobCoachIndex from './pages/job-coach/JobCoachIndex';
import Gate0Wizard from './pages/job-coach/Gate0Wizard';
import OpportunityBoard from './pages/job-coach/OpportunityBoard';
import InterviewWorkspace from './pages/job-coach/InterviewWorkspace';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    public: true,
  },
  {
    name: '今日工作台',
    path: '/workbench',
    element: <Workbench />,
    public: true,
  },
  {
    name: '今日工作台目录',
    path: '/workbench/',
    element: <Workbench />,
    public: true,
  },
  {
    name: '求职陪跑',
    path: '/job-coach',
    element: <JobCoachLayout />,
    public: true,
    children: [
      {
        name: 'Index',
        path: '',
        element: <JobCoachIndex />,
        public: true,
      },
      {
        name: 'Gate0',
        path: 'gate0',
        element: <Gate0Wizard />,
        public: true,
      },
      {
        name: 'Board',
        path: 'board',
        element: <OpportunityBoard />,
        public: true,
      },
      {
        name: 'Interview',
        path: 'interview',
        element: <InterviewWorkspace />,
        public: true,
      },
      {
        name: 'InterviewDetail',
        path: 'interview/:opportunityId',
        element: <InterviewWorkspace />,
        public: true,
      },
    ],
  },
];
