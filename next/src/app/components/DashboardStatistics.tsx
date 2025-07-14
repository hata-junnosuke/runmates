'use client';

import { useState } from 'react';
import StatisticsCards from './StatisticsCards';
import ClientGoalForm from './ClientGoalForm';
import ClientYearlyGoalForm from './ClientYearlyGoalForm';

interface DashboardStatisticsProps {
  thisYearDistance: number;
  thisMonthDistance: number;
  goalAchievementRate: number;
  goal: number;
  yearGoal: number;
  yearGoalProgress: number;
  monthlyRunDays: number;
}

export default function DashboardStatistics({
  thisYearDistance,
  thisMonthDistance,
  goalAchievementRate,
  goal,
  yearGoal,
  yearGoalProgress,
  monthlyRunDays
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