import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { Globe, Award, Sparkles, Building2, LayoutTemplate } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Qui sommes-nous — FumaOPS" },
      {
        name: "description",
        content:
          "L'histoire de FumaOPS : une agence freelance internationale avec 7 ans d'expérience.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-20">
        <div className="flex flex-col items-center text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mb-6">
            <Sparkles className="h-4 w-4 text-[var(--neon)] animate-pulse-glow" />
            <span>Notre Histoire</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            De freelances à <span className="gradient-text">FumaOPS</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Nous sommes une agence digitale née en ligne. Depuis 7 ans, nous accompagnons des
            e-commerçants à travers le monde entier pour créer des expériences uniques et rentables.
            <span dir="rtl" className="block mt-4 text-[var(--neon)] font-medium">
              حنا وكالة ديجيتال، بدات من الانترنيت. هادي 7 سنين وحنا خدامين مع ناس من العالم كامل.
            </span>
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-6 animate-scale-in delay-200">
          <div className="glass rounded-3xl p-8 text-center hover-lift group">
            <Globe className="h-10 w-10 mx-auto text-[var(--electric)] mb-4 icon-pop glow-icon" />
            <div className="text-4xl font-display font-bold">+7 Ans</div>
            <div className="mt-2 text-sm text-muted-foreground">d'expérience internationale</div>
          </div>
          <div className="glass rounded-3xl p-8 text-center hover-lift group">
            <LayoutTemplate className="h-10 w-10 mx-auto text-[var(--neon)] mb-4 icon-pop glow-icon" />
            <div className="text-4xl font-display font-bold">+1000</div>
            <div className="mt-2 text-sm text-muted-foreground">templates vendus mondialement</div>
          </div>
          <div className="glass rounded-3xl p-8 text-center hover-lift group">
            <Award className="h-10 w-10 mx-auto text-[var(--electric)] mb-4 icon-pop glow-icon" />
            <div className="text-4xl font-display font-bold">100%</div>
            <div className="mt-2 text-sm text-muted-foreground">de clients satisfaits</div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 pb-24">
        <div className="glass rounded-[2.5rem] p-8 sm:p-12 md:p-16 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[var(--gradient-hero)] opacity-20 blur-[100px] pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">L'esprit de FumaOPS</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Tout a commencé il y a 7 ans en tant que freelances passionnés par le e-commerce
                  et le web design. Notre terrain de jeu a toujours été internet sans frontières.
                  Nous avons collaboré avec des entrepreneurs aux quatre coins du monde.
                </p>
                <p>
                  Forts de cette expérience internationale, nous avons vendu plus de{" "}
                  <strong className="text-foreground">1000 templates</strong> prêts à l'emploi pour
                  des boutiques en ligne. Mais nous nous sommes rendu compte d'une chose : beaucoup
                  d'e-commerçants ont besoin d'une solution clé en main, sans abonnement restrictif,
                  et pensée pour leur réalité (comme le Cash on Delivery au Maroc).
                </p>
                <p>
                  C'est pour cela que <span className="text-foreground font-semibold">FumaOPS</span>{" "}
                  est née. Aujourd'hui, nous mettons notre expertise experte et mondiale au service
                  des e-commerçants, avec des boutiques rapides, modernes, et surtout, optimisées
                  pour la conversion.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mt-8 neon-border">
                <p className="text-[var(--neon)] font-medium leading-relaxed" dir="rtl">
                  الهدف ديالنا هو نوفروليك موقع احترافي، بحال اللي كنقادو للناس فمريكان وأوروبا،
                  ولكن مصمم خصيصا للسوق المغربي والـ COD. ماكاين لا اقتطاعات شهرية لا والو، الموقع
                  كيبقى ديالك ديما.
                </p>
              </div>
            </div>

            <div className="relative h-full min-h-[350px] rounded-3xl overflow-hidden neon-border group">
              <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/20 duration-500" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="Notre équipe freelance au travail"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center text-white">
                <Building2 className="h-16 w-16 mb-4 drop-shadow-md icon-pop glow-icon opacity-80 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-bold mb-2">Une équipe du monde entier</h3>
                <p className="text-white/80 max-w-sm">
                  Des développeurs et designers freelances dédiés à la réussite de votre boutique en
                  ligne.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
