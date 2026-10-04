import { X, Mail, Landmark } from "lucide-react";
import type { Lang } from "@/lib/vloop-data";

export function CreatorSettingsModal({ onClose, lang }: { onClose: () => void; lang: Lang }) {
  const isAr = lang === "ar";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose} dir={isAr ? "rtl" : "ltr"}>
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isAr ? "إعدادات الحساب والآيبان" : "Account & Payout Settings"}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-xs font-bold text-muted-foreground">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
            <div className="flex items-center rounded-lg border bg-background px-3 focus-within:border-primary">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <input type="email" defaultValue="yousif@vloop.me" className="w-full bg-transparent p-2 text-sm outline-none" dir="ltr" />
            </div>
          </div>

          <div className="rounded-xl border bg-surface p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <Landmark className="h-4 w-4 text-primary" />
              {isAr ? "بيانات التحويل البنكي (Payout)" : "Local Bank Payout Details"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-muted-foreground">{isAr ? "البنك المحلي" : "Local Bank"}</label>
                <select className="w-full rounded-lg border bg-background p-2.5 text-sm outline-none focus:border-primary">
                  <option>بنك البحرين الوطني NBB</option>
                  <option>بنك البحرين والكويت BBK</option>
                  <option>بنك السلام Al Salam Bank</option>
                  <option>Ila Bank</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-muted-foreground">{isAr ? "رقم الآيبان (IBAN)" : "IBAN Number"}</label>
                <input type="text" defaultValue="BH67NBOB00000012345678" className="w-full rounded-lg border bg-background p-2.5 text-sm outline-none focus:border-primary font-mono uppercase" dir="ltr" />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {isAr ? "سيتم التحويل الفوري عبر فوري بلس (Fawri+) بمجرد اعتماد التنفيذ." : "Fast settlement via Fawri+ upon approval."}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-muted-foreground" />
              <div>
                <span className="block text-sm font-medium">{isAr ? "إشعارات الحجوزات" : "Booking Notifications"}</span>
                <span className="block text-xs text-muted-foreground">{isAr ? "إشعار فوري عند وصول طلب حجز جديد بضمان مدفوع." : "Instant notification for new secured booking requests."}</span>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted">
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button onClick={onClose} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
            {isAr ? "حفظ الإعدادات" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
