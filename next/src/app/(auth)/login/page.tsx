import { redirect } from 'next/navigation';

import { getAuthStatus } from '@/features/auth/lib/server';

import LoginForm from './_components/LoginForm';

export default async function LoginPage() {
  // 既にログイン済みの場合はダッシュボードへリダイレクト
  const isAuthenticated = await getAuthStatus();
  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-green-700">
          ログイン
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
