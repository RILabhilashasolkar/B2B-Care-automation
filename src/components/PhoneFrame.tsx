import { useState, useEffect } from "react";

function getFormattedTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Inline SVG icons — no extra dependencies
function SignalIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="0.5" opacity="1" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" opacity="1" />
      <rect x="9" y="3" width="3" height="9" rx="0.5" opacity="1" />
      <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.35" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1 4.5C3.8 1.8 7 0.5 8 0.5c1 0 4.2 1.3 7 4" opacity="0.4" />
      <path d="M3 7C4.8 5.2 6.5 4.2 8 4.2s3.2 1 5 2.8" opacity="0.7" />
      <path d="M5.2 9.2C6.2 8.2 7.1 7.8 8 7.8s1.8.4 2.8 1.4" />
      <circle cx="8" cy="11.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
      <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <rect x="1.5" y="1.5" width="15" height="9" rx="1.5" fill="currentColor" />
      <path d="M19.5 4.5v3c.8-.4 1.3-1 1.3-1.5s-.5-1.1-1.3-1.5z" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState(getFormattedTime);

  useEffect(() => {
    const id = setInterval(() => setTime(getFormattedTime()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    /* Desktop background */
    <div
      className="min-h-screen w-full flex items-center justify-center py-8"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(67,97,238,0.18) 0%, transparent 65%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      {/* Phone chrome */}
      <div
        className="relative flex flex-col overflow-hidden bg-[hsl(var(--background))]"
        style={{
          width: 390,
          height: 844,
          borderRadius: 48,
          border: "2px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Camera notch — pill style */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full"
          style={{ width: 100, height: 28 }}
        />

        {/* Status Bar */}
        <div
          className="flex items-center justify-between flex-shrink-0 bg-primary text-primary-foreground"
          style={{ height: 44, paddingLeft: 20, paddingRight: 16, paddingTop: 4 }}
        >
          {/* Time */}
          <span className="text-[13px] font-semibold tracking-tight" style={{ paddingLeft: 8 }}>
            {time}
          </span>

          {/* System icons */}
          <div className="flex items-center gap-1.5 text-primary-foreground/90">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        {/* App content area — relative so sidebar & modals overlay this, not the viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </div>

        {/* Home Indicator (iOS style) */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/25 rounded-full pointer-events-none z-50" />
      </div>

      {/* Below-frame label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <span className="text-white/30 text-[10px] font-medium tracking-widest uppercase">JMD B2B Retailer Portal</span>
        <div className="w-2 h-2 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
