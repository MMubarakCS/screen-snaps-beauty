import { createContext, useContext, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { QrCode, ChevronDown, Check, LogOut, Settings, Building2, Lock, Menu, X, Store, Video, CircleHelp, UserCog, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { CompanyProfileModal, AccountSettingsModal } from "@/components/vloop/AccountModals";
import { CreatorProfileModal } from "@/components/vloop/CreatorProfileModal";
import { CreatorSettingsModal } from "@/components/vloop/CreatorSettingsModal";
import { HelpModal } from "@/components/vloop/HelpModal";
import c2 from "@/assets/creator-2.jpg";
import { type Lang, type L, fmtBHD, t, categories } from "@/lib/vloop-data";

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "ar", setLang: () => {} });
export const useLang = () => useContext(LangCtx);

type MerchantProfile = { categoryId: string; logoUrl: string | null };
type AuthModal = "auth-start" | "auth-merchant" | "auth-creator";
const defaultMerchantProfile: MerchantProfile = { categoryId: "food-casual-dining", logoUrl: null };
const MerchantProfileCtx = createContext<{
  profile: MerchantProfile;
  updateProfile: (updates: Partial<MerchantProfile>) => void;
}>({
  profile: defaultMerchantProfile,
  updateProfile: () => {},
});

export const useMerchantProfile = () => useContext(MerchantProfileCtx);

function isMerchantProfile(value: unknown): value is MerchantProfile {
  return (
    typeof value === "object" &&
    value !== null &&
    "categoryId" in value &&
    typeof value.categoryId === "string" &&
    categories.some((category) => category.id === value.categoryId) &&
    "logoUrl" in value &&
    (typeof value.logoUrl === "string" || value.logoUrl === null)
  );
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [profile, setProfile] = useState(defaultMerchantProfile);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    if (profileLoaded) return;
    try {
      const storedProfile = localStorage.getItem("vloop.merchant-profile");
      if (storedProfile) {
        const parsed: unknown = JSON.parse(storedProfile);
        if (isMerchantProfile(parsed)) {
          setProfile(parsed);
        } else {
          toast.error(lang === "ar" ? "تعذر تحميل بيانات المنشأة المحفوظة" : "Saved company profile data is invalid");
        }
      }
    } catch (error) {
      console.error("Failed to load the saved company profile", error);
      toast.error(lang === "ar" ? "تعذر تحميل بيانات المنشأة المحفوظة" : "Could not load the saved company profile");
    } finally {
      setProfileLoaded(true);
    }
  }, [lang, profileLoaded]);

  useEffect(() => {
    if (!profileLoaded) return;
    try {
      localStorage.setItem("vloop.merchant-profile", JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to save the company profile", error);
      toast.error(lang === "ar" ? "تعذر حفظ بيانات المنشأة" : "Could not save the company profile");
    }
  }, [lang, profile, profileLoaded]);

  const updateProfile = (updates: Partial<MerchantProfile>) => {
    setProfile((current) => ({ ...current, ...updates }));
  };

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <MerchantProfileCtx.Provider value={{ profile, updateProfile }}>
        {children}
      </MerchantProfileCtx.Provider>
    </LangCtx.Provider>
  );
}

