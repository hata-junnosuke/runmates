'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createAccountAction } from '@/features/auth/actions/auth-actions';

import {
  EmailControl,
  labelClass,
  messageClass,
  PasswordControl,
  submitButtonClass,
} from './auth-fields';

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
          サーバーアクション（registerAction）の失敗メッセージ。
          「既に登録済みのメール」等サーバーに問い合わせないと分からないエラー用で、
          フォーム全体に対して1つ表示する。
          入力値の形式チェック（必須・メール形式・パスワード長等）は各欄の
          <FormMessage /> が react-hook-form 経由で別途表示するため、役割が重複しない。
        */}
        {error && (
          <div className="my-1 text-center text-[13px] text-[#dc2626]">
            {error}
          </div>
        )}
        {/* サーバー処理の成功メッセージ（登録完了の案内など）。上の error と排他 */}
        {success && (
          <div className="my-1 rounded-xl bg-[#E4F6EC] px-4 py-3 text-center text-[13px] text-[#169A66]">
            {success}
          </div>
        )}
        <button type="submit" className={submitButtonClass} disabled={disabled}>
          {isPending ? '送信中...' : 'アカウント作成'}
        </button>
      </form>
    </Form>
  );
}
