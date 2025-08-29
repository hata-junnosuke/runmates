'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import type { RunRecord } from '../types';
import type { ActionResponse } from '../types/api-responses';
import type {
  MonthlyGoalInput,
  RunningRecordInput,
  YearlyGoalInput,
} from '../types/form-inputs';

const API_BASE_URL = process.env.INTERNAL_API_URL || 'http://rails:3000/api/v1';

// ========================================
// ヘルパー関数
// ========================================

/**
 * Rails APIへのリクエストを送信するヘルパー関数
 * 認証情報をクッキーから自動的に取得して付与
 *
 * @param endpoint - APIエンドポイント（例: '/running_records'）
 * @param options - fetchオプション
 * @returns APIレスポンスまたはnull（204の場合）
 * @throws Error APIエラーが発生した場合
 */
async function apiCall<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const url = `${API_BASE_URL}${endpoint}`;

  // クッキーから認証情報を取得
  const accessToken = cookieStore.get('access-token')?.value;
  const client = cookieStore.get('client')?.value;
  const uid = cookieStore.get('uid')?.value;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken &&
        client &&
        uid && {
          'access-token': accessToken,
          client: client,
          uid: uid,
          'token-type': 'Bearer',
        }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    // デバッグ情報を追加
    console.error('API call failed:', {
      endpoint,
      status: response.status,
      hasAccessToken: !!accessToken,
      hasClient: !!client,
      hasUid: !!uid,
    });
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// ========================================
// 走行記録 (Running Records) 関連
// ========================================

/**
 * 新しいランニング記録を作成
 *
 * @param data - ランニング記録データ
 * @param data.date - 記録日（YYYY-MM-DD形式）
 * @param data.distance - 走行距離（km）
 * @returns 成功/失敗の結果
 *
 * @example
 * ```typescript
 * const result = await createRunningRecord({
 *   date: '2025-08-26',
 *   distance: 5.5
 * });
 * ```
 */
export async function createRunningRecord(
  data: RunningRecordInput,
): Promise<ActionResponse<RunRecord[]>> {
  try {
    const { date, distance } = data;

    // バリデーション
    if (!date || !distance || distance <= 0) {
      return { success: false, error: '有効な日付と距離を入力してください' };
    }

    await apiCall('/running_records', {
      method: 'POST',
      body: JSON.stringify({
        running_record: { date, distance },
      }),
    });

    // 記録追加後、該当月の最新データを取得して返す
    const recordDate = new Date(date);
    const year = recordDate.getFullYear();
    const month = recordDate.getMonth() + 1;
    
    const updatedRecords = await apiCall<RunRecord[]>(
      `/running_records?year=${year}&month=${month}`
    );

    revalidatePath('/');
    return { success: true, data: updatedRecords };
  } catch (error) {
    console.error('Failed to add running record:', error);
    return { success: false, error: '記録の追加に失敗しました' };
  }
}

/**
 * ランニング記録を削除
 *
 * @param recordId - 削除する記録のID
 * @returns 成功/失敗の結果
 *
 * @example
 * ```typescript
 * const result = await deleteRunningRecord('123');
 * ```
 */
export async function deleteRunningRecord(
  recordId: string,
): Promise<ActionResponse> {
  try {
    if (!recordId) {
      return { success: false, error: '記録IDが必要です' };
    }

    await apiCall(`/running_records/${recordId}`, {
      method: 'DELETE',
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete running record:', error);
    return { success: false, error: '記録の削除に失敗しました' };
  }
}

// ========================================
// 目標設定 (Goals) 関連
// ========================================

/**
 * 当月の走行距離目標を設定または更新
 *
 * @param data - 月間目標データ
 * @param data.distanceGoal - 目標距離（km）
 * @returns 成功/失敗の結果
 *
 * @example
 * ```typescript
 * const result = await updateMonthlyGoal({
 *   distanceGoal: 100
 * });
 * ```
 */
export async function updateMonthlyGoal(
  data: MonthlyGoalInput,
): Promise<ActionResponse> {
  try {
    const { distanceGoal } = data;

    // バリデーション
    if (!distanceGoal || distanceGoal <= 0) {
      return { success: false, error: '有効な目標距離を入力してください' };
    }

    const currentDate = new Date();

    await apiCall('/current_monthly_goal', {
      method: 'POST',
      body: JSON.stringify({
        monthly_goal: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1, // getMonth()は0-11の範囲で返すので+1する
          // Rails APIはスネークケースを期待するため、キャメルケースからスネークケースに変換
          distance_goal: distanceGoal,
        },
      }),
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to set monthly goal:', error);
    return { success: false, error: '月次目標の設定に失敗しました' };
  }
}

/**
 * 当年の走行距離目標を設定または更新
 *
 * @param data - 年間目標データ
 * @param data.distanceGoal - 目標距離（km）
 * @returns 成功/失敗の結果
 *
 * @example
 * ```typescript
 * const result = await updateYearlyGoal({
 *   distanceGoal: 500
 * });
 * ```
 */
export async function updateYearlyGoal(
  data: YearlyGoalInput,
): Promise<ActionResponse> {
  try {
    const { distanceGoal } = data;

    // バリデーション
    if (!distanceGoal || distanceGoal <= 0) {
      return { success: false, error: '有効な目標距離を入力してください' };
    }

    const currentDate = new Date();

    await apiCall('/current_yearly_goal', {
      method: 'POST',
      body: JSON.stringify({
        yearly_goal: {
          year: currentDate.getFullYear(),
          // Rails APIはスネークケースを期待するため、キャメルケースからスネークケースに変換
          distance_goal: distanceGoal,
        },
      }),
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to set yearly goal:', error);
    return { success: false, error: '年間目標の設定に失敗しました' };
  }
}
