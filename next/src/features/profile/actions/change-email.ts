'use server';

import { revalidatePath } from 'next/cache';

import { serverApiCall } from '@/lib/api/server-base';

import type { ChangeEmailResponse } from '../types';

export async function changeEmail(newEmail: string, password: string) {
  const result = await serverApiCall<ChangeEmailResponse>('/current/user', {
    method: 'PUT',
    body: JSON.stringify({ new_email: newEmail, password }),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.errors[0] || 'メールアドレスの変更に失敗しました',
    };
  }

  revalidatePath('/settings/profile');

  return {
    success: true,
    message: result.data.message,
    pending_email: result.data.pending_email,
  };
}