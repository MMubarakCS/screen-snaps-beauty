import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLang } from "./Shell";
import { Building2, FileText, Scale } from "lucide-react";

interface LegalModalProps {
  initialTab?: string;
  onClose: () => void;
}

export function LegalModal({ initialTab, onClose }: LegalModalProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const defaultTab =
    initialTab === "الشروط والأحكام" || initialTab === "Terms of Service"
      ? "escrow"
      : initialTab === "سياسة الخصوصية" || initialTab === "Privacy Policy"
        ? "privacy"
        : initialTab === "متوافق مع ضريبة القيمة المضافة" || initialTab === "لوائح مصرف البحرين المركزي" || initialTab === "VAT & NBR Compliant" || initialTab === "CBB Regulations"
          ? "tax"
          : "escrow";

  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" dir={isAr ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-start">{isAr ? "الشروط والسياسات" : "Legal & Trust"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4" dir={isAr ? "rtl" : "ltr"}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="escrow" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">{isAr ? "شروط الضمان" : "Escrow Terms"}</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{isAr ? "الخصوصية (PDPL)" : "Privacy"}</span>
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">{isAr ? "الامتثال الضريبي (NBR)" : "Tax (NBR)"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="escrow" className="space-y-4 text-sm leading-relaxed text-muted-foreground text-start">
            <h3 className="text-lg font-bold text-foreground">{isAr ? "شروط الضمان والاستخدام" : "Vloop Escrow Rules & Terms"}</h3>
            <p>
              {isAr
                ? "تعمل ڤلوب كوسيط مالي ضامن (Escrow) بين الشركة وصانع المحتوى. يتم حجز المبالغ بأمان حتى اكتمال الحملة."
                : "Vloop acts as an Escrow agent between the business and the creator. Funds are securely held until campaign completion."}
            </p>
            <ul className="list-disc space-y-2 ps-5">
              <li>{isAr ? "فترة المراجعة: 24 ساعة للشركات لمراجعة المحتوى بعد التسليم." : "Review Window: 24 hours for businesses to review content after delivery."}</li>
              <li>{isAr ? "التحكيم وفض النزاعات: في حال الخلاف، يحق لڤلوب مراجعة المحادثات واتخاذ قرار ملزم." : "Dispute Resolution: In case of dispute, Vloop can review chats and make a binding decision."}</li>
              <li>{isAr ? "حماية الأطراف: يمنع التواصل خارج المنصة لحماية حقوق الطرفين." : "Party Protection: Communicating outside the platform is prohibited to protect both parties."}</li>
            </ul>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 text-sm leading-relaxed text-muted-foreground text-start">
            <h3 className="text-lg font-bold text-foreground">{isAr ? "الخصوصية وحماية البيانات" : "Privacy & Data Protection"}</h3>
            <p>
              {isAr
                ? "نحن نلتزم بقانون حماية البيانات الشخصية (PDPL) في مملكة البحرين لضمان سرية وأمان بياناتك."
                : "We comply with the Personal Data Protection Law (PDPL) in the Kingdom of Bahrain to ensure the confidentiality and security of your data."}
            </p>
            <ul className="list-disc space-y-2 ps-5">
              <li>{isAr ? "لا يتم مشاركة بياناتك المالية مع أطراف ثالثة." : "Financial data is not shared with third parties."}</li>
              <li>{isAr ? "يتم تشفير كافة المعاملات والمحادثات." : "All transactions and conversations are encrypted."}</li>
              <li>{isAr ? "يحق لك طلب حذف حسابك وبياناتك في أي وقت." : "You have the right to request deletion of your account and data at any time."}</li>
            </ul>
          </TabsContent>

          <TabsContent value="tax" className="space-y-4 text-sm leading-relaxed text-muted-foreground text-start">
            <h3 className="text-lg font-bold text-foreground">{isAr ? "الامتثال الضريبي (NBR)" : "Tax Compliance (NBR)"}</h3>
            <p>
              {isAr
                ? "ڤلوب منصة مسجلة رسمياً وتخضع لضريبة القيمة المضافة بنسبة 10% على رسوم المنصة فقط."
                : "Vloop is officially registered and subject to 10% VAT on platform fees only."}
            </p>
            <div className="rounded-lg border bg-muted/50 p-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">{isAr ? "رقم السجل التجاري (CR)" : "Commercial Registration (CR)"}</div>
                  <div className="font-mono">152436-1</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground mb-1">{isAr ? "الرقم الضريبي (TIN)" : "Tax Identification Number (TIN)"}</div>
                  <div className="font-mono">200152436100002</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs">
              {isAr ? "ملاحظة: الضريبة لا تطبق على مبلغ الحملة الأساسي المحجوز للمؤثر، بل على رسوم استخدام المنصة." : "Note: VAT is not applied to the influencer's escrowed campaign amount, only on the platform usage fees."}
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
