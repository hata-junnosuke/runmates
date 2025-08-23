import { Suspense } from 'react';

import { monthlyGoalsAPI, yearlyGoalsAPI } from '@/features/running/api/goals';
import { runningRecordsAPI } from '@/features/running/api/running-records';
import type { MonthlyGoal, RunRecord } from '@/features/running/types';

import RecentRecords from '../statistics/RecentRecords';
import DashboardStatistics from './DashboardStatistics';
import DashboardWithCalendar from './DashboardWithCalendar';

// データ取得コンポーネント
async function DashboardData() {
  try {
    // 現在の年月を取得
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth()は0-11なので+1
    
    const [
      recordsResult,
      statisticsResult,
      monthlyGoalResult,
      yearlyGoalResult,
      monthlyGoalsResult,
    ] = await Promise.all([
      runningRecordsAPI.getAll(currentYear, currentMonth), // 現在月のデータを取得
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
    
    // 今月の目標を取得(設定してなければnull)
    const monthlyGoalValue = monthlyGoal?.distance_goal
      ? Number(monthlyGoal.distance_goal)
      : null;
    // 月間目標達成率を計算
    const monthlyGoalProgress =
      monthlyGoalValue && monthlyGoalValue > 0 ? (thisMonthDistance / monthlyGoalValue) * 100 : 0;

    // 今年の目標を取得(設定してなければnull)
    const yearlyGoalValue = yearlyGoal?.distance_goal
      ? Number(yearlyGoal.distance_goal)
      : null;
    // 年間目標達成率を計算
    const yearlyGoalProgress =
      yearlyGoalValue && yearlyGoalValue > 0 ? (thisYearDistance / yearlyGoalValue) * 100 : 0;

    // 今月走った日数を計算
    // recordsはすでに現在月のデータのみなのでフィルタ不要
    const monthlyRunDays = new Set(records.map((record) => record.date)).size;

    return (
      <div className="space-y-6">
        {/* 統計カード - クリック可能なカード */}
        <DashboardStatistics
          thisYearDistance={thisYearDistance}
          thisMonthDistance={thisMonthDistance}
          monthlyGoalProgress={monthlyGoalProgress}
          monthlyGoal={monthlyGoalValue}
          yearlyGoal={yearlyGoalValue}
          yearlyGoalProgress={yearlyGoalProgress}
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
