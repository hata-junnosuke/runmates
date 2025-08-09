interface StatisticsCardsProps {
  thisYearDistance: number;
  thisMonthDistance: number;
  goalAchievementRate: number;
  goal: number;
  yearGoal: number;
  yearGoalProgress: number;
  monthlyRunDays: number;
  onYearlyGoalClick: () => void;
  onMonthlyGoalClick: () => void;
}

export default function StatisticsCards({
  thisYearDistance,
  thisMonthDistance,
  goalAchievementRate,
  goal,
  yearGoal,
  yearGoalProgress,
  monthlyRunDays,
  onYearlyGoalClick,
  onMonthlyGoalClick,
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* 今年の総走行距離 - クリック可能 */}
      <button
        className="group transform cursor-pointer rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 w-full text-left"
        onClick={onYearlyGoalClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onYearlyGoalClick();
          }
        }}
        aria-label={`今年の総走行距離: ${thisYearDistance.toFixed(1)}km、年間目標: ${yearGoal}km、達成率: ${yearGoalProgress.toFixed(0)}%`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center text-sm font-medium text-emerald-100 group-hover:animate-pulse">
              <span className="mr-1 text-sm group-hover:animate-bounce">
                📅
              </span>
              今年の総距離
            </p>
            <p className="text-3xl font-bold">
              {thisYearDistance.toFixed(1)} km
            </p>
            <div className="bg-opacity-30 mt-2 h-2 w-full rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${Math.min(yearGoalProgress, 100)}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-emerald-100">
              🎯 年間目標: {yearGoal}km ({yearGoalProgress.toFixed(0)}%)
            </p>
          </div>
          <div className="text-right">
            <span className="mb-2 text-5xl text-emerald-200 group-hover:animate-pulse">
              🏃
            </span>
            <div className="text-xs font-bold text-emerald-100">
              残り{Math.max(0, yearGoal - thisYearDistance).toFixed(0)}km
            </div>
          </div>
        </div>
      </button>

      {/* 今月の走行距離 */}
      <div className="rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center text-sm font-medium text-blue-100">
              <span className="mr-1 text-sm">⏱️</span>
              今月の距離
            </p>
            <p className="text-3xl font-bold">
              {thisMonthDistance.toFixed(1)} km
            </p>
            <p className="mt-1 text-xs text-blue-100">
              🔥 頑張って続けましょう！
            </p>
          </div>
          <div className="text-right">
            <span className="mb-2 text-5xl text-blue-200">⏱️</span>
            <div className="text-xs text-blue-100">
              練習日: {monthlyRunDays}日
            </div>
          </div>
        </div>
      </div>

      {/* 目標達成率 - クリック可能 */}
      <button
        className="group transform cursor-pointer rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 w-full text-left"
        onClick={onMonthlyGoalClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onMonthlyGoalClick();
          }
        }}
        aria-label={`月間目標達成率: ${goalAchievementRate.toFixed(0)}%、目標: ${goal}km、現在: ${thisMonthDistance.toFixed(1)}km`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center text-sm font-medium text-purple-100">
              <span className="mr-1 text-sm">🏆</span>
              目標達成率
            </p>
            <p className="flex items-center text-3xl font-bold">
              {goalAchievementRate.toFixed(0)}%
              {goalAchievementRate >= 100 && (
                <span className="ml-2 group-hover:animate-bounce">🎉</span>
              )}
            </p>
            <div className="bg-opacity-30 mt-2 h-2 w-full rounded-full bg-white">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${goalAchievementRate >= 100 ? 'bg-green-400' : 'bg-yellow-400'}`}
                style={{ width: `${Math.min(goalAchievementRate, 100)}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-purple-100">
              目標: {goal}km / 現在: {thisMonthDistance.toFixed(1)}km
            </p>
          </div>
          <div className="text-right">
            <span
              className={`mb-2 text-5xl text-purple-200 ${goalAchievementRate >= 100 ? 'group-hover:animate-bounce' : 'group-hover:animate-pulse'}`}
            >
              🏆
            </span>
            <div className="text-xs text-purple-100">
              残り{Math.max(0, goal - thisMonthDistance).toFixed(1)}km
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
