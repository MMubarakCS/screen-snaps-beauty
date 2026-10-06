import { createContext, useContext, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { QrCode, ChevronDown, Check, LogOut, Settings, Building2, Lock, Menu, X, Store, Video, CircleHelp, UserCog, ShieldCheck, Link as LinkIcon, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyProfileModal, AccountSettingsModal } from "@/components/vloop/AccountModals";
import { CreatorProfileModal, CreatorSettingsModal } from "@/components/vloop/CreatorModals";
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
  const isPublic = location.pathname === "/" || location.pathname === "/home";
  const isCreator = location.pathname.startsWith("/creator");
  const homeDestination = isCreator
    ? "/creator"
    : ["/merchant", "/campaigns", "/invoices"].some((section) =>
          location.pathname.startsWith(section),
        )
      ? "/merchant"
      : "/";
  const tr = (x: L) => x[lang];
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [adminSettingsOpen, setAdminSettingsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@vloop.bh");
  const [helpOpen, setHelpOpen] = useState(false);
  const [modal, setModal] = useState<"company" | "settings" | AuthModal | "auth-login" | "creator-profile" | "creator-settings" | null>(null);
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
    const handleOpenCreatorProfile = () => setModal("creator-profile");
    window.addEventListener("open-auth-modal", handleOpenModal);
    window.addEventListener("open-help-modal", handleOpenHelp);
    window.addEventListener("open-creator-profile-modal", handleOpenCreatorProfile);
    return () => {
      window.removeEventListener("open-auth-modal", handleOpenModal);
      window.removeEventListener("open-help-modal", handleOpenHelp);
      window.removeEventListener("open-creator-profile-modal", handleOpenCreatorProfile);
    };
  }, []);

  const copyKiosk = () => {
    navigator.clipboard?.writeText("https://vloop.bh/kiosk/flame-burger-104829");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  useEffect(() => {
    if (!location.pathname.startsWith("/admin")) return;
    try {
      const savedEmail = window.localStorage.getItem("vloop.admin-email");
      if (savedEmail) setAdminEmail(savedEmail);
    } catch (error) {
      console.error("Unable to load the admin email.", error);
      toast.error(lang === "ar" ? "تعذر تحميل البريد الإلكتروني للمسؤول" : "Unable to load the admin email");
    }
  }, [lang, location.pathname]);
  const saveAdminEmail = (email: string) => {
    try {
      window.localStorage.setItem("vloop.admin-email", email);
      setAdminEmail(email);
      return true;
    } catch (error) {
      console.error("Unable to save the admin email.", error);
      toast.error(lang === "ar" ? "تعذر حفظ البريد الإلكتروني للمسؤول" : "Unable to save the admin email");
      return false;
    }
  };
  if (location.pathname.startsWith("/admin")) {
    return (
      <>
        <header className="sticky top-0 z-40 whitespace-nowrap border-b bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
            <Link to="/admin" className="flex shrink-0 items-center gap-2">
              <img src="/logo.png" alt="Vloop" className="h-8 w-auto" />
              <span className="hidden text-lg font-extrabold sm:inline">
                Vloop <span className="font-light text-muted-foreground">|</span> ڤلوب
              </span>
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-xs font-bold text-background">
              <ShieldCheck className="h-3.5 w-3.5" />
              {lang === "ar" ? "لوحة الإدارة العليا" : "Super Admin"}
            </span>
            <span className="hidden items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1.5 text-xs font-semibold text-success xl:inline-flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              {lang === "ar" ? "نظام الأمانات والتحكيم المالي نشط" : "Escrow & arbitration system active"}
              <span dir="ltr" className="font-bold">— CBB & NBR Compliant</span>
            </span>
            <div className="ms-auto flex items-center gap-3">
              <div className="flex rounded-lg border p-0.5 text-xs font-bold">
                {(["ar", "en"] as const).map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={`rounded-md px-2.5 py-1.5 transition ${lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="flex items-center gap-2 rounded-lg p-1.5 text-start transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">SA</span>
                    <span className="hidden leading-tight md:block">
                      <span className="block text-sm font-bold">{lang === "ar" ? "مدير النظام" : "System Admin"}</span>
                      <span className="block text-xs text-muted-foreground" dir="ltr">{adminEmail}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-60">
                  <DropdownMenuItem onSelect={() => setAdminSettingsOpen(true)} className="cursor-pointer">
                    <Settings className="h-4 w-4" />
                    {lang === "ar" ? "إعدادات الحساب والأمان" : "Admin Settings"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setLogoutDialog(true)} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    {lang === "ar" ? "تسجيل الخروج" : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        {adminSettingsOpen && (
          <AdminSettingsModal
            lang={lang}
            email={adminEmail}
            onClose={() => setAdminSettingsOpen(false)}
            onSaveEmail={saveAdminEmail}
          />
        )}
        {logoutDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center whitespace-normal bg-foreground/40 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setLogoutDialog(false)}>
            <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lift animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-bold">{lang === "ar" ? "تسجيل الخروج من الحساب" : "Log out of your account"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {lang === "ar"
                  ? "هل أنت متأكد من رغبتك في تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى لوحة التحكم."
                  : "Are you sure you want to log out? You will need to sign in again to access the dashboard."}
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={() => setLogoutDialog(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-muted">
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={() => {
                    setLogoutDialog(false);
                    toast(lang === "ar" ? "تم تسجيل الخروج. إلى اللقاء 👋" : "You've been logged out. Goodbye 👋");
                    void router.navigate({ to: "/home" });
                  }}
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
  return (
    <>
      {/* NAV */}
      <header className="sticky top-0 z-40 whitespace-nowrap border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-[92%] max-w-[1680px] items-center gap-6 px-4 lg:px-8">
          <Link to={homeDestination} className="flex shrink-0 items-center gap-2">
            <img src="/logo.png" alt="Vloop" className="h-8 w-auto" />
            <span className="text-lg font-extrabold tracking-tight" dir="ltr">
              Vloop <span className="font-normal text-border">|</span> ڤلوب
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
          ) : (
            <nav className="hidden items-center gap-1 text-sm font-medium lg:flex">
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
            </nav>
          )}
          <div className="ms-auto flex items-center gap-3">
            <div className={`${isCreator ? "flex" : "hidden lg:flex"} rounded-lg border p-0.5 text-xs font-bold`}>
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
                  className="hidden md:flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-3 py-1.5 text-sm font-bold text-success"
                >
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  {lang === "ar" ? "متاح للحجوزات" : "Available"}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText("vloop.me/@yousif.bites");
                    toast.success(lang === "ar" ? "تم نسخ الرابط!" : "Link copied!");
                  }}
                  className="hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-bold text-foreground transition hover:bg-muted"
                  title="Copy Bio-Link"
                >
                  <LinkIcon className="h-4 w-4" />
                  vloop.me/@yousif.bites
                </button>
                <div className="relative">
                  <button
                    onClick={() => setMenu((m) => !m)}
                    className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted"
                  >
                    <img src={c2} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <span className="hidden flex-col items-start text-start leading-tight xl:flex">
                      <span className="flex items-center gap-1 text-sm font-semibold">
                        {lang === "ar" ? "يوسف المناعي" : "Yousif Al-Mannai"}
                        <Check className="h-3 w-3 rounded-full bg-primary p-0.5 text-primary-foreground" />
                      </span>
                      <span className="num text-xs text-muted-foreground" style={{ direction: "ltr", unicodeBidi: "isolate" }}>
                        @yousif.bites
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {menu && (
                    <div className="absolute end-0 top-12 w-52 rounded-xl border bg-popover p-1.5 shadow-lift animate-in fade-in zoom-in-95">
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
            {!isCreator && (
              <button
                onClick={() => setMobileMenu(true)}
                className="lg:hidden p-1.5 -me-1 rounded-lg hover:bg-muted text-foreground"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenu && !isCreator && (
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
      {modal === "creator-profile" && <CreatorProfileModal onClose={() => setModal(null)} />}
      {modal === "creator-settings" && <CreatorSettingsModal onClose={() => setModal(null)} />}
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

function AdminSettingsModal({
  lang,
  email,
  onClose,
  onSaveEmail,
}: {
  lang: Lang;
  email: string;
  onClose: () => void;
  onSaveEmail: (email: string) => boolean;
}) {
  const [nextEmail, setNextEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isAr = lang === "ar";

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const changingPassword = Boolean(currentPassword || newPassword || confirmPassword);
    if (changingPassword && (!currentPassword || !newPassword || !confirmPassword || newPassword.length < 8)) {
      toast.error(isAr
        ? "أدخل كلمة المرور الحالية والجديدة وتأكيدها، على أن تكون الجديدة 8 أحرف على الأقل"
        : "Enter your current, new, and confirmation passwords; the new password must be 8+ characters");
      return;
    }
    if (changingPassword && newPassword !== confirmPassword) {
      toast.error(isAr ? "تأكيد كلمة المرور الجديدة غير متطابق" : "New password confirmation does not match");
      return;
    }
    const normalizedEmail = nextEmail.trim();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error(isAr ? "أدخل بريداً إلكترونياً صحيحاً" : "Enter a valid email address");
      return;
    }
    if (!onSaveEmail(normalizedEmail)) return;
    toast.success(isAr ? "تم تحديث إعدادات المسؤول بنجاح" : "Admin settings updated successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-settings-title"
        className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-5 shadow-lift sm:p-6"
        onSubmit={save}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="admin-settings-title" className="flex items-center gap-2 text-lg font-bold">
            <Settings className="h-5 w-5 text-primary" />
            {isAr ? "إعدادات الحساب والأمان" : "Admin Settings"}
          </h2>
          <button type="button" onClick={onClose} aria-label={isAr ? "إغلاق" : "Close"} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="block text-sm font-semibold">
          <span className="mb-1.5 flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{isAr ? "البريد الإلكتروني للمسؤول" : "Admin email"}</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={nextEmail}
            onChange={(event) => setNextEmail(event.target.value)}
            dir="ltr"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>
        <div className="space-y-3 border-t pt-4">
          <h3 className="flex items-center gap-2 text-sm font-bold"><KeyRound className="h-4 w-4 text-muted-foreground" />{isAr ? "تغيير كلمة المرور" : "Change password"}</h3>
          <input
            type="password"
            autoComplete="current-password"
            placeholder={isAr ? "كلمة المرور الحالية" : "Current password"}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="password"
              autoComplete="new-password"
              placeholder={isAr ? "كلمة المرور الجديدة" : "New password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              autoComplete="new-password"
              placeholder={isAr ? "تأكيد كلمة المرور" : "Confirm password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {isAr ? "اترك حقول كلمة المرور فارغة إذا كنت تريد تغيير البريد الإلكتروني فقط." : "Leave password fields blank if you only want to change the email."}
          </p>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted">{isAr ? "إلغاء" : "Cancel"}</button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">{isAr ? "حفظ الإعدادات" : "Save settings"}</button>
        </div>
      </form>
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
