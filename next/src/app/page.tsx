import { getAuthStatus } from "@/lib/server-auth";
import LogoutButton from "./components/LogoutButton";

export default async function HomePage() {
  const isAuthenticated = await getAuthStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">
              runmate を作ろう！
            </h1>
            {isAuthenticated && <LogoutButton />}
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-lg">ログイン中です！</p>
            <p className="text-green-600 mt-2">
              runmateアプリの開発を始めましょう 🏃‍♂️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
