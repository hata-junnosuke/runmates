'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteRunningRecord } from '@/app/actions/running-actions';

interface RunRecord {
  id: string;
  date: string;
  distance: number;
  created_at?: string;
  updated_at?: string;
}

interface RecordDetailModalProps {
  record: RunRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordDetailModal({ record, isOpen, onClose }: RecordDetailModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!record) return null;

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteRunningRecord(record.id);
      if (result.success) {
        setShowConfirmDialog(false);
        onClose();
      } else {
        // エラーハンドリング（今後トースト通知などを追加可能）
        console.error('削除に失敗しました:', result.error);
      }
    });
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };


  return (
    <>
      {/* メインの詳細モーダル */}
      <Dialog open={isOpen && !showConfirmDialog} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-gray-800">
              🏃‍♂️ 走行記録の詳細
            </DialogTitle>
            <DialogDescription>
              記録の詳細情報を確認し、必要に応じて削除できます。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 日付 */}
            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500 mb-1">実行日</h3>
              <p className="text-lg font-semibold text-gray-800">
                {formatDate(record.date)}
              </p>
            </div>

            {/* 距離 */}
            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500 mb-1">走行距離</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {Number(record.distance).toFixed(1)} km
              </p>
            </div>

            {/* 記録情報 */}
            <div className="text-xs text-gray-500 space-y-1">
              {record.created_at && (
                <p>記録日時: {record.created_at}</p>
              )}
              {record.updated_at && record.updated_at !== record.created_at && (
                <p>更新日時: {record.updated_at}</p>
              )}
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                閉じる
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                削除
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              ⚠️ 記録の削除
            </DialogTitle>
            <DialogDescription>
              この操作は取り消すことができません。本当に削除してもよろしいですか？
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              以下の記録を削除しますか？この操作は取り消すことができません。
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-800">
                {formatDate(record.date)}
              </p>
              <p className="text-lg font-semibold text-emerald-600">
                {Number(record.distance).toFixed(1)} km
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={isPending}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending ? '削除中...' : '削除する'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}