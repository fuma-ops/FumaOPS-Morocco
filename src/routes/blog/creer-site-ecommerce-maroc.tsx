import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";

export const Route = createFileRoute("/blog/creer-site-ecommerce-maroc")({
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
          Comment{" "}
          <span className="gradient-text glow-primary">créer un site e-commerce au Maroc</span> : Le
          Guide Complet
        </h1>

        <div className="prose prose-invert prose-lg max-w-none relative z-10 space-y-6 text-muted-foreground">
          <p className="text-lg sm:text-xl text-white/90">
            Le marché du e-commerce au Maroc est en pleine explosion. De plus en plus de Marocains
            achètent en ligne, ce qui représente une opportunité immense pour les commerçants
            locaux. Mais comment lancer sa propre boutique en ligne sans se perdre ?
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            1. Comprendre le marché marocain
          </h2>
          <p>
            Contrairement à l'Europe ou aux États-Unis où le paiement par carte bancaire est
            dominant, le Maroc est le royaume du{" "}
            <strong>Cash on Delivery (Paiement à la livraison)</strong>. Vos clients préfèrent
            commander sans payer à l'avance et régler le livreur une fois le colis reçu. Votre site
            doit être optimisé pour ce comportement.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            2. Choisir la bonne plateforme
          </h2>
          <p>Vous avez plusieurs options :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Shopify / YouCan :</strong> Simples à utiliser, mais attention aux abonnements
              mensuels et aux commissions sur chaque vente qui grignotent vos marges.
            </li>
            <li>
              <strong>WooCommerce (WordPress) :</strong> Plus flexible, mais nécessite des
              compétences techniques pour la maintenance et la sécurité.
            </li>
            <li>
              <strong>Site sur mesure (L'approche FumaOPS) :</strong> Un site taillé pour vos
              besoins, sans frais cachés ni abonnement mensuel. Vous payez une fois, il vous
              appartient.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            3. Optimiser la prise de commande
          </h2>
          <p>
            Pour réussir au Maroc, facilitez la commande. Un formulaire simplifié demandant
            uniquement le numéro de téléphone et l'adresse est suffisant. Chez FumaOPS, nous
            intégrons même la <strong>prise de commande directement via WhatsApp</strong>, la
            méthode préférée des acheteurs marocains.
          </p>

          <div className="glass p-6 sm:p-8 rounded-2xl my-10 border-[var(--electric)]/30 border">
            <h3 className="text-xl font-bold text-white mb-2">
              Prêt à lancer votre boutique en ligne sans abonnement ?
            </h3>
            <p className="mb-6">
              Découvrez notre offre e-commerce à partir de 2000 DH. Payez une seule fois, pas
              d'abonnement.
            </p>
            <Link
              to="/tarifs"
              className="inline-flex h-10 sm:h-12 items-center justify-center rounded-full bg-[var(--electric)] px-6 sm:px-8 text-sm sm:text-base font-semibold text-black transition-all hover:scale-105"
            >
              Voir nos offres
            </Link>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