export function AppHeader() {
  const { lang, setLang } = useLang();
  const { profile } = useMerchantProfile();
  const location = useLocation();
  const router = useRouter();
  const isPublic = location.pathname === "/";
  const isCreator = location.pathname.startsWith("/creator");
  const tr = (x: L) => x[lang];
  const [copied, setCopied] = useState(false);
  const [available, setAvailable] = useState(true);
  const [menu, setMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
<<<<<<< HEAD
  const [modal, setModal] = useState<"company" | "settings" | AuthModal | "auth-login" | "creator-profile" | "creator-settings" | null>(null);
=======
  const [modal, setModal] = useState<"company" | "settings" | "creator-profile" | "creator-settings" | AuthModal | "auth-login" | null>(null);
>>>>>>> 5728e663845c12a065823f7ec2f1797264796aac
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const type: unknown = (e as CustomEvent<unknown>).detail;
      if (type === "auth-start" || type === "auth-merchant" || type === "auth-creator") {
        setModal(type);
      }
    };
    const handleOpenHelp = () => setHelpOpen(true);
    window.addEventListener("open-auth-modal", handleOpenModal);
    window.addEventListener("open-help-modal", handleOpenHelp);
    return () => {
      window.removeEventListener("open-auth-modal", handleOpenModal);
      window.removeEventListener("open-help-modal", handleOpenHelp);
    };
  }, []);

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
          {isPublic ? (
            <nav dir={lang === "ar" ? "rtl" : "ltr"} className="hidden flex-row items-center gap-1 text-sm font-medium lg:flex">
              <a href="#voucher-claim" onClick={(e) => handleNavClick(e, "voucher-claim")} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                {lang === "ar" ? "استرداد قسيمة خصم" : "Claim Voucher"}
              </a>
              <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                {lang === "ar" ? "كيف تعمل المنصة" : "How it Works"}
              </a>
              <a href="#creators-showcase" onClick={(e) => handleNavClick(e, "creators-showcase")} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                {lang === "ar" ? "صنّاع المحتوى" : "Creators"}
              </a>
              <a href="#faq" onClick={(e) => handleNavClick(e, "faq")} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
              </a>
            </nav>
          ) : isCreator ? null : (
            <nav className="hidden items-center gap-1 text-sm font-medium lg:flex">
<<<<<<< HEAD
              {location.pathname.startsWith("/creator") ? null : (
                <>
                  <Link to="/merchant" activeOptions={{ exact: true }} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                    {tr(t.nav.discover)}
                  </Link>
                  <Link to="/campaigns" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                    {tr(t.nav.campaigns)}
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" title="Pending review"></span>
                  </Link>
                  <Link to="/invoices" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                    {tr(t.nav.invoices)}
                  </Link>
                </>
              )}
=======
              <Link to="/merchant" activeOptions={{ exact: true }} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                {tr(t.nav.discover)}
              </Link>
              <Link to="/campaigns" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                {tr(t.nav.campaigns)}
                <span className="h-1.5 w-1.5 rounded-full bg-warning" title="Pending review"></span>
              </Link>
              <Link to="/invoices" className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                {tr(t.nav.invoices)}
              </Link>
>>>>>>> 5728e663845c12a065823f7ec2f1797264796aac
            </nav>
          )}
          <div className="ms-auto flex items-center gap-3">
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
            {isPublic ? (
              <>
                <button onClick={() => setModal("auth-login")} className="hidden lg:flex rounded-lg px-4 py-2 text-sm font-bold transition hover:bg-muted">
                  {lang === "ar" ? "تسجيل الدخول" : "Log In"}
                </button>
                <button onClick={() => setModal("auth-start")} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
                  {lang === "ar" ? "ابدأ الآن" : "Get Started"}
                </button>
              </>
            ) : isCreator ? (
              <>
                <button
                  onClick={() => {
                    setAvailable((v) => !v);
                    toast.success(available
                      ? (lang === "ar" ? "تم إيقاف استقبال الحجوزات مؤقتاً" : "Bookings paused")
                      : (lang === "ar" ? "أنت متاح الآن للحجوزات" : "You're now available for bookings"));
                  }}
                  aria-pressed={available}
                  className={`hidden md:flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold transition ${available ? "border-success/30 bg-success-soft text-success" : "border-border bg-muted text-muted-foreground"}`}
                >
                  <span className={`h-2 w-2 rounded-full ${available ? "bg-success" : "bg-muted-foreground"}`}></span>
                  {available
                    ? (lang === "ar" ? "متاح للحجوزات" : "Available for Bookings")
                    : (lang === "ar" ? "غير متاح حالياً" : "Unavailable")}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText("https://vloop.me/@yousif.bites");
                    toast.success(lang === "ar" ? "تم نسخ الرابط!" : "Link copied!");
                  }}
                  className="hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-bold text-foreground transition hover:bg-muted"
                  title="Copy Bio-Link"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span dir="ltr">vloop.me/@yousif.bites</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setMenu((m) => !m)}
                    className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted"
                  >
                    <img src={c2} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <span className="hidden text-start leading-tight lg:block">
                      <span className="block text-sm font-bold flex items-center gap-1">
                        {lang === "ar" ? "يوسف المناعي" : "Yousif Al-Mannai"}
                        <Check className="h-3 w-3 rounded-full bg-primary p-0.5 text-primary-foreground" />
                      </span>
                      <span className="num block text-xs text-muted-foreground" dir="ltr">
                        @yousif.bites
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {menu && (
                    <div className="absolute end-0 top-12 w-64 rounded-xl border bg-popover p-1.5 shadow-lift animate-in fade-in zoom-in-95">
                      <button onClick={() => { setMenu(false); setModal("creator-profile"); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                        {lang === "ar" ? "الملف الشخصي والميديا كيت" : "Media Kit Profile"}
                      </button>
                      <button onClick={() => { setMenu(false); setModal("creator-settings"); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        {lang === "ar" ? "إعدادات الحساب والآيبان" : "Account & Payout Settings"}
                      </button>
                      <div className="my-1 border-t border-border"></div>
                      <button
                        onClick={() => {
                          setMenu(false);
                          setLogoutDialog(true);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        {lang === "ar" ? "تسجيل الخروج" : "Log out"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted"
              >
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">
                    FB
                  </span>
                )}
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
                    [Building2, { ar: "الملف التعريفي للمنشأة", en: "Company Profile" }, "company"],
                    [Settings, { ar: "إعدادات الحساب", en: "Account Settings" }, "settings"],
                  ].map(([I, l, k], i) => {
                    const Icon = I as typeof Settings;
                    const label = l as L;
                    return (
                      <button
                        key={i}
                        onClick={() => { setMenu(false); setModal(k as "company" | "settings"); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {tr(label)}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => { setMenu(false); setHelpOpen(true); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <CircleHelp className="h-4 w-4 text-muted-foreground" />
                    {tr({ ar: "المساعدة والدعم", en: "Help & Support" })}
                  </button>
                  <div className="my-1 border-t border-border"></div>
                  <button
                    onClick={() => {
                      setMenu(false);
                      setLogoutDialog(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    {tr({ ar: "تسجيل الخروج", en: "Log out" })}
                  </button>
                </div>
              )}
            </div>
            </>
            )}
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

            {isPublic ? (
              <nav className="flex flex-col gap-1">
                <a href="#voucher-claim" onClick={(e) => { handleNavClick(e, "voucher-claim"); setMobileMenu(false); }} className="px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted">
                  {lang === "ar" ? "استرداد قسيمة خصم" : "Claim Voucher"}
                </a>
                <a href="#how-it-works" onClick={(e) => { handleNavClick(e, "how-it-works"); setMobileMenu(false); }} className="px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted">
                  {lang === "ar" ? "كيف تعمل المنصة" : "How it Works"}
                </a>
                <a href="#creators-showcase" onClick={(e) => { handleNavClick(e, "creators-showcase"); setMobileMenu(false); }} className="px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted">
                  {lang === "ar" ? "صنّاع المحتوى" : "Creators"}
                </a>
                <a href="#faq" onClick={(e) => { handleNavClick(e, "faq"); setMobileMenu(false); }} className="px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted">
                  {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
                </a>
              </nav>
            ) : (
              <nav className="flex flex-col gap-1">
                <Link to="/" onClick={() => setMobileMenu(false)} className="px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                  {tr(t.nav.discover)}
                </Link>
                <Link to="/campaigns" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                  {tr(t.nav.campaigns)}
                  <span className="h-2 w-2 rounded-full bg-warning"></span>
                </Link>
                <Link to="/invoices" onClick={() => setMobileMenu(false)} className="px-4 py-3 text-lg font-semibold rounded-xl hover:bg-muted" activeProps={{ className: "!bg-accent !text-accent-foreground" }}>
                  {tr(t.nav.invoices)}
                </Link>
              </nav>
            )}

            {isPublic ? (
              <div className="mt-auto flex flex-col gap-4 pt-6 border-t">
                <button
                  onClick={() => { setMobileMenu(false); setModal("auth-start"); }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
                >
                  {lang === "ar" ? "ابدأ الآن" : "Get Started"}
                </button>
                <button
                  onClick={() => { setMobileMenu(false); setModal("auth-login"); }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-3 text-base font-bold text-foreground shadow-soft transition hover:bg-muted/80"
                >
                  {lang === "ar" ? "تسجيل الدخول" : "Log In"}
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
            ) : (
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
            )}
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION DIALOG */}
      {logoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center whitespace-normal bg-foreground/40 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setLogoutDialog(false)}>
          <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lift animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">
              {lang === "ar" ? "تسجيل الخروج من الحساب" : "Log out of your account"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === "ar"
                ? "هل أنت متأكد من رغبتك في تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى لوحة التحكم."
                : "Are you sure you want to log out? You will need to sign in again to access the dashboard."}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setLogoutDialog(false)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => { setLogoutDialog(false); toast(lang === "ar" ? "تم تسجيل الخروج. إلى اللقاء 👋" : "You've been logged out. Goodbye 👋"); router.navigate({ to: '/' }); }}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground hover:bg-destructive/90"
              >
                {lang === "ar" ? "تأكيد الخروج" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
      {modal === "company" && <CompanyProfileModal onClose={() => setModal(null)} />}
      {modal === "settings" && <AccountSettingsModal onClose={() => setModal(null)} />}
      {modal === "creator-profile" && <CreatorProfileModal onClose={() => setModal(null)} lang={lang} />}
      {modal === "creator-settings" && <CreatorSettingsModal onClose={() => setModal(null)} lang={lang} />}
      {(modal === "auth-start" || modal === "auth-merchant" || modal === "auth-creator") && (
        <AuthStartModal
          onClose={() => setModal(null)}
          onChooseOther={() => setModal("auth-start")}
          lang={lang}
          role={modal === "auth-merchant" ? "merchant" : modal === "auth-creator" ? "creator" : null}
        />
      )}
      {modal === "auth-login" && <AuthLoginModal onClose={() => setModal(null)} lang={lang} />}
      <HelpModal open={helpOpen} onOpenChange={setHelpOpen} lang={lang} />
    </>
  );
}

function AuthStartModal({
  onClose,
  onChooseOther,
  lang,
  role,
}: {
  onClose: () => void;
  onChooseOther: () => void;
  lang: Lang;
  role: "merchant" | "creator" | null;
}) {
  const isAr = lang === "ar";
  const router = useRouter();
  if (role) {
    const isMerchant = role === "merchant";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isMerchant
                ? isAr ? "ابدأ كمتجر" : "Get Started as a Merchant"
                : isAr ? "انضم كصانع محتوى" : "Join as a Creator"}
            </h2>
            <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            {isMerchant
              ? isAr ? "اكتشف صنّاع المحتوى وأطلق حملتك التسويقية بضمان مالي." : "Discover creators and launch your campaign with secure escrow."
              : isAr ? "استقبل طلبات الحملات وابدأ بتحقيق الدخل من محتواك." : "Receive campaign bookings and start earning from your content."}
          </p>
          {isMerchant ? (
            <Link to="/merchant" onClick={onClose} className="flex items-center justify-between rounded-xl border p-4 transition hover:border-primary hover:bg-primary/5">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </span>
                <span className="font-bold">{isAr ? "متابعة كمتجر" : "Continue as a Merchant"}</span>
              </div>
              <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">{isAr ? "ابدأ" : "Continue"}</span>
            </Link>
          ) : (
            <Link to="/creator" onClick={onClose} className="flex items-center justify-between rounded-xl border p-4 transition hover:border-primary hover:bg-primary/5">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky/10 text-sky">
                  <QrCode className="h-6 w-6" />
                </span>
                <span className="font-bold">{isAr ? "متابعة كصانع محتوى" : "Continue as a Creator"}</span>
              </div>
              <span className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-bold text-background">{isAr ? "ابدأ" : "Continue"}</span>
            </Link>
          )}
          <button onClick={onChooseOther} className="mt-5 w-full text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            {isAr ? "اختيار نوع حساب آخر" : "Choose another account type"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{isAr ? "اختر نوع حسابك" : "Choose Account Type"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <button
            onClick={() => {
              onClose();
              void router.navigate({ to: "/merchant" });
            }}
            className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-start transition hover:border-primary hover:bg-accent/40"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Store className="size-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground">{isAr ? "أنا صاحب منشأة / متجر" : "I am a Merchant / Brand"}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{isAr ? "حجز المؤثرين وإطلاق الحملات بضمان مالي" : "Book creators and launch escrow-secured campaigns"}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground group-hover:bg-primary/90">
              {isAr ? "دخول كمتجر" : "Merchant Login"}
            </span>
          </button>
          <button
            onClick={() => {
              onClose();
              void router.navigate({ to: "/creator" });
            }}
            className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-start transition hover:border-foreground/30 hover:bg-muted/50"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Video className="size-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-foreground">{isAr ? "أنا صانع محتوى / مؤثر" : "I am a Creator / Influencer"}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{isAr ? "استقبال الطلبات وتحقيق دخل مضمون مسبقاً" : "Receive bookings and earn guaranteed income"}</p>
              </div>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
              {isAr ? "دخول كصانع محتوى" : "Creator Login"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthLoginModal({ onClose, lang }: { onClose: () => void; lang: Lang }) {
  const isAr = lang === "ar";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl border bg-card p-8 shadow-2xl animate-in zoom-in-95 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">{isAr ? "تسجيل الدخول لـ ڤلوب" : "Log in to Vloop"}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {isAr ? "أدخل رقم هاتفك أو بريدك الإلكتروني للمتابعة" : "Enter your phone number or email to continue"}
        </p>
        <div className="space-y-3">
          <input type="text" placeholder={isAr ? "رقم الهاتف أو البريد" : "Phone or Email"} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <input type="password" placeholder={isAr ? "كلمة المرور" : "Password"} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <Link to="/merchant" onClick={onClose} className="block w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
            {isAr ? "دخول" : "Sign In"}
          </Link>
        </div>
        <button onClick={onClose} className="mt-4 text-xs font-semibold text-muted-foreground hover:text-foreground">
          {isAr ? "إلغاء" : "Cancel"}
        </button>
      </div>
    </div>
  );
}

export function AppFooter() {
  const { lang } = useLang();
  const location = useLocation();
  const tr = (x: L) => x[lang];
  const handleFooterLink = (event: MouseEvent<HTMLAnchorElement>, link: L) => {
    if (link.en !== "FAQ") return;
    event.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.dispatchEvent(new CustomEvent("open-help-modal"));
  };
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
                    <a
                      href={l.en === "FAQ" ? "#faq" : undefined}
                      onClick={(event) => handleFooterLink(event, l)}
                      className="cursor-pointer hover:text-primary"
                    >
                      {tr(l)}
                    </a>
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
