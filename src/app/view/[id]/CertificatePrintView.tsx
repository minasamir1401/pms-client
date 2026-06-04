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
      {/* Import Standard System Arabic Fonts and Print Settings */}
      <style jsx global>{`
        body, html {
          font-family: 'Simplified Arabic', 'Segoe UI', Tahoma, Arial, sans-serif !important;
          color: #000000 !important;
        }

        .print-page {
          width: 210mm;
          height: 297mm;
          padding: 15mm 20mm;
          box-sizing: border-box;
          background-color: #ffffff;
          color: #000000 !important;
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
            padding: 15mm 20mm !important;
            box-sizing: border-box;
            background-color: #ffffff !important;
            color: #000000 !important;
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
      <div className="print-page bg-white text-black shadow-xl flex flex-col justify-between" dir="rtl">
        <div>
          {/* Top Section: Photo Box & Header Information */}
          <div className="flex justify-between items-center mb-5 pl-2" dir="rtl">
            <div className="flex-1 flex justify-between items-center pl-8 text-xs font-bold text-black">
              <div>
                <span>تاريخ اإلصدار : </span>
                <span>{formatDate(certificate.issueDate)}</span>
              </div>
              <div>
                <span>اسم الوحدة: </span>
                <span>{certificate.unitName}</span>
              </div>
              <div>
                <span>المحافظة: </span>
                <span>{certificate.governorate}</span>
              </div>
            </div>

            {/* Photo Box Block 4*6 */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-[84px] h-[112px] border border-black flex flex-col items-center justify-center text-[10px] text-slate-400 font-bold mb-1">
                <span>4*6</span>
              </div>
              <span className="text-[9px] text-black font-bold">ختم شعار الجمهورية</span>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="mb-5">
            <h3 className="text-[14px] font-bold text-black mb-3">البيانات األساسية</h3>
            <div className="grid grid-cols-3 gap-y-2.5 text-[12px] leading-relaxed text-black">
              <div className="flex items-center">
                <span className="font-normal">االسم : </span>
                <span className="font-bold mr-1">{certificate.fullName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">الرقم القومى : </span>
                <span className="font-bold mr-1">{certificate.nationalId}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">النوع : </span>
                <span className="font-bold mr-1">{certificate.gender}</span>
              </div>

              <div className="flex items-center">
                <span className="font-normal">الجنسية : </span>
                <span className="font-bold mr-1">{certificate.nationality}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">السن : </span>
                <span className="font-bold mr-1">{certificate.age}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">رقم الهاتف : </span>
                <span className="font-bold mr-1">{certificate.phoneNumber}</span>
              </div>

              <div className="flex items-center">
                <span className="font-normal">العنوان بالبطاقة : </span>
                <span className="font-bold mr-1">{certificate.idAddress}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">عنوان سكن الزوجية : </span>
                <span className="font-bold mr-1">{certificate.maritalAddress || "-"}</span>
              </div>
              <div></div>
            </div>
          </div>

          {/* Section 2: Medical Examinations */}
          <div className="mb-5">
            <h3 className="text-[14px] font-bold text-black mb-3">الفحوصات الطبية</h3>
            <div className="grid grid-cols-3 gap-y-3 text-[12px] leading-relaxed text-black">
              <div className="flex items-center">
                <span className="font-normal">الطول(سم) : </span>
                <span className="font-bold mr-1">{certificate.height}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">الوزن(كجم) : </span>
                <span className="font-bold mr-1">{certificate.weight}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">BMI : </span>
                <span className="font-bold mr-1">{certificate.bmi}</span>
              </div>

              <div className="flex items-center">
                <span className="font-normal">RH : </span>
                <span className="font-bold mr-1">{certificate.rh === "+" || certificate.rh === "إيجابي" ? "إيجابي" : certificate.rh === "-" || certificate.rh === "سالب" ? "سالب" : certificate.rh}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">فصيلة الدم : </span>
                <span className="font-bold mr-1">{certificate.bloodType}{certificate.rh === "+" ? "+" : certificate.rh === "-" ? "-" : ""}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">Hb : </span>
                <span className="font-bold mr-1">{certificate.hb}</span>
              </div>

              <div className="flex items-center">
                <span className="font-normal">HBs Ag : </span>
                <span className="font-bold mr-1">{certificate.hbsAg}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">Anti-HIV : </span>
                <span className="font-bold mr-1">{certificate.antiHiv}</span>
              </div>
              <div className="flex items-center">
                <span className="font-normal">Anti-HCV : </span>
                <span className="font-bold mr-1">{certificate.antiHcv}</span>
              </div>

              <div className="flex items-center">
                <span className="font-normal">ضغط الدم : </span>
                <span className="font-bold mr-1">{certificate.bloodPressure}</span>
              </div>
              <div className="flex items-center col-span-2">
                <span className="font-normal">نتيجة فحص السكر(العشوائى) : </span>
                <span className="font-bold mr-1">{certificate.randomBloodSugar}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Hb Electrophoresis */}
          <div className="mb-5 text-left" dir="ltr">
            <h4 className="text-[12px] font-bold text-black mb-3 inline-block border-b border-black pb-0.5">Hb Electrophoresis :</h4>
            <div className="grid grid-cols-5 text-center text-[12px] text-black font-bold">
              <div>
                <div>A : {certificate.hbA}%</div>
                <div className="font-bold mt-1 text-black">Normal</div>
              </div>
              <div>
                <div>F : {certificate.hbF}%</div>
                <div className="font-bold mt-1 text-black">Normal</div>
              </div>
              <div>
                <div>A2 : {certificate.hbA2}%</div>
                <div className="font-bold mt-1 text-black">Normal</div>
              </div>
              <div>
                <div>C : {certificate.hbC}%</div>
                <div className="font-bold mt-1 text-black">Normal</div>
              </div>
              <div>
                <div>S : {certificate.hbS}%</div>
                <div className="font-bold mt-1 text-black">Normal</div>
              </div>
            </div>
          </div>

          {/* Section 4: Declaration Block */}
          <div className="mb-5">
            <h3 className="text-[13px] font-bold text-center text-black mb-3">إقرار المنتفع/المنتفعة بإعلامه بنتيجة الفحص وتوصيات الطبيب</h3>
            
            <div className="flex justify-between items-center gap-4 text-black">
              {/* Signatures Columns */}
              <div className="flex-1 grid grid-cols-2 gap-y-3 text-[12px] font-normal">
                <div className="flex items-center">
                  <span>اسم الممرض/الممرضة : </span>
                  <span className="mr-1">--------------</span>
                </div>
                <div className="flex items-center">
                  <span>التوقيع : </span>
                  <span className="mr-1">----------------------</span>
                </div>

                <div className="flex items-center">
                  <span>اسم الطبيب/الطبيبة : </span>
                  <span className="mr-1">-----------------</span>
                </div>
                <div className="flex items-center">
                  <span>التوقيع : </span>
                  <span className="mr-1">----------------------</span>
                </div>

                <div className="flex items-center">
                  <span>مدير الوحدة : </span>
                  <span className="mr-1">-------------------------</span>
                </div>
                <div className="flex items-center">
                  <span>التوقيع : </span>
                  <span className="mr-1">----------------------</span>
                </div>
              </div>

              {/* Committee Stamp Circle */}
              <div className="flex flex-col items-center justify-center shrink-0 pl-12">
                <div className="w-[72px] h-[72px] rounded-full border border-black flex items-center justify-center mb-1">
                  {/* Empty inside */}
                </div>
                <span className="text-[10px] font-bold">ختم شعار الجمهورية</span>
              </div>
            </div>
          </div>

          {/* Section 5: Individual Consent Text */}
          <div className="mb-5 border-t border-slate-200 pt-4 text-black">
            <div className="flex justify-between text-[12px] font-bold mb-3">
              <div>
                <span>أقر أنا الموقع/الموقعه أدناه : </span>
                <span>{certificate.fullName}</span>
              </div>
              <div className="pl-12">
                <span>رقم القومى : </span>
                <span className="font-mono">{certificate.nationalId}</span>
              </div>
            </div>

            <p className="text-[11px] text-justify leading-relaxed font-bold">
              بأنه قد تم إعلامى بنتيجة الفحص الطبى والتوصيات الطبية المذكورة سابقا وقد تلقيت المشورة الخاصة بحالتى الصحية وألتزم بإعلام طرف الزواج األخر قبل إجراءات الزواج وأصبحت بذلك مسئول عما يترتب على ذلك دون أدنى مسئولية على المنشأة الصحية والفريق الطبى الذى يمثلها .
            </p>
          </div>

          {/* Section 6: Thumbprint & Partner Info */}
          <div className="grid grid-cols-3 items-stretch gap-4 text-[12px] font-normal text-black border-t border-slate-200 pt-4">
            {/* Column 1: Examining Person details */}
            <div className="flex flex-col justify-between py-2 space-y-4">
              <div className="flex items-center">
                <span>الاسم (رباعى) : </span>
                <span className="mr-1">------------------</span>
              </div>
              <div className="flex items-center">
                <span>التوقيع : </span>
                <span className="mr-1">-----------------------</span>
              </div>
            </div>

            {/* Column 2: Thumbprint Circle */}
            <div className="flex flex-col items-center justify-center border-r border-l border-slate-300 px-4 py-1">
              <div className="w-[64px] h-[64px] rounded-full border border-black flex items-center justify-center mb-1">
                {/* Empty inside */}
              </div>
              <span className="text-[10px] font-bold">بصمة اإلبهام</span>
            </div>

            {/* Column 3: Partner details */}
            <div className="flex flex-col justify-between py-2 space-y-3">
              <div className="flex items-center">
                <span>اسم الطرف الاخر (رباعى) : </span>
                <span className="font-bold mr-1">{certificate.partnerName || "---------------"}</span>
              </div>
              <div className="flex items-center">
                <span>توقيع الطرف االخر : </span>
                <span className="mr-1">--------------------</span>
              </div>
              <div className="flex items-center">
                <span>الرقم القومى للطرف االخر : </span>
                <span className="font-bold font-mono mr-1">{certificate.partnerNationalId || "-------------"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Block: Footer Validity & Verification QR */}
        <div className="border-t border-slate-200 pt-4 flex justify-between items-end text-black">
          {/* Validity statement */}
          <div className="text-[11px] font-bold pb-2">
            *هذه الوثيقة صالحة لمدة ستة أشهر من تاريخ اإلصدار
          </div>

          {/* Verification QR block */}
          <div className="flex flex-col items-center pl-8">
            <div className="bg-white">
              {currentUrl ? (
                <QRCodeSVG value={currentUrl} size={64} />
              ) : (
                <div className="h-[64px] w-[64px] bg-slate-100 flex items-center justify-center text-[6px] text-slate-400">
                  QR
                </div>
              )}
            </div>
            <span className="mt-1 font-mono font-bold text-[10px] tracking-wider">
              {certificate.qrCodeLabel || `2026-${certificate.certificateId}`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
