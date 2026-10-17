import { Link, NavLink, Outlet } from 'react-router-dom';
import { Compass, Kanban, Mic2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobCoachProvider, useJobCoach } from '@/contexts/JobCoachContext';
import { Badge } from '@/components/ui/badge';
import { PIPELINE_GATES } from '@/types/job-coach';

const navItems = [
  { to: '/job-coach/gate0', label: 'Gate0 投递前反思', icon: Compass },
  { to: '/job-coach/board', label: 'Gate1 筛岗看板', icon: Kanban },
  { to: '/job-coach/interview', label: '面试工作台', icon: Mic2 },
];

function Shell() {
  const { gate0Passed, positioning } = useJobCoach();

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#2C3531] selection:bg-[#A8C6A1]/30 font-sans">
      <header className="sticky top-0 z-40 border-b border-[#A8C6A1]/15 bg-[#F7F9F6]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-[#2C3531]/50 hover:text-[#5B8FA8] transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                主页
              </Link>
              <div className="h-4 w-px bg-[#A8C6A1]/30" />
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight truncate">
                  港 fintech 求职陪跑
                </p>
                <p className="text-[11px] text-[#2C3531]/40 truncate">
                  方法论硬门禁 · 港/新/深 · V1 草稿 · 不代投
                </p>
              </div>
            </div>
            {gate0Passed ? (
              <Badge
                variant="secondary"
                className="bg-[#A8C6A1]/15 text-[#2C3531] border-none font-normal max-w-[50%] truncate"
                title={positioning?.narrative}
              >
                Gate0 已通过
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-amber-50 text-amber-700 border-none font-normal"
              >
                Gate0 未过 · 不可投
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {PIPELINE_GATES.map((g) => (
              <span
                key={g.id}
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full',
                  g.v1 === 'live'
                    ? 'bg-white text-[#2C3531]/55 border border-[#A8C6A1]/20'
                    : 'bg-[#2C3531]/5 text-[#2C3531]/35 line-through decoration-[#2C3531]/20',
                )}
                title={g.v1 === 'next' ? 'V1 锁定为下一步（Gate2 简历 / Gate6 谈薪）' : 'V1 可点'}
              >
                G{g.id} {g.name}
                {g.v1 === 'next' ? ' · 下一步' : ''}
              </span>
            ))}
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-0.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-[#A8C6A1] text-white shadow-sm shadow-[#A8C6A1]/25'
                      : 'text-[#2C3531]/60 hover:bg-white hover:text-[#2C3531]',
                  )
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default function JobCoachLayout() {
  return (
    <JobCoachProvider>
      <Shell />
    </JobCoachProvider>
  );
}
