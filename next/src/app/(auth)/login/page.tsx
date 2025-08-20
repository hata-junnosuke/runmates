import { redirect } from 'next/navigation';

import LoginForm from '@/features/auth/components/forms/LoginForm';
import { getAuthStatus } from '@/features/auth/lib/server';

export default async function LoginPage() {
  // 既にログイン済みの場合はダッシュボードへリダイレクト
  const isAuthenticated = await getAuthStatus();
  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg md:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-700 md:text-3xl">
          ログイン
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
