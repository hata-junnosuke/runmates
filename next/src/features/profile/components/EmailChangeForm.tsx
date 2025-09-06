'use client';

import { useState } from 'react';

import { changeEmail } from '../actions/change-email';

interface EmailChangeFormProps {
  currentEmail: string;
}

export function EmailChangeForm({ currentEmail }: EmailChangeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await changeEmail(newEmail, password);

      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message || '確認メールを送信しました',
        });
        setNewEmail('');
        setPassword('');
        // フォームは開いたままにして成功メッセージを表示
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'メールアドレスの変更に失敗しました',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'エラーが発生しました',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setNewEmail('');
    setPassword('');
    setMessage(null);
  };

  if (!isOpen) {
    return (
      <>
        {message && message.type === 'success' && (
          <div className="mb-4 rounded-md bg-green-50 p-3">
            <p className="text-sm text-green-800">{message.text}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setMessage(null);
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          メールアドレスを変更
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="new-email"
          className="block text-sm font-medium text-gray-700"
        >
          新しいメールアドレス
        </label>
        <input
          type="email"
          id="new-email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="新しいメールアドレスを入力"
          required
          disabled={isLoading}
        />
        {newEmail === currentEmail && newEmail && (
          <p className="mt-1 text-sm text-red-600">
            現在のメールアドレスと同じです
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          パスワード（確認用）
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="パスワードを入力"
          required
          disabled={isLoading}
        />
      </div>

      {message && (
        <div
          className={`rounded-md p-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="flex space-x-2">
        {message?.type === 'success' ? (
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              // メッセージは残しておく
            }}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            閉じる
          </button>
        ) : (
          <>
            <button
              type="submit"
              disabled={
                isLoading || !newEmail || !password || newEmail === currentEmail
              }
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? '送信中...' : '確認メールを送信'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
            >
              キャンセル
            </button>
          </>
        )}
      </div>
    </form>
  );
}