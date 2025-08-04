import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordForm from './_components/ResetPasswordForm';

export const metadata: Metadata = {
  title: '新しいパスワードを設定 | Runmates',
  description: '新しいパスワードを設定します。',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          新しいパスワードを設定
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          新しいパスワードを入力してください。
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}