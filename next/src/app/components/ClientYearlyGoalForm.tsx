'use client';

import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
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
          variant="outlined"
          startIcon={<EmojiEventsIcon />}
          onClick={handleOpen}
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
          size="large"
        >
          {showWelcomeMessage ? '年間目標を設定しましょう！' : '年間目標を変更'}
        </Button>
      )}

      <Modal
        open={currentModalOpen}
        onClose={handleClose}
        aria-labelledby="yearly-goal-modal-title"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <Typography id="yearly-goal-modal-title" variant="h5" className="mb-4 text-gray-800 font-bold">
            {showWelcomeMessage ? '🎯 年間目標を設定しましょう！' : '🏃‍♂️ 年間目標を変更'}
          </Typography>
          {showWelcomeMessage && (
            <Typography className="mb-4 text-gray-600">
              1年間の走行距離目標を設定して、長期的なランニング習慣を身につけましょう！
            </Typography>
          )}
          
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="distance_goal" className="block text-sm font-medium text-gray-700 mb-1">
                年間目標距離 (km)
              </label>
              <input
                type="number"
                id="distance_goal"
                name="distance_goal"
                step="0.1"
                min="50"
                max="2000"
                required
                defaultValue={currentGoal}
                placeholder="500.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                現在の目標: {currentGoal}km (推奨: 300-1000km)
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 py-2"
              >
                {isSubmitting ? '保存中...' : (showWelcomeMessage ? '年間目標を設定' : '目標を変更')}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-2"
              >
                {showWelcomeMessage ? '後で設定' : 'キャンセル'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}