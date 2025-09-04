'use server';

import { serverApiCall } from '@/lib/api/server-base';

import type { UserProfile } from '../types';

export async function getUserProfile(): Promise<{
  user?: UserProfile;
  error?: string;
}> {
  const response = await serverApiCall<UserProfile>('/current/user');

  if (!response.success) {
    return { error: response.errors[0] || 'ユーザー情報の取得に失敗しました' };
  }

  return { user: response.data };
}