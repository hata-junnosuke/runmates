'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setMonthlyGoal } from '../actions/running-actions';

interface ClientGoalFormProps {
  currentGoal: number;
  isOpen?: boolean;
  onClose?: () => void;
  showWelcomeMessage?: boolean;
}

export default function ClientGoalForm({ currentGoal, isOpen = false, onClose, showWelcomeMessage = false }: ClientGoalFormProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 外部から制御される場合
  const isExternallyControlled = isOpen !== undefined && onClose !== undefined;
  const currentModalOpen = isExternallyControlled ? isOpen : modalOpen;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await setMonthlyGoal(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to set goal:', error);
      alert('目標の設定に失敗しました');
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

  return (
    <Dialog open={currentModalOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              {showWelcomeMessage ? '🎉 ランニングを始めましょう！' : '🎯 今月の目標を変更'}
            </DialogTitle>
          </DialogHeader>
          
          {showWelcomeMessage && (
            <p className="text-gray-600 mb-4">
              まずは今月の走行距離目標を設定して、モチベーションを高めましょう！
            </p>
          )}
          
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="distance_goal">目標距離 (km)</Label>
              <Input
                type="number"
                id="distance_goal"
                name="distance_goal"
                step="0.1"
                min="1"
                required
                defaultValue={currentGoal}
                placeholder="50.0"
              />
              <p className="text-xs text-muted-foreground">
                現在の目標: {currentGoal}km
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                {isSubmitting ? '保存中...' : (showWelcomeMessage ? '目標を設定' : '目標を変更')}
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
  );
}