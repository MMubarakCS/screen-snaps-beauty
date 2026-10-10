import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Lock,
  Calendar,
  ExternalLink,
  Ticket,
  Hourglass,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  CheckCircle2,
  Timer,
  Footprints,
  CalendarClock,
  FileText,
  ShieldCheck,
  Instagram,
  Video,
} from "lucide-react";
import { useLang } from "@/components/vloop/Shell";
import { creators, fmtBHD, type L } from "@/lib/vloop-data";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "My Campaigns & Reviews — Vloop | ڤلوب" },
      {
        name: "description",
        content:
          "Track escrow status, review proof links and monitor live in-store footfall for your Vloop campaigns.",
      },
      { property: "og:title", content: "My Campaigns & Reviews — Vloop" },
      {
        property: "og:description",
        content: "Escrow-protected influencer campaigns with a 24-hour settlement engine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Campaigns,
});

const yousif = creators[1]!;
const fatima = creators[0]!;
const noor = creators[2]!;

const deliverables: L[] = [
  {
    ar: "الإشارة إلى الحساب الرسمي (@flame_burger) وإرفاق ملصق رابط القسيمة.",
    en: "Mention the official account (@flame_burger) and the voucher link sticker.",
  },
  {
    ar: "تصوير واجهة المحل والديكورات الداخلية وأجواء الجلوس.",
    en: "Film the storefront, interior décor and seating ambiance.",
  },
  {
    ar: "تصوير وجبة برجر الغداء ساخنة وتجربتها.",
    en: "Film the lunch burger served hot and taste it.",
  },
];

const TOTAL = 24 * 3600;
const START = 18 * 3600 + 24 * 60;

