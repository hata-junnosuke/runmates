'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
      setError(
        '無効なリンクです。パスワードリセットをもう一度お試しください。',
      );
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('無効なリンクです。');
      return;
    }

    // フロントエンドでの入力検証用の比較なのでタイミング攻撃のリスクは低い
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (password !== passwordConfirmation) {
      setError('パスワードが一致しません。');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password`,
        {
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
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // パスワードリセット成功 - 自動的にログインされる
        router.push('/');
      } else {
        setError(
          data.errors?.full_messages?.join(' ') ||
            'パスワードのリセットに失敗しました。リンクの有効期限が切れている可能性があります。',
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
            className="text-sm text-green-500 hover:underline"
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
        <label
          htmlFor="password"
          className="mb-2 block font-semibold text-gray-700"
        >
          新しいパスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="6文字以上で入力"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          disabled={loading}
        />
      </div>
      <div>
        <label
          htmlFor="password-confirmation"
          className="mb-2 block font-semibold text-gray-700"
        >
          パスワード（確認）
        </label>
        <input
          id="password-confirmation"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          required
          className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
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
        className="w-full rounded bg-green-600 py-2 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? '設定中...' : 'パスワードを設定'}
      </button>

      <div className="mt-2 text-center">
        <Link href="/login" className="text-sm text-green-500 hover:underline">
          ログインに戻る
        </Link>
      </div>
    </form>
  );
}
