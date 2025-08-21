// ========================================
// データモデル型定義
// ========================================

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

// ========================================
// コンポーネントProps型定義
// ========================================

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
 * カレンダープロパティの型定義
 */
export interface ClientRunningCalendarProps {
  records: RunRecord[];
  onDateClick?: (date: string) => void;
  currentDate?: Date;
}

/**
 * 目標設定フォームプロパティの型定義
 */
export interface GoalFormProps {
  currentGoal: number | null;
  isOpen: boolean;
  onClose: () => void;
  showWelcomeMessage?: boolean;
}
