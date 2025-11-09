'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const forgotPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setMessage('');
    setError('');

    startTransition(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              email: data.email,
              redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
            }),
          },
        );

        const responseData = await response.json();

        if (response.ok && responseData.success) {
          setMessage(
            'パスワードリセット用のメールを送信しました。メールボックスをご確認ください。',
          );
          // 3秒後にログインページへリダイレクト
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setError(
            responseData.errors?.full_messages?.join(' ') ||
              'メールの送信に失敗しました。',
          );
        }
      } catch {
        setError('ネットワークエラーが発生しました。');
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">
                メールアドレス
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="メールアドレスを入力"
                  className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  disabled={isPending || form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending || form.formState.isSubmitting}
          className="w-full rounded bg-green-600 py-2 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? '送信中...' : 'リセットメールを送信'}
        </Button>

        <div className="mt-2 text-center">
          <Link
            href="/login"
            className="text-sm text-green-500 hover:underline"
          >
            ログインに戻る
          </Link>
        </div>
      </form>
    </Form>
  );
}
