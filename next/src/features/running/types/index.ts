/**
 * ランニング記録の型定義
 */
export interface RunRecord {
  id: string;
  date: string;
  distance: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 月間目標の型定義
 */
export interface MonthlyGoal {
  id?: string;
  year: number;
  month: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 年間目標の型定義
 */
export interface YearlyGoal {
  id?: string;
  year: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * ランニング統計情報の型定義
 */
export interface RunningStatistics {
  this_year_distance: number;
  this_month_distance: number;
  total_records: number;
  recent_records: RunRecord[];
}

/**
 * ダッシュボードプロパティの型定義
 */
export interface DashboardWithCalendarProps {
  records: RunRecord[];
  monthlyGoals: MonthlyGoal[];
}

/**
 * ダッシュボード統計プロパティの型定義
 */
export interface DashboardStatisticsProps {
  thisYearDistance: number;
  thisMonthDistance: number;
  goalAchievementRate: number;
  goal: number | null;
  yearGoal: number | null;
  yearGoalProgress: number;
  monthlyRunDays: number;
}

/**
 * 統計カードプロパティの型定義
 */
export interface StatisticsCardsProps {
  thisYearDistance: number;
  thisMonthDistance: number;
  goalAchievementRate: number;
  goal: number | null;
  yearGoal: number | null;
  yearGoalProgress: number;
  monthlyRunDays: number;
  onYearlyGoalClick: () => void;
  onMonthlyGoalClick: () => void;
}

/**
 * 最近の記録プロパティの型定義
 */
export interface RecentRecordsProps {
  statistics: RunningStatistics;
}

/**
 * 記録詳細モーダルプロパティの型定義
 */
export interface RecordDetailModalProps {
  record: RunRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ランニングチャートプロパティの型定義
 */
export interface RunningChartProps {
  records: RunRecord[];
  monthlyGoals: MonthlyGoal[];
}

/**
 * ランニングチャートラッパープロパティの型定義
 */
export interface RunningChartWrapperProps {
  records: RunRecord[];
  monthlyGoals: MonthlyGoal[];
}

/**
 * カレンダープロパティの型定義
 */
export interface ClientRunningCalendarProps {
  records: RunRecord[];
  onDateClick?: (date: string) => void;
  currentDate?: Date;
}
