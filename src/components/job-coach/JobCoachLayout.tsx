import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Compass, Kanban, Mic2, ArrowLeft, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobCoachProvider, useJobCoach } from '@/contexts/JobCoachContext';
import { Badge } from '@/components/ui/badge';
import { PIPELINE_STEPS } from '@/types/job-coach';
import { PRIVACY_BANNER } from '@/lib/job-coach-privacy';

function Shell() {
  const { step1Done, positioning } = useJobCoach();
  const location = useLocation();
  const onInterview = location.pathname.includes('/interview');
  const onLibrary = onInterview && new URLSearchParams(location.search).get('tab') === 'library';

  const navItems = [
    { to: '/job-coach/gate0', label: '定位', icon: Compass, active: location.pathname.includes('/gate0') },
    { to: '/job-coach/board', label: '机会', icon: Kanban, active: location.pathname.includes('/board') },
    {
      to: '/job-coach/interview',
      label: '准备面试',
      icon: Mic2,
      active: onInterview && !onLibrary,
    },
    {
      to: '/job-coach/interview?tab=library',
      label: '我的案例',
      icon: BookOpen,
      active: onLibrary,
    },
  ];

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
                <p className="text-sm font-semibold tracking-tight truncate">求职陪跑</p>
                <p className="text-[11px] text-[#2C3531]/40 truncate">
                  香港 · 新加坡 · 深圳 · 示例草稿 · 不代投
                </p>
              </div>
            </div>
            {step1Done ? (
              <Badge
                variant="secondary"
                className="bg-[#A8C6A1]/15 text-[#2C3531] border-none font-normal max-w-[55%] truncate"
                title={positioning?.narrative}
              >
                {positioning?.personaLabel ?? '定位已完成'}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-amber-50 text-amber-700 border-none font-normal"
              >
                请先完成定位
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {PIPELINE_STEPS.map((g) => (
              <span
                key={g.id}
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full',
                  g.v1 === 'live'
                    ? 'bg-white text-[#2C3531]/55 border border-[#A8C6A1]/20'
                    : 'bg-[#2C3531]/5 text-[#2C3531]/35',
                )}
                title={g.v1 === 'next' ? '这一版先不做，留作下一步' : undefined}
              >
                {g.step}
                {g.name}
                {g.v1 === 'next' ? '（下一步）' : ''}
              </span>
            ))}
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-0.5">
            {navItems.map(({ to, label, icon: Icon, active }) => (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-all',
                  active
                    ? 'bg-[#A8C6A1] text-white shadow-sm shadow-[#A8C6A1]/25'
                    : 'text-[#2C3531]/60 hover:bg-white hover:text-[#2C3531]',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>
          <p className="text-[11px] text-[#2C3531]/40 leading-relaxed">{PRIVACY_BANNER}</p>
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
