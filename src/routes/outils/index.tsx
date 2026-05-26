import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";

export const Route = createFileRoute("/outils/")({
  component: OutilsIndex,
});

function OutilsIndex() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-12 sm:py-24 text-center">
        <h1 className="text-4xl font-display font-medium mb-6">Nos Outils</h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
          Découvrez nos outils gratuits pour vous aider à lancer et gérer votre activité en ligne.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link
            to="/outils/calculateur-prix-site-web"
            className="glass p-6 rounded-2xl border border-white/10 hover:border-[var(--electric)] transition-colors text-left group block"
          >
            <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--electric)] transition-colors">
              Calculateur de prix
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Estimez le coût de votre futur site web de manière précise en 2 minutes.
            </p>
          </Link>
          <Link
            to="/outils/generateur-politique-confidentialite"
            className="glass p-6 rounded-2xl border border-white/10 hover:border-[var(--electric)] transition-colors text-left group block"
          >
            <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--electric)] transition-colors">
              Politique de Confidentialité
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Générez vos documents légaux conformes au RGPD gratuitement pour vos sites.
            </p>
          </Link>
          <Link
            to="/outils/generateur-palette-couleurs"
            className="glass p-6 rounded-2xl border border-white/10 hover:border-[var(--electric)] transition-colors text-left group block"
          >
            <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--electric)] transition-colors">
              Palette de Couleurs
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Créez des combinaisons et harmonies chromatiques d'exception.
            </p>
          </Link>
          <Link
            to="/outils/generateur-meta-tags-seo"
            className="glass p-6 rounded-2xl border border-white/10 hover:border-[var(--electric)] transition-colors text-left group block"
          >
            <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--electric)] transition-colors">
              Générateur Meta Tags SEO
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Optimisez votre référencement naturel et l'aperçu réseaux sociaux.
            </p>
          </Link>
          <Link
            to="/outils/generateur-qr-code"
            className="glass p-6 rounded-2xl border border-white/10 hover:border-[var(--electric)] transition-colors text-left group block"
          >
            <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--electric)] transition-colors">
              Générateur QR Code
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Générez des codes QR mignons et mémorables pour vos clients.
            </p>
          </Link>
          <Link
            to="/outils/generateur-facture"
            className="glass p-6 rounded-2xl border border-white/10 hover:border-[var(--electric)] transition-colors text-left group block"
          >
            <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--electric)] transition-colors text-orange-400">
              Générateur de Facture
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Créez et éditez vos factures professionnelles gratuites au format A4 PDF.
            </p>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
