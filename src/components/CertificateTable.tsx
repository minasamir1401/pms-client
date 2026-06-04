"use client";

import { useState } from "react";
import { Search, Printer, Calendar, Shield, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

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

interface CertificateTableProps {
  certificates: Certificate[];
  onEdit?: (certificate: Certificate) => void;
  onDelete?: (id: string) => void;
}

export default function CertificateTable({ certificates, onEdit, onDelete }: CertificateTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("الكل");

  // Format date helper
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

  // Filter certificates
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.nationalId.includes(searchQuery) ||
      cert.certificateId.includes(searchQuery);

    const matchesGender = genderFilter === "الكل" || cert.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-4" dir="rtl">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 backdrop-blur-sm shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="بحث بالاسم، الرقم القومي أو رقم الشهادة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-9 pl-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 w-full md:w-auto justify-start md:justify-end">
          <span className="text-xs font-semibold text-slate-500 shrink-0">الجنس:</span>
          <button
            type="button"
            onClick={() => setGenderFilter("الكل")}
            className={`rounded-lg py-1 px-2 sm:py-1.5 sm:px-4 text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              genderFilter === "الكل"
                ? "bg-teal-500 text-white font-bold"
                : "border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            الكل
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter("ذكر")}
            className={`rounded-lg py-1 px-2 sm:py-1.5 sm:px-4 text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              genderFilter === "ذكر"
                ? "bg-teal-500 text-white font-bold"
                : "border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            ذكور
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter("أنثى")}
            className={`rounded-lg py-1 px-2 sm:py-1.5 sm:px-4 text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              genderFilter === "أنثى"
                ? "bg-teal-500 text-white font-bold"
                : "border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            إناث
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-right">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-4">رقم الشهادة</th>
              <th scope="col" className="py-3.5 px-4">اسم المفحوص</th>
              <th scope="col" className="py-3.5 px-4">الرقم القومي</th>
              <th scope="col" className="py-3.5 px-4">تاريخ الإصدار</th>
              <th scope="col" className="py-3.5 px-4">الجنس</th>
              <th scope="col" className="py-3.5 px-4">السن</th>
              <th scope="col" className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-600">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert) => (
                <tr
                  key={cert.certificateId}
                  className="transition duration-150 hover:bg-slate-50"
                >
                  {/* Certificate ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono font-semibold text-teal-600">
                    2026-{cert.certificateId}
                  </td>
                  {/* Full Name */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                    {cert.fullName}
                  </td>
                  {/* National ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-500">
                    {cert.nationalId}
                  </td>
                  {/* Issue Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {formatDate(cert.issueDate)}
                    </span>
                  </td>
                  {/* Gender */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        cert.gender === "ذكر"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-pink-50 text-pink-600"
                      }`}
                    >
                      {cert.gender}
                    </span>
                  </td>
                  {/* Age */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-semibold">
                    {cert.age} سنة
                  </td>
                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/view/${cert.certificateId}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 py-1.5 px-3 text-xs font-bold text-teal-600 transition hover:bg-teal-600 hover:text-white cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        عرض وطباعة A4
                      </Link>

                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(cert)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 py-1.5 px-3 text-xs font-bold text-amber-600 transition hover:bg-amber-500 hover:text-white cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          تعديل
                        </button>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(cert.certificateId)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 py-1.5 px-3 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          حذف
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Shield className="h-8 w-8 text-slate-200 animate-pulse" />
                    <p className="text-sm">لا توجد شهادات مطابقة لخيارات البحث</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}