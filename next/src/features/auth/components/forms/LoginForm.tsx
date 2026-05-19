'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { loginAction } from '@/features/auth/actions/auth-actions';

import {
  EmailControl,
  labelClass,
  messageClass,
  PasswordControl,
  submitButtonClass,
} from './auth-fields';

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

  const disabled = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-3 gap-1.5">
              <FormLabel className={labelClass}>メールアドレス</FormLabel>
              <EmailControl field={field} disabled={disabled} />
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-3 gap-1.5">
              <FormLabel className={labelClass}>パスワード</FormLabel>
              <PasswordControl field={field} disabled={disabled} />
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />
        {/*
          サーバーアクション（loginAction）の失敗メッセージ。
          「パスワードが違う」等サーバーに問い合わせないと分からないエラー用で、
          フォーム全体に対して1つ表示する。
          入力値の形式チェック（必須・メール形式等）は各欄の
          <FormMessage /> が react-hook-form 経由で別途表示するため、役割が重複しない。
        */}
        {error && (
          <div className="my-1 text-center text-[13px] text-[#dc2626]">
            {error}
          </div>
        )}
        <button type="submit" className={submitButtonClass} disabled={disabled}>
          {isPending ? '送信中...' : 'ログイン'}
        </button>
      </form>
    </Form>
  );
}
