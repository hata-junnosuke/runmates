import { Suspense } from 'react';

import LoginForm from '@/features/auth/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg md:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-700 md:text-3xl">
          ログイン
        </h2>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
