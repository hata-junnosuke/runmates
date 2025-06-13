import { Suspense } from 'react';
import { serverRunningRecordsAPI, serverMonthlyGoalsAPI, serverYearlyGoalsAPI } from '../../lib/server-api';
import DashboardWithCalendar from './DashboardWithCalendar';

// データ取得コンポーネント
async function DashboardData() {
  try {
    const [records, statistics, monthlyGoal, yearlyGoal, monthlyGoals] = await Promise.all([
      serverRunningRecordsAPI.getAll(),
      serverRunningRecordsAPI.getStatistics(),
      serverMonthlyGoalsAPI.getCurrent().catch(() => null),
      serverYearlyGoalsAPI.getCurrent().catch(() => null),
      serverMonthlyGoalsAPI.getAll().catch(() => [])
    ]);

    const thisYearDistance = Number(statistics?.this_year_distance || 0);
    const thisMonthDistance = Number(statistics?.this_month_distance || 0);
    const goal = Number(monthlyGoal?.distance_goal || 50);
    
    const goalAchievementRate = goal > 0 ? (thisMonthDistance / goal) * 100 : 0;
    const yearGoal = Number(yearlyGoal?.distance_goal || 500);
    const yearGoalProgress = yearGoal > 0 ? (thisYearDistance / yearGoal) * 100 : 0;

    return (
      <div className="space-y-6">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 今年の総走行距離 */}
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 group cursor-pointer" data-goal-type="yearly">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-sm font-medium flex items-center group-hover:animate-pulse">
                  <span className="mr-1 text-sm group-hover:animate-bounce">📅</span>
                  今年の総距離
                </p>
                <p className="text-3xl font-bold">{thisYearDistance.toFixed(1)} km</p>
                <div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(yearGoalProgress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-emerald-100 text-xs mt-1">🎯 年間目標: {yearGoal}km ({yearGoalProgress.toFixed(0)}%)</p>
              </div>
              <div className="text-right">
                <span className="text-5xl text-emerald-200 mb-2 group-hover:animate-pulse">🏃</span>
                <div className="text-xs text-emerald-100 font-bold">
                  残り{Math.max(0, yearGoal - thisYearDistance).toFixed(0)}km
                </div>
              </div>
            </div>
          </div>

          {/* 今月の走行距離 */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium flex items-center">
                  <span className="mr-1 text-sm">⏱️</span>
                  今月の距離
                </p>
                <p className="text-3xl font-bold">{thisMonthDistance.toFixed(1)} km</p>
                <p className="text-blue-100 text-xs mt-1">
                  頑張って続けましょう！
                </p>
              </div>
              <div className="text-right">
                <span className="text-5xl text-blue-200 mb-2 group-hover:animate-pulse">⏱️</span>
                <div className="text-xs text-blue-100">
                  記録: {statistics.total_records}回
                </div>
              </div>
            </div>
          </div>

          {/* 目標達成率 */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 group cursor-pointer" data-goal-type="monthly">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm font-medium flex items-center">
                  <span className="mr-1 text-sm">🏆</span>
                  目標達成率
                </p>
                <p className="text-3xl font-bold flex items-center">
                  {goalAchievementRate.toFixed(0)}%
                  {goalAchievementRate >= 100 && <span className="ml-2 group-hover:animate-bounce">🎉</span>}
                </p>
                <div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${goalAchievementRate >= 100 ? 'bg-green-400' : 'bg-yellow-400'}`}
                    style={{ width: `${Math.min(goalAchievementRate, 100)}%` }}
                  ></div>
                </div>
                <p className="text-purple-100 text-xs mt-1">
                  目標: {goal}km / 現在: {thisMonthDistance.toFixed(1)}km
                </p>
              </div>
              <div className="text-right">
                <span className={`text-5xl text-purple-200 mb-2 ${goalAchievementRate >= 100 ? 'group-hover:animate-bounce' : 'group-hover:animate-pulse'}`}>🏆</span>
                <div className="text-xs text-purple-100">
                  残り{Math.max(0, goal - thisMonthDistance).toFixed(1)}km
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* カレンダーとアクションボタン */}
        <DashboardWithCalendar 
          records={records} 
          goal={goal} 
          statistics={statistics}
          hasGoal={monthlyGoal !== null && monthlyGoal?.id !== undefined}
          yearlyGoal={yearGoal}
          hasYearlyGoal={yearlyGoal !== null && yearlyGoal?.id !== undefined}
          monthlyGoals={monthlyGoals}
        />
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