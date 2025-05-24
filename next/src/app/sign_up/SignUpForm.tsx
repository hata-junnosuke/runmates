"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/v1/auth", {
        email,
        password,
        password_confirmation: passwordConfirmation,
        confirm_success_url: "http://localhost:8000",
      });
      setSuccess("登録が完了しました。メールを確認してください。");
      setTimeout(() => router.push("/sign_in"), 2000);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(
          e.response?.data?.errors?.full_messages?.[0] || "登録に失敗しました"
        );
      } else {
        setError("登録に失敗しました");
      }
    } finally {
      setLoading(false);
    }
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
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          パスワード（確認）
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm text-center">{success}</div>
      )}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "送信中..." : "新規登録"}
      </button>
      <div className="text-center mt-2">
        <a href="/sign_in" className="text-green-500 hover:underline text-sm">
          すでにアカウントをお持ちの方はこちら
        </a>
      </div>
    </form>
  );
}
