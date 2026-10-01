import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, QrCode, ChevronDown, Megaphone, Footprints, Timer, TrendingUp, Search, Users, Eye, ShieldCheck, Check, Wallet, LogOut, Settings, UserCog, Loader2, Sparkles } from "lucide-react";
import { BookingModal } from "@/components/vloop/BookingModal";
import { type Lang, type L, type Creator, creators, categories, fmtBHD, t } from "@/lib/vloop-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vloop | ڤلوب — Merchant Discovery & Campaign Dashboard" },
      { name: "description", content: "Discover creators within your budget and book influencer campaigns secured by Vloop escrow in Bahrain." },
      { property: "og:title", content: "Vloop | ڤلوب — Merchant Dashboard" },
      { property: "og:description", content: "Influencer marketing with financial escrow for local businesses in Bahrain & the GCC." },
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

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const results = useMemo(
    () => creators.filter((c) => c.minRate <= applied.budget && (applied.cat === "all" || c.categories.includes(applied.cat))),
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
    { icon: Megaphone, label: t.m1.label, value: "3", sub: `${tr(t.m1.sub)} ${fmtBHD(450, lang)}`, tone: "text-primary bg-accent" },
    { icon: Footprints, label: t.m2.label, value: `1,280`, unit: tr(t.m2.unit), sub: tr(t.m2.sub), tone: "text-sky bg-accent" },
    { icon: Timer, label: t.m3.label, value: "1", unit: tr(t.m3.unit), badge: tr(t.m3.badge), tone: "text-warning bg-warning-soft" },
    { icon: TrendingUp, label: t.m4.label, value: "3.8x", sub: tr(t.m4.sub), tone: "text-success bg-success-soft", money: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 lg:px-8">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <img src="/logo.png" alt="Vloop" className="h-8 w-auto" />
            <span className="text-lg font-extrabold">Vloop <span className="font-light text-muted-foreground">|</span> ڤلوب</span>
          </a>
          <nav className="hidden items-center gap-1 text-sm font-medium xl:flex">
            <a className="rounded-lg bg-accent px-3 py-2 text-accent-foreground">{tr(t.nav.discover)}</a>
            <a className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">{tr(t.nav.campaigns)}</a>
            <a className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Wallet className="h-4 w-4 text-success" />{tr(t.nav.escrow)}: <span className="num font-bold text-success">{fmtBHD(350, lang)}</span>
            </a>
            <a className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">{tr(t.nav.invoices)}</a>
          </nav>
          <div className="ms-auto flex items-center gap-3">
            <button onClick={copyKiosk} className="hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary md:inline-flex">
              {copied ? <Check className="h-4 w-4 text-success" /> : <QrCode className="h-4 w-4" />}
              {tr(copied ? t.nav.copied : t.nav.kiosk)}
            </button>
            <div className="flex rounded-lg border p-0.5 text-xs font-bold">
              {(["ar", "en"] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`rounded-md px-2.5 py-1.5 transition ${lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">FB</span>
                <span className="hidden text-start leading-tight lg:block">
                  <span className="block text-sm font-bold">{tr(t.merchant.name)}</span>
                  <span className="num block text-xs text-muted-foreground">{tr(t.merchant.cr)}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {menu && (
                <div className="absolute end-0 top-12 w-52 rounded-xl border bg-popover p-1.5 shadow-lift animate-in fade-in zoom-in-95">
                  {[[Settings, t.merchant.settings], [UserCog, t.merchant.team], [LogOut, t.merchant.logout]].map(([I, l], i) => {
                    const Icon = I as typeof Settings;
                    return <button key={i} onClick={() => setMenu(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"><Icon className="h-4 w-4 text-muted-foreground" />{tr(l as L)}</button>;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{tr(t.greet.title)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tr(t.greet.sub)}</p>
        </div>

        {/* METRICS */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={i} className="rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">{tr(m.label)}</p>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${m.tone}`}><m.icon className="h-4.5 w-4.5" /></span>
              </div>
              <p className={`num mt-3 text-3xl font-extrabold ${m.money ? "text-success" : ""}`}>
                {m.value} {m.unit && <span className="text-base font-semibold text-muted-foreground">{m.unit}</span>}
              </p>
              {m.sub && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.sub}</p>}
              {m.badge && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-60" /><span className="relative h-2 w-2 rounded-full bg-warning" /></span>
                  {m.badge}
                </span>
              )}
            </div>
          ))}
        </section>

        {/* MATCHMAKER */}
        <section className="rounded-2xl border bg-surface p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
            <div>
              <h2 className="text-lg font-bold">{tr(t.search.title)}</h2>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-success" />{tr(t.search.sub)}</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <Field label={tr(t.search.budget)}>
              <div className="flex items-center rounded-lg border bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">
                <input value={budget} onChange={(e) => setBudget(e.target.value)} inputMode="decimal" className="num w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold outline-none" />
                <span className="px-3 text-sm text-muted-foreground">{lang === "ar" ? "د.ب" : "BHD"}</span>
              </div>
            </Field>
            <Field label={tr(t.search.category)}>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary">
                {categories.map((c) => <option key={c.id} value={c.id}>{tr(c.label)}</option>)}
              </select>
            </Field>
            <Field label={tr(t.search.date)}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
            </Field>
            <button onClick={runSearch} className="inline-flex h-[42px] items-center justify-center gap-2 self-end rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{tr(t.search.cta)}
            </button>
          </div>
        </section>

        {/* GRID */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">{tr(t.grid.title)}</h2>
            <span className="num text-sm text-muted-foreground">{results.length} {tr(t.grid.count)}</span>
          </div>
          {results.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">{tr(t.grid.empty)}</p>
          ) : (
            <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-4 transition-opacity ${searching ? "opacity-40" : ""}`}>
              {results.map((c) => (
                <article key={c.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-center gap-3">
                    <img src={c.img} alt={tr(c.name)} loading="lazy" width={816} height={816} className="h-14 w-14 rounded-full object-cover ring-2 ring-accent" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 truncate font-bold">{tr(c.name)}<BadgeCheck className="h-4 w-4 shrink-0 fill-primary text-primary-foreground" /></p>
                      <p dir="ltr" className="text-start text-sm text-muted-foreground">{c.handle}</p>
                    </div>
                  </div>
                  <div dir="ltr" className="mt-3 flex flex-wrap gap-1.5" style={{ justifyContent: lang === "ar" ? "flex-end" : "flex-start" }}>
                    {c.tags.map((tg) => <span key={tg} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{tg}</span>)}
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <Stat icon={Users} label={tr(t.card.followers)} value={c.followers} />
                    <Stat icon={Eye} label={tr(t.card.views)} value={c.storyViews} />
                    <Stat icon={ShieldCheck} label={tr(t.card.reliability)} value={`${c.reliability}%`} hint={`${c.campaigns} ${tr(t.card.completed)}`} />
                  </div>
                  {kit === c.id && (
                    <div className="mt-3 space-y-1 rounded-lg bg-surface p-3 text-xs animate-in fade-in">
                      <p><span className="text-muted-foreground">{tr(t.card.engagement)}:</span> <b className="num">{c.engagement}</b></p>
                      <p><span className="text-muted-foreground">{tr(t.card.audience)}:</span> <b>{tr(c.audience)}</b></p>
                    </div>
                  )}
                  <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
                    <Check className="h-3.5 w-3.5" />{tr(t.card.match)} <span className="num">{applied.budget}</span> {tr(t.card.budgetWord)}
                  </span>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                    <button onClick={() => setKit(kit === c.id ? null : c.id)} className="rounded-lg border px-2 py-2 text-xs font-semibold transition hover:border-primary hover:text-primary">{tr(kit === c.id ? t.card.hideKit : t.card.kit)}</button>
                    <button onClick={() => setBooking(c)} className="rounded-lg bg-primary px-2 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90">{tr(t.card.book)}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Vloop" className="h-8 w-auto" />
              <span className="text-lg font-extrabold">Vloop <span className="font-light text-muted-foreground">|</span> ڤلوب</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{tr(t.footer.desc)}</p>
          </div>
          {([[t.footer.platform, t.footerLinks.platform], [t.footer.creators, t.footerLinks.creators], [t.footer.legal, t.footerLinks.legal]] as [L, L[]][]).map(([h, links]) => (
            <div key={h.en}>
              <h4 className="mb-3 text-sm font-bold">{tr(h)}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">{links.map((l) => <li key={l.en}><a className="cursor-pointer hover:text-primary">{tr(l)}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="border-t">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row lg:px-8">
            <p>{tr(t.footer.rights)}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{tr(t.footer.made)}</span>
              {["BenefitPay", "Mada", "VISA", "Mastercard"].map((p) => <span key={p} className="rounded-md border bg-card px-2 py-1 font-bold">{p}</span>)}
            </div>
          </div>
        </div>
      </footer>

      {booking && <BookingModal creator={booking} lang={lang} fee={applied.budget} onClose={() => setBooking(null)} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>{children}</label>;
}

function Stat({ icon: Icon, label, value, hint }: { icon: typeof Users; label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</span>
      <span className="text-end"><b className="num">{value}</b>{hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}</span>
    </div>
  );
}
