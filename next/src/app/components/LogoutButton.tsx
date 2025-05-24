"use client";
import { useState } from "react";
import axios from "axios";

interface LogoutButtonProps {
  onLogoutSuccess: () => void;
}

export default function LogoutButton({ onLogoutSuccess }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access-token");
      const client = localStorage.getItem("client");
      const uid = localStorage.getItem("uid");

      if (token && client && uid) {
        await axios.delete("http://localhost:3000/api/v1/auth/sign_out", {
          headers: {
            "access-token": token,
            client: client,
            uid: uid,
          },
        });
      }
    } catch (error) {
      console.error("ログアウトエラー:", error);
    } finally {
      // ローカルストレージをクリア
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");
      setLoading(false);
      onLogoutSuccess();
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
