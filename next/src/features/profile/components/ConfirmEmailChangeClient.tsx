'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { logoutAction } from '@/features/auth/actions/auth-actions';

import { confirmEmailChange } from '../actions/confirm-email-change';

export default function ConfirmEmailChangeClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('無効なリンクです。確認トークンがありません。');
      return;
    }

    const confirmEmailChangeRequest = async () => {
      const result = await confirmEmailChange(token);

      if (result.success) {
        setStatus('success');
        setMessage('メールアドレスが変更されました');
        setNewEmail(result.email);

        // 3秒後にログアウト（Server Action経由で確実にクッキーをクリア）
        setTimeout(() => {
          logoutAction();
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.error);
      }
    };

    confirmEmailChangeRequest();
  }, [token]);

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
