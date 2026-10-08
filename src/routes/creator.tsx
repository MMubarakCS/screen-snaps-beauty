import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Copy,
  Wallet,
  CheckCircle2,
  ChevronDown,
  X,
  Link as LinkIcon,
  ShieldCheck,
  Check,
  Lock,
  Clock,
  ArrowUpRight,
  BadgeCheck,
  AlertCircle,
  Calendar,
  CalendarRange,
  Send,
  Pencil,
} from "lucide-react";
import { useLang } from "@/components/vloop/Shell";
import { fmtBHD } from "@/lib/vloop-data";
import { toast } from "sonner";
import { CreatorPayoutModal } from "@/components/vloop/CreatorPayoutModal";
import c2 from "@/assets/creator-2.jpg";

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [{ title: "Vloop | ڤلوب — Creator Business Suite" }],
  }),
  component: CreatorPage,
});

function CreatorPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [copiedBio, setCopiedBio] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [copiedVoucherLink, setCopiedVoucherLink] = useState(false);
  const [creatorAvatarPreview, setCreatorAvatarPreview] = useState<string | null>(null);
  const [creatorCoverPreview, setCreatorCoverPreview] = useState<string | null>(null);
  const verifiedStats = { followers: "62K", storyViews: "11.8K" };
  const [tab, setTab] = useState<"new" | "active" | "completed">("new");
  const [threshold, setThreshold] = useState("150.000");

  // Modals
  const [declineModal, setDeclineModal] = useState(false);
  const [proofModal, setProofModal] = useState(false);

  // States for campaign
  const [campaignStatus, setCampaignStatus] = useState<"new" | "accepted" | "declined">("new");

  // Decline modal states
  const [declineReason, setDeclineReason] = useState(0);
  const [otherReasonText, setOtherReasonText] = useState("");

  // Blackout / Vacation dates
  const [blackoutDates, setBlackoutDates] = useState<{ from: string; to: string }[]>([
    { from: "2026-11-10", to: "2026-11-15" },
  ]);
  const [isAddingBlackout, setIsAddingBlackout] = useState(false);
  const [newBlackoutFrom, setNewBlackoutFrom] = useState("");
  const [newBlackoutTo, setNewBlackoutTo] = useState("");

  useEffect(() => {
    const handleProfileImageSelected = (event: Event) => {
      const { kind, file } = (event as CustomEvent<{ kind: "avatar" | "cover"; file: File }>)
        .detail;
      const previewUrl = URL.createObjectURL(file);
      if (kind === "avatar") setCreatorAvatarPreview(previewUrl);
      else setCreatorCoverPreview(previewUrl);
    };

    window.addEventListener("creator-profile-image-selected", handleProfileImageSelected);
    return () =>
      window.removeEventListener("creator-profile-image-selected", handleProfileImageSelected);
  }, []);

  useEffect(() => {
    if (!creatorAvatarPreview) return;
    return () => URL.revokeObjectURL(creatorAvatarPreview);
  }, [creatorAvatarPreview]);

  useEffect(() => {
    if (!creatorCoverPreview) return;
    return () => URL.revokeObjectURL(creatorCoverPreview);
  }, [creatorCoverPreview]);

  // Campaign platforms (simulated from brief)
  const campaignPlatforms: ("instagram" | "tiktok" | "snapchat")[] = ["instagram", "tiktok"];
  const proofPlatformFields = {
    instagram: {
      label: isAr ? "رابط ستوري إنستغرام" : "Instagram Story URL",
      placeholder: "https://instagram.com/...",
    },
    tiktok: {
      label: isAr ? "رابط فيديو تيك توك" : "TikTok Video URL",
      placeholder: "https://tiktok.com/...",
    },
    snapchat: {
      label: isAr ? "رابط ستوري سناب شات" : "Snapchat Story URL",
      placeholder: "https://snapchat.com/...",
    },
  };

  // Schedule Management States
  const [daysOff, setDaysOff] = useState<string[]>(["الجمعة", "السبت"]);
  const [capacity, setCapacity] = useState("1");
  const allDays = [
    { ar: "الجمعة", en: "Friday" },
    { ar: "السبت", en: "Saturday" },
    { ar: "الأحد", en: "Sunday" },
    { ar: "الإثنين", en: "Monday" },
    { ar: "الثلاثاء", en: "Tuesday" },
    { ar: "الأربعاء", en: "Wednesday" },
    { ar: "الخميس", en: "Thursday" },
  ];

  const toggleDay = (day: string) => {
    setDaysOff((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const copyToClipboard = async (text: string, successMessage: string): Promise<boolean> => {
    if (!text) return false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage);
        return true;
      }
    } catch (error) {
      console.warn("navigator.clipboard failed, falling back to execCommand", error);
    }

    let textArea: HTMLTextAreaElement | null = null;
    try {
      textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      if (successful) {
        toast.success(successMessage);
        return true;
      }

      toast.error(
        isAr ? "تعذر النسخ. يرجى المحاولة مرة أخرى." : "Unable to copy. Please try again.",
      );
      return false;
    } catch (error) {
      console.error("Fallback copy failed", error);
      toast.error(
        isAr ? "تعذر النسخ. يرجى المحاولة مرة أخرى." : "Unable to copy. Please try again.",
      );
      return false;
    } finally {
      textArea?.remove();
    }
  };

  const copyBioLink = async () => {
    const copied = await copyToClipboard(
      "https://vloop.me/@yousif.bites",
      isAr ? "تم نسخ الرابط!" : "Link copied!",
    );
    if (!copied) return;
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2000);
  };

  const copyCampaignAsset = async (value: string, asset: "code" | "link") => {
    const copied = await copyToClipboard(
      value,
      isAr
        ? asset === "code"
          ? "تم نسخ الكود بنجاح"
          : "تم نسخ رابط ملصق الستوري بنجاح"
        : asset === "code"
          ? "Promo code copied successfully"
          : "Story sticker link copied successfully",
    );
    if (!copied) return;
    if (asset === "code") setCopiedVoucher(true);
    else setCopiedVoucherLink(true);
    window.setTimeout(() => {
      if (asset === "code") setCopiedVoucher(false);
      else setCopiedVoucherLink(false);
    }, 2000);
  };

  const handleAccept = () => {
    setCampaignStatus("accepted");
    setTab("active");
    toast.success(isAr ? "تم قبول الحجز بنجاح" : "Campaign accepted successfully");
  };

  const submitProof = () => {
    setProofModal(false);
    toast.success(
      isAr
        ? "تم إرسال الإثبات بنجاح وبدأت مهلة الاعتماد"
        : "Proof submitted, approval period started",
    );
  };

  const openProfileModal = () => {
    window.dispatchEvent(new CustomEvent("open-creator-profile-modal"));
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="mx-auto w-[92%] max-w-[1680px] space-y-8 px-4 py-8 lg:px-8 2xl:space-y-12 2xl:py-12">
        {/* ================= CREATOR PROFILE HEADER ================= */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {/* Cover */}
          <div
            className="h-28 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-cover bg-center sm:h-36"
            style={
              creatorCoverPreview ? { backgroundImage: `url("${creatorCoverPreview}")` } : undefined
            }
          />

          {/* Profile Details */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3.5 text-start sm:gap-4">
                <img
                  src={creatorAvatarPreview ?? c2}
                  alt={isAr ? "يوسف المناعي" : "Yousif Al-Mannai"}
                  className="size-16 shrink-0 rounded-full border-2 border-border bg-muted object-cover sm:size-20"
                />
                <div className="flex min-w-0 flex-col items-start text-start">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-lg font-bold leading-tight text-foreground sm:text-2xl">
                      {isAr ? "يوسف المناعي" : "Yousif Al-Mannai"}
                    </h1>
                    <BadgeCheck className="size-4 shrink-0 text-primary sm:size-5" />
                  </div>
                  <span
                    className="mt-0.5 text-xs font-medium text-muted-foreground sm:text-sm"
                    style={{ direction: "ltr", unicodeBidi: "isolate" }}
                  >
                    @yousif.bites
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={openProfileModal}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted sm:w-fit sm:text-sm"
              >
                <Pencil className="size-3.5" />
                {isAr ? "تعديل الميديا كيت" : "Edit Media Kit"}
              </button>
            </div>

            {/* Social Accounts and Stats */}
            <div className="mt-5 flex flex-col justify-between gap-3 border-t border-border pt-4 text-xs md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 font-medium text-muted-foreground">
                  Instagram:{" "}
                  <strong className="text-foreground" dir="ltr">
                    @yousif.bites
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 font-medium text-muted-foreground">
                  TikTok:{" "}
                  <strong className="text-foreground" dir="ltr">
                    @yousif.vlogs
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 font-medium text-muted-foreground">
                  Snapchat:{" "}
                  <strong className="text-foreground" dir="ltr">
                    @yousif_snap
                  </strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-bold text-slate-700">
                  {isAr
                    ? `${verifiedStats?.followers ?? "62K"} متابع`
                    : `${verifiedStats?.followers ?? "62K"} followers`}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-bold text-slate-700">
                  {isAr
                    ? `${verifiedStats?.storyViews ?? "11.8K"} مشاهدات الستوري`
                    : `${verifiedStats?.storyViews ?? "11.8K"} story views`}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                  {isAr ? "إحصائيات موثقة" : "Verified stats"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Top Summary & Bio-Link Hub */}
        <section className="rounded-2xl border bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
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

            <div className="w-full rounded-xl border bg-surface p-4 md:w-72">
              <label className="mb-2 block text-sm font-bold text-foreground flex items-center gap-2">
                {isAr ? "الحد الأدنى للميزانية (سري)" : "Minimum Budget (Confidential)"}
              </label>
              <div className="flex items-center rounded-lg border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">
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

        {/* Schedule & Availability Management Card */}
        <section className="rounded-2xl border bg-card p-6 shadow-soft md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {isAr ? "إدارة الجدول الزمني والمواعيد" : "Schedule & Availability Management"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                {isAr ? "أقصى عدد تغطيات مسموح بها في اليوم الواحد" : "Daily Capacity Limit"}
              </label>
              <div className="relative w-max">
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="appearance-none rounded-lg border bg-background px-4 py-2.5 pe-10 text-sm font-bold outline-none focus:border-primary"
                >
                  <option value="1">
                    {isAr ? "1 تغطية يومياً (تغطية حصرية)" : "1 campaign per day"}
                  </option>
                  <option value="2">{isAr ? "2 تغطيات يومياً" : "2 campaigns per day"}</option>
                  <option value="3">{isAr ? "3 تغطيات يومياً" : "3 campaigns per day"}</option>
                  <option value="4">{isAr ? "4 تغطيات يومياً" : "4 campaigns per day"}</option>
                  <option value="unlimited">
                    {isAr ? "غير محدود (بدون حد أقصى)" : "Unlimited (no daily cap)"}
                  </option>
                </select>
                <ChevronDown className="absolute end-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                {isAr
                  ? "اختر الحد الأقصى للطلبات التي تستطيع تنفيذها يومياً؛ عند اختيار رقم محدد سيتم إغلاق ذلك اليوم تلقائياً فور اكتماله، أو اختر 'غير محدود' لإبقاء التقويم متاحاً دائماً."
                  : "Choose the maximum number of requests you can fulfill daily. When a specific number is selected, that day will automatically close once it is reached, or choose 'Unlimited' to keep the calendar always available."}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                {isAr ? "إجازات أسبوعية ثابتة (أيام لا تستقبل فيها طلبات)" : "Weekly Days Off"}
              </label>
              <div className="flex flex-wrap gap-2">
                {allDays.map((day) => {
                  const isOff = daysOff.includes(day.ar);
                  return (
                    <button
                      key={day.en}
                      onClick={() => toggleDay(day.ar)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                        isOff
                          ? "bg-foreground text-background"
                          : "border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      {isAr ? day.ar : day.en}
                      {isOff && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr
                  ? "لن تتمكن المتاجر من اختيار هذه الأيام عند حجز حملة معك."
                  : "Merchants won't be able to select these days when booking a campaign with you."}
              </p>
            </div>

            {/* Blackout / Vacation Dates */}
            <div className="space-y-3 md:col-span-2 pt-4 border-t">
              <label className="block text-sm font-bold text-foreground">
                {isAr ? "حظر تواريخ محددة (إجازة أو سفر)" : "Specific Blackout Dates"}
              </label>
              <div className="space-y-2">
                {blackoutDates.map((range, idx) => {
                  const fromDate = new Date(range.from);
                  const toDate = new Date(range.to);
                  const fmtDate = (d: Date) => {
                    const months = isAr
                      ? [
                          "يناير",
                          "فبراير",
                          "مارس",
                          "أبريل",
                          "مايو",
                          "يونيو",
                          "يوليو",
                          "أغسطس",
                          "سبتمبر",
                          "أكتوبر",
                          "نوفمبر",
                          "ديسمبر",
                        ]
                      : [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ];
                    return `${d.getDate()} ${months[d.getMonth()]}`;
                  };
                  return (
                    <div
                      key={`${range.from}-${range.to}-${idx}`}
                      className="flex items-center gap-2"
                    >
                      <span className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground">
                        {isAr ? "✈️ فترة إجازة:" : "✈️ Vacation:"} {fmtDate(fromDate)} –{" "}
                        {fmtDate(toDate)}
                      </span>
                      <button
                        onClick={() => setBlackoutDates((prev) => prev.filter((_, i) => i !== idx))}
                        className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                        aria-label={isAr ? "حذف فترة الإجازة" : "Remove vacation period"}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
                {!isAddingBlackout ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingBlackout(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {isAr ? "+ إضافة فترة إجازة جديدة" : "+ Add Blackout Period"}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label
                        htmlFor="blackout-start"
                        className="mb-1.5 block text-xs font-semibold text-foreground"
                      >
                        {isAr ? "من تاريخ" : "Start Date"}
                      </label>
                      <input
                        id="blackout-start"
                        type="date"
                        value={newBlackoutFrom}
                        onChange={(event) => setNewBlackoutFrom(event.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="blackout-end"
                        className="mb-1.5 block text-xs font-semibold text-foreground"
                      >
                        {isAr ? "إلى تاريخ" : "End Date"}
                      </label>
                      <input
                        id="blackout-end"
                        type="date"
                        min={newBlackoutFrom || undefined}
                        value={newBlackoutTo}
                        onChange={(event) => setNewBlackoutTo(event.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBlackoutFrom || !newBlackoutTo) {
                          toast.error(
                            isAr
                              ? "يرجى اختيار تاريخ البداية والنهاية"
                              : "Select both a start and end date",
                          );
                          return;
                        }
                        if (newBlackoutTo < newBlackoutFrom) {
                          toast.error(
                            isAr
                              ? "يجب أن يكون تاريخ النهاية بعد تاريخ البداية"
                              : "End date must be on or after the start date",
                          );
                          return;
                        }
                        setBlackoutDates((ranges) => [
                          ...ranges,
                          { from: newBlackoutFrom, to: newBlackoutTo },
                        ]);
                        setNewBlackoutFrom("");
                        setNewBlackoutTo("");
                        setIsAddingBlackout(false);
                      }}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      {isAr ? "حفظ الإجازة / Add" : "Add / حفظ الإجازة"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingBlackout(false);
                        setNewBlackoutFrom("");
                        setNewBlackoutTo("");
                      }}
                      className="rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isAr
                  ? "لن يتمكن أي متجر من حجز هذه التواريخ."
                  : "No merchant will be able to book these dates."}
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
              150.000{" "}
              <span className="text-base font-semibold text-muted-foreground">
                {isAr ? "د.ب" : "BHD"}
              </span>
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
              <button
                onClick={() => setPayoutOpen(true)}
                className="rounded-full bg-success px-3 py-1 text-xs font-bold text-background hover:bg-success/90"
              >
                {isAr ? "سحب الأرباح (Fawri+ IBAN)" : "Withdraw (Fawri+ IBAN)"}
              </button>
              {payoutOpen && (
                <CreatorPayoutModal available={450} onClose={() => setPayoutOpen(false)} />
              )}
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
                tab === "new"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
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
                tab === "active"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
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
                tab === "completed"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
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
                            <span>{isAr ? "15 أكتوبر 2026" : "Oct 15, 2026"}</span>
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
                          {isAr
                            ? "أتعابك مضمونة 100% في محفظة ڤلوب"
                            : "100% Guaranteed in Vloop Escrow"}
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
                          isAr
                            ? "3 لقطات ستوري إنستغرام تغطي تحضير الوجبات والأجواء الداخلية."
                            : "3 Instagram Story shots covering food prep and interior.",
                          isAr
                            ? "الإشارة للحساب الرسمي (@flame_burger) وإرفاق ملصق رابط القسيمة."
                            : "Mention (@flame_burger) and attach voucher link sticker.",
                          isAr
                            ? "إبراز عرض وجبة برجر الغداء بسعر 2.5 د.ب."
                            : "Highlight the 2.5 BHD lunch burger combo.",
                        ].map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
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
                  <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-soft">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-start gap-3.5">
                        <div className="size-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                          FB
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-foreground">
                            {isAr ? "شركة فليم برجر ذ.م.م" : "Flame Burger Co."}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>
                              {isAr ? "📅 الموعد: 15 أكتوبر 2026" : "📅 Date: Oct 15, 2026"}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-600">
                              {isAr
                                ? "💰 150.000 د.ب (محجوز بالضمان)"
                                : "💰 150.000 BHD (in escrow)"}
                            </span>
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              {isAr ? "مجدولة" : "Scheduled"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setProofModal(true)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
                      >
                        🚀 {isAr ? "رفع إثبات النشر" : "Submit Proof"}
                      </button>
                    </div>

                    <div className="space-y-3 rounded-xl border bg-surface p-4">
                      <h5 className="text-sm font-bold">
                        {isAr ? "الأصول الترويجية للحملة" : "Campaign Promotional Assets"}
                      </h5>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {isAr ? "الكود الترويجي للحملة" : "Campaign Promo Code"}
                            </p>
                            <p dir="ltr" className="mt-1 font-mono font-bold tracking-wider">
                              FLAME20
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void copyCampaignAsset("FLAME20", "code")}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary"
                          >
                            {copiedVoucher ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {isAr ? "نسخ الكود" : "Copy Code"}
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">
                              {isAr ? "رابط القسيمة للستوري" : "Story Voucher Link"}
                            </p>
                            <p dir="ltr" className="mt-1 truncate text-sm font-medium">
                              https://vloop.me/c/flame20
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              void copyCampaignAsset("https://vloop.me/c/flame20", "link")
                            }
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary"
                          >
                            {copiedVoucherLink ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {isAr ? "نسخ رابط ملصق الستوري" : "Copy Link"}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {isAr
                          ? "أرفق هذا الرابط في ملصق الستوري ليتمكن المتابعون من حجز قسائم الخصم."
                          : "Attach this link in the Story sticker so followers can claim discount vouchers."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border bg-card shadow-soft">
                  <div className="flex items-start gap-3.5">
                    <div className="size-11 rounded-xl bg-sky/10 flex items-center justify-center font-bold text-sky shrink-0">
                      BC
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-foreground">
                        {isAr ? "مقهى برو آند كو" : "Brew & Co. Cafe"}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{isAr ? "📅 الموعد: 10 أكتوبر 2026" : "📅 Date: Oct 10, 2026"}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">
                          {isAr ? "💰 120.000 د.ب (محجوز بالضمان)" : "💰 120.000 BHD (in escrow)"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium">
                          {isAr ? "مجدولة" : "Scheduled"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setProofModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-soft hover:bg-primary/90 shrink-0"
                  >
                    🚀 {isAr ? "رفع إثبات النشر" : "Submit Proof"}
                  </button>
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
              <button
                onClick={() => setDeclineModal(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted"
              >
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
                isAr
                  ? "الميزانية لا تناسب حجم ومستوى المتجر (طلب تسعيرة خاصة)."
                  : "Budget does not match brand requirements.",
                isAr
                  ? "تضارب في المواعيد / الجدول ممتلئ في هذا اليوم."
                  : "Schedule conflict / fully booked.",
                isAr
                  ? "محتوى العرض لا يتناسب مع طبيعة وأسلوب حسابي."
                  : "Content doesn't align with my style.",
                isAr ? "سبب آخر" : "Other",
              ].map((reason, i) => (
                <label
                  key={i}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${declineReason === i ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                >
                  <input
                    type="radio"
                    name="decline"
                    className="mt-0.5"
                    checked={declineReason === i}
                    onChange={() => {
                      setDeclineReason(i);
                      if (i !== 3) setOtherReasonText("");
                    }}
                  />
                  <span className="text-sm font-medium text-foreground">{reason}</span>
                </label>
              ))}
            </div>

            {declineReason === 3 && (
              <div className="mt-3">
                <textarea
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                  placeholder={
                    isAr
                      ? "يرجى كتابة سبب الاعتذار بالتفصيل (إلزامي)..."
                      : "Please describe your reason in detail (required)..."
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeclineModal(false);
                  setDeclineReason(0);
                  setOtherReasonText("");
                }}
                className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                disabled={declineReason === 3 && otherReasonText.trim().length < 3}
                onClick={() => {
                  setDeclineModal(false);
                  setCampaignStatus("declined");
                  setDeclineReason(0);
                  setOtherReasonText("");
                  toast.success(isAr ? "تم الاعتذار بنجاح" : "Declined successfully");
                }}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
              <button
                onClick={() => setProofModal(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "بمجرد تقديم الروابط، تبدأ مهلة الـ 24 ساعة للتاجر لاعتماد الإعلان وتحرير أتعابك فوراً."
                : "Once links are submitted, the 24h approval period starts to release your funds."}
            </p>

            <div className="space-y-4">
              {campaignPlatforms.map((platform) => {
                const field = proofPlatformFields[platform];

                return (
                  <div key={platform}>
                    <label className="mb-1.5 block text-xs font-semibold text-foreground">
                      {field.label}
                    </label>
                    <div className="flex items-center rounded-lg border bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <input
                        type="url"
                        placeholder={field.placeholder}
                        className="w-full bg-transparent p-2.5 text-sm outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>
                );
              })}
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
