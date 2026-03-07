'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { updateMonthlyGoal } from '../../actions/running-actions';
import type { GoalFormProps } from '../../types';

const monthlyGoalSchema = z.object({
  distance_goal: z.union([
    z.number().min(1, '目標距離は1km以上で入力してください'),
    z.literal('').transform(() => null),
    z.null(),
  ]),
});

type MonthlyGoalFormData = {
  distance_goal: number | '' | null;
};

export default function ClientGoalForm({
  currentGoal,
  isOpen,
  onClose,
  showWelcomeMessage = false,
}: GoalFormProps) {
  const form = useForm<MonthlyGoalFormData>({
    resolver: zodResolver(monthlyGoalSchema),
    defaultValues: {
      distance_goal: '',
    },
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    form.reset();
    setError(null);
    if (onClose) {
      onClose();
    }
  }, [form, onClose]);

  const onSubmit = async (data: MonthlyGoalFormData) => {
    setError(null);
    const distanceGoal =
      data.distance_goal === '' || data.distance_goal === null
        ? 0
        : data.distance_goal;

    if (!distanceGoal) {
      setError('目標距離を入力してください');
      return;
    }

    // 非同期処理をトランジションでラップすることで、この処理の間はisPendingがtrueになる
    startTransition(async () => {
      const result = await updateMonthlyGoal({ distanceGoal });
      if (result.success) {
        form.reset();
        handleClose();
      } else {
        setError(result.error || '目標の設定に失敗しました');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {showWelcomeMessage
              ? '🎉 ランニングを始めましょう！'
              : '🎯 今月の目標を変更'}
          </DialogTitle>
          <DialogDescription>
            {showWelcomeMessage
              ? '初めての目標を設定して、健康的な習慣を始めましょう。'
              : '今月の走行距離の目標を変更します。'}
          </DialogDescription>
        </DialogHeader>

        {showWelcomeMessage && (
          <p className="mb-4 text-gray-600">
            まずは今月の走行距離目標を設定して、モチベーションを高めましょう！
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="distance_goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目標距離 (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      min="1"
                      placeholder="50.0"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          field.onChange('');
                        } else {
                          const numValue = parseFloat(value);
                          field.onChange(isNaN(numValue) ? '' : numValue);
                        }
                      }}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    現在の目標: {currentGoal ? `${currentGoal}km` : '未設定'}
                  </FormDescription>
                  <FormMessage />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isPending || form.formState.isSubmitting}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                {isPending || form.formState.isSubmitting
                  ? '保存中...'
                  : showWelcomeMessage
                    ? '目標を設定'
                    : '目標を変更'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending || form.formState.isSubmitting}
                className="flex-1"
              >
                {showWelcomeMessage ? '後で設定' : 'キャンセル'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
