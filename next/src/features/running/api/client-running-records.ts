import { apiCall, type ApiResponse } from '@/lib/api/client-base';

import type { RunRecord } from '../types';

export const clientRunningRecordsAPI = {
  // 特定月の記録を取得（カレンダーの月切り替え時に使用）
  getByMonth: async (
    year: number,
    month: number,
  ): Promise<ApiResponse<RunRecord[]>> => {
    return apiCall<RunRecord[]>(`/running_records?year=${year}&month=${month}`);
  },
};