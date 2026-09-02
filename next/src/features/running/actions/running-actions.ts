'use server';

import { revalidatePath } from 'next/cache';

import { serverApiCall } from '@/lib/api/server-base';
import { splitDateString } from '@/lib/date';

import { runningPlansAPI } from '../api/running-plans';
import { runningRecordsAPI } from '../api/running-records';
import {
  monthlyGoalSchema,
  monthQuerySchema,
  runningRecordSchema,
  yearlyGoalSchema,
} from '../schemas/running-schemas';
import type { RunningPlan, RunRecord } from '../types';
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
  // new Date('YYYY-MM-DD') はUTC深夜として解釈されTZ次第で月がズレるため、文字列のまま分解する
  const { year, month } = splitDateString(date);

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

// ダッシュボードのカレンダー用: 指定月の記録と予定をまとめて取得する
//
// Server Action はクライアント単位で直列にキューイングされるため、
// records / plans を別アクションに分けて Promise.all しても並列にならない。
// 1本のアクション内で並列取得すること。
type MonthData = {
  records: RunRecord[];
  plans: RunningPlan[];
};

export async function fetchMonthData(
  year: number,
  month: number,
): Promise<ActionResponse<MonthData>> {
  const parsed = monthQuerySchema.safeParse({ year, month });
  if (!parsed.success) {
    return { success: false, error: '対象の年月が不正です' };
  }

  const [recordsResult, plansResult] = await Promise.all([
    runningRecordsAPI.getAll(parsed.data.year, parsed.data.month),
    runningPlansAPI.getAll(parsed.data.year, parsed.data.month),
  ]);

  if (!recordsResult.success || !plansResult.success) {
    console.error('月次データの取得に失敗:', {
      records: recordsResult.success ? null : recordsResult.errors,
      plans: plansResult.success ? null : plansResult.errors,
    });
    return { success: false, error: 'データの取得に失敗しました' };
  }

  return {
    success: true,
    data: { records: recordsResult.data, plans: plansResult.data },
  };
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

  // 対象年月はRails側がDate.current(JST)で決める。
  // ここでnew Date()から年月を送るとVercel(UTC)実行時にJST 0:00〜8:59だけ前月の目標を
  // 書き換えてしまい、「設定したのに未設定」になる。
  const result = await serverApiCall('/current/monthly_goal', {
    method: 'POST',
    body: JSON.stringify({
      monthly_goal: {
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

export async function markAchievementNotified(
  type: 'monthly' | 'yearly',
): Promise<ActionResponse> {
  const isMonthly = type === 'monthly';
  const endpoint = isMonthly ? '/current/monthly_goal' : '/current/yearly_goal';
  const paramKey = isMonthly ? 'monthly_goal' : 'yearly_goal';

  // 対象年月はRails側がDate.current(JST)で決める（updateMonthlyGoalと同じ理由）
  const result = await serverApiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify({ [paramKey]: { dismiss_notification: true } }),
  });

  if (!result.success) {
    console.error(
      `Failed to mark ${type} achievement notified:`,
      result.errors,
    );
    return { success: false, error: '通知の更新に失敗しました' };
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

  // 対象年はRails側がDate.current(JST)で決める（updateMonthlyGoalと同じ理由）
  const result = await serverApiCall('/current/yearly_goal', {
    method: 'POST',
    body: JSON.stringify({
      yearly_goal: {
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
