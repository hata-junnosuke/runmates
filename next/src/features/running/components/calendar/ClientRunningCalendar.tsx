'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { formatDateString } from '@/lib/date';

import type { ClientRunningCalendarProps } from '../../types';

export default function ClientRunningCalendar({
  records,
  plans,
  onDateClick,
  currentDate: initialDate,
  todayString,
  onMonthChange,
}: ClientRunningCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  // currentDateが外部から変更された時に内部状態を更新
  useEffect(() => {
    setCurrentDate(initialDate);
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
  const hasRecord = (date: Date) =>
    records.some((record) => record.date === formatDateString(date));

  // 指定された日付の記録を取得（複数対応）
  const getRecordsForDate = (date: Date) => {
    const dateStr = formatDateString(date);
    return records.filter((record) => record.date === dateStr);
  };

  const getPlansForDate = (date: Date) => {
    const dateStr = formatDateString(date);
    return plans?.filter((plan) => plan.date === dateStr) ?? [];
  };

  const getPlanStatusForDate = (date: Date) => {
    const datePlans = getPlansForDate(date);
    if (datePlans.length === 0) return null;

    // 優先度: outstandingがある限り未達扱い。partial > planned > completed。
    if (datePlans.some((p) => p.status === 'partial'))
      return 'partial' as const;
    if (datePlans.some((p) => p.status === 'planned'))
      return 'planned' as const;
    // 全て完了している場合のみ completed
    if (datePlans.every((p) => p.status === 'completed'))
      return 'completed' as const;
    return 'planned' as const;
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

    const dateStr = formatDateString(date);
    const plansForDate = getPlansForDate(date);
    const hasPlan = plansForDate.length > 0;
    const isFuture = dateStr > todayString;
    const isToday = dateStr === todayString;
    const planStatus = getPlanStatusForDate(date);
    onDateClick({
      dateString: dateStr,
      date,
      hasPlan,
      plansForDate,
      hasRecord: hasRecord(date),
      isFuture,
      isToday,
      planStatus,
    });
  };

  // 曜日名
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div
      className="fade-up relative rounded-2xl bg-gradient-to-br from-blue-50/70 via-white/60 to-emerald-50/70 p-4 pt-5 shadow-xl backdrop-blur"
      style={{ animationDelay: '0.15s' }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
      {/* ヘッダー */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center text-lg font-bold text-slate-900 drop-shadow-sm md:text-xl">
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
          const dateStr = formatDateString(date);
          const isCurrentMonth = date.getMonth() === month;
          const isToday = dateStr === todayString;
          const hasRun = hasRecord(date);
          const totalDistance = getTotalDistanceForDate(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isPast = dateStr < todayString;
          const plansForDate = getPlansForDate(date);
          const hasPlan = plansForDate.length > 0;
          const plannedDistance = plansForDate.reduce(
            (sum, plan) => sum + Number(plan.planned_distance || 0),
            0,
          );
          const planStatus = getPlanStatusForDate(date);
          const isOverduePlanned =
            planStatus === 'planned' && isPast && !hasRun;

          const planColor = isOverduePlanned
            ? 'bg-red-500 text-white'
            : planStatus === 'completed'
              ? 'bg-blue-500 text-white'
              : planStatus === 'partial'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-300 text-gray-800';
          const planDotColor = isOverduePlanned
            ? 'bg-red-500'
            : planStatus === 'completed'
              ? 'bg-blue-500'
              : planStatus === 'partial'
                ? 'bg-yellow-400'
                : 'bg-gray-300';

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
              }${
                hasPlan ? `、予定${plannedDistance.toFixed(1)}km` : ''
              }${isToday ? '、今日' : ''}`}
              className={[
                'relative flex h-10 items-center justify-center rounded-md text-xs transition-all duration-200 sm:h-12 sm:rounded-lg sm:text-sm',
                !isCurrentMonth
                  ? 'text-gray-300'
                  : 'cursor-pointer hover:bg-gray-100',
                isToday ? 'bg-blue-50 ring-2 ring-blue-400' : '',
                hasRun && isCurrentMonth
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 font-bold text-white shadow-md hover:shadow-lg'
                  : '',
                !hasRun && hasPlan && isCurrentMonth
                  ? isOverduePlanned
                    ? 'border border-red-300 bg-red-50 text-red-700'
                    : planStatus === 'completed'
                      ? 'border border-blue-300 bg-blue-50 text-blue-700'
                      : planStatus === 'partial'
                        ? 'border border-yellow-200 bg-yellow-50 text-yellow-800'
                        : 'border border-gray-200 bg-gray-50 text-gray-700'
                  : '',
                isWeekend && !hasRun && isCurrentMonth ? 'text-gray-500' : '',
                !isCurrentMonth ? 'cursor-default' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="relative z-10">{date.getDate()}</span>

              {/* 予定バッジ（モバイルはドット、sm以上は距離表示） */}
              {hasPlan && isCurrentMonth && (
                <>
                  <div
                    className={`absolute top-1 right-1 z-10 h-2 w-2 rounded-full sm:hidden ${planDotColor}`}
                  />
                  <div
                    className={`absolute top-1 right-1 z-10 hidden rounded-full px-2 py-[2px] text-[9px] font-semibold shadow-sm sm:block sm:text-[10px] ${planColor}`}
                  >
                    {plannedDistance.toFixed(1)}km
                  </div>
                </>
              )}

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
