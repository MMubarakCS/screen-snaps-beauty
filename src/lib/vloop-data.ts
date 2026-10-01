import c1 from "@/assets/creator-1.jpg";
import c2 from "@/assets/creator-2.jpg";
import c3 from "@/assets/creator-3.jpg";
import c4 from "@/assets/creator-4.jpg";

export type Lang = "ar" | "en";
export type L = { ar: string; en: string };

export const fmtBHD = (n: number, lang: Lang) =>
  `${n.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${lang === "ar" ? "د.ب" : "BHD"}`;

export const categories: { id: string; label: L }[] = [
  { id: "food", label: { ar: "الأطعمة والمطاعم", en: "Food & Restaurants" } },
  { id: "lifestyle", label: { ar: "أسلوب الحياة", en: "Lifestyle" } },
  { id: "beauty", label: { ar: "الجمال والعناية", en: "Beauty & Care" } },
  { id: "all", label: { ar: "جميع الفئات", en: "All Categories" } },
];

export type Creator = {
  id: string;
  img: string;
  name: L;
  handle: string;
  tags: string[];
  followers: string;
  storyViews: string;
  reliability: number;
  campaigns: number;
  minRate: number; // confidential
  categories: string[];
  engagement: string;
  audience: L;
};

export const creators: Creator[] = [
  { id: "1", img: c1, name: { ar: "فاطمة الحداد", en: "Fatima Al-Haddad" }, handle: "@fatima_foodie", tags: ["#BurgerLover", "#BahrainEats"], followers: "85K", storyViews: "14.2K", reliability: 98, campaigns: 42, minRate: 140, categories: ["food"], engagement: "6.8%", audience: { ar: "78% من البحرين · 25–34 سنة", en: "78% Bahrain · ages 25–34" } },
  { id: "2", img: c2, name: { ar: "يوسف المناعي", en: "Yousif Al-Mannai" }, handle: "@yousif.bites", tags: ["#CoffeeRuns", "#ManamaFood"], followers: "62K", storyViews: "11.8K", reliability: 96, campaigns: 31, minRate: 120, categories: ["food", "lifestyle"], engagement: "5.9%", audience: { ar: "71% من البحرين · 18–30 سنة", en: "71% Bahrain · ages 18–30" } },
  { id: "3", img: c3, name: { ar: "نور العلوي", en: "Noor Al-Alawi" }, handle: "@noor.daily", tags: ["#BahrainLife", "#Brunch"], followers: "110K", storyViews: "19.5K", reliability: 99, campaigns: 57, minRate: 150, categories: ["lifestyle", "beauty", "food"], engagement: "7.4%", audience: { ar: "64% من البحرين · 22–35 سنة", en: "64% Bahrain · ages 22–35" } },
  { id: "4", img: c4, name: { ar: "خالد البوعينين", en: "Khalid Al-Buainain" }, handle: "@khalid_eats_bh", tags: ["#StreetFood", "#BahrainEats"], followers: "48K", storyViews: "9.6K", reliability: 94, campaigns: 23, minRate: 95, categories: ["food"], engagement: "8.1%", audience: { ar: "82% من البحرين · 20–40 سنة", en: "82% Bahrain · ages 20–40" } },
];

export const formats: { id: string; label: L }[] = [
  { id: "ig", label: { ar: "3 لقطات ستوري إنستغرام", en: "3× Instagram Stories" } },
  { id: "reel", label: { ar: "فيديو ريلز / تيك توك", en: "Reels / TikTok Video" } },
  { id: "snap", label: { ar: "ستوري سناب شات", en: "Snapchat Story" } },
];

export const presetTerms: { id: string; label: L; on: boolean }[] = [
  { id: "t1", on: true, label: { ar: "الإشارة للحساب الرسمي للمطعم (@mention) وإرفاق ملصق رابط القسيمة في الستوري.", en: "Mention the restaurant's official account (@mention) and attach the voucher link sticker in the story." } },
  { id: "t2", on: true, label: { ar: "تصوير واجهة المحل والديكورات الداخلية وأجواء الجلوس.", en: "Film the storefront, interior décor and seating ambiance." } },
  { id: "t3", on: true, label: { ar: "تصوير الوجبات عن قرب وتجربتها ساخنة.", en: "Close-up shots of the dishes, tasted while hot." } },
  { id: "t4", on: false, label: { ar: "إبراز عرض وجبة الغداء / العرض الخاص خلال فترة التغطية.", en: "Highlight the lunch deal / special offer during coverage." } },
];

