import ResponsiveHeaderNav from '@/components/layout/ResponsiveHeaderNav';

import ServerRunningDashboard from './(dashboard)/_components/ServerRunningDashboard';

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="rounded-xl bg-white p-4 md:p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700">🏃‍♂️ Runmates</h1>
            <ResponsiveHeaderNav />
          </div>
          <ServerRunningDashboard />
        </div>
      </div>
    </div>
  );
}
