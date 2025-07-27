import { Suspense } from 'react';
import { runningRecordsAPI, type RunRecord } from '../../lib/api/running-records';
import { monthlyGoalsAPI, yearlyGoalsAPI, type MonthlyGoal } from '../../lib/api/goals';
import DashboardWithCalendar from './DashboardWithCalendar';
import DashboardStatistics from './DashboardStatistics';
import RecentRecords from './RecentRecords';

// データ取得コンポーネント
async function DashboardData() {
  try {
    const [recordsResult, statisticsResult, monthlyGoalResult, yearlyGoalResult, monthlyGoalsResult] = await Promise.all([
      runningRecordsAPI.getAll(),
      runningRecordsAPI.getStatistics(),
      monthlyGoalsAPI.getCurrent(),
      yearlyGoalsAPI.getCurrent(),
      monthlyGoalsAPI.getAll()
    ]);

    // 成功したデータのみ取得
    const records: RunRecord[] = recordsResult.success ? recordsResult.data : [];
    const statistics = statisticsResult.success ? statisticsResult.data : null;
    const monthlyGoal = monthlyGoalResult.success ? monthlyGoalResult.data : null;
    const yearlyGoal = yearlyGoalResult.success ? yearlyGoalResult.data : null;
    const monthlyGoals: MonthlyGoal[] = monthlyGoalsResult.success ? monthlyGoalsResult.data : [];

    const thisYearDistance = Number(statistics?.this_year_distance || 0);
    const thisMonthDistance = Number(statistics?.this_month_distance || 0);
    const goal = Number(monthlyGoal?.distance_goal || 50);
    
    const goalAchievementRate = goal > 0 ? (thisMonthDistance / goal) * 100 : 0;
    const yearGoal = Number(yearlyGoal?.distance_goal || 500);
    const yearGoalProgress = yearGoal > 0 ? (thisYearDistance / yearGoal) * 100 : 0;

    // 今月走った日数と記録回数を計算
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthlyRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });
    
    const monthlyRunDays = new Set(monthlyRecords.map(record => record.date)).size;

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
        <DashboardWithCalendar 
          records={records} 
          monthlyGoals={monthlyGoals}
        />

        {/* 最近の記録 - Server Component */}
        {statistics && <RecentRecords statistics={statistics} />}
      </div>
    );
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">データの読み込みに失敗しました</p>
        <p className="text-gray-500 text-sm mt-2">ページを再読み込みしてください</p>
      </div>
    );
  }
}

// ローディングコンポーネント
function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-2 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
      <div className="bg-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-300 rounded"></div>
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