'use server';

import { revalidatePath } from 'next/cache';

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
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.delete('access-token');
  cookieStore.delete('client');
  cookieStore.delete('uid');

  revalidatePath('/');

  return {
    success: true,
  };
}
