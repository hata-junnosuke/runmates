'use client';

import ClientRunningCalendar from '@/features/running/components/calendar/ClientRunningCalendar';
import RunningChartWrapper from '@/features/running/components/charts/RunningChartWrapper';
import StatisticsCards from '@/features/running/components/statistics/StatisticsCards';
import type { RunningPlan, RunRecord } from '@/features/running/types';

const pad2 = (value: number) => String(value).padStart(2, '0');

const buildDate = (year: number, month: number, day: number) =>
  `${year}-${pad2(month)}-${pad2(day)}`;

const getMonthList = (baseDate: Date, range: number) => {
  const months: { year: number; month: number }[] = [];
  for (let offset = -range; offset <= range; offset += 1) {
    const date = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth() + offset,
      1,
    );
    months.push({ year: date.getFullYear(), month: date.getMonth() + 1 });
  }
  return months;
};

const buildDemoRecords = (
  months: { year: number; month: number }[],
): RunRecord[] => {
  const records: RunRecord[] = [];
  const days = [3, 6, 10, 14, 18, 22, 26];
  let counter = 1;

  months.forEach(({ year, month }) => {
    days.forEach((day, index) => {
      const base = 5.5 + (month % 4) * 0.7;
      const distance = Number((base + (index % 4) * 1.1).toFixed(1));
      records.push({
        id: String(counter),
        date: buildDate(year, month, day),
        distance,
      });
      counter += 1;
    });
  });

  return records;
};

const buildDemoPlans = (
  months: { year: number; month: number }[],
): RunningPlan[] => {
  const plans: RunningPlan[] = [];
  const days = [4, 11, 17, 24];
  const statuses: RunningPlan['status'][] = ['planned', 'completed', 'partial'];
  let counter = 1;

  months.forEach(({ year, month }) => {
    days.forEach((day, index) => {
      plans.push({
        id: `p${counter}`,
        date: buildDate(year, month, day),
        planned_distance: 6 + ((month + index) % 4),
        status: statuses[(month + index) % statuses.length],
      });
      counter += 1;
    });
  });

  return plans;
};

const buildMonthlyGoals = (months: { year: number; month: number }[]) =>
  months.map(({ year, month }, index) => ({
    id: `m${index + 1}`,
    year,
    month,
    distance_goal: 110 + (month - 1) * 5,
  }));

const baseDate = new Date();
const monthList = getMonthList(baseDate, 6);
const demoRecords = buildDemoRecords(monthList);
const demoPlans = buildDemoPlans(monthList);
const demoMonthlyGoals = buildMonthlyGoals(monthList);

const sumDistance = (records: RunRecord[]) =>
  records.reduce((total, record) => total + record.distance, 0);

const currentYear = baseDate.getFullYear();
const currentMonth = baseDate.getMonth() + 1;
const currentMonthKey = `${currentYear}-${pad2(currentMonth)}-`;
const currentMonthRecords = demoRecords.filter((record) =>
  record.date.startsWith(currentMonthKey),
);
const currentYearRecords = demoRecords.filter((record) =>
  record.date.startsWith(`${currentYear}-`),
);
const thisYearDistance = Number(sumDistance(currentYearRecords).toFixed(1));
const thisMonthDistance = Number(sumDistance(currentMonthRecords).toFixed(1));
const monthlyRunDays = new Set(currentMonthRecords.map((record) => record.date))
  .size;
const currentMonthGoal =
  demoMonthlyGoals.find(
    (goal) => goal.year === currentYear && goal.month === currentMonth,
  )?.distance_goal ?? 0;
const monthlyGoalProgress = currentMonthGoal
  ? (thisMonthDistance / currentMonthGoal) * 100
  : 0;
const yearlyGoal = demoMonthlyGoals
  .filter((goal) => goal.year === currentYear)
  .reduce((total, goal) => total + goal.distance_goal, 0);
const yearlyGoalProgress = yearlyGoal
  ? (thisYearDistance / yearlyGoal) * 100
  : 0;

export default function DemoDashboard() {
  return (
    <div className="space-y-8">
      <StatisticsCards
        thisYearDistance={thisYearDistance}
        thisMonthDistance={thisMonthDistance}
        monthlyGoalProgress={monthlyGoalProgress}
        monthlyGoal={currentMonthGoal}
        yearlyGoal={yearlyGoal}
        yearlyGoalProgress={yearlyGoalProgress}
        monthlyRunDays={monthlyRunDays}
        onYearlyGoalClick={() => {}}
        onMonthlyGoalClick={() => {}}
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <RunningChartWrapper
          records={demoRecords}
          monthlyGoals={demoMonthlyGoals}
          currentDate={new Date(currentYear, currentMonth - 1, 1)}
        />
        <ClientRunningCalendar
          records={demoRecords}
          plans={demoPlans}
          currentDate={new Date(currentYear, currentMonth - 1, 1)}
          onDateClick={() => {}}
        />
      </div>
    </div>
  );
}
