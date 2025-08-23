'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { RunningStatistics, RunRecord } from '../../types';
import RecordDetailModal from './RecordDetailModal';

export default function RecentRecords({
  statistics,
}: {
  statistics: RunningStatistics;
}) {
  const router = useRouter();
  const [selectedRecord, setSelectedRecord] = useState<RunRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRecordClick = (record: RunRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDeleteSuccess = () => {
    // ページをリフレッシュしてデータを更新
    router.refresh();
  };

  // 日付ごとにレコードをグループ化（Mapを使用してObject Injectionを回避）
  const groupedRecordsMap = (statistics?.recent_records || []).reduce(
    (acc, record) => {
      const date = record.date;
      const existing = acc.get(date);

      if (!existing) {
        acc.set(date, {
          date,
          totalDistance: Number(record.distance || 0),
          records: [record],
          latestCreatedAt: record.created_at || '',
        });
      } else {
        existing.totalDistance += Number(record.distance || 0);
        existing.records.push(record);
        // 最新の作成時刻を保持
        if (
          record.created_at &&
          (!existing.latestCreatedAt ||
            record.created_at > existing.latestCreatedAt)
        ) {
          existing.latestCreatedAt = record.created_at;
        }
      }
      return acc;
    },
    new Map<
      string,
      {
        date: string;
        totalDistance: number;
        records: RunRecord[];
        latestCreatedAt: string;
      }
    >(),
  );

  // 日付順にソート（最新順）
  const sortedDates = Array.from(groupedRecordsMap.values()).sort((a, b) => {
    // まず日付で比較
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    // 同じ日付の場合は作成時刻で比較
    return b.latestCreatedAt.localeCompare(a.latestCreatedAt);
  });

  return (
    <>
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 flex items-center text-xl font-bold text-gray-800">
          🏃‍♂️ 最近の記録
        </h3>
        <div className="space-y-3">
          {sortedDates.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <div className="mb-4 text-6xl text-gray-300">🏃‍♂️</div>
              <p className="text-lg">まだ記録がありません</p>
              <p className="text-sm">
                カレンダーから日付を選択して最初の走行記録を追加してみましょう！
              </p>
            </div>
          ) : (
            sortedDates.slice(0, 5).map((group) => (
              <div key={group.date} className="space-y-2">
                {/* 日付ヘッダー */}
                <div className="px-2 text-sm font-medium text-gray-600">
                  {group.date} ({group.totalDistance.toFixed(1)} km)
                </div>

                {/* 同じ日の記録一覧 */}
                {group.records.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => handleRecordClick(record)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRecordClick(record);
                      }
                    }}
                    aria-label={`${record.date}の${Number(
                      record.distance,
                    ).toFixed(1)}kmの記録を編集`}
                    className="group flex w-full cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-emerald-600 group-hover:animate-pulse">
                        🏃‍♂️
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {Number(record.distance).toFixed(1)} km
                        </p>
                        <p className="text-xs text-gray-500">
                          {record.created_at || ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 詳細モーダル */}
      <RecordDetailModal
        record={selectedRecord}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
}
