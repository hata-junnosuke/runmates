import { Metadata } from 'next';
import { Suspense } from 'react';

import ResetPasswordForm from './_components/ResetPasswordForm';

export const metadata: Metadata = {
  title: '新しいパスワードを設定 | Runmates',
  description: '新しいパスワードを設定します。',
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 md:p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-green-700">
          新しいパスワードを設定
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          新しいパスワードを入力してください。
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
