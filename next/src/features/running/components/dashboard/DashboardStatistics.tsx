'use client';

import { useState } from 'react';

import type { DashboardStatisticsProps } from '../../types';
import ClientGoalForm from '../forms/ClientGoalForm';
import ClientYearlyGoalForm from '../forms/ClientYearlyGoalForm';
import StatisticsCards from '../statistics/StatisticsCards';

export default function DashboardStatistics({
  thisYearDistance,
  thisMonthDistance,
  monthlyGoalProgress,
  monthlyGoal,
  yearlyGoal,
  yearlyGoalProgress,
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
        monthlyGoalProgress={monthlyGoalProgress}
        monthlyGoal={monthlyGoal}
        yearlyGoal={yearlyGoal}
        yearlyGoalProgress={yearlyGoalProgress}
        monthlyRunDays={monthlyRunDays}
        onYearlyGoalClick={handleYearlyGoalClick}
        onMonthlyGoalClick={handleMonthlyGoalClick}
      />

      {/* モーダル */}
      <ClientGoalForm
        currentGoal={monthlyGoal}
        isOpen={monthlyGoalModalOpen}
        onClose={() => setMonthlyGoalModalOpen(false)}
      />

      <ClientYearlyGoalForm
        currentGoal={yearlyGoal}
        isOpen={yearlyGoalModalOpen}
        onClose={() => setYearlyGoalModalOpen(false)}
      />
    </div>
  );
}
