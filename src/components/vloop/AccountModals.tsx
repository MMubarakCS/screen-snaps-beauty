import { useEffect, useState, type ReactNode } from "react";
import { X, BadgeCheck, Check, Mail, Bell, KeyRound, Camera } from "lucide-react";
import { toast } from "sonner";
import { useLang, useMerchantProfile } from "@/components/vloop/Shell";
import { categories, type L } from "@/lib/vloop-data";

function useNoScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
}

function ModalFrame({ title, icon, onClose, children, footer }: { title: string; icon: ReactNode; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  const { lang } = useLang();
  useNoScroll();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center whitespace-normal bg-foreground/40 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-4" onClick={onClose}>
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border bg-card shadow-lift animate-in slide-in-from-bottom-4 sm:rounded-2xl 2xl:max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center gap-3 border-b px-6 py-4">
          {icon}
          <h2 className="flex-1 text-base font-bold 2xl:text-lg">{title}</h2>
          <button onClick={onClose} aria-label={lang === "ar" ? "إغلاق" : "Close"} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">{children}</div>
        <footer className="flex justify-end gap-3 border-t px-6 py-4">{footer}</footer>
      </div>
    </div>
  );
}

const input = "w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20";
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>{children}</label>;
}
const btnGhost = "rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-muted";
const btnPrimary = "rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90";

export function CompanyProfileModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const { profile, updateProfile } = useMerchantProfile();
  const tr = (x: L) => x[lang];
  const [logoPreview, setLogoPreview] = useState(profile.logoUrl);
  const [f, setF] = useState({
    name: tr({ ar: "شركة فليم برجر ذ.م.م", en: "Flame Burger Co. W.L.L" }),
    vat: "210084920100003",
    cat: profile.categoryId,
    branch: tr({ ar: "مجمع السيف - المنامة، مملكة البحرين", en: "Seef Mall - Manama, Kingdom of Bahrain" }),
    ig: "@flame_burger",
    phone: "+973 39123456",
  });
  useEffect(() => {
    setF((current) => ({ ...current, cat: profile.categoryId }));
    setLogoPreview(profile.logoUrl);
  }, [profile.categoryId, profile.logoUrl]);

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));
  const uploadLogo = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(tr({ ar: "يرجى اختيار ملف صورة", en: "Please choose an image file" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoPreview(reader.result);
      } else {
        toast.error(tr({ ar: "تعذر تحميل الشعار", en: "Could not load the logo" }));
      }
    };
    reader.onerror = () => {
      console.error("Failed to read the selected company logo", reader.error);
      toast.error(tr({ ar: "تعذر تحميل الشعار", en: "Could not load the logo" }));
    };
    reader.readAsDataURL(file);
  };
  const save = () => {
    updateProfile({ categoryId: f.cat, logoUrl: logoPreview });
    toast.success(tr({ ar: "تم تحديث بيانات المنشأة بنجاح", en: "Company details updated successfully" }));
    onClose();
  };
  return (
    <ModalFrame
      title={tr({ ar: "الملف التعريفي للمنشأة", en: "Company Profile" })}
      icon={logoPreview ? (
        <img src={logoPreview} alt="" className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">FB</span>
      )}
      onClose={onClose}
      footer={<><button onClick={onClose} className={btnGhost}>{tr({ ar: "إلغاء", en: "Cancel" })}</button><button onClick={save} className={btnPrimary}>{tr({ ar: "حفظ التعديلات", en: "Save Changes" })}</button></>}
    >
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          {logoPreview ? (
            <img src={logoPreview} alt={tr({ ar: "شعار المنشأة", en: "Company logo" })} className="h-20 w-20 rounded-full border object-cover" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-xl font-bold text-primary-foreground">FB</span>
          )}
          <label className={`${btnGhost} inline-flex cursor-pointer items-center gap-2`}>
            <Camera className="h-4 w-4" />
            {tr({ ar: "تغيير الشعار", en: "Upload Logo" })}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                uploadLogo(event.currentTarget.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      </div>
      <Field label={tr({ ar: "اسم المنشأة التجاري", en: "Business Name" })}><input value={f.name} onChange={set("name")} className={input} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={tr({ ar: "رقم السجل التجاري", en: "Commercial Registration (CR)" })}>
          <div className="flex items-center justify-between rounded-lg border bg-surface px-3.5 py-2.5 text-sm">
            <span className="num font-semibold">104829-1</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success"><BadgeCheck className="h-3.5 w-3.5" />{tr({ ar: "موثّق", en: "Verified" })}</span>
          </div>
        </Field>
        <Field label={tr({ ar: "رقم ضريبة القيمة المضافة", en: "VAT / TIN" })}><input value={f.vat} onChange={set("vat")} dir="ltr" className={`${input} num text-start`} /></Field>
      </div>
      <Field label={tr({ ar: "النشاط والفئة", en: "Activity & Category" })}>
        <select value={f.cat} onChange={set("cat")} className={input}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{tr(category.label)}</option>
          ))}
        </select>
      </Field>
      <Field label={tr({ ar: "الفرع الرئيسي", en: "Main Branch" })}><input value={f.branch} onChange={set("branch")} className={input} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={tr({ ar: "حساب إنستغرام الرسمي", en: "Official Instagram" })}><input value={f.ig} onChange={set("ig")} dir="ltr" className={`${input} text-start`} /></Field>
        <Field label={tr({ ar: "رقم هاتف التواصل", en: "Contact Phone" })}><input value={f.phone} onChange={set("phone")} dir="ltr" className={`${input} num text-start`} /></Field>
      </div>
    </ModalFrame>
  );
}

