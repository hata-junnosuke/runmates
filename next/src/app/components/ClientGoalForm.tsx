'use client';

import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { setMonthlyGoal } from '../actions/running-actions';

interface ClientGoalFormProps {
  currentGoal: number;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  showWelcomeMessage?: boolean;
  hideButton?: boolean;
}

export default function ClientGoalForm({ currentGoal, isOpen = false, onClose, onOpen, showWelcomeMessage = false, hideButton = false }: ClientGoalFormProps) {
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
          className="border-purple-300 text-purple-700 hover:bg-purple-50 py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
          size="large"
        >
          {showWelcomeMessage ? '目標を設定しましょう！' : '月次目標を変更'}
        </Button>
      )}

      <Modal
        open={currentModalOpen}
        onClose={handleClose}
        aria-labelledby="goal-modal-title"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <Typography id="goal-modal-title" variant="h5" className="mb-4 text-gray-800 font-bold">
            {showWelcomeMessage ? '🎉 ランニングを始めましょう！' : '🎯 今月の目標を変更'}
          </Typography>
          {showWelcomeMessage && (
            <Typography className="mb-4 text-gray-600">
              まずは今月の走行距離目標を設定して、モチベーションを高めましょう！
            </Typography>
          )}
          
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="distance_goal" className="block text-sm font-medium text-gray-700 mb-1">
                目標距離 (km)
              </label>
              <input
                type="number"
                id="distance_goal"
                name="distance_goal"
                step="0.1"
                min="1"
                required
                defaultValue={currentGoal}
                placeholder="50.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                現在の目標: {currentGoal}km
              </p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                className="flex-1 bg-purple-500 hover:bg-purple-600 py-2"
              >
                {isSubmitting ? '保存中...' : (showWelcomeMessage ? '目標を設定' : '目標を変更')}
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