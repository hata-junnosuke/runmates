import HeaderNav from "./components/HeaderNav";
import ServerRunningDashboard from "./components/ServerRunningDashboard";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">
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
