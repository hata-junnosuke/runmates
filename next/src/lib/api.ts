// API 通信用のユーティリティ関数
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

// 汎用的なAPI呼び出し関数
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // クッキー認証のため
    headers: {
      'Content-Type': 'application/json',
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

// ランニング記録 API
export const runningRecordsAPI = {
  // 記録一覧取得
  getAll: (): Promise<RunRecord[]> => {
    return apiCall('/running_records');
  },

  // 記録詳細取得
  getById: (id: string): Promise<RunRecord> => {
    return apiCall(`/running_records/${id}`);
  },

  // 記録作成
  create: (data: { date: string; distance: number }): Promise<RunRecord> => {
    return apiCall('/running_records', {
      method: 'POST',
      body: JSON.stringify({ running_record: data }),
    });
  },

  // 記録更新
  update: (id: string, data: { date: string; distance: number }): Promise<RunRecord> => {
    return apiCall(`/running_records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ running_record: data }),
    });
  },

  // 記録削除
  delete: (id: string): Promise<null> => {
    return apiCall(`/running_records/${id}`, {
      method: 'DELETE',
    });
  },

  // 統計情報取得
  getStatistics: (): Promise<RunningStatistics> => {
    return apiCall('/running_records/statistics');
  },
};

// 月次目標 API
export const monthlyGoalsAPI = {
  // 目標一覧取得
  getAll: (): Promise<MonthlyGoal[]> => {
    return apiCall('/monthly_goals');
  },

  // 目標詳細取得
  getById: (id: string): Promise<MonthlyGoal> => {
    return apiCall(`/monthly_goals/${id}`);
  },

  // 現在月の目標取得
  getCurrent: (): Promise<MonthlyGoal> => {
    return apiCall('/monthly_goals/current');
  },

  // 目標作成
  create: (data: MonthlyGoal): Promise<MonthlyGoal> => {
    return apiCall('/monthly_goals', {
      method: 'POST',
      body: JSON.stringify({ monthly_goal: data }),
    });
  },

  // 目標更新（または作成）
  upsert: (data: MonthlyGoal): Promise<MonthlyGoal> => {
    return apiCall('/monthly_goals/upsert', {
      method: 'POST',
      body: JSON.stringify({ monthly_goal: data }),
    });
  },

  // 目標更新
  update: (id: string, data: MonthlyGoal): Promise<MonthlyGoal> => {
    return apiCall(`/monthly_goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ monthly_goal: data }),
    });
  },

  // 目標削除
  delete: (id: string): Promise<null> => {
    return apiCall(`/monthly_goals/${id}`, {
      method: 'DELETE',
    });
  },
};