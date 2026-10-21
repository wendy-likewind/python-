import type {
  WorkbenchDay,
  WorkbenchGoal,
  WorkbenchIntel,
  WorkbenchSpend,
  WorkbenchSpendItem,
  WorkbenchToday,
  WorkbenchTodo,
  WorkbenchTodoStatus,
  WorkbenchView,
  WorkbenchWeek,
} from '@/types/workbench';

const TODAY_PATH = 'workbench/today.json';
const WEEK_PATH = 'workbench/week.json';

export type WorkbenchLoadResult =
  | { status: 'ready'; data: WorkbenchView }
  | { status: 'empty' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readStatus(value: unknown): WorkbenchTodoStatus | undefined {
  if (value === 'open' || value === 'pending' || value === 'done') return value;
  return undefined;
}

function readTodos(value: unknown): WorkbenchTodo[] {
  if (!Array.isArray(value)) return [];
  const todos: WorkbenchTodo[] = [];
  for (const item of value) {
    if (typeof item === 'string') {
      const title = readString(item);
      if (title) todos.push({ title });
      continue;
    }
    if (!isRecord(item)) continue;
    const title = readString(item.title);
    if (!title) continue;
    todos.push({
      title,
      time: readString(item.time),
      note: readString(item.note),
      status: readStatus(item.status),
    });
  }
  return todos;
}

function readSpend(value: unknown): WorkbenchSpend {
  if (!isRecord(value)) return { items: [] };
  const items: WorkbenchSpendItem[] = [];
  if (Array.isArray(value.items)) {
    for (const item of value.items) {
      if (!isRecord(item)) continue;
      const label = readString(item.label);
      const amount = readNumber(item.amount_hkd);
      if (!label || amount === undefined) continue;
      items.push({ label, amount_hkd: amount, note: readString(item.note) });
    }
  }
  return {
    total_hkd: readNumber(value.total_hkd),
    week_total_hkd: readNumber(value.week_total_hkd),
    currency: readString(value.currency) ?? 'HKD',
    items,
  };
}

function readIntel(value: unknown): WorkbenchIntel[] {
  if (!Array.isArray(value)) return [];
  const intel: WorkbenchIntel[] = [];
  for (const item of value) {
    if (typeof item === 'string') {
      const title = readString(item);
      if (title) intel.push({ title });
      continue;
    }
    if (!isRecord(item)) continue;
    const title = readString(item.title);
    if (!title) continue;
    intel.push({ title, detail: readString(item.detail) });
  }
  return intel;
}

function readGoals(value: unknown): WorkbenchGoal[] {
  if (!Array.isArray(value)) return [];
  const goals: WorkbenchGoal[] = [];
  for (const item of value) {
    if (typeof item === 'string') {
      const title = readString(item);
      if (title) goals.push({ title });
      continue;
    }
    if (!isRecord(item)) continue;
    const title = readString(item.title);
    if (!title) continue;
    goals.push({ title, detail: readString(item.detail) });
  }
  return goals;
}

function readCalendar(value: unknown): WorkbenchDay[] {
  if (!Array.isArray(value)) return [];
  const days: WorkbenchDay[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    const date = readString(item.date);
    if (!date) continue;
    const chips = Array.isArray(item.chips)
      ? item.chips.flatMap((chip) => {
          const text = readString(chip);
          return text ? [text] : [];
        })
      : [];
    days.push({
      date,
      weekday: readString(item.weekday) ?? weekdayLabel(date),
      chips,
    });
  }
  return days;
}

export function parseToday(raw: unknown): WorkbenchToday | null {
  if (!isRecord(raw)) return null;
  const date = readString(raw.date);
  if (!date) return null;
  return {
    date,
    timezone: readString(raw.timezone) ?? 'Asia/Shanghai',
    generated_at: readString(raw.generated_at),
    todos: readTodos(raw.todos),
    spend: readSpend(raw.spend),
    intel: readIntel(raw.intel),
    week_goals: readGoals(raw.week_goals),
    week_calendar: readCalendar(raw.week_calendar),
  };
}

export function parseWeek(raw: unknown): WorkbenchWeek | null {
  if (!isRecord(raw)) return null;
  const week_goals = readGoals(raw.week_goals);
  const week_calendar = readCalendar(raw.week_calendar);
  if (!week_goals.length && !week_calendar.length) return null;
  return {
    timezone: readString(raw.timezone),
    generated_at: readString(raw.generated_at),
    week_goals,
    week_calendar,
  };
}

export function mergeWorkbench(today: WorkbenchToday, week: WorkbenchWeek | null): WorkbenchView {
  const goalsFromWeek = today.week_goals.length === 0 && Boolean(week?.week_goals.length);
  const calendarFromWeek = today.week_calendar.length === 0 && Boolean(week?.week_calendar.length);
  return {
    ...today,
    timezone: today.timezone || week?.timezone || 'Asia/Shanghai',
    week_goals: goalsFromWeek && week ? week.week_goals : today.week_goals,
    week_calendar: calendarFromWeek && week ? week.week_calendar : today.week_calendar,
    week_from: goalsFromWeek || calendarFromWeek ? 'week' : 'today',
  };
}

function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\//, '')}`;
}

async function fetchJson(path: string): Promise<unknown | null> {
  const response = await fetch(assetUrl(path), { cache: 'no-cache' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`failed to read ${path}`);
  return response.json() as Promise<unknown>;
}

export async function loadWorkbench(): Promise<WorkbenchLoadResult> {
  let todayRaw: unknown;
  try {
    todayRaw = await fetchJson(TODAY_PATH);
  } catch {
    return { status: 'empty' };
  }
  const today = todayRaw == null ? null : parseToday(todayRaw);
  if (!today) return { status: 'empty' };

  let week: WorkbenchWeek | null = null;
  try {
    const weekRaw = await fetchJson(WEEK_PATH);
    if (weekRaw != null) week = parseWeek(weekRaw);
  } catch {
    week = null;
  }

  return { status: 'ready', data: mergeWorkbench(today, week) };
}

export function formatHkd(amount: number): string {
  const digits = Number.isInteger(amount) ? 0 : 1;
  return amount.toLocaleString('zh-HK', {
    minimumFractionDigits: digits,
    maximumFractionDigits: 1,
  });
}

export function formatGeneratedAt(iso: string, timeZone: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const zone = timeZone || 'Asia/Shanghai';
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);
  } catch {
    return null;
  }
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${pick('year')}-${pick('month')}-${pick('day')} ${pick('hour')}:${pick('minute')} · ${zone}`;
}

export function formatWorkbenchDate(isoDate: string, timeZone: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  const date = new Date(`${isoDate}T12:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  const zone = timeZone || 'Asia/Shanghai';
  try {
    const parts = new Intl.DateTimeFormat('zh-CN', {
      timeZone: zone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).formatToParts(date);
    const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
    return `${pick('year')}年${pick('month')}${pick('day')} · ${pick('weekday')}`;
  } catch {
    return isoDate;
  }
}

function weekdayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    weekday: 'short',
  }).format(date);
}

export function dayNumber(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  return `${Number(match[2])}/${Number(match[3])}`;
}
