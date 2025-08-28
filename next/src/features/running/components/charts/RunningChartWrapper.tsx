'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import type { RunningChartProps } from '../../types';

// チャートライブラリは重いので、必要な時だけ読み込む
const RunningChart = dynamic(() => import('./RunningChart'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl bg-white p-4 shadow-lg md:p-6">
      <div className="flex h-64 items-center justify-center md:h-80">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-48 rounded bg-gray-300"></div>
          <div className="space-y-3">
            <div className="h-2 rounded bg-gray-300"></div>
            <div className="h-2 w-5/6 rounded bg-gray-300"></div>
            <div className="h-2 w-4/6 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-12 animate-pulse rounded bg-gray-200"></div>
        <div className="h-12 animate-pulse rounded bg-gray-200"></div>
        <div className="h-12 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  ),
});

export default function RunningChartWrapper({
  records,
  monthlyGoals,
  currentDate,
  onMonthChange,
}: RunningChartProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl bg-white p-4 shadow-lg md:p-6">
          <div className="h-64 animate-pulse rounded bg-gray-200 md:h-80"></div>
        </div>
      }
    >
      <RunningChart
        records={records}
        monthlyGoals={monthlyGoals}
        currentDate={currentDate}
        onMonthChange={onMonthChange}
      />
    </Suspense>
  );
}
