import Link from 'next/link';

import { linkClass } from '@/features/auth/components/auth-styles';
import AuthShell from '@/features/auth/components/AuthShell';
import CreateAccountForm from '@/features/auth/components/forms/CreateAccountForm';

export default function CreateAccountPage() {
  return (
    <AuthShell
      title="アカウント作成"
      subtitle="メールアドレスとパスワードを登録してください"
      footer={
        <p>
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className={linkClass}>
            ログイン
          </Link>
        </p>
      }
    >
      <CreateAccountForm />
    </AuthShell>
  );
}
