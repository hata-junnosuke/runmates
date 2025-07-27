import Link from 'next/link';
import { ChevronRight, User, Trash2 } from 'lucide-react';

export default async function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">設定</h1>
            <p className="text-gray-600 mt-2">アカウントの設定を管理します</p>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">
                アカウント設定
              </h2>
              
              <div className="divide-y divide-gray-200">
                <Link
                  href="/settings/profile"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">プロフィール</p>
                      <p className="text-sm text-gray-500">名前やメールアドレスの変更</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="border border-red-200 rounded-lg">
              <h2 className="text-lg font-semibold text-red-700 p-4 border-b border-red-200">
                危険な操作
              </h2>
              
              <div className="divide-y divide-red-200">
                <Link
                  href="/account/delete"
                  className="flex items-center justify-between p-4 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700">アカウントを削除</p>
                      <p className="text-sm text-red-500">すべてのデータが完全に削除されます</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-red-400" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              ← ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}