"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  titleWidth?: number | null;
  titleHeight?: number | null;
  titleFontSize?: number | null;
  titleY?: number | null;
  titleX?: number | null;
  titleText?: string | null;
}

interface CertificatePrintViewProps {
  certificate: Certificate;
}

export default function CertificatePrintView({ certificate }: CertificatePrintViewProps) {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";
  const [currentUrl, setCurrentUrl] = useState("");
  const [editedCert, setEditedCert] = useState(certificate);
  const [isEditingText, setIsEditingText] = useState(false);
  const [fontSize, setFontSize] = useState(8);
  const [lineHeight, setLineHeight] = useState(2.0);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState(400);
  const [paddingX, setPaddingX] = useState(5);
  const [paddingY, setPaddingY] = useState(3);
  const [qrSize, setQrSize] = useState(35);
  const [sectionGap, setSectionGap] = useState(2);
  const [gridGap, setGridGap] = useState(10);
  const [titleWidth, setTitleWidth] = useState(280);
  const [titleHeight, setTitleHeight] = useState(40);
  const [titleFontSize, setTitleFontSize] = useState(21);
  const [titleY, setTitleY] = useState(certificate.titleY ?? 0);
  const [titleX, setTitleX] = useState(certificate.titleX ?? 0);
  const [titleText, setTitleText] = useState(certificate.titleText ?? "شهادة صحية لراغبي الزواج");

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
    "هذه الوثيقة صالحة لمدة ستة اشهر من تاريخ الإصدار"
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin);
      
      const fetchSettings = async () => {
        try {
          const res = await fetch(`${API_URL}/api/settings`);
          if (res.ok) {
            const parsed = await res.json();
            if (parsed.fontSize) setFontSize(parsed.fontSize);
            if (parsed.lineHeight) setLineHeight(parsed.lineHeight);
            if (parsed.letterSpacing !== undefined) setLetterSpacing(parsed.letterSpacing);
            if (parsed.fontWeight) setFontWeight(parsed.fontWeight);
            if (parsed.paddingX) setPaddingX(parsed.paddingX);
            if (parsed.paddingY) setPaddingY(parsed.paddingY);
            if (parsed.qrSize) setQrSize(parsed.qrSize);
            if (parsed.sectionGap !== undefined) setSectionGap(parsed.sectionGap);
            if (parsed.gridGap !== undefined) setGridGap(parsed.gridGap);
            if (parsed.titleWidth) setTitleWidth(parsed.titleWidth);
            if (parsed.titleHeight) setTitleHeight(parsed.titleHeight);
            if (parsed.titleFontSize) setTitleFontSize(parsed.titleFontSize);
            if (parsed.titleY !== undefined) setTitleY(parsed.titleY);
            if (parsed.titleX !== undefined) setTitleX(parsed.titleX);
            if (parsed.titleText) setTitleText(parsed.titleText);
            if (parsed.consentText) setConsentText(parsed.consentText);
            if (parsed.hotlineText) setHotlineText(parsed.hotlineText);
            if (parsed.validityText) setValidityText(parsed.validityText);
            if (parsed.section1Layout) setSection1Layout(parsed.section1Layout);
            if (parsed.section2Layout) setSection2Layout(parsed.section2Layout);
          }
        } catch (e) {
          console.error("Failed to fetch settings", e);
        }
      };
      
      fetchSettings();
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

    const currentSettings = {
      fontSize,
      lineHeight,
      letterSpacing,
      fontWeight,
      paddingX,
      paddingY,
      qrSize,
      sectionGap,
      gridGap,
      titleWidth,
      titleHeight,
      titleFontSize,
      titleY,
      titleX,
      titleText,
      consentText,
      hotlineText,
      validityText,
      section1Layout,
      section2Layout,
    };

    try {
      // Save global settings
      await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(currentSettings),
      });

      // Save certificate data
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
          titleWidth,
          titleHeight,
          titleFontSize,
          titleY,
          titleX,
          titleText,
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
    className = "font-bold text-[9pt]",
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
        className={`bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-semibold text-center focus:outline-none focus:bg-white text-[9pt] inline-block ${widthClass}`}
        dir="rtl"
      />
    );
  };

  const renderLabel = (defaultText: string, customClass = "") => {
    return (
      <span
        contentEditable={isEditingText}
        suppressContentEditableWarning
        className={`field-label ${customClass} ${isEditingText ? "border-b border-dashed border-teal-300 outline-none inline-block whitespace-pre" : ""}`}
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
    let colSpan = "col-span-4";
    switch (fieldId) {
      case "fullName": colSpan = "col-span-5"; break;
      case "nationalId": colSpan = "col-span-4"; break;
      case "gender": colSpan = "col-span-3"; break;
      case "nationality": colSpan = "col-span-5"; break;
      case "age": colSpan = "col-span-4"; break;
      case "phoneNumber": colSpan = "col-span-3"; break;
      case "idAddress": colSpan = "col-span-5"; break;
      case "maritalAddress": colSpan = "col-span-7"; break;
      case "empty1": colSpan = "col-span-12"; break;
    }

    const isSwapSource = swapSourceId === fieldId;
    const activeSwapClasses = isSwapSource ? "ring-2 ring-teal-400 bg-teal-50 rounded print:ring-0 print:bg-transparent" : "";

    const wrapperProps = {
      className: `${colSpan} flex items-center ${activeSwapClasses}`,
    };

    const innerClass = "mr-3 text-[9pt]  m-0 flex items-center gap-1";

    switch (fieldId) {
      case "fullName":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("الاسم : ")}
              {renderEditableField("fullName", "text", "font-bold text-[9pt]", "w-48")}
            </p>
          </div>
        );
      case "nationalId":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("الرقم القومى : ")}
              {renderEditableField("nationalId", "text", "font-bold font-mono", "w-40")}
            </p>
          </div>
        );
      case "gender":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("النوع : ")}
              {renderEditableField("gender", "text", "font-bold text-[9pt]", "w-24")}
            </p>
          </div>
        );
      case "nationality":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("الجنسية : ")}
              {renderEditableField("nationality", "text", "font-bold text-[9pt]", "w-32")}
            </p>
          </div>
        );
      case "age":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("السن : ")}
              {renderEditableField("age", "number", "font-bold text-[9pt]", "w-16")}
            </p>
          </div>
        );
      case "phoneNumber":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("رقم الهاتف : ")}
              {renderEditableField("phoneNumber", "text", "font-bold font-mono", "w-32")}
            </p>
          </div>
        );
      case "idAddress":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("العنوان بالبطاقة : ")}
              {renderEditableField("idAddress", "text", "font-bold text-[9pt]", "w-64")}
            </p>
          </div>
        );
      case "maritalAddress":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("عنوان سكن الزوجية : ")}
              {renderEditableField("maritalAddress", "text", "font-bold text-[9pt]", "w-64")}
            </p>
          </div>
        );
      case "empty1":
        return <div key={fieldId} {...wrapperProps}></div>;
      default:
        return null;
    }
  };

  const renderSection2Field = (fieldId: string, index: number) => {
    let colSpan = "col-span-4";
    if (fieldId === "bloodSugar") colSpan = "col-span-8";
    if (fieldId === "empty2") colSpan = "hidden";
    const isSwapSource = swapSourceId === fieldId;
    const activeSwapClasses = isSwapSource ? "ring-2 ring-teal-400 bg-teal-50 rounded print:ring-0 print:bg-transparent" : "";

    const wrapperProps = {
      className: `${colSpan} flex items-center ${activeSwapClasses}`,
    };
    const innerClass = "mr-3 text-[9pt]  m-0 flex items-center gap-1";

    switch (fieldId) {
      case "height":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("الطول(سم) : ")}
              {renderEditableField("height", "number", "font-bold text-[9pt]", "w-16")}
            </p>
          </div>
        );
      case "weight":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("الوزن(كجم) : ")}
              {renderEditableField("weight", "number", "font-bold text-[9pt]", "w-16")}
            </p>
          </div>
        );
      case "bmi":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("BMI : ")}
              {isEditingText ? (
                <input
                  type="number"
                  step="0.1"
                  value={editedCert.bmi}
                  onChange={(e) => setEditedCert({ ...editedCert, bmi: parseFloat(e.target.value) || 0 })}
                  className="bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-semibold text-center focus:outline-none focus:bg-white text-[9pt] w-16"
                />
              ) : (
                <span className="font-bold text-[9pt]">{editedCert.bmi}</span>
              )}
            </p>
          </div>
        );
      case "rh":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("RH : ")}
              {isEditingText ? (
                renderEditableField("rh", "text", "font-bold text-[9pt]", "w-16")
              ) : (
                <span className="font-bold text-[9pt]">
                  {editedCert.rh === "+" || editedCert.rh === "إيجابي" ? "إيجابي" : editedCert.rh === "-" || editedCert.rh === "سالب" ? "سالب" : editedCert.rh}
                </span>
              )}
            </p>
          </div>
        );
      case "bloodType":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("فصيلة الدم : ")}
              {isEditingText ? (
                <>
                  {renderEditableField("bloodType", "text", "font-bold text-[9pt]", "w-12")}
                  {renderEditableField("rh", "text", "font-bold text-[9pt]", "w-12")}
                </>
              ) : (
                <span className="font-bold text-[9pt]">
                  {editedCert.bloodType}
                  {editedCert.rh === "+" ? "+" : editedCert.rh === "-" ? "-" : ""}
                </span>
              )}
            </p>
          </div>
        );
      case "hb":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("Hb : ")}
              {renderEditableField("hb", "number", "font-bold text-[9pt]", "w-16")}
            </p>
          </div>
        );
      case "hbsAg":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("HBs Ag : ")}
              {renderEditableField("hbsAg", "text", "font-bold text-[9pt]", "w-24")}
            </p>
          </div>
        );
      case "antiHiv":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("Anti-HIV : ")}
              {renderEditableField("antiHiv", "text", "font-bold text-[9pt]", "w-24")}
            </p>
          </div>
        );
      case "antiHcv":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("Anti-HCV : ")}
              {renderEditableField("antiHcv", "text", "font-bold text-[9pt]", "w-24")}
            </p>
          </div>
        );
      case "bloodPressure":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("ضغط الدم : ")}
              {renderEditableField("bloodPressure", "text", "font-bold text-[9pt]", "w-24")}
            </p>
          </div>
        );
      case "randomBloodSugar":
        return (
          <div key={fieldId} {...wrapperProps}>
            <p className={innerClass}>
              {renderSwapButton(fieldId)}
              {renderLabel("نتيجة فحص السكر(العشوائى) : ")}
              {renderEditableField("randomBloodSugar", "number", "font-bold text-[9pt]", "w-16")}
            </p>
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
          font-family: 'Simplified Arabic', 'Traditional Arabic', 'Times New Roman', Arial, sans-serif !important;
          color: #000000 !important;
        }

        .print-page {
          width: 210mm;
          min-height: 297mm;
          padding: ${paddingY}mm ${paddingX}mm;
          box-sizing: border-box;
          background-color: #ffffff;
          color: #000000 !important;
          line-height: ${lineHeight} !important;
          letter-spacing: ${letterSpacing}px !important;
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
          /* font-weight removed */
          letter-spacing: ${letterSpacing}px !important;
        }

        .print-page .field-label {
          white-space: nowrap !important;
          font-weight: 400 !important;
          font-size: 9pt !important;
          color: #000000 !important;
        }

        .print-page .header-label-bold {
          font-weight: 700 !important;
          font-size: 10.5pt !important;
        }

        .print-page {
          /* font-size removed */
        }

        .print-page .text-\\[14\\.5px\\] {
          /* font-size removed */
        }
        .print-page .text-\\[14px\\] {
          /* font-size removed */
        }
        .print-page .text-\\[12\\.5px\\] {
          /* font-size removed */
        }
        .print-page .text-\\[12px\\] {
          /* font-size removed */
        }
        .print-page .text-\\[11\\.5px\\] {
          /* font-size removed */
        }
        .print-page .text-\\[11px\\] {
          /* font-size removed */
        }
        .print-page .text-\\[10px\\] {
          /* font-size removed */
        }
        .print-page .text-\\[9\\.5px\\] {
          /* font-size removed */
        }

        .print-page .cert-grid {
          row-gap: ${gridGap}px !important;
          column-gap: 4px !important;
        }

        .print-page .cert-section {
          margin-bottom: ${sectionGap}px !important;
        }

        @media print {
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
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
            margin: 0 auto !important;
            width: 210mm !important;
            height: 297mm !important;
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
      {isAdmin && (
      <div className="no-print w-full lg:w-80 bg-slate-900 text-slate-100 border-b lg:border-r border-slate-800 p-6 flex flex-col gap-5 shrink-0 select-none font-sans" dir="rtl">
        <div>
          <h2 className="text-[10.5pt] font-semibold text-white flex items-center gap-2 mb-1">
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
        <div className="flex flex-row gap-2">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="flex-1 py-2 px-2 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-xs font-semibold text-slate-950 transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            {saveLoading ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
            ) : (
              <Save className="h-3.5 w-3.5 shrink-0" />
            )}
            حفظ التعديلات
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFontSize(8);
              setLineHeight(2.0);
              setLetterSpacing(0);
              setFontWeight(400);
              setPaddingX(5);
              setPaddingY(3);
              setQrSize(35);
              setSectionGap(2);
              setGridGap(10);
              setTitleWidth(280);
              setTitleHeight(40);
              setTitleFontSize(21);
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
            className="flex-1 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            إعادة الضبط
          </button>
        </div>

        <hr className="border-slate-800" />

        {/* Sliders */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[50vh] pr-1">
          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">أبعاد وحجم الخطوط</h3>

          {/* Font Size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">حجم الخط الرئيسي</span>
              <span className="text-teal-400 font-mono">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="5"
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
              min="100"
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

          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1">عنوان الشهادة</h3>

          {/* Title Width */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">عرض مستطيل العنوان</span>
              <span className="text-teal-400 font-mono">{titleWidth}px</span>
            </div>
            <input
              type="range"
              min="50"
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
              min="10"
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
              min="8"
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
              min="-300"
              max="300"
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
              min="-300"
              max="300"
              step="1"
              value={titleX}
              onChange={(e) => setTitleX(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>
        </div>
      </div>
      )}

      {/* Main Preview Area */}
      <div className="flex-grow flex flex-col items-center py-6 px-4 overflow-auto print:p-0 print:m-0 print:block">
        {/* Admin Action Bar (Hidden during print) */}
        {isAdmin && (
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
              className="flex items-center gap-1.5 rounded-lg bg-teal-500 py-1.5 px-5 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition"
            >
              <Printer className="h-4 w-4" />
              طباعة (Ctrl+P)
            </button>
          </div>
        </div>
        )}

        {/* Official A4 Layout Replication */}
        <div
          className="print-page bg-white text-black shadow-xl"
          dir="rtl"
          onClick={() => { if (isAdmin && !isEditingText) setIsEditingText(true); }}
          title={!isEditingText && isAdmin ? "انقر للبدء في التعديل" : undefined}
          style={{ cursor: (isEditingText || !isAdmin) ? "default" : "text" }}
        >
          {/* Header Row */}
          <div className="flex justify-between items-start relative pt-2">
            {/* Right: empty spacer */}
            <div style={{ minWidth: '90px' }}></div>

            {/* Center: Certificate Title */}
            <div 
              className="absolute left-1/2"
              style={{
                top: `${titleY}px`,
                transform: `translateX(calc(-50% + ${titleX}px))`
              }}
            >
              <div 
                className={`border border-black rounded-[4px] text-black flex items-center justify-center leading-none px-6 ${isEditingText ? 'border-dashed border-teal-500 bg-teal-50/20' : ''}`}
                style={{
                  width: `${titleWidth}px`,
                  height: `${titleHeight}px`,
                  fontSize: `${titleFontSize}px`,
                  fontWeight: '900',
                  fontFamily: "'Simplified Arabic', 'Traditional Arabic', 'Times New Roman', Arial, sans-serif",
                  letterSpacing: '0px',
                  whiteSpace: 'nowrap'
                }}
              >
                {isEditingText ? (
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="bg-transparent text-center focus:outline-none w-full"
                    style={{ whiteSpace: 'nowrap', fontWeight: '900' }}
                    dir="rtl"
                  />
                ) : (
                  titleText
                )}
              </div>
            </div>

            {/* Left (شمال): Government Seal placeholder */}
            <div className="flex flex-col items-center" style={{ direction: 'ltr', minWidth: '90px' }}>
              <div className="border border-black bg-white flex items-center justify-center font-semibold" style={{ width: '80px', height: '80px' }}>
                <span dir="ltr" className="text-[9pt]">4%</span>
              </div>
              <span className="font-semibold mt-1 text-[9pt]">ختم شعار الجمهورية</span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 mb-1 mt-0">
            <div className="col-span-3 font-bold text-[11pt] flex items-center gap-1 whitespace-nowrap">
                {renderLabel("تاريخ الإصدار : ", "header-label-bold")}
                {isEditingText ? (
                  <input
                    type="text"
                    value={editedCert.issueDate}
                    onChange={(e) => setEditedCert({ ...editedCert, issueDate: e.target.value })}
                    className="bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-bold text-center focus:outline-none focus:bg-white text-[11pt] w-28"
                  />
                ) : (
                  <span className="text-[11pt] font-bold header-label-bold">{formatDate(editedCert.issueDate)}</span>
                )}
            </div>
            <div className="col-span-4 font-bold text-[11pt] flex items-center gap-1 whitespace-nowrap" style={{ fontFamily: "'Simplified Arabic', 'Traditional Arabic', 'Times New Roman', Arial, sans-serif" }}>
                {renderLabel("اسم الوحدة: ", "header-label-bold")}
                {renderEditableField("unitName", "text", "header-label-bold whitespace-nowrap", "w-48")}
            </div>
            <div className="col-span-3 font-bold text-[11pt] flex items-center gap-1 whitespace-nowrap">
                {renderLabel("المحافظة: ", "header-label-bold")}
                {renderEditableField("governorate", "text", "header-label-bold whitespace-nowrap", "w-32")}
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="w-full">
            <h2
              className={`text-[10.5pt] font-black text-black mb-1 ${isEditingText ? 'outline-none border-b border-dashed border-teal-300 inline-block' : ''}`}
              contentEditable={isEditingText} suppressContentEditableWarning
            >
              البيانات الأساسية
            </h2>
            <div className="bg-white grid grid-cols-12 cert-grid gap-x-1 w-full">
              {section1Layout.map((fieldId, index) => renderSection1Field(fieldId, index))}
            </div>
          </div>

          {/* Section 2: Medical Examinations */}
          <div className="w-full">
            <h2
              className={`text-[10.5pt] font-semibold text-black mb-1 ${isEditingText ? 'outline-none border-b border-dashed border-teal-300 inline-block' : ''}`}
              contentEditable={isEditingText} suppressContentEditableWarning
            >
              الفحوصات الطبية
            </h2>
            <div className="bg-white grid grid-cols-12 cert-grid gap-x-1 w-full">
              {section2Layout.map((fieldId, index) => renderSection2Field(fieldId, index))}
            </div>
          </div>

          {/* Section 3: Hb Electrophoresis */}
          <div className="mt-1 w-full flex items-start gap-4" style={{ direction: 'ltr', paddingLeft: '55px' }}>
            <div className="whitespace-nowrap mt-[2px] min-w-fit ml-[-50px]">
                <p style={{ fontWeight: '600', fontSize: '10pt', textDecoration: 'underline', margin: 0 }}>
                    Hb Electrophoresis :
                </p>
            </div>
            <div className="flex w-[95%] justify-between pr-10 mt-[30px] ml-[-43px]">
              <div className="flex flex-col mb-1">
                  <label className="font-semibold flex items-center gap-1 whitespace-nowrap">
                      {renderLabel("A : ")}
                      {renderEditableField("hbA", "number", "font-bold text-[9pt]", "w-12")}
                      {renderLabel(" %")}
                  </label>
                  <div>
                      <label className="font-normal text-[9pt]">Normal</label>
                  </div>
              </div>
              <div className="flex flex-col mb-1">
                  <label className="font-semibold flex items-center gap-1 whitespace-nowrap">
                      {renderLabel("F : ")}
                      {renderEditableField("hbF", "number", "font-bold text-[9pt]", "w-12")}
                      {renderLabel(" %")}
                  </label>
                  <div>
                      <label className="font-normal text-[9pt]">Normal</label>
                  </div>
              </div>
              <div className="flex flex-col mb-1">
                  <label className="font-semibold flex items-center gap-1 whitespace-nowrap">
                      {renderLabel("A2 : ")}
                      {renderEditableField("hbA2", "number", "font-bold text-[9pt]", "w-12")}
                      {renderLabel(" %")}
                  </label>
                  <div>
                      <label className="font-normal text-[9pt]">Normal</label>
                  </div>
              </div>
              <div className="flex flex-col mb-1">
                  <label className="font-semibold flex items-center gap-1 whitespace-nowrap">
                      {renderLabel("C : ")}
                      {renderEditableField("hbC", "number", "font-bold text-[9pt]", "w-12")}
                      {renderLabel(" %")}
                  </label>
                  <div>
                      <label className="font-normal text-[9pt]">Normal</label>
                  </div>
              </div>
              <div className="flex flex-col mb-1">
                  <label className="font-semibold flex items-center gap-1 whitespace-nowrap">
                      {renderLabel("S : ")}
                      {renderEditableField("hbS", "number", "font-bold text-[9pt]", "w-12")}
                      {renderLabel(" %")}
                  </label>
                  <div>
                      <label className="font-normal text-[9pt]">Normal</label>
                  </div>
              </div>
            </div>
          </div>

          {/* Section 4: Declaration Block */}
          <div className="w-full">
            <h2
              className={`text-[10.5pt] font-semibold text-black mb-1 ${isEditingText ? 'outline-none border-b border-dashed border-teal-300 inline-block' : ''}`}
              contentEditable={isEditingText} suppressContentEditableWarning
            >
              إقرار المنتفع/المنتفعة بإعلامه بنتيجة الفحص وتوصيات الطبيب
            </h2>
            
            <div className="bg-white w-full">
                <div className="grid grid-cols-12">
                    <div className="col-span-5 flex flex-col gap-3 pt-[3px]">
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("اسم الممرض/الممرضة : ")}<span className="font-normal text-gray-400">........................</span></p>
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("اسم الطبيب/الطبيبة : ")}<span className="font-normal text-gray-400">........................</span></p>
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("مدير الوحدة : ")}<span className="font-normal text-gray-400">........................</span></p>
                    </div>
                    <div className="col-span-4 flex flex-col gap-3 pt-[3px]">
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("التوقيع : ")}<span className="font-normal text-gray-400">........................</span></p>
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("التوقيع : ")}<span className="font-normal text-gray-400">........................</span></p>
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("التوقيع : ")}<span className="font-normal text-gray-400">........................</span></p>
                    </div>
                    <div className="col-span-3 flex flex-col items-center">
                        <div className="w-[80px] h-[80px] rounded-full border border-black"></div>
                        <p className="pt-[2px] text-center font-semibold text-[9pt] m-0">ختم شعار الجمهورية</p>
                    </div>
                </div>

                <div className="flex mt-1 items-center">
                    <p className="mr-3 text-[9pt] m-0 flex items-center gap-1 font-semibold whitespace-nowrap">
                        {renderLabel("أقر أنا الموقع/الموقعه أدناه : ")}
                        <span className="font-bold text-[9pt]">{editedCert.fullName !== null ? editedCert.fullName : "-"}</span>
                    </p>
                    <p className="mr-[226px] text-[9pt] m-0 flex items-center gap-1 font-semibold whitespace-nowrap">
                        {renderLabel("رقم القومى : ")}
                        <span className="font-bold text-[9pt]">{editedCert.nationalId !== null ? editedCert.nationalId : "-"}</span>
                    </p>
                </div>

                <div className="mt-1">
                    {isEditingText ? (
                      <textarea
                        value={consentText}
                        onChange={(e) => setConsentText(e.target.value)}
                        className="bg-teal-50/70 border border-teal-300 rounded px-2 py-1 text-black font-semibold text-justify text-[9pt] w-full h-24 resize-none focus:outline-none focus:bg-white"
                        dir="rtl"
                      />
                    ) : (
                      <p className="mr-3 text-[9pt]  leading-relaxed text-justify">
                        {consentText}
                      </p>
                    )}
                </div>

                <div className="grid grid-cols-12 mt-6">
                    <div className="col-span-4 border-l border-black flex flex-col gap-1">
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("الاسم (رباعى) : ")}<span className="font-normal text-gray-400">......................</span></p>
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("التوقيع : ")}<span className="font-normal text-gray-400">......................</span></p>
                    </div>
                    <div className="col-span-3 border-l border-black flex flex-col items-center">
                        <div className="w-[60px] h-[60px] rounded-full border border-black mb-1"></div>
                        <p className="pt-[2px] text-center font-semibold text-[9pt] m-0">بصمة الإبهام</p>
                    </div>
                    <div className="col-span-5 flex flex-col gap-1 pr-3">
                        <p className="mr-3 text-[9pt] font-semibold flex items-center gap-1 m-0">
                          {renderLabel("اسم الطرف الاخر(رباعى) : ")}
                          {renderEditableField("partnerName", "text", "font-bold text-[9pt]", "w-40")}
                        </p>
                        <p className="mr-3 text-[9pt] font-semibold m-0 flex items-center gap-1">{renderLabel("توقيع الطرف الاخر : ")}<span className="font-normal text-gray-400">......................</span></p>
                        <p className="mr-3 text-[9pt] font-semibold flex items-center gap-1 m-0">
                          {renderLabel("الرقم القومى للطرف الاخر : ")}
                          {renderEditableField("partnerNationalId", "text", "font-bold font-mono", "w-40")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-1 items-center">
                    <div className="col-span-7 pt-1">
                        <p className="mr-3 mt-[-50px] text-[9pt] text-red-600 font-semibold m-0 whitespace-nowrap" style={{ wordSpacing: '6px' }}>
                          {isEditingText ? (
                            <input
                              type="text"
                              value={validityText}
                              onChange={(e) => setValidityText(e.target.value)}
                              className="bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-red-600 font-semibold focus:outline-none focus:bg-white w-full"
                            />
                          ) : (
                            validityText
                          )}
                        </p>
                    </div>
                    <div className="col-span-5 flex flex-col items-start pr-3">
                        <div className="flex flex-col items-center mr-[30px] mt-[17.8px]">
                            <div className="bg-white p-1 border border-black w-fit">
                                {currentUrl ? (
                                  <QRCodeSVG value={currentUrl} size={qrSize} />
                                ) : (
                                  <div className="bg-slate-100 flex items-center justify-center text-[9pt] text-slate-400" style={{ width: `${qrSize}px`, height: `${qrSize}px` }}>
                                    QR
                                  </div>
                                )}
                            </div>
                            <p className="font-semibold text-[9pt] m-0 mt-1 flex items-center justify-center text-black text-center w-full">
                              {isEditingText ? (
                                <input
                                  type="text"
                                  value={editedCert.qrCodeLabel || ""}
                                  onChange={(e) => setEditedCert({ ...editedCert, qrCodeLabel: e.target.value })}
                                  className="bg-teal-50/70 border border-teal-300 rounded px-1 py-0 text-black font-semibold text-center focus:outline-none focus:bg-white w-20"
                                />
                              ) : (
                                <span>{editedCert.qrCodeLabel || `2026-${editedCert.certificateId}`}</span>
                              )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
