'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reset_password`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('パスワードリセット用のメールを送信しました。メールボックスをご確認ください。');
        // 3秒後にサインインページへリダイレクト
        setTimeout(() => {
          router.push('/sign_in');
        }, 3000);
      } else {
        setError(data.errors?.full_messages?.join(' ') || 'メールの送信に失敗しました。');
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
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
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
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
      >
        {loading ? '送信中...' : 'リセットメールを送信'}
      </button>

      <div className="text-center mt-2">
        <Link 
          href="/sign_in" 
          className="text-green-500 hover:underline text-sm"
        >
          サインインに戻る
        </Link>
      </div>
    </form>
  );
}