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
import { Textarea } from '@/components/ui/textarea';

import { createPlan, deletePlan, updatePlan } from '../../actions/plan-actions';
import { clientRunningPlansAPI } from '../../api/client-running-plans';
import type { RunningPlan } from '../../types';

const planSchema = z.object({
  planned_distance: z
    .number()
    .min(0.1, '距離は0より大きい値を入力してください')
    .max(999, '距離は1000km未満で入力してください'),
  memo: z.string().max(500, 'メモは500文字以内で入力してください').optional(),
});

type PlanFormData = z.infer<typeof planSchema>;

interface ClientPlanFormProps {
  date: string | null;
  isOpen: boolean;
  plansForDate: RunningPlan[];
  onClose: (freshMonthPlans?: RunningPlan[]) => void;
  onSwitchToRecord?: () => void;
}

export default function ClientPlanForm({
  date,
  isOpen,
  plansForDate,
  onClose,
  onSwitchToRecord,
}: ClientPlanFormProps) {
  const [editingPlan, setEditingPlan] = useState<RunningPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      planned_distance: 5,
      memo: '',
    },
  });

  // 開くたびに編集状態をリセットし、日付をセット
  useEffect(() => {
    if (isOpen) {
      setEditingPlan(null);
      setError(null);
      form.reset({
        planned_distance: 5,
        memo: '',
      });
    }
  }, [isOpen, form]);

  const dateLabel = useMemo(() => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }, [date]);

  const selectedPlanId = editingPlan?.id ?? null;

  const refreshMonthPlans = useCallback(async () => {
    if (!date) return [];
    const targetDate = new Date(date);
    const result = await clientRunningPlansAPI.getByMonth(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
    );
    return result.success ? result.data : [];
  }, [date]);

  const handleSubmit = (data: PlanFormData) => {
    if (!date) return;
    setError(null);

    startTransition(async () => {
      const payload = {
        date,
        planned_distance: data.planned_distance,
        memo: data.memo,
      };

      const result = selectedPlanId
        ? await updatePlan(selectedPlanId, payload)
        : await createPlan(payload);

      if (result.success) {
        // サーバーアクションが月データを返す場合はそれを優先し、なければ再取得
        const fresh =
          (result.data && result.data.length > 0 ? result.data : null) ||
          (await refreshMonthPlans());
        onClose(fresh);
      } else {
        setError(result.error || '予定の保存に失敗しました');
      }
    });
  };

  const handleEditClick = (plan: RunningPlan) => {
    setEditingPlan(plan);
    form.reset({
      planned_distance: Number(plan.planned_distance),
      memo: plan.memo ?? '',
    });
  };

  const handleDelete = (planId: string) => {
    if (!date) return;
    setError(null);

    startTransition(async () => {
      const result = await deletePlan(planId, date);
      if (result.success) {
        const fresh =
          (result.data && result.data.length > 0 ? result.data : null) ||
          (await refreshMonthPlans());
        onClose(fresh);
      } else {
        setError(result.error || '予定の削除に失敗しました');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="border-t-4 border-blue-400 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            📘 ランニング予定
          </DialogTitle>
          {onSwitchToRecord && (
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-center border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => onSwitchToRecord()}
              >
                記録フォームを開く
              </Button>
            </div>
          )}
          {date && <p className="text-sm text-gray-600">対象日: {dateLabel}</p>}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="planned_distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>予定距離 (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="999"
                      placeholder="10.0"
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
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ（任意）</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="コースや強度などをメモできます"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending || form.formState.isSubmitting}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {selectedPlanId ? '予定を更新' : '予定を追加'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
                disabled={isPending || form.formState.isSubmitting}
                className="flex-1"
              >
                閉じる
              </Button>
            </div>
          </form>
        </Form>

        {/* 既存予定一覧 */}
        <div className="mt-4 space-y-2">
          <div className="text-sm font-semibold text-gray-700">
            この日の予定
          </div>
          {plansForDate.length === 0 && (
            <p className="text-sm text-gray-500">まだ予定がありません。</p>
          )}
          {plansForDate.map((plan) => (
            <div
              key={plan.id}
              className="flex items-start justify-between rounded-md border bg-gray-50 p-3 text-sm"
            >
              <div>
                <div className="font-semibold text-gray-800">
                  {Number(plan.planned_distance).toFixed(1)} km
                </div>
                <div className="text-xs text-gray-600">
                  ステータス: {statusLabel(plan.status)}
                </div>
                {plan.memo && (
                  <div className="mt-1 text-xs whitespace-pre-wrap text-gray-600">
                    {plan.memo}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(plan)}
                >
                  編集
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(plan.id)}
                  disabled={isPending}
                >
                  削除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function statusLabel(status: RunningPlan['status']) {
  switch (status) {
    case 'planned':
      return '予定';
    case 'partial':
      return '部分達成';
    case 'completed':
      return '達成';
    default:
      return status;
  }
}
