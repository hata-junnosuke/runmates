import AuthWrapper from "./components/AuthWrapper";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            runmate を作ろう！
          </h1>
          <AuthWrapper />
        </div>
      </div>
    </div>
  );
}
