'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { changeEmail } from '../actions/change-email';

interface EmailChangeFormProps {
  currentEmail: string;
}

const emailChangeSchema = z.object({
  newEmail: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

export function EmailChangeForm({ currentEmail }: EmailChangeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  });

  const onSubmit = async (data: EmailChangeFormData) => {
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await changeEmail(data.newEmail, data.password);

        if (result.success) {
          setMessage({
            type: 'success',
            text: result.message || '確認メールを送信しました',
          });
          form.reset();
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
      }
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
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
        <Button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setMessage(null);
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          メールアドレスを変更
        </Button>
      </>
    );
  }

  const watchNewEmail = form.watch('newEmail');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                新しいメールアドレス
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="新しいメールアドレスを入力"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  disabled={isPending || form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              {watchNewEmail === currentEmail && watchNewEmail && (
                <p className="mt-1 text-sm text-red-600">
                  現在のメールアドレスと同じです
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                パスワード（確認用）
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="パスワードを入力"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  disabled={isPending || form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                // メッセージは残しておく
              }}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              閉じる
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  form.formState.isSubmitting ||
                  watchNewEmail === currentEmail
                }
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isPending ? '送信中...' : '確認メールを送信'}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                disabled={isPending || form.formState.isSubmitting}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
              >
                キャンセル
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}