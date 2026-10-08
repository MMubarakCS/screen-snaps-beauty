import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, QrCode, Copy, Check, ChevronDown, Lock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Lang } from "@/lib/vloop-data";

const branches = [
  { id: "seef-98124", ar: "فرع مجمع السيف — المنامة", en: "Seef Mall — Manama" },
  { id: "riffa-44021", ar: "فرع الرفاع", en: "Riffa Branch" },
  { id: "muharraq-33019", ar: "فرع المحرق", en: "Muharraq Branch" },
];

export function CashierKioskModal({ onClose, lang }: { onClose: () => void; lang: Lang }) {
  const isAr = lang === "ar";
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [branchOpen, setBranchOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const kioskUrl = `https://vloop.me/scan?branch=${selectedBranch.id}`;

  const copyLink = async () => {
    try {
      let copiedWithClipboard = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(kioskUrl);
          copiedWithClipboard = true;
        } catch (err) {
          console.warn("navigator.clipboard failed, falling back to execCommand", err);
        }
      }

      if (!copiedWithClipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = kioskUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        try {
          textArea.focus();
          textArea.select();
          if (!document.execCommand("copy")) {
            throw new Error("execCommand copy failed");
          }
        } finally {
          textArea.remove();
        }
      }

      setCopied(true);
      toast.success(isAr ? "تم نسخ رابط كشك الكاشير بنجاح!" : "Cashier kiosk link copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed", err);
      toast.error(
        isAr
          ? "تعذر نسخ الرابط. يرجى المحاولة مرة أخرى."
          : "Unable to copy the link. Please try again.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-3xl border bg-card shadow-lift animate-in zoom-in-95 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <QrCode className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <h2 className="text-base font-bold">
                {isAr ? "إعداد كشك الكاشير لمسح القسائم" : "Cashier Kiosk Provisioning"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isAr ? "Cashier Kiosk Provisioning" : "إعداد كشك الكاشير لمسح القسائم"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Branch Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-muted-foreground">
              {isAr ? "اختر الفرع" : "Select Branch"}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setBranchOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-xl border bg-background px-4 py-3 text-sm font-semibold transition hover:border-primary/50 focus:border-primary focus:outline-none"
              >
                <span>{isAr ? selectedBranch.ar : selectedBranch.en}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${branchOpen ? "rotate-180" : ""}`} />
              </button>
              {branchOpen && (
                <div className="absolute start-0 end-0 top-full z-10 mt-1 rounded-xl border bg-popover p-1 shadow-lift animate-in fade-in zoom-in-95">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setSelectedBranch(b); setBranchOpen(false); setCopied(false); }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm transition hover:bg-muted ${b.id === selectedBranch.id ? "bg-accent font-bold text-accent-foreground" : ""}`}
                    >
                      {b.id === selectedBranch.id && <Check className="h-4 w-4 text-primary" />}
                      {isAr ? b.ar : b.en}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tokenized Kiosk URL Card */}
          <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/[0.03] p-4">
            <p className="mb-2 text-xs font-semibold text-primary">
              {isAr ? "رابط كشك الكاشير المعتمد" : "Authorized Cashier Kiosk Link"}
            </p>
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5">
              <code dir="ltr" className="num flex-1 truncate text-sm font-semibold text-foreground" style={{ direction: "ltr", unicodeBidi: "isolate" }}>
                {kioskUrl}
              </code>
              <button
                onClick={copyLink}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  copied
                    ? "bg-success/10 text-success"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied
                  ? (isAr ? "تم النسخ ✓" : "Copied ✓")
                  : (isAr ? "نسخ رابط الكاشير" : "Copy Link")}
              </button>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex gap-3 rounded-xl border border-success/20 bg-success-soft/50 px-4 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <p className="text-xs leading-relaxed text-foreground/80">
              {isAr
                ? "وصول محمي ومقيد: هذا الرابط مخصص لموظفي الكاشير لمسح القسائم فقط، ولا يسمح بالاطلاع على أرباح المتجر أو بيانات العقود المالية."
                : "Restricted access: This link is designated for cashier staff to scan vouchers only. It does not grant access to store earnings or financial contract data."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/scan"
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              {isAr ? "فتح واجهة الكاشير للتجربة" : "Open Scanner Demo"}
            </Link>
            <button
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition hover:bg-muted"
            >
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
