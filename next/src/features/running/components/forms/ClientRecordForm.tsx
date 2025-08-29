'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState, useTransition } from 'react';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { createRunningRecord } from '../../actions/running-actions';
import type { RunRecord } from '../../types';

const runningRecordSchema = z.object({
  date: z.string().min(1, '日付を入力してください'),
  distance: z.union([
    z.number().min(0.01, '距離は0より大きい値を入力してください'),
    z.literal('').transform(() => 0),
  ]),
});

type RunningRecordFormData = {
  date: string;
  distance: number | '';
};

interface ClientRecordFormProps {
  selectedDate?: string;
  isOpen: boolean;
  onClose: (updatedRecords?: RunRecord[]) => void;
}

export default function ClientRecordForm({
  selectedDate,
  isOpen,
  onClose,
}: ClientRecordFormProps) {
  const form = useForm<RunningRecordFormData>({
    resolver: zodResolver(runningRecordSchema),
    defaultValues: {
      date: selectedDate || '',
      distance: '',
    },
  });

  // モーダルが開かれたときに日付を設定
  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        form.setValue('date', selectedDate);
      } else {
        form.setValue('date', new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, selectedDate, form]);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback((updatedRecords?: RunRecord[]) => {
    form.reset({
      date: '',
      distance: '',
    });
    setError(null);
    if (onClose) {
      onClose(updatedRecords);
    }
  }, [form, onClose]);

  const onSubmit = async (data: RunningRecordFormData) => {
    setError(null);
    const distance = data.distance === '' ? 0 : data.distance;

    startTransition(async () => {
      const result = await createRunningRecord({
        date: data.date,
        distance,
      });
      if (result.success) {
        form.reset();
        // 最新データをprops経由で親コンポーネントに渡す
        handleClose(result.data);
      } else {
        setError(result.error || '記録の保存に失敗しました');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            🏃‍♂️ 新しい走行記録
          </DialogTitle>
          <DialogDescription>
            本日の走行距離を記録しましょう。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日付</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>距離 (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="5.0"
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
                  <FormMessage />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isPending || form.formState.isSubmitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {isPending || form.formState.isSubmitting
                  ? '保存中...'
                  : '記録を保存'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose()}
                disabled={isPending || form.formState.isSubmitting}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
