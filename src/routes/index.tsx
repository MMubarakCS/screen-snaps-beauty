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
import { useLang } from "@/components/vloop/Shell";
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
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  const [budget, setBudget] = useState("150.000");
  const [cat, setCat] = useState("food-casual-dining");
  const [date, setDate] = useState("");
  const [applied, setApplied] = useState({ budget: 150, cat: "food-casual-dining" });
  const [searching, setSearching] = useState(false);
  const [booking, setBooking] = useState<Creator | null>(null);
  const [kit, setKit] = useState<string | null>(null);
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
                <option value="all">{tr({ ar: "جميع الفئات", en: "All Categories" })}</option>
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
                        className="size-12 rounded-full object-cover shrink-0 ring-2 ring-accent 2xl:size-16"
                      />
                      <div className="flex flex-col items-start text-start min-w-0 pb-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-foreground leading-normal 2xl:text-xl">
                            {tr(c.name)}
                          </h3>
                          <BadgeCheck className="size-4 text-primary shrink-0 fill-primary text-primary-foreground 2xl:size-5" />
                        </div>
                        <span
                          className="text-xs text-muted-foreground font-medium mt-0.5"
                          style={{ direction: "ltr", unicodeBidi: "isolate" }}
                        >
                          {c.handle}
                        </span>
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
