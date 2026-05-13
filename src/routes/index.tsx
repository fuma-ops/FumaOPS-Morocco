import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import {
  Check,
  Zap,
  Wallet,
  Headphones,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Smartphone,
  BarChart3,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FumaOPS — Sites e-commerce livrés en 3 jours" },
      {
        name: "description",
        content:
          "Un site e-commerce conçu sur mesure, livré en 3 jours. Paiement unique. Pas d'abonnement. Le site reste à toi à vie.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 pt-10 sm:pt-16 pb-20 md:pt-24 md:pb-32 flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="relative z-10 animate-fade-up flex flex-col items-center lg:items-start text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
              <span className="h-2 w-2 rounded-full bg-[var(--neon)] animate-pulse-glow" />
              <span dir="rtl">موقع خاص بتجارتك</span> · Made for Morocco 🇲🇦
            </div>
            <p className="mt-5 text-2xl sm:text-3xl font-bold gradient-text" dir="rtl">
              موقعك في 3 أيام · بلا اشتراك · ملك ليك
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              Un site <span className="gradient-text">e-commerce</span> conçu sur mesure, livré en{" "}
              <span className="gradient-text">3 jours</span>
            </h1>

            {/* MOBILE IMAGE */}
            <div className="relative animate-scale-in block lg:hidden w-full max-w-md mx-auto mt-10 mb-4">
              <div className="absolute -inset-10 bg-[var(--gradient-hero)] blur-3xl opacity-60" />
              <div className="relative animate-float">
                <div className="relative rounded-3xl overflow-hidden neon-border glow">
                  <img
                    src="/hero-new.jpg"
                    alt="Dashboard e-commerce FumaOPS"
                    width={1536}
                    height={1024}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 glass rounded-2xl p-3 sm:p-4 max-w-[150px] sm:max-w-[200px] glow-electric animate-fade-up delay-300">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5 text-[var(--electric)]" />
                    <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                      Nouvelle commande
                    </span>
                  </div>
                  <div className="mt-1 font-display font-bold text-sm sm:text-base">+ 1 250 DH</div>
                </div>
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 glass rounded-2xl p-3 sm:p-4 glow animate-fade-up delay-500 max-w-[150px] sm:max-w-none">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 sm:h-5 w-4 sm:w-5 text-[var(--neon)]" />
                    <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                      CA aujourd'hui
                    </span>
                  </div>
                  <div className="mt-1 font-display font-bold text-sm sm:text-base">12 480 DH</div>
                </div>
              </div>
            </div>
            {/* END MOBILE IMAGE */}

            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-xl">
              Paiement unique. Pas d'abonnement. Le site reste à toi à vie.{" "}
              <span className="text-foreground font-medium" dir="rtl">
                خدمة احترافية بثمن مناسب.
              </span>
            </p>
            <div className="mt-7 sm:mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              <Link
                to="/portfolio"
                className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full transition-transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute top-1/2 left-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_75%,oklch(0.65_0.28_305_/_1)_90%,transparent_100%)] animate-rotate-border origin-center" />
                <div className="absolute top-1/2 left-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_75%,oklch(0.65_0.28_305_/_1)_90%,transparent_100%)] animate-rotate-border origin-center blur-[8px]" />
                <div className="absolute inset-[2px] rounded-full bg-background/95 glass group-hover:bg-background/80 transition-colors" />
                <span className="relative z-10 font-bold text-white group-hover:text-[var(--neon)] transition-colors flex items-center">
                  Voir nos projets <Sparkles className="inline-block h-4 w-4 ml-2" />
                </span>
              </Link>
              <Link
                to="/tarifs"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full glass font-medium hover:bg-white/10 transition-colors text-white"
              >
                Voir les tarifs
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full gradient-primary text-primary-foreground font-medium glow hover:scale-105 transition-transform"
              >
                Démarrer mon site{" "}
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg w-full">
              {[
                { icon: Zap, label: "3 jours", sub: "Livraison" },
                { icon: Wallet, label: "Unique", sub: "Paiement" },
                { icon: Headphones, label: "30 jours", sub: "Support" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`glass rounded-2xl p-3 sm:p-4 hover-lift group animate-fade-up delay-${(i + 1) * 100}`}
                >
                  <s.icon className="h-5 w-5 text-[var(--neon)] icon-pop glow-icon mx-auto lg:mx-0" />
                  <div className="mt-2 font-display font-bold text-sm sm:text-base">{s.label}</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP IMAGE */}
          <div className="relative animate-scale-in hidden lg:block">
            <div className="absolute -inset-10 bg-[var(--gradient-hero)] blur-3xl opacity-60" />
            <div className="relative animate-float">
              <div className="relative rounded-3xl overflow-hidden neon-border glow">
                <img
                  src="/hero-new.jpg"
                  alt="Dashboard e-commerce FumaOPS"
                  width={1536}
                  height={1024}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 glass rounded-2xl p-3 sm:p-4 max-w-[180px] sm:max-w-[200px] glow-electric animate-fade-up delay-300">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5 text-[var(--electric)]" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    Nouvelle commande
                  </span>
                </div>
                <div className="mt-1 font-display font-bold text-sm sm:text-base">+ 1 250 DH</div>
              </div>
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 glass rounded-2xl p-3 sm:p-4 glow animate-fade-up delay-500">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 sm:h-5 w-4 sm:w-5 text-[var(--neon)]" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    CA aujourd'hui
                  </span>
                </div>
                <div className="mt-1 font-display font-bold text-sm sm:text-base">12 480 DH</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
            <Sparkles className="h-3 w-3 animate-pulse-glow" /> Pourquoi FumaOPS
          </div>
          <p className="mt-4 text-xl sm:text-2xl font-bold gradient-text" dir="rtl">
            علاش تختار FumaOPS ؟
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold">
            Pas un template générique. Un <span className="gradient-text">vrai site</span>, conçu
            autour de ton activité.
          </h2>
        </div>
        <div className="mt-12 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              t: "Sur mesure",
              ar: "موقع مصمم خصيصاً لكل تجارة",
              d: "Chaque commerce est unique. Ton site aussi. Design, fonctionnalités et flux pensés pour ton activité.",
            },
            {
              t: "Zéro abonnement",
              ar: "بدون إشتراك شهري إطلاقاً",
              d: "Tu paies une seule fois. Le site est à toi à vie. Aucune mensualité, aucun piège.",
            },
            {
              t: "Rapide & pro",
              ar: "سرعة، جودة و إحترافية",
              d: "Livré en 3 jours top chrono, avec une qualité de finition irréprochable.",
            },
            {
              t: "Tableau de bord simple",
              ar: "سهولة في الإستعمال",
              d: "Gère produits, commandes et stats depuis ton mobile. Sans formation.",
            },
            {
              t: "On t'accompagne",
              ar: "ندعمك باش تنجح",
              d: "30 jours de support offert. Corrections, conseils, on est là pour ton succès.",
            },
            {
              t: "WhatsApp & COD",
              ar: "خاص بالسوق المغربي",
              d: "Cash on Delivery & WhatsApp intégrés à chaque produit. Adapté au marché marocain.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="glass rounded-3xl p-6 hover-lift hover:glow transition-all group"
            >
              <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center icon-pop glow">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{f.t}</h3>
              <p className="mt-1 text-sm text-[var(--neon)]" dir="rtl">
                {f.ar}
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] p-8 sm:p-10 md:p-16 text-center glass">
          <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-60" />
          <div className="relative">
            <Smartphone className="h-10 w-10 text-[var(--neon)] mx-auto animate-float" />
            <p className="mt-4 text-xl sm:text-2xl font-bold gradient-text" dir="rtl">
              واجد تطلق تجارتك أونلاين ؟
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold">
              Prêt à lancer ton <span className="gradient-text">e-commerce</span> ?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              À partir de 2000 DH. Livré en 3 jours. Le site reste à toi, pour toujours.
            </p>
            <div className="mt-7 sm:mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full gradient-primary text-primary-foreground font-medium glow hover:scale-105 transition-transform"
              >
                Démarrer maintenant{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/212646340729"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass font-medium hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="h-4 w-4 group-hover:rotate-12 transition-transform" />{" "}
                WhatsApp direct
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
