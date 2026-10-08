import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Lock, TrendingUp, AlertTriangle, BadgeCheck, ExternalLink, Check, HelpCircle, Scale,
  Search, ShieldAlert, Ban, Gavel, Users,
} from "lucide-react";
import { useLang } from "@/components/vloop/Shell";
import { creators, fmtBHD, type L } from "@/lib/vloop-data";
import { InsightsProofModal, type InsightsVerification, type SocialPlatform } from "@/components/vloop/InsightsProofModal";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Super Admin Control Center — Vloop | ڤلوب" },
      { name: "description", content: "Vloop super admin: escrow oversight, dispute arbitration, creator stat verification and user reliability." },
      { property: "og:title", content: "Super Admin Control Center — Vloop" },
      { property: "og:description", content: "Escrow oversight, dispute arbitration and creator verification for Vloop." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "disputes" | "verify" | "users";
type UserRow = { id: string; name: L; handle: string; type: "merchant" | "creator"; score?: number; completedCampaigns?: number; status: "active" | "suspended"; strikes: number };

const initialVerifications: InsightsVerification[] = [
  {
    id: "1",
    creator: creators[0]!,
    currentFollowers: "85K",
    currentViews: "14.2K",
    requestedFollowers: "110K",
    requestedViews: "19.5K",
    screenshotDataUrl: null,
    screenshotName: null,
    platform: "instagram",
    profileUrl: "https://instagram.com/fatima_foodie",
    status: "pending",
  },
  {
    id: "3",
    creator: creators[2]!,
    currentFollowers: "110K",
    currentViews: "19.5K",
    requestedFollowers: "124K",
    requestedViews: "22K",
    screenshotDataUrl: null,
    screenshotName: null,
    platform: "tiktok",
    profileUrl: "https://www.tiktok.com/@noor.daily",
    status: "pending",
  },
];

const initialUsers: UserRow[] = [
  { id: "u1", name: { ar: "شركة فليم برجر ذ.م.م", en: "Flame Burger Co. W.L.L" }, handle: "@flame_burger", type: "merchant", completedCampaigns: 14, status: "active", strikes: 0 },
  { id: "u2", name: { ar: "يوسف المناعي", en: "Yousif Al-Mannai" }, handle: "@yousif.bites", type: "creator", score: 96, status: "active", strikes: 0 },
  { id: "u3", name: { ar: "فاطمة الحداد", en: "Fatima Al-Haddad" }, handle: "@fatima_foodie", type: "creator", score: 98, status: "active", strikes: 0 },
  { id: "u4", name: { ar: "بيك اند كو", en: "Brew & Co. Cafe" }, handle: "@brewandco.bh", type: "merchant", completedCampaigns: 8, status: "active", strikes: 1 },
  { id: "u5", name: { ar: "خالد البوعينين", en: "Khalid Al-Buainain" }, handle: "@khalid_eats_bh", type: "creator", score: 94, status: "active", strikes: 0 },
  { id: "u6", name: { ar: "نور العلوي", en: "Noor Al-Alawi" }, handle: "@noor.daily", type: "creator", score: 99, status: "active", strikes: 0 },
  { id: "u7", name: { ar: "كراست بيتزا", en: "Crust Pizza" }, handle: "@crustpizza.bh", type: "merchant", completedCampaigns: 11, status: "active", strikes: 0 },
  { id: "u8", name: { ar: "ميسا تاكيريا", en: "Mesa Taqueria" }, handle: "@mesataqueria.bh", type: "merchant", completedCampaigns: 6, status: "active", strikes: 0 },
];

function AdminPage() {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  const [tab, setTab] = useState<Tab>("disputes");
  const [dispute, setDispute] = useState<null | "creator" | "merchant" | "split">(null);
  const [verifications, setVerifications] = useState(initialVerifications);
  const [proofRequest, setProofRequest] = useState<InsightsVerification | null>(null);
  const [users, setUsers] = useState(initialUsers);
  const [userSearch, setUserSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<"all" | "merchant" | "creator">("all");
  const [userPage, setUserPage] = useState(1);
  const [confirmSuspend, setConfirmSuspend] = useState<UserRow | null>(null);

  const disputesOpen = dispute === null ? 1 : 0;
  const verificationsOpen = verifications.filter((verification) => verification.status === "pending").length;
  const yousif = creators[1]!;
  const filteredUsers = users.filter((user) => {
    const matchesType = userTypeFilter === "all" || user.type === userTypeFilter;
    const query = userSearch.trim().toLocaleLowerCase();
    const matchesSearch =
      !query ||
      user.name.ar.toLocaleLowerCase().includes(query) ||
      user.name.en.toLocaleLowerCase().includes(query) ||
      user.handle.toLocaleLowerCase().includes(query);
    return matchesType && matchesSearch;
  });
  const usersPerPage = 10;
  const usersPageCount = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const paginatedUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

  useEffect(() => {
    try {
      const savedDecisions = window.localStorage.getItem("vloop.stats-verification-decisions");
      if (savedDecisions) {
        const parsed: unknown = JSON.parse(savedDecisions);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          throw new Error("Saved stats verification decisions are invalid.");
        }
        setVerifications((current) =>
          current.map((verification) => {
            const decision = (parsed as Record<string, unknown>)[verification.id];
            return decision === "approved" || decision === "rejected"
              ? { ...verification, status: decision }
              : verification;
          }),
        );
      }
    } catch (error) {
      console.error("Unable to load stats verification decisions.", error);
      toast.error("Unable to load saved stats verification decisions.");
    }

    try {
      const savedRequest = window.localStorage.getItem("vloop.pending-stats-verification");
      if (!savedRequest) return;
      const parsed: unknown = JSON.parse(savedRequest);
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("creatorId" in parsed) ||
        typeof parsed.creatorId !== "string" ||
        !("requestedFollowers" in parsed) ||
        typeof parsed.requestedFollowers !== "number" ||
        !Number.isFinite(parsed.requestedFollowers) ||
        !("requestedViews" in parsed) ||
        typeof parsed.requestedViews !== "number" ||
        !Number.isFinite(parsed.requestedViews) ||
        !("platform" in parsed) ||
        (parsed.platform !== "instagram" && parsed.platform !== "tiktok" && parsed.platform !== "snapchat") ||
        !("profileUrl" in parsed) ||
        typeof parsed.profileUrl !== "string" ||
        !("screenshotDataUrl" in parsed) ||
        typeof parsed.screenshotDataUrl !== "string" ||
        !parsed.screenshotDataUrl.startsWith("data:image/") ||
        !("screenshotName" in parsed) ||
        typeof parsed.screenshotName !== "string"
      ) {
        throw new Error("Saved creator verification request is invalid.");
      }
      const creator = creators.find((item) => item.id === parsed.creatorId);
      if (!creator) throw new Error("Saved creator verification request refers to an unknown creator.");
      const profileUrl = new URL(parsed.profileUrl);
      const platformHosts: Record<SocialPlatform, string[]> = {
        instagram: ["instagram.com", "www.instagram.com"],
        tiktok: ["tiktok.com", "www.tiktok.com"],
        snapchat: ["snapchat.com", "www.snapchat.com"],
      };
      if (profileUrl.protocol !== "https:" || !platformHosts[parsed.platform].includes(profileUrl.hostname.toLowerCase())) {
        throw new Error("Saved creator profile URL does not match its selected platform.");
      }
      const savedDecisions = window.localStorage.getItem("vloop.stats-verification-decisions");
      const parsedDecisions: unknown = savedDecisions ? JSON.parse(savedDecisions) : {};
      if (typeof parsedDecisions !== "object" || parsedDecisions === null || Array.isArray(parsedDecisions)) {
        throw new Error("Saved stats verification decisions are invalid.");
      }
      const toCompactCount = (count: number) =>
        count >= 1000
          ? `${Number((count / 1000).toFixed(count % 1000 === 0 ? 0 : 1))}K`
          : String(count);
      const savedVerification: InsightsVerification = {
        id: creator.id,
        creator,
        currentFollowers: creator.followers,
        currentViews: creator.storyViews,
        requestedFollowers: toCompactCount(parsed.requestedFollowers),
        requestedViews: toCompactCount(parsed.requestedViews),
        screenshotDataUrl: parsed.screenshotDataUrl,
        screenshotName: parsed.screenshotName,
        platform: parsed.platform,
        profileUrl: profileUrl.toString(),
        status:
          (parsedDecisions as Record<string, "approved" | "rejected">)[creator.id] === "approved" || (parsedDecisions as Record<string, "approved" | "rejected">)[creator.id] === "rejected"
            ? (parsedDecisions as Record<string, "approved" | "rejected">)[creator.id]!
            : "pending",
      };
      setVerifications((current) =>
        current.some((verification) => verification.id === creator.id)
          ? current.map((verification) => verification.id === creator.id ? savedVerification : verification)
          : [...current, savedVerification],
      );
    } catch (error) {
      console.error("Unable to load the creator stats verification request.", error);
      toast.error("Unable to load the saved stats verification request.");
    }
  }, []);

  const updateVerification = (verification: InsightsVerification, status: "approved" | "rejected") => {
    try {
      if (status === "approved") {
        const savedStats = window.localStorage.getItem("vloop.verified-creator-stats");
        const parsedStats: unknown = savedStats ? JSON.parse(savedStats) : {};
        if (typeof parsedStats !== "object" || parsedStats === null || Array.isArray(parsedStats)) {
          throw new Error("Saved verified creator stats are invalid.");
        }
        window.localStorage.setItem(
          "vloop.verified-creator-stats",
          JSON.stringify({
            ...parsedStats,
            [verification.id]: {
              followers: verification.requestedFollowers,
              storyViews: verification.requestedViews,
            },
          }),
        );
      }
      const savedDecisions = window.localStorage.getItem("vloop.stats-verification-decisions");
      const parsedDecisions: unknown = savedDecisions ? JSON.parse(savedDecisions) : {};
      if (typeof parsedDecisions !== "object" || parsedDecisions === null || Array.isArray(parsedDecisions)) {
        throw new Error("Saved stats verification decisions are invalid.");
      }
      window.localStorage.setItem(
        "vloop.stats-verification-decisions",
        JSON.stringify({ ...parsedDecisions, [verification.id]: status }),
      );
    } catch (error) {
      console.error("Unable to save the stats verification decision.", error);
      toast.error(tr({ ar: "تعذر حفظ قرار التوثيق. يرجى المحاولة مرة أخرى", en: "Unable to save the verification decision. Please try again" }));
      return;
    }

    setVerifications((current) =>
      current.map((item) => item.id === verification.id ? { ...item, status } : item),
    );
    setProofRequest(null);
    if (status === "approved") {
      toast.success(tr({ ar: "تم اعتماد وتوثيق الإحصائيات وتحديث ملف صانع المحتوى", en: "Stats verified and creator profile updated" }));
    } else {
      toast(tr({ ar: "تم رفض الطلب", en: "Request rejected" }));
    }
  };

  const resolve = (k: "creator" | "merchant" | "split") => {
    setDispute(k);
    toast.success(
      k === "creator" ? tr({ ar: "تم تحرير 150.000 د.ب لصانع المحتوى وإغلاق النزاع", en: "150.000 BHD released to creator; dispute closed" })
      : k === "merchant" ? tr({ ar: "تم استرداد 150.000 د.ب إلى محفظة المتجر", en: "150.000 BHD refunded to merchant wallet" })
      : tr({ ar: "تمت التسوية مناصفة: 75.000 د.ب لكل طرف", en: "Settled 50/50: 75.000 BHD each" }),
    );
  };

  const stats = [
    { icon: Lock, tone: "bg-primary/10 text-primary", label: { ar: "إجمالي الأمانات المعلقة", en: "Active Escrow Held" }, value: fmtBHD(14250, lang), sub: { ar: "28 حملة جارية", en: "28 running campaigns" } },
    { icon: TrendingUp, tone: "bg-success-soft text-success", label: { ar: "أرباح المنصة الصافية", en: "Net Vloop Revenue" }, value: fmtBHD(1140, lang), sub: { ar: "من رسوم الـ 8%", en: "From 8% platform fees" } },
    { icon: AlertTriangle, tone: "bg-warning-soft text-warning", label: { ar: "نزاعات معلقة تتطلب تحكيم", en: "Active Disputes" }, value: `${disputesOpen} ${tr({ ar: "حملة", en: disputesOpen === 1 ? "campaign" : "campaigns" })}`, sub: { ar: "تتطلب قراراً ملزماً", en: "Binding decision required" }, alert: disputesOpen > 0 },
    { icon: BadgeCheck, tone: "bg-sky/10 text-sky", label: { ar: "طلبات توثيق إحصائيات معلقة", en: "Pending Verifications" }, value: `${verificationsOpen} ${tr({ ar: "طلب", en: verificationsOpen === 1 ? "request" : "requests" })}`, sub: { ar: "تحديثات إحصائيات المؤثرين", en: "Creator stat updates" } },
  ];

  const tabs: { id: Tab; label: L; count?: number }[] = [
    { id: "disputes", label: { ar: "غرفة التحكيم وفض النزاعات", en: "Dispute Arbitration" }, count: disputesOpen },
    { id: "verify", label: { ar: "طلبات توثيق إحصائيات المؤثرين", en: "Creator Verifications" }, count: verificationsOpen },
    { id: "users", label: { ar: "إدارة الحسابات والموثوقية", en: "Users & Reliability" } },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{tr({ ar: "مركز التحكم للإدارة العليا", en: "Super Admin Control Center" })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{tr({ ar: "مراقبة الأمانات، التحكيم في النزاعات، وتوثيق صنّاع المحتوى.", en: "Oversee escrow, arbitrate disputes and verify creators." })}</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className={`relative rounded-2xl border bg-card p-5 shadow-soft ${s.alert ? "border-warning/50" : ""}`}>
            {s.alert && <span className="absolute end-4 top-4 flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-warning" /></span>}
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tone}`}><s.icon className="h-5 w-5" /></span>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">{tr(s.label)}</p>
            <p className="num mt-1 text-2xl font-extrabold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{tr(s.sub)}</p>
          </div>
        ))}
      </section>

      <div className="flex gap-1 overflow-x-auto border-b">
        {tabs.map((tb) => (
          <button key={tb.id} onClick={() => setTab(tb.id)} className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${tab === tb.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tr(tb.label)}
            {tb.count !== undefined && <span className={`num rounded-full px-2 py-0.5 text-[11px] ${tb.count > 0 ? "bg-warning-soft text-warning" : "bg-muted text-muted-foreground"}`}>{tb.count}</span>}
          </button>
        ))}
      </div>

      {tab === "disputes" && (
        dispute ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed bg-surface p-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success"><Gavel className="h-7 w-7" /></span>
            <h3 className="mt-4 text-lg font-bold">{tr({ ar: "تم إغلاق القضية #DSP-2026-091", en: "Case #DSP-2026-091 closed" })}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {dispute === "creator" ? tr({ ar: "القرار: تحرير كامل الضمان للمؤثر.", en: "Ruling: full escrow released to creator." })
                : dispute === "merchant" ? tr({ ar: "القرار: استرداد كامل الضمان للمتجر.", en: "Ruling: full escrow refunded to merchant." })
                : tr({ ar: "القرار: تسوية ودية مناصفة 75.000 / 75.000 د.ب.", en: "Ruling: amicable 50/50 split, 75.000 / 75.000 BHD." })}
            </p>
            <button onClick={() => setDispute(null)} className="mt-5 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted">{tr({ ar: "إعادة فتح العرض التجريبي", en: "Reset demo" })}</button>
          </div>
        ) : (
          <article className="rounded-2xl border bg-card shadow-soft">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-warning" />
                <span className="font-mono text-base font-bold" dir="ltr">#DSP-2026-091</span>
                <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning">{tr({ ar: "قيد التحكيم", en: "Under arbitration" })}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold"><Lock className="h-3.5 w-3.5" />{tr({ ar: "الضمان مجمّد", en: "Escrow frozen" })}</span>
            </header>
            <div className="grid gap-6 p-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground">{tr({ ar: "أطراف الحملة", en: "Campaign Parties" })}</h4>
                <div className="space-y-3 rounded-xl border bg-surface p-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-primary-foreground">FB</span>
                    <div><p className="text-xs text-muted-foreground">{tr({ ar: "المتجر", en: "Merchant" })}</p><p className="font-bold">{tr({ ar: "شركة فليم برجر ذ.م.م", en: "Flame Burger Co. W.L.L" })} <span className="font-normal text-muted-foreground" dir="ltr">@flame_burger</span></p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={yousif.img} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div><p className="text-xs text-muted-foreground">{tr({ ar: "صانع المحتوى", en: "Creator" })}</p><p className="font-bold">{tr(yousif.name)} <span className="font-normal text-muted-foreground" dir="ltr">{yousif.handle}</span></p></div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground">{tr({ ar: "مبلغ الضمان المتنازع عليه", en: "Disputed escrow amount" })}</span>
                    <span className="num text-lg font-extrabold">{fmtBHD(150, lang)}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-bold text-destructive"><ShieldAlert className="h-4 w-4" />{tr({ ar: "سبب النزاع (اعتراض التاجر)", en: "Cause of dispute (merchant objection)" })}</p>
                  <p className="text-sm leading-relaxed">{tr({ ar: "يدعي التاجر عدم تصوير وجبة الغداء الساخنة وعدم إبراز السعر 2.5 د.ب في الستوري.", en: "The merchant claims the hot lunch meal was not filmed and the 2.5 BHD price was not highlighted in the story." })}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground">{tr({ ar: "مراجعة الأدلة", en: "Evidence Review" })}</h4>
                <div className="flex flex-wrap gap-2">
                  {[{ l: { ar: "مشاهدة ستوري إنستغرام", en: "View Instagram Story" }, u: "https://instagram.com/stories/yousif.bites/" }, { l: { ar: "مشاهدة فيديو تيك توك", en: "View TikTok Video" }, u: "https://tiktok.com/@yousif.vlogs" }].map((x) => (
                    <a key={x.u} href={x.u} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"><ExternalLink className="h-4 w-4" />{tr(x.l)}</a>
                  ))}
                </div>
                <div className="rounded-xl border bg-surface p-4">
                  <p className="mb-3 text-sm font-bold">{tr({ ar: "العقد الرقمي المتفق عليه", en: "Agreed Digital Contract" })}</p>
                  <ul className="space-y-2.5 text-sm">
                    {[
                      { ok: true, l: { ar: "تصوير واجهة المحل والديكورات", en: "Film storefront and décor" }, s: { ar: "تم التأكيد", en: "Confirmed" } },
                      { ok: false, l: { ar: "تصوير وجبة الغداء بسعر 2.5 د.ب", en: "Film the 2.5 BHD lunch meal" }, s: { ar: "محل الخلاف", en: "Disputed" } },
                      { ok: true, l: { ar: "إرفاق رابط القسيمة في الستوري", en: "Attach voucher link in story" }, s: { ar: "تم التأكيد", en: "Confirmed" } },
                    ].map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded ${c.ok ? "bg-success text-background" : "bg-warning text-background"}`}>{c.ok ? <Check className="h-3.5 w-3.5" /> : <HelpCircle className="h-3.5 w-3.5" />}</span>
                        <span className="flex-1">{tr(c.l)}</span>
                        <span className={`shrink-0 text-xs font-bold ${c.ok ? "text-success" : "text-warning"}`}>{tr(c.s)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <footer className="flex flex-col gap-3 border-t bg-surface px-6 py-4 sm:flex-row sm:flex-wrap sm:justify-end">
              <button onClick={() => resolve("split")} className="rounded-lg border border-warning/50 px-4 py-2.5 text-sm font-bold text-warning transition hover:bg-warning-soft">{tr({ ar: "تسوية ودية مناصفة (75 د.ب / 75 د.ب)", en: "Amicable 50/50 split (75 / 75 BHD)" })}</button>
              <button onClick={() => resolve("merchant")} className="rounded-lg bg-destructive px-4 py-2.5 text-sm font-bold text-destructive-foreground transition hover:bg-destructive/90">{tr({ ar: "استرداد كامل الضمان للمتجر (150 د.ب)", en: "Full refund to merchant (150 BHD)" })}</button>
              <button onClick={() => resolve("creator")} className="rounded-lg bg-success px-4 py-2.5 text-sm font-bold text-background transition hover:bg-success/90">{tr({ ar: "تحرير كامل الضمان للمؤثر (150 د.ب)", en: "Release full escrow to creator (150 BHD)" })}</button>
            </footer>
          </article>
        )
      )}

      {tab === "verify" && (
        <div className="space-y-4">
          {verifications.map((verification) => (
            <article key={verification.id} className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="flex items-center gap-3 lg:w-64">
                  <img src={verification.creator.img} alt="" className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="font-bold">{tr(verification.creator.name)}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">{verification.creator.handle}</p>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-xl border bg-surface p-3">
                    <p className="text-xs text-muted-foreground">{tr({ ar: "الأرقام الحالية", en: "Current stats" })}</p>
                    <p className="num mt-1 font-bold">{verification.currentFollowers} {tr({ ar: "متابع", en: "followers" })} • {verification.currentViews} {tr({ ar: "مشاهدات", en: "views" })}</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                    <p className="text-xs text-primary">{tr({ ar: "الأرقام الجديدة المطلوبة", en: "Requested stats" })}</p>
                    <p className="num mt-1 font-bold">{verification.requestedFollowers} {tr({ ar: "متابع", en: "followers" })} • {verification.requestedViews} {tr({ ar: "مشاهدات", en: "views" })}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  {verification.status === "pending" ? (
                    <>
                      <button onClick={() => setProofRequest(verification)} className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted">
                        <Search className="h-4 w-4" />{tr({ ar: "معاينة إثبات الإحصائيات", en: "Preview stats proof" })}
                      </button>
                      <button onClick={() => updateVerification(verification, "rejected")} className="rounded-lg border border-destructive px-3 py-2 text-sm font-bold text-destructive hover:bg-destructive/10">{tr({ ar: "رفض الطلب ✗", en: "Reject ✗" })}</button>
                      <button onClick={() => updateVerification(verification, "approved")} className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90">{tr({ ar: "اعتماد وتوثيق الإحصائيات ✓", en: "Approve & verify stats ✓" })}</button>
                    </>
                  ) : (
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${verification.status === "approved" ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive"}`}>
                      {verification.status === "approved"
                        ? tr({ ar: "تم اعتماد الإحصائيات", en: "Stats approved" })
                        : tr({ ar: "تم رفض الطلب", en: "Request rejected" })}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-soft sm:flex-row">
            <label className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={userSearch}
                onChange={(event) => { setUserSearch(event.target.value); setUserPage(1); }}
                placeholder={tr({ ar: "ابحث باسم المستخدم، المعرف @، أو اسم المتجر...", en: "Search user name, @handle, or business name..." })}
                className="w-full rounded-lg border bg-background py-2.5 pe-3 ps-9 text-sm outline-none focus:border-primary"
              />
            </label>
            <select
              value={userTypeFilter}
              onChange={(event) => { setUserTypeFilter(event.target.value as typeof userTypeFilter); setUserPage(1); }}
              aria-label={tr({ ar: "تصفية حسب نوع الحساب", en: "Filter by account type" })}
              className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="all">{tr({ ar: "الكل", en: "All accounts" })}</option>
              <option value="merchant">{tr({ ar: "المتاجر فقط", en: "Merchants only" })}</option>
              <option value="creator">{tr({ ar: "صنّاع المحتوى فقط", en: "Creators only" })}</option>
            </select>
          </div>
          <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-surface text-xs text-muted-foreground">
                <tr>{[{ ar: "المستخدم", en: "User" }, { ar: "نوع الحساب", en: "Account type" }, { ar: "الموثوقية / النشاط", en: "Reliability / Activity" }, { ar: "الحالة", en: "Status" }, { ar: "الإجراءات", en: "Actions" }].map((h, i) => <th key={i} className="px-4 py-3 text-start font-semibold">{tr(h)}</th>)}</tr>
              </thead>
              <tbody>
                {paginatedUsers.length ? paginatedUsers.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-3"><p className="font-bold">{tr(u.name)}</p><p className="text-xs text-muted-foreground" dir="ltr">{u.handle}</p></td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold"><Users className="h-3 w-3" />{u.type === "merchant" ? tr({ ar: "متجر", en: "Merchant" }) : tr({ ar: "صانع محتوى", en: "Creator" })}</span></td>
                    <td className="px-4 py-3">
                      {u.type === "creator" ? (
                        <>
                          <span className="num font-bold">{u.score}%</span>
                          {u.strikes > 0 && <span className="ms-2 text-xs font-semibold text-warning">{u.strikes} {tr({ ar: "إنذار", en: "strike(s)" })}</span>}
                        </>
                      ) : (
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-semibold">{u.completedCampaigns} {tr({ ar: "حملة مكتملة", en: "completed campaigns" })}</span>
                          {u.status === "active" && <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-bold text-success">{tr({ ar: "موثوق (سجل تجاري نشط)", en: "Trusted (active commercial registration)" })}</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{u.status === "active" ? <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">{tr({ ar: "نشط", en: "Active" })}</span> : <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">{tr({ ar: "معلّق", en: "Suspended" })}</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button disabled={u.status !== "active"} onClick={() => { setUsers((l) => l.map((x) => x.id === u.id ? { ...x, strikes: x.strikes + 1, ...(x.type === "creator" ? { score: Math.max(0, (x.score ?? 0) - 5) } : {}) } : x)); toast.warning(tr({ ar: "تم توجيه إنذار", en: "Strike issued" })); }} className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-40"><AlertTriangle className="h-3.5 w-3.5" />{tr({ ar: "توجيه إنذار", en: "Issue Strike" })}</button>
                        {u.status === "active" ? (
                          <button onClick={() => setConfirmSuspend(u)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"><Ban className="h-3.5 w-3.5" />{tr({ ar: "تعليق الحساب مؤقتاً", en: "Suspend Account" })}</button>
                        ) : (
                          <button onClick={() => setUsers((l) => l.map((x) => x.id === u.id ? { ...x, status: "active" } : x))} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10">{tr({ ar: "إعادة التفعيل", en: "Reactivate" })}</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">{tr({ ar: "لا توجد حسابات مطابقة", en: "No matching accounts" })}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <nav aria-label={tr({ ar: "ترقيم صفحات الحسابات", en: "User account pagination" })} className="flex items-center justify-center gap-4">
            <button
              disabled={userPage <= 1}
              onClick={() => setUserPage((page) => Math.max(1, page - 1))}
              className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              {tr({ ar: "السابق", en: "Previous" })}
            </button>
            <span className="text-sm font-semibold text-muted-foreground">
              {tr({ ar: `صفحة ${userPage} من ${usersPageCount}`, en: `Page ${userPage} of ${usersPageCount}` })}
            </span>
            <button
              disabled={userPage >= usersPageCount}
              onClick={() => setUserPage((page) => Math.min(usersPageCount, page + 1))}
              className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              {tr({ ar: "التالي", en: "Next" })}
            </button>
          </nav>
        </div>
      )}

      <InsightsProofModal
        verification={proofRequest}
        lang={lang}
        onClose={() => setProofRequest(null)}
        onApprove={() => { if (proofRequest) updateVerification(proofRequest, "approved"); }}
        onReject={() => { if (proofRequest) updateVerification(proofRequest, "rejected"); }}
      />

      {confirmSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setConfirmSuspend(null)}>
          <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{tr({ ar: "تعليق الحساب مؤقتاً", en: "Suspend account" })}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tr({ ar: `سيتم إيقاف حساب ${confirmSuspend.name.ar} عن استقبال أو إنشاء الحملات.`, en: `${confirmSuspend.name.en} will be blocked from receiving or creating campaigns.` })}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setConfirmSuspend(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted">{tr({ ar: "إلغاء", en: "Cancel" })}</button>
              <button onClick={() => { setUsers((l) => l.map((x) => x.id === confirmSuspend.id ? { ...x, status: "suspended" } : x)); toast.error(tr({ ar: "تم تعليق الحساب", en: "Account suspended" })); setConfirmSuspend(null); }} className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:bg-destructive/90">{tr({ ar: "تأكيد التعليق", en: "Confirm suspension" })}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
