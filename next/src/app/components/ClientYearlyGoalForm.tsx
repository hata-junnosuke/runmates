'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setYearlyGoal } from '../actions/running-actions';

interface ClientYearlyGoalFormProps {
  currentGoal: number;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  showWelcomeMessage?: boolean;
  hideButton?: boolean;
}

export default function ClientYearlyGoalForm({ currentGoal, isOpen = false, onClose, onOpen, showWelcomeMessage = false, hideButton = false }: ClientYearlyGoalFormProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 外部から制御される場合
  const isExternallyControlled = isOpen !== undefined && onClose !== undefined;
  const currentModalOpen = isExternallyControlled ? isOpen : modalOpen;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await setYearlyGoal(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to set yearly goal:', error);
      alert('年間目標の設定に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isExternallyControlled && onClose) {
      onClose();
    } else {
      setModalOpen(false);
    }
  };

  const handleOpen = () => {
    if (isExternallyControlled && onOpen) {
      onOpen();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      {!hideButton && (
        <Button
          variant="outline"
          onClick={handleOpen}
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
        >
          🏃‍♂️ {showWelcomeMessage ? '年間目標を設定しましょう！' : '年間目標を変更'}
        </Button>
      )}

      <Dialog open={currentModalOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              {showWelcomeMessage ? '🎯 年間目標を設定しましょう！' : '🏃‍♂️ 年間目標を変更'}
            </DialogTitle>
          </DialogHeader>
          
          {showWelcomeMessage && (
            <p className="text-gray-600 mb-4">
              1年間の走行距離目標を設定して、長期的なランニング習慣を身につけましょう！
            </p>
          )}
          
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="distance_goal">年間目標距離 (km)</Label>
              <Input
                type="number"
                id="distance_goal"
                name="distance_goal"
                step="0.1"
                min="50"
                max="2000"
                required
                defaultValue={currentGoal}
                placeholder="500.0"
              />
              <p className="text-xs text-muted-foreground">
                現在の目標: {currentGoal}km (推奨: 300-1000km)
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {isSubmitting ? '保存中...' : (showWelcomeMessage ? '年間目標を設定' : '目標を変更')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                {showWelcomeMessage ? '後で設定' : 'キャンセル'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}