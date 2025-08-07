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
import { createAccountAction } from '@/features/auth/actions/auth-actions';

const createAccountSchema = z
  .object({
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
    passwordConfirmation: z.string().min(1, '確認パスワードを入力してください'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export default function CreateAccountForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (data: CreateAccountFormData) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('passwordConfirmation', data.passwordConfirmation);

      const result = await createAccountAction(formData);

      if (result.success) {
        setSuccess(
          '確認メールを送信しました。メールを確認してアカウントを有効化してください。',
        );
        // サインインページへのリダイレクトを遅延
        setTimeout(() => router.push('/login'), 5000);
      } else {
        setError(result.error || '登録に失敗しました');
      }
    });
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
        {success && (
          <div className="text-center text-sm text-green-600">{success}</div>
        )}
        <Button
          type="submit"
          className="w-full rounded bg-green-600 py-2 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
          disabled={form.formState.isSubmitting}
        >
          {isPending ? '送信中...' : 'アカウント作成'}
        </Button>
        <div className="mt-2 text-center">
          <Link
            href="/login"
            className="text-sm text-green-500 hover:underline"
          >
            すでにアカウントをお持ちの方
          </Link>
        </div>
      </form>
    </Form>
  );
}
