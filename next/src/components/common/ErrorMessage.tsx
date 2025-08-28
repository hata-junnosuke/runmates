import { AlertCircle, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  /** エラーオブジェクトまたはメッセージ文字列 */
  error: Error | string;
  /** エラータイトル */
  title?: string;
  /** リトライ関数 */
  retry?: () => void;
  /** 追加のクラス名 */
  className?: string;
  /** エラーの種類 */
  variant?: 'default' | 'destructive';
}

/**
 * エラーメッセージコンポーネント
 *
 * @example
 * ```tsx
 * // 基本的な使用方法
 * <ErrorMessage error="エラーが発生しました" />
 *
 * // Errorオブジェクトを渡す
 * <ErrorMessage error={error} />
 *
 * // リトライボタン付き
 * <ErrorMessage error={error} retry={handleRetry} />
 * ```
 */
export function ErrorMessage({
  error,
  title = 'エラーが発生しました',
  retry,
  className,
  variant = 'destructive',
}: ErrorMessageProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Alert variant={variant} className={cn('', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{errorMessage}</p>
        {retry && (
          <Button onClick={retry} variant="outline" size="sm" className="mt-3">
            <RefreshCw className="mr-2 h-3 w-3" />
            再試行
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
