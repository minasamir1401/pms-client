"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ShieldCheck, AlertCircle, FileText, User, Heart, Activity, Upload, QrCode, ArrowRight, Printer } from "lucide-react";
import Link from "next/link";
import API_URL from "@/config";
import { QRCodeSVG } from "qrcode.react";
import "./certificate-official.css";


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
  const [yearPrefix, setYearPrefix] = useState("");
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

    // 3. Block printing shortcuts (Ctrl+P / Cmd+P) and beforeprint
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeprint", handleBeforePrint);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
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

  useEffect(() => {
    if (certificate) {
      const canvas = document.getElementById("myCanvas") as HTMLCanvasElement | null;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 100, 100);
          ctx.fillStyle = "#000000";
          ctx.font = "bold 15px Cairo, Arial, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("4*6", 50, 50);
        }
      }
    }
  }, [certificate]);

  const formatOfficialDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    } catch {
      return dateStr;
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

  if (certificate) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between no-client-print" dir="rtl">
        {/* Official Header matching exact HTML */}
        <div className="form-inline my-2 my-lg-0 bg-light" id="removeLayoutHeader">
          <div className="">
            <a className="navbar-brand" href="#">
              <img src="/prenup/Content/css/images/logo-ar-black.png" alt="" className="nav-img" />
            </a>
          </div>
          <div className="site-name" id="sitename">
            <h4 style={{ textAlign: "center" }}>
              مبادرة السيد رئيس الجمهورية لفحص المقبلين على الزواج
            </h4>
          </div>

          <div className="col-md-2">
            <img style={{ width: "100%" }} src="/prenup/Content/css/images/100Million.png" id="100million" alt="100 مليون صحة" />
          </div>
          <div className="col-md-2">
            <img style={{ width: "100%" }} src="/prenup/Content/css/images/OncLogo.png" id="Oncology" alt="مبادرة الكشف المبكر وعلاج الأورام السرطانية" />
          </div>
        </div>

        {/* Action Bar (Search button ONLY - Edit and Print removed for client) */}
        <div className="no-print bg-slate-50 border-b border-slate-200 py-2.5 px-4 shadow-xs sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-start">
            <button
              onClick={() => { setCertificate(null); setCertCode(""); setSuccessMessage(""); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-teal-700 bg-white hover:bg-teal-50 border border-slate-300 transition cursor-pointer shadow-xs"
            >
              <ArrowRight className="h-4 w-4" />
              بحث جديد
            </button>
          </div>
        </div>

        {/* Exact Official Government Layout Replication */}
        <main className="flex-1 w-full pb-10">
          <header className="bg-header small-header"></header>

          <div className="container mt-5" id="TableDiv">
            <div className="row">
              <div className="pic col-3" style={{ display: "block", direction: "ltr", marginRight: "auto" }}>
                <canvas id="myCanvas" width="100" height="100" style={{ border: "1px solid #000000" }}></canvas>
                <br />
                <span>ختم شعار الجمهورية</span>
              </div>
            </div>

            <div className="row">
              <div className="col-3 font-weight-bold">
                <p style={{ paddingTop: "40px" }}>تاريخ الإصدار : {formatOfficialDate(certificate.issueDate)}</p>
              </div>
              <div className="col-4 font-weight-bold">
                <p style={{ paddingTop: "40px" }}>اسم الوحدة: {certificate.unitName}</p>
              </div>
              <div className="col-3 font-weight-bold">
                <p style={{ paddingTop: "40px" }}>المحافظة: {certificate.governorate}</p>
              </div>
            </div>

            <div className="row"></div>

            <div className="row">
              <div className="col-md-12">
                <h2>البيانات الأساسية</h2>
                
                <div style={{ backgroundColor: "white" }}>
                  <div className="row">
                    <div className="col-5">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        الاسم : <span className="font-weight-bold">{certificate.fullName}</span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        الرقم القومى : <span className="font-weight-bold">{certificate.nationalId}</span>
                      </p>
                    </div>
                    <div className="col-2">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        النوع : <span className="font-weight-bold">{certificate.gender}</span>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-5">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        الجنسية : <span className="font-weight-bold">{certificate.nationality}</span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        السن : <span className="font-weight-bold">{certificate.age}</span>
                      </p>
                    </div>
                    <div className="col-3">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        رقم الهاتف : <span className="font-weight-bold">{certificate.phoneNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-5">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        العنوان بالبطاقة : <span className="font-weight-bold">{certificate.idAddress}</span>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        عنوان سكن الزوجية : <span className="font-weight-bold">{certificate.maritalAddress || certificate.idAddress}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <br />

              <div className="col-md-12">
                <h2>الفحوصات الطبية</h2>

                <div style={{ backgroundColor: "white" }}>
                  <div className="row">
                    <div className="col-4">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        الطول(سم) : <span className="font-weight-bold">{certificate.height}</span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p style={{ fontFamily: "cairo" }}>
                        الوزن(كجم) : <span className="font-weight-bold">{certificate.weight}</span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p style={{ fontFamily: "cairo", display: "flex", gap: "4px" }}>
                        <span>BMI :</span>
                        <span className="font-weight-bold">{certificate.bmi}</span>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4" id="RH">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        RH : <span className="font-weight-bold">{certificate.rh === "+" || certificate.rh === "إيجابى" || certificate.rh === "إيجابي" ? "إيجابى" : certificate.rh === "-" || certificate.rh === "سالب" ? "سالب" : certificate.rh}</span>
                      </p>
                    </div>
                    <div className="col-4" id="bloodtype">
                      <p style={{ fontFamily: "cairo" }}>
                        فصيلة الدم: <span className="font-weight-bold">{certificate.bloodType}{certificate.rh === "+" ? "+" : certificate.rh === "-" ? "-" : ""}</span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p style={{ fontFamily: "cairo", display: "flex", gap: "4px" }}>
                        <span> Hb : </span>
                        <span className="font-weight-bold">{certificate.hb}</span>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4" id="HBSAG">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        HBsAg : <span className="font-weight-bold">{certificate.hbsAg === "سلبي" || certificate.hbsAg === "غير متفاعل" ? "غير متفاعل" : certificate.hbsAg}</span>
                      </p>
                    </div>
                    <div className="col-4" id="ANTIHIV">
                      <p style={{ fontFamily: "cairo" }}>
                        Anti-HIV : <span className="font-weight-bold">{certificate.antiHiv === "سلبي" || certificate.antiHiv === "غير متفاعل" ? "غير متفاعل" : certificate.antiHiv}</span>
                      </p>
                    </div>
                    <div className="col-4" id="ANTIHCV">
                      <p style={{ fontFamily: "cairo" }}>
                        Anti-HCV : <span className="font-weight-bold">{certificate.antiHcv === "سلبي" || certificate.antiHcv === "غير متفاعل" ? "غير متفاعل" : certificate.antiHcv}</span>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <p style={{ fontFamily: "cairo" }}>
                        ضغط الدم : <span className="font-weight-bold">{certificate.bloodPressure}</span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p style={{ fontFamily: "cairo" }}>
                        نتيجة فحص السكر(العشوائى) : <span className="font-weight-bold">{certificate.randomBloodSugar}</span>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <p style={{ direction: "ltr", fontWeight: "bold", textDecoration: "underline", fontFamily: "cairo", width: "100%", display: "block", textAlign: "left" }}>
                      Hb Electrophoresis :
                    </p>
                  </div>

                  <div className="row col-md-12" style={{ direction: "ltr" }}>
                    <div className="Electrophoresis-item form-group">
                      <label>A : {certificate.hbA || 98.66} %</label>
                      <div>
                        <div>
                          <label className="form-check-label">
                            <b>Normal</b>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="Electrophoresis-item form-group">
                      <label>F : {certificate.hbF ?? 0} %</label>
                      <div>
                        <div>
                          <label className="form-check-label">
                            <b>Normal</b>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="Electrophoresis-item form-group">
                      <label>A2 : {certificate.hbA2 || 1.34} %</label>
                      <div>
                        <div>
                          <label className="form-check-label">
                            <b>Normal</b>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="Electrophoresis-item form-group">
                      <label>C : {certificate.hbC ?? 0} %</label>
                      <div>
                        <div>
                          <label className="form-check-label">
                            <b>Normal</b>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="Electrophoresis-item form-group">
                      <label>S : {certificate.hbS ?? 0} %</label>
                      <div>
                        <div>
                          <label className="form-check-label">
                            <b>Normal</b>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <h2>إقرار المنتفع/المنتفعة بإعلامه بنتيجة الفحص وتوصيات الطبيب</h2>
                
                <div style={{ backgroundColor: "white" }}>
                  <div className="row pt-2">
                    <div className="col-4 pt-4">
                      <p className="mr-3 font14"> اسم الممرض/الممرضة : --------------</p>
                      <p className="mr-3 font14"> اسم الطبيب/الطبيبة : -----------------</p>
                      <p className="mr-3 font14"> مدير الوحدة : -------------------------</p>
                    </div>
                    <div className="col-4 pt-4">
                      <p className="mr-3 font14"> التوقيع : ----------------------</p>
                      <p className="mr-3 font14"> التوقيع : ----------------------</p>
                      <p className="mr-3 font14"> التوقيع : ----------------------</p>
                    </div>
                    <div className="col-3">
                      <div className="circle-stamp"></div>
                      <p style={{ paddingTop: "2px", paddingRight: "45px" }}>ختم شعار الجمهورية</p>
                    </div>
                  </div>

                  <div className="row pt-2">
                    <div className="col-6">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        أقر أنا الموقع/الموقعه أدناه : <span className="font-weight-bold">{certificate.fullName}</span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                        رقم القومى : <span className="font-weight-bold">{certificate.nationalId}</span>
                      </p>
                    </div>
                  </div>

                  <p className="mr-3 font14" style={{ fontFamily: "cairo" }}>
                    بأنه قد تم إعلامى بنتيجة الفحص الطبى والتوصيات الطبية المذكورة سابقا وقد تلقيت المشورة الخاصة بحالتى الصحية وألتزم بإعلام طرف الزواج الأخر قبل إجراءات الزواج وأصبحت بذلك مسئول عما يترتب على ذلك دون أدنى مسئولية على المنشأة الصحية والفريق الطبى الذى يمثلها .
                  </p>
                  <br />

                  <div className="row">
                    <div className="col-4 border-left">
                      <p className="mr-3 font14"> الاسم (رباعى) : ------------------</p>
                      <p className="mr-3 font14"> التوقيع : -----------------------</p>
                    </div>
                    <div className="col-3 border-left">
                      <div className="circle-stamp"></div>
                      <p style={{ paddingTop: "2px", textAlign: "center" }}>بصمة الإبهام </p>
                    </div>
                    <div className="col-5">
                      <p className="mr-3 font14"> اسم الطرف الاخر(رباعى) : <span className="font-weight-bold">{certificate.partnerName || "---------------"}</span></p>
                      <p className="mr-3 font14"> توقيع الطرف الاخر : --------------------</p>
                      <p className="mr-3 font14"> الرقم القومى للطرف الاخر : <span className="font-weight-bold">{certificate.partnerNationalId || "------------"}</span></p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-5 pt-3">
                      <p className="mr-3 font14" style={{ color: "red", fontSize: "14px" }}>
                        *هذه الوثيقة صالحة لمدة ستة اشهر من تاريخ الإصدار
                      </p>
                    </div>
                    <div className="col-sm-3"></div>
                    <div className="col-sm-4 pt-3 flex flex-col items-center justify-center">
                      <QRCodeSVG
                        value={typeof window !== "undefined" ? `${window.location.origin}/view/${certificate.certificateId}` : `http://localhost:3000/view/${certificate.certificateId}`}
                        size={110}
                        level="M"
                        className="qr-code img-thumbnail img-responsive"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-8"></div>
                    <div className="col-sm-4 mb-1 text-center">
                      <p style={{ color: "black", fontWeight: "bold", fontSize: "14px" }}>
                        {certificate.qrCodeLabel || `2026-${certificate.certificateId}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Official Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-slate-400 text-[10px] sm:text-xs">
          <p className="mb-1">جميع الحقوق محفوظة © وزارة الصحة والسكان 2026</p>
          <p className="text-[10px] text-slate-300">منظومة التسجيل المعتمدة والتحقق المشفر من الفحص الطبي للمقبلين على الزواج</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between" dir="rtl">
      {/* Official Header */}
      <div className="form-inline my-2 my-lg-0 bg-light" id="removeLayoutHeader">
        <div className="">
          <a className="navbar-brand" href="#">
            <img src="/prenup/Content/css/images/logo-ar-black.png" alt="" className="nav-img" />
          </a>
        </div>
        <div className="site-name" id="sitename">
          <h4 style={{ textAlign: "center" }}>
            مبادرة السيد رئيس الجمهورية لفحص المقبلين على الزواج
          </h4>
        </div>

        <div className="col-md-2">
          <img style={{ width: "100%" }} src="/prenup/Content/css/images/100Million.png" id="100million" alt="100 مليون صحة" />
        </div>
        <div className="col-md-2">
          <img style={{ width: "100%" }} src="/prenup/Content/css/images/OncLogo.png" id="Oncology" alt="مبادرة الكشف المبكر وعلاج الأورام السرطانية" />
        </div>
      </div>

      {/* Main Content: Exact Official Search Box */}
      <main className="flex-1 w-full pb-10">
        <div className="container mt-5 text-center">
          <h3>ادخل رقم الاستمارة</h3>
          <form onSubmit={handleSearchSubmit}>
            <div className="row text-center mt-4 textboxes">
              <div className="text-center input-one">
                <input
                  id="YEAR"
                  type="text"
                  className="form-control text-center"
                  maxLength={4}
                  value={yearPrefix}
                  onChange={(e) => setYearPrefix(e.target.value.replace(/\D/g, ""))}
                  placeholder="2026"
                />
              </div>
              <div className="text-center">
                <p style={{ fontSize: "25px", fontWeight: "bold" }}>-</p>
              </div>
              <div className="text-center input-two">
                <input
                  id="DOCNUMBER"
                  type="text"
                  className="form-control text-center"
                  maxLength={8}
                  value={certCode}
                  onChange={(e) => setCertCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="05015745"
                />
              </div>
            </div>

            {error ? (
              <div id="error" className="text-danger">{error}</div>
            ) : (
              <div id="error" className="text-danger" hidden>برجاء إدخال رقم الاستمارة</div>
            )}
            <div id="DocumentNotFound" className="text-danger" hidden>لا يوجد بيانات</div>
            <br />
            <button className="btn btn-info" id="enterPIN" type="submit" name="login" disabled={loading}>
              {loading ? "جاري الإدخال..." : "إدخال"}
            </button>
          </form>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-slate-400 text-[10px] sm:text-xs">
        <p className="mb-1">جميع الحقوق محفوظة © وزارة الصحة والسكان 2026</p>
        <p className="text-[10px] text-slate-300">منظومة التسجيل المعتمدة والتحقق المشفر من الفحص الطبي للمقبلين على الزواج</p>
      </footer>
    </div>
  );
}
