"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function AuthWrapper() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ログイン状態をチェック
    const token = localStorage.getItem("access-token");
    const client = localStorage.getItem("client");
    const uid = localStorage.getItem("uid");

    if (token && client && uid) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    router.push("/sign_in");
  };

  if (loading) {
    return (
      <div className="text-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-6">ログインが必要です</p>
        <div className="space-x-4">
          <a
            href="/sign_in"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
          >
            ログイン
          </a>
          <a
            href="/sign_up"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
          >
            新規登録
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-lg">ログイン中です！</p>
        <p className="text-green-600 mt-2">
          runmateアプリの開発を始めましょう 🏃‍♂️
        </p>
      </div>
    </div>
  );
}
