'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('無効なリンクです。パスワードリセットをもう一度お試しください。');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('無効なリンクです。');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('パスワードが一致しません。');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password,
          password_confirmation: passwordConfirmation,
          reset_password_token: token,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // パスワードリセット成功 - 自動的にログインされる
        router.push('/');
      } else {
        setError(
          data.errors?.full_messages?.join(' ') || 
          'パスワードのリセットに失敗しました。リンクの有効期限が切れている可能性があります。'
        );
      }
    } catch {
      setError('ネットワークエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-5">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
        <div className="text-center">
          <Link 
            href="/forgot-password" 
            className="text-green-500 hover:underline text-sm"
          >
            パスワードリセットをもう一度行う
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
          新しいパスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="6文字以上で入力"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password-confirmation" className="block text-gray-700 font-semibold mb-2">
          パスワード（確認）
        </label>
        <input
          id="password-confirmation"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="もう一度入力"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          minLength={6}
          disabled={loading}
        />
      </div>

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
        {loading ? '設定中...' : 'パスワードを設定'}
      </button>

      <div className="text-center mt-2">
        <Link 
          href="/login" 
          className="text-green-500 hover:underline text-sm"
        >
          ログインに戻る
        </Link>
      </div>
    </form>
  );
}