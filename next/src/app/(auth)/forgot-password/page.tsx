import { Metadata } from 'next';
import Link from 'next/link';

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
          <Link
            href="/login"
            className="font-semibold text-[#3B8FE3] no-underline"
          >
            ログインに戻る
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
