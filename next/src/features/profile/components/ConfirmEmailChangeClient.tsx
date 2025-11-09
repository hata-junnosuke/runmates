'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { logoutAction } from '@/features/auth/actions/auth-actions';

export default function ConfirmEmailChangeClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('無効なリンクです。確認トークンがありません。');
      return;
    }

    const confirmEmailChange = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/email_confirmation?confirmation_token=${token}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('メールアドレスが変更されました');
          setNewEmail(data.email || '');

          // 3秒後にログアウト（Server Action経由で確実にクッキーをクリア）
          setTimeout(() => {
            logoutAction();
          }, 3000);
        } else {
          setStatus('error');
          setMessage(
            data.errors?.join(' ') ||
              'メールアドレスの変更に失敗しました。リンクの有効期限が切れている可能性があります。',
          );
        }
      } catch {
        setStatus('error');
        setMessage('ネットワークエラーが発生しました。');
      }
    };

    confirmEmailChange();
  }, [token, router]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">メールアドレスを変更中...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <p className="mb-4 font-semibold text-green-600">{message}</p>
        {newEmail && (
          <p className="mb-4 text-gray-600">
            新しいメールアドレス：
            <br />
            <span className="font-semibold">{newEmail}</span>
          </p>
        )}
        <p className="mb-4 text-orange-600">
          セキュリティのため、新しいメールアドレスで再度ログインしてください。
        </p>
        <p className="mb-4 text-gray-600">
          3秒後にログインページへ移動します。
        </p>
        <Link href="/login" className="text-sm text-green-500 hover:underline">
          今すぐログインページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
      <p className="mb-4 font-semibold text-red-600">{message}</p>
      <div className="space-y-2">
        <Link
          href="/settings"
          className="block text-sm text-green-500 hover:underline"
        >
          設定ページへ戻る
        </Link>
        <Link href="/" className="block text-sm text-green-500 hover:underline">
          ホームへ
        </Link>
      </div>
    </div>
  );
}
