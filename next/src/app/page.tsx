import HeaderNav from '@/components/layout/HeaderNav';
import ServerRunningDashboard from '@/features/running/components/dashboard/ServerRunningDashboard';

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="rounded-xl bg-white p-4 shadow-lg md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-700 md:text-3xl">
              🏃‍♂️ Runmates
            </h1>
            <HeaderNav />
          </div>
          <ServerRunningDashboard />
        </div>
      </div>
    </div>
  );
}
