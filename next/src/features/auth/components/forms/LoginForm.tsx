'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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
import { loginAction } from '@/features/auth/actions/auth-actions';

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result = await loginAction(formData);

      if (result.success) {
        // リダイレクト元のURLがある場合はそこに戻る（middlewareと連携）
        const from = searchParams.get('from');
        router.push(from || '/dashboard');
      } else {
        setError(result.error || 'ログインに失敗しました');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                  className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  disabled={isPending || form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">
                パスワード
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  disabled={isPending || form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="text-center text-sm text-red-500">{error}</div>
        )}
        <Button
          type="submit"
          className="w-full rounded bg-green-600 py-2 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
          disabled={isPending || form.formState.isSubmitting}
        >
          {isPending ? '送信中...' : 'ログイン'}
        </Button>
        <div className="mt-2 space-y-2 text-center">
          <Link
            href="/create-account"
            className="block text-sm text-green-500 hover:underline"
          >
            アカウントをお持ちでない方
          </Link>
          <Link
            href="/forgot-password"
            className="block text-sm text-gray-600 hover:underline"
          >
            パスワードをお忘れの方
          </Link>
        </div>
      </form>
    </Form>
  );
}
