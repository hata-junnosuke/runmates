import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  /** アイコンまたはイラスト */
  icon?: ReactNode;
  /** タイトル */
  title: string;
  /** 説明文 */
  description?: string;
  /** アクションボタン */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  /** 追加のクラス名 */
  className?: string;
}

/**
 * 空状態コンポーネント
 * データがない場合や初期状態を表示するために使用
 *
 * @example
 * ```tsx
 * // 基本的な使用方法
 * <EmptyState
 *   title="データがありません"
 *   description="データを追加してください"
 * />
 *
 * // アイコンとアクション付き
 * <EmptyState
 *   icon={<FileText className="h-12 w-12" />}
 *   title="記録がありません"
 *   description="最初の記録を追加しましょう"
 *   action={{
 *     label: "記録を追加",
 *     onClick: handleAdd
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {icon && <div className="mb-4 text-gray-400">{icon}</div>}

        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {description && (
          <p className="mt-2 max-w-sm text-sm text-gray-600">{description}</p>
        )}

        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="mt-6"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
