import { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'パスワードリセット | Runmates',
  description: 'パスワードをリセットするためのメールを送信します。',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          パスワードをリセット
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          登録したメールアドレスを入力してください。
          パスワードリセット用のリンクをメールで送信します。
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}