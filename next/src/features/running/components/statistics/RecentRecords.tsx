'use client';

import { Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { EmptyState } from '@/components/common/EmptyState';

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
      <div
        className="fade-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/70 via-emerald-50/60 to-white/70 p-6 pt-7 shadow-xl backdrop-blur"
        style={{ animationDelay: '0.2s' }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-xl font-bold text-slate-900 drop-shadow-sm">
            🏃‍♂️ 最近の記録
          </h3>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            直近5件をピックアップ
          </span>
        </div>
        <div className="space-y-3">
          {sortedDates.length === 0 ? (
            <EmptyState
              icon={<Activity className="h-12 w-12" />}
              title="まだ記録がありません"
              description="カレンダーから日付を選択して最初の走行記録を追加してみましょう！"
            />
          ) : (
            sortedDates.slice(0, 5).map((group) => (
              <div key={group.date} className="space-y-2">
                {/* 日付ヘッダー */}
                <div className="px-2 text-sm font-semibold text-emerald-700">
                  {new Date(`${group.date}T00:00:00`).toLocaleDateString(
                    'ja-JP',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short',
                    },
                  )}
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
                    className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-emerald-100/70 bg-gradient-to-r from-white/90 to-emerald-50/70 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl leading-none text-emerald-500 group-hover:animate-pulse">
                        🏃‍♂️
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {Number(record.distance).toFixed(1)} km
                        </p>
                      </div>
                    </div>
                    <div className="text-emerald-400 transition group-hover:text-emerald-600">
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
