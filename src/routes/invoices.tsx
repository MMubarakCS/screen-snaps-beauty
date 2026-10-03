import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Eye, FileSpreadsheet, Search, Wallet, Percent, Receipt, Check, X, Printer, BadgeCheck, Stamp } from "lucide-react";
import { useLang } from "@/components/vloop/Shell";
import { creators, fmtBHD, type L } from "@/lib/vloop-data";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Tax Invoices & Billing — Vloop | ڤلوب" },
      { name: "description", content: "NBR-compliant tax invoices and escrow transaction history for your Vloop campaigns in Bahrain." },
      { property: "og:title", content: "Tax Invoices & Billing — Vloop" },
      { property: "og:description", content: "Official tax invoices compliant with Bahrain NBR standards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invoices,
});

type Inv = { id: string; campaign: L; creator: (typeof creators)[number]; date: L; iso: string; net: number };

const invoices: Inv[] = [
  { id: "VLP-2026-0841", campaign: { ar: "عرض الغداء", en: "Lunch Deal" }, creator: creators[1]!, date: { ar: "28 سبتمبر 2026", en: "28 Sep 2026" }, iso: "2026-09-28", net: 150 },
  { id: "VLP-2026-0812", campaign: { ar: "إطلاق برجر الترافل", en: "Truffle Burger Launch" }, creator: creators[0]!, date: { ar: "12 سبتمبر 2026", en: "12 Sep 2026" }, iso: "2026-09-12", net: 140 },
  { id: "VLP-2026-0779", campaign: { ar: "برنش نهاية الأسبوع", en: "Weekend Brunch" }, creator: creators[2]!, date: { ar: "30 أغسطس 2026", en: "30 Aug 2026" }, iso: "2026-08-30", net: 150 },
  { id: "VLP-2026-0703", campaign: { ar: "ليالي السوق", en: "Market Nights" }, creator: creators[3]!, date: { ar: "14 يوليو 2026", en: "14 Jul 2026" }, iso: "2026-07-14", net: 95 },
  { id: "VLP-2026-0651", campaign: { ar: "عرض الافتتاح", en: "Grand Opening" }, creator: creators[1]!, date: { ar: "2 يونيو 2026", en: "2 Jun 2026" }, iso: "2026-06-02", net: 120 },
];
const fee = (n: number) => n * 0.08;
const vat = (n: number) => fee(n) * 0.1;
const total = (n: number) => n + fee(n) + vat(n);

