import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const RETAILER_NAME = "Kumar Electronics & Appliances";
const APP_BASE      = "https://rilabhilashasolkar.github.io/B2B-Care-automation/#/install/book";

export default function SmsRedirectPage() {
  const [params] = useSearchParams();
  const p = params.get("p") || "";
  const s = params.get("s") || "";
  const m = params.get("m") || "";

  useEffect(() => {
    if (!m) return;
    const bookingUrl = `${APP_BASE}?${new URLSearchParams({ p, s, m }).toString()}`;
    const msg =
      `Hi! Your ${p} (SN: ${s}) from ${RETAILER_NAME} is ready for FREE installation. ` +
      `Book here: ${bookingUrl} — JioMart Digital`;
    window.location.href = `sms:+91${m}?body=${encodeURIComponent(msg)}`;
  }, [p, s, m]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FF]">
      <div className="text-center space-y-3 px-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto animate-pulse">
          <span className="text-2xl">💬</span>
        </div>
        <p className="text-sm font-semibold text-gray-700">Opening SMS…</p>
        <p className="text-xs text-gray-400">You'll be redirected in a moment</p>
      </div>
    </div>
  );
}