export const t = {
  nav: { discover: { ar: "اكتشف صنّاع المحتوى", en: "Discover Creators" }, campaigns: { ar: "حملاتي", en: "My Campaigns" }, escrow: { ar: "رصيد الضمان", en: "Escrow Balance" }, invoices: { ar: "الفواتير", en: "Invoices" }, kiosk: { ar: "إنشاء رابط كشك الكاشير", en: "Generate Cashier Kiosk Link" }, copied: { ar: "تم نسخ الرابط ✓", en: "Link copied ✓" } },
  merchant: { name: { ar: "شركة فليم برجر", en: "Flame Burger Co." }, cr: { ar: "س.ت: 104829-1", en: "CR: 104829-1" }, settings: { ar: "إعدادات الحساب", en: "Account Settings" }, team: { ar: "إدارة الفريق", en: "Team Members" }, logout: { ar: "تسجيل الخروج", en: "Sign out" } },
  greet: { title: { ar: "لوحة الاكتشاف والحملات", en: "Discovery & Campaign Dashboard" }, sub: { ar: "أهلاً بك مجدداً، إليك أداء حملاتك اليوم.", en: "Welcome back — here's how your campaigns are performing today." } },
  m1: { label: { ar: "الحملات النشطة", en: "Active Campaigns" }, sub: { ar: "إجمالي في الضمان:", en: "Total in Escrow:" } },
  m2: { label: { ar: "زيارات موثقة للمتجر", en: "Verified In-Store Footfall" }, unit: { ar: "عميل", en: "customers" }, sub: { ar: "تتبع عبر قسائم QR أحادية الاستخدام", en: "Tracked via single-use QR vouchers" } },
  m3: { label: { ar: "مراجعات محتوى معلقة", en: "Pending Content Reviews" }, unit: { ar: "حملة", en: "campaign" }, badge: { ar: "مؤقت 24 ساعة نشط", en: "Active 24h timer" } },
  m4: { label: { ar: "مضاعف العائد على الحملة", en: "Campaign ROI Multiplier" }, sub: { ar: "تقديري: لكل 1 د.ب يُنفق، المتوقع عودة ~3.8 د.ب مبيعات", en: "Estimated: For every 1 BHD spent, ~3.8 BHD sales return is expected" } },
  search: { title: { ar: "اعثر على صنّاع محتوى ضمن ميزانيتك", en: "Find Creators Within Your Budget" }, sub: { ar: "تتم مطابقة الحد الأدنى لأسعار صنّاع المحتوى بسرية", en: "Creator minimum rates are matched confidentially" }, budget: { ar: "الميزانية", en: "Budget" }, category: { ar: "الفئة", en: "Category" }, date: { ar: "تاريخ الإطلاق", en: "Launch Date" }, cta: { ar: "ابحث عن المطابقين", en: "Find Matching Creators" } },
  grid: { title: { ar: "صنّاع محتوى مطابقون", en: "Matching Creators" }, count: { ar: "نتيجة", en: "results" }, empty: { ar: "لا يوجد صنّاع محتوى ضمن هذه الميزانية والفئة. جرّب رفع الميزانية.", en: "No creators match this budget and category. Try increasing your budget." } },
  card: { followers: { ar: "متابع", en: "Followers" }, views: { ar: "متوسط مشاهدات الستوري", en: "Avg. Story Views" }, reliability: { ar: "درجة الموثوقية", en: "Reliability Score" }, completed: { ar: "حملة مكتملة", en: "completed campaigns" }, match: { ar: "يطابق ميزانيتك", en: "Matches your" }, budgetWord: { ar: "د.ب", en: "BHD Budget" }, kit: { ar: "عرض الملف الإعلامي", en: "View Media Kit" }, hideKit: { ar: "إخفاء الملف الإعلامي", en: "Hide Media Kit" }, book: { ar: "احجز عبر الضمان", en: "Book via Escrow" }, engagement: { ar: "معدل التفاعل", en: "Engagement rate" }, audience: { ar: "الجمهور", en: "Audience" } },
  modal: { title: { ar: "حجز حملة مع", en: "Book Campaign with" }, presets: { ar: "خيارات سريعة (جاهزة)", en: "Quick Presets" }, ai: { ar: "صياغة بالذكاء الاصطناعي ✨", en: "AI Smart Assistant ✨" }, formats: { ar: "صيغة المحتوى", en: "Content Format" }, deliverables: { ar: "المخرجات الأساسية", en: "Essential Deliverables" }, note: { ar: "ملاحظة سريعة أو اسم وجبة محددة تود التركيز عليها (اختياري)", en: "Quick note or specific dish name to focus on (optional)" }, prompt: { ar: "صف ما تريده بكلمات بسيطة أو بالعامية (مثال: نبي نروج لوجبة البرجر الجديدة بـ 2.5 د.ب أيام الأسبوع)...", en: "Describe your offer in simple words or dialect (e.g., promote our new burger combo for 2.5 BHD on weekdays)..." }, gen: { ar: "إنشاء الموجز بالذكاء الاصطناعي ✨", en: "Generate Brief with AI ✨" }, generating: { ar: "جارٍ تحليل طلبك...", en: "Analyzing your request..." }, contract: { ar: "بنود العقد الرقمي المعتمد", en: "Approved Digital Contract Terms" }, noTerms: { ar: "لم يتم اختيار أي بنود بعد.", en: "No terms selected yet." }, add: { ar: "+ إضافة شرط يدوي مخصص", en: "+ Add Custom Clause" }, clausePh: { ar: "اكتب الشرط هنا...", en: "Write the clause here..." }, fee: { ar: "أجر صانع المحتوى", en: "Creator Fee" }, platform: { ar: "رسوم منصة ڤلوب (8%)", en: "Vloop Platform Fee (8%)" }, vat: { ar: "ضريبة القيمة المضافة 10% على الرسوم", en: "10% VAT on Fee" }, total: { ar: "إجمالي مبلغ الضمان", en: "Total Escrow Amount" }, guarantee: { ar: "المبلغ محجوز بأمان في منصة ڤلوب ولن يُصرف للمعلن إلا بعد 24 ساعة من تقديم إثبات النشر.", en: "Funds are securely locked in Vloop Escrow and will not be released until 24 hours after proof submission." }, submit: { ar: "إيداع في الضمان وإرسال العرض", en: "Deposit into Escrow & Send Offer" }, successT: { ar: "تم إرسال العرض بنجاح", en: "Offer sent successfully" }, successS: { ar: "تم حجز المبلغ في الضمان. سيصلك إشعار عند قبول صانع المحتوى.", en: "Funds are held in escrow. You'll be notified when the creator accepts." }, done: { ar: "تم", en: "Done" }, summary: { ar: "ملخص الضمان المالي", en: "Escrow Summary" } },
  footer: { desc: { ar: "المنصة السحابية الموثوقة لحملات المؤثرين بنظام الضمان المالي في مملكة البحرين والخليج.", en: "The trusted B2B influencer escrow platform in Bahrain & the GCC." }, platform: { ar: "المنصة", en: "Platform" }, creators: { ar: "لصنّاع المحتوى", en: "For Creators" }, legal: { ar: "الشروط والخصوصية", en: "Legal & Trust" }, rights: { ar: "© 2026 Vloop Inc. جميع الحقوق محفوظة.", en: "© 2026 Vloop Inc. All rights reserved." }, made: { ar: "صُنع في البحرين 🇧🇭", en: "Made in Bahrain 🇧🇭" } },
  footerLinks: {
    platform: [{ ar: "اكتشف صناع المحتوى", en: "Discover Creators" }, { ar: "حملاتي", en: "My Campaigns" }, { ar: "نظام الضمان المالي", en: "Escrow System" }, { ar: "أسئلة شائعة", en: "FAQ" }],
    creators: [{ ar: "انضم كصانع محتوى", en: "Join as Creator" }, { ar: "رابط البايو الذكي", en: "Smart Bio-Link" }, { ar: "حاسبة الأرباح", en: "Earnings Calculator" }],
    legal: [{ ar: "الشروط والأحكام", en: "Terms & Conditions" }, { ar: "سياسة الخصوصية", en: "Privacy Policy" }, { ar: "متوافق مع ضريبة القيمة المضافة", en: "VAT Compliant" }, { ar: "لوائح مصرف البحرين المركزي", en: "CBB Guidelines" }],
  },
};
