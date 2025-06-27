'use client';

import { useState } from 'react';
import ClientGoalForm from './ClientGoalForm';
import ClientYearlyGoalForm from './ClientYearlyGoalForm';


interface ClientDashboardStatisticsProps {
  thisYearDistance: number;
  thisMonthDistance: number;
  goalAchievementRate: number;
  goal: number;
  yearGoal: number;
  yearGoalProgress: number;
  totalRecords: number;
}

export default function ClientDashboardStatistics({
  thisYearDistance,
  thisMonthDistance,
  goalAchievementRate,
  goal,
  yearGoal,
  yearGoalProgress,
  totalRecords
}: ClientDashboardStatisticsProps) {
  const [monthlyGoalModalOpen, setMonthlyGoalModalOpen] = useState(false);
  const [yearlyGoalModalOpen, setYearlyGoalModalOpen] = useState(false);

  const handleMonthlyGoalClick = () => {
    setMonthlyGoalModalOpen(true);
  };

  const handleYearlyGoalClick = () => {
    setYearlyGoalModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 今年の総走行距離 */}
        <div 
          className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 group cursor-pointer"
          onClick={handleYearlyGoalClick}
        >
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
                記録: {totalRecords}回
              </div>
            </div>
          </div>
        </div>

        {/* 目標達成率 */}
        <div 
          className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 group cursor-pointer"
          onClick={handleMonthlyGoalClick}
        >
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

      {/* モーダルのみ表示（ボタンなし） */}
      <ClientGoalForm 
        currentGoal={goal}
        isOpen={monthlyGoalModalOpen}
        onClose={() => setMonthlyGoalModalOpen(false)}
        hideButton={true}
      />
      
      <ClientYearlyGoalForm 
        currentGoal={yearGoal}
        isOpen={yearlyGoalModalOpen}
        onClose={() => setYearlyGoalModalOpen(false)}
        hideButton={true}
      />
    </>
  );
}