'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { linkClass } from '@/features/auth/components/auth-styles';

import {
  labelClass,
  messageClass,
  PasswordControl,
  submitButtonClass,
} from './auth-fields';

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
      <div>
        {/*
          URL に token が無い／無効な場合の早期return。
          useEffect で setError 済みのメッセージ（無効なリンク）を表示する。
          フォーム自体をレンダリングしないため、ここでは error を直接表示する。
        */}
        <div className="my-1 text-center text-[13px] text-[#dc2626]">
          {error}
        </div>
        <div className="mt-4 text-center text-[13px]">
          <Link href="/forgot-password" className={linkClass}>
            パスワードリセットをもう一度行う
          </Link>
        </div>
      </div>
    );
  }

  const disabled = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-3 gap-1.5">
              <FormLabel className={labelClass}>新しいパスワード</FormLabel>
              <PasswordControl
                field={field}
                disabled={disabled}
                autoComplete="new-password"
              />
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem className="mb-3 gap-1.5">
              <FormLabel className={labelClass}>パスワード（確認）</FormLabel>
              <PasswordControl
                field={field}
                disabled={disabled}
                autoComplete="new-password"
              />
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />

        {/*
          パスワード更新（resetPasswordAction）の失敗メッセージ。
          「トークン期限切れ」等サーバーに問い合わせないと分からないエラー用で、
          フォーム全体に対して1つ表示する。
          入力値の形式チェック（必須・パスワード一致等）は各欄の
          <FormMessage /> が react-hook-form 経由で別途表示するため、役割が重複しない。
        */}
        {error && (
          <div className="my-1 text-center text-[13px] text-[#dc2626]">
            {error}
          </div>
        )}

        <button type="submit" className={submitButtonClass} disabled={disabled}>
          {isPending ? '設定中...' : 'パスワードを設定'}
        </button>
      </form>
    </Form>
  );
}
