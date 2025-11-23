import { type ApiResponse, serverApiCall } from '@/lib/api/server-base';

import type { RunningPlan } from '../types';

export const runningPlansAPI = {
  getAll: (
    year?: number,
    month?: number,
  ): Promise<ApiResponse<RunningPlan[]>> => {
    if (year && month) {
      return serverApiCall<RunningPlan[]>(
        `/running_plans?year=${year}&month=${month}`,
      );
    }
    return serverApiCall<RunningPlan[]>('/running_plans');
  },
};
