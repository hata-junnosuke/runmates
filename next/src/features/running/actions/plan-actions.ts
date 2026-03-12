'use server';

import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';

import type { RunningPlan } from '../types';
import type { ActionResponse } from '../types/api-responses';

const API_BASE_URL = process.env.INTERNAL_API_URL || 'http://rails:3000/api/v1';
const MIN_PLAN_DATE = '2025-01-01';
const PLAN_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

type ExtendedRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

async function apiCall<T = unknown>(
  endpoint: string,
  options: ExtendedRequestInit = {},
): Promise<T> {
  noStore();
  const cookieStore = await cookies();
  const url = `${API_BASE_URL}${endpoint}`;

  const accessToken = cookieStore.get('access-token')?.value;
  const client = cookieStore.get('client')?.value;
  const uid = cookieStore.get('uid')?.value;

  const defaultOptions: ExtendedRequestInit = {
    ...options,
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
    cache: 'no-store',
    next: {
      revalidate: 0,
    },
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

type PlanPayload = {
  date: string;
  planned_distance: number;
  memo?: string;
};

/**
 * 予定を作成
 * 成功時は対象月の予定一覧を返す
 */
export async function createPlan(
  data: PlanPayload,
): Promise<ActionResponse<RunningPlan[]>> {
  try {
    const { date, planned_distance, memo } = data;

    if (!date || !PLAN_DATE_REGEX.test(date) || date < MIN_PLAN_DATE) {
      return {
        success: false,
        error: '日付は2025年1月1日以降のYYYY-MM-DD形式で入力してください',
      };
    }
    if (!planned_distance || planned_distance <= 0) {
      return { success: false, error: '有効な予定距離を入力してください' };
    }

    await apiCall('/running_plans', {
      method: 'POST',
      body: JSON.stringify({
        running_plan: { date, planned_distance, memo },
      }),
    });

    const target = new Date(date);
    const year = target.getFullYear();
    const month = target.getMonth() + 1;
    const freshMonthPlans = await apiCall<RunningPlan[]>(
      `/running_plans?year=${year}&month=${month}`,
    );

    revalidatePath('/');
    return { success: true, data: freshMonthPlans };
  } catch (error) {
    console.error('Failed to create plan:', error);
    return { success: false, error: '予定の保存に失敗しました' };
  }
}

/**
 * 予定を更新
 * 成功時は対象月の予定一覧を返す
 */
export async function updatePlan(
  id: string,
  data: PlanPayload,
): Promise<ActionResponse<RunningPlan[]>> {
  try {
    const { date, planned_distance, memo } = data;

    if (!id) return { success: false, error: '予定IDが必要です' };
    if (!date || !PLAN_DATE_REGEX.test(date) || date < MIN_PLAN_DATE) {
      return {
        success: false,
        error: '日付は2025年1月1日以降のYYYY-MM-DD形式で入力してください',
      };
    }
    if (!planned_distance || planned_distance <= 0) {
      return { success: false, error: '有効な予定距離を入力してください' };
    }

    await apiCall(`/running_plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        running_plan: { date, planned_distance, memo },
      }),
    });

    const target = new Date(date);
    const year = target.getFullYear();
    const month = target.getMonth() + 1;
    const freshMonthPlans = await apiCall<RunningPlan[]>(
      `/running_plans?year=${year}&month=${month}`,
    );

    revalidatePath('/');
    return { success: true, data: freshMonthPlans };
  } catch (error) {
    console.error('Failed to update plan:', error);
    return { success: false, error: '予定の更新に失敗しました' };
  }
}

/**
 * 予定を削除
 * 成功時は対象月の予定一覧を返す（dateを渡す想定）
 */
export async function deletePlan(
  id: string,
  date: string,
): Promise<ActionResponse<RunningPlan[]>> {
  try {
    if (!id) return { success: false, error: '予定IDが必要です' };

    await apiCall(`/running_plans/${id}`, { method: 'DELETE' });

    const target = new Date(date);
    const year = target.getFullYear();
    const month = target.getMonth() + 1;
    const freshMonthPlans = await apiCall<RunningPlan[]>(
      `/running_plans?year=${year}&month=${month}`,
    );

    revalidatePath('/');
    return { success: true, data: freshMonthPlans };
  } catch (error) {
    console.error('Failed to delete plan:', error);
    return { success: false, error: '予定の削除に失敗しました' };
  }
}
