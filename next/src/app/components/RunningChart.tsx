'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
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

export default function RunningChart({ records, monthlyGoals }: RunningChartProps) {
  // 過去30日間のデータを準備（タイムゾーン安全な日付処理）
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 時間をリセット
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29);

  // タイムゾーン安全な日付文字列フォーマット関数
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 指定された日付の月間目標を取得するヘルパー関数
  const getMonthlyGoalForDate = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    
    const goal = monthlyGoals.find(g => g.year === year && g.month === month);
    return goal ? Number(goal.distance_goal) : 50; // デフォルト50km
  };

  const dailyData: number[] = [];
  const cumulativeData: number[] = [];
  const goalLineData: number[] = [];
  let cumulative = 0;

  // 各月の目標に基づく正確な累積目標計算
  let cumulativeGoal = 0;
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(thirtyDaysAgo);
    currentDate.setDate(thirtyDaysAgo.getDate() + i);
    const dateStr = formatDateString(currentDate);
    
    // その日の走行記録を探す
    const dayRecord = records.find(record => record.date === dateStr);
    const dayDistance = dayRecord ? Number(dayRecord.distance || 0) : 0;
    
    cumulative += dayDistance;
    
    // その日が属する月の情報を取得
    const dateMonth = currentDate.getMonth();
    const dateYear = currentDate.getFullYear();
    const daysInDateMonth = new Date(dateYear, dateMonth + 1, 0).getDate();
    
    // その日の月に対応する目標を取得
    const monthlyGoalForDate = getMonthlyGoalForDate(currentDate);
    const dailyGoalPaceForDate = monthlyGoalForDate / daysInDateMonth;
    
    // その日の理想的な1日あたりの目標距離を累積に追加
    cumulativeGoal += dailyGoalPaceForDate;
    
    dailyData.push(dayDistance);
    cumulativeData.push(cumulative);
    goalLineData.push(cumulativeGoal);
  }

  // 現在の月の累積距離を計算（カレンダー月ベース）
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDayOfMonthStr = formatDateString(firstDayOfMonth);
  const todayStr = formatDateString(today);
  
  const currentMonthCumulative = records
    .filter(record => {
      return record.date >= firstDayOfMonthStr && record.date <= todayStr;
    })
    .reduce((sum, record) => sum + Number(record.distance || 0), 0);

  // ラベル（日付）を準備
  const labels = [];
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(thirtyDaysAgo);
    currentDate.setDate(thirtyDaysAgo.getDate() + i);
    labels.push(`${currentDate.getMonth() + 1}/${currentDate.getDate()}`);
  }

  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: '累積走行距離',
        data: cumulativeData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointBorderColor: 'rgb(34, 197, 94)',
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '目標ペース',
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
      },
      {
        label: '日別走行距離',
        data: dailyData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: false,
        tension: 0,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
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
        text: '過去30日間の走行記録',
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
          label: function(context) {
            if (context.datasetIndex === 0) {
              const goalValue = goalLineData[context.dataIndex] || 0;
              const diff = context.parsed.y - goalValue;
              const status = diff >= 0 ? `+${diff.toFixed(1)}km 🔥` : `${diff.toFixed(1)}km`;
              return `累積: ${context.parsed.y.toFixed(1)} km (目標比: ${status})`;
            } else if (context.datasetIndex === 1) {
              return `目標ペース: ${context.parsed.y.toFixed(1)} km`;
            } else {
              return `その日: ${context.parsed.y.toFixed(1)} km`;
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
          text: '累積距離 (km)',
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="text-center">
          <div className="font-semibold text-emerald-600">今月の累積</div>
          <div className="text-lg font-bold">{currentMonthCumulative.toFixed(1)} km</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-red-500">30日間累積</div>
          <div className="text-lg font-bold">{Number(cumulativeData[cumulativeData.length - 1] || 0).toFixed(1)} km</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-600">目標まで</div>
          <div className="text-lg font-bold">
            {Math.max(0, getMonthlyGoalForDate(today) - currentMonthCumulative).toFixed(1)} km
          </div>
        </div>
      </div>
    </div>
  );
}