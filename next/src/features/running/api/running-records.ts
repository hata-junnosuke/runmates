import { type ApiResponse, serverApiCall } from '@/lib/api/server-base';

import type { RunningStatistics, RunRecord } from '../types';

export const runningRecordsAPI = {
  // 記録一覧を取得(ダッシュボードの「カレンダー」に使用)
  getAll: (
    year?: number,
    month?: number,
  ): Promise<ApiResponse<RunRecord[]>> => {
    if (year && month) {
      return serverApiCall<RunRecord[]>(
        `/running_records?year=${year}&month=${month}`,
      );
    }
    // デフォルト: 現在月のデータを取得
    return serverApiCall<RunRecord[]>('/running_records');
  },

  // 統計情報を取得(ダッシュボードの「統計カード」と「最近の記録」に使用)
  getStatistics: (): Promise<ApiResponse<RunningStatistics>> =>
    serverApiCall<RunningStatistics>('/running_statistics'),
};
