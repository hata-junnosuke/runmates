'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { ClientRunningCalendarProps } from '../../types';

export default function ClientRunningCalendar({
  records,
  onDateClick,
  currentDate: initialDate,
  onMonthChange,
}: ClientRunningCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [today, setToday] = useState<Date | null>(null);

  // クライアントサイドでのみ今日の日付を設定
  useEffect(() => {
    setToday(new Date());
  }, []);

  // currentDateが外部から変更された時に内部状態を更新
  useEffect(() => {
    if (initialDate) {
      setCurrentDate(initialDate);
    }
  }, [initialDate]);

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
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return records.some((record) => record.date === dateStr);
  };

  // 指定された日付の記録を取得（複数対応）
  const getRecordsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return records.filter((record) => record.date === dateStr);
  };

  // 指定された日付の合計距離を取得
  const getTotalDistanceForDate = (date: Date) => {
    const dayRecords = getRecordsForDate(date);
    return dayRecords.reduce(
      (sum, record) => sum + Number(record.distance || 0),
      0,
    );
  };

  // 前月へ
  const goToPreviousMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  // 次月へ
  const goToNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  // 日付クリック処理
  const handleDateClick = (date: Date) => {
    if (!onDateClick) return;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    onDateClick(dateStr);
  };

  // 曜日名
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="rounded-2xl border-l-4 border-blue-400 bg-white p-4 shadow-lg md:p-6">
      {/* ヘッダー */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center text-lg font-bold text-gray-800 md:text-xl">
          📅 ランニングカレンダー
        </h2>
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            ←
          </Button>
          <h3 className="min-w-[100px] text-center text-base font-bold text-gray-700 md:min-w-[120px] md:text-lg">
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
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`py-2 text-center text-sm font-semibold ${
              index === 0
                ? 'text-red-500'
                : index === 6
                  ? 'text-blue-500'
                  : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = today && date.toDateString() === today.toDateString();
          const hasRun = hasRecord(date);
          const totalDistance = getTotalDistanceForDate(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return (
            <button
              key={index}
              onClick={() => isCurrentMonth && handleDateClick(date)}
              onKeyDown={(e) => {
                if (isCurrentMonth && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleDateClick(date);
                }
              }}
              disabled={!isCurrentMonth}
              aria-label={`${date.getFullYear()}年${
                date.getMonth() + 1
              }月${date.getDate()}日${
                hasRun ? `、${totalDistance.toFixed(1)}km走行済み` : ''
              }${isToday ? '、今日' : ''}`}
              className={[
                'relative flex h-10 items-center justify-center rounded-md text-xs transition-all duration-200 sm:h-12 sm:rounded-lg sm:text-sm',
                !isCurrentMonth
                  ? 'text-gray-300'
                  : 'cursor-pointer hover:bg-gray-100',
                isToday === true ? 'bg-blue-50 ring-2 ring-blue-400' : '',
                hasRun && isCurrentMonth
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 font-bold text-white shadow-md hover:shadow-lg'
                  : '',
                isWeekend && !hasRun && isCurrentMonth ? 'text-gray-500' : '',
                !isCurrentMonth ? 'cursor-default' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="relative z-10">{date.getDate()}</span>

              {/* 走った日のマーカー */}
              {hasRun && isCurrentMonth && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute right-0 bottom-0 left-0 text-center text-[7px] text-white opacity-90 sm:text-[8px]">
                    {totalDistance.toFixed(1)}km
                  </div>
                </div>
              )}

              {/* 今日のマーカー */}
              <div
                className="absolute inset-0 rounded-md bg-blue-400 opacity-20 sm:rounded-lg"
                style={{ display: isToday && !hasRun ? 'block' : 'none' }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
