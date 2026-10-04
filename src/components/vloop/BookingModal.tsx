import { useEffect, useState } from "react";
import {
  X,
  Check,
  Plus,
  Sparkles,
  ShieldCheck,
  Trash2,
  Loader2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { type Creator, type Lang, type L, presetTerms, fmtBHD, t } from "@/lib/vloop-data";

const PLATFORMS: { id: string; label: L }[] = [
  { id: "ig", label: { ar: "إنستغرام Instagram", en: "Instagram" } },
  { id: "tt", label: { ar: "تيك توك TikTok", en: "TikTok" } },
  { id: "snap", label: { ar: "سناب شات Snapchat", en: "Snapchat" } },
];

const FORMATS: { id: string; label: L }[] = [
  { id: "story", label: { ar: "3 لقطات ستوري", en: "3× Story Snips" } },
  { id: "reel", label: { ar: "فيديو ريلز/تيك توك", en: "Reels / TikTok Video" } },
  { id: "field", label: { ar: "تغطية ميدانية", en: "Field Coverage" } },
];

type Term = { id: string; text: L; on: boolean; preset: boolean };

/* ──────────────────────────────────────────────────────────────────── *
 *  Escrow Breakdown — reused by both modes
 * ──────────────────────────────────────────────────────────────────── */
function EscrowBreakdown({ fee, lang, tr }: { fee: number; lang: Lang; tr: (x: L) => string }) {
  const platform = fee * 0.08;
  const vat = platform * 0.1;
  const total = fee + platform + vat;

  return (
    <section>
      <h3 className="mb-2 text-sm font-bold">{tr(t.modal.summary)}</h3>
      <dl className="divide-y rounded-xl border bg-surface text-sm">
        {([
          [t.modal.fee, fee],
          [t.modal.platform, platform],
          [t.modal.vat, vat],
        ] as [L, number][]).map(([k, v]) => (
          <div key={tr(k)} className="flex justify-between px-4 py-2.5">
            <dt className="text-muted-foreground">{tr(k)}</dt>
            <dd className="num font-medium">{fmtBHD(v, lang)}</dd>
          </div>
        ))}
        <div className="flex justify-between px-4 py-3">
          <dt className="font-bold">{tr(t.modal.total)}</dt>
          <dd className="num text-base font-extrabold text-success">
            {fmtBHD(total, lang)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 flex items-start gap-2 rounded-lg bg-success-soft p-3 text-xs leading-relaxed text-foreground">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
        {tr(t.modal.guarantee)}
      </p>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  Mode 2 — Manual Builder ("خيارات سريعة")
 * ──────────────────────────────────────────────────────────────────── */
function ManualMode({
  fee,
  lang,
  tr,
  onSend,
}: {
  fee: number;
  lang: Lang;
  tr: (x: L) => string;
  onSend: () => void;
}) {
  const [plats, setPlats] = useState<string[]>(["ig"]);
  const [fmt, setFmt] = useState<string[]>(["story"]);
  const [terms, setTerms] = useState<Term[]>(
    presetTerms.map((p) => ({ id: p.id, text: p.label, on: p.on, preset: true })),
  );
  const [note, setNote] = useState("");

  const toggleTerm = (id: string) =>
    setTerms((s) => s.map((x) => (x.id === id ? { ...x, on: !x.on } : x)));
  const editTerm = (id: string, v: string) =>
    setTerms((s) => s.map((x) => (x.id === id ? { ...x, text: { ar: v, en: v } } : x)));
  const removeTerm = (id: string) =>
    setTerms(
      (s) =>
        s
          .map((x) => (x.id === id ? (x.preset ? { ...x, on: false } : null) : x))
          .filter(Boolean) as Term[],
    );
  const addClause = () => {
    const id =
      globalThis.crypto?.randomUUID?.() ??
      `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const clause: Term = {
      id,
      text: { ar: "", en: "" },
      on: true,
      preset: false,
    };
    setTerms((current) => (Array.isArray(current) ? [...current, clause] : [clause]));
  };

  return (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        {/* Platform chips */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            المنصة / Platform
          </p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const on = plats.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() =>
                    setPlats((s) => (on ? s.filter((x) => x !== p.id) : [...s, p.id]))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${on ? "border-primary bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:border-primary/40"}`}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                  {tr(p.label)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format chips */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {tr(t.modal.formats)}
          </p>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => {
              const on = fmt.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() =>
                    setFmt((s) => (on ? s.filter((x) => x !== f.id) : [...s, f.id]))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${on ? "border-primary bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:border-primary/40"}`}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                  {tr(f.label)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset checkboxes */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {tr(t.modal.deliverables)}
          </p>
          <div className="space-y-2">
            {terms
              .filter((x) => x.preset)
              .map((x) => (
                <label
                  key={x.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border bg-surface p-3 text-sm transition hover:border-primary/40"
                >
                  <span
                    className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${x.on ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}
                  >
                    {x.on && <Check className="h-3 w-3" />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={x.on}
                    onChange={() => toggleTerm(x.id)}
                  />
                  <span className="whitespace-normal break-words leading-relaxed w-full">
                    {tr(x.text)}
                  </span>
                </label>
              ))}
          </div>

          {/* Custom clauses */}
          {terms.filter((x) => !x.preset).length > 0 && (
            <div className="mt-2 space-y-2">
              {terms
                .filter((x) => !x.preset)
                .map((x) => (
                  <div
                    key={x.id}
                    className="group flex items-start gap-3 rounded-lg border bg-surface p-3 text-sm transition hover:border-primary/40"
                  >
                    <button
                      onClick={() => toggleTerm(x.id)}
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${x.on ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}
                    >
                      {x.on && <Check className="h-3 w-3" />}
                    </button>
                    <textarea
                      value={tr(x.text)}
                      onChange={(e) => editTerm(x.id, e.target.value)}
                      placeholder={tr(t.modal.clausePh)}
                      autoFocus={!x.preset && !tr(x.text)}
                      rows={2}
                      className="flex-1 resize-none bg-transparent px-1 py-0 outline-none placeholder:text-muted-foreground/60 whitespace-normal break-words leading-relaxed w-full"
                    />
                    <button
                      onClick={() => removeTerm(x.id)}
                      aria-label="Remove"
                      className="mt-0.5 rounded p-1 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
          <button
            type="button"
            onClick={addClause}
            className="mt-3 inline-flex items-center gap-1 rounded-lg border border-dashed px-3 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
            {tr(t.modal.add).replace("+ ", "")}
          </button>
        </div>

        {/* Optional note */}
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={tr(t.modal.note)}
          className="w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
        />

        {/* Escrow breakdown */}
        <EscrowBreakdown fee={fee} lang={lang} tr={tr} />
      </div>

      {/* Submit */}
      <footer className="border-t bg-card px-6 py-4">
        <button
          onClick={onSend}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
        >
          <ShieldCheck className="h-4 w-4" />
          {tr(t.modal.submit)}
        </button>
      </footer>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  Mode 1 — AI-Driven ("صياغة بالذكاء الاصطناعي ✨")
 * ──────────────────────────────────────────────────────────────────── */
function AiMode({
  fee,
  lang,
  tr,
  onSend,
}: {
  fee: number;
  lang: Lang;
  tr: (x: L) => string;
  onSend: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  // AI-generated outputs — fully independent
  const [aiPlats, setAiPlats] = useState<string[]>([]);
  const [aiFmts, setAiFmts] = useState<string[]>([]);
  const [aiTerms, setAiTerms] = useState<Term[]>([]);

  const editTerm = (id: string, v: string) =>
    setAiTerms((s) => s.map((x) => (x.id === id ? { ...x, text: { ar: v, en: v } } : x)));
  const removeTerm = (id: string) =>
    setAiTerms((s) => s.filter((x) => x.id !== id));
  const addClause = () =>
    setAiTerms((s) => [
      ...s,
      { id: crypto.randomUUID(), text: { ar: "", en: "" }, on: true, preset: false },
    ]);

  const generate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = prompt.toLowerCase();

      /* ── Auto-detect platforms ── */
      const detectedPlats: string[] = [];
      if (/إنستغرام|instagram|انستقرام|ستوري|story|stories|ريلز|reel/i.test(prompt))
        detectedPlats.push("ig");
      if (/تيك[\s]?توك|tiktok/i.test(prompt)) detectedPlats.push("tt");
      if (/سناب|snapchat|سناب[\s]?شات/i.test(prompt)) detectedPlats.push("snap");
      if (detectedPlats.length === 0) detectedPlats.push("ig"); // default

      /* ── Auto-detect formats ── */
      const detectedFmts: string[] = [];
      if (/ستوري|story|stories/i.test(prompt)) detectedFmts.push("story");
      if (/ريلز|reel|reels|فيديو|video|تيك[\s]?توك|tiktok/i.test(prompt)) detectedFmts.push("reel");
      if (/ميدان|field|تغطية/i.test(prompt)) detectedFmts.push("field");
      if (detectedFmts.length === 0) detectedFmts.push("story"); // default

      setAiPlats(detectedPlats);
      setAiFmts(detectedFmts);

      /* ── Generate structured deliverables ── */
      const price = prompt.match(/(\d+(?:\.\d+)?)/)?.[1];
      const weekdays = /اسبوع|أسبوع|weekday/i.test(prompt);

      const gen: Term[] = [
        {
          id: crypto.randomUUID(),
          on: true,
          preset: false,
          text: {
            ar: `الترويج للعرض: «${prompt.trim()}» بشكل واضح في جميع المحتوى.`,
            en: `Clearly promote the offer: "${prompt.trim()}" across all content.`,
          },
        },
      ];

      if (price)
        gen.push({
          id: crypto.randomUUID(),
          on: true,
          preset: false,
          text: {
            ar: `ذكر السعر (${price} د.ب) نصياً وصوتياً في الستوري.`,
            en: `State the price (${price} BHD) both on-screen and verbally.`,
          },
        });

      if (weekdays)
        gen.push({
          id: crypto.randomUUID(),
          on: true,
          preset: false,
          text: {
            ar: "النشر خلال أيام الأسبوع (الأحد – الخميس) بين 12–2 ظهراً.",
            en: "Publish on weekdays (Sun–Thu) between 12–2 PM.",
          },
        });

      // Always add an account-mention term
      gen.push({
        id: crypto.randomUUID(),
        on: true,
        preset: false,
        text: {
          ar: "الإشارة للحساب الرسمي (@mention) وإرفاق ملصق رابط القسيمة.",
          en: "Mention the official account (@mention) and attach the voucher link sticker.",
        },
      });

      setAiTerms(gen);
      setAiGenerated(true);
      setLoading(false);
    }, 1200);
  };

  const active = aiTerms.filter((x) => x.on);

  return (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        {/* Prompt box */}
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder={tr(t.modal.prompt)}
            className="w-full resize-none rounded-lg border bg-card px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {tr(loading ? t.modal.generating : t.modal.gen)}
          </button>
        </div>

        {/* AI-generated output */}
        {aiGenerated && (
          <section className="space-y-5 rounded-xl border p-4 animate-in fade-in slide-in-from-top-2">
            {/* Detected platforms */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {lang === "ar" ? "المنصات المكتشفة" : "Detected Platforms"}
              </p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.filter((p) => aiPlats.includes(p.id)).map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {tr(p.label)}
                  </span>
                ))}
              </div>
            </div>

            {/* Detected formats */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {tr(t.modal.formats)}
              </p>
              <div className="flex flex-wrap gap-2">
                {FORMATS.filter((f) => aiFmts.includes(f.id)).map((f) => (
                  <span
                    key={f.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {tr(f.label)}
                  </span>
                ))}
              </div>
            </div>

            {/* Generated terms / contract */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="h-4 w-4 text-success" />
                {tr(t.modal.contract)}
              </h3>
              {active.length === 0 && (
                <p className="mb-3 text-sm text-muted-foreground">{tr(t.modal.noTerms)}</p>
              )}
              <ul className="space-y-2">
                {active.map((x, i) => (
                  <li key={x.id} className="group flex items-center gap-2">
                    <span className="num flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-xs font-bold text-success">
                      {i + 1}
                    </span>
                    <textarea
                      value={tr(x.text)}
                      onChange={(e) => editTerm(x.id, e.target.value)}
                      placeholder={tr(t.modal.clausePh)}
                      autoFocus={!tr(x.text)}
                      rows={2}
                      className="flex-1 resize-none rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm outline-none transition hover:border-border focus:border-primary focus:bg-card whitespace-normal break-words leading-relaxed w-full"
                    />
                    <button
                      onClick={() => removeTerm(x.id)}
                      aria-label="Remove"
                      className="rounded p-1.5 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={addClause}
                className="mt-3 inline-flex items-center gap-1 rounded-lg border border-dashed px-3 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-accent"
              >
                <Plus className="h-4 w-4" />
                {tr(t.modal.add).replace("+ ", "")}
              </button>
            </div>
          </section>
        )}

        {/* Escrow breakdown */}
        <EscrowBreakdown fee={fee} lang={lang} tr={tr} />
      </div>

      {/* Submit */}
      <footer className="border-t bg-card px-6 py-4">
        <button
          onClick={onSend}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
        >
          <ShieldCheck className="h-4 w-4" />
          {tr(t.modal.submit)}
        </button>
      </footer>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────── *
 *  BookingModal — Shell (header + tab switcher + success)
 * ──────────────────────────────────────────────────────────────────── */
export function BookingModal({
  creator,
  lang,
  fee,
  onClose,
  selectedDate,
}: {
  creator: Creator;
  lang: Lang;
  fee: number;
  onClose: () => void;
  selectedDate?: string;
}) {
  const tr = (x: L) => x[lang];
  const [tab, setTab] = useState<"presets" | "ai">("presets");
  const [sent, setSent] = useState(false);
  const [campaignDate, setCampaignDate] = useState(selectedDate || "");
  const [isEditingDate, setIsEditingDate] = useState(!selectedDate);

  const platform = fee * 0.08;
  const vat = platform * 0.1;
  const total = fee + platform + vat;

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border bg-card shadow-lift animate-in slide-in-from-bottom-4 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex shrink-0 items-center gap-3 border-b px-6 py-4">
          <img src={creator.img} alt="" className="h-10 w-10 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold">
              {tr(t.modal.title)}{" "}
              <span dir="ltr" className="text-primary">
                {creator.handle}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">{tr(creator.name)}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {sent ? (
          /* Success state */
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="text-xl font-bold">{tr(t.modal.successT)}</h3>
            <p className="max-w-sm text-sm text-muted-foreground">{tr(t.modal.successS)}</p>
            <p className="num text-lg font-bold text-success">{fmtBHD(total, lang)}</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {tr(t.modal.done)}
            </button>
          </div>
        ) : (
          <>
            {/* Tab switcher — only controls which child renders */}
            <div className="shrink-0 px-6 pt-5">
              <div className="inline-flex rounded-xl bg-muted p-1">
                {(["presets", "ai"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === k ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {tr(k === "presets" ? t.modal.presets : t.modal.ai)}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker Section */}
            <div className="shrink-0 px-6 pt-5">
              <div className="rounded-xl border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    📅 {lang === "ar" ? "تاريخ الحملة المعتمد:" : "Approved Campaign Date:"}
                    {!isEditingDate && (
                      <span className="text-primary font-normal">{campaignDate}</span>
                    )}
                  </h3>
                  {!isEditingDate && (
                    <button
                      onClick={() => setIsEditingDate(true)}
                      className="text-xs font-semibold text-muted-foreground hover:text-primary transition"
                    >
                      {lang === "ar" ? "تغيير / Edit" : "Edit"}
                    </button>
                  )}
                </div>
                {isEditingDate && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="date"
                      value={campaignDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCampaignDate(val);
                        if (val) setIsEditingDate(false);
                      }}
                      className="w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Render the active mode — each has its own isolated state tree */}
            {tab === "presets" ? (
              <ManualMode fee={fee} lang={lang} tr={tr} onSend={() => {
                if (!campaignDate) {
                  setIsEditingDate(true);
                  return;
                }
                setSent(true);
              }} />
            ) : (
              <AiMode fee={fee} lang={lang} tr={tr} onSend={() => {
                if (!campaignDate) {
                  setIsEditingDate(true);
                  return;
                }
                setSent(true);
              }} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
