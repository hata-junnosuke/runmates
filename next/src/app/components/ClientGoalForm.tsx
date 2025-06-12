'use client';

import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { setMonthlyGoal } from '../actions/running-actions';

interface ClientGoalFormProps {
  currentGoal: number;
}

export default function ClientGoalForm({ currentGoal }: ClientGoalFormProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await setMonthlyGoal(formData);
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to set goal:', error);
      alert('目標の設定に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<EmojiEventsIcon />}
        onClick={() => setModalOpen(true)}
        className="border-purple-300 text-purple-700 hover:bg-purple-50 py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
        size="large"
      >
        月次目標を設定
      </Button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="goal-modal-title"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <Typography id="goal-modal-title" variant="h5" className="mb-4 text-gray-800 font-bold">
            🎯 今月の目標を設定
          </Typography>
          
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
                {isSubmitting ? '保存中...' : '目標を設定'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-2"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}