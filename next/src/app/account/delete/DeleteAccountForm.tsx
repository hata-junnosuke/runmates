'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { deleteAccount } from '@/app/actions/delete-account-action';

export default function DeleteAccountForm() {
  const [password, setPassword] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfirmed) {
      setError('データ削除への同意が必要です');
      return;
    }

    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteAccount(password);
      
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'アカウントの削除に失敗しました');
      }
    } catch {
      setError('予期しないエラーが発生しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-red-200 bg-red-50 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-red-800">
          <strong>警告:</strong> この操作は取り消すことができません。
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">削除されるデータ</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>アカウント情報（メールアドレス、名前など）</li>
          <li>すべての走行記録</li>
          <li>月間目標設定</li>
          <li>年間目標設定</li>
          <li>その他、アカウントに関連するすべてのデータ</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            パスワードを入力して本人確認を行ってください
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="現在のパスワード"
            className="w-full"
            disabled={isDeleting}
            required
          />
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="confirm"
            checked={isConfirmed}
            onCheckedChange={(checked: boolean) => setIsConfirmed(checked)}
            disabled={isDeleting}
          />
          <label
            htmlFor="confirm"
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            上記のデータがすべて完全に削除され、復旧できないことを理解しました
          </label>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="text-red-800">
              {error}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isDeleting}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={!isConfirmed || !password || isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                削除中...
              </>
            ) : (
              'アカウントを削除'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}