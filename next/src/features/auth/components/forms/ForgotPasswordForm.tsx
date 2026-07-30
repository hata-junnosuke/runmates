'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { forgotPasswordAction } from '@/features/auth/actions/auth-actions';
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from '@/features/auth/schemas/auth-schemas';

import {
  EmailControl,
  labelClass,
  messageClass,
  submitButtonClass,
} from './auth-fields';

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
      const result = await forgotPasswordAction(data.email);

      if (result.success) {
        setMessage(
          'パスワードリセット用のメールを送信しました。メールボックスをご確認ください。',
        );
        // 3秒後にログインページへリダイレクト
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(result.error);
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

        {/* サーバー処理の成功メッセージ（リセットメール送信完了の案内）。下の error と排他 */}
        {message && (
          <div className="my-1 rounded-xl bg-[#E4F6EC] px-4 py-3 text-center text-[13px] text-[#169A66]">
            {message}
          </div>
        )}

        {/*
          サーバーアクション（forgotPasswordAction）の失敗メッセージ。
          サーバーに問い合わせないと分からないエラー用で、フォーム全体に対して1つ表示する。
          入力値の形式チェック（必須・メール形式等）は各欄の
          <FormMessage /> が react-hook-form 経由で別途表示するため、役割が重複しない。
        */}
        {error && (
          <div className="my-1 text-center text-[13px] text-[#dc2626]">
            {error}
          </div>
        )}

        <button type="submit" className={submitButtonClass} disabled={disabled}>
          {isPending ? '送信中...' : 'リセットメールを送信'}
        </button>
      </form>
    </Form>
  );
}
