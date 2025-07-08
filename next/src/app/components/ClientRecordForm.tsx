'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addRunningRecord } from '../actions/running-actions';

interface ClientRecordFormProps {
  selectedDate?: string;
  isOpen?: boolean;
  onClose?: () => void;
  hideButton?: boolean;
}

export default function ClientRecordForm({ selectedDate, isOpen = false, onClose, hideButton = false }: ClientRecordFormProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 外部から制御される場合
  const isExternallyControlled = isOpen !== undefined && onClose !== undefined;
  const currentModalOpen = isExternallyControlled ? isOpen : modalOpen;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await addRunningRecord(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to add record:', error);
      alert('記録の追加に失敗しました');
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
    if (!isExternallyControlled) {
      setModalOpen(true);
    }
  };

  return (
    <>
      {!hideButton && (
        <Button
          onClick={handleOpen}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
          disabled={isExternallyControlled}
        >
          ➕ 走行記録を追加
        </Button>
      )}

      <Dialog open={currentModalOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              🏃‍♂️ 新しい走行記録
            </DialogTitle>
          </DialogHeader>
          
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">日付</Label>
              <Input
                type="date"
                id="date"
                name="date"
                required
                defaultValue={selectedDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">距離 (km)</Label>
              <Input
                type="number"
                id="distance"
                name="distance"
                step="0.1"
                min="0.1"
                required
                placeholder="5.0"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {isSubmitting ? '保存中...' : '記録を保存'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}