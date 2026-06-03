import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog E-commerce Maroc — FumaOPS" },
      {
        name: "description",
        content:
          "Conseils, guides et astuces pour réussir votre e-commerce au Maroc : COD, WhatsApp, SEO et plus.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: Blog,
});

const articles = [
  {
    slug: "article-1",
    title: "Comment créer un site e-commerce au Maroc sans abonnement en 2026",
    description:
      "Guide complet pour vendre en ligne sans abonnement, maîtriser le Cash on Delivery et exploser vos ventes.",
  },
  {
    slug: "creer-site-ecommerce-maroc",
    title: "Comment créer un site e-commerce au Maroc : Le Guide Complet",
    description:
      "Découvrez les étapes essentielles pour lancer votre boutique en ligne avec succès sur le marché marocain.",
  },
  {
    slug: "vendre-en-ligne-maroc-sans-abonnement",
    title: "Vendre en ligne au Maroc sans abonnement mensuel",
    description:
      "Évitez les frais occasionnés par Shopify et WooCommerce. Lancez votre site avec paiement unique.",
  },
  {
    slug: "cash-on-delivery-maroc",
    title: "Le guide du Cash on Delivery (COD) et WhatsApp E-commerce au Maroc",
    description:
      "Pourquoi le paiement à la livraison est roi, et comment FumaOPS optimise vos conversions.",
  },
];

function Blog() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-16 sm:py-24 animate-fade-in relative">
        <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] bg-[var(--neon)]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium mb-6">
            Notre <span className="gradient-text glow-primary">Blog E-commerce</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Conseils et astuces pour réussir votre business en ligne au Maroc.
          </p>
          <p className="mt-2 text-sm sm:text-base font-bold gradient-text" dir="rtl">
            نصائح باش تنجح البيع ديالك أونلاين في المغرب.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="glass rounded-3xl p-6 sm:p-8 hover:bg-white/[0.04] transition-all duration-300 group block relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-2 w-2 rounded-full bg-[var(--electric)] glow-electric animate-pulse-glow" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">
                {article.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {article.description}
              </p>
              <div className="mt-8 flex items-center text-[var(--electric)] text-sm font-medium">
                Lire l'article
                <svg
                  className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
