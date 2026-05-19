import Link from 'next/link';
import { Suspense } from 'react';

import { linkClass } from '@/features/auth/components/auth-styles';
import AuthShell from '@/features/auth/components/AuthShell';
import LoginForm from '@/features/auth/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <AuthShell
      title="ログイン"
      subtitle="アカウント情報を入力してください"
      footer={
        <>
          <p>
            アカウントをお持ちでない方は{' '}
            <Link href="/create-account" className={linkClass}>
              新規登録
            </Link>
          </p>
          <p className="mt-4">
            <Link href="/forgot-password" className={linkClass}>
              パスワードをお忘れの方
            </Link>
          </p>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
