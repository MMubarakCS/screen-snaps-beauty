import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Camera,
  ExternalLink,
  Instagram,
  LockKeyhole,
  CalendarDays,
  ShieldCheck,
  Users,
  Video,
  Eye,
  Check,
} from "lucide-react";
import { BookingModal } from "@/components/vloop/BookingModal";
import { useLang } from "@/components/vloop/Shell";
import { creators, parseVerifiedCreatorStats, type VerifiedCreatorStats } from "@/lib/vloop-data";
import { toast } from "sonner";

export const Route = createFileRoute("/$handle")({
  head: () => ({
    meta: [
      { title: "Vloop | ڤلوب — Creator Media Kit" },
      {
        name: "description",
        content: "Explore verified creator profiles and book campaigns securely through Vloop.",
      },
    ],
  }),
  component: PublicCreatorProfile,
});

const socialPlatforms = [
  { key: "instagram", label: "Instagram", baseUrl: "https://instagram.com/", Icon: Instagram },
  { key: "tiktok", label: "TikTok", baseUrl: "https://www.tiktok.com/@", Icon: Video },
  { key: "snapchat", label: "Snapchat", baseUrl: "https://www.snapchat.com/add/", Icon: Camera },
] as const;

function PublicCreatorProfile() {
  const { lang } = useLang();
  const { handle } = Route.useParams();
  const isAr = lang === "ar";
  const creator = creators.find(
    (item) => item.handle.replace(/^@/, "") === handle.replace(/^@/, ""),
  );
  const [verifiedStats, setVerifiedStats] = useState<VerifiedCreatorStats | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    try {
      const savedStats = window.localStorage.getItem("vloop.verified-creator-stats");
      if (!savedStats || !creator) return;
      const stats = parseVerifiedCreatorStats(savedStats);
      setVerifiedStats(stats[creator.id] ?? null);
    } catch (error) {
      console.error("Unable to load verified creator stats.", error);
      toast.error(isAr ? "تعذر تحميل الإحصائيات الموثقة" : "Unable to load verified creator stats");
    }
  }, [creator, isAr]);

  if (!creator) {
    return (
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">
            {isAr ? "الملف الإعلامي غير موجود" : "Creator profile not found"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isAr ? "تحقق من الرابط وحاول مرة أخرى." : "Check the link and try again."}
          </p>
        </div>
      </main>
    );
  }

  const followers = verifiedStats?.followers ?? creator.followers;
  const storyViews = verifiedStats?.storyViews ?? creator.storyViews;
  const socials = socialPlatforms.flatMap(({ key, label, baseUrl, Icon }) => {
    const username = creator.socials[key];
    return username ? [{ key, label, baseUrl, Icon, username }] : [];
  });

  return (
    <main className="flex-1 bg-surface pb-10">
      <div className="mx-auto w-[92%] max-w-5xl py-6 sm:py-10">
        <section className="overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="relative h-44 overflow-hidden bg-gradient-to-br from-indigo-500 via-sky-400 to-teal-300 sm:h-64">
            <img
              src={creator.img}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-40 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-5 flex items-end justify-between gap-4 px-5 sm:bottom-7 sm:px-8">
              <div className="flex min-w-0 items-center gap-4 text-white">
                <img
                  src={creator.img}
                  alt={creator.name[lang]}
                  className="size-20 shrink-0 rounded-2xl border-4 border-white object-cover shadow-lg sm:size-28"
                />
                <div className="min-w-0 pb-1">
                  <h1 className="flex flex-wrap items-center gap-1.5 text-xl font-extrabold sm:text-3xl">
                    {creator.name[lang]}
                    {creator.verified && (
                      <BadgeCheck
                        aria-label={isAr ? "حساب موثق" : "Verified creator"}
                        className="size-5 shrink-0 fill-sky-500 text-white sm:size-6"
                      />
                    )}
                  </h1>
                  <p className="mt-1 text-sm text-white/85" dir="ltr">
                    {creator.handle}
                  </p>
                </div>
              </div>
              {creator.verified && (
                <span className="hidden items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-2 text-xs font-bold text-white backdrop-blur sm:inline-flex">
                  <ShieldCheck className="size-4" />
                  {isAr ? "صانع محتوى موثّق" : "Verified creator"}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-8">
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {creator.bio[lang]}
            </p>

            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map(({ key, label, baseUrl, Icon, username }) => (
                  <a
                    key={key}
                    href={`${baseUrl}${username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                  >
                    <Icon className="size-4" />
                    {label}
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-center text-sm font-extrabold text-primary-foreground shadow-soft transition hover:bg-primary/90 sm:w-auto sm:min-w-80 sm:text-base"
            >
              <LockKeyhole className="size-5 shrink-0" />
              {isAr ? "احجز حملتك بضمان مالي مع هذا المؤثر" : "Book this creator with Vloop Escrow"}
            </button>
          </div>
        </section>

        <section
          aria-label={isAr ? "الإحصائيات الموثقة" : "Verified creator stats"}
          className="mt-5 grid gap-3 sm:grid-cols-3"
        >
          <StatCard Icon={Users} label={isAr ? "المتابعون" : "Followers"} value={followers} />
          <StatCard
            Icon={Eye}
            label={isAr ? "مشاهدات الستوري" : "Story views"}
            value={storyViews}
          />
          <div className="flex min-h-24 items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 sm:justify-center">
            <ShieldCheck className="size-6 shrink-0" />
            <p className="text-sm font-bold leading-6">
              {isAr ? "✓ إحصائيات معتمدة من إدارة ڤلوب" : "✓ Stats verified by Vloop"}
            </p>
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {isAr ? "تعاونات موثّقة عبر ڤلوب" : "Verified on-platform"}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">
              {isAr ? "سجل الحملات والشركاء الموثقين" : "Verified Platform Collaborations"}
            </h2>
          </div>
          {creator.verifiedCollaborations.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {creator.verifiedCollaborations.map((collaboration) => (
                <article
                  key={collaboration.brand.en}
                  className="rounded-2xl border bg-card p-5 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-2xl"
                      >
                        {collaboration.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold leading-6">{collaboration.brand[lang]}</h3>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          {collaboration.date[lang]}
                        </p>
                      </div>
                    </div>
                    <ShieldCheck
                      aria-label={isAr ? "حملة موثّقة" : "Verified campaign"}
                      className="size-5 shrink-0 text-emerald-600"
                    />
                  </div>
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-800">
                    <Check className="size-4 shrink-0" />
                    <span>
                      {isAr
                        ? `${collaboration.visitors} زائر موثق بالـ QR`
                        : `${collaboration.visitors} visitors verified by QR`}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
              {isAr
                ? "لا توجد حملات موثّقة منشورة حتى الآن."
                : "No verified campaigns have been published yet."}
            </p>
          )}
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {isAr
              ? "يمكنك استعراض كامل التغطيات الحية عبر الروابط الرسمية لحسابات صانع المحتوى أعلاه."
              : "See all live coverage through the creator’s official social links above."}
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-primary/15 bg-card p-6 shadow-soft sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {isAr ? "ابدأ حملتك بثقة" : "Start your campaign with confidence"}
            </p>
            <h2 className="mt-2 text-xl font-extrabold leading-relaxed sm:text-2xl">
              {isAr
                ? `جاهز لتنمية مبيعات متجرك مع ${creator.name.ar}؟`
                : `Ready to grow your store’s sales with ${creator.name.en}?`}
            </h2>
          </div>
        </section>
      </div>

      {bookingOpen && (
        <BookingModal
          creator={creator}
          lang={lang}
          fee={150}
          allowCustomBudget
          onClose={() => setBookingOpen(false)}
        />
      )}
    </main>
  );
}

function StatCard({ Icon, label, value }: { Icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex min-h-24 items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="num mt-0.5 text-xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}
