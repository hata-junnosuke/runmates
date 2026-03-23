'use server';

import { revalidatePath } from 'next/cache';

import { serverApiCall } from '@/lib/api/server-base';

import {
  monthlyGoalSchema,
  runningRecordSchema,
  yearlyGoalSchema,
} from '../schemas/running-schemas';
import type { RunRecord } from '../types';
import type { ActionResponse } from '../types/api-responses';
import type {
  MonthlyGoalInput,
  RunningRecordInput,
  YearlyGoalInput,
} from '../types/form-inputs';

// ========================================
// 走行記録 (Running Records) 関連
// ========================================

export async function createRunningRecord(
  data: RunningRecordInput,
): Promise<ActionResponse<RunRecord[]>> {
  const parsed = runningRecordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: '有効な日付と距離を入力してください' };
  }

  const { date, distance } = parsed.data;

  const result = await serverApiCall('/running_records', {
    method: 'POST',
    body: JSON.stringify({
      running_record: { date, distance },
    }),
  });

  if (!result.success) {
    console.error('Failed to add running record:', result.errors);
    return { success: false, error: '記録の追加に失敗しました' };
  }

  // 記録追加後、該当月の最新データを取得して返す
  const recordDate = new Date(date);
  const year = recordDate.getFullYear();
  const month = recordDate.getMonth() + 1;

  const freshResult = await serverApiCall<RunRecord[]>(
    `/running_records?year=${year}&month=${month}`,
  );

  if (!freshResult.success) {
    console.error('Failed to fetch fresh records:', freshResult.errors);
    return { success: false, error: '記録の取得に失敗しました' };
  }

  revalidatePath('/dashboard');
  return { success: true, data: freshResult.data };
}

export async function deleteRunningRecord(
  recordId: string,
): Promise<ActionResponse> {
  if (!recordId) {
    return { success: false, error: '記録IDが必要です' };
  }

  const result = await serverApiCall(`/running_records/${recordId}`, {
    method: 'DELETE',
  });

  if (!result.success) {
    console.error('Failed to delete running record:', result.errors);
    return { success: false, error: '記録の削除に失敗しました' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

// ========================================
// 目標設定 (Goals) 関連
// ========================================

export async function updateMonthlyGoal(
  data: MonthlyGoalInput,
): Promise<ActionResponse> {
  const parsed = monthlyGoalSchema.safeParse({
    distance_goal: data.distanceGoal,
  });
  if (!parsed.success) {
    return { success: false, error: '有効な目標距離を入力してください' };
  }

  const currentDate = new Date();

  const result = await serverApiCall('/current/monthly_goal', {
    method: 'POST',
    body: JSON.stringify({
      monthly_goal: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        distance_goal: parsed.data.distance_goal,
      },
    }),
  });

  if (!result.success) {
    console.error('Failed to set monthly goal:', result.errors);
    return { success: false, error: '月次目標の設定に失敗しました' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateYearlyGoal(
  data: YearlyGoalInput,
): Promise<ActionResponse> {
  const parsed = yearlyGoalSchema.safeParse({
    distance_goal: data.distanceGoal,
  });
  if (!parsed.success) {
    return { success: false, error: '有効な目標距離を入力してください' };
  }

  const currentDate = new Date();

  const result = await serverApiCall('/current/yearly_goal', {
    method: 'POST',
    body: JSON.stringify({
      yearly_goal: {
        year: currentDate.getFullYear(),
        distance_goal: parsed.data.distance_goal,
      },
    }),
  });

  if (!result.success) {
    console.error('Failed to set yearly goal:', result.errors);
    return { success: false, error: '年間目標の設定に失敗しました' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
