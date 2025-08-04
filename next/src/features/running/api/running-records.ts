import { serverApiCall, type ApiResponse } from '@/lib/api/server-base';

export interface RunRecord {
  id: string;
  date: string;
  distance: number;
  created_at?: string;
  updated_at?: string;
}

export interface RunningStatistics {
  this_year_distance: number;
  this_month_distance: number;
  total_records: number;
  recent_records: RunRecord[];
}

export const runningRecordsAPI = {
  getAll: (): Promise<ApiResponse<RunRecord[]>> => 
    serverApiCall<RunRecord[]>('/running_records'),

  getStatistics: (): Promise<ApiResponse<RunningStatistics>> => 
    serverApiCall<RunningStatistics>('/running_statistics'),
};