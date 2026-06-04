import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "premarital_examination_secure_jwt_secret_token_2026";

async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, signatureB64] = parts;

    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const keyData = encoder.encode(secret);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Convert Base64Url to Base64 standard
    const b64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const rawSignature = atob(b64);
    const signatureBin = new Uint8Array(rawSignature.length);
    for (let i = 0; i < rawSignature.length; i++) {
      signatureBin[i] = rawSignature.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBin,
      data
    );

    if (!isValid) return false;

    // Check expiration
    const payloadB64Decoded = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadB64Decoded);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get("admin_session")?.value;

    if (!session || !(await verifyJWT(session, JWT_SECRET))) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect to dashboard if logged in and accessing login page
  if (pathname === "/login") {
    const session = request.cookies.get("admin_session")?.value;
    if (session && (await verifyJWT(session, JWT_SECRET))) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
