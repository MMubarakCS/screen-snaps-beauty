import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Copy,
  Wallet,
  CheckCircle2,
  X,
  Link as LinkIcon,
  ShieldCheck,
  Check,
  Lock,
  Clock,
  ArrowUpRight,
  BadgeCheck,
  AlertCircle,
  Send
} from "lucide-react";
import { useLang } from "@/components/vloop/Shell";
import { fmtBHD } from "@/lib/vloop-data";
import { toast } from "sonner";

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [
      { title: "Vloop | ڤلوب — Creator Business Suite" },
    ],
  }),
  component: CreatorPage,
});

function CreatorPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [copiedBio, setCopiedBio] = useState(false);
  const [tab, setTab] = useState<"new" | "active" | "completed">("new");
  const [threshold, setThreshold] = useState("150.000");
  
  // Modals
  const [declineModal, setDeclineModal] = useState(false);
  const [proofModal, setProofModal] = useState(false);
  
  // States for campaign
  const [campaignStatus, setCampaignStatus] = useState<"new" | "accepted" | "declined">("new");
  
  // Settings state
  const [capacity, setCapacity] = useState("1");
  const [daysOff, setDaysOff] = useState<string[]>(["Friday", "Saturday"]);
  const allDays = [
    { en: "Friday", ar: "الجمعة" },
    { en: "Saturday", ar: "السبت" },
    { en: "Sunday", ar: "الأحد" },
    { en: "Monday", ar: "الإثنين" },
    { en: "Tuesday", ar: "الثلاثاء" },
    { en: "Wednesday", ar: "الأربعاء" },
    { en: "Thursday", ar: "الخميس" }
  ];
  const toggleDay = (d: string) => setDaysOff(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);

  const copyBioLink = () => {
    navigator.clipboard?.writeText("https://vloop.me/@yousif.bites");
    setCopiedBio(true);
    toast.success(isAr ? "تم نسخ الرابط!" : "Link copied!");
    setTimeout(() => setCopiedBio(false), 2000);
  };

  const handleAccept = () => {
    setCampaignStatus("accepted");
    setTab("active");
    toast.success(isAr ? "تم قبول الحجز بنجاح" : "Campaign accepted successfully");
  };

  const submitProof = () => {
    setProofModal(false);
    toast.success(isAr ? "تم إرسال الإثبات بنجاح وبدأت مهلة الاعتماد" : "Proof submitted, approval period started");
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="mx-auto w-[92%] max-w-[1680px] space-y-8 px-4 py-8 lg:px-8 2xl:space-y-12 2xl:py-12">
        
        {/* 2. Top Summary & Bio-Link Hub */}
        <section className="rounded-2xl border bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-bold text-foreground">
                {isAr ? "رابط الحجز الذكي الخاص بك" : "Your Smart Booking Link"}
              </h2>
              <div className="flex max-w-md items-center rounded-lg border bg-background p-1">
                <span className="truncate px-3 text-sm text-muted-foreground" dir="ltr">
                  https://vloop.me/@yousif.bites
                </span>
                <button
                  onClick={copyBioLink}
                  className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background transition hover:bg-foreground/90"
                >
                  {copiedBio ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {isAr ? "نسخ الرابط" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">
                {isAr 
                  ? "شاركه في البايو أو مع أصحاب الأنشطة التجارية؛ يتم تحصيل أتعابك مسبقاً وتوثيق الشروط آلياً." 
                  : "Share it in your bio or with businesses; your fees are collected upfront and terms are automated."}
              </p>
            </div>
          </div>
        </section>

        {/* 2.5 Schedule & Availability Management Card */}
        <section className="rounded-2xl border bg-card p-6 shadow-soft md:p-8">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            {isAr ? "إدارة الجدول الزمني والمواعيد" : "Schedule & Availability Management"}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">
                {isAr ? "أقصى عدد تغطيات مسموح بها في اليوم الواحد" : "Daily Capacity Limit"}
              </label>
              <select
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-lg border bg-background p-2.5 text-sm outline-none focus:border-primary font-bold"
              >
                <option value="1">{isAr ? "1 تغطية يومياً" : "1 coverage per day"}</option>
                <option value="2">{isAr ? "2 تغطيات يومياً" : "2 coverages per day"}</option>
                <option value="3">{isAr ? "3 تغطيات يومياً" : "3 coverages per day"}</option>
              </select>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                {isAr
                  ? "بمجرد قبولك لهذا العدد في تاريخ معين، سيتم إغلاق ذلك اليوم تلقائياً أمام المتاجر الأخرى لمنع تراكم الطلبات."
                  : "Once this limit is reached for a specific date, that day is automatically blocked for future bookings."}
              </p>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">
                {isAr ? "إجازات أسبوعية ثابتة" : "Weekly Days Off"}
              </label>
              <div className="flex flex-wrap gap-2">
                {allDays.map((d) => (
                  <button
                    key={d.en}
                    onClick={() => toggleDay(d.en)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                      daysOff.includes(d.en) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {isAr ? d.ar : d.en}
                    {daysOff.includes(d.en) && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                {isAr
                  ? "الأيام المحددة ستكون غير متاحة للحجوزات الجديدة."
                  : "Selected days will be unavailable for new bookings."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">
                {isAr ? "الحد الأدنى للميزانية (سري)" : "Minimum Budget Threshold (Confidential)"}
              </label>
              <div className="flex items-center rounded-lg border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <input
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="num w-full bg-transparent px-3 py-2 text-sm font-bold outline-none"
                  dir="ltr"
                />
                <span className="px-3 text-xs text-muted-foreground">{isAr ? "د.ب" : "BHD"}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                {isAr
                  ? "المتاجر بميزانيات أقل من هذا الرقم لن تشاهد حسابك في نتائج البحث."
                  : "Merchants with lower budgets will not see your profile in search."}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Financial Escrow Hub */}
        <section className="grid gap-4 sm:grid-cols-3 2xl:gap-8">
          <div className="rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift 2xl:p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">
                {isAr ? "أرباح محجوزة في الضمان" : "Secured in Escrow"}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-soft text-warning">
                <Lock className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="num mt-3 text-3xl font-extrabold 2xl:mt-5 2xl:text-4xl text-foreground">
              150.000 <span className="text-base font-semibold text-muted-foreground">{isAr ? "د.ب" : "BHD"}</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {isAr ? "حملة واحدة بانتظار نشر التغطية" : "1 campaign awaiting coverage"}
            </p>
          </div>
          
          <div className="rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift 2xl:p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">
                {isAr ? "الرصيد المتاح للسحب" : "Available for Payout"}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-soft text-success">
                <Wallet className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="num mt-3 text-3xl font-extrabold text-success 2xl:mt-5 2xl:text-4xl">
              450.000 <span className="text-base font-semibold">{isAr ? "د.ب" : "BHD"}</span>
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {isAr ? "أرباح مكتملة ومعتمدة" : "Completed and approved earnings"}
              </p>
              <button onClick={() => toast.info(isAr ? "يتم التحويل لـ Fawri+" : "Processing Fawri+ Transfer")} className="rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground hover:bg-success/90">
                {isAr ? "سحب الأرباح" : "Withdraw"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift 2xl:p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">
                {isAr ? "مؤشر الموثوقية" : "Reliability Score"}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky/10 text-sky">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="num mt-3 text-3xl font-extrabold 2xl:mt-5 2xl:text-4xl text-foreground">
              98%
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {isAr ? "42 حملة مكتملة، 0 تأخير" : "42 completed campaigns, 0 delays"}
            </p>
          </div>
        </section>

        {/* 4. Campaign Management Board */}
        <section className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto border-b pb-px scrollbar-hide">
            <button
              onClick={() => setTab("new")}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === "new" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {isAr ? "طلبات واردة جديدة" : "New Requests"}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {campaignStatus === "new" ? "1" : "0"}
              </span>
            </button>
            <button
              onClick={() => setTab("active")}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === "active" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {isAr ? "قيد التنفيذ والمجدولة" : "Active & Scheduled"}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] text-foreground">
                {campaignStatus === "accepted" ? "2" : "1"}
              </span>
            </button>
            <button
              onClick={() => setTab("completed")}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === "completed" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {isAr ? "حملات مكتملة" : "Completed History"}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] text-foreground">
                42
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {tab === "new" && (
              <div className="space-y-4">
                {campaignStatus === "new" ? (
                  <div className="rounded-2xl border bg-card p-6 shadow-soft md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white font-bold">
                            FB
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">
                              {isAr ? "شركة فليم برجر ذ.م.م" : "Flame Burger Co."}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {isAr ? "Burger & Casual Dining" : "Burger & Casual Dining"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-sm font-medium text-foreground">
                          <span className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span dir="ltr">15 Oct 2026</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-start md:text-end">
                        <p className="text-sm font-semibold text-muted-foreground">
                          {isAr ? "أتعابك المضمونة" : "Secured Payout"}
                        </p>
                        <p className="num mt-1 text-2xl font-extrabold text-foreground">
                          150.000 {isAr ? "د.ب" : "BHD"}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
                          <Lock className="h-3.5 w-3.5" />
                          {isAr ? "أتعابك مضمونة 100% في محفظة ڤلوب" : "100% Guaranteed in Vloop Escrow"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border bg-surface p-5">
                      <h4 className="mb-4 text-sm font-bold text-foreground flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        {isAr ? "المخرجات المطلوبة (Brief)" : "Deliverables Checklist"}
                      </h4>
                      <ul className="space-y-3">
                        {[
                          isAr ? "3 لقطات ستوري إنستغرام تغطي تحضير الوجبات والأجواء الداخلية." : "3 Instagram Story shots covering food prep and interior.",
                          isAr ? "الإشارة للحساب الرسمي (@flame_burger) وإرفاق ملصق رابط القسيمة." : "Mention (@flame_burger) and attach voucher link sticker.",
                          isAr ? "إبراز عرض وجبة برجر الغداء بسعر 2.5 د.ب." : "Highlight the 2.5 BHD lunch burger combo."
                        ].map((req, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                      <button
                        onClick={() => setDeclineModal(true)}
                        className="rounded-xl border border-destructive px-6 py-3 text-sm font-bold text-destructive transition hover:bg-destructive/10"
                      >
                        {isAr ? "اعتذار عن الطلب" : "Decline"}
                      </button>
                      <button
                        onClick={handleAccept}
                        className="rounded-xl bg-[#2563eb] px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-[#1d4ed8]"
                      >
                        {isAr ? "قبول الحجز" : "Accept Campaign"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed text-muted-foreground">
                    <CheckCircle2 className="mb-4 h-12 w-12 text-muted" />
                    <p>{isAr ? "لا توجد طلبات جديدة حالياً" : "No new requests at the moment"}</p>
                  </div>
                )}
              </div>
            )}

            {tab === "active" && (
              <div className="space-y-4">
                {campaignStatus === "accepted" && (
                  <div className="rounded-2xl border bg-card p-6 shadow-soft">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white font-bold shrink-0">
                          FB
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">
                            {isAr ? "شركة فليم برجر ذ.م.م (وجبات سريعة)" : "Flame Burger Co. (Fast Food)"}
                          </h3>
                          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-sm">
                            <p className="text-muted-foreground">
                              {isAr ? "الموعد المجدول:" : "Scheduled Date:"} <span className="font-semibold text-foreground">15 {isAr ? "أكتوبر" : "Oct"} 2026</span>
                            </p>
                            <span className="hidden sm:inline text-muted-foreground">•</span>
                            <p className="text-muted-foreground">
                              {isAr ? "صافي الأتعاب المضمونة:" : "Secured Payout:"} <span className="num font-bold text-foreground">150.000 {isAr ? "د.ب" : "BHD"}</span> <span className="text-xs text-muted-foreground">({isAr ? "محجوزة في الضمان" : "In Escrow"})</span>
                            </p>
                          </div>
                          <span className="mt-3 inline-flex items-center rounded-full bg-warning-soft px-3 py-1 text-xs font-bold text-warning">
                            <Clock className="mr-1.5 h-3.5 w-3.5" />
                            {isAr ? "مجدولة" : "Scheduled"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setProofModal(true)}
                        className="rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background transition hover:bg-foreground/90 shrink-0"
                      >
                        {isAr ? "🚀 رفع إثبات النشر" : "🚀 Submit Proof"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border bg-card p-6 shadow-soft">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold shrink-0">
                        BC
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">
                          {isAr ? "مقهى برو أند كو (قهوة مختصة)" : "Brew & Co. Cafe (Specialty Coffee)"}
                        </h3>
                        <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-sm">
                          <p className="text-muted-foreground">
                            {isAr ? "الموعد المجدول:" : "Scheduled Date:"} <span className="font-semibold text-foreground">{isAr ? "اليوم، 10 أكتوبر 2026" : "Today, 10 Oct 2026"}</span>
                          </p>
                          <span className="hidden sm:inline text-muted-foreground">•</span>
                          <p className="text-muted-foreground">
                            {isAr ? "صافي الأتعاب المضمونة:" : "Secured Payout:"} <span className="num font-bold text-foreground">120.000 {isAr ? "د.ب" : "BHD"}</span> <span className="text-xs text-muted-foreground">({isAr ? "محجوزة في الضمان" : "In Escrow"})</span>
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center rounded-full bg-warning-soft px-3 py-1 text-xs font-bold text-warning">
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          {isAr ? "مجدولة" : "Scheduled"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setProofModal(true)}
                      className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 shrink-0"
                    >
                      {isAr ? "🚀 رفع إثبات النشر" : "🚀 Submit Proof"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "completed" && (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed text-muted-foreground">
                <CheckCircle2 className="mb-4 h-12 w-12 text-muted" />
                <p>{isAr ? "تم إنجاز 42 حملة بنجاح" : "42 campaigns completed successfully"}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Decline Modal */}
      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {isAr ? "سبب الاعتذار عن الحملة" : "Decline Reason"}
              </h3>
              <button onClick={() => setDeclineModal(false)} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mb-1 h-5 w-5" />
              {isAr 
                ? "سيتم إلغاء الحجز وإعادة مبلغ الضمان إلى محفظة المتجر فوراً."
                : "The booking will be cancelled and the escrow amount returned to the merchant instantly."}
            </div>

            <div className="space-y-3">
              {[
                isAr ? "الميزانية لا تناسب حجم ومستوى المتجر (طلب تسعيرة خاصة)." : "Budget does not match brand requirements.",
                isAr ? "تضارب في المواعيد / الجدول ممتلئ في هذا اليوم." : "Schedule conflict / fully booked.",
                isAr ? "محتوى العرض لا يتناسب مع طبيعة وأسلوب حسابي." : "Content doesn't align with my style.",
                isAr ? "سبب آخر (حقل نصي إضافي)." : "Other (specify)."
              ].map((reason, i) => (
                <label key={i} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
                  <input type="radio" name="decline" className="mt-0.5" defaultChecked={i === 0} />
                  <span className="text-sm font-medium text-foreground">{reason}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeclineModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  setDeclineModal(false);
                  setCampaignStatus("declined");
                  toast.success(isAr ? "تم الاعتذار بنجاح" : "Declined successfully");
                }}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:bg-destructive/90"
              >
                {isAr ? "تأكيد الاعتذار واسترداد الضمان" : "Confirm Decline & Refund Escrow"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Submission Modal */}
      {proofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {isAr ? "رفع إثبات النشر" : "Submit Proof of Delivery"}
              </h3>
              <button onClick={() => setProofModal(false)} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
              {isAr 
                ? "بمجرد تقديم الروابط، تبدأ مهلة الـ 24 ساعة للتاجر لاعتماد الإعلان وتحرير أتعابك فوراً."
                : "Once links are submitted, the 24h approval period starts to release your funds."}
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  {isAr ? "رابط ستوري إنستغرام" : "Instagram Story URL"}
                </label>
                <div className="flex items-center rounded-lg border bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input type="url" placeholder="https://instagram.com/..." className="w-full bg-transparent p-2.5 text-sm outline-none" dir="ltr" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  {isAr ? "رابط فيديو تيك توك (اختياري)" : "TikTok Video URL (Optional)"}
                </label>
                <div className="flex items-center rounded-lg border bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input type="url" placeholder="https://tiktok.com/..." className="w-full bg-transparent p-2.5 text-sm outline-none" dir="ltr" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setProofModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={submitProof}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
                {isAr ? "إرسال الإثبات وبدء مهلة الاعتماد" : "Submit & Start Approval"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
