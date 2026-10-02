import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  QrCode,
  ChevronDown,
  Megaphone,
  Footprints,
  Timer,
  TrendingUp,
  Search,
  Users,
  Eye,
  ShieldCheck,
  Check,
  Wallet,
  LogOut,
  Settings,
  UserCog,
  Loader2,
  Sparkles,
  Building2,
  Lock,
} from "lucide-react";
import { BookingModal } from "@/components/vloop/BookingModal";
import { type Lang, type L, type Creator, creators, categories, fmtBHD, t } from "@/lib/vloop-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vloop | ڤلوب — Merchant Discovery & Campaign Dashboard" },
      {
        name: "description",
        content:
          "Discover creators within your budget and book influencer campaigns secured by Vloop escrow in Bahrain.",
      },
      { property: "og:title", content: "Vloop | ڤلوب — Merchant Dashboard" },
      {
        property: "og:description",
        content:
          "Influencer marketing with financial escrow for local businesses in Bahrain & the GCC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [lang, setLang] = useState<Lang>("ar");
  const tr = (x: L) => x[lang];
  const [budget, setBudget] = useState("150.000");
  const [cat, setCat] = useState("food");
  const [date, setDate] = useState("");
  const [applied, setApplied] = useState({ budget: 150, cat: "food" });
  const [searching, setSearching] = useState(false);
  const [booking, setBooking] = useState<Creator | null>(null);
  const [kit, setKit] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const results = useMemo(
    () =>
      creators.filter(
        (c) =>
          c.minRate <= applied.budget &&
          (applied.cat === "all" || c.categories.includes(applied.cat)),
      ),
    [applied],
  );

  const runSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setApplied({ budget: parseFloat(budget) || 0, cat });
      setSearching(false);
    }, 600);
  };

  const copyKiosk = () => {
    navigator.clipboard?.writeText("https://vloop.bh/kiosk/flame-burger-104829");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metrics = [
    {
      icon: Megaphone,
      label: t.m1.label,
      value: "3",
      sub: `${tr(t.m1.sub)} ${fmtBHD(450, lang)}`,
      tone: "text-primary bg-accent",
    },
    {
      icon: Footprints,
      label: t.m2.label,
      value: `1,280`,
      unit: tr(t.m2.unit),
      sub: tr(t.m2.sub),
      tone: "text-sky bg-accent",
    },
    {
      icon: Timer,
      label: t.m3.label,
      value: "1",
      unit: tr(t.m3.unit),
      badge: tr(t.m3.badge),
      tone: "text-warning bg-warning-soft",
    },
    {
      icon: TrendingUp,
      label: t.m4.label,
      value: "3.8x",
      sub: tr(t.m4.sub),
      tone: "text-success bg-success-soft",
      money: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-[92%] max-w-[1680px] items-center gap-6 px-4 lg:px-8">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <img src="/logo.png" alt="Vloop" className="h-8 w-auto" />
            <span className="text-lg font-extrabold">
              Vloop <span className="font-light text-muted-foreground">|</span> ڤلوب
            </span>
          </a>
          <nav className="hidden items-center gap-1 text-sm font-medium xl:flex">
            <a className="rounded-lg bg-accent px-3 py-2 text-accent-foreground">
              {tr(t.nav.discover)}
            </a>
            <a className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              {tr(t.nav.campaigns)}
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title="Pending review"></span>
            </a>
            <a className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              {tr(t.nav.invoices)}
            </a>
          </nav>
          <div className="ms-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <Lock className="h-4 w-4" />
              {lang === "ar" ? "في الضمان:" : "Escrow:"} <span className="num font-bold">{fmtBHD(350, lang)}</span>
            </div>
            <button
              onClick={copyKiosk}
              className="hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary md:inline-flex"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <QrCode className="h-4 w-4" />}
              {tr(copied ? t.nav.copied : t.nav.kiosk)}
            </button>
            <div className="flex rounded-lg border p-0.5 text-xs font-bold">
              {(["ar", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-md px-2.5 py-1.5 transition ${lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">
                  FB
                </span>
                <span className="hidden text-start leading-tight lg:block">
                  <span className="block text-sm font-bold">{tr(t.merchant.name)}</span>
                  <span className="num block text-xs text-muted-foreground">
                    {tr(t.merchant.cr)}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {menu && (
                <div className="absolute end-0 top-12 w-52 rounded-xl border bg-popover p-1.5 shadow-lift animate-in fade-in zoom-in-95">
                  {[
                    [Building2, { ar: "الملف التعريفي للشركة", en: "Company Profile" }],
                    [Settings, { ar: "إعدادات الحساب", en: "Account Settings" }],
                  ].map(([I, l], i) => {
                    const Icon = I as typeof Settings;
                    const label = l as L;
                    return (
                      <button
                        key={i}
                        onClick={() => setMenu(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {tr(label)}
                      </button>
                    );
                  })}
                  <div className="border-t my-1"></div>
                  <button
                    onClick={() => {
                      setMenu(false);
                      setLogoutDialog(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    {tr({ ar: "تسجيل الخروج", en: "Log out" })}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* LOGOUT CONFIRMATION DIALOG */}
      {logoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lift animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">
              {lang === "ar" ? "تأكيد تسجيل الخروج" : "Confirm Log out"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === "ar"
                ? "هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟"
                : "Are you sure you want to log out?"}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setLogoutDialog(false)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => setLogoutDialog(false)}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:bg-destructive/90"
              >
                {lang === "ar" ? "تأكيد الخروج" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto w-[92%] max-w-[1680px] space-y-8 px-4 py-8 lg:px-8 2xl:space-y-12 2xl:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl 2xl:text-5xl">
            {tr(t.greet.title)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground 2xl:mt-3 2xl:text-lg">
            {tr(t.greet.sub)}
          </p>
        </div>

        {/* METRICS */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-8">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift 2xl:p-8"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground 2xl:text-base">
                  {tr(m.label)}
                </p>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg 2xl:h-12 2xl:w-12 ${m.tone}`}
                >
                  <m.icon className="h-4.5 w-4.5 2xl:h-6 2xl:w-6" />
                </span>
              </div>
              <p
                className={`num mt-3 text-3xl font-extrabold 2xl:mt-5 2xl:text-5xl ${m.money ? "text-success" : ""}`}
              >
                {m.value}{" "}
                {m.unit && (
                  <span className="text-base font-semibold text-muted-foreground 2xl:text-xl">
                    {m.unit}
                  </span>
                )}
              </p>
              {m.sub && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground 2xl:text-sm">
                  {m.sub}
                </p>
              )}
              {m.badge && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning 2xl:px-3 2xl:py-1.5 2xl:text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-60" />
                    <span className="relative h-2 w-2 rounded-full bg-warning" />
                  </span>
                  {m.badge}
                </span>
              )}
            </div>
          ))}
        </section>

        {/* MATCHMAKER */}
        <section className="rounded-2xl border bg-surface p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">{tr(t.search.title)}</h2>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                {tr(t.search.sub)}
              </p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <Field label={tr(t.search.budget)}>
              <div className="flex items-center rounded-lg border bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">
                <input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  inputMode="decimal"
                  className="num w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold outline-none"
                />
                <span className="px-3 text-sm text-muted-foreground">
                  {lang === "ar" ? "د.ب" : "BHD"}
                </span>
              </div>
            </Field>
            <Field label={tr(t.search.category)}>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {tr(c.label)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={tr(t.search.date)}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </Field>
            <button
              onClick={runSearch}
              className="inline-flex h-[42px] items-center justify-center gap-2 self-end rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {tr(t.search.cta)}
            </button>
          </div>
        </section>

        {/* GRID */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">{tr(t.grid.title)}</h2>
            <span className="num text-sm text-muted-foreground">
              {results.length} {tr(t.grid.count)}
            </span>
          </div>
          {results.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              {tr(t.grid.empty)}
            </p>
          ) : (
            <div
              className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-4 transition-opacity ${searching ? "opacity-40" : ""}`}
            >
              {results.map((c) => (
                <article
                  key={c.id}
                  className="flex h-full flex-col justify-between rounded-2xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift 2xl:p-8"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={c.img}
                        alt={tr(c.name)}
                        loading="lazy"
                        width={816}
                        height={816}
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-accent 2xl:h-20 2xl:w-20"
                      />
                      <div className="min-w-0 text-left">
                        <p className="flex items-center gap-1 truncate font-bold 2xl:text-xl">
                          {tr(c.name)}
                          <BadgeCheck className="h-4 w-4 shrink-0 fill-primary text-primary-foreground 2xl:h-5 2xl:w-5" />
                        </p>
                        <p
                          dir="ltr"
                          className="text-left text-sm text-muted-foreground 2xl:text-base"
                        >
                          {c.handle}
                        </p>
                      </div>
                    </div>
                    <div
                      dir="ltr"
                      className="mt-3 flex flex-wrap gap-1.5"
                      style={{ justifyContent: lang === "ar" ? "flex-end" : "flex-start" }}
                    >
                      {c.tags.map((tg) => (
                        <span
                          key={tg}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground 2xl:px-3 2xl:py-1 2xl:text-sm"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2 text-sm 2xl:space-y-3 2xl:text-base">
                      <Stat icon={Users} label={tr(t.card.followers)} value={c.followers} />
                      <Stat icon={Eye} label={tr(t.card.views)} value={c.storyViews} />
                      <Stat
                        icon={ShieldCheck}
                        label={tr(t.card.reliability)}
                        value={`${c.reliability}%`}
                        hint={`${c.campaigns} ${tr(t.card.completed)}`}
                      />
                    </div>
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success 2xl:mt-6 2xl:px-4 2xl:py-1.5 2xl:text-sm">
                      <Check className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
                      {tr(t.card.match)} <span className="num">{applied.budget}</span>{" "}
                      {tr(t.card.budgetWord)}
                    </span>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-5 2xl:gap-4 2xl:pt-8">
                    <a
                      href={`/creators/${c.handle.replace("@", "")}`}
                      className="flex items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-semibold transition hover:border-primary hover:text-primary 2xl:px-4 2xl:py-3 2xl:text-sm"
                    >
                      {tr(t.card.kit)}
                    </a>
                    <button
                      onClick={() => setBooking(c)}
                      className="rounded-lg bg-primary px-2 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 2xl:px-4 2xl:py-3 2xl:text-sm"
                    >
                      {tr(t.card.book)}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t bg-surface">
        <div className="mx-auto w-[92%] max-w-[1680px] grid gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8 2xl:py-16">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Vloop" className="h-8 w-auto" />
              <span className="text-lg font-extrabold">
                Vloop <span className="font-light text-muted-foreground">|</span> ڤلوب
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {tr(t.footer.desc)}
            </p>
          </div>
          {(
            [
              [t.footer.platform, t.footerLinks.platform],
              [t.footer.creators, t.footerLinks.creators],
              [t.footer.legal, t.footerLinks.legal],
            ] as [L, L[]][]
          ).map(([h, links]) => (
            <div key={h.en}>
              <h4 className="mb-3 text-sm font-bold">{tr(h)}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {links.map((l) => (
                  <li key={l.en}>
                    <a className="cursor-pointer hover:text-primary">{tr(l)}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t">
          <div className="mx-auto flex w-[92%] max-w-[1680px] flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row lg:px-8 2xl:py-8 2xl:text-sm">
            <p>{tr(t.footer.rights)}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{tr(t.footer.made)}</span>
              {["BenefitPay", "Mada", "VISA", "Mastercard"].map((p) => (
                <span key={p} className="rounded-md border bg-card px-2 py-1 font-bold">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {booking && (
        <BookingModal
          creator={booking}
          lang={lang}
          fee={applied.budget}
          onClose={() => setBooking(null)}
          selectedDate={date}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="text-end">
        <b className="num">{value}</b>
        {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
      </span>
    </div>
  );
}
