import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";

export const Route = createFileRoute("/blog/cash-on-delivery-maroc")({
  component: Article,
});

function Article() {
  return (
    <PageShell>
      <article className="mx-auto max-w-4xl px-5 sm:px-6 py-16 sm:py-24 animate-fade-in relative">
        <div className="mb-8">
          <Link
            to="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
          >
            &larr; Retour au blog
          </Link>
        </div>
        <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] bg-[var(--neon)]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium mb-8 leading-tight relative z-10">
          Le guide du <span className="gradient-text glow-primary">Cash on Delivery (COD)</span> et
          WhatsApp E-commerce au Maroc
        </h1>

        <div className="prose prose-invert prose-lg max-w-none relative z-10 space-y-6 text-muted-foreground">
          <p className="text-lg sm:text-xl text-white/90">
            Si vous vendez en ligne au Maroc, le paiement à la livraison (Cash on Delivery ou COD)
            n'est pas une option, c'est une <strong>obligation</strong>. C'est simplement comme ça
            que les Marocains achètent.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Pourquoi le COD est-il incontournable ?
          </h2>
          <p>
            Plus de 90% des transactions e-commerce au Maroc se font en espèces au moment de la
            livraison de la commande. Pourquoi ? La confiance. Les acheteurs préfèrent voir, tester
            et contrôler le produit avant de payer. De plus, beaucoup de personnes ne disposent pas
            d'une carte bancaire adaptée aux achats en ligne locaux.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Simplifier via WhatsApp</h2>
          <p>
            Parallèlement au paiement à la livraison, l'utilisation de WhatsApp pour confirmer les
            commandes est devenue la norme. Un formulaire classique sur un site web est souvent
            perçu comme trop fastidieux.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Le bouton "Acheter via WhatsApp" :</strong> Un simple clic redirige l'acheteur
              vers une discussion WhatsApp pré-remplie avec le titre et le prix du produit qu'il
              souhaite acheter.
            </li>
            <li>
              <strong>La proximité :</strong> La conversion sur WhatsApp est incroyablement haute
              car la communication est directe et humaine.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Comment FumaOPS intègre tout ça
          </h2>
          <p>
            Chez <strong>FumaOPS</strong>, tous nos sites vitrines et e-commerce sont pensés dès le
            départ pour la réalité marocaine. Lorsqu'un client clique sur un produit de votre
            e-shop, la commande s'ouvre soit en mode COD direct, soit vers une confirmation
            WhatsApp. Vous gagnez du temps et vous maximisez votre taux de conversion.
          </p>

          <div className="glass p-6 sm:p-8 rounded-2xl my-10 border-[var(--electric)]/30 border">
            <h3 className="text-xl font-bold text-white mb-2">Passez au niveau supérieur</h3>
            <p className="mb-6">
              Confiez-nous la création de votre site e-commerce spécialiste COD. Un paiement de 2000
              DH et la plateforme est à vous, à vie.
            </p>
            <Link
              to="/contact"
              className="inline-flex h-10 sm:h-12 items-center justify-center rounded-full bg-[var(--electric)] px-6 sm:px-8 text-sm sm:text-base font-semibold text-black transition-all hover:scale-105"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
