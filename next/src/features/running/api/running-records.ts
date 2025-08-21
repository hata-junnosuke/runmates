import { type ApiResponse, serverApiCall } from '@/lib/api/server-base';

import type { RunningStatistics, RunRecord } from '../types';

export const runningRecordsAPI = {
  getAll: (): Promise<ApiResponse<RunRecord[]>> =>
    serverApiCall<RunRecord[]>('/running_records'),

  getStatistics: (): Promise<ApiResponse<RunningStatistics>> =>
    serverApiCall<RunningStatistics>('/running_statistics'),
};
