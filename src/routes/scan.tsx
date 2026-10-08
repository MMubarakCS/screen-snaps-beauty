import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, Camera, CheckCircle2, XCircle, Keyboard, RotateCcw, LogOut, Store, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/components/vloop/Shell";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
});

/* ── simulated "used" tokens database ── */
const usedTokens = new Map<string, string>();

function ScanPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const [mode, setMode] = useState<"scanning" | "manual" | "success" | "duplicate">("scanning");
  const [manualCode, setManualCode] = useState("");
  const [scanAnim, setScanAnim] = useState(true);
  const [lastToken, setLastToken] = useState("");
  const [duplicateTime, setDuplicateTime] = useState("");
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  /* Re-enable scan animation loop */
  useEffect(() => {
    if (mode === "scanning") {
      const id = setInterval(() => setScanAnim((p) => !p), 1200);
      return () => clearInterval(id);
    }
  }, [mode]);

  const handleScan = useCallback((token: string) => {
    const clean = token.trim().toUpperCase();
    if (!clean) return;
    if (usedTokens.has(clean)) {
      setLastToken(clean);
      setDuplicateTime(usedTokens.get(clean)!);
      setMode("duplicate");
      /* Attempt error sound */
      try { errorAudioRef.current?.play(); } catch { /* ok */ }
    } else {
      const now = new Date();
      const timeStr = `${isAr ? "اليوم" : "Today"}, ${now.toLocaleTimeString(isAr ? "ar-BH" : "en-BH", { hour: "2-digit", minute: "2-digit" })}`;
      usedTokens.set(clean, timeStr);
      setLastToken(clean);
      setMode("success");
      /* Attempt success sound */
      try { successAudioRef.current?.play(); } catch { /* ok */ }
    }
  }, [isAr]);

  const resetToScan = useCallback(() => {
    setMode("scanning");
    setManualCode("");
  }, []);

  /* Auto-reset from success after 4s */
  useEffect(() => {
    if (mode === "success") {
      const t = setTimeout(resetToScan, 4000);
      return () => clearTimeout(t);
    }
  }, [mode, resetToScan]);

  /* Demo: simulate a scan after 6 seconds in scanning mode */
  useEffect(() => {
    if (mode === "scanning") {
      const t = setTimeout(() => {
        handleScan("VLP-84291");
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [mode, handleScan]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0e1a]" style={{ fontFamily: "'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Invisible audio elements for haptic feedback */}
      <audio ref={successAudioRef} preload="none">
        <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=" type="audio/wav" />
      </audio>
      <audio ref={errorAudioRef} preload="none">
        <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=" type="audio/wav" />
      </audio>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0e1a]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600">
              <ScanLine className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold text-white">
                Vloop Scanner <span className="font-normal text-white/40">|</span> <span className="text-white/80">كشك الكاشير</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
              <Store className="h-3 w-3" />
              {isAr ? "فليم برجر (فرع السيف)" : "Flame Burger (Seef)"}
            </span>
            <Link
              to="/merchant"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" style={{ transform: isAr ? "scaleX(-1)" : "none" }} />
              <span className="hidden sm:inline">{isAr ? "خروج" : "Exit"}</span>
            </Link>
          </div>
        </div>
        {/* Mobile branch badge */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 border-t border-white/5 bg-emerald-500/5 py-1.5 text-[11px] font-bold text-emerald-400">
          <Store className="h-3 w-3" />
          {isAr ? "محل: فليم برجر (فرع السيف)" : "Store: Flame Burger (Seef Branch)"}
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        {/* ── SUCCESS CARD ── */}
        {mode === "success" && (
          <div className="w-full max-w-md animate-in zoom-in-95 fade-in duration-300">
            <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-950 via-emerald-900/80 to-emerald-950 p-8 text-center shadow-2xl shadow-emerald-500/20">
              {/* Glow effect */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15)_0%,_transparent_70%)]" />
              <div className="relative z-10">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="mb-2 text-2xl font-extrabold text-white">
                  {isAr ? "✓ قسيمة معتمدة بنجاح!" : "✓ Voucher Validated!"}
                </h2>
                <div className="mb-5 space-y-2">
                  <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                    {isAr ? "خصم 20% على إجمالي الفاتورة" : "20% off total bill"}
                  </div>
                  <p className="text-sm text-emerald-200/70">
                    {isAr ? "تم تسجيل الزيارة بنجاح (+1 Footfall)" : "Visit recorded successfully (+1 Footfall)"}
                  </p>
                  <p dir="ltr" className="num text-xs text-emerald-400/60" style={{ direction: "ltr", unicodeBidi: "isolate" }}>
                    Token: {lastToken}
                  </p>
                </div>
                <button
                  onClick={resetToScan}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  {isAr ? "مسح قسيمة تالية" : "Scan Next Voucher"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── DUPLICATE / ERROR CARD ── */}
        {mode === "duplicate" && (
          <div className="w-full max-w-md animate-in zoom-in-95 fade-in duration-300">
            <div className="relative overflow-hidden rounded-3xl border-2 border-red-500/50 bg-gradient-to-br from-red-950 via-red-900/80 to-red-950 p-8 text-center shadow-2xl shadow-red-500/20">
              {/* Glow effect */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.15)_0%,_transparent_70%)]" />
              <div className="relative z-10">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 ring-4 ring-red-500/30 animate-pulse">
                  <XCircle className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="mb-2 text-2xl font-extrabold text-white">
                  {isAr ? "✗ عذراً! هذه القسيمة مستخدمة مسبقاً" : "✗ Voucher Already Used"}
                </h2>
                <div className="mb-5 space-y-2">
                  <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                    {isAr ? `تم استهلاك هذا الكوبون في: ${duplicateTime}` : `This voucher was consumed at: ${duplicateTime}`}
                  </div>
                  <p className="text-sm text-red-200/70">
                    {isAr ? "لا يُسمح بتكرار استخدام القسيمة لنفس العميل." : "Duplicate voucher usage is not permitted for the same customer."}
                  </p>
                  <p dir="ltr" className="num text-xs text-red-400/60" style={{ direction: "ltr", unicodeBidi: "isolate" }}>
                    Token: {lastToken}
                  </p>
                </div>
                <button
                  onClick={resetToScan}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition hover:bg-red-400 active:scale-95"
                >
                  <ArrowRight className="h-4 w-4" style={{ transform: isAr ? "scaleX(-1)" : "none" }} />
                  {isAr ? "العودة للمسح" : "Back to Scanner"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SCANNING MODE ── */}
        {(mode === "scanning" || mode === "manual") && (
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            {/* Camera Viewfinder */}
            <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 shadow-2xl">
              {/* Corner brackets */}
              <div className="absolute inset-6 z-10">
                {/* Top-left */}
                <div className="absolute top-0 start-0 h-8 w-8 border-t-[3px] border-s-[3px] border-sky-400 rounded-tl-lg" />
                {/* Top-right */}
                <div className="absolute top-0 end-0 h-8 w-8 border-t-[3px] border-e-[3px] border-sky-400 rounded-tr-lg" />
                {/* Bottom-left */}
                <div className="absolute bottom-0 start-0 h-8 w-8 border-b-[3px] border-s-[3px] border-sky-400 rounded-bl-lg" />
                {/* Bottom-right */}
                <div className="absolute bottom-0 end-0 h-8 w-8 border-b-[3px] border-e-[3px] border-sky-400 rounded-br-lg" />
              </div>

              {/* Scanning laser line animation */}
              <div className="absolute inset-x-8 z-20 h-0.5 animate-scan-line rounded-full bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]" />

              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />

              {/* Center reticle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-sky-400/40 transition-all duration-700 ${scanAnim ? "scale-110 border-sky-400/60" : "scale-100"}`}>
                  <div className={`h-3 w-3 rounded-full bg-sky-400 transition-all duration-700 ${scanAnim ? "shadow-[0_0_20px_6px_rgba(56,189,248,0.4)]" : "shadow-[0_0_8px_2px_rgba(56,189,248,0.2)]"}`} />
                </div>
              </div>

              {/* Camera icon watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <Camera className="h-32 w-32 text-white" />
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]" />
              {isAr ? "الكاميرا جاهزة — وجّه العدسة نحو رمز QR الخاص بالزبون" : "Camera ready — point at customer's QR code"}
            </div>

            {/* Manual Entry Fallback */}
            {mode === "manual" ? (
              <div className="w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-3 text-center text-sm font-semibold text-white/60">
                    {isAr ? "أدخل الرمز النصي للقسيمة" : "Enter voucher code manually"}
                  </p>
                  <div className="flex gap-2">
                    <input
                      dir="ltr"
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleScan(manualCode); }}
                      placeholder={isAr ? "مثال: VLP-84291" : "e.g. VLP-84291"}
                      className="num flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder-white/30 outline-none transition focus:border-sky-400/50 focus:bg-white/10"
                      style={{ direction: "ltr", unicodeBidi: "isolate" }}
                      autoFocus
                    />
                    <button
                      onClick={() => handleScan(manualCode)}
                      disabled={!manualCode.trim()}
                      className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isAr ? "تحقق" : "Verify"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => handleScan("VLP-84291")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.98]"
                >
                  <QRSimIcon />
                  {isAr ? "محاكاة مسح QR" : "Simulate QR Scan"}
                </button>
                <button
                  onClick={() => setMode("manual")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
                >
                  <Keyboard className="h-4 w-4" />
                  {isAr ? "إدخال يدوي" : "Manual Entry"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 bg-[#070a13] py-3 text-center text-[11px] text-white/20">
        Vloop Scanner v1.0 — {isAr ? "واجهة محمية بموجب SECR-8.5" : "Secured interface per SECR-8.5"}
      </footer>

      {/* ── Keyframe injection for scan line ── */}
      <style>{`
        @keyframes scan-line {
          0%, 100% { top: 15%; }
          50% { top: 80%; }
        }
        .animate-scan-line {
          animation: scan-line 2.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/* ── Tiny QR icon component ── */
function QRSimIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
      <rect x="0" y="0" width="6" height="6" rx="1" />
      <rect x="10" y="0" width="6" height="6" rx="1" />
      <rect x="0" y="10" width="6" height="6" rx="1" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="14" y="10" width="2" height="2" />
      <rect x="10" y="14" width="2" height="2" />
      <rect x="14" y="14" width="2" height="2" />
      <rect x="8" y="8" width="2" height="2" />
    </svg>
  );
}

export default ScanPage;
