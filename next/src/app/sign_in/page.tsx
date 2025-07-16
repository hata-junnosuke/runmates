import { redirect } from 'next/navigation';
import { getAuthStatus } from '@/lib/server-auth';
import SignInForm from "./SignInForm";

export default async function SignInPage() {
  // 既にログイン済みの場合はダッシュボードへリダイレクト
  const isAuthenticated = await getAuthStatus();
  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          サインイン
        </h2>
        <SignInForm />
      </div>
    </div>
  );
}
