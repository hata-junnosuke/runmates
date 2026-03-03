import { Metadata } from 'next';
import { Suspense } from 'react';

import ConfirmEmailClient from '@/features/auth/components/email/ConfirmEmailClient';

export const metadata: Metadata = {
  title: 'メールアドレスの確認 | Runmates',
  description: 'メールアドレスの確認を行います。',
};

export default function ConfirmEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-green-700">
          メールアドレスの確認
        </h2>
        <Suspense fallback={<div className="text-center">確認中...</div>}>
          <ConfirmEmailClient />
        </Suspense>
      </div>
    </div>
  );
}
