'use client';

import { useState, useEffect } from 'react';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ClientRunningCalendar from './ClientRunningCalendar';
import ClientRecordForm from './ClientRecordForm';
import ClientGoalForm from './ClientGoalForm';
import ClientYearlyGoalForm from './ClientYearlyGoalForm';
import RunningChartWrapper from './RunningChartWrapper';

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

interface MonthlyGoal {
  id?: string;
  year: number;
  month: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

interface DashboardWithCalendarProps {
  records: RunRecord[];
  goal: number;
  statistics: RunningStatistics;
  hasGoal: boolean;
  yearlyGoal: number;
  hasYearlyGoal: boolean;
  monthlyGoals: MonthlyGoal[];
}

export default function DashboardWithCalendar({ records, goal, statistics, hasGoal, yearlyGoal, hasYearlyGoal, monthlyGoals }: DashboardWithCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [recordFormOpen, setRecordFormOpen] = useState(false);
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [yearlyGoalFormOpen, setYearlyGoalFormOpen] = useState(false);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setRecordFormOpen(true);
  };

  // 目標未設定時の自動モーダル表示
  useEffect(() => {
    if (!hasGoal) {
      setGoalFormOpen(true);
    }
  }, [hasGoal]);

  // カードクリックイベントリスナー
  useEffect(() => {
    const handleCardClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const card = target.closest('[data-goal-type]');
      if (card) {
        const goalType = card.getAttribute('data-goal-type');
        if (goalType === 'monthly') {
          setGoalFormOpen(true);
        } else if (goalType === 'yearly') {
          setYearlyGoalFormOpen(true);
        }
      }
    };

    document.addEventListener('click', handleCardClick);
    return () => document.removeEventListener('click', handleCardClick);
  }, []);

  const handleFormClose = () => {
    setRecordFormOpen(false);
    setSelectedDate('');
  };

  const handleGoalFormClose = () => {
    setGoalFormOpen(false);
  };

  const handleGoalFormOpen = () => {
    setGoalFormOpen(true);
  };

  const handleYearlyGoalFormClose = () => {
    setYearlyGoalFormOpen(false);
  };

  const handleYearlyGoalFormOpen = () => {
    setYearlyGoalFormOpen(true);
  };

  return (
    <>
      {/* カレンダー */}
      <ClientRunningCalendar 
        records={records} 
        onDateClick={handleDateClick}
      />

      {/* 走行記録グラフ */}
      <RunningChartWrapper records={records} monthlyGoals={monthlyGoals} />

      {/* 最近の記録 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <DirectionsRunIcon className="mr-2 text-emerald-600" />
          最近の記録
          <span className="ml-2 text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            {Number(statistics?.total_records || 0)}回
          </span>
        </h3>
        <div className="space-y-3">
          {(statistics?.recent_records || []).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DirectionsRunIcon className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-lg">まだ記録がありません</p>
              <p className="text-sm">カレンダーから日付を選択して最初の走行記録を追加してみましょう！</p>
            </div>
          ) : (
            (statistics?.recent_records || []).map((record, index) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-emerald-600 group-hover:animate-pulse">
                    <DirectionsRunIcon />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 flex items-center">
                      {Number(record.distance || 0).toFixed(1)} km
                      {index === 0 && <span className="ml-2 text-xs bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full">最新</span>}
                    </p>
                    <p className="text-sm text-gray-500">
                      {record.date}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* アクションボタン - 目標設定のみ表示 */}
      <div className="flex justify-center space-x-4">
        <ClientGoalForm 
          currentGoal={goal} 
          isOpen={goalFormOpen}
          onClose={handleGoalFormClose}
          onOpen={handleGoalFormOpen}
          showWelcomeMessage={!hasGoal}
        />
        <ClientYearlyGoalForm 
          currentGoal={yearlyGoal} 
          isOpen={yearlyGoalFormOpen}
          onClose={handleYearlyGoalFormClose}
          onOpen={handleYearlyGoalFormOpen}
          showWelcomeMessage={!hasYearlyGoal}
        />
      </div>

      {/* 記録フォーム（非表示ボタン） */}
      <ClientRecordForm 
        selectedDate={selectedDate}
        isOpen={recordFormOpen}
        onClose={handleFormClose}
        hideButton={true}
      />
    </>
  );
}