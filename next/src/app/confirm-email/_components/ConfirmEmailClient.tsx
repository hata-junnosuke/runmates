'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConfirmEmailClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('無効なリンクです。確認トークンがありません。');
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/confirmation?confirmation_token=${token}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('メールアドレスの確認が完了しました！');
          // 3秒後にログインページへリダイレクト
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.errors?.join(' ') || '確認に失敗しました。リンクの有効期限が切れている可能性があります。');
        }
      } catch {
        setStatus('error');
        setMessage('ネットワークエラーが発生しました。');
      }
    };

    confirmEmail();
  }, [token, router]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">メールアドレスを確認中...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <p className="text-green-600 font-semibold mb-4">{message}</p>
        <p className="text-gray-600 mb-4">
          ウェルカムメールをお送りしました。<br />
          3秒後にログインページへ移動します。
        </p>
        <Link href="/login" className="text-green-500 hover:underline text-sm">
          今すぐログインする
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <svg className="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <p className="text-red-600 font-semibold mb-4">{message}</p>
      <div className="space-y-2">
        <Link href="/create-account" className="block text-green-500 hover:underline text-sm">
          アカウント作成をやり直す
        </Link>
        <Link href="/login" className="block text-green-500 hover:underline text-sm">
          ログインページへ
        </Link>
      </div>
    </div>
  );
}