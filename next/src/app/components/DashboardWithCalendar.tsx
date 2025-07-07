"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ClientRecordForm from "./ClientRecordForm";
import RunningChartWrapper from "./RunningChartWrapper";
import MuiProvider from "./MuiProvider";

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
  statistics: RunningStatistics;
  monthlyGoals: MonthlyGoal[];
}

export default function DashboardWithCalendar({
  records,
  statistics,
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
    <MuiProvider>
      {/* カレンダー */}
      <ClientRunningCalendar records={records} onDateClick={handleDateClick} />

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
              <p className="text-sm">
                カレンダーから日付を選択して最初の走行記録を追加してみましょう！
              </p>
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
                      {index === 0 && (
                        <span className="ml-2 text-xs bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full">
                          最新
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{record.date}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 記録フォーム（非表示ボタン） */}
      <ClientRecordForm
        selectedDate={selectedDate}
        isOpen={recordFormOpen}
        onClose={handleFormClose}
        hideButton={true}
      />
    </MuiProvider>
  );
}
