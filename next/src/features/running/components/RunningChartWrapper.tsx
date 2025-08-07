'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// チャートライブラリは重いので、必要な時だけ読み込む
const RunningChart = dynamic(() => import('./RunningChart'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="flex h-80 items-center justify-center">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-48 rounded bg-gray-300"></div>
          <div className="space-y-3">
            <div className="h-2 rounded bg-gray-300"></div>
            <div className="h-2 w-5/6 rounded bg-gray-300"></div>
            <div className="h-2 w-4/6 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="h-12 animate-pulse rounded bg-gray-200"></div>
        <div className="h-12 animate-pulse rounded bg-gray-200"></div>
        <div className="h-12 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  ),
});

interface RunRecord {
  id: string;
  date: string;
  distance: number;
}

interface MonthlyGoal {
  id?: string;
  year: number;
  month: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

interface RunningChartWrapperProps {
  records: RunRecord[];
  monthlyGoals: MonthlyGoal[];
}

export default function RunningChartWrapper({
  records,
  monthlyGoals,
}: RunningChartWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="h-80 animate-pulse rounded bg-gray-200"></div>
        </div>
      }
    >
      <RunningChart records={records} monthlyGoals={monthlyGoals} />
    </Suspense>
  );
}
