'use client';

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartDataset,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface RunRecord {
  id: string;
  date: string;
  distance: number;
}

interface MonthlyGoal {
  id?: string;
  year: number;
  month: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

interface RunningChartProps {
  records: RunRecord[];
  monthlyGoals: MonthlyGoal[];
}

export default function RunningChart({
  records,
  monthlyGoals,
}: RunningChartProps) {
  // 現在表示中の月を管理するstate
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  // 表示中の月の1日と最終日を取得
  const viewYear = currentViewDate.getFullYear();
  const viewMonth = currentViewDate.getMonth();
  const firstDayOfViewMonth = new Date(viewYear, viewMonth, 1);
  const lastDayOfViewMonth = new Date(viewYear, viewMonth + 1, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 月移動の関数
  const goToPreviousMonth = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  // タイムゾーン安全な日付文字列フォーマット関数
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 指定された日付の月間目標を取得するヘルパー関数
  const getMonthlyGoalForDate = (date: Date): number | null => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed

    const goal = monthlyGoals.find((g) => g.year === year && g.month === month);
    return goal?.distance_goal ? Number(goal.distance_goal) : null;
  };

  // 月の表示名を取得するヘルパー関数
  const getMonthDisplayName = (date: Date): string => {
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();

    if (targetYear === currentYear && targetMonth === currentMonth) {
      return '今月';
    } else if (targetYear === currentYear && targetMonth === currentMonth - 1) {
      return '先月';
    } else if (
      targetYear === currentYear - 1 &&
      targetMonth === 11 &&
      currentMonth === 0
    ) {
      return '先月';
    } else {
      return `${targetYear}年${targetMonth + 1}月`;
    }
  };

  const dailyData: (number | null)[] = [];
  const cumulativeData: (number | null)[] = [];
  const goalLineData: number[] = [];

  // 表示月の日数を取得
  const daysInViewMonth = lastDayOfViewMonth.getDate();

  // 今月かどうかを判定
  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  // 表示する最終日を決定（今月の場合は今日まで、それ以外は月末まで）
  const displayEndDay = isCurrentMonth
    ? Math.min(today.getDate(), daysInViewMonth)
    : daysInViewMonth;

  // 表示月の目標を取得
  const monthlyGoal = getMonthlyGoalForDate(firstDayOfViewMonth);
  const dailyGoalPace = monthlyGoal ? monthlyGoal / daysInViewMonth : 0;

  // 表示月の各日のデータを処理
  let cumulative = 0;
  for (let day = 1; day <= daysInViewMonth; day++) {
    const currentDate = new Date(viewYear, viewMonth, day);
    const dateStr = formatDateString(currentDate);

    // その日の全ての走行記録を集計
    const dayRecords = records.filter((record) => record.date === dateStr);
    const dayDistance = dayRecords.reduce(
      (sum, record) => sum + Number(record.distance || 0),
      0,
    );

    // 累積距離を更新（今日までのデータのみ）
    if (day <= displayEndDay) {
      cumulative += dayDistance;
    }

    // 目標ライン（その日までの理想的な累積）
    const cumulativeGoalForDay = dailyGoalPace * day;

    // 走っていない日は null にして棒グラフで表示されないようにする
    dailyData.push(dayDistance > 0 ? dayDistance : null);

    // 緑の累積グラフは今日までのみ表示（今月の場合）
    if (isCurrentMonth && day > displayEndDay) {
      cumulativeData.push(null);
    } else {
      cumulativeData.push(cumulative);
    }

    goalLineData.push(cumulativeGoalForDay);
  }

  // 表示月の累積距離を計算
  const viewMonthCumulative = cumulative;

  // 日別距離の最大値を計算する関数
  const calculateDailyMaxScale = (dailyData: (number | null)[]): number => {
    // null を除いた実際の距離の最大値を取得
    const maxDistance = Math.max(
      ...(dailyData.filter((d) => d !== null) as number[]),
      0,
    );

    // デフォルトは20
    if (maxDistance <= 20) {
      return 20;
    }

    // 20を超えたら10単位で切り上げ
    return Math.ceil(maxDistance / 10) * 10;
  };

  // ラベル（日付）を準備 - 月全体の各日
  const labels = [];
  for (let day = 1; day <= daysInViewMonth; day++) {
    labels.push(`${day}日`);
  }

  // 表示中の月の名前を取得
  const monthDisplayName = getMonthDisplayName(currentViewDate);

  // datasetsを動的に構築
  const datasets: ChartDataset<'line' | 'bar'>[] = [
    {
      label: `${monthDisplayName}の走行距離`,
      data: cumulativeData,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0,
      pointBorderColor: 'rgb(34, 197, 94)',
      pointBackgroundColor: 'white',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ];

  // 目標が設定されている場合のみ目標ラインを追加
  if (monthlyGoal && monthlyGoal > 0) {
    datasets.push({
      label: `${monthDisplayName}の目標ペース`,
      data: goalLineData,
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderDash: [10, 5],
      borderWidth: 2,
      fill: false,
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderColor: 'rgb(239, 68, 68)',
      pointBackgroundColor: 'rgb(239, 68, 68)',
    });
  }

  datasets.push({
    label: '日別走行距離',
    data: dailyData,
    type: 'bar' as const,
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    borderColor: 'rgb(59, 130, 246)',
    borderWidth: 1,
    yAxisID: 'y1',
    borderRadius: {
      topLeft: 4,
      topRight: 4,
      bottomLeft: 0,
      bottomRight: 0,
    },
    borderSkipped: false,
  });

  const data: ChartData<'line' | 'bar'> = {
    labels,
    datasets,
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `${viewYear}年${viewMonth + 1}月の走行記録`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              const goalValue = goalLineData[context.dataIndex] || 0;
              const diff = context.parsed.y - goalValue;
              const status =
                diff >= 0 ? `+${diff.toFixed(1)}km 🔥` : `${diff.toFixed(1)}km`;
              return `${monthDisplayName}の走行距離: ${context.parsed.y.toFixed(
                1,
              )} km (目標比: ${status})`;
            } else if (context.datasetIndex === 1) {
              return `${monthDisplayName}の目標ペース: ${context.parsed.y.toFixed(
                1,
              )} km`;
            } else {
              return context.parsed.y > 0
                ? `その日: ${context.parsed.y.toFixed(1)} km`
                : '';
            }
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '日付',
          font: {
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: `${monthDisplayName}の走行距離 (km)`,
          font: {
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: '日別距離 (km)',
          font: {
            weight: 'bold',
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        beginAtZero: true,
        max: calculateDailyMaxScale(dailyData),
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        hoverBackgroundColor: 'white',
      },
    },
  };

  return (
    <div className="rounded-xl bg-white p-4 md:p-6 shadow-lg">
      <div className="h-64 md:h-80">
        <Line
          data={data as ChartData<'line'>}
          options={options as ChartOptions<'line'>}
        />
      </div>
      {/* 月移動ナビゲーション */}
      <div className="mt-4 mb-4 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center rounded-lg px-2 py-1 md:px-3 md:py-2 text-sm md:text-base text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <span className="mr-1">←</span>
          <span className="hidden sm:inline">前の月</span>
          <span className="sm:hidden">前月</span>
        </button>

        <div className="flex items-center space-x-2">
          <h3 className="text-base md:text-lg font-bold text-gray-800">
            {viewYear}年{viewMonth + 1}月
          </h3>
        </div>

        <button
          onClick={goToNextMonth}
          className="flex items-center rounded-lg px-2 py-1 md:px-3 md:py-2 text-sm md:text-base text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <span className="hidden sm:inline">次の月</span>
          <span className="sm:hidden">次月</span>
          <span className="ml-1">→</span>
        </button>
      </div>

      {/* 統計表示 */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
        <div className="text-center">
          <div className="font-semibold text-emerald-600">月間走行距離</div>
          <div className="text-base md:text-lg font-bold">
            {viewMonthCumulative.toFixed(1)} km
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600">月間目標</div>
          <div className="text-base md:text-lg font-bold">
            {monthlyGoal ? `${monthlyGoal.toFixed(1)} km` : '未設定'}
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-purple-600">達成率</div>
          <div className="text-base md:text-lg font-bold">
            {monthlyGoal && monthlyGoal > 0
              ? `${((viewMonthCumulative / monthlyGoal) * 100).toFixed(0)}%`
              : '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
