"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInAction } from "@/features/auth/actions/auth-actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      const result = await signInAction(formData);

      if (result.success) {
        // リダイレクト元のURLがある場合はそこに戻る（middlewareと連携）
        const from = searchParams.get('from');
        router.push(from || "/");
      } else {
        setError(result.error || "ログインに失敗しました");
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
              <FormLabel className="text-gray-700 font-semibold">
                メールアドレス
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
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
              <FormLabel className="text-gray-700 font-semibold">
                パスワード
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  disabled={isPending || form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
          disabled={form.formState.isSubmitting}
        >
          {isPending ? "送信中..." : "サインイン"}
        </Button>
      <div className="text-center mt-2 space-y-2">
        <Link href="/sign-up" className="text-green-500 hover:underline text-sm block">
          アカウントをお持ちでない方はこちら
        </Link>
        <Link href="/forgot-password" className="text-gray-600 hover:underline text-sm block">
          パスワードをお忘れの方
        </Link>
      </div>
      </form>
    </Form>
  );
}
