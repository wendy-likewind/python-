export type WorkbenchTodoStatus = 'open' | 'pending' | 'done';

export interface WorkbenchTodo {
  title: string;
  time?: string;
  note?: string;
  status?: WorkbenchTodoStatus;
}

export interface WorkbenchSpendItem {
  label: string;
  amount_hkd: number;
  note?: string;
}

export interface WorkbenchSpend {
  total_hkd?: number;
  week_total_hkd?: number;
  currency?: string;
  items: WorkbenchSpendItem[];
}

export interface WorkbenchIntel {
  title: string;
  detail?: string;
}

export interface WorkbenchGoal {
  title: string;
  detail?: string;
}

export interface WorkbenchDay {
  date: string;
  weekday: string;
  chips: string[];
}

export interface WorkbenchToday {
  date: string;
  timezone: string;
  generated_at?: string;
  todos: WorkbenchTodo[];
  spend: WorkbenchSpend;
  intel: WorkbenchIntel[];
  week_goals: WorkbenchGoal[];
  week_calendar: WorkbenchDay[];
}

export interface WorkbenchWeek {
  timezone?: string;
  generated_at?: string;
  week_goals: WorkbenchGoal[];
  week_calendar: WorkbenchDay[];
}

export interface WorkbenchView extends WorkbenchToday {
  week_from: 'today' | 'week';
}
