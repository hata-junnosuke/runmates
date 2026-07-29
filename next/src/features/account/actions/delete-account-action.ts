'use server';

import { clearAuthCookies } from '@/features/auth/lib/cookies';
import { serverApiCall } from '@/lib/api/server-base';

export async function deleteAccount(password: string) {
  const result = await serverApiCall<null>('/current/user', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.errors[0] || 'アカウントの削除に失敗しました',
    };
  }

  // サーバーサイドでクッキーをクリア
  await clearAuthCookies();

  return {
    success: true,
  };
}
