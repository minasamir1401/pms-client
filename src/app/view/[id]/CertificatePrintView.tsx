"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

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

interface CertificatePrintViewProps {
  certificate: Certificate;
}

export default function CertificatePrintView({ certificate }: CertificatePrintViewProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(`${window.location.origin}/view/${certificate.certificateId}`);
    }
  }, [certificate.certificateId]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center py-6 px-4 print:bg-white print:text-black print:p-0 print:m-0">
      {/* Import Cairo Font and Print Settings */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        
        body, html {
          font-family: 'Cairo', sans-serif !important;
        }

        @media print {
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            width: 210mm;
            height: 297mm;
            padding: 12mm 15mm !important;
            box-sizing: border-box;
            background-color: #ffffff !important;
          }
        }
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>

      {/* Admin Action Bar (Hidden during print) */}
      <div className="no-print w-full max-w-4xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-teal-400" />
          <span className="text-xs font-semibold">
            معاينة الشهادة الطبية الرسمية قبل الطباعة. تم استيراد الخطوط والتنسيقات الرسمية.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 py-1.5 px-4 text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            <ArrowRight className="h-4 w-4" />
            لوحة التحكم
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-teal-500 py-1.5 px-5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition"
          >
            <Printer className="h-4 w-4" />
            طباعة (Ctrl+P)
          </button>
        </div>
      </div>

      {/* Official A4 Layout Replication */}
      <div className="print-page w-[210mm] h-[297mm] bg-white text-black shadow-xl p-16 flex flex-col justify-between box-sizing-border" dir="rtl">
        <div>
          {/* Top Section: Photo Box & Header Information */}
          <div className="flex justify-between items-start mb-6">
            {/* Header info table style */}
            <div className="text-sm font-semibold space-y-1.5 pt-4 text-right">
              <div>
                <span className="text-slate-600">تاريخ اإلصدار : </span>
                <span>{formatDate(certificate.issueDate)}</span>
              </div>
              <div>
                <span className="text-slate-600">اسم الوحدة: </span>
                <span>{certificate.unitName}</span>
              </div>
              <div>
                <span className="text-slate-600">المحافظة: </span>
                <span>{certificate.governorate}</span>
              </div>
            </div>

            {/* Photo Box Block 4*6 */}
            <div className="flex flex-col items-center">
              <div className="w-[84px] h-[112px] border border-slate-400 flex flex-col items-center justify-center bg-slate-50/20 text-[10px] text-slate-400 font-bold mb-1">
                <span>4*6</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">ختم شعار الجمهورية</span>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-black border-b border-slate-300 pb-1 mb-2.5">البيانات األساسية</h3>
            <div className="grid grid-cols-3 gap-y-2 text-[11px] leading-relaxed">
              <div className="col-span-1">
                <span className="font-bold text-slate-500">االسم : </span>
                <span className="font-bold">{certificate.fullName}</span>
              </div>
              <div className="col-span-1">
                <span className="font-bold text-slate-500">الرقم القومى : </span>
                <span className="font-bold">{certificate.nationalId}</span>
              </div>
              <div className="col-span-1">
                <span className="font-bold text-slate-500">النوع : </span>
                <span>{certificate.gender}</span>
              </div>

              <div className="col-span-1">
                <span className="font-bold text-slate-500">الجنسية : </span>
                <span>{certificate.nationality}</span>
              </div>
              <div className="col-span-1">
                <span className="font-bold text-slate-500">السن : </span>
                <span>{certificate.age}</span>
              </div>
              <div className="col-span-1">
                <span className="font-bold text-slate-500">رقم الهاتف : </span>
                <span>{certificate.phoneNumber}</span>
              </div>

              <div className="col-span-1.5">
                <span className="font-bold text-slate-500">العنوان بالبطاقة : </span>
                <span>{certificate.idAddress}</span>
              </div>
              <div className="col-span-1.5">
                <span className="font-bold text-slate-500">عنوان سكن الزوجية : </span>
                <span>{certificate.maritalAddress || "-"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Medical Examinations */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-black border-b border-slate-300 pb-1 mb-2.5">الفحوصات الطبية</h3>
            <div className="grid grid-cols-3 gap-y-3.5 text-[11px] leading-relaxed">
              <div>
                <span className="font-bold text-slate-500">الطول)سم( : </span>
                <span className="font-bold">{certificate.height}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">الوزن)كجم( : </span>
                <span className="font-bold">{certificate.weight}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">BMI : </span>
                <span className="font-bold">{certificate.bmi}</span>
              </div>

              <div>
                <span className="font-bold text-slate-500">RH : </span>
                <span className="font-bold">{certificate.rh === "+" ? "إيجابي" : "سالب"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">فصيلة الدم : </span>
                <span className="font-bold">{certificate.bloodType}{certificate.rh}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">Hb : </span>
                <span className="font-bold">{certificate.hb}</span>
              </div>

              <div>
                <span className="font-bold text-slate-500">Ag HBs : </span>
                <span>{certificate.hbsAg}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">HIV-Anti : </span>
                <span>{certificate.antiHiv}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">HCV-Anti : </span>
                <span>{certificate.antiHcv}</span>
              </div>

              <div className="col-span-1.5">
                <span className="font-bold text-slate-500">ضغط الدم : </span>
                <span className="font-bold">{certificate.bloodPressure}</span>
              </div>
              <div className="col-span-1.5">
                <span className="font-bold text-slate-500">نتيجة فحص السكر)العشوائى( : </span>
                <span className="font-bold">{certificate.randomBloodSugar}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Hb Electrophoresis */}
          <div className="mb-6">
            <h4 className="text-[11px] font-bold text-black mb-2">Hb Electrophoresis :</h4>
            <div className="grid grid-cols-5 text-center text-[10px] border-t border-b border-slate-200 py-1.5">
              <div>
                <div className="font-bold">A : {certificate.hbA}%</div>
                <div className="text-slate-500 mt-0.5">Normal</div>
              </div>
              <div>
                <div className="font-bold">F : {certificate.hbF}%</div>
                <div className="text-slate-500 mt-0.5">Normal</div>
              </div>
              <div>
                <div className="font-bold">A2 : {certificate.hbA2}%</div>
                <div className="text-slate-500 mt-0.5">Normal</div>
              </div>
              <div>
                <div className="font-bold">C : {certificate.hbC}%</div>
                <div className="text-slate-500 mt-0.5">Normal</div>
              </div>
              <div>
                <div className="font-bold">S : {certificate.hbS}%</div>
                <div className="text-slate-500 mt-0.5">Normal</div>
              </div>
            </div>
          </div>

          {/* Section 4: Declaration Block */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-center text-black mb-3">إقرار المنتفع/المنتفعة بإعالمه بنتيجة الفحص وتوصيات الطبيب</h3>
            
            <div className="flex justify-between items-start gap-4">
              {/* Signatures Columns */}
              <div className="flex-1 grid grid-cols-2 gap-y-3.5 text-[10px]">
                <div>
                  <span className="text-slate-600">اسم الممرض/الممرضة : </span>
                  <span>--------------</span>
                </div>
                <div>
                  <span className="text-slate-600">التوقيع : </span>
                  <span>----------------------</span>
                </div>

                <div>
                  <span className="text-slate-600">اسم الطبيب/الطبيبة : </span>
                  <span>-----------------</span>
                </div>
                <div>
                  <span className="text-slate-600">التوقيع : </span>
                  <span>----------------------</span>
                </div>

                <div>
                  <span className="text-slate-600">مدير الوحدة : </span>
                  <span>-------------------------</span>
                </div>
                <div>
                  <span className="text-slate-600">التوقيع : </span>
                  <span>----------------------</span>
                </div>
              </div>

              {/* Committee Stamp Circle */}
              <div className="flex flex-col items-center justify-center shrink-0 pr-8">
                <div className="w-[72px] h-[72px] rounded-full border border-dashed border-slate-400 flex items-center justify-center text-[9px] text-slate-300 font-bold mb-1">
                  <span>الختم</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">ختم شعار الجمهورية</span>
              </div>
            </div>
          </div>

          {/* Section 5: Individual Consent Text */}
          <div className="mb-6 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-[11px] font-bold mb-2">
              <div>
                <span>أقر أنا الموقع/الموقعه أدناه : </span>
                <span className="underline decoration-slate-300 underline-offset-4">{certificate.fullName}</span>
              </div>
              <div>
                <span>رقم القومى : </span>
                <span className="underline decoration-slate-300 underline-offset-4">{certificate.nationalId}</span>
              </div>
            </div>

            <p className="text-[10px] text-justify leading-relaxed text-slate-700">
              بأنه قد تم إعلامى بنتيجة الفحص الطبى والتوصيات الطبية المذكورة سابقا وقد تلقيت المشورة الخاصة بحالتى الصحية وألتزم بإعلام طرف الزواج األخر قبل إجراءات الزواج وأصبحت بذلك مسئول عما يترتب على ذلك دون أدنى مسئولية على المنشأة الصحية والفريق الطبى الذى يمثلها .
            </p>
          </div>

          {/* Section 6: Thumbprint & Partner Info */}
          <div className="grid grid-cols-3 items-start gap-4 text-[10px] border-t border-slate-200 pt-4">
            {/* Column 1: Examining Person details */}
            <div className="space-y-3">
              <div>
                <span className="text-slate-600">االسم )رباعى( : </span>
                <span>------------------</span>
              </div>
              <div>
                <span className="text-slate-600">التوقيع : </span>
                <span>-----------------------</span>
              </div>
            </div>

            {/* Column 2: Thumbprint Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-[64px] h-[64px] rounded-full border border-slate-400 flex items-center justify-center text-[9px] text-slate-300 font-bold mb-1">
                <span>البصمة</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">بصمة اإلبهام</span>
            </div>

            {/* Column 3: Partner details */}
            <div className="space-y-3">
              <div>
                <span className="text-slate-600">اسم الطرف االخر)رباعى( : </span>
                <span>{certificate.partnerName || "---------------"}</span>
              </div>
              <div>
                <span className="text-slate-600">توقيع الطرف االخر : </span>
                <span>--------------------</span>
              </div>
              <div>
                <span className="text-slate-600">الرقم القومى للطرف االخر : </span>
                <span className="font-mono">{certificate.partnerNationalId || "-------------"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Block: Footer Validity & Verification QR */}
        <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
          {/* Validity statement */}
          <div className="text-[10px] font-bold text-slate-800">
            *هذه الوثيقة صالحة لمدة ستة أشهر من تاريخ اإلصدار
          </div>

          {/* Verification QR block */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-1 border border-slate-200 rounded">
              {currentUrl ? (
                <QRCodeSVG value={currentUrl} size={64} />
              ) : (
                <div className="h-[64px] w-[64px] bg-slate-100 flex items-center justify-center text-[6px] text-slate-400">
                  QR
                </div>
              )}
            </div>
            <span className="mt-1 font-mono font-bold text-[9px] text-slate-900 tracking-wider">
              2026-{certificate.certificateId}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