function Campaigns() {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  const [tab, setTab] = useState<"review" | "scheduled" | "completed">("review");
  const [left, setLeft] = useState(START);
  const [status, setStatus] = useState<"pending" | "released" | "disputed">("pending");
  const [open, setOpen] = useState(true);
  const [dispute, setDispute] = useState(false);
  const [toast, setToast] = useState<L | null>(null);
  const [briefModal, setBriefModal] = useState(false);
  const [completedPage, setCompletedPage] = useState(1);
  const COMPLETED_PER_PAGE = 5;

  useEffect(() => {
    if (status !== "pending") return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [status]);

  const showToast = (m: L) => {
    setToast(m);
    setTimeout(() => setToast(null), 3500);
  };

  const h = Math.floor(left / 3600),
    m = Math.floor((left % 3600) / 60),
    s = left % 60;
  const pct = ((TOTAL - left) / TOTAL) * 100;
  const reviewCount = status === "pending" ? 1 : 0;

  const summary = [
    {
      icon: Timer,
      label: { ar: "حملات قيد المراجعة", en: "Under Review" },
      value: String(reviewCount),
      badge: status === "pending" ? { ar: "مؤقت 24 ساعة نشط", en: "24h timer active" } : null,
      tone: "text-warning bg-warning-soft",
    },
    {
      icon: CalendarClock,
      label: { ar: "حملات مجدولة", en: "Scheduled" },
      value: "2",
      sub: `${tr({ ar: "إجمالي في الضمان:", en: "Total in Escrow:" })} ${fmtBHD(300, lang)}`,
      tone: "text-primary bg-accent",
    },
    {
      icon: Footprints,
      label: { ar: "إجمالي الزيارات المحققة", en: "Total Footfall" },
      value: "1,280",
      unit: tr({ ar: "زائر موثق", en: "verified visitors" }),
      tone: "text-success bg-success-soft",
    },
  ];

  const tabs = [
    {
      id: "review" as const,
      label: { ar: `قيد المراجعة والموافقة (${reviewCount})`, en: `In Review (${reviewCount})` },
    },
    { id: "scheduled" as const, label: { ar: "مجدولة وبانتظار النشر (2)", en: "Scheduled (2)" } },
    {
      id: "completed" as const,
      label: {
        ar: `حملات مكتملة (${status === "released" ? 15 : 14})`,
        en: `Completed (${status === "released" ? 15 : 14})`,
      },
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 overflow-x-hidden px-4 py-8 sm:px-6 2xl:space-y-12 2xl:py-12">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl 2xl:text-5xl">
          {tr({ ar: "إدارة ومتابعة الحملات", en: "My Campaigns & Reviews" })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground 2xl:mt-3 2xl:text-lg">
          {tr({
            ar: "تتبع حالة الضمان المالي، مراجعة روابط المحتوى، ومراقبة زيارات المتجر الميدانية.",
            en: "Track escrow status, review proof links, and monitor live in-store footfall.",
          })}
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 2xl:gap-8">
        {summary.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift 2xl:p-8"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground 2xl:text-base">
                {tr(c.label)}
              </p>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg 2xl:h-12 2xl:w-12 ${c.tone}`}
              >
                <c.icon className="h-4.5 w-4.5 2xl:h-6 2xl:w-6" />
              </span>
            </div>
            <p className="num mt-3 text-3xl font-extrabold 2xl:mt-5 2xl:text-5xl">
              {c.value}{" "}
              {c.unit && (
                <span className="text-base font-semibold text-muted-foreground 2xl:text-xl">
                  {c.unit}
                </span>
              )}
            </p>
            {c.sub && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground 2xl:text-sm">
                {c.sub}
              </p>
            )}
            {c.badge && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning 2xl:px-3 2xl:py-1.5 2xl:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-warning" />
                </span>
                {tr(c.badge)}
              </span>
            )}
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex w-full overflow-x-auto no-scrollbar border-b gap-3 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 whitespace-nowrap">
          {tabs.map((x) => (
            <button
              key={x.id}
              onClick={() => setTab(x.id)}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${tab === x.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tr(x.label)}
            </button>
          ))}
        </div>

        {tab === "review" &&
          (status === "pending" ? (
            <article className="overflow-hidden rounded-2xl border bg-card shadow-soft">
              <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={yousif.img}
                    alt=""
                    className="size-12 shrink-0 rounded-full object-cover ring-2 ring-accent"
                  />
                  <div className="flex flex-col items-start leading-tight">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold">{tr(yousif.name)}</h3>
                      <BadgeCheck className="size-4 text-primary fill-primary text-primary-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {yousif.handle}
                    </p>
                    <div className="flex gap-1 mt-1.5">
                      {[
                        { ar: "قصة إنستغرام مصوّرة", en: "Instagram Story" },
                        { ar: "فيديو تيك توك", en: "TikTok Video" },
                      ].map((f) => (
                        <span
                          key={f.en}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                        >
                          {tr(f)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-sm font-bold text-success">
                    <Lock className="h-3.5 w-3.5" />
                    {tr({ ar: "محجوز في الضمان:", en: "Held in Escrow:" })}{" "}
                    <span className="num">{fmtBHD(150, lang)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {tr({ ar: "موعد النشر: اليوم", en: "Scheduled: Today" })}
                  </span>
                </div>
              </header>

              <div className="grid gap-5 p-5 lg:grid-cols-2">
                <div className="flex flex-col gap-2 w-full rounded-xl border bg-surface p-3 sm:p-4">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {tr({ ar: "روابط إثبات النشر", en: "Proof of Delivery Links" })}
                    </p>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border bg-card p-3">
                        <span className="text-xs font-bold text-foreground flex items-center gap-2">
                          <Instagram className="h-4 w-4" /> Instagram Story
                        </span>
                        <a
                          href="https://instagram.com/stories/yousif.bites/"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full sm:w-auto shrink-0 justify-center items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary transition"
                        >
                          ↗ {tr({ ar: "فتح الرابط والمشاهدة", en: "View Content" })}
                        </a>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border bg-card p-3">
                        <span className="text-xs font-bold text-foreground flex items-center gap-2">
                          <Video className="h-4 w-4" /> TikTok Video
                        </span>
                        <a
                          href="https://tiktok.com/@yousif.bites/video/784729183"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full sm:w-auto shrink-0 justify-center items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary transition"
                        >
                          ↗ {tr({ ar: "فتح الرابط والمشاهدة", en: "View Content" })}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-card p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-soft text-success">
                      <Ticket className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {tr({ ar: "قسائم الخصم الممسوحة حتى الآن", en: "QR vouchers scanned so far" })}
                      </p>
                      <p className="num text-lg font-extrabold">
                        42 {tr({ ar: "زيارة", en: "visitors" })}{" "}
                        <span className="text-sm font-bold text-success">
                          (+42 {tr({ ar: "زيارة", en: "footfall" })})
                        </span>
                      </p>
                    </div>
                    <span className="ms-auto flex items-center gap-1 text-xs font-semibold text-success">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                      {tr({ ar: "مباشر", en: "Live" })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4 w-full rounded-xl border border-warning/30 bg-warning-soft text-center">
                  <p className="flex items-center justify-center gap-2 text-sm font-bold text-warning">
                    {tr({ ar: "محرّك التسوية خلال 24 ساعة", en: "24-Hour Settlement Engine" })} ⏳
                  </p>
                  <p className="num mt-1 text-4xl font-extrabold text-foreground" dir="ltr">
                    {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
                    {String(s).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground text-wrap">
                    {tr({
                      ar: `متبقي على الاعتماد التلقائي وتحرير الضمان`,
                      en: `Auto-release countdown`,
                    })}
                  </p>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-card">
                    <div
                      className="h-full rounded-full bg-warning transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-wrap">
                    {tr({
                      ar: "سيتم تحرير أتعاب صانع المحتوى تلقائياً بانتهاء المؤقت إذا لم يتم تقديم اعتراض مستند للشروط.",
                      en: "The creator's fee will be released automatically when the timer ends unless a dispute based on the terms is filed.",
                    })}
                  </p>
                </div>
              </div>

              <div className="mx-5 rounded-xl border">
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="flex w-full items-center justify-between p-4 text-sm font-bold"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    {tr({ ar: "المخرجات المعتمدة في العقد", en: "Approved Deliverables" })}{" "}
                    <span className="num text-muted-foreground">(3)</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <ul className="space-y-2 border-t p-4">
                    {deliverables.map((d) => (
                      <li key={d.en} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-success text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                        {tr(d)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <footer className="flex flex-col sm:flex-row gap-2.5 w-full p-5">
                <button
                  onClick={() => {
                    setStatus("released");
                    showToast({
                      ar: "تم تحرير 150.000 د.ب بنجاح لصانع المحتوى",
                      en: "150.000 BHD successfully released to the creator",
                    });
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-success px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:bg-success/90"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {tr({ ar: "اعتماد الإعلان وتحرير الضمان", en: "Approve & Release Escrow" })}
                </button>
                <button
                  onClick={() => setDispute(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/40 px-5 py-3 text-sm font-bold text-destructive hover:bg-destructive/5"
                >
                  <AlertTriangle className="h-4 w-4" />
                  {tr({ ar: "تقديم اعتراض", en: "Dispute Deliverables" })}
                </button>
              </footer>
            </article>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed p-12 text-center">
              {status === "released" ? (
                <CheckCircle2 className="h-10 w-10 text-success" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-destructive" />
              )}
              <p className="font-bold">
                {tr(
                  status === "released"
                    ? { ar: "لا توجد حملات بانتظار المراجعة", en: "No campaigns awaiting review" }
                    : {
                        ar: "تم تجميد الضمان وتحويل الحملة للمراجعة الإدارية",
                        en: "Escrow frozen — campaign sent for admin review",
                      },
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {tr(
                  status === "released"
                    ? { ar: "تم نقل الحملة إلى المكتملة.", en: "The campaign moved to Completed." }
                    : {
                        ar: "سيتواصل فريق ڤلوب معك خلال 48 ساعة.",
                        en: "The Vloop team will contact you within 48 hours.",
                      },
                )}
              </p>
            </div>
          ))}

        {tab === "scheduled" && (
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { c: fatima, date: { ar: "15 أكتوبر 2026", en: "15 Oct 2026" } },
              { c: noor, date: { ar: "22 أكتوبر 2026", en: "22 Oct 2026" } },
            ].map(({ c, date }) => (
              <article key={c.id} className="rounded-2xl border bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.img}
                      alt=""
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start leading-tight">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold">{tr(c.name)}</h3>
                        <BadgeCheck className="size-4 text-primary fill-primary text-primary-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {c.handle}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    {tr({ ar: "مجدولة", en: "Scheduled" })}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-surface p-3">
                    <dt className="text-xs text-muted-foreground">
                      {tr({ ar: "التاريخ", en: "Date" })}
                    </dt>
                    <dd className="mt-1 font-bold">{tr(date)}</dd>
                  </div>
                  <div className="rounded-lg bg-surface p-3">
                    <dt className="text-xs text-muted-foreground">
                      {tr({ ar: "الضمان", en: "Escrow" })}
                    </dt>
                    <dd className="num mt-1 flex items-center gap-1 font-bold text-success">
                      <Lock className="h-3.5 w-3.5" />
                      {fmtBHD(150, lang)} HELD
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-sm text-muted-foreground">
                  {tr({
                    ar: "بانتظار حضور صانع المحتوى ونشر التغطية",
                    en: "Awaiting the creator's visit and coverage publishing",
                  })}
                </p>
                <button
                  onClick={() => setBriefModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {tr({ ar: "عرض الشروط المعتمدة", en: "View Agreed Brief" })}
                </button>
              </article>
            ))}
          </div>
        )}

        {tab === "completed" &&
          (() => {
            const allCompleted = [
              ...(status === "released"
                ? [{ c: yousif, date: { ar: "اليوم", en: "Today" }, ft: 42, voucherHoursLeft: 14 }]
                : []),
              {
                c: creators[3]!,
                date: { ar: "28 سبتمبر 2026", en: "28 Sep 2026" },
                ft: 118,
                voucherHoursLeft: 0,
              },
              {
                c: fatima,
                date: { ar: "12 سبتمبر 2026", en: "12 Sep 2026" },
                ft: 204,
                voucherHoursLeft: 0,
              },
              {
                c: noor,
                date: { ar: "30 أغسطس 2026", en: "30 Aug 2026" },
                ft: 166,
                voucherHoursLeft: 0,
              },
              {
                c: creators[0]!,
                date: { ar: "18 أغسطس 2026", en: "18 Aug 2026" },
                ft: 97,
                voucherHoursLeft: 0,
              },
              {
                c: creators[1]!,
                date: { ar: "5 أغسطس 2026", en: "5 Aug 2026" },
                ft: 153,
                voucherHoursLeft: 0,
              },
              {
                c: creators[2]!,
                date: { ar: "22 يوليو 2026", en: "22 Jul 2026" },
                ft: 89,
                voucherHoursLeft: 0,
              },
              {
                c: creators[3]!,
                date: { ar: "10 يوليو 2026", en: "10 Jul 2026" },
                ft: 211,
                voucherHoursLeft: 0,
              },
              {
                c: creators[0]!,
                date: { ar: "28 يونيو 2026", en: "28 Jun 2026" },
                ft: 134,
                voucherHoursLeft: 0,
              },
              {
                c: creators[1]!,
                date: { ar: "15 يونيو 2026", en: "15 Jun 2026" },
                ft: 78,
                voucherHoursLeft: 0,
              },
              {
                c: creators[2]!,
                date: { ar: "2 يونيو 2026", en: "2 Jun 2026" },
                ft: 192,
                voucherHoursLeft: 0,
              },
            ];
            const totalPages = Math.max(1, Math.ceil(allCompleted.length / COMPLETED_PER_PAGE));
            const safePage = Math.min(completedPage, totalPages);
            const pageItems = allCompleted.slice(
              (safePage - 1) * COMPLETED_PER_PAGE,
              safePage * COMPLETED_PER_PAGE,
            );
            return (
              <div>
                <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
                  {pageItems.map(({ c, date, ft, voucherHoursLeft }, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 border-b p-5 last:border-0 transition hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={c.img}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-accent"
                        />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1 text-sm font-bold truncate">
                            {tr(c.name)}
                            <BadgeCheck className="h-3.5 w-3.5 fill-primary text-primary-foreground" />
                          </p>
                          <p className="text-xs text-muted-foreground">{tr(date)}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-success-soft px-3 py-1.5 text-sm font-semibold text-success">
                          <Footprints className="h-4 w-4" />
                          🎟️ {ft} {tr({ ar: "زيارة موثقة", en: "verified visitors" })}
                          <span className="relative ms-1 flex h-2 w-2 shrink-0">
                            {voucherHoursLeft > 0 && (
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                            )}
                            <span
                              className={`relative h-2 w-2 rounded-full ${voucherHoursLeft > 0 ? "bg-success" : "bg-muted-foreground/50"}`}
                            />
                          </span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            voucherHoursLeft > 0
                              ? "border-success/30 bg-success-soft text-success"
                              : "border-muted bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          <Ticket className="h-3.5 w-3.5" />
                          {voucherHoursLeft > 0
                            ? tr({
                                ar: `القسيمة نشطة: متبقي ${voucherHoursLeft} ساعة`,
                                en: `Voucher active: ${voucherHoursLeft}h remaining`,
                              })
                            : tr({ ar: "انتهت صلاحية القسيمة", en: "Voucher expired" })}
                        </span>
                        <span className="num flex items-center gap-1.5 rounded-full border border-success/30 bg-success-soft px-3 py-1.5 text-xs font-bold text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {tr({ ar: "تم التحرير:", en: "Released:" })} {fmtBHD(150, lang)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setCompletedPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {lang === "ar" ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                      {tr({ ar: "السابق", en: "Previous" })}
                    </button>
                    <span className="num text-sm text-muted-foreground">
                      {tr({
                        ar: `صفحة ${safePage} من ${totalPages}`,
                        en: `Page ${safePage} of ${totalPages}`,
                      })}
                    </span>
                    <button
                      onClick={() => setCompletedPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {tr({ ar: "التالي", en: "Next" })}
                      {lang === "ar" ? (
                        <ChevronLeft className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
      </section>

      {dispute && (
        <DisputeModal
          onClose={() => setDispute(false)}
          onConfirm={() => {
            setDispute(false);
            setStatus("disputed");
            showToast({
              ar: "تم تقديم الاعتراض وتجميد الضمان",
              en: "Dispute filed — escrow frozen",
            });
          }}
        />
      )}

      {briefModal && <BriefModal onClose={() => setBriefModal(false)} />}

      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-semibold shadow-lift animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          {tr(toast)}
        </div>
      )}
    </main>
  );
}

function DisputeModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  const [sel, setSel] = useState<number[]>([]);
  const [text, setText] = useState("");
  const items: L[] = [
    { ar: "الإشارة للحساب الرسمي ورابط القسيمة.", en: "Official account mention & voucher link." },
    { ar: "تصوير واجهة المحل والديكورات الداخلية.", en: "Storefront & interior décor footage." },
    { ar: "تصوير وجبة برجر الغداء وتجربتها.", en: "Lunch burger filming & tasting." },
  ];
  const valid = sel.length > 0 && text.trim().length > 0;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-card shadow-lift animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-bold">
            {tr({ ar: "تقديم اعتراض على مخرجات الحملة", en: "Dispute Campaign Deliverables" })}
          </h2>
          <button
            onClick={onClose}
            aria-label={tr({ ar: "إغلاق", en: "Close" })}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="space-y-4 p-6">
          <p className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            {tr({
              ar: "الاعتراض يوقف مؤقت الـ 24 ساعة فوراً ويُحوّل الطلب للمراجعة الإدارية.",
              en: "Filing a dispute immediately pauses the 24h timer and escalates to admin review.",
            })}
          </p>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {tr({ ar: "اختر البند المخالف", en: "Select the violated deliverable" })}
            </p>
            <div className="space-y-2">
              {items.map((it, i) => {
                const on = sel.includes(i);
                return (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${on ? "border-destructive/50 bg-destructive/5" : "hover:border-destructive/30"}`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${on ? "border-destructive bg-destructive text-destructive-foreground" : ""}`}
                    >
                      {on && <Check className="h-3 w-3" />}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => setSel((s) => (on ? s.filter((x) => x !== i) : [...s, i]))}
                    />
                    {tr(it)}
                  </label>
                );
              })}
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={tr({
              ar: "تفاصيل الاعتراض والملاحظات (إلزامي)...",
              en: "Dispute details and notes (required)...",
            })}
            className="w-full resize-none rounded-lg border px-3.5 py-3 text-sm outline-none focus:border-destructive"
          />
        </div>
        <footer className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            {tr({ ar: "إلغاء", en: "Cancel" })}
          </button>
          <button
            disabled={!valid}
            onClick={onConfirm}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {tr({ ar: "تأكيد الاعتراض وتجميد الضمان", en: "Confirm Dispute & Freeze Escrow" })}
          </button>
        </footer>
      </div>
    </div>
  );
}

function BriefModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-card shadow-lift animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="flex items-center gap-2 font-bold">
            <ShieldCheck className="h-5 w-5 text-success" />
            {tr({ ar: "الشروط والعقد الرقمي المعتمد", en: "Approved Terms & Digital Contract" })}
          </h2>
          <button
            onClick={onClose}
            aria-label={tr({ ar: "إغلاق", en: "Close" })}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface p-3">
              <p className="text-xs text-muted-foreground">
                {tr({ ar: "تاريخ الحملة", en: "Campaign Date" })}
              </p>
              <p className="mt-1 text-sm font-bold">
                {tr({ ar: "15 أكتوبر 2026", en: "15 Oct 2026" })}
              </p>
            </div>
            <div className="rounded-lg bg-surface p-3">
              <p className="text-xs text-muted-foreground">
                {tr({ ar: "صانع المحتوى", en: "Creator" })}
              </p>
              <p className="mt-1 text-sm font-bold">{tr(creators[0]!.name)}</p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {tr({ ar: "المخرجات المعتمدة والملزمة", en: "Locked Deliverables Checklist" })}
            </p>
            <ul className="space-y-2">
              {deliverables.map((d) => (
                <li key={d.en} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-success text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  {tr(d)}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p>
              {tr({
                ar: "هذه الشروط ملزمة وغير قابلة للتعديل بعد دفع الضمان.",
                en: "These terms are binding and cannot be modified after escrow payment.",
              })}
            </p>
          </div>
        </div>
        <footer className="flex justify-end border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            {tr({ ar: "إغلاق", en: "Close" })}
          </button>
        </footer>
      </div>
    </div>
  );
}