function Invoices() {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState("all");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<Inv | null>(null);

  const rows = useMemo(() => {
    const now = new Date("2026-10-03");
    return invoices.filter((i) => {
      const hay = `${i.id} ${i.campaign.ar} ${i.campaign.en} ${i.creator.name.ar} ${i.creator.name.en} ${i.creator.handle}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      const d = new Date(i.iso);
      const days = (now.getTime() - d.getTime()) / 864e5;
      if (period === "month" && days > 31) return false;
      if (period === "3m" && days > 92) return false;
      if (period === "2026" && d.getFullYear() !== 2026) return false;
      return true;
    });
  }, [q, period]);

  const exportCsv = () => {
    const head = "Invoice,Campaign,Creator,Date,Net BHD,Fee BHD,VAT BHD,Total BHD,Status";
    const body = rows.map((i) => [i.id, i.campaign.en, i.creator.handle, i.iso, i.net.toFixed(3), fee(i.net).toFixed(3), vat(i.net).toFixed(3), total(i.net).toFixed(3), "Paid"].join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([`${head}\n${body}`], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "vloop-statement.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const stats = [
    { icon: Wallet, label: { ar: "إجمالي الإنفاق الإعلاني", en: "Total Ad Spend" }, value: fmtBHD(1850, lang), sub: { ar: "14 حملة منفذة", en: "14 campaigns executed" }, tone: "text-primary bg-accent" },
    { icon: Percent, label: { ar: "رسوم الخدمة المدفوعة", en: "Total Platform Fees" }, value: fmtBHD(148, lang), sub: { ar: "رسوم ضمان ڤلوب 8%", en: "Vloop 8% escrow fees" }, tone: "text-sky bg-accent" },
    { icon: Receipt, label: { ar: "ضريبة القيمة المضافة المستردة", en: "Recoverable 10% VAT" }, value: fmtBHD(14.8, lang), sub: { ar: "قابلة للخصم لدى الجهاز الوطني للإيرادات", en: "NBR tax deductible" }, tone: "text-success bg-success-soft" },
  ];

  const sel = "rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary";
  const Paid = () => <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success"><Check className="h-3 w-3" />{tr({ ar: "مدفوعة", en: "Paid" })}</span>;
  const Actions = ({ i }: { i: Inv }) => (
    <div className="flex gap-1.5">
      <button onClick={() => setView(i)} aria-label="View" title={tr({ ar: "معاينة الفاتورة", en: "View" })} className="rounded-lg border p-2 text-muted-foreground hover:border-primary hover:text-primary"><Eye className="h-4 w-4" /></button>
      <button onClick={() => { setView(i); setTimeout(() => window.print(), 300); }} aria-label="Download" title={tr({ ar: "تحميل PDF", en: "Download" })} className="rounded-lg border p-2 text-muted-foreground hover:border-primary hover:text-primary"><Download className="h-4 w-4" /></button>
    </div>
  );

  return (
    <main className="mx-auto w-[92%] max-w-[1680px] space-y-8 px-4 py-8 lg:px-8 2xl:space-y-12 2xl:py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl 2xl:text-5xl">{tr({ ar: "الفواتير الضريبية والمعاملات", en: "Tax Invoices & Billing" })}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tr({ ar: "فواتير رسمية متوافقة مع متطلبات الجهاز الوطني للإيرادات (NBR) في مملكة البحرين.", en: "Official tax invoices compliant with Bahrain National Bureau for Revenue (NBR) standards." })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="num rounded-full border bg-surface px-3 py-1.5 text-xs text-muted-foreground">{tr({ ar: "س.ت 104829-1 | الرقم الضريبي: 200019283100003", en: "CR 104829-1 | VAT No: 200019283100003" })}</span>
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border bg-card px-3.5 py-2 text-sm font-semibold hover:border-primary hover:text-primary"><FileSpreadsheet className="h-4 w-4" />{tr({ ar: "تصدير كشف الحساب (Excel / CSV)", en: "Export Statement (Excel / CSV)" })}</button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((c, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">{tr(c.label)}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.tone}`}><c.icon className="h-4 w-4" /></span>
            </div>
            <p className="num mt-3 text-3xl font-extrabold">{c.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{tr(c.sub)}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="grid gap-3 rounded-2xl border bg-surface p-4 md:grid-cols-[1fr_auto_auto]">
          <div className="flex items-center gap-2 rounded-lg border bg-card px-3 focus-within:border-primary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr({ ar: "ابحث برقم الفاتورة، اسم الحملة، أو صانع المحتوى...", en: "Search by invoice no., campaign, or creator..." })} className="w-full bg-transparent py-2.5 text-sm outline-none" />
          </div>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className={sel}>
            <option value="all">{tr({ ar: "جميع الفترات", en: "All Time" })}</option>
            <option value="month">{tr({ ar: "هذا الشهر", en: "This Month" })}</option>
            <option value="3m">{tr({ ar: "آخر 3 أشهر", en: "Last 3 Months" })}</option>
            <option value="2026">2026</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel}>
            <option value="all">{tr({ ar: "الكل", en: "All" })}</option>
            <option value="paid">{tr({ ar: "مدفوعة ومكتملة", en: "Paid" })}</option>
          </select>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">{tr({ ar: "لا توجد فواتير مطابقة.", en: "No matching invoices." })}</p>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-soft lg:block">
              <table className="w-full text-sm">
                <thead className="bg-surface text-xs text-muted-foreground">
                  <tr>{[{ ar: "رقم الفاتورة", en: "Invoice ID" }, { ar: "الحملة وصانع المحتوى", en: "Campaign / Creator" }, { ar: "تاريخ الإصدار", en: "Issue Date" }, { ar: "أجر الحملة", en: "Campaign Net" }, { ar: "رسوم المنصة + الضريبة", en: "Fee & VAT" }, { ar: "الإجمالي الكلي", en: "Total" }, { ar: "الحالة", en: "Status" }, { ar: "الإجراءات", en: "Actions" }].map((h) => <th key={h.en} className="px-4 py-3 text-start font-semibold">{tr(h)}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((i) => (
                    <tr key={i.id} className="transition hover:bg-surface">
                      <td dir="ltr" className="px-4 py-3 text-start font-mono font-bold">#{i.id}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2.5"><img src={i.creator.img} alt="" className="h-9 w-9 rounded-full object-cover" /><div><p className="font-semibold">{tr(i.campaign)} - {tr(i.creator.name)}</p><p dir="ltr" className="text-start text-xs text-muted-foreground">{i.creator.handle}</p></div></div></td>
                      <td className="px-4 py-3 text-muted-foreground">{tr(i.date)}</td>
                      <td className="num px-4 py-3">{fmtBHD(i.net, lang)}</td>
                      <td className="num px-4 py-3">{fmtBHD(fee(i.net), lang)}<span className="block text-xs text-muted-foreground">+{fmtBHD(vat(i.net), lang)} VAT</span></td>
                      <td className="num px-4 py-3 font-extrabold">{fmtBHD(total(i.net), lang)}</td>
                      <td className="px-4 py-3"><Paid /></td>
                      <td className="px-4 py-3"><Actions i={i} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 lg:hidden">
              {rows.map((i) => (
                <article key={i.id} className="rounded-2xl border bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between"><span dir="ltr" className="font-mono text-sm font-bold">#{i.id}</span><Paid /></div>
                  <div className="mt-3 flex items-center gap-2.5"><img src={i.creator.img} alt="" className="h-10 w-10 rounded-full object-cover" /><div><p className="text-sm font-semibold">{tr(i.campaign)} - {tr(i.creator.name)}</p><p className="text-xs text-muted-foreground">{tr(i.date)}</p></div></div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-surface p-2"><dt className="text-muted-foreground">{tr({ ar: "أجر الحملة", en: "Net" })}</dt><dd className="num font-semibold">{fmtBHD(i.net, lang)}</dd></div>
                    <div className="rounded-lg bg-surface p-2"><dt className="text-muted-foreground">{tr({ ar: "الرسوم + الضريبة", en: "Fee + VAT" })}</dt><dd className="num font-semibold">{fmtBHD(fee(i.net) + vat(i.net), lang)}</dd></div>
                  </dl>
                  <div className="mt-3 flex items-center justify-between border-t pt-3"><span className="num font-extrabold">{fmtBHD(total(i.net), lang)}</span><Actions i={i} /></div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {view && <InvoiceModal inv={view} onClose={() => setView(null)} />}
    </main>
  );
}

function InvoiceModal({ inv, onClose }: { inv: Inv; onClose: () => void }) {
  const { lang } = useLang();
  const tr = (x: L) => x[lang];
  const lines: [L, number][] = [
    [{ ar: "رسوم وساطة وحماية الضمان الإعلاني (8%)", en: "Vloop Escrow Fee (8%)" }, fee(inv.net)],
    [{ ar: "ضريبة القيمة المضافة (10% على الخدمة)", en: "10% VAT on Service" }, vat(inv.net)],
    [{ ar: "أمانات أجر صانع المحتوى", en: "Disbursement / Passthrough to Creator" }, inv.net],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-4 print:static print:bg-transparent" onClick={onClose}>
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border bg-card shadow-lift sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
            <div className="flex items-center gap-2"><img src="/logo.png" alt="Vloop" className="h-9 w-auto" /><span className="text-lg font-extrabold">Vloop | ڤلوب</span></div>
            <div className="text-end">
              <p className="font-extrabold">{tr({ ar: "فاتورة ضريبية رسمية", en: "Official Tax Invoice" })}</p>
              <p dir="ltr" className="font-mono text-sm font-bold text-primary">#{inv.id}</p>
              <p className="text-xs text-muted-foreground">{tr(inv.date)}</p>
            </div>
          </div>
          <div className="grid gap-4 py-5 sm:grid-cols-2">
            <div className="rounded-xl bg-surface p-4 text-sm">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">{tr({ ar: "مُصدر الفاتورة", en: "Provider" })}</p>
              <p className="font-bold">{tr({ ar: "شركة ڤلوب لوساطة الإعلانات ش.ش.و", en: "Vloop Advertising Brokerage SPC" })}</p>
              <p className="text-muted-foreground">{tr({ ar: "المنامة - البحرين", en: "Manama, Bahrain" })}</p>
              <p className="num text-muted-foreground">{tr({ ar: "الرقم الضريبي:", en: "VAT No:" })} 200019283100003</p>
            </div>
            <div className="rounded-xl bg-surface p-4 text-sm">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">{tr({ ar: "العميل", en: "Billed To" })}</p>
              <p className="font-bold">{tr({ ar: "شركة فليم برجر", en: "Flame Burger Co." })}</p>
              <p className="num text-muted-foreground">{tr({ ar: "س.ت: 104829-1", en: "CR: 104829-1" })}</p>
              <p className="num text-muted-foreground">{tr({ ar: "الرقم الضريبي:", en: "VAT No:" })} 210084920100003</p>
            </div>
          </div>
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground"><BadgeCheck className="h-3.5 w-3.5 text-primary" />{tr(inv.campaign)} · {tr(inv.creator.name)} <span dir="ltr">({inv.creator.handle})</span></p>
          <dl className="divide-y rounded-xl border text-sm">
            {lines.map(([k, v]) => <div key={k.en} className="flex justify-between gap-4 px-4 py-3"><dt>{tr(k)}</dt><dd className="num whitespace-nowrap font-medium">{fmtBHD(v, lang)}</dd></div>)}
            <div className="flex justify-between gap-4 bg-surface px-4 py-3.5"><dt className="font-bold">{tr({ ar: "الإجمالي المدفوع", en: "Total Paid" })}<span className="block text-xs font-normal text-muted-foreground">{tr({ ar: "عبر BenefitPay / بوابة البطاقات", en: "via BenefitPay / Card Gateway" })}</span></dt><dd className="num text-lg font-extrabold text-success">{fmtBHD(total(inv.net), lang)}</dd></div>
          </dl>
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-success/40 p-3 text-center text-sm font-bold text-success">
            <Stamp className="h-5 w-5" />{tr({ ar: "تمت التسوية بنجاح عبر حساب الضمان المالي - ڤلوب البحرين", en: "Successfully settled via Vloop Bahrain escrow account" })}
          </div>
        </div>
        <footer className="flex justify-end gap-3 border-t px-6 py-4 print:hidden">
          <button onClick={onClose} className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted"><X className="h-4 w-4" />{tr({ ar: "إغلاق", en: "Close" })}</button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"><Printer className="h-4 w-4" />{tr({ ar: "طباعة / تحميل PDF", en: "Print / Download PDF" })}</button>
        </footer>
      </div>
    </div>
  );
}
