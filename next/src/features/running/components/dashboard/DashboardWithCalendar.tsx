'use client';

import { useEffect, useState } from 'react';

import { clientRunningRecordsAPI } from '../../api/client-running-records';
import { eventBus, EVENTS } from '../../lib/events';
import type { MonthlyGoal, RunRecord } from '../../types';
import ClientRunningCalendar from '../calendar/ClientRunningCalendar';
import RunningChartWrapper from '../charts/RunningChartWrapper';
import ClientRecordForm from '../forms/ClientRecordForm';

export default function DashboardWithCalendar({
  records: initialRecords,
  monthlyGoals,
}: {
  records: RunRecord[];
  monthlyGoals: MonthlyGoal[];
}) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [recordFormOpen, setRecordFormOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  // 現在表示中の月のレコード
  const [currentMonthRecords, setCurrentMonthRecords] = useState<RunRecord[]>(initialRecords);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setRecordFormOpen(true);
  };

  // データを再取得する関数
  const refreshCurrentMonthData = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    try {
      const result = await clientRunningRecordsAPI.getByMonth(year, month);
      if (result.success) {
        setCurrentMonthRecords(result.data);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleFormClose = () => {
    setRecordFormOpen(false);
    // データを再取得
    refreshCurrentMonthData();
    setSelectedDate('');
  };

  // 月が変更されたときにデータを取得（毎回APIを叩く）
  const handleMonthChange = async (date: Date) => {
    setCurrentDate(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    setIsLoading(true);
    
    try {
      const result = await clientRunningRecordsAPI.getByMonth(year, month);
      
      if (result.success) {
        setCurrentMonthRecords(result.data);
      } else {
        console.error('API call failed:', result.error);
        setCurrentMonthRecords([]);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setCurrentMonthRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // イベントリスナーを登録して、削除時にデータを再取得
  useEffect(() => {
    if (!eventBus) return;

    const handleRecordDeleted = () => {
      refreshCurrentMonthData();
    };

    eventBus.on(EVENTS.RUNNING_RECORD_DELETED, handleRecordDeleted);

    return () => {
      if (eventBus) {
        eventBus.off(EVENTS.RUNNING_RECORD_DELETED, handleRecordDeleted);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]); // currentDateが変わったら再登録

  return (
    <div className="space-y-6">
      {/* カレンダー */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white bg-opacity-75">
            <div className="text-gray-600">読み込み中...</div>
          </div>
        )}
        <ClientRunningCalendar
          records={currentMonthRecords}
          onDateClick={handleDateClick}
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
        />
      </div>

      {/* 走行記録グラフ */}
      <RunningChartWrapper 
        records={currentMonthRecords} 
        monthlyGoals={monthlyGoals}
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
      />

      {/* 記録フォーム */}
      <ClientRecordForm
        selectedDate={selectedDate}
        isOpen={recordFormOpen}
        onClose={handleFormClose}
      />
    </div>
  );
}
