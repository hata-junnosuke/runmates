'use client';

import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';

import { fetchMonthData } from '../../actions/running-actions';
import type { MonthlyGoal, RunningPlan, RunRecord } from '../../types';
import ClientRunningCalendar from '../calendar/ClientRunningCalendar';
import RunningChartWrapper from '../charts/RunningChartWrapper';
import ClientPlanForm from '../forms/ClientPlanForm';
import ClientRecordForm from '../forms/ClientRecordForm';

export default function DashboardWithCalendar({
  records: initialRecords,
  plans: initialPlans,
  monthlyGoals,
}: {
  records: RunRecord[];
  plans: RunningPlan[];
  monthlyGoals: MonthlyGoal[];
}) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [recordFormOpen, setRecordFormOpen] = useState(false);
  const [planFormOpen, setPlanFormOpen] = useState(false);
  const [plansForSelectedDate, setPlansForSelectedDate] = useState<
    RunningPlan[]
  >([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  // 現在表示中の月のレコード
  const [currentMonthRecords, setCurrentMonthRecords] =
    useState<RunRecord[]>(initialRecords);
  const [currentMonthPlans, setCurrentMonthPlans] =
    useState<RunningPlan[]>(initialPlans);

  const refreshMonthData = async (date: Date) => {
    try {
      const result = await fetchMonthData(
        date.getFullYear(),
        date.getMonth() + 1,
      );
      if (result.success && result.data) {
        setCurrentMonthRecords(result.data.records);
        setCurrentMonthPlans(result.data.plans);
        return;
      }
    } catch (error) {
      console.error('Error fetching month data:', error);
    }

    // 結果が失敗でも例外でも、表示中の月と中身がズレないようクリアする
    setCurrentMonthRecords([]);
    setCurrentMonthPlans([]);
  };

  const handleDateClick = (payload: {
    dateString: string;
    date: Date;
    hasPlan: boolean;
    plansForDate: RunningPlan[];
    hasRecord: boolean;
    isFuture: boolean;
    isToday?: boolean;
    planStatus?: RunningPlan['status'] | null;
  }) => {
    setRecordFormOpen(false);
    setPlanFormOpen(false);
    setSelectedDate(payload.dateString);
    setPlansForSelectedDate(payload.plansForDate);

    // 基本は記録フォームを開く（当日/過去）。未来日は予定フォームを開く。
    if (payload.isFuture) {
      setPlanFormOpen(true);
    } else {
      setRecordFormOpen(true);
    }
  };

  const handleRecordFormClose = (freshMonthRecords?: RunRecord[]) => {
    setRecordFormOpen(false);
    setSelectedDate('');

    // 予定側の更新は revalidatePath('/dashboard') → props 同期（下部の useEffect）が担う
    if (freshMonthRecords) {
      setCurrentMonthRecords(freshMonthRecords);
    }
  };

  const handlePlanFormClose = (freshMonthPlans?: RunningPlan[]) => {
    setPlanFormOpen(false);
    setSelectedDate('');
    setPlansForSelectedDate([]);

    // 記録側の更新は revalidatePath('/dashboard') → props 同期（下部の useEffect）が担う
    if (freshMonthPlans) {
      setCurrentMonthPlans(freshMonthPlans);
    }
  };

  const openPlanForm = () => {
    setPlanFormOpen(true);
    setRecordFormOpen(false);
  };

  const openRecordForm = () => {
    setRecordFormOpen(true);
    setPlanFormOpen(false);
  };

  // 月が変更されたときにデータを取得（毎回APIを叩く）
  // refreshMonthDataが失敗・例外の両方を内部で処理するためtry/catchは不要
  const handleMonthChange = async (date: Date) => {
    setCurrentDate(date);

    setIsLoading(true);
    await refreshMonthData(date);
    setIsLoading(false);
  };

  // revalidatePath('/dashboard')によるServer Component再実行時にpropsの変更をstateに同期
  // initialRecords/initialPlansは常に当月分なので、当月表示中はそのまま同期し、
  // 別の月を表示中はrefreshMonthDataで表示中月のデータを再取得する
  const now = new Date();
  const isInitialMonth =
    currentDate.getFullYear() === now.getFullYear() &&
    currentDate.getMonth() === now.getMonth();

  // ⚠️ depsはinitialRecords/initialPlansのみ。
  // revalidatePath('/dashboard')でServer Componentが再実行され、
  // propsの配列インスタンスが差し替わることを「更新シグナル」として使っている。
  // ミューテーション後にカレンダーが最新化される唯一の経路なので削除しないこと。
  // currentDateをdepsに入れると月切り替え時にhandleMonthChangeと二重取得になるため除外。
  useEffect(() => {
    if (isInitialMonth) {
      setCurrentMonthRecords(initialRecords);
      setCurrentMonthPlans(initialPlans);
    } else {
      refreshMonthData(currentDate).catch((error) =>
        console.error('Error refreshing data after mutation:', error),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRecords, initialPlans]);

  return (
    <div className="space-y-6">
      {/* カレンダー */}
      <div className="relative">
        {isLoading && (
          <div className="bg-opacity-75 absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white">
            <LoadingSpinner size="lg" text="データを更新しています..." />
          </div>
        )}
        <ClientRunningCalendar
          records={currentMonthRecords}
          plans={currentMonthPlans}
          onDateClick={handleDateClick}
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
        />
      </div>

      {/* 走行記録グラフ */}
      <RunningChartWrapper
        records={currentMonthRecords}
        monthlyGoals={monthlyGoals}
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
      />

      {/* 記録フォーム */}
      <ClientRecordForm
        selectedDate={selectedDate}
        isOpen={recordFormOpen}
        onClose={handleRecordFormClose}
        onSwitchToPlan={openPlanForm}
      />

      {/* 予定フォーム */}
      <ClientPlanForm
        date={selectedDate}
        isOpen={planFormOpen}
        plansForDate={plansForSelectedDate}
        onClose={handlePlanFormClose}
        onSwitchToRecord={openRecordForm}
      />
    </div>
  );
}
