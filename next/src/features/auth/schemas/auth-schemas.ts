import { z } from 'zod';

// フォームのバリデーションとServer Actionの実行時検証で共有する
// （Server Actionは公開エンドポイントなのでクライアント側の検証だけでは不十分）
export const forgotPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
