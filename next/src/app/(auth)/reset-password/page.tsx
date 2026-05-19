import { Metadata } from 'next';
import { Suspense } from 'react';

import AuthShell from '@/features/auth/components/AuthShell';
import ResetPasswordForm from '@/features/auth/components/forms/ResetPasswordForm';

export const metadata: Metadata = {
  title: '新しいパスワードを設定 | Runmates',
  description: '新しいパスワードを設定します。',
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="新しいパスワードを設定"
      subtitle="新しいパスワードを入力してください"
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
