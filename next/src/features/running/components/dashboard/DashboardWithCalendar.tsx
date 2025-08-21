'use client';

import { useState } from 'react';

import type { MonthlyGoal, RunRecord } from '../../types';
import ClientRunningCalendar from '../calendar/ClientRunningCalendar';
import RunningChartWrapper from '../charts/RunningChartWrapper';
import ClientRecordForm from '../forms/ClientRecordForm';

export default function DashboardWithCalendar({
  records,
  monthlyGoals,
}: {
  records: RunRecord[];
  monthlyGoals: MonthlyGoal[];
}) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [recordFormOpen, setRecordFormOpen] = useState(false);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setRecordFormOpen(true);
  };

  const handleFormClose = () => {
    setRecordFormOpen(false);
    setSelectedDate('');
  };

  return (
    <div className="space-y-6">
      {/* カレンダー */}
      <ClientRunningCalendar records={records} onDateClick={handleDateClick} />

      {/* 走行記録グラフ */}
      <RunningChartWrapper records={records} monthlyGoals={monthlyGoals} />

      {/* 記録フォーム */}
      <ClientRecordForm
        selectedDate={selectedDate}
        isOpen={recordFormOpen}
        onClose={handleFormClose}
      />
    </div>
  );
}
