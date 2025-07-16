'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.INTERNAL_API_URL || 'http://rails:3000/api/v1';

// サーバーアクション用API呼び出し関数
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const url = `${API_BASE_URL}${endpoint}`;
  
  // クッキーから認証情報を取得
  const accessToken = cookieStore.get('access-token')?.value;
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
    // デバッグ情報を追加
    console.error('API call failed:', {
      endpoint,
      status: response.status,
      hasAccessToken: !!accessToken,
      hasClient: !!client,
      hasUid: !!uid
    });
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}


// 走行記録を追加
export async function createRunningRecord(formData: FormData) {
  try {
    // FormDataは全ての値を文字列として保存するため、最初から数値で受け取ることはできない。
    const date = formData.get('date') as string;
    const distanceStr = formData.get('distance') as string;
    const distance = distanceStr ? parseFloat(distanceStr) : NaN;

    if (!date || !distanceStr || isNaN(distance) || distance <= 0) {
      return { success: false, error: '有効な日付と距離を入力してください' };
    }

    await apiCall('/running_records', {
      method: 'POST',
      body: JSON.stringify({
        running_record: { date, distance }
      }),
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add running record:', error);
    return { success: false, error: '記録の追加に失敗しました' };
  }
}

// 月次目標を更新
export async function updateMonthlyGoal(formData: FormData) {
  try {
    // FormDataは全ての値を文字列として保存するため、最初から数値で受け取ることはできない。
    const distanceGoalStr = formData.get('distance_goal') as string;
    const distanceGoal = distanceGoalStr ? parseFloat(distanceGoalStr) : NaN;

    if (!distanceGoalStr || isNaN(distanceGoal) || distanceGoal <= 0) {
      return { success: false, error: '有効な目標距離を入力してください' };
    }

    const currentDate = new Date();
    
    await apiCall('/current_monthly_goal', {
      method: 'POST',
      body: JSON.stringify({
        monthly_goal: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1, // getMonth()は0-11の範囲で返すので+1する
          distance_goal: distanceGoal
        }
      }),
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to set monthly goal:', error);
    return { success: false, error: '月次目標の設定に失敗しました' };
  }
}

// 年間目標を更新
export async function updateYearlyGoal(formData: FormData) {
  try {
    // FormDataは全ての値を文字列として保存するため、最初から数値で受け取ることはできない。
    const distanceGoalStr = formData.get('distance_goal') as string;
    const distanceGoal = distanceGoalStr ? parseFloat(distanceGoalStr) : NaN;

    if (!distanceGoalStr || isNaN(distanceGoal) || distanceGoal <= 0) {
      return { success: false, error: '有効な目標距離を入力してください' };
    }

    const currentDate = new Date();
    
    await apiCall('/current_yearly_goal', {
      method: 'POST',
      body: JSON.stringify({
        yearly_goal: {
          year: currentDate.getFullYear(),
          distance_goal: distanceGoal
        }
      }),
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to set yearly goal:', error);
    return { success: false, error: '年間目標の設定に失敗しました' };
  }
}

// 走行記録を削除
export async function deleteRunningRecord(recordId: string) {
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