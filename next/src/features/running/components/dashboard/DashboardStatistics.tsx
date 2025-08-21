'use client';

import { useState } from 'react';

import type { DashboardStatisticsProps } from '../../types';
import ClientGoalForm from '../forms/ClientGoalForm';
import ClientYearlyGoalForm from '../forms/ClientYearlyGoalForm';
import StatisticsCards from '../statistics/StatisticsCards';

export default function DashboardStatistics({
  thisYearDistance,
  thisMonthDistance,
  goalAchievementRate,
  goal,
  yearGoal,
  yearGoalProgress,
  monthlyRunDays,
}: DashboardStatisticsProps) {
  const [monthlyGoalModalOpen, setMonthlyGoalModalOpen] = useState(false);
  const [yearlyGoalModalOpen, setYearlyGoalModalOpen] = useState(false);

  const handleYearlyGoalClick = () => {
    setYearlyGoalModalOpen(true);
  };

  const handleMonthlyGoalClick = () => {
    setMonthlyGoalModalOpen(true);
  };

  return (
    <div>
      <StatisticsCards
        thisYearDistance={thisYearDistance}
        thisMonthDistance={thisMonthDistance}
        goalAchievementRate={goalAchievementRate}
        goal={goal}
        yearGoal={yearGoal}
        yearGoalProgress={yearGoalProgress}
        monthlyRunDays={monthlyRunDays}
        onYearlyGoalClick={handleYearlyGoalClick}
        onMonthlyGoalClick={handleMonthlyGoalClick}
      />

      {/* モーダル */}
      <ClientGoalForm
        currentGoal={goal}
        isOpen={monthlyGoalModalOpen}
        onClose={() => setMonthlyGoalModalOpen(false)}
      />

      <ClientYearlyGoalForm
        currentGoal={yearGoal}
        isOpen={yearlyGoalModalOpen}
        onClose={() => setYearlyGoalModalOpen(false)}
      />
    </div>
  );
}
