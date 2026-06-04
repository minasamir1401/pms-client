import { notFound } from "next/navigation";
import CertificatePrintView from "./CertificatePrintView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewCertificatePage({ params }: PageProps) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${apiUrl}/api/certificates/${id}`, {
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
