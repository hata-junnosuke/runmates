'use server';

import { revalidatePath } from 'next/cache';

import { serverApiCall } from '@/lib/api/server-base';

import { planSchema } from '../schemas/running-schemas';
import type { RunningPlan } from '../types';
import type { ActionResponse } from '../types/api-responses';

type PlanPayload = {
  date: string;
  planned_distance: number;
  memo?: string;
};

function formatValidationError(issues: { path: (string | number)[] }[]): string {
  const field = issues[0]?.path[0];
  switch (field) {
    case 'date':
      return '日付は2025年1月1日以降のYYYY-MM-DD形式で入力してください';
    case 'planned_distance':
      return '予定距離は0.1km以上999km以下で入力してください';
    case 'memo':
      return 'メモは500文字以内で入力してください';
    default:
      return '入力値が不正です';
  }
}

/**
 * 予定を作成
 * 成功時は対象月の予定一覧を返す
 */
export async function createPlan(
  data: PlanPayload,
): Promise<ActionResponse<RunningPlan[]>> {
  const parsed = planSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: formatValidationError(parsed.error.issues),
    };
  }

  const { date, planned_distance, memo } = parsed.data;

  const result = await serverApiCall('/running_plans', {
    method: 'POST',
    body: JSON.stringify({
      running_plan: { date, planned_distance, memo },
    }),
  });

  if (!result.success) {
    console.error('予定の作成に失敗:', result.errors);
    return { success: false, error: '予定の保存に失敗しました' };
  }

  const target = new Date(date);
  const year = target.getFullYear();
  const month = target.getMonth() + 1;
  const freshResult = await serverApiCall<RunningPlan[]>(
    `/running_plans?year=${year}&month=${month}`,
  );

  if (!freshResult.success) {
    console.error('予定一覧の取得に失敗:', freshResult.errors);
    return { success: false, error: '予定の取得に失敗しました' };
  }

  revalidatePath('/dashboard');
  return { success: true, data: freshResult.data };
}

/**
 * 予定を更新
 * 成功時は対象月の予定一覧を返す
 */
export async function updatePlan(
  id: string,
  data: PlanPayload,
): Promise<ActionResponse<RunningPlan[]>> {
  if (!id) return { success: false, error: '予定IDが必要です' };

  const parsed = planSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: formatValidationError(parsed.error.issues),
    };
  }

  const { date, planned_distance, memo } = parsed.data;

  const result = await serverApiCall(`/running_plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      running_plan: { date, planned_distance, memo },
    }),
  });

  if (!result.success) {
    console.error('予定の更新に失敗:', result.errors);
    return { success: false, error: '予定の更新に失敗しました' };
  }

  const target = new Date(date);
  const year = target.getFullYear();
  const month = target.getMonth() + 1;
  const freshResult = await serverApiCall<RunningPlan[]>(
    `/running_plans?year=${year}&month=${month}`,
  );

  if (!freshResult.success) {
    console.error('予定一覧の取得に失敗:', freshResult.errors);
    return { success: false, error: '予定の取得に失敗しました' };
  }

  revalidatePath('/dashboard');
  return { success: true, data: freshResult.data };
}

/**
 * 予定を削除
 * 成功時は対象月の予定一覧を返す
 */
export async function deletePlan(
  id: string,
  date: string,
): Promise<ActionResponse<RunningPlan[]>> {
  if (!id) return { success: false, error: '予定IDが必要です' };

  const result = await serverApiCall(`/running_plans/${id}`, {
    method: 'DELETE',
  });

  if (!result.success) {
    console.error('予定の削除に失敗:', result.errors);
    return { success: false, error: '予定の削除に失敗しました' };
  }

  const target = new Date(date);
  const year = target.getFullYear();
  const month = target.getMonth() + 1;
  const freshResult = await serverApiCall<RunningPlan[]>(
    `/running_plans?year=${year}&month=${month}`,
  );

  if (!freshResult.success) {
    console.error('予定一覧の取得に失敗:', freshResult.errors);
    return { success: false, error: '予定の取得に失敗しました' };
  }

  revalidatePath('/dashboard');
  return { success: true, data: freshResult.data };
}
