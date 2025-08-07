'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(
          'パスワードリセット用のメールを送信しました。メールボックスをご確認ください。',
        );
        // 3秒後にログインページへリダイレクト
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(
          data.errors?.full_messages?.join(' ') ||
            'メールの送信に失敗しました。',
        );
      }
    } catch {
      setError('ネットワークエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-semibold text-gray-700"
        >
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="メールアドレスを入力"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      {message && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">{message}</p>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-green-600 py-2 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? '送信中...' : 'リセットメールを送信'}
      </button>

      <div className="mt-2 text-center">
        <Link href="/login" className="text-sm text-green-500 hover:underline">
          ログインに戻る
        </Link>
      </div>
    </form>
  );
}
