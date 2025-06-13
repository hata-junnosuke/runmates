'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const RunningChart = dynamic(() => import('./RunningChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-4 w-48"></div>
          <div className="space-y-3">
            <div className="h-2 bg-gray-300 rounded"></div>
            <div className="h-2 bg-gray-300 rounded w-5/6"></div>
            <div className="h-2 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
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

export default function RunningChartWrapper({ records, monthlyGoals }: RunningChartWrapperProps) {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
      </div>
    }>
      <RunningChart records={records} monthlyGoals={monthlyGoals} />
    </Suspense>
  );
}