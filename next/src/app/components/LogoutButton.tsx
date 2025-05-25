"use client";
import { useState } from "react";
import { signOut } from "@/lib/client-auth";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("ログアウトエラー:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
    >
      {loading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
