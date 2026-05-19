import { Metadata } from 'next';
import Link from 'next/link';

import { linkClass } from '@/features/auth/components/auth-styles';
import AuthShell from '@/features/auth/components/AuthShell';
import ForgotPasswordForm from '@/features/auth/components/forms/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'パスワードリセット | Runmates',
  description: 'パスワードをリセットするためのメールを送信します。',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="パスワードをリセット"
      subtitle="登録したメールアドレスにリセット用リンクを送信します"
      footer={
        <p>
          <Link href="/login" className={linkClass}>
            ログインに戻る
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
