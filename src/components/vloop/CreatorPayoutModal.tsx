import { useEffect, useState } from "react";
import { X, Landmark, Loader2, CheckCircle2, Info, Check } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/components/vloop/Shell";
import { fmtBHD, type L } from "@/lib/vloop-data";
import { isValidPayoutAmount, requestPayout } from "@/lib/payments";

const IBAN = "BH67 NBOB 0000 0012 3456 78";

export function CreatorPayoutModal({ available, onClose }: { available: number; onClose: () => void }) {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  const [amount, setAmount] = useState(available.toFixed(3));
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [stage, setStage] = useState<"form" | "processing" | "done">("form");
  const [ref, setRef] = useState("");
  const value = Number(amount);
  const amountOk = isValidPayoutAmount(value, available);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const submit = async () => {
    if (!amountOk) { toast.warning(tr({ ar: `أدخل مبلغاً بين 0.001 و ${fmtBHD(available, "ar")}`, en: `Enter an amount up to ${fmtBHD(available, "en")}` })); return; }
    if (password.length < 6) { toast.warning(tr({ ar: "يرجى إدخال كلمة المرور لتأكيد التحويل", en: "Please enter your password to confirm" })); return; }
    if (!agree) { toast.warning(tr({ ar: "يرجى الموافقة على الإقرار القانوني", en: "Please accept the legal declaration" })); return; }
    setStage("processing");
    const res = await requestPayout({ amount: value, iban: IBAN });
    setRef(res.ref);
    setStage("done");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center whitespace-normal bg-foreground/40 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-4" onClick={stage === "processing" ? undefined : onClose}>
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border bg-card text-start shadow-lift sm:rounded-2xl 2xl:max-w-xl" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center gap-3 border-b px-6 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Landmark className="h-5 w-5" /></span>
          <h2 className="flex-1 text-base font-bold">{tr({ ar: "طلب سحب الأرباح والتحويل البنكي المحلي عبر فوري+", en: "Earnings Withdrawal & Local Bank Transfer (Fawri+)" })}</h2>
          {stage !== "processing" && <button onClick={onClose} aria-label={tr({ ar: "إغلاق", en: "Close" })} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>}
        </header>

        {stage === "done" ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success"><CheckCircle2 className="h-9 w-9" /></span>
            <h3 className="mt-4 text-lg font-bold">{tr({ ar: "✓ تم إرسال أمر التحويل البنكي بنجاح", en: "✓ Bank transfer order sent successfully" })}</h3>
            <p className="num mt-2 text-2xl font-extrabold">{fmtBHD(value, lang)}</p>
            <dl className="mt-5 w-full space-y-2 rounded-xl border bg-surface p-4 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{tr({ ar: "الرقم المرجعي", en: "Reference ID" })}</dt><dd className="font-mono font-bold" dir="ltr">{ref}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{tr({ ar: "وقت الوصول المتوقع", en: "Expected arrival" })}</dt><dd className="font-semibold">{tr({ ar: "خلال دقائق معدودة عبر فوري+", en: "Within minutes via Fawri+" })}</dd></div>
            </dl>
            <button onClick={onClose} className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">{tr({ ar: "تم", en: "Done" })}</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <p className="flex items-start gap-2 rounded-lg bg-success-soft p-3 text-sm text-success"><Info className="mt-0.5 h-4 w-4 shrink-0" />{tr({ ar: "يتم تحويل الأرباح لحسابك البنكي مباشرة دون أي خصومات أو عمولات من منصة ڤلوب.", en: "Earnings go straight to your bank account with no Vloop deductions or commissions." })}</p>
              <div className="flex items-center justify-between rounded-xl border bg-surface p-4">
                <span className="text-sm font-semibold text-muted-foreground">{tr({ ar: "الرصيد المتاح", en: "Available balance" })}</span>
                <span className="num text-xl font-extrabold text-success">{fmtBHD(available, lang)}</span>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{tr({ ar: "المبلغ المراد سحبه (د.ب)", en: "Amount to withdraw (BHD)" })}</span>
                <input dir="ltr" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={`num w-full rounded-lg border bg-card px-3.5 py-2.5 text-start text-sm font-bold outline-none focus:ring-2 ${amountOk ? "focus:border-primary focus:ring-ring/20" : "border-destructive focus:ring-destructive/20"}`} />
                {!amountOk && <span className="mt-1 block text-xs text-destructive">{tr({ ar: "المبلغ يجب ألا يتجاوز الرصيد المتاح", en: "Amount must not exceed the available balance" })}</span>}
              </label>
              <div className="rounded-xl border p-4">
                <p className="mb-3 text-sm font-bold">{tr({ ar: "بيانات الحساب المستفيد", en: "Beneficiary account" })}</p>
                <dl className="space-y-2 text-sm">
                  {[
                    [{ ar: "اسم المستفيد المعتمد", en: "Beneficiary name" }, tr({ ar: "يوسف المناعي", en: "Yousif Al-Mannai" })],
                    [{ ar: "البنك المحلي", en: "Local bank" }, tr({ ar: "بنك البحرين الوطني", en: "National Bank of Bahrain (NBB)" })],
                    [{ ar: "الآيبان المسجل", en: "Registered IBAN" }, IBAN],
                    [{ ar: "وسيلة التحويل", en: "Transfer method" }, tr({ ar: "شبكة فوري+ السريعة", en: "Fawri+ Instant Settlement" })],
                  ].map(([k, v], i) => (
                    <div key={i} className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">{tr(k as L)}</dt><dd className={`font-semibold ${i === 2 ? "font-mono" : ""}`} dir={i === 2 ? "ltr" : undefined}>{v as string}</dd></div>
                  ))}
                </dl>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{tr({ ar: "أدخل كلمة المرور لتأكيد التحويل البنكي", en: "Enter your password to confirm the transfer" })}</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-surface p-3 text-sm">
                <input type="checkbox" className="sr-only" checked={agree} onChange={() => setAgree(!agree)} />
                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${agree ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{agree && <Check className="h-3 w-3" />}</span>
                {tr({ ar: "أقر بأن الحساب البنكي المسجل يخصني شخصياً وأوافق على شروط التحويل البنكي المعتمدة عبر نظام فوري+ في مملكة البحرين.", en: "I confirm the registered bank account belongs to me personally and I accept the Fawri+ bank transfer terms in the Kingdom of Bahrain." })}
              </label>
            </div>
            <footer className="border-t px-6 py-4">
              <button onClick={submit} disabled={stage === "processing"} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-80">
                {stage === "processing" ? <><Loader2 className="h-4 w-4 animate-spin" />{tr({ ar: "جاري إرسال أمر التحويل...", en: "Dispatching transfer..." })}</> : tr({ ar: "تأكيد وإرسال طلب التحويل البنكي", en: "Confirm & Send Bank Transfer" })}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
