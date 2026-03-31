'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CelebrationModalProps {
  type: 'monthly' | 'yearly';
  onDismiss: () => Promise<{ success: boolean }>;
}

function getMessage(type: 'monthly' | 'yearly') {
  if (type === 'monthly') {
    return {
      title: '月間目標達成！',
      description: '今月の走行距離目標を達成しました！',
    };
  }
  return {
    title: '年間目標達成！',
    description: '今年の走行距離目標を達成しました！',
  };
}

export default function CelebrationModal({
  type,
  onDismiss,
}: CelebrationModalProps) {
  const [open, setOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const { title, description } = getMessage(type);

  const handleClose = () => {
    setOpen(false);
    startTransition(async () => {
      const result = await onDismiss();
      if (!result.success) {
        setError(true);
        setOpen(true);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader className="items-center">
          <div className="mb-2 text-6xl" aria-hidden="true">
            {type === 'monthly' ? '🎉' : '🏆'}
          </div>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
          <p className="text-muted-foreground pt-2 text-sm">
            この調子で頑張りましょう！
          </p>
        </DialogHeader>
        {error && (
          <p className="text-sm text-red-500">
            更新に失敗しました。もう一度お試しください。
          </p>
        )}
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleClose}
            disabled={isPending}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isPending ? '更新中...' : 'OK'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
