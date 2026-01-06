import HeaderNav from '@/components/layout/HeaderNav';
import ServerRunningDashboard from '@/features/running/components/dashboard/ServerRunningDashboard';

// ServerRunningDashboardがcookies()を参照するServer Componentを内包するためビルド時プリレンダー不可
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#eef4ff] text-slate-900">
      <HeaderNav />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-6 md:pt-16">
        <div className="fade-up">
          <ServerRunningDashboard />
        </div>
      </div>
    </div>
  );
}