export function AccountSettingsModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  const [email, setEmail] = useState("admin@flameburger.bh");
  const [n1, setN1] = useState(true);
  const [n2, setN2] = useState(true);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const save = () => {
    if (cur || next || confirm) {
      if (!cur || !next || !confirm || next.length < 8) {
        toast.error(tr({ ar: "أدخل كلمة المرور الحالية والجديدة وتأكيدها، على أن تكون الجديدة 8 أحرف على الأقل", en: "Enter your current, new, and confirmation passwords; the new password must be 8+ characters" }));
        return;
      }
      if (next !== confirm) {
        toast.error(tr({ ar: "تأكيد كلمة المرور الجديدة غير متطابق", en: "New password confirmation does not match" }));
        return;
      }
    }
    toast.success(tr({ ar: "تم حفظ الإعدادات بنجاح", en: "Settings saved successfully" }));
    onClose();
  };
  const Check2 = ({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) => (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-surface p-3 text-sm transition hover:border-primary/40">
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{on && <Check className="h-3 w-3" />}</span>
      <input type="checkbox" className="sr-only" checked={on} onChange={() => set(!on)} />
      {label}
    </label>
  );
  return (
    <ModalFrame
      title={tr({ ar: "إعدادات الحساب والأمان", en: "Account & Security Settings" })}
      icon={<span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground"><KeyRound className="h-5 w-5" /></span>}
      onClose={onClose}
      footer={<><button onClick={onClose} className={btnGhost}>{tr({ ar: "إلغاء", en: "Cancel" })}</button><button onClick={save} className={btnPrimary}>{tr({ ar: "حفظ الإعدادات", en: "Save Settings" })}</button></>}
    >
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold"><Mail className="h-4 w-4 text-primary" />{tr({ ar: "البريد الإلكتروني للمسؤول", en: "Admin Email" })}</h3>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" className={`${input} text-start`} />
      </section>
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold"><Bell className="h-4 w-4 text-primary" />{tr({ ar: "إشعارات النظام والبريد الإلكتروني", en: "System & Email Notifications" })}</h3>
        <div className="space-y-2">
          <Check2 on={n1} set={setN1} label={tr({ ar: "تنبيه فوري عبر البريد عند تقديم صانع المحتوى لإثبات النشر.", en: "Instant email alert when a creator submits proof of posting." })} />
          <Check2 on={n2} set={setN2} label={tr({ ar: "تنبيه تحذيري عبر البريد قبل انتهاء مهلة الـ 24 ساعة بـ 4 ساعات.", en: "Email warning 4 hours before the 24-hour window ends." })} />
        </div>
      </section>
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold"><KeyRound className="h-4 w-4 text-primary" />{tr({ ar: "الأمان - تغيير كلمة المرور", en: "Security - Change Password" })}</h3>
        <div className="space-y-3">
          <Field label={tr({ ar: "كلمة المرور الحالية", en: "Current password" })}><input type="password" value={cur} onChange={(e) => setCur(e.target.value)} className={input} /></Field>
          <Field label={tr({ ar: "كلمة المرور الجديدة", en: "New password" })}><input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={input} /></Field>
          <Field label={tr({ ar: "تأكيد كلمة المرور الجديدة", en: "Confirm new password" })}><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} /></Field>
        </div>
      </section>
    </ModalFrame>
  );
}
