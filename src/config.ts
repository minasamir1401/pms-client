/**
 * Central API configuration
 * NEXT_PUBLIC_API_URL environment variable is used in production.
 * Falls back to the live production server if not set.
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://minasamirapi.duckdns.org";

export default API_URL;
