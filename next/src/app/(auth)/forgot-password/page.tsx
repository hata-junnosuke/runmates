import { Metadata } from 'next';

import ForgotPasswordForm from '@/features/auth/components/forms/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'パスワードリセット | Runmates',
  description: 'パスワードをリセットするためのメールを送信します。',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg md:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-700 md:text-3xl">
          パスワードをリセット
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          登録したメールアドレスを入力してください。
          パスワードリセット用のリンクをメールで送信します。
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
