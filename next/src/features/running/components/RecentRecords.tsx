'use client';

import { useState } from 'react';
import RecordDetailModal from './RecordDetailModal';

interface RunRecord {
  id: string;
  date: string;
  distance: number;
  created_at?: string;
  updated_at?: string;
}

interface RunningStatistics {
  this_year_distance: number;
  this_month_distance: number;
  total_records: number;
  recent_records: RunRecord[];
}

interface RecentRecordsProps {
  statistics: RunningStatistics;
}

export default function RecentRecords({ statistics }: RecentRecordsProps) {
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

  // 日付ごとにレコードをグループ化
  const groupedRecords = (statistics?.recent_records || []).reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = {
        date,
        totalDistance: 0,
        records: [],
        latestCreatedAt: record.created_at || ''
      };
    }
    acc[date].totalDistance += Number(record.distance || 0);
    acc[date].records.push(record);
    // 最新の作成時刻を保持
    if (record.created_at && (!acc[date].latestCreatedAt || record.created_at > acc[date].latestCreatedAt)) {
      acc[date].latestCreatedAt = record.created_at;
    }
    return acc;
  }, {} as Record<string, { date: string; totalDistance: number; records: RunRecord[]; latestCreatedAt: string }>);

  // 日付順にソート（最新順）
  const sortedDates = Object.values(groupedRecords).sort((a, b) => {
    // まず日付で比較
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    // 同じ日付の場合は作成時刻で比較
    return b.latestCreatedAt.localeCompare(a.latestCreatedAt);
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          🏃‍♂️ 最近の記録
        </h3>
        <div className="space-y-3">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl text-gray-300 mb-4">🏃‍♂️</div>
              <p className="text-lg">まだ記録がありません</p>
              <p className="text-sm">
                カレンダーから日付を選択して最初の走行記録を追加してみましょう！
              </p>
            </div>
          ) : (
            sortedDates.slice(0, 5).map((group) => (
              <div key={group.date} className="space-y-2">
                {/* 日付ヘッダー */}
                <div className="text-sm font-medium text-gray-600 px-2">
                  {group.date} ({group.totalDistance.toFixed(1)} km)
                </div>
                
                {/* 同じ日の記録一覧 */}
                {group.records.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => handleRecordClick(record)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
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
      />
    </>
  );
}