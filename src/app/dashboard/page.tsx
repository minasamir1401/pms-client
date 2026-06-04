"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, ShieldAlert, Award, Users, Activity, CheckCircle2, Lock } from "lucide-react";
import CertificateTable from "@/components/CertificateTable";
import CertificateForm from "@/components/CertificateForm";
import API_URL from "@/config";

interface Certificate {
  certificateId: string;
  issueDate: string;
  fullName: string;
  nationalId: string;
  gender: string;
  age: number;
  phoneNumber: string;
  governorate: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const router = useRouter();

  // Admin credentials state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  // Load certificates from backend API
  const fetchCertificates = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/certificates`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      } else {
        const data = await res.json();
        setError(data.error || "فشل تحميل البيانات");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذه الشهادة الطبية نهائياً؟")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/certificates/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchCertificates();
      } else {
        alert(data.error || "فشل حذف الشهادة");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالخادم لحذف الشهادة");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");

    if (newPassword !== confirmPassword) {
      setSettingsError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setSettingsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/credentials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
        }),
      });

      if (res.ok) {
        setSettingsSuccess("تم تحديث بيانات الدخول بنجاح.");
        setNewUsername("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsSettingsOpen(false);
          setSettingsSuccess("");
        }, 1500);
      } else {
        const data = await res.json();
        setSettingsError(data.error || "فشل تحديث بيانات الدخول.");
      }
    } catch (err) {
      setSettingsError("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setSettingsLoading(false);
    }
  };

  // Calculate Statistics
  const totalCertificates = certificates.length;
  const malesCount = certificates.filter((c) => c.gender === "ذكر").length;
  const femalesCount = certificates.filter((c) => c.gender === "أنثى").length;
  const averageAge =
    totalCertificates > 0
      ? Math.round(certificates.reduce((sum, c) => sum + c.age, 0) / totalCertificates)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-teal-500 selection:text-white" dir="rtl">
      {/* Decorative Light Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-[10%] h-[30%] w-[40%] rounded-full bg-teal-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-[10%] h-[30%] w-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 shadow-sm shadow-slate-100 z-40">
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center gap-3 md:justify-between">
            <div className="flex items-center gap-2.5 text-center md:text-right">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-inner">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  منظومة فحص المقبلين على الزواج
                </h1>
                <p className="text-[9px] sm:text-[10px] text-slate-400">لوحة التحكم الفنية والمشرف العام</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 sm:py-2 px-3 sm:px-4 text-[10px] sm:text-xs font-semibold text-slate-600 transition hover:bg-teal-500 hover:text-white cursor-pointer min-w-0"
              >
                <Lock className="h-3.5 w-3.5 shrink-0" />
                تعديل الدخول
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 py-1.5 sm:py-2 px-3 sm:px-4 text-[10px] sm:text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white cursor-pointer min-w-0"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                خروج
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Issued */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">إجمالي الشهادات المصدّرة</p>
                <h3 className="mt-2 text-2xl font-bold font-mono text-teal-600">{totalCertificates}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            {/* Males Count */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">فحوصات الذكور</p>
                <h3 className="mt-2 text-2xl font-bold font-mono text-blue-600">{malesCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* Females Count */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">فحوصات الإناث</p>
                <h3 className="mt-2 text-2xl font-bold font-mono text-pink-600">{femalesCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* Average Age */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">متوسط الأعمار</p>
                <h3 className="mt-2 text-2xl font-bold font-mono text-amber-600">
                  {averageAge} <span className="text-xs">سنة</span>
                </h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </section>

          {/* Action Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-200 pt-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">إدارة الشهادات الطبية المعتمدة</h2>
              <p className="text-xs text-slate-400">استعرض وسجل وابحث في قائمة الشهادات الصادرة عن الوحدة</p>
            </div>

             <button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 py-2.5 px-5 text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" />
              إصدار شهادة جديدة
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-600 text-sm">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Certificates Table */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
            </div>
          ) : (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
              <CertificateTable
                certificates={certificates}
                onEdit={(cert) => {
                  setEditingCertificate(cert);
                  setIsFormOpen(true);
                }}
                onDelete={handleDelete}
              />
            </section>
          )}
        </main>
      </div>

      {/* Modal - Create/Edit Certificate Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 min-[340px]:p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-3.5 min-[340px]:p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[95vh] text-slate-800">
            <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                {editingCertificate
                  ? "تعديل بيانات الفحص الطبي قبل الزواج"
                  : "نموذج إدخال بيانات الفحص الطبي قبل الزواج"}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingCertificate(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold font-mono leading-none p-1.5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <CertificateForm
              initialData={editingCertificate || undefined}
              onSuccess={() => {
                setIsFormOpen(false);
                setEditingCertificate(null);
                fetchCertificates();
              }}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCertificate(null);
              }}
            />
          </div>
        </div>
      )}
      {/* Modal - Update Admin Credentials */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-y-auto text-slate-800">
            <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                تعديل بيانات دخول المشرف
              </h2>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setSettingsError("");
                  setSettingsSuccess("");
                  setNewUsername("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold font-mono leading-none p-1.5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCredentials} className="space-y-4">
              {settingsError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                  {settingsError}
                </div>
              )}
              {settingsSuccess && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-600">
                  {settingsSuccess}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">اسم المستخدم الجديد</label>
                <input
                  type="text"
                  required
                  placeholder="اسم المستخدم الجديد"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm outline-none focus:border-teal-500 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm outline-none focus:border-teal-500 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm outline-none focus:border-teal-500 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setSettingsError("");
                    setSettingsSuccess("");
                    setNewUsername("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-4 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 py-1.5 px-4 text-xs font-bold text-white shadow hover:brightness-105 transition disabled:opacity-50 cursor-pointer"
                >
                  {settingsLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
