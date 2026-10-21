import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CircleDollarSign, ListChecks, Sparkles, Target } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  dayNumber,
  formatGeneratedAt,
  formatHkd,
  formatWorkbenchDate,
  loadWorkbench,
  type WorkbenchLoadResult,
} from '@/lib/workbench';
import { cn } from '@/lib/utils';
import type { WorkbenchTodo, WorkbenchView } from '@/types/workbench';

const sectionTitle = 'text-sm font-medium tracking-wide text-[#2C3531]/70';

function statusLabel(todo: WorkbenchTodo): string | null {
  if (todo.status === 'pending') return '待确认';
  if (todo.status === 'done') return '已完成';
  if (todo.status === 'open') return '进行中';
  return null;
}

function QuietEmpty({ children }: { children: string }) {
  return <p className="text-sm text-[#2C3531]/45 leading-relaxed">{children}</p>;
}

function WorkbenchReady({ data }: { data: WorkbenchView }) {
  const generated = data.generated_at ? formatGeneratedAt(data.generated_at, data.timezone) : null;
  const dateLabel = formatWorkbenchDate(data.date, data.timezone);
  const spend = data.spend;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#2C3531]/50 hover:text-[#5B8FA8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            主页
          </Link>
          <span className="text-xs text-[#2C3531]/35">可收藏此页</span>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">今日工作台</h1>
          {dateLabel ? <p className="text-lg text-[#5B8FA8] font-light">{dateLabel}</p> : null}
          {generated ? (
            <p className="text-xs text-[#2C3531]/45">更新于 {generated}</p>
          ) : (
            <p className="text-xs text-[#2C3531]/35">未标注更新时间</p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-[#A8C6A1]/15 bg-white shadow-sm rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className={cn(sectionTitle, 'flex items-center gap-2')}>
              <ListChecks className="w-4 h-4 text-[#A8C6A1]" />
              今日待办
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.todos.length === 0 ? (
              <QuietEmpty>今天没有记下待办。</QuietEmpty>
            ) : (
              data.todos.map((todo, index) => {
                const label = statusLabel(todo);
                return (
                  <div key={`${todo.title}-${index}`} className="flex items-start gap-3">
                    <span
                      className={cn(
                        'mt-1.5 h-2 w-2 rounded-full shrink-0',
                        todo.status === 'pending' ? 'bg-amber-300' : 'bg-[#A8C6A1]',
                        todo.status === 'done' && 'bg-[#2C3531]/20',
                      )}
                    />
                    <div className="min-w-0 space-y-1">
                      <p
                        className={cn(
                          'text-[15px] leading-snug text-[#2C3531]',
                          todo.status === 'done' && 'text-[#2C3531]/40 line-through',
                        )}
                      >
                        {todo.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#2C3531]/45">
                        {todo.time ? <span>{todo.time}</span> : null}
                        {todo.note ? <span>{todo.note}</span> : null}
                        {label ? (
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5',
                              todo.status === 'pending'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-[#A8C6A1]/15 text-[#2C3531]/60',
                            )}
                          >
                            {label}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-[#A8C6A1]/15 bg-white shadow-sm rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className={cn(sectionTitle, 'flex items-center gap-2')}>
              <CircleDollarSign className="w-4 h-4 text-[#5B8FA8]" />
              今日花费
              <span className="font-normal text-[#2C3531]/35">HKD</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spend.total_hkd === undefined && spend.items.length === 0 ? (
              <QuietEmpty>今天没有记下花费。</QuietEmpty>
            ) : (
              <>
                {spend.total_hkd !== undefined ? (
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#2C3531]/40 mb-1">今日合计</p>
                      <p className="text-3xl font-semibold tracking-tight text-[#2C3531]">
                        HK${formatHkd(spend.total_hkd)}
                      </p>
                    </div>
                    {spend.week_total_hkd !== undefined ? (
                      <p className="text-sm text-[#2C3531]/50 pb-1">
                        本周累计 HK${formatHkd(spend.week_total_hkd)}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {spend.items.length > 0 ? (
                  <ul className="divide-y divide-[#A8C6A1]/15">
                    {spend.items.map((item, index) => (
                      <li
                        key={`${item.label}-${item.amount_hkd}-${index}`}
                        className="flex items-center justify-between gap-3 py-2 text-sm"
                      >
                        <span className="text-[#2C3531]/75">
                          {item.label}
                          {item.note ? <span className="ml-2 text-xs text-[#2C3531]/35">{item.note}</span> : null}
                        </span>
                        <span className="tabular-nums text-[#2C3531]/80">{formatHkd(item.amount_hkd)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#A8C6A1]/15 bg-white shadow-sm rounded-3xl">
        <CardHeader className="pb-2">
          <CardTitle className={cn(sectionTitle, 'flex items-center gap-2')}>
            <Sparkles className="w-4 h-4 text-[#5B8FA8]" />
            今日重要信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.intel.length === 0 ? (
            <QuietEmpty>今天没有记下重要信息。</QuietEmpty>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.intel.map((item) => (
                <li key={item.title} className="rounded-2xl bg-[#F7F9F6] px-4 py-3">
                  <p className="text-sm font-medium text-[#2C3531]">{item.title}</p>
                  {item.detail ? (
                    <p className="mt-1 text-sm leading-relaxed text-[#2C3531]/60">{item.detail}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#A8C6A1]/15 bg-white shadow-sm rounded-3xl">
        <CardHeader className="pb-2">
          <CardTitle className={cn(sectionTitle, 'flex items-center gap-2')}>
            <Target className="w-4 h-4 text-[#A8C6A1]" />
            本周目标
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.week_goals.length === 0 ? (
            <QuietEmpty>这周还没有写下目标。</QuietEmpty>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.week_goals.map((goal) => (
                <li key={goal.title} className="rounded-2xl border border-[#A8C6A1]/15 bg-[#F7F9F6]/70 px-4 py-3">
                  <p className="text-sm font-medium text-[#2C3531]">{goal.title}</p>
                  {goal.detail ? <p className="mt-1 text-sm leading-relaxed text-[#2C3531]/60">{goal.detail}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#A8C6A1]/15 bg-white shadow-sm rounded-3xl">
        <CardHeader className="pb-2">
          <CardTitle className={cn(sectionTitle, 'flex items-center gap-2')}>
            <CalendarDays className="w-4 h-4 text-[#5B8FA8]" />
            本周日程一览
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.week_calendar.length === 0 ? (
            <QuietEmpty>这周还没有日程。</QuietEmpty>
          ) : (
            <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {data.week_calendar.map((day) => {
                const isToday = day.date === data.date;
                return (
                  <li
                    key={day.date}
                    className={cn(
                      'rounded-2xl px-2.5 py-3 min-h-[7.5rem]',
                      isToday
                        ? 'bg-[#A8C6A1]/15 ring-1 ring-[#A8C6A1]/40'
                        : 'bg-[#F7F9F6]',
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-1 mb-2">
                      <span className="text-xs font-medium text-[#2C3531]/70">{day.weekday}</span>
                      <span className="text-[11px] tabular-nums text-[#2C3531]/35">{dayNumber(day.date)}</span>
                    </div>
                    {isToday ? (
                      <p className="text-[10px] text-[#2C3531]/50 mb-1.5">今天</p>
                    ) : null}
                    <div className="flex flex-col gap-1">
                      {day.chips.length === 0 ? (
                        <span className="text-[11px] text-[#2C3531]/30">空</span>
                      ) : (
                        day.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-white px-2 py-0.5 text-[11px] leading-snug text-[#2C3531]/70 border border-[#A8C6A1]/15"
                          >
                            {chip}
                          </span>
                        ))
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WorkbenchEmpty() {
  return (
    <div className="max-w-lg mx-auto py-16 text-center space-y-4">
      <p className="text-xs tracking-widest uppercase text-[#A8C6A1]">Workbench</p>
      <h1 className="text-3xl font-semibold tracking-tight">今日工作台</h1>
      <p className="text-[#2C3531]/70 leading-relaxed">今天的记录还没放上来。稍后再打开这一页就好。</p>
      <p className="text-sm text-[#2C3531]/40">需要 public/workbench/today.json</p>
      <Link to="/" className="inline-flex text-sm text-[#5B8FA8] hover:underline underline-offset-4">
        返回主页
      </Link>
    </div>
  );
}

export default function Workbench() {
  const [result, setResult] = useState<WorkbenchLoadResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadWorkbench().then((next) => {
      if (!cancelled) setResult(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#2C3531] selection:bg-[#A8C6A1]/30 font-sans">
      <PageMeta title="今日工作台" description="每日待办、花费、重要信息与本周日程。" />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {result === null ? (
          <p className="text-sm text-[#2C3531]/45">正在打开今日工作台…</p>
        ) : result.status === 'empty' ? (
          <WorkbenchEmpty />
        ) : (
          <WorkbenchReady data={result.data} />
        )}
      </div>
    </div>
  );
}
