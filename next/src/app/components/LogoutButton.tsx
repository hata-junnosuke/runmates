"use client";
import { useTransition } from "react";
import { signOutAction } from "@/app/actions/auth-actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
    >
      {isPending ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
 