'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
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

const MIN_DATE = '2025-01-01';
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const runningRecordSchema = z.object({
  date: z
    .string()
    .min(1, '日付を入力してください')
    .regex(DATE_REGEX, '日付はYYYY-MM-DD形式で入力してください')
    .refine((value) => value >= MIN_DATE, '日付は2025年1月1日以降を選択してください'),
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
  onClose: (freshMonthRecords?: RunRecord[]) => void;
}

export default function ClientRecordForm({
  selectedDate,
  isOpen,
  onClose,
}: ClientRecordFormProps) {
  // selectedDateに変化がない限り今日の日付計算を再実行しないようメモ化しておく
  const defaultDate = useMemo(() => {
    if (selectedDate && DATE_REGEX.test(selectedDate) && selectedDate >= MIN_DATE) {
      return selectedDate;
    }
    const today = new Date().toISOString().split('T')[0];
    return today >= MIN_DATE ? today : MIN_DATE;
  }, [selectedDate]);

  const form = useForm<RunningRecordFormData>({
    resolver: zodResolver(runningRecordSchema),
    defaultValues: {
      date: defaultDate,
      distance: '',
    },
  });

  // モーダルが開かれたときに日付を設定
  useEffect(() => {
    if (isOpen) {
      form.setValue('date', defaultDate);
    }
  }, [isOpen, defaultDate, form]);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback((freshMonthRecords?: RunRecord[]) => {
    form.reset({
      date: defaultDate,
      distance: '',
    });
    setError(null);
    if (onClose) {
      onClose(freshMonthRecords);
    }
  }, [form, onClose, defaultDate]);

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
                    <Input
                      type="date"
                      min={MIN_DATE}
                      {...field}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (!value) {
                          field.onChange(value);
                          return;
                        }
                        if (!DATE_REGEX.test(value)) {
                          field.onChange(value);
                          return;
                        }
                        if (value < MIN_DATE) {
                          field.onChange(MIN_DATE);
                          form.setError('date', {
                            type: 'min',
                            message: '日付は2025年1月1日以降を選択してください',
                          });
                          return;
                        }
                        form.clearErrors('date');
                        field.onChange(value);
                      }}
                    />
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
