import { Metadata } from 'next';
import { Suspense } from 'react';

import ConfirmEmailChangeClient from '@/features/profile/components/ConfirmEmailChangeClient';

export const metadata: Metadata = {
  title: 'メールアドレス変更の確認 | Runmates',
  description: 'メールアドレスの変更を確認します。',
};

export default function ConfirmEmailChangePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-green-700">
          メールアドレス変更の確認
        </h2>
        <Suspense fallback={<div className="text-center">確認中...</div>}>
          <ConfirmEmailChangeClient />
        </Suspense>
      </div>
    </div>
  );
}
