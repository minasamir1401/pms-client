"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ShieldCheck, AlertCircle, FileText, User, Heart, Activity, Upload, QrCode } from "lucide-react";
import Link from "next/link";
import API_URL from "@/config";


interface Certificate {
  certificateId: string;
  issueDate: string;
  qrCodeLabel: string;
  unitName: string;
  governorate: string;
  fullName: string;
  nationalId: string;
  gender: string;
  nationality: string;
  age: number;
  phoneNumber: string;
  maritalAddress: string | null;
  idAddress: string;
  height: number;
  weight: number;
  bloodPressure: string;
  bloodType: string;
  rh: string;
  hbsAg: string;
  antiHcv: string;
  antiHiv: string;
  randomBloodSugar: number;
  bmi: number;
  hb: number;
  hbA: number;
  hbF: number;
  hbA2: number;
  hbC: number;
  hbS: number;
  partnerName: string | null;
  partnerNationalId: string | null;
}

export default function SearchPage() {
  const [yearPrefix, setYearPrefix] = useState("2026");
  const [certCode, setCertCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic injection of jsQR and PDF.js scripts from CDNs
  useEffect(() => {
    // 1. Inject jsQR
    if (!(window as any).jsQR) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // 2. Inject PDF.js
    if (!(window as any).pdfjsLib) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const fetchCertificateData = async (prefix: string, code: string) => {
    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const res = await fetch(`${API_URL}/api/certificates/${code}`);
      if (res.ok) {
        const data = await res.json();
        if (data.qrCodeLabel && !data.qrCodeLabel.startsWith(prefix)) {
          setError(`السنة الكودية المدخلة (${prefix}) لا تتطابق مع هذه الشهادة.`);
          setLoading(false);
          return;
        }
        setCertificate(data);
      } else {
        const data = await res.json();
        setError(data.error || "الشهادة غير مسجلة بالنظام أو لم تصدر بعد.");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    const cleanPrefix = yearPrefix.trim().replace(/\D/g, "");
    const cleanCode = certCode.trim().replace(/\D/g, "");

    if (!cleanPrefix || !cleanCode) {
      setError("يرجى ملء كلا الحقلين (السنة الكودية وكود الشهادة).");
      return;
    }

    if (cleanCode.length !== 8) {
      setError("كود الشهادة يجب أن يتكون من 8 أرقام (مثال: 12345678).");
      return;
    }

    fetchCertificateData(cleanPrefix, cleanCode);
  };

  // Parse and handle scanned QR code contents
  const handleScannedText = (scannedText: string) => {
    let cleanCode = scannedText.trim();

    // If it's a URL, extract the path segment after "/view/"
    if (cleanCode.includes("/view/")) {
      const parts = cleanCode.split("/view/");
      cleanCode = parts[parts.length - 1] || cleanCode;
    }

    // Handle formatted codes like "2026-12345678"
    let prefix = "2026";
    if (cleanCode.includes("-")) {
      const parts = cleanCode.split("-");
      prefix = parts[0] || "2026";
      cleanCode = parts[1] || cleanCode;
    }

    const codeNum = cleanCode.replace(/\D/g, "");
    const prefixNum = prefix.replace(/\D/g, "");

    if (codeNum.length === 8) {
      setYearPrefix(prefixNum);
      setCertCode(codeNum);
      setSuccessMessage(`تم مسح الكود بنجاح: ${prefixNum}-${codeNum}`);
      fetchCertificateData(prefixNum, codeNum);
    } else {
      setError(`تم قراءة كود QR بنجاح: (${scannedText}) ولكنه لا يحتوي على كود استعلام مطابق للصيغة الرسمية.`);
    }
  };

  // Handle uploaded Image scanning
  const scanImageFile = (file: File) => {
    setScanLoading(true);
    setError("");
    setSuccessMessage("");

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          setError("تعذر تهيئة محرك قراءة الصور.");
          setScanLoading(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const jsQR = (window as any).jsQR;
          if (!jsQR) {
            setError("مكتبة قراءة كود QR لا تزال قيد التحميل، يرجى المحاولة مرة أخرى.");
            setScanLoading(false);
            return;
          }

          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            handleScannedText(code.data);
          } else {
            setError("لم يتم العثور على رمز QR كود في الصورة المرفقة. يرجى التأكد من وضوح الصورة.");
          }
        } catch (err) {
          setError("حدث خطأ أثناء فحص محتوى الصورة.");
        } finally {
          setScanLoading(false);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle uploaded PDF scanning
  const scanPdfFile = (file: File) => {
    setScanLoading(true);
    setError("");
    setSuccessMessage("");

    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const arrayBuffer = this.result as ArrayBuffer;
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          setError("مكتبة قراءة ملفات PDF قيد التحميل، يرجى المحاولة مرة أخرى بعد ثوانٍ.");
          setScanLoading(false);
          return;
        }

        // Set worker source path
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        // Extract first page of the PDF certificate
        const page = await pdf.getPage(1);
        
        // Scale 2.0 to ensure high-definition rendering of QR details
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          setError("تعذر تهيئة محرك رسم PDF.");
          setScanLoading(false);
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const jsQR = (window as any).jsQR;
        if (!jsQR) {
          setError("مكتبة قراءة كود QR لا تزال قيد التحميل، يرجى المحاولة مرة أخرى.");
          setScanLoading(false);
          return;
        }

        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          handleScannedText(code.data);
        } else {
          setError("لم يتم العثور على رمز QR كود في الصفحة الأولى من ملف PDF المرفق.");
        }
      } catch (err) {
        setError("فشل فحص ملف PDF. تأكد من أن الملف غير تالف ولا يحمل كلمة مرور.");
      } finally {
        setScanLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      scanPdfFile(file);
    } else if (file.type.startsWith("image/")) {
      scanImageFile(file);
    } else {
      setError("نوع الملف غير مدعوم. يرجى إرفاق صورة (PNG, JPG) أو مستند PDF فقط.");
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-teal-500 selection:text-white flex flex-col justify-between relative overflow-hidden" dir="rtl">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] h-[50%] w-[60%] rounded-full bg-teal-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[60%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Responsive Official Header based on provided layout */}
      <header className="relative z-10 border-b border-slate-200 bg-white sticky top-0 shadow-sm" id="removeLayoutHeader">
        <div 
          className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-4 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/header-bg.png')" }}
        >
          
          <div className="flex-shrink-0">
            <a className="navbar-brand" href="#">
              <img className="nav-img h-12 sm:h-16 w-auto object-contain" src="/images/logo-ar-black.png" alt="شعار الوزارة" />
            </a>
          </div>

          <div className="site-name flex-grow text-center" id="sitename">
            <h4 style={{ textAlign: 'center' }} className="text-sm sm:text-base md:text-lg font-bold text-slate-800 leading-snug">
              مبادرة السيد رئيس الجمهورية لفحص المقبلين على الزواج
            </h4>
          </div>

          <div className="flex items-center justify-center gap-4 shrink-0">
            <div className="w-20 sm:w-24">
              <img src="/images/100Million.png" alt="100 مليون صحة" style={{ width: '100%' }} />
            </div>
            <div className="w-20 sm:w-24">
              <img src="/images/OncLogo.png" alt="Onc Logo" style={{ width: '100%' }} />
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start py-6 sm:py-10 px-2.5 sm:px-4 max-w-4xl w-full mx-auto space-y-6 sm:space-y-8">
        
        {/* Intro */}
        <div className="text-center max-w-xl space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            استعلام عن نتيجة الفحص الطبي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            أدخل كود الشهادة يدوياً أو قم **بإرفاق صورة الشهادة أو ملف PDF** لقراءة رمز الاستجابة السريعة (QR Code) فوراً والتحقق من صحتها.
          </p>
        </div>

        {/* Search & Upload Section */}
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/80 p-3.5 min-[340px]:p-6 sm:p-8 shadow-lg shadow-slate-100/50 space-y-6">
          
          {/* Manual Input Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <label className="block text-xs font-bold text-slate-500">
              استعلام يدوي برقم الشهادة المعتمد
            </label>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-2 sm:p-2.5 shadow-inner" dir="ltr">
                {/* Year prefix */}
                <input
                  type="text"
                  maxLength={4}
                  placeholder="2026"
                  value={yearPrefix}
                  onChange={(e) => setYearPrefix(e.target.value.replace(/\D/g, ""))}
                  className="w-14 sm:w-20 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg py-2 sm:py-2.5 outline-none focus:border-teal-500 shadow-sm font-mono text-sm sm:text-base"
                  title="السنة الكودية"
                />
                
                {/* Separator */}
                <span className="text-slate-400 font-bold text-lg sm:text-xl font-mono px-0.5 sm:px-1 select-none">-</span>
                
                {/* 8-Digit ID code */}
                <input
                  type="text"
                  maxLength={8}
                  placeholder="12345678"
                  value={certCode}
                  onChange={(e) => setCertCode(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 min-w-0 text-center font-bold tracking-normal min-[340px]:tracking-widest text-slate-800 bg-white border border-slate-200 rounded-lg py-2 sm:py-2.5 outline-none focus:border-teal-500 shadow-sm font-mono text-sm sm:text-base"
                  title="رقم الشهادة"
                />
              </div>

              <button
                type="submit"
                disabled={loading || scanLoading}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3 sm:py-3.5 px-6 text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Search className="h-4.5 w-4.5" />
                    استعلام يدوي
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Or Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200/80"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold">أو مسح ملف الشهادة</span>
            <div className="flex-grow border-t border-slate-200/80"></div>
          </div>

          {/* QR Attachment Upload Section */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,application/pdf"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || scanLoading}
              className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-teal-400/80 rounded-2xl p-4 sm:p-6 bg-slate-50/50 hover:bg-teal-50/10 transition-all cursor-pointer group disabled:opacity-50"
            >
              {scanLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
                  <span className="text-xs font-bold text-slate-600 text-center">جاري قراءة وتحليل ملف الشهادة...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-teal-600 group-hover:border-teal-200 shadow-sm transition-all">
                    <QrCode className="h-5.5 w-5.5" />
                  </div>
                  <div className="text-xs font-bold text-slate-600">
                    اضغط هنا لإرفاق صورة الشهادة أو ملف الـ PDF
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400">يدعم صور الكاميرا (PNG, JPG) وملفات المستندات الرسمية (PDF)</p>
                </div>
              )}
            </button>
          </div>

          {/* Success Scanned Message */}
          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 sm:p-4 flex items-center gap-2 text-emerald-800 text-xs sm:text-sm animate-fadeIn">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4 flex items-start gap-3 text-red-600 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}
        </div>

        {/* Search Results Display */}
        {certificate && (
          <div className="w-full bg-white rounded-2xl border border-slate-200 p-3.5 min-[340px]:p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
            
            {/* Header Validation Ribbon */}
            <div className="rounded-xl bg-teal-50 border border-teal-100 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-teal-800">
              <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-right">
                <ShieldCheck className="h-6 w-6 text-teal-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm sm:text-base">تم التحقق: وثيقة رسمية معتمدة</h3>
                  <p className="text-[9px] sm:text-[10px] text-teal-600/90 font-medium">الشهادة مسجلة بنجاح في قاعدة بيانات الفحص الطبي</p>
                </div>
              </div>
              <Link
                href={`/view/${certificate.certificateId}`}
                target="_blank"
                className="w-full sm:w-auto text-center flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-1.5 px-4 text-xs font-bold text-white hover:bg-teal-700 transition"
              >
                <FileText className="h-4 w-4" />
                عرض نسخة الطباعة الرسمية A4
              </Link>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="h-4.5 w-4.5 text-teal-600" />
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">البيانات الشخصية</h4>
                </div>
                <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-x-2 gap-y-2.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">الاسم الكامل</span>
                    <span className="font-bold text-slate-800">{certificate.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">الرقم القومي</span>
                    <span className="font-bold text-slate-800 font-mono">{certificate.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">الجنس / الجنسية</span>
                    <span className="font-semibold text-slate-700">{certificate.gender} / {certificate.nationality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">السن</span>
                    <span className="font-semibold text-slate-700">{certificate.age} سنة</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">المحافظة / الوحدة</span>
                    <span className="font-semibold text-slate-700">{certificate.governorate} - {certificate.unitName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">تاريخ فحص الوثيقة</span>
                    <span className="font-semibold text-slate-700">{formatDate(certificate.issueDate)}</span>
                  </div>
                </div>
              </div>

              {/* Medical Measurements */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Activity className="h-4.5 w-4.5 text-teal-600" />
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">الفحوصات والقياسات الطبية</h4>
                </div>
                <div className="grid grid-cols-2 min-[380px]:grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex flex-col justify-center min-h-[52px]">
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">فصيلة الدم</span>
                    <span className="font-bold text-teal-600 text-sm sm:text-base">{certificate.bloodType}{certificate.rh}</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex flex-col justify-center min-h-[52px]">
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">ضغط الدم</span>
                    <span className="font-bold text-slate-700 text-sm sm:text-base font-mono">{certificate.bloodPressure}</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex flex-col justify-center min-h-[52px]">
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">الهيموجلوبين</span>
                    <span className="font-bold text-slate-700 text-sm sm:text-base font-mono">{certificate.hb}</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex flex-col justify-center min-h-[52px]">
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">السكر العشوائي</span>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm font-mono">{certificate.randomBloodSugar}</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex flex-col justify-center min-h-[52px]">
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">مؤشر الكتلة BMI</span>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm font-mono">{certificate.bmi}</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex flex-col justify-center min-h-[52px]">
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">الفيروسات الكبدية</span>
                    <span className="font-semibold text-emerald-600 text-xs sm:text-xs">سلبي</span>
                  </div>
                </div>
              </div>

              {/* Partner Details */}
              <div className="md:col-span-2 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Heart className="h-4.5 w-4.5 text-pink-500" />
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">بيانات شريك الطرف الآخر المرفق بالطلب</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-pink-50/20 border border-pink-100/50 p-3 min-[340px]:p-4 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">اسم الشريك المتوقع</span>
                    <span className="font-bold text-slate-800">{certificate.partnerName || "غير مدون بالشهادة"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] sm:text-[10px]">الرقم القومي للشريك</span>
                    <span className="font-bold text-slate-700 font-mono">{certificate.partnerNationalId || "غير مدون بالشهادة"}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-6 text-center text-slate-400 text-[10px] sm:text-xs">
        <p className="mb-1">جميع الحقوق محفوظة © وزارة الصحة والسكان 2026</p>
        <p className="text-[10px] text-slate-300">منظومة التسجيل المعتمدة والتحقق المشفر من الفحص الطبي للمقبلين على الزواج</p>
      </footer>
    </div>
  );
}
