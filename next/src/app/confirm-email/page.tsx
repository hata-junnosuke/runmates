import { Metadata } from 'next';
import { Suspense } from 'react';
import ConfirmEmailClient from './_components/ConfirmEmailClient';

export const metadata: Metadata = {
  title: 'メールアドレスの確認 | Runmates',
  description: 'メールアドレスの確認を行います。',
};

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          メールアドレスの確認
        </h2>
        <Suspense fallback={<div className="text-center">確認中...</div>}>
          <ConfirmEmailClient />
        </Suspense>
      </div>
    </div>
  );
}