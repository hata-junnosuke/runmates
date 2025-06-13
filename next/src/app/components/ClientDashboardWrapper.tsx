'use client';

import dynamic from 'next/dynamic';

interface RunRecord {
  id: string;
  date: string;
  distance: number;
  created_at?: string;
  updated_at?: string;
}

interface RunningStatistics {
  this_year_distance: number;
  this_month_distance: number;
  total_records: number;
  recent_records: RunRecord[];
}

interface MonthlyGoal {
  id?: string;
  year: number;
  month: number;
  distance_goal: number;
  created_at?: string;
  updated_at?: string;
}

interface ClientDashboardWrapperProps {
  records: RunRecord[];
  goal: number;
  statistics: RunningStatistics;
  hasGoal: boolean;
  yearlyGoal: number;
  hasYearlyGoal: boolean;
  monthlyGoals: MonthlyGoal[];
}

const DashboardWithCalendar = dynamic(() => import('./DashboardWithCalendar'), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
});

export default function ClientDashboardWrapper(props: ClientDashboardWrapperProps) {
  return <DashboardWithCalendar {...props} />;
}