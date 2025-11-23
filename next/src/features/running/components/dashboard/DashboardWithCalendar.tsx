'use client';

import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';

import { clientRunningPlansAPI } from '../../api/client-running-plans';
import { clientRunningRecordsAPI } from '../../api/client-running-records';
import { eventBus, EVENTS } from '../../lib/events';
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

  const fetchMonthData = async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const [recordsResult, plansResult] = await Promise.all([
      clientRunningRecordsAPI.getByMonth(year, month),
      clientRunningPlansAPI.getByMonth(year, month),
    ]);
    if (recordsResult.success) {
      setCurrentMonthRecords(recordsResult.data);
    } else {
      setCurrentMonthRecords([]);
    }
    if (plansResult.success) {
      setCurrentMonthPlans(plansResult.data);
    } else {
      setCurrentMonthPlans([]);
    }
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

    // Server Actionから返された最新データで更新
    if (freshMonthRecords) {
      setCurrentMonthRecords(freshMonthRecords);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      clientRunningPlansAPI
        .getByMonth(year, month)
        .then((result) => {
          if (result.success) {
            setCurrentMonthPlans(result.data);
          }
        })
        .catch((error) =>
          console.error('Error refreshing plans after record save', error),
        );
    }
  };

  const handlePlanFormClose = (freshMonthPlans?: RunningPlan[]) => {
    setPlanFormOpen(false);
    setSelectedDate('');
    setPlansForSelectedDate([]);

    if (freshMonthPlans) {
      setCurrentMonthPlans(freshMonthPlans);
      // 予定更新後も当月の記録を最新化しておく
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      clientRunningRecordsAPI
        .getByMonth(year, month)
        .then((result) => {
          if (result.success) {
            setCurrentMonthRecords(result.data);
          }
        })
        .catch((error) =>
          console.error('Error refreshing records after plan save', error),
        );
    } else {
      // フォールバックで当月データを再取得
      fetchMonthData(currentDate).catch((error) =>
        console.error('Error refreshing data after plan close', error),
      );
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
  const handleMonthChange = async (date: Date) => {
    setCurrentDate(date);

    setIsLoading(true);

    try {
      await fetchMonthData(date);
    } catch (error) {
      console.error('Error fetching records:', error);
      setCurrentMonthRecords([]);
      setCurrentMonthPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  // イベントリスナーを登録して、削除時にデータを再取得
  useEffect(() => {
    if (!eventBus) return;

    const handleRecordDeleted = async () => {
      // クライアントAPIで即座にデータを更新
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      try {
        const [recordsResult, plansResult] = await Promise.all([
          clientRunningRecordsAPI.getByMonth(year, month),
          clientRunningPlansAPI.getByMonth(year, month),
        ]);
        if (recordsResult.success) {
          setCurrentMonthRecords(recordsResult.data);
        }
        if (plansResult.success) {
          setCurrentMonthPlans(plansResult.data);
        }
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    };

    eventBus.on(EVENTS.RUNNING_RECORD_DELETED, handleRecordDeleted);

    return () => {
      if (eventBus) {
        eventBus.off(EVENTS.RUNNING_RECORD_DELETED, handleRecordDeleted);
      }
    };
  }, [currentDate]); // currentDateを依存配列に追加

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
