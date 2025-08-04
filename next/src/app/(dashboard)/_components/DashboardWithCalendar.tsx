"use client";

import { useState } from "react";
import ClientRunningCalendar from "@/features/running/components/ClientRunningCalendar";
import ClientRecordForm from "@/features/running/components/ClientRecordForm";
import RunningChartWrapper from "@/features/running/components/RunningChartWrapper";

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

      {/* 記録フォーム */}
      <ClientRecordForm
        selectedDate={selectedDate}
        isOpen={recordFormOpen}
        onClose={handleFormClose}
      />
    </div>
  );
}
