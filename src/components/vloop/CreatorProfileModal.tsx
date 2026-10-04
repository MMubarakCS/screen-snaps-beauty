import { X, ImagePlus, User, Link as LinkIcon, Hash } from "lucide-react";
import type { Lang } from "@/lib/vloop-data";

export function CreatorProfileModal({ onClose, lang }: { onClose: () => void; lang: Lang }) {
  const isAr = lang === "ar";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose} dir={isAr ? "rtl" : "ltr"}>
      <div className="w-full max-w-lg rounded-2xl border bg-card shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header/Banner */}
        <div className="relative h-32 bg-muted">
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/20 cursor-pointer">
            <ImagePlus className="h-6 w-6 text-white" />
          </div>
          <button onClick={onClose} className="absolute top-4 end-4 rounded-full bg-black/20 p-2 text-white hover:bg-black/40">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-xl border-4 border-card bg-muted">
                <img src="/src/assets/creator-2.jpg" alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <button className="absolute bottom-1 end-1 rounded-full bg-foreground p-1.5 text-background hover:bg-foreground/90">
                <ImagePlus className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">{isAr ? "اسم العرض" : "Display Name"}</label>
              <div className="flex items-center rounded-lg border bg-background px-3 focus-within:border-primary">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <input type="text" defaultValue={isAr ? "يوسف المناعي" : "Yousif Al-Mannai"} className="w-full bg-transparent p-2 text-sm font-bold outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">{isAr ? "النبذة التعريفية (Bio)" : "Bio"}</label>
              <textarea 
                defaultValue={isAr ? "محب للمأكولات الشعبية وتجارب القهوة المختصة في البحرين ☕🍔" : "Bahrain local food & coffee enthusiast ☕🍔"} 
                className="w-full rounded-lg border bg-background p-3 text-sm outline-none focus:border-primary" 
                rows={2} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-muted-foreground">{isAr ? "حساب إنستغرام" : "Instagram"}</label>
                <div className="flex items-center rounded-lg border bg-background px-3 focus-within:border-primary">
                  <span className="text-muted-foreground text-sm" dir="ltr">@</span>
                  <input type="text" defaultValue="yousif.bites" className="w-full bg-transparent p-2 text-sm outline-none" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-muted-foreground">{isAr ? "حساب تيك توك" : "TikTok"}</label>
                <div className="flex items-center rounded-lg border bg-background px-3 focus-within:border-primary">
                  <span className="text-muted-foreground text-sm" dir="ltr">@</span>
                  <input type="text" defaultValue="yousif.vlogs" className="w-full bg-transparent p-2 text-sm outline-none" dir="ltr" />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-muted-foreground">{isAr ? "تصنيفات المحتوى" : "Category Tags"}</label>
              <div className="flex items-center rounded-lg border bg-background px-3 focus-within:border-primary">
                <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                <input type="text" defaultValue="#BurgerLover, #CoffeeRuns, #BahrainEats" className="w-full bg-transparent p-2 text-sm outline-none" dir="ltr" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted">
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button onClick={onClose} className="rounded-lg bg-foreground px-6 py-2 text-sm font-bold text-background transition hover:bg-foreground/90">
              {isAr ? "حفظ التعديلات" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
