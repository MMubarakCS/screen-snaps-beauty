import { ArrowUpRight, Image as ImageIcon, X } from "lucide-react";
import type { Creator, Lang } from "@/lib/vloop-data";

export type SocialPlatform = "instagram" | "tiktok" | "snapchat";

export type InsightsVerification = {
  id: string;
  creator: Creator;
  currentFollowers: string;
  currentViews: string;
  requestedFollowers: string;
  requestedViews: string;
  screenshotDataUrl: string | null;
  screenshotName: string | null;
  platform: SocialPlatform;
  profileUrl: string;
  status: "pending" | "approved" | "rejected";
};

export function InsightsProofModal({
  verification,
  lang,
  onClose,
  onApprove,
  onReject,
}: {
  verification: InsightsVerification | null;
  lang: Lang;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  if (!verification) return null;
  const tr = (text: { ar: string; en: string }) => text[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="insights-proof-title" className="my-auto w-full max-w-2xl rounded-2xl border bg-card p-5 shadow-lift sm:p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 id="insights-proof-title" className="font-bold">{tr({ ar: "إثبات الإحصائيات (Insights)", en: "Stats proof (Insights)" })}</h3>
            <p className="mt-1 font-semibold text-foreground">{tr(verification.creator.name)}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span dir="ltr">{verification.creator.handle}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                {verification.platform === "instagram" ? "Instagram" : verification.platform === "tiktok" ? "TikTok" : "Snapchat"}
              </span>
              <a
                href={verification.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold text-primary transition hover:bg-primary/5"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />{tr({ ar: "زيارة الحساب", en: "View Profile" })}
              </a>
            </div>
          </div>
          <button onClick={onClose} aria-label={tr({ ar: "إغلاق", en: "Close" })} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        {verification.screenshotDataUrl ? (
          <img
            src={verification.screenshotDataUrl}
            alt={tr({ ar: "لقطة شاشة Insights المرفقة من صانع المحتوى", en: "Creator-uploaded Insights screenshot" })}
            className="mx-auto h-96 w-full max-w-sm rounded-xl border bg-muted object-contain shadow-sm"
          />
        ) : (
          <div className="mx-auto flex h-96 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-xl border bg-muted px-6 text-center shadow-sm">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="font-semibold">{tr({ ar: "لم تُرفق لقطة شاشة فعلية لهذا الطلب", en: "No actual screenshot is attached to this request" })}</p>
            <p className="text-sm text-muted-foreground">{tr({ ar: "ستظهر الصورة هنا بعد إرسالها من ملف صانع المحتوى.", en: "The uploaded image will appear here after the creator submits it." })}</p>
          </div>
        )}
        {verification.screenshotName && <p className="mt-2 text-center text-xs text-muted-foreground">{verification.screenshotName}</p>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-surface p-3">
            <p className="text-xs text-muted-foreground">{tr({ ar: "الأرقام الحالية", en: "Current stats" })}</p>
            <p className="num mt-1 font-bold">{verification.currentFollowers} {tr({ ar: "متابع", en: "followers" })} • {verification.currentViews} {tr({ ar: "مشاهدات", en: "views" })}</p>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs text-primary">{tr({ ar: "الأرقام المطلوبة", en: "Requested stats" })}</p>
            <p className="num mt-1 font-bold"><strong>{verification.requestedFollowers} {tr({ ar: "متابع", en: "followers" })} • {verification.requestedViews} {tr({ ar: "مشاهدات", en: "views" })}</strong></p>
          </div>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onReject} className="rounded-lg border border-destructive px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10">{tr({ ar: "رفض الطلب ✗", en: "Reject request ✗" })}</button>
          <button onClick={onApprove} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90">{tr({ ar: "اعتماد وتوثيق الإحصائيات ✓", en: "Approve & verify stats ✓" })}</button>
        </div>
      </div>
    </div>
  );
}
