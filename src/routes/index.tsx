import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QrCode, ShieldCheck, Check, Megaphone, Smartphone, Star, Store, Wallet, Timer, TrendingUp, Users, Copy, X, BadgeCheck, Eye, Headphones } from "lucide-react";
import { useLang } from "@/components/vloop/Shell";
import { Link } from "@tanstack/react-router";
import { creators, parseVerifiedCreatorStats, t, type L } from "@/lib/vloop-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: PublicLanding,
});

export function PublicLanding() {
  const { lang } = useLang();
  const [verifiedStats, setVerifiedStats] = useState<Record<string, { followers: string; storyViews: string }>>({});
  const [claimCode, setClaimCode] = useState("");
  const [phone, setPhone] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const savedStats = window.localStorage.getItem("vloop.verified-creator-stats");
      if (!savedStats) return;
      setVerifiedStats(parseVerifiedCreatorStats(savedStats));
    } catch (error) {
      console.error("Unable to load verified creator stats.", error);
      toast.error(lang === "ar" ? "تعذر تحميل الإحصائيات الموثقة" : "Unable to load verified creator stats");
    }
  }, [lang]);

  const isAr = lang === "ar";
  const faqItems: { question: L; answer: L }[] = [
    {
      question: {
        ar: "س: كيف تضمن منصة ڤلوب أموالي كصاحب منشأة؟",
        en: "Q: How does Vloop protect my funds as a business owner?",
      },
      answer: {
        ar: "ج: تظل أموالك محجوزة بأمان في صندوق الأمانات (Escrow)، ولا يتم تحريرها للمعلن إلا بعد نشر التغطية وموافقتك عليها أو مرور 24 ساعة دون تقديم اعتراض مستند لشروط العقد.",
        en: "A: Your funds remain securely held in escrow and are released to the creator only after the coverage is published and approved by you, or after 24 hours pass without a dispute based on the contract terms.",
      },
    },
    {
      question: {
        ar: "س: ماذا يحدث إذا تخلف صانع المحتوى عن الحضور أو النشر في الموعد؟",
        en: "Q: What if a creator misses the visit or posting deadline?",
      },
      answer: {
        ar: "ج: في حال مرور 24 ساعة من تاريخ الموعد المحدد دون رفع إثبات النشر، يُلغى الطلب تلقائياً وتُسترد أموالك كاملة 100% إلى محفظتك بالمنصة مع إمكانية استرجاعها لبطاقتك البنكية.",
        en: "A: If 24 hours pass from the scheduled time without proof of posting, the booking is cancelled automatically and 100% of your funds are returned to your platform wallet, with the option to withdraw them to your bank card.",
      },
    },
    {
      question: {
        ar: "س: كصانع محتوى، متى وكيف أستلم أرباحي؟",
        en: "Q: As a creator, when and how do I receive my earnings?",
      },
      answer: {
        ar: "ج: بمجرد اعتماد الحملة (سواء بالموافقة المباشرة أو بعد انتهاء مهلة الـ 24 ساعة التلقائية)، يتحول المبلغ فوراً إلى \"الرصيد المتاح للسحب\" لتتمكن من تحويله لحسابك البنكي المحلي عبر Fawri+ IBAN بدون أي خصومات أو عمولات على أجرك المتفق عليه.",
        en: "A: Once a campaign is approved—directly or after the 24-hour review window—the amount moves immediately to your available balance for withdrawal to your local bank account via Fawri+ IBAN, with no deductions or fees from your agreed earnings.",
      },
    },
    {
      question: {
        ar: "س: هل يحتاج زبائن المطعم لتحميل تطبيق أو التسجيل للاستفادة من كود الخصم؟",
        en: "Q: Do restaurant customers need an app or account to use a discount code?",
      },
      answer: {
        ar: "ج: لا، الزبون يكتفي بإدخال رقم هاتفه في صفحة العرض المباشرة عبر المتصفح ليحصل على قسيمة الـ QR لمرة واحدة خلال 3 ثوانٍ وبدون انتظار أي رمز OTP.",
        en: "A: No. Customers only enter their phone number on the offer page in their browser to receive a single-use QR voucher within 3 seconds, without waiting for an OTP.",
      },
    },
    {
      question: {
        ar: "س: كيف يتم التعامل مع الخلافات أو عدم الالتزام بالشروط؟",
        en: "Q: How are disputes or breaches of campaign terms handled?",
      },
      answer: {
        ar: "ج: يتيح النظام للتاجر زر \"تقديم اعتراض\" خلال مهلة الـ 24 ساعة يوقف تحرير الأموال فوراً، ويتدخل فريق التحكيم لمطابقة التغطية المنشورة مع قائمة الشروط الرقمية الملزمة المعتمدة مسبقاً (NLP Brief).",
        en: "A: Merchants can raise a dispute during the 24-hour review window, immediately pausing fund release. Our arbitration team then checks the published coverage against the approved, binding digital brief (NLP Brief).",
      },
    },
  ];

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (claimCode && phone) {
      setShowQRModal(true);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText("VLP-98412");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10" />
        
        <div className="mx-auto w-[92%] max-w-[1200px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-primary mb-6 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            {isAr ? "منصة الوساطة والضمان المالي المعتمدة في البحرين" : "Certified Escrow Platform in Bahrain"}
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] text-center max-w-4xl mx-auto mb-6">
            {isAr ? "تسويق المؤثرين الميداني..." : "Field Influencer Marketing..."}
            <span className="block text-primary mt-1">
              {isAr ? "في حلقة مضمونة" : "In a Guaranteed Loop"}
            </span>
          </h1>
          
          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
            {isAr
              ? "المنصة السحابية الأولى لحملات المؤثرين بنظام الأمانات المالية (Escrow) وتتبع مبيعات الفروع الميدانية عبر قسائم QR الذكية."
              : "The premier cloud platform for influencer campaigns with financial escrow and field branch sales tracking via smart QR vouchers."}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: "auth-merchant" }))}
              className="w-full sm:w-auto rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lift transition hover:bg-primary/90 hover:-translate-y-1"
            >
              {isAr ? "ابدأ حملتك كمتجر" : "Start Your Campaign as a Merchant"}
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: "auth-creator" }))}
              className="w-full sm:w-auto rounded-xl border border-primary px-8 py-4 text-base font-bold text-primary transition hover:bg-primary/5 hover:-translate-y-1"
            >
              {isAr ? "انضم كصانع محتوى" : "Join as a Creator"}
            </button>
          </div>

          {/* VOUCHER CLAIM WIDGET */}
          <div id="voucher-claim" className="mx-auto max-w-4xl relative scroll-mt-24">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-sky/30 blur-xl opacity-50" />
            <div className="relative rounded-3xl border bg-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-inner">
                  <QrCode className="h-6 w-6" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-start leading-tight">
                  {isAr ? "معك كود خصم من إعلان مؤثر؟ استلم باركود العرض فوراً 🎟️" : "Have a discount code? Claim your offer barcode instantly 🎟️"}
                </h2>
              </div>
              
              <form onSubmit={handleClaim} className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder={isAr ? "كود الحملة أو رمز المشهور (مثال: FLAME20)" : "Campaign Code (e.g. FLAME20)"}
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value)}
                  className="flex-1 rounded-xl border bg-background/50 px-4 py-3.5 text-base font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
                <input
                  type="tel"
                  placeholder={isAr ? "رقم هاتفك النقال (39xxxxxx)" : "Mobile Number (39xxxxxx)"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 rounded-xl border bg-background/50 px-4 py-3.5 text-base font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all num"
                  required
                />
                <button
                  type="submit"
                  className="rounded-xl bg-foreground px-6 py-3.5 text-base font-bold text-background shadow-soft transition hover:bg-foreground/90 whitespace-nowrap shrink-0"
                >
                  {isAr ? "استلام الـ QR Code فوراً ✨" : "Claim QR Code ✨"}
                </button>
              </form>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                {isAr ? "محمي بنظام التحقق السريع — بدون الحاجة لإنشاء حساب أو انتظار كود OTP." : "Secured by rapid verification — no account creation or OTP needed."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST PILLARS STRIP */}
      <section className="border-y bg-surface py-6">
        <div className="mx-auto flex w-[92%] max-w-[1680px] flex-wrap items-start justify-center gap-6 lg:gap-12">
          {[
            {
              icon: ShieldCheck,
              t: isAr ? "ضمان مالي كامل" : "Full Financial Escrow",
              d: isAr ? "حجز الدفعة في الأمانات حتى إتمام التغطية الميدانية." : "Funds held in escrow until field coverage is completed."
            },
            {
              icon: QrCode,
              t: isAr ? "تتبع فوري بالـ QR" : "Instant QR Tracking",
              d: isAr ? "قياس زوار الفروع دون الحاجة لكاشير إلكتروني معقد." : "Measure branch visits without complex POS integration."
            },
            {
              icon: Store,
              t: isAr ? "فواتير ضريبية معتمدة" : "Certified Tax Invoices",
              d: isAr ? "متوافقة 100% مع معايير الجهاز الوطني للإيرادات (NBR)." : "100% compliant with National Bureau of Revenue (NBR)."
            },
            {
              icon: Timer,
              t: isAr ? "مهلة اعتماد 24 ساعة" : "24h Approval Window",
              d: isAr ? "حوكمة تلقائية تضمن حقوق الطرفين." : "Automated governance secures rights for both parties."
            },
          ].map((m, i) => (
            <div key={i} className="flex max-w-[240px] flex-col items-center text-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                <m.icon className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm sm:text-base">{m.t}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED LOCAL BRANDS */}
      <section className="my-8 w-full border-y border-slate-200/60 bg-slate-50/70 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted-foreground/80">
            {isAr
              ? "تثق بنا نخبة من أبرز المطاعم والمتاجر المحلية في مملكة البحرين"
              : "Trusted by leading local restaurants and retailers across the Kingdom of Bahrain"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-extrabold tracking-tight text-muted-foreground/60 md:gap-14 md:text-base">
            {["FLAME BURGER CO.", "BREW & CO. CAFE", "CRUST ARTISAN PIZZA", "MESA TAQUERIA", "HEALTHY BITES BH"].map((b) => (
              <span
                key={b}
                dir="ltr"
                className="cursor-default transition-colors hover:text-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3-STEP LOOP */}
      <section id="how-it-works" className="mx-auto mt-8 w-[92%] max-w-[1200px] scroll-mt-24 pb-12 lg:pb-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{isAr ? "كيف تعمل المنصة (The 3-Step Guaranteed Loop)" : "How It Works (The 3-Step Guaranteed Loop)"}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isAr ? "دورة متكاملة تضمن حقوق الطرفين وتوفر تتبعاً دقيقاً لنتائج الحملات الإعلانية." : "An integrated loop that secures rights for both parties and tracks ad results accurately."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              i: Wallet,
              t: isAr ? "حجز آمن بضمان مالي" : "Escrow Deposit",
              d: isAr ? "يتم حجز مبلغ الحملة في محفظة آمنة (Escrow) لضمان جدية العمل وحفظ حقوق الطرفين." : "Campaign funds are held securely to ensure commitment and protect both parties.",
              c: "text-sky bg-sky/10 border-sky/20",
              ic: "text-sky",
            },
            {
              i: Timer,
              t: isAr ? "تنفيذ مع نافذة مراجعة 24 ساعة" : "24h Review Settlement",
              d: isAr ? "بعد تنفيذ الحملة، يتم فتح نافذة مراجعة لمدة 24 ساعة قبل تحويل المبالغ لصانع المحتوى." : "After execution, a 24-hour review window is opened before releasing funds to the creator.",
              c: "text-warning bg-warning-soft border-warning/20",
              ic: "text-warning",
            },
            {
              i: Store,
              t: isAr ? "مبيعات وزوار موثقون" : "Single-Use Footfall Tracking",
              d: isAr ? "تتبع فوري للمبيعات والزوار من خلال مسح قسائم الخصم الذكية (QR) في الفروع." : "Real-time tracking of sales and footfall through smart QR discount scans at branches.",
              c: "text-success bg-success-soft border-success/20",
              ic: "text-success",
            },
          ].map((s, i) => (
            <div key={i} className="relative rounded-3xl border bg-card p-8 shadow-soft transition hover:shadow-lift hover:-translate-y-1">
              <div className={`absolute -top-5 ${isAr ? '-right-5' : '-left-5'} w-12 h-12 flex items-center justify-center rounded-full text-xl font-extrabold num shadow-sm bg-background border`}>
                {i + 1}
              </div>
              <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${s.c}`}>
                <s.i className={`h-8 w-8 ${s.ic}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{s.t}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLIC CREATOR SHOWCASE */}
      <section id="creators-showcase" className="scroll-mt-24 border-t bg-surface py-20 lg:py-32">
        <div className="mx-auto w-[92%] max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              {isAr ? "نخبة صنّاع المحتوى الموثوقين على ڤلوب" : "Top Verified Creators on Vloop"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isAr ? "تصفح نماذج من صنّاع المحتوى المتاحين للحملات التسويقية الميدانية." : "Browse examples of creators available for field marketing campaigns."}
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {creators.slice(0, 4).map((c) => (
              <article key={c.id} className="flex h-full min-h-[240px] flex-col rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-center gap-4 mb-4">
                  <img src={c.img} alt="" className="size-16 rounded-full object-cover ring-2 ring-accent" />
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-1.5">
                      {isAr ? c.name.ar : c.name.en}
                      <BadgeCheck className="size-4 text-primary fill-primary text-primary-foreground" />
                    </h3>
                    <span className="text-sm text-muted-foreground dir-ltr" style={{ direction: "ltr", unicodeBidi: "isolate" }}>{c.handle}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {c.tags.slice(0, 2).map((tg) => (
                    <span key={tg} className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{tg}</span>
                  ))}
                </div>
                <div className="mt-auto grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-xl bg-surface p-3">
                    <span className="block text-xs text-muted-foreground mb-1">
                      <Users className="h-3.5 w-3.5 inline mr-1" />
                      {isAr ? "متابع" : "Followers"}
                    </span>
                    <strong className="num text-sm">{verifiedStats[c.id]?.followers ?? c.followers}</strong>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <span className="block text-xs text-muted-foreground mb-1">
                      <Eye className="h-3.5 w-3.5 inline mr-1" />
                      {isAr ? "مشاهدات" : "Views"}
                    </span>
                    <strong className="num text-sm">{verifiedStats[c.id]?.storyViews ?? c.storyViews}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: "auth-merchant" }))}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base font-bold text-background shadow-soft transition hover:bg-foreground/90 hover:-translate-y-1"
            >
              {isAr ? "سجّل كمتجر للبدء بالحجز" : "Register as a Brand to Start Booking"}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="scroll-mt-24 border-t bg-background py-16 sm:py-20 lg:py-28">
        <div className="mx-auto w-[92%] max-w-[1000px]">
          <div className="mb-10 text-center sm:mb-14">
            <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Headphones className="size-6" />
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {isAr ? "الأسئلة الشائعة والمساعدة" : "Frequently Asked Questions"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {isAr
                ? "كل ما تحتاج معرفته عن نظام الضمان المالي، حجز المؤثرين، وتتبع الزوار."
                : "Everything you need to know about escrow, creator bookings, and visitor tracking."}
            </p>
          </div>

          <Accordion type="single" collapsible className="overflow-hidden rounded-2xl border bg-card px-5 shadow-soft sm:px-7">
            {faqItems.map(({ question, answer }, index) => (
              <AccordionItem key={question.en} value={`faq-${index}`}>
                <AccordionTrigger className="gap-4 py-5 text-start text-sm font-bold leading-relaxed hover:no-underline sm:text-base">
                  {question[lang]}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-8 text-muted-foreground sm:text-base">
                  {answer[lang]}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-7 flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isAr ? "لديك استفسار آخر؟" : "Still have a question?"}
              </h3>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                {isAr
                  ? "فريقنا جاهز لمساعدتك عبر البريد المباشر:"
                  : "Our team is ready to help via direct email:"}
                <a
                  href="mailto:support@vloop.me"
                  className="font-medium text-muted-foreground hover:text-primary"
                  dir="ltr"
                >
                  support@vloop.me
                </a>
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-help-modal"))}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 sm:self-auto"
            >
              <Headphones className="size-4" />
              {isAr ? "تواصل مع فريق الدعم" : "Contact Support"}
            </button>
          </div>
        </div>
      </section>

      {/* QR MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in" onClick={() => setShowQRModal(false)}>
          <div className="w-full max-w-sm rounded-3xl border bg-card p-1 shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="relative rounded-2xl bg-surface p-8 text-center border">
              <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition">
                <X className="h-5 w-5" />
              </button>
              
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
                <Check className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{isAr ? "تم إصدار قسيمتك بنجاح!" : "Voucher Issued Successfully!"}</h3>
              <p className="text-sm text-muted-foreground mb-8">
                {isAr ? "أظهر هذا الرمز عند الكاشير للحصول على الخصم." : "Show this code at the cashier to claim your discount."}
              </p>

              <div className="mx-auto mb-6 w-48 h-48 bg-white rounded-xl p-4 shadow-sm">
                {/* Mock QR Code */}
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=VLP-98412')] bg-cover" />
              </div>

              <div className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-muted py-3 px-4">
                <span className="font-mono text-xl font-bold tracking-widest text-foreground num">VLP-98412</span>
                <button onClick={copyToken} className="p-2 hover:bg-background rounded-lg transition text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-warning">
                <Timer className="h-4 w-4" />
                {isAr ? "صالح لمدة 48 ساعة فقط" : "Valid for 48 hours only"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
