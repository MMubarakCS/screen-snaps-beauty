import { useState, type FormEvent } from "react";
import { Mail, QrCode, Send, ShieldCheck, Timer } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Lang } from "@/lib/vloop-data";

const helpQuestions = [
  {
    icon: ShieldCheck,
    question: {
      ar: "كيف يضمن نظام الضمان المالي حقوقي؟",
      en: "How does escrow protect my payment?",
    },
    answer: {
      ar: "تظل أموالك محجوزة بأمان حتى اعتماد التغطية أو انتهاء مهلة المراجعة المحددة.",
      en: "Your funds remain securely held until the coverage is approved or the review window expires.",
    },
  },
  {
    icon: Timer,
    question: {
      ar: "ما هي مهلة المراجعة البالغة 24 ساعة؟",
      en: "What is the 24-hour review window?",
    },
    answer: {
      ar: "بعد تقديم إثبات النشر، لديك 24 ساعة لمراجعة التغطية وتقديم اعتراض مستند إلى شروط الحملة.",
      en: "After proof of posting is submitted, you have 24 hours to review the coverage and raise a dispute based on the campaign terms.",
    },
  },
  {
    icon: QrCode,
    question: {
      ar: "كيف يتم تتبع زوار المطعم عبر QR؟",
      en: "How does QR footfall tracking work?",
    },
    answer: {
      ar: "يستخدم الزبون قسيمة QR لمرة واحدة عند الزيارة، ويسجل النظام الاسترداد لقياس الزيارات.",
      en: "Customers use a single-use QR voucher during their visit, and each redemption is recorded to measure footfall.",
    },
  },
];

export function HelpModal({
  open,
  onOpenChange,
  lang,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Lang;
}) {
  const isAr = lang === "ar";
  const [email, setEmail] = useState("admin@flameburger.bh");
  const [message, setMessage] = useState("");

  const submitTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(
      isAr
        ? "تم إرسال تذكرتك بنجاح، رقم المرجع #TKT-8291"
        : "Your ticket was sent successfully. Reference #TKT-8291",
    );
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl gap-0 overflow-y-auto rounded-2xl p-0 sm:rounded-2xl">
        <div className="border-b bg-surface px-5 py-5 pe-12 sm:px-7">
          <DialogHeader className="space-y-2 text-start">
            <DialogTitle className="text-xl font-extrabold sm:text-2xl">
              {isAr ? "مركز المساعدة والدعم السريع" : "Help & Quick Support"}
            </DialogTitle>
            <DialogDescription>
              {isAr
                ? "إجابات سريعة أو تواصل مباشرة مع فريق الدعم."
                : "Find a quick answer or contact our support team directly."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-7 p-5 sm:p-7">
          <section aria-label={isAr ? "الأسئلة الأساسية" : "Essential questions"}>
            <h3 className="mb-3 text-sm font-bold text-muted-foreground">
              {isAr ? "إجابات سريعة" : "Quick answers"}
            </h3>
            <Accordion type="single" collapsible className="rounded-xl border px-4">
              {helpQuestions.map(({ icon: Icon, question, answer }, index) => (
                <AccordionItem key={question.en} value={`question-${index}`}>
                  <AccordionTrigger className="gap-3 py-4 text-start hover:no-underline">
                    <span className="flex items-center gap-2.5">
                      <Icon className="size-4 shrink-0 text-primary" />
                      <span>{question[lang]}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="ps-7 leading-relaxed text-muted-foreground">
                    {answer[lang]}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h3 className="mb-3 text-base font-extrabold">
              {isAr ? "فتح تذكرة دعم فني سريعة" : "Open a quick support ticket"}
            </h3>
            <form onSubmit={submitTicket} className="mt-3 space-y-4">
              <label className="block text-xs font-semibold text-muted-foreground">
                <span className="mb-1.5 block">
                  {isAr ? "البريد الإلكتروني للمسؤول" : "Admin email"}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  dir="ltr"
                  className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-start text-sm font-normal text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                <span className="mb-1.5 block">
                  {isAr ? "تفاصيل المشكلة أو الاستفسار..." : "Issue or question details..."}
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  rows={4}
                  placeholder={
                    isAr ? "تفاصيل المشكلة أو الاستفسار..." : "Describe your issue or question..."
                  }
                  className="min-h-[110px] w-full resize-y rounded-xl border bg-background px-3.5 py-2.5 text-start text-sm font-normal leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 sm:w-auto"
              >
                <Send className="size-4" />
                {isAr ? "إرسال التذكرة" : "Send ticket"}
              </button>
            </form>
          </section>

          <div className="flex flex-col gap-2 rounded-xl border bg-surface p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <Mail className="size-4 text-primary" />
              {isAr ? "قناة الدعم الرسمية" : "Official support channel"}
            </span>
            <a
              href="mailto:support@vloop.me"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              dir="ltr"
            >
              support@vloop.me
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
