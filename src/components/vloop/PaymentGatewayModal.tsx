import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { X, Lock, Smartphone, CreditCard, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { fmtBHD, type Lang, type L } from "@/lib/vloop-data";
import { chargeEscrow, escrowBreakdown } from "@/lib/payments";

const TEST_CARD = { number: "4111 1111 1111 1111", exp: "12/28", cvv: "123", name: "FLAME BURGER CO" };
const input = "w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20";

export function PaymentGatewayModal({ lang, fee, onCancel, onFunded }: { lang: Lang; fee: number; onCancel: () => void; onFunded: () => void }) {
  const tr = (x: L) => x[lang];
  const router = useRouter();
  const b = escrowBreakdown(fee);
  const [method, setMethod] = useState<"benefitpay" | "card">("benefitpay");
  const [card, setCard] = useState(TEST_CARD);
  const [stage, setStage] = useState<"form" | "processing" | "done">("form");
  const [txn, setTxn] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const pay = async () => {
    if (method === "card") {
      const digits = card.number.replace(/\s/g, "");
      if (digits.length < 15 || !/^\d{2}\/\d{2}$/.test(card.exp) || !/^\d{3,4}$/.test(card.cvv) || !card.name.trim()) {
        toast.warning(tr({ ar: "يرجى إكمال بيانات البطاقة بشكل صحيح", en: "Please complete the card details correctly" }));
        return;
      }
    }
    setStage("processing");
    const res = await chargeEscrow({ amount: b.total, method, paymentRef: "#BEN-2026-98124" });
    setTxn(res.txnRef);
    setStage("done");
  };

  const finish = () => {
    onFunded();
    toast.success(tr({ ar: "🎉 تم تمويل الحملة وإرسال العرض لصانع المحتوى!", en: "🎉 Campaign funded and offer sent to the creator!" }));
    void router.navigate({ to: "/campaigns" });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border bg-card shadow-lift sm:rounded-2xl 2xl:max-w-xl">
        <header className="flex items-center gap-3 border-b px-6 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Lock className="h-5 w-5" /></span>
          <div className="flex-1">
            <h2 className="text-base font-bold">{tr({ ar: "بوابة الدفع الإلكتروني والضمان المالي", en: "Secure Escrow Payment Gateway" })}</h2>
            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-bold text-success"><ShieldCheck className="h-3 w-3" />SSL 256-bit</span>
          </div>
          {stage === "form" && <button onClick={onCancel} aria-label="Close" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>}
        </header>

        {stage === "done" ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success"><CheckCircle2 className="h-9 w-9" /></span>
            <h3 className="mt-4 text-lg font-bold">{tr({ ar: "تمت عملية الدفع بنجاح وحجز المبلغ في الأمانات 🔒", en: "Payment successful — funds locked in escrow 🔒" })}</h3>
            <p className="num mt-2 text-2xl font-extrabold text-success">{fmtBHD(b.total, lang)}</p>
            <div className="mt-4 rounded-lg bg-muted px-4 py-2 text-sm">
              {tr({ ar: "رقم الإيصال المرجعي:", en: "Receipt reference:" })} <span className="font-mono font-bold" dir="ltr">{txn}</span>
            </div>
            <button onClick={finish} className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90">
              {tr({ ar: "متابعة إلى قائمة حملاتي", en: "Continue to My Campaigns" })}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-semibold text-muted-foreground">{tr({ ar: "إجمالي مبلغ الضمان", en: "Total escrow amount" })}</p>
                <p className="num text-3xl font-extrabold text-foreground">{fmtBHD(b.total, lang)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tr({ ar: "أجر المعلن", en: "Creator fee" })} (<span className="num">{fmtBHD(b.fee, lang)}</span>) + {tr({ ar: "رسوم المنصة والضريبة", en: "platform fee & VAT" })} (<span className="num">{fmtBHD(b.charges, lang)}</span>)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                {([["benefitpay", Smartphone, { ar: "BenefitPay (فوري+)", en: "BenefitPay (Fawri+)" }], ["card", CreditCard, { ar: "بطاقة بنكية", en: "Bank Card" }]] as const).map(([id, Icon, l]) => (
                  <button key={id} onClick={() => setMethod(id)} disabled={stage !== "form"} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${method === id ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="h-4 w-4" />{tr(l)}
                  </button>
                ))}
              </div>

              {method === "benefitpay" ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="relative rounded-2xl border-2 border-foreground bg-background p-3">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=BEN-2026-98124" alt="BenefitPay QR" className="h-44 w-44" />
                    <span className="absolute -bottom-3 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-3 py-1 text-[11px] font-bold text-background rtl:translate-x-1/2">
                      {tr({ ar: "مسح عبر تطبيق بنفت بي", en: "Scan with BenefitPay" })}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{tr({ ar: "مرجع الدفع:", en: "Payment ref:" })} <span className="font-mono font-bold text-foreground" dir="ltr">#BEN-2026-98124</span></p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">{tr({ ar: "مدى / فيزا / ماستركارد — تمت تعبئة بطاقة اختبار آمنة (وضع تجريبي)", en: "Mada / Visa / Mastercard — a safe test card is pre-filled (sandbox)" })}</p>
                  <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{tr({ ar: "رقم البطاقة", en: "Card number" })}</span><input dir="ltr" inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className={`${input} num text-start`} /></label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{tr({ ar: "تاريخ الانتهاء", en: "Expiry" })} (MM/YY)</span><input dir="ltr" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} className={`${input} num text-start`} /></label>
                    <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{tr({ ar: "رمز الأمان", en: "CVV" })}</span><input dir="ltr" type="password" inputMode="numeric" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} className={`${input} num text-start`} /></label>
                  </div>
                  <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{tr({ ar: "اسم حامل البطاقة", en: "Cardholder name" })}</span><input dir="ltr" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className={`${input} text-start`} /></label>
                </div>
              )}
            </div>
            <footer className="border-t px-6 py-4">
              <button onClick={pay} disabled={stage === "processing"} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-80">
                {stage === "processing" ? <><Loader2 className="h-4 w-4 animate-spin" />{tr({ ar: "جاري معالجة العملية البنكية...", en: "Processing Transaction..." })}</>
                  : method === "benefitpay" ? tr({ ar: "دفع سريع عبر بنفت بي (BenefitPay App)", en: "Quick pay via BenefitPay App" })
                  : <>{tr({ ar: "ادفع", en: "Pay" })} <span className="num">{fmtBHD(b.total, lang)}</span></>}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
