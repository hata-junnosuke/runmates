import { Metadata } from 'next';

import ForgotPasswordForm from './_components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'パスワードリセット | Runmates',
  description: 'パスワードをリセットするためのメールを送信します。',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 md:p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl md:text-3xl font-bold text-green-700">
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
