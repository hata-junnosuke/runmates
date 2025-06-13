'use client';

import { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
          size="large"
          disabled={isExternallyControlled}
        >
          走行記録を追加
        </Button>
      )}

      <Modal
        open={currentModalOpen}
        onClose={handleClose}
        aria-labelledby="record-modal-title"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <Typography id="record-modal-title" variant="h5" className="mb-4 text-gray-800 font-bold">
            🏃‍♂️ 新しい走行記録
          </Typography>
          
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                日付
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                defaultValue={selectedDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                距離 (km)
              </label>
              <input
                type="number"
                id="distance"
                name="distance"
                step="0.1"
                min="0.1"
                required
                placeholder="5.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 py-2"
              >
                {isSubmitting ? '保存中...' : '記録を保存'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleClose}
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