"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ClientRecordForm from "./ClientRecordForm";
import RunningChartWrapper from "./RunningChartWrapper";

const ClientRunningCalendar = dynamic(() => import("./ClientRunningCalendar"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  ),
});

interface RunRecord {
  id: string;
  date: string;
  distance: number;
  created_at?: string;
  updated_at?: string;
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
  monthlyGoals: MonthlyGoal[];
}

export default function DashboardWithCalendar({
  records,
  monthlyGoals,
}: DashboardWithCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [recordFormOpen, setRecordFormOpen] = useState(false);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setRecordFormOpen(true);
  };

  const handleFormClose = () => {
    setRecordFormOpen(false);
    setSelectedDate("");
  };
  

  return (
    <div className="space-y-6">
      {/* カレンダー */}
      <ClientRunningCalendar records={records} onDateClick={handleDateClick} />

      {/* 走行記録グラフ */}
      <RunningChartWrapper records={records} monthlyGoals={monthlyGoals} />

      {/* 記録フォーム（非表示ボタン） */}
      <ClientRecordForm
        selectedDate={selectedDate}
        isOpen={recordFormOpen}
        onClose={handleFormClose}
        hideButton={true}
      />
    </div>
  );
}
