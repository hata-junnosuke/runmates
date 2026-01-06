'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
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

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
    passwordConfirmation: z
      .string()
      .min(6, 'パスワードは6文字以上で入力してください'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  useEffect(() => {
    if (!token) {
      setError(
        '無効なリンクです。パスワードリセットをもう一度お試しください。',
      );
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('無効なリンクです。');
      return;
    }

    setError('');

    startTransition(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/password`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
            credentials: 'include',
            body: JSON.stringify({
              password: data.password,
              password_confirmation: data.passwordConfirmation,
              reset_password_token: token,
            }),
          },
        );

        const responseData = await response.json();

        if (response.ok && responseData.success) {
          // パスワードリセット成功 - 自動的にログインされる
          router.push('/dashboard');
        } else {
          setError(
            responseData.errors?.full_messages?.join(' ') ||
              'パスワードのリセットに失敗しました。リンクの有効期限が切れている可能性があります。',
          );
        }
      } catch {
        setError('ネットワークエラーが発生しました。');
      }
    });
  };

  if (!token) {
    return (
      <div className="space-y-5">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-green-500 hover:underline"
          >
            パスワードリセットをもう一度行う
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">
                新しいパスワード
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="6文字以上で入力"
                  className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  disabled={isPending || form.formState.isSubmitting}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">
                パスワード（確認）
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="もう一度入力"
                  className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  disabled={isPending || form.formState.isSubmitting}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          {isPending ? '設定中...' : 'パスワードを設定'}
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
