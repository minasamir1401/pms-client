import { notFound } from "next/navigation";
import CertificatePrintView from "./CertificatePrintView";
import API_URL from "@/config";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewCertificatePage({ params }: PageProps) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/api/certificates/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      notFound();
    }

    const certificate = await res.json();
    return <CertificatePrintView certificate={certificate} />;
  } catch (error) {
    notFound();
  }
}
