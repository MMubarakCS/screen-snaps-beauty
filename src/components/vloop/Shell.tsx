import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { QrCode, ChevronDown, Check, LogOut, Settings, Building2, Lock, Menu, X } from "lucide-react";
import { type Lang, type L, fmtBHD, t } from "@/lib/vloop-data";

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "ar", setLang: () => {} });
export const useLang = () => useContext(LangCtx);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function AppHeader() {
  const { lang, setLang } = useLang();
  const tr = (x: L) => x[lang];
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const copyKiosk = () => {
    navigator.clipboard?.writeText("https://vloop.bh/kiosk/flame-burger-104829");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      {/* NAV */}
      <header className="sticky top-0 z-40 whitespace-nowrap border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-[92%] max-w-[1680px] items-center gap-6 px-4 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src="/logo.png" alt="Vloop" className="h-8 w-auto" />
            <span className="text-lg font-extrabold">
              Vloop <span className="font-light text-muted-foreground">|</span> ڤلوب
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium lg:flex">
            <Link to="/" activeOptions={{ exact: true }} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
              {tr(t.nav.discover)}
            </Link>
            <Link to="/campaigns" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
              {tr(t.nav.campaigns)}
              <span className="h-1.5 w-1.5 rounded-full bg-warning" title="Pending review"></span>
            </Link>
            <a className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              {tr(t.nav.invoices)}
            </a>
          </nav>
          <div className="ms-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1.5 text-sm font-semibold text-success">
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
            <div className="hidden lg:flex rounded-lg border p-0.5 text-xs font-bold">
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
            <button
              onClick={() => setMobileMenu(true)}
              className="lg:hidden p-1.5 -me-1 rounded-lg hover:bg-muted text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in" onClick={() => setMobileMenu(false)}>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          <div 
            className="absolute top-0 bottom-0 start-0 w-[280px] max-w-[80vw] bg-background border-e shadow-2xl animate-in slide-in-from-start-full duration-300 p-6 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold flex items-center gap-2">
                <img src="/logo.png" alt="Vloop" className="h-8 w-auto" />
              </span>
              <button onClick={() => setMobileMenu(false)} className="p-2 -me-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              <Link to="/" onClick={() => setMobileMenu(false)} className="px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                {tr(t.nav.discover)}
              </Link>
              <Link to="/campaigns" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                {tr(t.nav.campaigns)}
                <span className="h-2 w-2 rounded-full bg-warning"></span>
              </Link>
              <a onClick={() => setMobileMenu(false)} className="px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted cursor-pointer">
                {tr(t.nav.invoices)}
              </a>
            </nav>

            <div className="mt-auto flex flex-col gap-4 pt-6 border-t">
              <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-base font-semibold text-success">
                <Lock className="h-5 w-5" />
                {lang === "ar" ? "في الضمان:" : "Escrow:"} <span className="num font-bold">{fmtBHD(350, lang)}</span>
              </div>
              <button
                onClick={() => { copyKiosk(); setMobileMenu(false); }}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
              >
                {copied ? <Check className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
                {tr(copied ? t.nav.copied : t.nav.kiosk)}
              </button>
              <div className="flex rounded-xl border p-1 text-sm font-bold bg-muted/50">
                {(["ar", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setMobileMenu(false); }}
                    className={`flex-1 rounded-lg py-2.5 transition ${lang === l ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}

export function AppFooter() {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  return (
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
  );
}
