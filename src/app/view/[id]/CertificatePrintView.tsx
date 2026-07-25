"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer, ArrowRight, CheckCircle, Save, RotateCcw, ArrowRightLeft } from "lucide-react";
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

interface CertificatePrintViewProps {
  certificate: Certificate;
}

export default function CertificatePrintView({ certificate }: CertificatePrintViewProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [editedCert, setEditedCert] = useState(certificate);
  const [isEditingText, setIsEditingText] = useState(false);
  const [fontSize, setFontSize] = useState(12.5);
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState(700);
  const [paddingX, setPaddingX] = useState(12);
  const [paddingY, setPaddingY] = useState(6);
  const [qrSize, setQrSize] = useState(45);
  const [sectionGap, setSectionGap] = useState(3);
  const [gridGap, setGridGap] = useState(2);
  const [titleWidth, setTitleWidth] = useState(350);
  const [titleHeight, setTitleHeight] = useState(45);
  const [titleFontSize, setTitleFontSize] = useState(24);
  const [titleY, setTitleY] = useState(0);
  const [titleX, setTitleX] = useState(0);
  const [titleText, setTitleText] = useState("شهادة صحية لراغبي الزواج");

  // Layout states for Swapping
  const [section1Layout, setSection1Layout] = useState([
    "fullName", "nationalId", "gender",
    "nationality", "age", "phoneNumber",
    "idAddress", "maritalAddress", "empty1"
  ]);
  const [section2Layout, setSection2Layout] = useState([
    "height", "weight", "bmi",
    "rh", "bloodType", "hb",
    "hbsAg", "antiHiv", "antiHcv",
    "bloodPressure", "randomBloodSugar", "empty2"
  ]);
  const [swapSourceId, setSwapSourceId] = useState<string | null>(null);

  const handleSwap = (id: string) => {
    if (!isEditingText) return;
    if (swapSourceId === null) {
      setSwapSourceId(id);
    } else {
      if (swapSourceId !== id) {
        let s1 = [...section1Layout];
        let s2 = [...section2Layout];

        const idx1InS1 = s1.indexOf(swapSourceId);
        const idx1InS2 = s2.indexOf(swapSourceId);
        const idx2InS1 = s1.indexOf(id);
        const idx2InS2 = s2.indexOf(id);

        if (idx1InS1 !== -1 && idx2InS1 !== -1) {
          s1[idx1InS1] = id;
          s1[idx2InS1] = swapSourceId;
          setSection1Layout(s1);
        } else if (idx1InS2 !== -1 && idx2InS2 !== -1) {
          s2[idx1InS2] = id;
          s2[idx2InS2] = swapSourceId;
          setSection2Layout(s2);
        } else if (idx1InS1 !== -1 && idx2InS2 !== -1) {
          s1[idx1InS1] = id;
          s2[idx2InS2] = swapSourceId;
          setSection1Layout(s1);
          setSection2Layout(s2);
        } else if (idx1InS2 !== -1 && idx2InS1 !== -1) {
          s2[idx1InS2] = id;
          s1[idx2InS1] = swapSourceId;
          setSection2Layout(s2);
          setSection1Layout(s1);
        }
      }
      setSwapSourceId(null);
    }
  };

  // Persistence status
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  const [consentText, setConsentText] = useState(
    "بأنه قد تم إعلامى بنتيجة الفحص الطبى والتوصيات الطبية المذكورة سابقا وقد تلقيت المشورة الخاصة بحالتى الصحية وألتزم بإعلام طرف الزواج الأخر قبل إجراءات الزواج وأصبحت بذلك مسئول عما يترتب على ذلك دون أدنى مسئولية على المنشأة الصحية والفريق الطبى الذى يمثلها ."
  );
  const [hotlineText, setHotlineText] = useState(
    "للاستشارات والدعم النفسي يرجى التواصل على الخط الساخن 16328 أو زيارة الموقع الإلكتروني https://mentalhealth.mohp.gov.eg"
  );
  const [validityText, setValidityText] = useState(
    "*هذه الوثيقة صالحة لمدة ستة اشهر من تاريخ الإصدار"
  );

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
      if (!dateStr) return "";
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        return `${match[3]}-${match[2]}-${match[1]}`;
      }
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_URL}/api/certificates/${editedCert.certificateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...editedCert,
          age: parseInt(editedCert.age as any, 10),
          height: parseFloat(editedCert.height as any),
          weight: parseFloat(editedCert.weight as any),
          randomBloodSugar: parseFloat(editedCert.randomBloodSugar as any),
          bmi: parseFloat(editedCert.bmi as any) || 0,
          hb: parseFloat(editedCert.hb as any),
          hbA: parseFloat(editedCert.hbA as any) || 0,
          hbF: parseFloat(editedCert.hbF as any) || 0,
          hbA2: parseFloat(editedCert.hbA2 as any) || 0,
          hbC: parseFloat(editedCert.hbC as any) || 0,
          hbS: parseFloat(editedCert.hbS as any) || 0,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({ type: "success", text: "تم حفظ التعديلات في قاعدة البيانات بنجاح!" });
      } else {
        setSaveMessage({ type: "error", text: data.error || "حدث خطأ أثناء حفظ التعديلات" });
      }
    } catch (err) {
      setSaveMessage({ type: "error", text: "تعذر الاتصال بالخادم، يرجى التحقق من الشبكة" });
    } finally {
      setSaveLoading(false);
    }
  };

  const renderEditableField = (
    key: keyof Certificate,
    type: "text" | "number" = "text",
    className = "font-semibold",
    widthClass = "w-full max-w-[140px]"
  ) => {
    const val = editedCert[key];
    if (!isEditingText) {
      return <span className={className}>{val !== null ? val : "-"}</span>;
    }

    return (
      <input
        type={type}
        value={val !== null ? val : ""}
        onChange={(e) => {
          let value: any = e.target.value;
          if (type === "number") {
            value = e.target.value === "" ? 0 : parseFloat(e.target.value);
            if (isNaN(value)) value = 0;
          }
          setEditedCert({ ...editedCert, [key]: value });
        }}
        className={`bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-semibold text-center focus:outline-none focus:bg-white text-[12px] inline-block ${widthClass}`}
        dir="rtl"
      />
    );
  };

  const renderLabel = (defaultText: string) => {
    return (
      <span
        contentEditable={isEditingText}
        suppressContentEditableWarning
        className={`field-label ${isEditingText ? "border-b border-dashed border-teal-300 outline-none inline-block whitespace-pre" : ""}`}
      >
        {defaultText}
      </span>
    );
  };

  const renderSwapButton = (fieldId: string) => {
    if (!isEditingText) return null;
    const isSelected = swapSourceId === fieldId;
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSwap(fieldId);
        }}
        className={`ml-1 p-0.5 rounded transition-colors print:hidden ${isSelected ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
        title="انقر هنا ثم انقر على حقل آخر للتبديل"
      >
        <ArrowRightLeft className="w-3 h-3" />
      </button>
    );
  };

  const renderSection1Field = (fieldId: string, index: number) => {
    const colIndex = index % 3;
    let containerClass = "text-right flex items-center gap-1";
    let containerStyle: React.CSSProperties = {};

    const isSwapSource = swapSourceId === fieldId;
    const activeSwapClasses = isSwapSource ? "ring-2 ring-teal-400 bg-teal-50 rounded print:ring-0 print:bg-transparent" : "";

    if (fieldId === "age" || fieldId === "nationalId" || fieldId === "maritalAddress") {
      containerStyle.position = 'relative';
      containerStyle.right = '20px';
    }

    const wrapperProps = {
      className: `${containerClass} ${activeSwapClasses}`,
      style: containerStyle,
    };

    switch (fieldId) {
      case "fullName":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("الاسم : ")}
            {renderEditableField("fullName", "text", "font-semibold", "w-40")}
          </div>
        );
      case "nationalId":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("الرقم القومى : ")}
            {renderEditableField("nationalId", "text", "font-semibold", "w-36")}
          </div>
        );
      case "gender":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("النوع : ")}
            {renderEditableField("gender", "text", "font-semibold", "w-20")}
          </div>
        );
      case "nationality":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("الجنسية : ")}
            {renderEditableField("nationality", "text", "font-semibold", "w-28")}
          </div>
        );
      case "age":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("السن : ")}
            {renderEditableField("age", "number", "font-semibold", "w-16")}
          </div>
        );
      case "phoneNumber":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("رقم الهاتف : ")}
            {renderEditableField("phoneNumber", "text", "font-semibold", "w-32")}
          </div>
        );
      case "idAddress":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("العنوان بالبطاقة : ")}
            {renderEditableField("idAddress", "text", "font-semibold", "w-44")}
          </div>
        );
      case "maritalAddress":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("عنوان سكن الزوجية : ")}
            {renderEditableField("maritalAddress", "text", "font-semibold", "w-44")}
          </div>
        );
      case "empty1":
        return <div key={fieldId} {...wrapperProps}></div>;
      default:
        return null;
    }
  };

  const renderSection2Field = (fieldId: string, index: number) => {
    const colIndex = index % 3;
    let containerClass = "text-right flex items-center gap-1";
    let containerStyle: React.CSSProperties = {};
    let dir: "rtl" | "ltr" | undefined = undefined;

    const isSwapSource = swapSourceId === fieldId;
    const activeSwapClasses = isSwapSource ? "ring-2 ring-teal-400 bg-teal-50 rounded print:ring-0 print:bg-transparent" : "";

    const wrapperProps = {
      className: `${containerClass} ${activeSwapClasses}`,
      style: containerStyle,
      dir,
    };

    switch (fieldId) {
      case "height":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("الطول(سم): ")}
            {renderEditableField("height", "number", "font-semibold", "w-16")}
          </div>
        );
      case "weight":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("الوزن(كجم): ")}
            {renderEditableField("weight", "number", "font-semibold", "w-16")}
          </div>
        );
      case "bmi":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("BMI : ")}
            {isEditingText ? (
              <input
                type="number"
                step="0.1"
                value={editedCert.bmi}
                onChange={(e) => setEditedCert({ ...editedCert, bmi: parseFloat(e.target.value) || 0 })}
                className="bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-semibold text-center focus:outline-none focus:bg-white text-[12px] w-16"
              />
            ) : (
              <span className="font-semibold">{editedCert.bmi}</span>
            )}
          </div>
        );
      case "rh":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("RH : ")}
            {isEditingText ? (
              renderEditableField("rh", "text", "font-bold", "w-16")
            ) : (
              <span className="font-bold">
                {editedCert.rh === "+" || editedCert.rh === "إيجابي" ? "إيجابي" : editedCert.rh === "-" || editedCert.rh === "سالب" ? "سالب" : editedCert.rh}
              </span>
            )}
          </div>
        );
      case "bloodType":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("فصيلة الدم : ")}
            {isEditingText ? (
              <>
                {renderEditableField("bloodType", "text", "font-bold", "w-12")}
                {renderEditableField("rh", "text", "font-bold", "w-12")}
              </>
            ) : (
              <span className="font-bold">
                {editedCert.bloodType}
                {editedCert.rh === "+" ? "+" : editedCert.rh === "-" ? "-" : ""}
              </span>
            )}
          </div>
        );
      case "hb":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("Hb : ")}
            {renderEditableField("hb", "number", "font-semibold", "w-16")}
          </div>
        );
      case "hbsAg":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("HBs Ag : ")}
            {renderEditableField("hbsAg", "text", "font-semibold", "w-24")}
          </div>
        );
      case "antiHiv":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("Anti-HIV : ")}
            {renderEditableField("antiHiv", "text", "font-semibold", "w-24")}
          </div>
        );
      case "antiHcv":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("Anti-HCV : ")}
            {renderEditableField("antiHcv", "text", "font-semibold", "w-24")}
          </div>
        );
      case "bloodPressure":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("ضغط الدم : ")}
            {renderEditableField("bloodPressure", "text", "font-semibold", "w-24")}
          </div>
        );
      case "randomBloodSugar":
        return (
          <div key={fieldId} {...wrapperProps}>
            {renderSwapButton(fieldId)}
            {renderLabel("نتيجة فحص السكر(العشوائى) : ")}
            {renderEditableField("randomBloodSugar", "number", "font-semibold", "w-16")}
          </div>
        );
      case "empty2":
        return <div key={fieldId} {...wrapperProps}></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col lg:flex-row print:bg-white print:text-black print:p-0 print:m-0 w-full">
      <style jsx global>{`
        body, html {
          font-family: Arial, 'Segoe UI', Tahoma, sans-serif !important;
          color: #000000 !important;
        }

        .print-page {
          width: 210mm;
          height: 295mm; /* slightly less than 297mm to prevent overflow */
          padding: ${paddingY}mm ${paddingX}mm;
          box-sizing: border-box;
          background-color: #ffffff;
          color: #000000 !important;
          font-size: ${fontSize}px !important;
          line-height: ${lineHeight} !important;
          letter-spacing: ${letterSpacing}px !important;
          overflow: hidden;
        }

        /* Override Tailwind classes inside the printed certificate for dynamic font size and weight scaling */
        .print-page, 
        .print-page span:not(.text-gray-400):not(.field-label), 
        .print-page p:not(.field-label), 
        .print-page div:not(.text-gray-400):not(.field-label), 
        .print-page h3, 
        .print-page h4,
        .print-page input,
        .print-page select,
        .print-page textarea {
          font-weight: ${fontWeight} !important;
          letter-spacing: ${letterSpacing}px !important;
        }

        .print-page .field-label {
          font-weight: 400 !important;
          font-size: calc(${fontSize}px * 0.88) !important;
          color: #000000 !important;
        }

        .print-page {
          font-size: ${fontSize}px !important;
        }

        .print-page .text-\[14\.5px\] {
          font-size: ${fontSize * 1.16}px !important;
        }
        .print-page .text-\[14px\] {
          font-size: ${fontSize * 1.12}px !important;
        }
        .print-page .text-\[12\.5px\] {
          font-size: ${fontSize}px !important;
        }
        .print-page .text-\[12px\] {
          font-size: ${fontSize * 0.96}px !important;
        }
        .print-page .text-\[11\.5px\] {
          font-size: ${fontSize * 0.92}px !important;
        }
        .print-page .text-\[11px\] {
          font-size: ${fontSize * 0.88}px !important;
        }
        .print-page .text-\[10px\] {
          font-size: ${fontSize * 0.80}px !important;
        }
        .print-page .text-\[9\.5px\] {
          font-size: ${fontSize * 0.76}px !important;
        }

        .print-page .section-block {
          margin-bottom: ${sectionGap}px !important;
        }

        .print-page .grid-gap-dynamic {
          row-gap: ${gridGap}px !important;
          column-gap: 8px !important;
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
            overflow: hidden !important;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: ${paddingY}mm ${paddingX}mm !important;
            box-sizing: border-box;
            background-color: #ffffff !important;
            color: #000000 !important;
            height: 297mm;
            max-height: 297mm;
            overflow: hidden;
            page-break-after: avoid;
            page-break-before: avoid;
          }
        }
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>

      {/* Control Panel Sidebar (Hidden during print) */}
      <div className="no-print w-full lg:w-80 bg-slate-900 text-slate-100 border-b lg:border-r border-slate-800 p-6 flex flex-col gap-5 shrink-0 select-none font-sans" dir="rtl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg">⚙️</span>
            لوحة تحكم الطباعة
          </h2>
          <p className="text-xs text-slate-400">تحكم كامل في مظهر ومحتوى الشهادة قبل الطباعة</p>
        </div>

        <hr className="border-slate-800" />

        {/* Text Editing Toggle */}
        <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-lg border border-slate-800/80">
          <span className="text-xs font-semibold text-slate-300">تعديل نصوص الشهادة</span>
          <button
            onClick={() => setIsEditingText(!isEditingText)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${isEditingText ? "bg-teal-500" : "bg-slate-700"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isEditingText ? "-translate-x-6" : "-translate-x-1"
                }`}
            />
          </button>
        </div>

        <hr className="border-slate-800" />

        {/* Persistence Messages */}
        {saveMessage.text && (
          <div className={`text-xs p-3 rounded-lg border ${saveMessage.type === "success"
              ? "bg-teal-950/40 border-teal-800 text-teal-400"
              : "bg-red-950/40 border-red-900 text-red-400"
            }`}>
            {saveMessage.text}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="w-full py-2 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-xs font-bold text-slate-950 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {saveLoading ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            حفظ التعديلات في قاعدة البيانات
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFontSize(12.5);
              setLineHeight(1.2);
              setLetterSpacing(0);
              setFontWeight(700);
              setPaddingX(12);
              setPaddingY(6);
              setQrSize(45);
              setSectionGap(3);
              setGridGap(2);
              setTitleWidth(350);
              setTitleHeight(45);
              setTitleFontSize(24);
              setTitleY(0);
              setTitleX(0);
              setTitleText("شهادة صحية لراغبي الزواج");
              setIsEditingText(false);
              setEditedCert(certificate);
              setSection1Layout([
                "fullName", "nationalId", "gender",
                "nationality", "age", "phoneNumber",
                "idAddress", "maritalAddress", "empty1"
              ]);
              setSection2Layout([
                "height", "weight", "bmi",
                "rh", "bloodType", "hb",
                "hbsAg", "antiHiv", "antiHcv",
                "bloodPressure", "randomBloodSugar", "empty2"
              ]);
              setSwapSourceId(null);
              setConsentText("بأنه قد تم إعلامى بنتيجة الفحص الطبى والتوصيات الطبية المذكورة سابقا وقد تلقيت المشورة الخاصة بحالتى الصحية وألتزم بإعلام طرف الزواج الأخر قبل إجراءات الزواج وأصبحت بذلك مسئول عما يترتب على ذلك دون أدنى مسئولية على المنشأة الصحية والفريق الطبى الذى يمثلها .");
              setHotlineText("للاستشارات والدعم النفسي يرجى التواصل على الخط الساخن 16328 أو زيارة الموقع الإلكتروني https://mentalhealth.mohp.gov.eg");
              setValidityText("*هذه الوثيقة صالحة لمدة ستة اشهر من تاريخ الإصدار");
              setSaveMessage({ type: "", text: "" });
            }}
            className="w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            إعادة ضبط القيم الافتراضية
          </button>
        </div>

        <hr className="border-slate-800" />

        {/* Sliders */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[50vh] pr-1 mt-auto">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">أبعاد وحجم الخطوط</h3>

          {/* Font Size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">حجم الخط الرئيسي</span>
              <span className="text-teal-400 font-mono">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="18"
              step="0.5"
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Font Weight */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">سماكة الخط (Bold)</span>
              <span className="text-teal-400 font-mono">{fontWeight}</span>
            </div>
            <input
              type="range"
              min="400"
              max="900"
              step="100"
              value={fontWeight}
              onChange={(e) => setFontWeight(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Letter Spacing */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">تباعد الأحرف</span>
              <span className="text-teal-400 font-mono">{letterSpacing}px</span>
            </div>
            <input
              type="range"
              min="-2"
              max="5"
              step="0.1"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Line Height */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">المسافة بين السطور</span>
              <span className="text-teal-400 font-mono">{lineHeight}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.05"
              value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Padding Y */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">الهامش العلوي والسفلي</span>
              <span className="text-teal-400 font-mono">{paddingY}mm</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={paddingY}
              onChange={(e) => setPaddingY(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Padding X */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">الهامش الجانبي (يمين/يسار)</span>
              <span className="text-teal-400 font-mono">{paddingX}mm</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={paddingX}
              onChange={(e) => setPaddingX(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Section Gap (تباعد الأقسام) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">تباعد الأقسام الرئيسية</span>
              <span className="text-teal-400 font-mono">{sectionGap}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={sectionGap}
              onChange={(e) => setSectionGap(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Grid Gap (تباعد السطور في الجداول) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">تباعد السطور في الجداول</span>
              <span className="text-teal-400 font-mono">{gridGap}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={gridGap}
              onChange={(e) => setGridGap(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* QR Size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">حجم الباركود (QR Code)</span>
              <span className="text-teal-400 font-mono">{qrSize}px</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={qrSize}
              onChange={(e) => setQrSize(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-2">عنوان الشهادة</h3>

          {/* Title Width */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">عرض العنوان</span>
              <span className="text-teal-400 font-mono">{titleWidth}px</span>
            </div>
            <input
              type="range"
              min="150"
              max="600"
              step="5"
              value={titleWidth}
              onChange={(e) => setTitleWidth(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Title Height */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">ارتفاع العنوان</span>
              <span className="text-teal-400 font-mono">{titleHeight}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="2"
              value={titleHeight}
              onChange={(e) => setTitleHeight(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Title Font Size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">حجم خط العنوان</span>
              <span className="text-teal-400 font-mono">{titleFontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              step="1"
              value={titleFontSize}
              onChange={(e) => setTitleFontSize(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Title Vertical Offset */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">موقع العنوان (أعلى/أسفل)</span>
              <span className="text-teal-400 font-mono">{titleY}px</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={titleY}
              onChange={(e) => setTitleY(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          {/* Title Horizontal Offset */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">موقع العنوان (يمين/يسار)</span>
              <span className="text-teal-400 font-mono">{titleX}px</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={titleX}
              onChange={(e) => setTitleX(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>
        </div>

        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-grow flex flex-col items-center py-6 px-4 overflow-auto print:p-0 print:m-0 print:block">
        {/* Admin Action Bar (Hidden during print) */}
        <div className="no-print w-full max-w-[210mm] mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-400" />
            <span className="text-xs font-semibold">
              معاينة الشهادة الطبية الرسمية قبل الطباعة. استخدم اللوحة الجانبية للتحكم الكامل.
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
        <div
          className="print-page bg-white text-black shadow-xl flex flex-col"
          dir="rtl"
          onClick={() => { if (!isEditingText) setIsEditingText(true); }}
          title={!isEditingText ? "انقر للبدء في التعديل" : undefined}
          style={{ cursor: isEditingText ? "default" : "text" }}
        >
          {/* Topmost Row: Photo Box */}
          <div className="flex justify-between items-center section-block mt-0.5 relative">
            <div></div>
            {/* Center: Certificate Title */}
            <div 
              className="absolute left-1/2"
              style={{
                top: `${titleY}px`,
                transform: `translateX(calc(-50% + ${titleX}px))`
              }}
            >
              <div 
                className={`border border-black rounded-[4px] text-black font-bold flex items-center justify-center leading-none ${isEditingText ? 'border-dashed border-teal-500 bg-teal-50/20' : ''}`}
                style={{
                  width: `${titleWidth}px`,
                  height: `${titleHeight}px`,
                  fontSize: `${titleFontSize}px`
                }}
              >
                {isEditingText ? (
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="bg-transparent text-center focus:outline-none w-full"
                    dir="rtl"
                  />
                ) : (
                  titleText
                )}
              </div>
            </div>
            {/* Left: Photo Box */}
            <div className="flex flex-col items-center ml-[60px]">
              <div className="border border-black flex items-center justify-center text-[12px] text-black font-bold mb-0.5" style={{ width: '19mm', height: '24mm' }}>
                <span dir="ltr">4*6</span>
              </div>
              <span className="text-[11.5px] text-black font-bold">ختم شعار الجمهورية</span>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="section-block">
            <div className="grid grid-cols-3 gap-2 text-[12px] font-bold text-black max-w-[90%] mx-auto mb-2 mt-1">
              <div className="text-right flex items-center gap-1">
                {renderLabel("تاريخ الإصدار : ")}
                {isEditingText ? (
                  <input
                    type="text"
                    value={editedCert.issueDate}
                    onChange={(e) => setEditedCert({ ...editedCert, issueDate: e.target.value })}
                    className="bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-bold text-center focus:outline-none focus:bg-white text-[12px] w-24"
                  />
                ) : (
                  <span>{formatDate(editedCert.issueDate)}</span>
                )}
              </div>
              <div className="text-center flex items-center justify-center gap-1" style={{ position: 'relative', left: '90px' }}>
                {renderLabel("اسم الوحدة: ")}
                {renderEditableField("unitName", "text", "font-bold", "w-32")}
              </div>
              <div className="text-left flex items-center justify-end gap-1" style={{ position: 'relative', left: '200px' }}>
                {renderLabel("المحافظة: ")}
                {renderEditableField("governorate", "text", "font-bold", "w-28")}
              </div>
            </div>
            <h3
              className={`text-[14.5px] font-bold text-black mb-0 pr-[5%] ${isEditingText ? 'outline-none border-b border-dashed border-teal-300 inline-block' : ''}`}
              contentEditable={isEditingText} suppressContentEditableWarning
            >
              البيانات الأساسية
            </h3>
            <div className="grid grid-cols-3 grid-gap-dynamic text-[12.5px] font-bold text-black max-w-[90%] mx-auto">
              {section1Layout.map((fieldId, index) => renderSection1Field(fieldId, index))}
            </div>
          </div>

          {/* Section 2: Medical Examinations */}
          <div className="section-block">
            <h3
              className={`text-[14.5px] font-bold text-black mb-0 pr-[5%] ${isEditingText ? 'outline-none border-b border-dashed border-teal-300 inline-block' : ''}`}
              contentEditable={isEditingText} suppressContentEditableWarning
            >
              الفحوصات الطبية
            </h3>
            <div className="grid grid-cols-3 grid-gap-dynamic text-[12.5px] font-bold text-black max-w-[90%] mx-auto">
              {section2Layout.map((fieldId, index) => renderSection2Field(fieldId, index))}
            </div>
          </div>

          {/* Section 3: Hb Electrophoresis */}
          <div className="section-block">
            <h4
              className={`text-[12.5px] font-bold text-black mb-0 text-left underline underline-offset-2 pl-[7.5%] ${isEditingText ? 'outline-none border-b border-dashed border-teal-300 inline-block' : ''}`}
              dir="ltr"
              style={{ position: 'relative', left: '-75px' }}
              contentEditable={isEditingText} suppressContentEditableWarning
            >
              Hb Electrophoresis :
            </h4>
            <div className="flex justify-between items-center text-center text-[12px] font-bold text-black max-w-[85%] mx-auto pl-[50px] pr-[28px]" dir="ltr">
              <div>
                <div className="flex items-center justify-center gap-1">
                  {renderLabel("A : ")}
                  {renderEditableField("hbA", "number", "font-semibold", "w-12")}
                  {renderLabel(" %")}
                </div>
                <div className="mt-0.5">
                  {renderLabel("Normal")}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  {renderLabel("F : ")}
                  {renderEditableField("hbF", "number", "font-semibold", "w-12")}
                  {renderLabel(" %")}
                </div>
                <div className="mt-0.5">{renderLabel("Normal")}</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  {renderLabel("A2 : ")}
                  {renderEditableField("hbA2", "number", "font-semibold", "w-12")}
                  {renderLabel(" %")}
                </div>
                <div className="mt-0.5">{renderLabel("Normal")}</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  {renderLabel("C : ")}
                  {renderEditableField("hbC", "number", "font-semibold", "w-12")}
                  {renderLabel(" %")}
                </div>
                <div className="mt-0.5">{renderLabel("Normal")}</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  {renderLabel("S : ")}
                  {renderEditableField("hbS", "number", "font-semibold", "w-12")}
                  {renderLabel(" %")}
                </div>
                <div className="mt-0.5">{renderLabel("Normal")}</div>
              </div>
            </div>
          </div>

          {/* Section 4: Declaration Block */}
          <div className="section-block">
            <h3
              className={`text-[14px] font-bold text-black mb-0 text-right pr-[5%] ${isEditingText ? 'outline-none border-b border-dashed border-teal-300 inline-block' : ''}`}
              contentEditable={isEditingText} suppressContentEditableWarning
            >
              إقرار المنتفع/المنتفعة بإعلامه بنتيجة الفحص وتوصيات الطبيب
            </h3>
            {/* Hotline text removed by user request */}

            <div className="flex justify-between items-center text-black max-w-[90%] mx-auto">
              <div className="flex-1 grid grid-cols-2 grid-gap-dynamic text-[12px] font-bold">
                <div className="text-right font-bold">{renderLabel("اسم الممرض/الممرضة : ")}<span className="font-normal text-gray-400">--------------</span></div>
                <div className="text-right pr-[10px] font-bold">{renderLabel("التوقيع : ")}<span className="font-normal text-gray-400">----------------------</span></div>

                <div className="text-right font-bold">{renderLabel("اسم الطبيب/الطبيبة : ")}<span className="font-normal text-gray-400">-----------------</span></div>
                <div className="text-right pr-[10px] font-bold">{renderLabel("التوقيع : ")}<span className="font-normal text-gray-400">----------------------</span></div>

                <div className="text-right font-bold">{renderLabel("مدير الوحدة : ")}<span className="font-normal text-gray-400">-------------------------</span></div>
                <div className="text-right pr-[10px] font-bold">{renderLabel("التوقيع : ")}<span className="font-normal text-gray-400">----------------------</span></div>
              </div>

              <div className="flex flex-col items-center ml-8">
                <div className="w-[65px] h-[65px] rounded-full border border-black mb-1"></div>
                {renderLabel("ختم شعار الجمهورية")}
              </div>
            </div>
          </div>

          {/* Section 5: Individual Consent Text */}
          <div className="section-block max-w-[90%] mx-auto">
            <div className="flex justify-between items-center text-[12.5px] font-bold text-black mb-0">
              <div className="flex items-center gap-1">
                {renderLabel("أقر أنا الموقع/الموقعه أدناه : ")}
                <span className="font-bold">{editedCert.fullName !== null ? editedCert.fullName : "-"}</span>
              </div>
              <div className="pl-16 flex items-center gap-1">
                {renderLabel("رقم القومى : ")}
                <span className="font-mono font-bold">{editedCert.nationalId !== null ? editedCert.nationalId : "-"}</span>
              </div>
            </div>
            {isEditingText ? (
              <textarea
                value={consentText}
                onChange={(e) => setConsentText(e.target.value)}
                className="bg-teal-50/70 border border-teal-300 rounded px-2 py-1 text-black font-bold text-justify text-[11px] w-full h-16 resize-none focus:outline-none focus:bg-white"
                dir="rtl"
              />
            ) : (
              <p className="text-[11px] font-bold text-black leading-snug text-justify tracking-tight" style={{ wordSpacing: "-0.4px" }}>
                {consentText}
              </p>
            )}
          </div>

          {/* Section 6: Thumbprint & Partner Info */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center text-[12.5px] font-bold text-black section-block max-w-[90%] mx-auto">
            <div className="flex flex-col space-y-1.5 relative -top-[10px]">
              <div className="font-bold">{renderLabel("الاسم (رباعى) : ")}<span className="font-normal text-gray-400">------------------</span></div>
              <div className="font-bold">{renderLabel("التوقيع : ")}<span className="font-normal text-gray-400">-----------------------</span></div>
            </div>

            <div className="flex flex-col items-center justify-center border-r-2 border-l-2 border-slate-300 px-6 py-1 h-full">
              <div className="w-[55px] h-[55px] rounded-full border border-black mb-1"></div>
              <span className="text-[11.5px] font-bold field-label">بصمة الإبهام</span>
            </div>

            <div className="flex flex-col space-y-1.5 pr-6">
              <div className="flex items-center gap-1 font-bold">
                {renderLabel("اسم الطرف الاخر(رباعى) : ")}
                {renderEditableField("partnerName", "text", "font-bold", "w-36")}
              </div>
              <div className="font-bold">{renderLabel("توقيع الطرف الاخر : ")}<span className="font-normal text-gray-400">--------------------</span></div>
              <div className="flex items-center gap-1 font-bold">
                {renderLabel("الرقم القومى للطرف الاخر : ")}
                {renderEditableField("partnerNationalId", "text", "font-bold font-mono", "w-36")}
              </div>
            </div>
          </div>

          {/* Footer Block */}
          <div className="flex justify-between items-end text-black section-block max-w-[90%] mx-auto w-full">
            <div className="text-[11.5px] font-bold text-black text-right pb-1 relative" style={{ top: `-${qrSize + 7}px` }}>
              {isEditingText ? (
                <input
                  type="text"
                  value={validityText}
                  onChange={(e) => setValidityText(e.target.value)}
                  className="bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-bold text-right focus:outline-none focus:bg-white text-[11px] w-80"
                />
              ) : (
                <span>{validityText}</span>
              )}
            </div>
            <div className="flex flex-col items-center ml-[88px]">
              <div className="bg-white p-1" style={{ border: '1px dotted black' }}>
                {currentUrl ? (
                  <QRCodeSVG value={currentUrl} size={qrSize} />
                ) : (
                  <div className="bg-slate-100 flex items-center justify-center text-[10px] text-slate-400" style={{ width: `${qrSize}px`, height: `${qrSize}px` }}>
                    QR
                  </div>
                )}
              </div>
              <span className="mt-0.5 font-bold text-[11px] flex items-center gap-1">
                {isEditingText ? (
                  <input
                    type="text"
                    value={editedCert.qrCodeLabel || ""}
                    onChange={(e) => setEditedCert({ ...editedCert, qrCodeLabel: e.target.value })}
                    className="bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-semibold text-center focus:outline-none focus:bg-white text-[11px] w-28"
                  />
                ) : (
                  <span>{editedCert.qrCodeLabel || `2026-${editedCert.certificateId}`}</span>
                )}
              </span>
            </div>
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-grow"></div>

        </div>
      </div>
    </div>
  );
}
