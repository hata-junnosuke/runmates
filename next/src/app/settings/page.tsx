import { ChevronRight, Trash2, User } from 'lucide-react';
import Link from 'next/link';

export default async function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-lg md:p-8">

          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              設定
            </h1>
            <p className="mt-2 text-sm text-gray-600 md:text-base">
              アカウントの設定を管理します
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200">
              <h2 className="border-b border-gray-200 p-4 text-lg font-semibold text-gray-900">
                アカウント設定
              </h2>

              <div className="divide-y divide-gray-200">
                <Link
                  href="/settings/profile"
                  className="flex items-center justify-between p-3 transition-colors hover:bg-gray-50 md:p-4"
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">プロフィール</p>
                      <p className="text-xs text-gray-500 md:text-sm">
                        メールアドレスの変更
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-red-200">
              <h2 className="border-b border-red-200 p-4 text-lg font-semibold text-red-700">
                危険な操作
              </h2>

              <div className="divide-y divide-red-200">
                <Link
                  href="/account/delete"
                  className="flex items-center justify-between p-3 transition-colors hover:bg-red-50 md:p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 flex-shrink-0 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700">
                        アカウントを削除
                      </p>
                      <p className="text-xs text-red-500 md:text-sm">
                        すべてのデータが完全に削除されます
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-red-400" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center font-medium text-green-600 hover:text-green-700"
            >
              ← ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
