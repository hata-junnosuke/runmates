import { apiCall, type ApiResponse } from '@/lib/api/client-base';

import type { RunningPlan } from '../types';

export const clientRunningPlansAPI = {
  getByMonth: (
    year: number,
    month: number,
  ): Promise<ApiResponse<RunningPlan[]>> =>
    apiCall<RunningPlan[]>(`/running_plans?year=${year}&month=${month}`),
};
