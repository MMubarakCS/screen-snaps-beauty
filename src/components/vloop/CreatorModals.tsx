import { X, ImagePlus, CheckCircle2, UserCog, Upload, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLang } from "./Shell";

export function CreatorProfileModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  
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
          <div className="group relative h-32 w-full overflow-hidden rounded-xl border-2 border-dashed bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition">
            <div className="flex flex-col items-center text-muted-foreground group-hover:text-foreground transition">
              <ImagePlus className="h-8 w-8 mb-2" />
              <span className="text-sm font-semibold">{isAr ? "تغيير صورة الغلاف" : "Change Cover Image"}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="-mt-12 sm:-mt-16 sm:ms-4 shrink-0 flex flex-col items-center">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-card bg-muted overflow-hidden flex items-center justify-center cursor-pointer group hover:bg-muted/80 transition">
                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition absolute z-10" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition z-0" />
              </div>
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

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">
                {isAr ? "إنستغرام" : "Instagram"}
              </label>
              <input defaultValue="@yousif.bites" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-foreground">
                {isAr ? "تيك توك" : "TikTok"}
              </label>
              <input defaultValue="@yousif.vlogs" className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary" dir="ltr" />
            </div>
          </div>

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
    </div>
  );
}

export function CreatorSettingsModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  
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
              <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                <option>بنك البحرين الوطني NBB</option>
                <option>بنك البحرين والكويت BBK</option>
                <option>بنك الإثمار Ithmaar</option>
                <option>بيت التمويل الكويتي KFH</option>
                <option>إلى بنك Ila Bank</option>
              </select>
            </div>
            
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
