import { Suspense } from 'react';

import {
  type MonthlyGoal,
  monthlyGoalsAPI,
  yearlyGoalsAPI,
} from '@/features/running/api/goals';
import {
  runningRecordsAPI,
  type RunRecord,
} from '@/features/running/api/running-records';
import RecentRecords from '@/features/running/components/RecentRecords';

import DashboardStatistics from './DashboardStatistics';
import DashboardWithCalendar from './DashboardWithCalendar';

// データ取得コンポーネント
async function DashboardData() {
  try {
    const [
      recordsResult,
      statisticsResult,
      monthlyGoalResult,
      yearlyGoalResult,
      monthlyGoalsResult,
    ] = await Promise.all([
      runningRecordsAPI.getAll(),
      runningRecordsAPI.getStatistics(),
      monthlyGoalsAPI.getCurrent(),
      yearlyGoalsAPI.getCurrent(),
      monthlyGoalsAPI.getAll(),
    ]);

    // 成功したデータのみ取得
    const records: RunRecord[] = recordsResult.success
      ? recordsResult.data
      : [];
    const statistics = statisticsResult.success ? statisticsResult.data : null;
    const monthlyGoal = monthlyGoalResult.success
      ? monthlyGoalResult.data
      : null;
    const yearlyGoal = yearlyGoalResult.success ? yearlyGoalResult.data : null;
    const monthlyGoals: MonthlyGoal[] = monthlyGoalsResult.success
      ? monthlyGoalsResult.data
      : [];

    const thisYearDistance = Number(statistics?.this_year_distance || 0);
    const thisMonthDistance = Number(statistics?.this_month_distance || 0);
    const goal = monthlyGoal?.distance_goal ? Number(monthlyGoal.distance_goal) : null;

    const goalAchievementRate = goal && goal > 0 ? (thisMonthDistance / goal) * 100 : 0;
    const yearGoal = yearlyGoal?.distance_goal ? Number(yearlyGoal.distance_goal) : null;
    const yearGoalProgress =
      yearGoal && yearGoal > 0 ? (thisYearDistance / yearGoal) * 100 : 0;

    // 今月走った日数と記録回数を計算
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    const monthlyRunDays = new Set(monthlyRecords.map((record) => record.date))
      .size;

    return (
      <div className="space-y-6">
        {/* 統計カード - クリック可能なカード */}
        <DashboardStatistics
          thisYearDistance={thisYearDistance}
          thisMonthDistance={thisMonthDistance}
          goalAchievementRate={goalAchievementRate}
          goal={goal}
          yearGoal={yearGoal}
          yearGoalProgress={yearGoalProgress}
          monthlyRunDays={monthlyRunDays}
        />

        {/* カレンダーとアクションボタン */}
        <DashboardWithCalendar records={records} monthlyGoals={monthlyGoals} />

        {/* 最近の記録 - Server Component */}
        {statistics && <RecentRecords statistics={statistics} />}
      </div>
    );
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">データの読み込みに失敗しました</p>
        <p className="mt-2 text-sm text-gray-500">
          ページを再読み込みしてください
        </p>
      </div>
    );
  }
}

// ローディングコンポーネント
function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl bg-gray-200 p-6">
            <div className="mb-2 h-4 rounded bg-gray-300"></div>
            <div className="mb-2 h-8 rounded bg-gray-300"></div>
            <div className="h-2 rounded bg-gray-300"></div>
          </div>
        ))}
      </div>
      <div className="animate-pulse rounded-xl bg-gray-200 p-6">
        <div className="mb-4 h-6 rounded bg-gray-300"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded bg-gray-300"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// メインコンポーネント
export default function ServerRunningDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardData />
    </Suspense>
  );
}
