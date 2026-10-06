import { X, ImagePlus, CheckCircle2, UserCog, Upload, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLang } from "./Shell";

export function CreatorProfileModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [statsRequestOpen, setStatsRequestOpen] = useState(false);
  const [newFollowers, setNewFollowers] = useState("");
  const [newStoryViews, setNewStoryViews] = useState("");
  const [insightsScreenshot, setInsightsScreenshot] = useState<File | null>(null);
  const [statsRequestState, setStatsRequestState] = useState<{
    lastRequestedAt: number | null;
    storageAvailable: boolean;
    ready: boolean;
  }>({ lastRequestedAt: null, storageAvailable: true, ready: false });

  useEffect(() => {
    if (!coverPreview) return;
    return () => URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  useEffect(() => {
    if (!avatarPreview) return;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  useEffect(() => {
    try {
      const savedTimestamp = window.localStorage.getItem("creator-stats-update-requested-at");
      const timestamp = savedTimestamp === null ? null : Number(savedTimestamp);
      setStatsRequestState({
        lastRequestedAt: timestamp !== null && Number.isFinite(timestamp) ? timestamp : null,
        storageAvailable: true,
        ready: true,
      });
    } catch (error) {
      console.error("Unable to read the stats update request limit.", error);
      toast.error(isAr ? "تعذر التحقق من موعد طلب تحديث الإحصائيات" : "Unable to verify the stats update request limit");
      setStatsRequestState({ lastRequestedAt: null, storageAvailable: false, ready: true });
    }
  }, [isAr]);

  const cooldownMs = 30 * 24 * 60 * 60 * 1000;
  const requestCooldownActive =
    statsRequestState.lastRequestedAt !== null &&
    Date.now() - statsRequestState.lastRequestedAt < cooldownMs;
  const nextRequestDate = requestCooldownActive
    ? new Date((statsRequestState.lastRequestedAt ?? 0) + cooldownMs).toLocaleDateString(isAr ? "ar" : "en")
    : null;

  const selectProfileImage = (kind: "avatar" | "cover", file: File) => {
    const previewUrl = URL.createObjectURL(file);
    if (kind === "avatar") setAvatarPreview(previewUrl);
    else setCoverPreview(previewUrl);
    window.dispatchEvent(
      new CustomEvent("creator-profile-image-selected", { detail: { kind, file } }),
    );
  };

  const submitStatsUpdateRequest = async () => {
    const followersCount = Number(newFollowers);
    const storyViewsCount = Number(newStoryViews);
    if (
      !newFollowers.trim() ||
      !newStoryViews.trim() ||
      !Number.isFinite(followersCount) ||
      !Number.isFinite(storyViewsCount) ||
      followersCount < 0 ||
      storyViewsCount < 0 ||
      !insightsScreenshot
    ) {
      toast.error(isAr ? "يرجى إدخال الأرقام وإرفاق لقطة شاشة حديثة" : "Enter the new metrics and attach a recent screenshot");
      return;
    }
    if (!statsRequestState.storageAvailable) {
      toast.error(isAr ? "تعذر حفظ طلب التحديث. يرجى المحاولة لاحقاً" : "Unable to save the update request. Please try again later");
      return;
    }

    try {
      const screenshotDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") resolve(reader.result);
          else reject(new Error("The selected screenshot could not be read."));
        };
        reader.onerror = () => reject(reader.error ?? new Error("The selected screenshot could not be read."));
        reader.onabort = () => reject(new Error("Reading the selected screenshot was cancelled."));
        reader.readAsDataURL(insightsScreenshot);
      });
      const requestedAt = Date.now();
      const savedDecisions = window.localStorage.getItem("vloop.stats-verification-decisions");
      const parsedDecisions: unknown = savedDecisions ? JSON.parse(savedDecisions) : {};
      if (typeof parsedDecisions !== "object" || parsedDecisions === null || Array.isArray(parsedDecisions)) {
        throw new Error("Saved stats verification decisions are invalid.");
      }
      window.localStorage.setItem("creator-stats-update-requested-at", String(requestedAt));
      window.localStorage.setItem(
        "vloop.pending-stats-verification",
        JSON.stringify({
          creatorId: "2",
          requestedFollowers: followersCount,
          requestedViews: storyViewsCount,
          screenshotDataUrl,
          screenshotName: insightsScreenshot.name,
          submittedAt: requestedAt,
        }),
      );
      window.localStorage.setItem(
        "vloop.stats-verification-decisions",
        JSON.stringify({ ...parsedDecisions, "2": "pending" }),
      );
      setStatsRequestState({ lastRequestedAt: requestedAt, storageAvailable: true, ready: true });
      setStatsRequestOpen(false);
      setNewFollowers("");
      setNewStoryViews("");
      setInsightsScreenshot(null);
      toast.success(isAr ? "تم إرسال طلب تحديث الإحصائيات للتدقيق الإداري" : "Stats update request sent for admin review");
    } catch (error) {
      console.error("Unable to save the stats update request and screenshot.", error);
      toast.error(isAr ? "تعذر حفظ طلب التحديث. يرجى المحاولة لاحقاً" : "Unable to save the update request. Please try again later");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border bg-card shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            {isAr ? "الملف الشخصي والميديا كيت" : "Media Kit Profile"}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) selectProfileImage("cover", file);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted transition hover:bg-muted/80"
            style={coverPreview ? { backgroundImage: `url("${coverPreview}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}
          >
            {coverPreview && <span className="absolute inset-0 bg-black/30" />}
            <span className="relative z-10 flex flex-col items-center text-muted-foreground transition group-hover:text-foreground">
              <ImagePlus className="mb-2 h-8 w-8" />
              <span className="text-sm font-semibold">{isAr ? "تغيير صورة الغلاف" : "Change Cover Image"}</span>
            </span>
          </button>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="-mt-12 sm:-mt-16 sm:ms-4 shrink-0 flex flex-col items-center">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) selectProfileImage("avatar", file);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                aria-label={isAr ? "تغيير الصورة الشخصية" : "Change profile photo"}
                className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted transition hover:bg-muted/80 sm:h-32 sm:w-32"
              >
                {avatarPreview && <img src={avatarPreview} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                <span className="absolute inset-0 z-0 bg-black/40 opacity-0 transition group-hover:opacity-100" />
                <Upload className="absolute z-10 h-8 w-8 text-white opacity-80 transition group-hover:opacity-100" />
              </button>
            </div>
            <div className="flex-1 space-y-4 pt-2">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-foreground">
                  {isAr ? "الاسم (عربي)" : "Name (Arabic)"}
                </label>
                <input defaultValue="يوسف المناعي" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-foreground">
                  {isAr ? "الاسم (إنجليزي)" : "Name (English)"}
                </label>
                <input defaultValue="Yousif Al-Mannai" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-foreground">
              {isAr ? "نبذة عنك (Bio)" : "Bio"}
            </label>
            <textarea 
              defaultValue="محب للمأكولات الشعبية وتجارب القهوة المختصة في البحرين ☕🍔"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">
                {isAr ? "حساب إنستغرام" : "Instagram"}
              </label>
              <input placeholder="@yousif.bites" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">
                {isAr ? "حساب تيك توك" : "TikTok"}
              </label>
              <input placeholder="@yousif.vlogs" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">
                {isAr ? "حساب سناب شات" : "Snapchat"}
              </label>
              <input placeholder="@yousif_snap" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
            </div>
          </div>

          <section className="space-y-3 rounded-xl border bg-surface p-4">
            <h3 className="text-sm font-bold text-foreground">
              {isAr ? "الإحصائيات الرسمية" : "Official Metrics"}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {isAr ? "عدد المتابعين الإجمالي" : "Followers Count"}
                </p>
                <p className="mt-1 text-xl font-extrabold text-foreground" dir="ltr">62K</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {isAr ? "متوسط مشاهدات الستوري" : "Avg. Story Views"}
                </p>
                <p className="mt-1 text-xl font-extrabold text-foreground" dir="ltr">11.8K</p>
              </div>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {isAr ? "إحصائيات معتمدة وموثقة من إدارة ڤلوب" : "Metrics verified by Vloop administration"}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {isAr
                ? "الأرقام معتمدة رسمياً. يُسمح بطلب تحديث الإحصائيات مرة واحدة كل 30 يوماً عبر تقديم لقطة شاشة حديثة (Insights Screenshot) للتدقيق الإداري."
                : "These metrics are officially verified. You may request an update once every 30 days by submitting a recent Insights Screenshot for admin review."}
            </p>
            <button
              type="button"
              onClick={() => setStatsRequestOpen(true)}
              disabled={!statsRequestState.ready || !statsRequestState.storageAvailable || requestCooldownActive}
              className="rounded-lg border px-3 py-2 text-sm font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requestCooldownActive
                ? isAr ? `تم إرسال طلب مؤخراً · متاح بعد ${nextRequestDate}` : `Recently requested · Available after ${nextRequestDate}`
                : isAr ? "🔄 طلب تحديث الأرقام / Request Stats Update" : "🔄 Request Stats Update / طلب تحديث الأرقام"}
            </button>
          </section>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-foreground">
              {isAr ? "تصنيفات المحتوى (Tags)" : "Category Tags"}
            </label>
            <input defaultValue="#BurgerLover, #CoffeeRuns, #BahrainEats" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
          </div>

        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted">
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={() => {
              toast.success(isAr ? "تم حفظ التعديلات بنجاح" : "Profile updated successfully");
              onClose();
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isAr ? "حفظ التعديلات" : "Save Changes"}
          </button>
        </div>
      </div>

      {statsRequestOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          onClick={(event) => {
            event.stopPropagation();
            setStatsRequestOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stats-update-title"
            className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 id="stats-update-title" className="font-bold text-foreground">
                {isAr ? "طلب تحديث الإحصائيات" : "Request Stats Update"}
              </h3>
              <button type="button" onClick={() => setStatsRequestOpen(false)} className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label={isAr ? "إغلاق" : "Close"}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label htmlFor="new-followers" className="mb-1.5 block text-sm font-semibold">
                {isAr ? "عدد المتابعين الجديد" : "New Followers Count"}
              </label>
              <input id="new-followers" type="number" min="0" step="1" inputMode="numeric" value={newFollowers} onChange={(event) => setNewFollowers(event.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
            </div>
            <div>
              <label htmlFor="new-story-views" className="mb-1.5 block text-sm font-semibold">
                {isAr ? "متوسط مشاهدات الستوري الجديد" : "New Avg. Story Views"}
              </label>
              <input id="new-story-views" type="number" min="0" step="1" inputMode="numeric" value={newStoryViews} onChange={(event) => setNewStoryViews(event.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
            </div>
            <div>
              <label htmlFor="insights-screenshot" className="mb-1.5 block text-sm font-semibold">
                {isAr ? "لقطة شاشة حديثة من Insights" : "Recent Insights Screenshot"}
              </label>
              <input id="insights-screenshot" type="file" accept="image/*" onChange={(event) => setInsightsScreenshot(event.target.files?.[0] ?? null)} className="w-full text-sm text-muted-foreground file:me-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-xs file:font-semibold" />
            </div>
            <p className="text-xs text-muted-foreground">
              {isAr ? "سيتم إرسال الأرقام واللقطة للمراجعة، ولن تتغير الإحصائيات المعتمدة إلا بعد موافقة الإدارة." : "The metrics and screenshot will be submitted for review. Verified metrics remain unchanged until approved by administration."}
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setStatsRequestOpen(false)} className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button type="button" onClick={submitStatsUpdateRequest} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
                {isAr ? "إرسال الطلب" : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CreatorSettingsModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [selectedBank, setSelectedBank] = useState("بنك البحرين الوطني NBB");
  const [otherBankName, setOtherBankName] = useState("");
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border bg-card shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            {isAr ? "إعدادات الحساب والآيبان" : "Account & Payout Settings"}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-foreground">
              {isAr ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input disabled defaultValue="yousif@vloop.me" className="w-full rounded-lg border bg-muted px-3 py-2 text-sm outline-none text-muted-foreground" dir="ltr" />
          </div>

          <div className="rounded-xl border bg-surface p-4 space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success block"></span>
              {isAr ? "بيانات التحويل البنكي المحلي (Fawri+)" : "Local Bank Payout Details (Fawri+)"}
            </h3>
            
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                {isAr ? "البنك المحلي" : "Local Bank"}
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option>بنك البحرين الوطني NBB</option>
                <option>بنك البحرين والكويت BBK</option>
                <option>بنك الإثمار Ithmaar</option>
                <option>بيت التمويل الكويتي KFH</option>
                <option>إلى بنك Ila Bank</option>
                <option value="other">{isAr ? "بنك محلي آخر / Other Bank" : "Other Bank / بنك محلي آخر"}</option>
              </select>
            </div>

            {selectedBank === "other" && (
              <div>
                <input
                  value={otherBankName}
                  onChange={(e) => setOtherBankName(e.target.value)}
                  placeholder={isAr ? "اكتب اسم البنك / Bank Name" : "Bank Name / اكتب اسم البنك"}
                  aria-label={isAr ? "اسم البنك" : "Bank Name"}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            )}
            
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                {isAr ? "رقم الآيبان (IBAN)" : "IBAN"}
              </label>
              <input defaultValue="BH67NBOB00000012345678" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary font-mono tracking-widest uppercase" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary focus:ring-primary" />
              <span className="text-sm font-medium text-foreground">
                {isAr ? "إشعار فوري عند وصول طلب حجز جديد بضمان مدفوع" : "Push notification for new paid bookings"}
              </span>
            </label>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted">
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={() => {
              toast.success(isAr ? "تم حفظ الإعدادات بنجاح" : "Settings updated successfully");
              onClose();
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary/90"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isAr ? "حفظ الإعدادات" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
