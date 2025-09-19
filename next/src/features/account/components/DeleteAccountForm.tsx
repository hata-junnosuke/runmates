'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { deleteAccount } from '@/features/account/actions/delete-account-action';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'パスワードを入力してください'),
  isConfirmed: z.boolean().refine((val) => val === true, {
    message: 'データ削除への同意が必要です',
  }),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export default function DeleteAccountForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: '',
      isConfirmed: false,
    },
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await deleteAccount(data.password);

        if (result.success) {
          router.push('/');
        } else {
          setError(result.error || 'アカウントの削除に失敗しました');
        }
      } catch {
        setError('予期しないエラーが発生しました');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
        <div className="text-red-800">
          <strong>警告:</strong> この操作は取り消すことができません。
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">削除されるデータ</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-700">
          <li>アカウント情報（メールアドレス、名前など）</li>
          <li>すべての走行記録</li>
          <li>月間目標設定</li>
          <li>年間目標設定</li>
          <li>その他、アカウントに関連するすべてのデータ</li>
        </ul>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  パスワードを入力して本人確認を行ってください
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="現在のパスワード"
                    className="w-full"
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
            name="isConfirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending || form.formState.isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer text-sm text-gray-700 font-normal">
                    上記のデータがすべて完全に削除され、復旧できないことを理解しました
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending || form.formState.isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending || form.formState.isSubmitting}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                'アカウントを削除'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
