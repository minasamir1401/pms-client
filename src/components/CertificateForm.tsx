"use client";

import { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";

interface CertificateFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CertificateForm({ initialData, onSuccess, onCancel }: CertificateFormProps) {
  // Form Sections State
  const [activeTab, setActiveTab] = useState<"basic" | "medical" | "hb" | "partner">("basic");

  // Form Fields State
  // Basic Info
  const [unitName, setUnitName] = useState(initialData?.unitName || "");
  const [governorate, setGovernorate] = useState(initialData?.governorate || "");
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId || "");
  const [gender, setGender] = useState(initialData?.gender || "ذكر");
  const [nationality, setNationality] = useState(initialData?.nationality || "مصري");
  const [age, setAge] = useState(initialData?.age?.toString() || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [maritalAddress, setMaritalAddress] = useState(initialData?.maritalAddress || "");
  const [idAddress, setIdAddress] = useState(initialData?.idAddress || "");

  // Medical Tests
  const [height, setHeight] = useState(initialData?.height?.toString() || "");
  const [weight, setWeight] = useState(initialData?.weight?.toString() || "");
  const [bloodPressure, setBloodPressure] = useState(initialData?.bloodPressure || "120/80");
  const [bloodType, setBloodType] = useState(initialData?.bloodType || "O");
  const [rh, setRh] = useState(initialData?.rh || "+");
  const [hbsAg, setHbsAg] = useState(initialData?.hbsAg || "سلبي");
  const [antiHcv, setAntiHcv] = useState(initialData?.antiHcv || "سلبي");
  const [antiHiv, setAntiHiv] = useState(initialData?.antiHiv || "سلبي");
  const [randomBloodSugar, setRandomBloodSugar] = useState(initialData?.randomBloodSugar?.toString() || "");
  const [bmi, setBmi] = useState(initialData?.bmi?.toString() || "");
  const [hb, setHb] = useState(initialData?.hb?.toString() || "");

  // Hb Electrophoresis
  const [hbA, setHbA] = useState(initialData?.hbA?.toString() || "97");
  const [hbF, setHbF] = useState(initialData?.hbF?.toString() || "0.5");
  const [hbA2, setHbA2] = useState(initialData?.hbA2?.toString() || "2.5");
  const [hbC, setHbC] = useState(initialData?.hbC?.toString() || "0");
  const [hbS, setHbS] = useState(initialData?.hbS?.toString() || "0");

  // Partner Info
  const [partnerName, setPartnerName] = useState(initialData?.partnerName || "");
  const [partnerNationalId, setPartnerNationalId] = useState(initialData?.partnerNationalId || "");

  // Submission Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-calculate BMI
  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const computedBmi = w / (heightInMeters * heightInMeters);
      setBmi(computedBmi.toFixed(1));
    } else {
      setBmi("");
    }
  }, [height, weight]);

  // Auto-calculate Age from National ID (for Egyptian National IDs)
  useEffect(() => {
    if (nationalId.length === 14) {
      try {
        const centuryCode = parseInt(nationalId.charAt(0), 10);
        const yearCode = parseInt(nationalId.substring(1, 3), 10);
        const monthCode = parseInt(nationalId.substring(3, 5), 10);
        const dayCode = parseInt(nationalId.substring(5, 7), 10);

        let birthYear = 0;
        if (centuryCode === 2) birthYear = 1900 + yearCode;
        else if (centuryCode === 3) birthYear = 2000 + yearCode;

        if (birthYear > 0 && monthCode > 0 && monthCode <= 12 && dayCode > 0 && dayCode <= 31) {
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthYear;
          const monthDiff = today.getMonth() + 1 - monthCode;
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dayCode)) {
            calculatedAge--;
          }
          if (calculatedAge > 0 && calculatedAge < 120) {
            setAge(calculatedAge.toString());
          }
        }
      } catch (e) {
        // Fallback if National ID is invalid format
      }
    }
  }, [nationalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple validation checks
    if (!unitName || !governorate || !fullName || !nationalId || !age || !phoneNumber || !idAddress) {
      setError("يرجى ملء جميع الحقول الشخصية الأساسية المطلوبة.");
      setActiveTab("basic");
      setLoading(false);
      return;
    }

    if (!height || !weight || !bloodPressure || !randomBloodSugar || !hb) {
      setError("يرجى ملء جميع الفحوصات الطبية الأساسية.");
      setActiveTab("medical");
      setLoading(false);
      return;
    }

    const payload = {
      unitName,
      governorate,
      fullName,
      nationalId,
      gender,
      nationality,
      age: parseInt(age, 10),
      phoneNumber,
      maritalAddress: maritalAddress || null,
      idAddress,
      height: parseFloat(height),
      weight: parseFloat(weight),
      bloodPressure,
      bloodType,
      rh,
      hbsAg,
      antiHcv,
      antiHiv,
      randomBloodSugar: parseFloat(randomBloodSugar),
      bmi: parseFloat(bmi) || 0,
      hb: parseFloat(hb),
      hbA: parseFloat(hbA) || 0,
      hbF: parseFloat(hbF) || 0,
      hbA2: parseFloat(hbA2) || 0,
      hbC: parseFloat(hbC) || 0,
      hbS: parseFloat(hbS) || 0,
      partnerName: partnerName || null,
      partnerNationalId: partnerNationalId || null,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const isEdit = !!initialData?.certificateId;
      const url = isEdit
        ? `${apiUrl}/api/certificates/${initialData.certificateId}`
        : `${apiUrl}/api/certificates`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error || "حدث خطأ ما أثناء حفظ البيانات");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم، يرجى التحقق من الشبكة");
    } finally {
      setLoading(false);
    }
  };

  const tabClass = (tab: typeof activeTab) =>
    `flex-shrink-0 md:flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-center text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 outline-none cursor-pointer ${
      activeTab === tab
        ? "border-teal-500 text-teal-600 bg-teal-50 font-bold"
        : "border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
    }`;

  return (
    <div className="w-full text-slate-800" dir="rtl">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto whitespace-nowrap border-b border-slate-200 mb-6 rounded-t-xl bg-slate-50 scrollbar-none">
        <button type="button" onClick={() => setActiveTab("basic")} className={tabClass("basic")}>
          البيانات الأساسية
        </button>
        <button type="button" onClick={() => setActiveTab("medical")} className={tabClass("medical")}>
          القياسات والفحوصات
        </button>
        <button type="button" onClick={() => setActiveTab("hb")} className={tabClass("hb")}>
          الفحص الكهربائي (Hb)
        </button>
        <button type="button" onClick={() => setActiveTab("partner")} className={tabClass("partner")}>
          بيانات الطرف الآخر
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Basic Info */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">اسم الوحدة الطبية *</label>
              <input
                type="text"
                required
                placeholder="المركز الطبي بـ..."
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">المحافظة *</label>
              <input
                type="text"
                required
                placeholder="القاهرة، الجيزة..."
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">الاسم الكامل للمفحوص *</label>
              <input
                type="text"
                required
                placeholder="الاسم ثلاثي أو رباعي كما بالبطاقة"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">الرقم القومي (14 رقم) *</label>
              <input
                type="text"
                required
                maxLength={14}
                placeholder="29812030102034"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm text-left tracking-wider"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">الجنس *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 text-slate-800 shadow-sm"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">الجنسية *</label>
              <input
                type="text"
                required
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">العمر *</label>
              <input
                type="number"
                required
                placeholder="سن المفحوص"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">رقم الهاتف *</label>
              <input
                type="text"
                required
                placeholder="01xxxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm text-left"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">العنوان المدون بالبطاقة *</label>
              <input
                type="text"
                required
                placeholder="الشارع، المدينة، المحافظة بالتفصيل"
                value={idAddress}
                onChange={(e) => setIdAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">عنوان مسكن الزوجية (إن وجد)</label>
              <input
                type="text"
                placeholder="العنوان المتوقع لبيت الزوجية"
                value={maritalAddress}
                onChange={(e) => setMaritalAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Medical Tests */}
        {activeTab === "medical" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">الطول (سم) *</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="مثال: 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">الوزن (كجم) *</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="مثال: 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">مؤشر كتلة الجسم (BMI)</label>
              <input
                type="text"
                disabled
                value={bmi}
                placeholder="يُحسب تلقائياً"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-sm outline-none text-teal-600 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">ضغط الدم *</label>
              <input
                type="text"
                required
                placeholder="120/80"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">فصيلة الدم *</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 text-slate-800 shadow-sm"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">عامل ريسس (Rh) *</label>
              <select
                value={rh}
                onChange={(e) => setRh(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 text-slate-800 shadow-sm"
              >
                <option value="+">موجب (+)</option>
                <option value="-">سالب (-)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">فيروس الكبد الوبائي B (HbsAg) *</label>
              <select
                value={hbsAg}
                onChange={(e) => setHbsAg(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 text-slate-800 shadow-sm"
              >
                <option value="سلبي">سلبي (Negative)</option>
                <option value="إيجابي">إيجابي (Positive)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">فيروس الكبد الوبائي C (Anti-HCV) *</label>
              <select
                value={antiHcv}
                onChange={(e) => setAntiHcv(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 text-slate-800 shadow-sm"
              >
                <option value="سلبي">سلبي (Negative)</option>
                <option value="إيجابي">إيجابي (Positive)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">فيروس نقص المناعة البشري (HIV) *</label>
              <select
                value={antiHiv}
                onChange={(e) => setAntiHiv(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 text-slate-800 shadow-sm"
              >
                <option value="سلبي">سلبي (Negative)</option>
                <option value="إيجابي">إيجابي (Positive)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">السكر العشوائي (mg/dl) *</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="مثال: 95.5"
                value={randomBloodSugar}
                onChange={(e) => setRandomBloodSugar(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">الهيموجلوبين Hb (g/dl) *</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="مثال: 13.4"
                value={hb}
                onChange={(e) => setHb(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Hb Electrophoresis */}
        {activeTab === "hb" && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fadeIn">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Hb A (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={hbA}
                onChange={(e) => setHbA(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Hb F (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={hbF}
                onChange={(e) => setHbF(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Hb A2 (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={hbA2}
                onChange={(e) => setHbA2(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Hb C (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={hbC}
                onChange={(e) => setHbC(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Hb S (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={hbS}
                onChange={(e) => setHbS(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 shadow-sm"
              />
            </div>
            <div className="md:col-span-5 text-xs text-slate-500 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
              * تحليل الهيموجلوبين الكهربائي (Hemoglobin Electrophoresis) يُستخدم لتشخيص أمراض الدم الوراثية مثل أنيميا الخلايا المنجلية والتلاسيميا.
            </div>
          </div>
        )}

        {/* Tab 4: Partner Info */}
        {activeTab === "partner" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">اسم شريك الزواج المتوقع</label>
              <input
                type="text"
                placeholder="الاسم الكامل للطرف الآخر"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">الرقم القومي للطرف الآخر</label>
              <input
                type="text"
                maxLength={14}
                placeholder="الرقم القومي المكون من 14 رقم"
                value={partnerNationalId}
                onChange={(e) => setPartnerNationalId(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-800 placeholder-slate-400 shadow-sm text-left tracking-wider"
              />
            </div>
          </div>
        )}

        {/* Actions Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-slate-50 py-2 px-5 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
          >
            إلغاء
          </button>

          {activeTab !== "partner" ? (
            <button
              type="button"
              onClick={() => {
                if (activeTab === "basic") setActiveTab("medical");
                else if (activeTab === "medical") setActiveTab("hb");
                else if (activeTab === "hb") setActiveTab("partner");
              }}
              className="rounded-lg bg-slate-100 py-2 px-5 text-sm font-semibold text-teal-600 hover:bg-teal-50 transition cursor-pointer"
            >
              التالي
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 py-2 px-6 text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {initialData?.certificateId ? "حفظ التعديلات" : "حفظ وإصدار الشهادة"}
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
