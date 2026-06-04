"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import API_URL from "@/config";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "خطأ غير متوقع");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-50 via-teal-50/30 to-slate-100 px-2.5 sm:px-4 text-slate-800" dir="rtl">
      {/* Background decorative glowing circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-teal-500/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] h-[70%] w-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md z-10 animate-fadeIn">
        {/* Login Card */}
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white/70 p-4 min-[340px]:p-8 shadow-xl shadow-slate-100/50 backdrop-blur-xl transition-all duration-300 hover:border-slate-300/80">
          <div className="mb-8 flex flex-col items-center">
            {/* Animated Medical/Lock Icon */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 shadow-inner">
              <Lock className="h-6 w-6 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              بوابة الفحص الطبي قبل الزواج
            </h1>
            <p className="mt-2 text-xs text-slate-500 text-center leading-relaxed">
              منصة التحكم الخاصة لإصدار ومراجعة الشهادات المعتمدة
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 transition-all duration-200">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600" htmlFor="username">
                اسم المستخدم
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-9 pl-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600" htmlFor="password">
                كلمة المرور
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-9 pl-9 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-teal-600 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-teal-500/10 outline-none transition-all duration-200 hover:shadow-teal-500/20 hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-400">
          هذا النظام خاص وخاضع لسياسة الخصوصية والأمان الفائق (حظر كامل لمحركات البحث)
        </p>
      </div>
    </div>
  );
}
