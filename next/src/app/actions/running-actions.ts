'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.INTERNAL_API_URL || 'http://rails:3000/api/v1';

// サーバーアクション用API呼び出し関数
async function apiCall(endpoint: string, options: RequestInit = {}) {
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
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

// 走行記録追加アクション
export async function addRunningRecord(formData: FormData) {
  try {
    const date = formData.get('date') as string;
    const distance = parseFloat(formData.get('distance') as string);

    if (!date || !distance || distance <= 0) {
      throw new Error('有効な日付と距離を入力してください');
    }

    await apiCall('/running_records', {
      method: 'POST',
      body: JSON.stringify({
        running_record: { date, distance }
      }),
    });

    revalidatePath('/');
  } catch (error) {
    console.error('Failed to add running record:', error);
    throw error;
  }
}

// 月次目標設定アクション
export async function setMonthlyGoal(formData: FormData) {
  try {
    const distanceGoal = parseFloat(formData.get('distance_goal') as string);

    if (!distanceGoal || distanceGoal <= 0) {
      throw new Error('有効な目標距離を入力してください');
    }

    const currentDate = new Date();
    
    await apiCall('/current_monthly_goal', {
      method: 'POST',
      body: JSON.stringify({
        monthly_goal: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          distance_goal: distanceGoal
        }
      }),
    });

    revalidatePath('/');
  } catch (error) {
    console.error('Failed to set monthly goal:', error);
    throw error;
  }
}