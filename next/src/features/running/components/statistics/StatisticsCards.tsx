import type { DashboardStatisticsProps } from '../../types';

type StatisticsCardsProps = Omit<
  DashboardStatisticsProps,
  'shouldShowMonthlyCelebration' | 'shouldShowYearlyCelebration'
>;

export default function StatisticsCards({
  thisYearDistance,
  thisMonthDistance,
  monthlyGoalProgress,
  monthlyGoal,
  yearlyGoal,
  yearlyGoalProgress,
  monthlyRunDays,
  onYearlyGoalClick,
  onMonthlyGoalClick,
}: StatisticsCardsProps & {
  onYearlyGoalClick: () => void;
  onMonthlyGoalClick: () => void;
}) {
  return (
    <div
      className="fade-up grid grid-cols-1 gap-4 lg:grid-cols-3"
      style={{ animationDelay: '0.05s' }}
    >
      {/* 今年の総走行距離 - クリック可能 */}
      <button
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/15 via-cyan-400/10 to-emerald-300/10 p-6 text-left text-slate-900 shadow-lg backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(59,130,246,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200"
        onClick={onYearlyGoalClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onYearlyGoalClick();
          }
        }}
        aria-label={`今年の総走行距離: ${thisYearDistance.toFixed(1)}km、年間目標: ${yearlyGoal}km、達成率: ${yearlyGoalProgress.toFixed(0)}%`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-cyan-200/30 to-emerald-200/30 opacity-70" />
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-40">
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.35),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.35),transparent_40%)]" />
        </div>
        <div className="relative flex h-full flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="flex items-center text-xs font-semibold text-blue-700">
                <span className="mr-2 text-lg">📅</span>
                今年の総距離
              </p>
              <p className="text-4xl leading-none font-black text-slate-900">
                {thisYearDistance.toFixed(1)} km
              </p>
              <div className="mt-2 h-2 w-full rounded-full bg-white/70">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(yearlyGoalProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs font-semibold text-slate-700">
                {yearlyGoal ? (
                  <>
                    🎯 年間目標: {yearlyGoal}km ({yearlyGoalProgress.toFixed(0)}
                    %)
                  </>
                ) : (
                  <>🎯 年間目標: 未設定</>
                )}
              </p>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="mb-2 text-4xl text-blue-600 drop-shadow-sm">
                🏃
              </span>
              <div className="text-xs font-bold text-blue-800">
                {yearlyGoal && yearlyGoal > thisYearDistance
                  ? `残り${(yearlyGoal - thisYearDistance).toFixed(0)}km`
                  : yearlyGoal
                    ? '目標達成🎆'
                    : ''}
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* 今月の走行距離 */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-400/12 via-sky-300/10 to-indigo-300/10 p-6 text-slate-900 shadow-lg backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(6,182,212,0.35)]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/40 via-sky-200/30 to-indigo-200/30 opacity-70" />
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-40">
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.35),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.35),transparent_40%)]" />
        </div>
        <div className="relative flex h-full items-start justify-between">
          <div className="space-y-2">
            <p className="flex items-center text-xs font-semibold text-cyan-700">
              <span className="mr-2 text-lg">⏱️</span>
              今月の距離
            </p>
            <p className="text-4xl font-black text-slate-900">
              {thisMonthDistance.toFixed(1)} km
            </p>
            <p className="text-sm font-semibold text-cyan-800">
              練習日: {monthlyRunDays}日
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-4xl text-cyan-600 drop-shadow-sm">⏱️</span>
          </div>
        </div>
      </div>

      {/* 目標達成率 - クリック可能 */}
      <button
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400/12 via-orange-300/10 to-rose-300/10 p-6 text-left text-slate-900 shadow-lg backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-30px_rgba(249,115,22,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
        onClick={onMonthlyGoalClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onMonthlyGoalClick();
          }
        }}
        aria-label={`月間目標達成率: ${monthlyGoalProgress.toFixed(0)}%、目標: ${monthlyGoal ? `${monthlyGoal}km` : '未設定'}、現在: ${thisMonthDistance.toFixed(1)}km`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/40 via-orange-200/30 to-rose-200/30 opacity-70" />
        <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-40">
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.3),transparent_40%),radial-gradient(circle_at_70%_0%,rgba(244,63,94,0.3),transparent_40%)]" />
        </div>
        <div className="relative flex h-full items-start justify-between">
          <div className="space-y-2">
            <p className="flex items-center text-xs font-semibold text-rose-700">
              <span className="mr-2 text-lg">🏆</span>
              目標達成率
            </p>
            <p className="flex items-baseline text-4xl leading-none font-black drop-shadow-sm">
              {monthlyGoalProgress.toFixed(0)}%
              {monthlyGoalProgress >= 100 && (
                <span className="ml-2 text-2xl group-hover:animate-bounce">
                  🎉
                </span>
              )}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-white/70">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${monthlyGoalProgress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'}`}
                style={{ width: `${Math.min(monthlyGoalProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs font-semibold text-rose-800">
              目標: {monthlyGoal ? `${monthlyGoal}km` : '未設定'} / 現在:{' '}
              {thisMonthDistance.toFixed(1)}km
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <span
              className={`text-4xl text-rose-600 drop-shadow-sm ${monthlyGoalProgress >= 100 ? 'group-hover:animate-bounce' : 'group-hover:animate-pulse'}`}
            >
              🏆
            </span>
            <div className="text-xs font-bold text-rose-800">
              {monthlyGoal && monthlyGoal > thisMonthDistance
                ? `残り${(monthlyGoal - thisMonthDistance).toFixed(1)}km`
                : monthlyGoal
                  ? '目標達成🎉'
                  : ''}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
