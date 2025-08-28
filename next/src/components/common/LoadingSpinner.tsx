import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /** サイズのバリエーション */
  size?: 'sm' | 'md' | 'lg';
  /** 表示するテキスト */
  text?: string;
  /** フルスクリーン表示 */
  fullScreen?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

/**
 * ローディングスピナーコンポーネント
 *
 * @example
 * ```tsx
 * // 基本的な使用方法
 * <LoadingSpinner />
 *
 * // テキスト付き
 * <LoadingSpinner text="データを読み込んでいます..." />
 *
 * // フルスクリーン
 * <LoadingSpinner fullScreen text="処理中..." />
 * ```
 */
export function LoadingSpinner({
  size = 'md',
  text = '読み込み中...',
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className,
      )}
    >
      <Loader2
        className={cn('animate-spin text-emerald-600', sizeClasses[size])}
      />
      {text && (
        <p
          className={cn(
            'text-gray-600',
            size === 'sm' && 'text-sm',
            size === 'lg' && 'text-lg',
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
