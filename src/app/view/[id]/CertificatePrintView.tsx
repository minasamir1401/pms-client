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
      <style jsx global>{`
        body, html {
          font-family: Arial, 'Segoe UI', Tahoma, sans-serif !important;
          color: #000000 !important;
        }

        .print-page {
          width: 210mm;
          height: 297mm;
          padding: 15mm 15mm;
          box-sizing: border-box;
          background-color: #ffffff;
          color: #000000 !important;
          font-size: 15px;
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
            padding: 15mm 15mm !important;
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
            معاينة الشهادة الطبية الرسمية قبل الطباعة. تم استيراد الخطوط والتنسيقات الرسمية بمقاسات دقيقة بالملي.
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
      <div className="print-page bg-white text-black shadow-xl flex flex-col" dir="rtl">
        {/* Top Section: Header Information & Photo Box */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1 grid grid-cols-3 gap-2 pt-6 text-[15px] font-bold text-black">
            <div className="text-right">تاريخ الإصدار : {formatDate(certificate.issueDate)}</div>
            <div className="text-center">اسم الوحدة: {certificate.unitName}</div>
            <div className="text-left pr-4">المحافظة: {certificate.governorate}</div>
          </div>
          
          <div className="flex flex-col items-center mr-8">
            <div className="border border-black flex items-center justify-center text-[16px] text-black font-bold mb-1" style={{ width: '40mm', height: '60mm' }}>
              <span dir="ltr">4*6</span>
            </div>
            <span className="text-[13px] text-black font-bold mt-1">ختم شعار الجمهورية</span>
          </div>
        </div>

        {/* Section 1: Basic Information */}
        <div className="mb-8">
          <h3 className="text-[18px] font-bold text-black mb-6">البيانات الأساسية</h3>
          <div className="grid grid-cols-3 gap-y-6 text-[15px] font-bold text-black">
            <div className="text-right">الاسم : <span className="font-semibold">{certificate.fullName}</span></div>
            <div className="text-center">الرقم القومى : <span className="font-semibold">{certificate.nationalId}</span></div>
            <div className="text-left">النوع : <span className="font-semibold">{certificate.gender}</span></div>
            
            <div className="text-right">الجنسية : <span className="font-semibold">{certificate.nationality}</span></div>
            <div className="text-center">السن : <span className="font-semibold">{certificate.age}</span></div>
            <div className="text-left">رقم الهاتف : <span className="font-semibold">{certificate.phoneNumber}</span></div>
            
            <div className="text-right">العنوان بالبطاقة : <span className="font-semibold">{certificate.idAddress}</span></div>
            <div className="text-center">عنوان سكن الزوجية : <span className="font-semibold">{certificate.maritalAddress || "-"}</span></div>
            <div></div>
          </div>
        </div>

        {/* Section 2: Medical Examinations */}
        <div className="mb-8">
          <h3 className="text-[18px] font-bold text-black mb-6">الفحوصات الطبية</h3>
          <div className="grid grid-cols-3 gap-y-6 text-[15px] font-bold text-black">
            <div className="text-right">الطول(سم): <span className="font-semibold">{certificate.height}</span></div>
            <div className="text-center">الوزن(كجم): <span className="font-semibold">{certificate.weight}</span></div>
            <div className="text-left">BMI: <span className="font-semibold">{certificate.bmi}</span></div>

            <div className="text-right">RH : <span className="font-semibold">{certificate.rh === "+" || certificate.rh === "إيجابي" ? "إيجابي" : certificate.rh === "-" || certificate.rh === "سالب" ? "سالب" : certificate.rh}</span></div>
            <div className="text-center">فصيلة الدم : <span className="font-semibold">{certificate.bloodType}{certificate.rh === "+" ? "+" : certificate.rh === "-" ? "-" : ""}</span></div>
            <div className="text-left">Hb: <span className="font-semibold">{certificate.hb}</span></div>

            <div className="text-right">HBs Ag : <span className="font-semibold">{certificate.hbsAg}</span></div>
            <div className="text-center">Anti-HIV : <span className="font-semibold">{certificate.antiHiv}</span></div>
            <div className="text-left">Anti-HCV : <span className="font-semibold">{certificate.antiHcv}</span></div>

            <div className="text-right">ضغط الدم : <span className="font-semibold">{certificate.bloodPressure}</span></div>
            <div className="text-center">نتيجة فحص السكر(العشوائى) : <span className="font-semibold">{certificate.randomBloodSugar}</span></div>
            <div></div>
          </div>
        </div>

        {/* Section 3: Hb Electrophoresis */}
        <div className="mb-10">
          <h4 className="text-[16px] font-bold text-black mb-6 text-right underline underline-offset-4" dir="ltr">Hb Electrophoresis :</h4>
          <div className="flex justify-between items-center text-center text-[15px] font-bold text-black px-12" dir="ltr">
            <div>
              <div>A : {certificate.hbA} %</div>
              <div className="mt-2">Normal</div>
            </div>
            <div>
              <div>F : {certificate.hbF} %</div>
              <div className="mt-2">Normal</div>
            </div>
            <div>
              <div>A2 : {certificate.hbA2} %</div>
              <div className="mt-2">Normal</div>
            </div>
            <div>
              <div>C : {certificate.hbC} %</div>
              <div className="mt-2">Normal</div>
            </div>
            <div>
              <div>S : {certificate.hbS} %</div>
              <div className="mt-2">Normal</div>
            </div>
          </div>
        </div>

        {/* Section 4: Declaration Block */}
        <div className="mb-10">
          <h3 className="text-[17px] font-bold text-black mb-6 text-right">إقرار المنتفع/المنتفعة بإعلامه بنتيجة الفحص وتوصيات الطبيب</h3>
          
          <div className="flex justify-between items-center text-black">
            <div className="flex-1 grid grid-cols-2 gap-y-6 text-[15px] font-bold">
              <div className="text-right">اسم الممرض/الممرضة : <span className="font-normal text-gray-400">--------------</span></div>
              <div className="text-right pr-16">التوقيع : <span className="font-normal text-gray-400">----------------------</span></div>

              <div className="text-right">اسم الطبيب/الطبيبة : <span className="font-normal text-gray-400">-----------------</span></div>
              <div className="text-right pr-16">التوقيع : <span className="font-normal text-gray-400">----------------------</span></div>

              <div className="text-right">مدير الوحدة : <span className="font-normal text-gray-400">-------------------------</span></div>
              <div className="text-right pr-16">التوقيع : <span className="font-normal text-gray-400">----------------------</span></div>
            </div>

            <div className="flex flex-col items-center ml-16">
              <div className="w-[90px] h-[90px] rounded-full border border-black mb-2"></div>
              <span className="text-[14px] font-bold">ختم شعار الجمهورية</span>
            </div>
          </div>
        </div>

        {/* Section 5: Individual Consent Text */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-[16px] font-bold text-black mb-4">
            <div>أقر أنا الموقع/الموقعه أدناه : <span className="font-bold">{certificate.fullName}</span></div>
            <div className="pl-32">رقم القومى : <span className="font-mono">{certificate.nationalId}</span></div>
          </div>
          <p className="text-[16px] font-bold text-black leading-loose text-justify">
            بأنه قد تم إعلامى بنتيجة الفحص الطبى والتوصيات الطبية المذكورة سابقا وقد تلقيت المشورة الخاصة بحالتى الصحية وألتزم بإعلام طرف الزواج الأخر قبل إجراءات الزواج وأصبحت بذلك مسئول عما يترتب على ذلك دون أدنى مسئولية على المنشأة الصحية والفريق الطبى الذى يمثلها .
          </p>
        </div>

        {/* Section 6: Thumbprint & Partner Info */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center text-[15px] font-bold text-black mt-10 mb-4">
          <div className="flex flex-col space-y-6">
            <div>الاسم (رباعى) : <span className="font-normal text-gray-400">------------------</span></div>
            <div>التوقيع : <span className="font-normal text-gray-400">-----------------------</span></div>
          </div>

          <div className="flex flex-col items-center justify-center border-r-2 border-l-2 border-slate-300 px-12 py-4 h-full">
            <div className="w-[80px] h-[80px] rounded-full border border-black mb-3"></div>
            <span className="text-[15px] font-bold">بصمة الإبهام</span>
          </div>

          <div className="flex flex-col space-y-6 pr-12">
            <div>اسم الطرف الاخر(رباعى) : <span className="font-bold">{certificate.partnerName || "---------------"}</span></div>
            <div>توقيع الطرف الاخر : <span className="font-normal text-gray-400">--------------------</span></div>
            <div>الرقم القومى للطرف الاخر : <span className="font-bold font-mono">{certificate.partnerNationalId || "-------------"}</span></div>
          </div>
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-grow"></div>

        {/* Footer Block */}
        <div className="flex justify-between items-end text-black pt-4 mt-8">
          <div className="text-[14px] font-bold mb-4">
            *هذه الوثيقة صالحة لمدة ستة اشهر من تاريخ الإصدار
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white p-1">
              {currentUrl ? (
                <QRCodeSVG value={currentUrl} size={100} />
              ) : (
                <div className="h-[100px] w-[100px] bg-slate-100 flex items-center justify-center text-[12px] text-slate-400">
                  QR
                </div>
              )}
            </div>
            <span className="mt-1 font-bold text-[14px]">
              {certificate.qrCodeLabel || `2026-${certificate.certificateId}`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
