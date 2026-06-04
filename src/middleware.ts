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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check token from cookie OR from custom header (set by client from localStorage)
  const cookieToken = request.cookies.get("admin_session")?.value;
  const headerToken = request.headers.get("x-admin-token") || undefined;
  const token = cookieToken || headerToken;

  // Protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token || !(await verifyJWT(token, JWT_SECRET))) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect to dashboard if logged in and accessing login page
  if (pathname === "/login") {
    if (token && (await verifyJWT(token, JWT_SECRET))) {
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
