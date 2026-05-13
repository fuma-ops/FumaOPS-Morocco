import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import {
  Package,
  ShoppingCart,
  Image as ImageIcon,
  MessageCircle,
  Smartphone,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — FumaOPS" },
      {
        name: "description",
        content:
          "Tout ce qui est inclus : gestion produits, commandes, WhatsApp, dashboard, photos, responsive.",
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    icon: Package,
    t: "Gestion des produits",
    ar: "إدارة المنتجات بسهولة",
    d: "Ajout illimité de produits avec variantes (taille/couleur) et stocks. Interface ultra simple pour le commerçant.",
  },
  {
    icon: ShoppingCart,
    t: "Gestion des commandes",
    ar: "تتبع الطلبيات في الحين",
    d: "Suivi en temps réel. Un clic pour confirmer une vente. Statuts personnalisables (en attente, validée, livrée) et export CSV.",
  },
  {
    icon: ImageIcon,
    t: "Photos & Tarification",
    ar: "الصور والأسعار بطريقة احترافية",
    d: "Upload multi-images optimisées, gestion simplifiée des promotions, choix de devise (DH, EUR, USD).",
  },
  {
    icon: MessageCircle,
    t: "WhatsApp Direct",
    ar: "زر واتساب في كل منتج",
    d: "Bouton WhatsApp sur chaque produit avec message pré-rempli. Bouton flottant présent sur tout le site.",
  },
  {
    icon: Smartphone,
    t: "100% Responsive",
    ar: "موقع كيخدم مزيان في التيلفون",
    d: "Mobile-first, fonctionnement PWA rapide. Performance optimisée sur tous les écrans.",
  },
  {
    icon: BarChart3,
    t: "Tableau de bord",
    ar: "إحصائيات مفصلة",
    d: "Statistiques en un coup d'œil. KPI, top clients, top produits — pour piloter ton commerce.",
  },
];

function Services() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          Services inclus
        </div>
        <p className="mt-4 text-xl sm:text-2xl font-bold gradient-text" dir="rtl">
          كل ما تحتاج باش تبيع أونلاين
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold">
          Tout ce qu'il faut pour <span className="gradient-text">vendre en ligne</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Un site e-commerce complet, prêt à encaisser. Sans abonnement, sans surprise.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-8 sm:py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {services.map((s, i) => (
          <div
            key={i}
            className={`glass rounded-3xl p-6 sm:p-7 hover-lift hover:glow transition-all group animate-fade-up delay-${((i % 5) + 1) * 100}`}
          >
            <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center icon-pop glow">
              <s.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-5 text-xl font-bold">{s.t}</h3>
            {s.ar && (
              <p className="mt-1 text-sm text-[var(--neon)]" dir="rtl">
                {s.ar}
              </p>
            )}
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-6 py-12 sm:py-16">
        <div className="glass rounded-3xl p-7 sm:p-8 md:p-10 neon-border hover-lift">
          <h3 className="font-display text-xl sm:text-2xl font-bold">Évolutions sur mesure</h3>
          <p className="mt-2 text-sm text-[var(--neon)]" dir="rtl">
            تحسينات و إضافات حسب الطلب
          </p>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Besoin d'une fonctionnalité spécifique ? Les évolutions commencent à{" "}
            <span className="text-[var(--neon)] font-semibold">500 DH</span>. Le premier mois inclut
            un{" "}
            <span className="text-foreground font-semibold">
              support gratuit complet de 30 jours
            </span>{" "}
            : corrections, conseils, accompagnement WhatsApp.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
