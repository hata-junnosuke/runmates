import { type ApiResponse, serverApiCall } from '@/lib/api/server-base';

import type { MonthlyGoal, YearlyGoal } from '../types';

export const monthlyGoalsAPI = {
  // 今月の目標を取得
  getCurrent: (): Promise<ApiResponse<MonthlyGoal>> =>
    serverApiCall<MonthlyGoal>('/current_monthly_goal'),

  // 目標一覧を取得(ダッシュボードの「カレンダー」に使用)
  getAll: (): Promise<ApiResponse<MonthlyGoal[]>> =>
    serverApiCall<MonthlyGoal[]>('/monthly_goals'),
};

export const yearlyGoalsAPI = {
  // 今年の目標を取得
  getCurrent: (): Promise<ApiResponse<YearlyGoal>> =>
    serverApiCall<YearlyGoal>('/current_yearly_goal'),
};
