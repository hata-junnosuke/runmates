import { Mail } from 'lucide-react';
import Link from 'next/link';

import { getUserProfile } from '@/features/profile/actions/get-user-profile';
import { EmailChangeForm } from '@/features/profile/components/EmailChangeForm';

// getUserProfile内でcookies()を参照するため静的生成ができず動的レンダリングを明示
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { user, error } = await getUserProfile();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-lg md:p-8">
          {error || !user ? (
            <div className="text-center">
              <h1 className="text-xl font-semibold text-red-600">
                エラーが発生しました
              </h1>
              <p className="mt-2 text-gray-600">
                {error || 'ユーザー情報の取得に失敗しました'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  メールアドレス設定
                </h1>
                <p className="mt-2 text-sm text-gray-600 md:text-base">
                  メールアドレスの変更ができます
                </p>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="flex items-center border-b border-gray-200 p-4">
                  <Mail className="mr-3 h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    メールアドレス
                  </h2>
                </div>
                <div className="p-4 md:p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      現在のメールアドレス
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                      {user.email}
                    </p>
                    {user.pending_email && (
                      <div className="mt-2 rounded-md bg-yellow-50 p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>{user.pending_email}</strong>{' '}
                          への変更を確認中です。 メールをご確認ください。
                        </p>
                      </div>
                    )}
                  </div>
                  <EmailChangeForm currentEmail={user.email} />
                </div>
              </div>
            </>
          )}

          <div className="mt-8">
            <Link
              href="/settings"
              className="inline-flex items-center font-medium text-green-600 hover:text-green-700"
            >
              ← 設定に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
