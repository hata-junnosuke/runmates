import { redirect } from 'next/navigation';
import { getAuthStatus } from '@/lib/server-auth';
import SignUpForm from "./SignUpForm";

export default async function SignUpPage() {
  // 既にログイン済みの場合はダッシュボードへリダイレクト
  const isAuthenticated = await getAuthStatus();
  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          新規登録
        </h2>
        <SignUpForm />
      </div>
    </div>
  );
}
