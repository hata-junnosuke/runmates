import { type ApiResponse, serverApiCall } from '@/lib/api/server-base';

import type { MonthlyGoal, YearlyGoal } from '../types';

export const monthlyGoalsAPI = {
  getCurrent: (): Promise<ApiResponse<MonthlyGoal>> =>
    serverApiCall<MonthlyGoal>('/current_monthly_goal'),

  getAll: (): Promise<ApiResponse<MonthlyGoal[]>> =>
    serverApiCall<MonthlyGoal[]>('/monthly_goals'),
};

export const yearlyGoalsAPI = {
  getCurrent: (): Promise<ApiResponse<YearlyGoal>> =>
    serverApiCall<YearlyGoal>('/current_yearly_goal'),
};
