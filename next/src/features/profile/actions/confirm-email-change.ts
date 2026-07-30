'use server';

import { serverApiCall } from '@/lib/api/server-base';

type ConfirmEmailChangeResponse = {
  success: boolean;
  message: string;
  email: string;
};

type ConfirmEmailChangeResult =
  | { success: true; email: string }
  | { success: false; error: string };

export async function confirmEmailChange(
  token: string,
): Promise<ConfirmEmailChangeResult> {
  const result = await serverApiCall<ConfirmEmailChangeResponse>(
    `/auth/email_confirmation?confirmation_token=${encodeURIComponent(token)}`,
  );

  if (!result.success) {
    return {
      success: false,
      error:
        result.errors[0] ||
        'メールアドレスの変更に失敗しました。リンクの有効期限が切れている可能性があります。',
    };
  }

  return { success: true, email: result.data.email };
}
