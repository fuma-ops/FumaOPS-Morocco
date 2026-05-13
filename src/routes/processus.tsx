import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";

export const Route = createFileRoute("/processus")({
  head: () => ({
    meta: [
      { title: "Processus — FumaOPS" },
      {
        name: "description",
        content: "6 étapes simples : du contact au lancement de ton site e-commerce en 3 jours.",
      },
    ],
  }),
  component: Processus,
});

const steps = [
  {
    n: "01",
    t: "Contact",
    d: "Tu nous parles de ton activité et de tes besoins.",
    ar_t: "HDER M3ana",
    ar_d: "عاود لينا على الخدمة ديالك و شنو محتاج باش نفهمو مشروعك.",
  },
  {
    n: "02",
    t: "Devis & Prix",
    d: "On propose un tarif précis selon le besoin (à partir de 2000 DH).",
    ar_t: "التمن والوقت",
    ar_d: "كنعطيوك تمن مناسب على حساب لخدمة اللي بغيتي (كيبدا من 2000 درهم).",
  },
  {
    n: "03",
    t: "Acompte 50%",
    d: "Paiement de la moitié pour lancer la machine.",
    ar_t: "سبق النص",
    ar_d: "كتخلص النص باش نبداو نخدمو على السيت ديالك.",
  },
  {
    n: "04",
    t: "Design & Développement",
    d: "Création du site sur mesure en 3 jours top chrono.",
    ar_t: "الخدمة و الديزاين",
    ar_d: "كنصاوبو ليك سيت واعر وخفيف فـ 3 أيام طوب كرونو.",
  },
  {
    n: "05",
    t: "Solde & Livraison",
    d: "Tu valides le travail, paies les 50% restants et reçois l'accès complet.",
    ar_t: "كمل الخلاص والوفا",
    ar_d: "كتشوف الخدمة، كتخلص اللي بقى وكتاخد السيت ديالك واجد.",
  },
  {
    n: "06",
    t: "Lancement",
    d: "Go ! Accompagnement de 30 jours et début des ventes.",
    ar_t: "بدا تبيع وتوكل",
    ar_d: "كنطلقو السيت و كنبقاو معاك 30 يوم باش تبدا تبيع وتخدم مزيان.",
  },
];

function Processus() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          Notre processus
        </div>
        <p className="mt-4 text-xl sm:text-2xl font-bold gradient-text" dir="rtl">
          كيفاش كنخدمو ؟ بكل بساطة
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold">
          6 étapes <span className="gradient-text">simples</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Du premier contact au lancement, on t'accompagne à chaque étape.
        </p>
        <p className="mt-2 text-sm sm:text-base font-bold gradient-text" dir="rtl">
          من الهضرة لولة حتى كطلق السيت، حنا معاك فكل خطوة.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-6 py-8 sm:py-10">
        <div className="relative">
          <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--neon)] via-[var(--electric)] to-transparent" />
          <div className="space-y-6 sm:space-y-8">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`relative pl-16 sm:pl-20 md:pl-0 md:grid md:grid-cols-2 md:items-center md:gap-0 animate-fade-up delay-${((i % 5) + 1) * 100} ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div className={`md:px-10 ${i % 2 ? "md:text-left" : "md:text-right"}`}>
                  <div className="glass rounded-3xl p-5 sm:p-6 hover-lift hover:glow transition-all">
                    <div className="font-display text-4xl sm:text-5xl font-bold gradient-text">
                      {s.n}
                    </div>
                    <h3 className="mt-2 text-xl sm:text-2xl font-bold">{s.t}</h3>
                    <p
                      className="mt-1 text-xs text-[var(--neon)] font-bold uppercase tracking-wider"
                      dir="rtl"
                    >
                      {s.ar_t}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                    <p className="mt-1 text-sm text-muted-foreground font-medium" dir="rtl">
                      {s.ar_d}
                    </p>
                  </div>
                </div>
                <div className="absolute left-6 sm:left-8 md:left-1/2 -translate-x-1/2 top-6 sm:top-8 h-4 w-4 rounded-full gradient-primary glow animate-pulse-glow" />
                <div className="hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
