'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
    .refine(
      (value) => value >= MIN_DATE,
      '日付は2025年1月1日以降を選択してください',
    ),
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
  onSwitchToPlan?: () => void;
}

export default function ClientRecordForm({
  selectedDate,
  isOpen,
  onClose,
  onSwitchToPlan,
}: ClientRecordFormProps) {
  // selectedDateに変化がない限り今日の日付計算を再実行しないようメモ化しておく
  const defaultDate = useMemo(() => {
    if (
      selectedDate &&
      DATE_REGEX.test(selectedDate) &&
      selectedDate >= MIN_DATE
    ) {
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

  // モーダルが開いた時や選択日変更時に日付を固定セット
  useEffect(() => {
    if (isOpen) {
      form.setValue('date', defaultDate);
      const timer = window.setTimeout(() => {
        form.setFocus('distance', { shouldSelect: true });
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, defaultDate, form]);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const dateLabel = useMemo(() => {
    const date = defaultDate || '';
    if (!date || !DATE_REGEX.test(date)) return date;
    const [y, m, d] = date.split('-').map((v) => Number(v));
    return `${y}年${m}月${d}日`;
  }, [defaultDate]);

  const handleClose = useCallback(
    (freshMonthRecords?: RunRecord[]) => {
      form.reset({
        date: defaultDate,
        distance: '',
      });
      setError(null);
      if (onClose) {
        onClose(freshMonthRecords);
      }
    },
    [form, onClose, defaultDate],
  );

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
      <DialogContent className="border-t-4 border-emerald-400 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            🏃‍♂️ ランニング記録
          </DialogTitle>
          {onSwitchToPlan && (
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-center border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => onSwitchToPlan()}
              >
                予定フォームを開く
              </Button>
            </div>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 日付はカレンダーで選択した値をhiddenで送る */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <input type="hidden" {...field} value={field.value} />
              )}
            />

            {dateLabel && (
              <div className="text-sm text-gray-700">対象日: {dateLabel}</div>
            )}

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
