'use client';

import { useState, useMemo } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

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

export default function ClientRunningCalendar({ records, onDateClick, currentDate: initialDate }: ClientRunningCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

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
    return records.some(record => record.date === dateStr);
  };

  // 指定された日付の記録を取得
  const getRecordForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return records.find(record => record.date === dateStr);
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
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    onDateClick(dateStr);
  };

  // 曜日名
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  // 連続ランニング日数を計算
  const getConsecutiveDays = (): number => {
    if (!records || !Array.isArray(records) || records.length === 0) return 0;
    
    const validRecords = records.filter(r => r && r.date && typeof r.distance === 'number');
    if (validRecords.length === 0) return 0;
    
    const sortedRecords = [...validRecords]
      .sort((a, b) => {
        try {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } catch {
          return 0;
        }
      });
    
    let consecutive = 0;
    
    try {
      // 最新記録の日付から開始
      const latestRecordDate = new Date(sortedRecords[0].date);
      latestRecordDate.setHours(0, 0, 0, 0);
      
      const checkDate = new Date(latestRecordDate);
      
      for (const record of sortedRecords) {
        try {
          const recordDate = new Date(record.date);
          recordDate.setHours(0, 0, 0, 0);
          
          if (recordDate.getTime() === checkDate.getTime()) {
            consecutive++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        } catch {
          break;
        }
      }
    } catch {
      return 0;
    }
    
    return consecutive;
  };

  return (
    <Box className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-400">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6" className="font-bold text-gray-800 flex items-center">
          📅 ランニングカレンダー
        </Typography>
        <div className="flex items-center space-x-2">
          <IconButton onClick={goToPreviousMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" className="font-bold text-gray-700 min-w-[120px] text-center">
            {year}年 {month + 1}月
          </Typography>
          <IconButton onClick={goToNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </div>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 text-sm font-semibold ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
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
          const isToday = date.toDateString() === new Date().toDateString();
          const hasRun = hasRecord(date);
          const record = getRecordForDate(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && handleDateClick(date)}
              className={`
                relative h-12 flex items-center justify-center text-sm transition-all duration-200 rounded-lg
                ${!isCurrentMonth ? 'text-gray-300' : 'cursor-pointer hover:bg-gray-100'}
                ${isToday ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
                ${hasRun && isCurrentMonth ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white font-bold shadow-md hover:shadow-lg' : ''}
                ${isWeekend && !hasRun && isCurrentMonth ? 'text-gray-500' : ''}
                ${!isCurrentMonth ? 'cursor-default' : ''}
              `}
            >
              <span className="z-10 relative">{date.getDate()}</span>
              
              {/* 走った日のマーカー */}
              {hasRun && isCurrentMonth && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <DirectionsRunIcon 
                    className="absolute top-0 right-0 text-xs text-white opacity-70"
                    sx={{ fontSize: 12 }}
                  />
                  {record && (
                    <div className="absolute bottom-0 left-0 right-0 text-[8px] text-white opacity-90 text-center">
                      {Number(record.distance || 0).toFixed(1)}km
                    </div>
                  )}
                </div>
              )}

              {/* 今日のマーカー */}
              {isToday && !hasRun && (
                <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-lg"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* 統計表示 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-500">今月の記録</div>
            <div className="font-bold text-emerald-600">
              {useMemo(() => {
                return (records || []).filter(r => {
                  if (!r || !r.date) return false;
                  try {
                    const recordDate = new Date(r.date);
                    return !isNaN(recordDate.getTime()) && 
                           recordDate.getMonth() === month && 
                           recordDate.getFullYear() === year;
                  } catch {
                    return false;
                  }
                }).length;
              }, [records, month, year])}日
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">連続記録</div>
            <div className="font-bold text-blue-600">
              {getConsecutiveDays()}日
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">今月距離</div>
            <div className="font-bold text-purple-600">
              {useMemo(() => {
                return (records || [])
                  .filter(r => {
                    if (!r || !r.date) return false;
                    try {
                      const recordDate = new Date(r.date);
                      return !isNaN(recordDate.getTime()) && 
                             recordDate.getMonth() === month && 
                             recordDate.getFullYear() === year;
                    } catch {
                      return false;
                    }
                  })
                  .reduce((sum, r) => {
                    const distance = Number(r.distance || 0);
                    return sum + distance;
                  }, 0)
                  .toFixed(1);
              }, [records, month, year])}km
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}