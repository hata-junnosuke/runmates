"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/client-auth";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn(email, password);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "ログインに失敗しました");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          パスワード
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "送信中..." : "サインイン"}
      </button>
      <div className="text-center mt-2">
        <a href="/sign_up" className="text-green-500 hover:underline text-sm">
          アカウントをお持ちでない方はこちら
        </a>
      </div>
    </form>
  );
}
