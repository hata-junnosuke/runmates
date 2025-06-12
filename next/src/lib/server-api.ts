import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface RunRecord {
  id: string;
  date: string;
  distance: number;
  created_at?: string;
  updated_at?: string;
}

export interface MonthlyGoal {
  id?: string;
  year: number;
  month: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

export interface RunningStatistics {
  this_year_distance: number;
  this_month_distance: number;
  total_records: number;
  recent_records: RunRecord[];
}

// サーバーサイドAPI呼び出し関数
async function serverApiCall(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const url = `${API_BASE_URL}${endpoint}`;
  
  // クッキーから認証情報を取得
  const accessToken = cookieStore.get('access_token')?.value;
  const client = cookieStore.get('client')?.value;
  const uid = cookieStore.get('uid')?.value;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && client && uid && {
        'access-token': accessToken,
        'client': client,
        'uid': uid,
        'token-type': 'Bearer'
      }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  // No Content の場合は JSON をパースしない
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

// サーバーサイドAPIクライアント
export const serverRunningRecordsAPI = {
  getAll: (): Promise<RunRecord[]> => {
    return serverApiCall('/running_records');
  },

  getStatistics: (): Promise<RunningStatistics> => {
    return serverApiCall('/running_statistics');
  },
};

export const serverMonthlyGoalsAPI = {
  getCurrent: (): Promise<MonthlyGoal> => {
    return serverApiCall('/current_monthly_goal');
  },
};