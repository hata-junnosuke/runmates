import { serverApiCall, type ApiResponse } from '@/lib/api/server-base';

export interface MonthlyGoal {
  id?: string;
  year: number;
  month: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

export interface YearlyGoal {
  id?: string;
  year: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

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