"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface RunRecord {
  id: string;
  date: string;
  distance: number;
}

interface ClientRunningCalendarProps {
  records: RunRecord[];
  onDateClick?: (date: string) => void;
  currentDate?: Date;
}

export default function ClientRunningCalendar({
  records,
  onDateClick,
  currentDate: initialDate,
}: ClientRunningCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [today, setToday] = useState<Date | null>(null);

  // クライアントサイドでのみ今日の日付を設定
  useEffect(() => {
    setToday(new Date());
  }, []);

  // 現在の年月
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 月の最初の日
  const firstDay = new Date(year, month, 1);

  // 週の最初の日（日曜日）から始まるように調整
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // カレンダーの日付を生成（6週間分）
  const calendarDays = [];
  const current = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // 指定された日付に記録があるかチェック
  const hasRecord = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return records.some((record) => record.date === dateStr);
  };

  // 指定された日付の記録を取得（複数対応）
  const getRecordsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return records.filter((record) => record.date === dateStr);
  };

  // 指定された日付の合計距離を取得
  const getTotalDistanceForDate = (date: Date) => {
    const dayRecords = getRecordsForDate(date);
    return dayRecords.reduce((sum, record) => sum + Number(record.distance || 0), 0);
  };

  // 前月へ
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 次月へ
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 日付クリック処理
  const handleDateClick = (date: Date) => {
    if (!onDateClick) return;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    onDateClick(dateStr);
  };

  // 曜日名
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-400">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          📅 ランニングカレンダー
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            ←
          </Button>
          <h3 className="text-lg font-bold text-gray-700 min-w-[120px] text-center">
            {year}年 {month + 1}月
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="h-8 w-8 p-0"
          >
            →
          </Button>
        </div>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 text-sm font-semibold ${
              index === 0
                ? "text-red-500"
                : index === 6
                  ? "text-blue-500"
                  : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = today && date.toDateString() === today.toDateString();
          const hasRun = hasRecord(date);
          const totalDistance = getTotalDistanceForDate(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && handleDateClick(date)}
              className={[
                "relative h-12 flex items-center justify-center text-sm transition-all duration-200 rounded-lg",
                !isCurrentMonth ? "text-gray-300" : "cursor-pointer hover:bg-gray-100",
                isToday === true ? "ring-2 ring-blue-400 bg-blue-50" : "",
                hasRun && isCurrentMonth ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white font-bold shadow-md hover:shadow-lg" : "",
                isWeekend && !hasRun && isCurrentMonth ? "text-gray-500" : "",
                !isCurrentMonth ? "cursor-default" : ""
              ].filter(Boolean).join(" ")}
            >
              <span className="z-10 relative">{date.getDate()}</span>

              {/* 走った日のマーカー */}
              {hasRun && isCurrentMonth && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute bottom-0 left-0 right-0 text-[8px] text-white opacity-90 text-center">
                    {totalDistance.toFixed(1)}km
                  </div>
                </div>
              )}

              {/* 今日のマーカー */}
              <div 
                className="absolute inset-0 bg-blue-400 opacity-20 rounded-lg"
                style={{ display: isToday && !hasRun ? 'block' : 'none' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
