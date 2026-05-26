import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/outils/calculateur-prix-site-web")({
  component: CalculatorPage,
});

const currencies = [
  { code: "EUR", symbol: "€", rate: 1 },
  { code: "MAD", symbol: "د.م", rate: 11 },
  { code: "CHF", symbol: "CHF", rate: 0.93 },
  { code: "CAD", symbol: "$", rate: 1.47 },
];

const types = [
  { id: "vitrine", label: "Vitrine", price: 150 },
  { id: "ecommerce", label: "E-commerce", price: 350 },
  { id: "portfolio", label: "Portfolio", price: 100 },
  { id: "restaurant", label: "Restaurant & café", price: 200 },
  { id: "blog", label: "Blog & magazine", price: 180 },
  { id: "app", label: "Application web", price: 500 },
];

const pages = [
  { id: "1-3", label: "1 à 3 pages", price: 0 },
  { id: "4-7", label: "4 à 7 pages", price: 50 },
  { id: "8-15", label: "8 à 15 pages", price: 120 },
  { id: "15+", label: "Plus de 15 pages", price: 250 },
];

const featuresList = [
  { id: "contact", label: "Formulaire contact", price: 20 },
  { id: "blog", label: "Blog intégré", price: 40 },
  { id: "resa", label: "Système de réservation", price: 80 },
  { id: "paiement", label: "Paiement en ligne", price: 120 },
  { id: "whatsapp", label: "Bouton WhatsApp", price: 15 },
  { id: "seo", label: "Optimisation SEO", price: 50 },
  { id: "multi", label: "Site multilingue", price: 60 },
  { id: "membre", label: "Espace membre & connexion", price: 150 },
];

const designs = [
  { id: "standard", label: "Template standard", price: 0 },
  { id: "semi", label: "Semi-personnalisé", price: 80 },
  { id: "surmesure", label: "100% sur mesure", price: 200 },
];

const deadlines = [
  { id: "urgent", label: "Urgent (3 jours)", price: 80 },
  { id: "normal", label: "Normal (1-2 semaines)", price: 0 },
  { id: "flexible", label: "Flexible (+2 semaines)", price: -20 },
];

export function CalculatorPage() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [type, setType] = useState(types[0].id);
  const [pageCount, setPageCount] = useState(pages[0].id);
  const [features, setFeatures] = useState<string[]>([]);
  const [design, setDesign] = useState(designs[0].id);
  const [deadline, setDeadline] = useState(deadlines[1].id);

  useEffect(() => {
    document.title = "Calculateur Prix Site Web Gratuit 2025 | FumaOPS";

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        if (isProperty) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    updateMeta(
      "description",
      "Calculez gratuitement le prix de votre site web en 2 minutes. Estimation personnalisée selon votre activité, vos fonctionnalités et votre budget. Vitrine, e-commerce, portfolio. Devis sans engagement par FumaOPS.",
    );
    updateMeta(
      "keywords",
      "prix site web, combien coute un site web, tarif site web, devis site web gratuit, créer un site web prix, calculateur prix site web, coût création site internet, prix site vitrine, prix site e-commerce, tarif agence web, combien coute un site internet, estimation site web, prix site web 2025, créer site web pas cher",
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", "https://fumaops.com/outils/calculateur-prix-site-web");
    } else {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("href", "https://fumaops.com/outils/calculateur-prix-site-web");
      document.head.appendChild(canonical);
    }

    updateMeta("og:title", "Calculateur Prix Site Web Gratuit | FumaOPS", true);
    updateMeta(
      "og:description",
      "Estimez le coût de votre site web en 2 minutes. Résultat immédiat, sans inscription.",
      true,
    );
    updateMeta("og:url", "https://fumaops.com/outils/calculateur-prix-site-web", true);
    updateMeta("og:type", "website", true);
    updateMeta("robots", "index, follow");
    updateMeta("language", "fr");

    // Add structured data
    const scriptApp = document.createElement("script");
    scriptApp.type = "application/ld+json";
    scriptApp.id = "schema-app";
    scriptApp.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Calculateur Prix Site Web",
      description: "Estimez gratuitement le coût de création de votre site web selon vos besoins",
      url: "https://fumaops.com/outils/calculateur-prix-site-web",
      applicationCategory: "BusinessApplication",
      inLanguage: "fr",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: { "@type": "Organization", name: "FumaOPS", url: "https://fumaops.com" },
    });
    document.head.appendChild(scriptApp);

    const scriptFaq = document.createElement("script");
    scriptFaq.type = "application/ld+json";
    scriptFaq.id = "schema-faq";
    scriptFaq.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quel est le prix d'un site web en 2025 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le prix d'un site web varie entre 100€ et 10 000€. Un site vitrine coûte en moyenne 150€ à 500€. Un e-commerce entre 350€ et 3 000€ selon les fonctionnalités.",
          },
        },
        {
          "@type": "Question",
          name: "Comment calculer le prix de son site web ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le prix dépend du type de site, du nombre de pages, des fonctionnalités souhaitées, du niveau de design et du délai de livraison. Utilisez notre calculateur gratuit pour obtenir une estimation en 2 minutes.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on avoir un site web sans abonnement mensuel ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui. Certaines agences comme FumaOPS proposent un paiement unique sans abonnement. Vous payez une seule fois et votre site vous appartient entièrement.",
          },
        },
        {
          "@type": "Question",
          name: "Combien de temps pour créer un site web ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le délai varie de 3 jours à plusieurs semaines selon la complexité du projet. FumaOPS livre les sites en 3 jours pour les projets standards.",
          },
        },
        {
          "@type": "Question",
          name: "Quelle différence entre site vitrine et e-commerce ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un site vitrine présente votre activité sans possibilité d'achat en ligne. Un site e-commerce permet à vos clients d'acheter directement sur votre site avec paiement sécurisé.",
          },
        },
      ],
    });
    document.head.appendChild(scriptFaq);

    return () => {
      const el1 = document.getElementById("schema-app");
      const el2 = document.getElementById("schema-faq");
      if (el1) el1.remove();
      if (el2) el2.remove();
    };
  }, []);

  const calculateTotal = () => {
    let totalEur = 0;

    // Base price
    totalEur += types.find((t) => t.id === type)?.price || 0;
    // Pages
    totalEur += pages.find((p) => p.id === pageCount)?.price || 0;
    // Features
    features.forEach((fid) => {
      totalEur += featuresList.find((f) => f.id === fid)?.price || 0;
    });
    // Design
    totalEur += designs.find((d) => d.id === design)?.price || 0;
    // Deadline
    totalEur += deadlines.find((d) => d.id === deadline)?.price || 0;

    // Convert
    const finalPrice = Math.max(0, totalEur) * currency.rate;
    // Calculate range
    const min = Math.round(finalPrice * 0.9);
    const max = Math.round(finalPrice * 1.1);

    return { min, max };
  };

  const { min, max } = calculateTotal();

  const toggleFeature = (id: string) => {
    if (features.includes(id)) {
      setFeatures(features.filter((f) => f !== id));
    } else {
      setFeatures([...features, id]);
    }
  };

  const OptionCard = ({
    active,
    onClick,
    label,
  }: {
    active: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`relative rounded-xl border p-4 text-left transition-all ${
        active
          ? "border-[var(--electric)] bg-[var(--electric)]/10 glow-electric shadow-[0_0_15px_-3px_rgba(var(--electric-rgb),0.2)]"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      <span className={`block font-medium ${active ? "text-white" : "text-muted-foreground"}`}>
        {label}
      </span>
      {active && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--electric)]">
          <Check className="h-5 w-5" />
        </div>
      )}
    </button>
  );

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-12 sm:py-16 animate-fade-in relative">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium mb-4">
            Calculateur de Prix de <br className="hidden sm:block" />
            <span className="gradient-text glow-primary">Site Web Gratuit</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Obtenez une estimation personnalisée en 2 minutes.
            <br />
            Résultat immédiat, sans inscription, sans engagement.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center rounded-full bg-white/5 p-1 border border-white/10">
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  currency.code === c.code
                    ? "bg-[var(--electric)] text-black shadow-lg"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                {c.code} {c.symbol}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-10">
            {/* Step 1 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--electric)]/20 text-[var(--electric)] text-sm">
                  1
                </span>
                Type de site
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-11">
                {types.map((t) => (
                  <OptionCard
                    key={t.id}
                    active={type === t.id}
                    onClick={() => setType(t.id)}
                    label={t.label}
                  />
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--electric)]/20 text-[var(--electric)] text-sm">
                  2
                </span>
                Nombre de pages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-11">
                {pages.map((p) => (
                  <OptionCard
                    key={p.id}
                    active={pageCount === p.id}
                    onClick={() => setPageCount(p.id)}
                    label={p.label}
                  />
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--electric)]/20 text-[var(--electric)] text-sm">
                  3
                </span>
                Fonctionnalités
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-11">
                {featuresList.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => toggleFeature(f.id)}
                    className={`relative flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      features.includes(f.id)
                        ? "border-[var(--electric)] bg-[var(--electric)]/10 text-white"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-medium">{f.label}</span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${features.includes(f.id) ? "border-[var(--electric)] bg-[var(--electric)] text-black" : "border-white/20"}`}
                    >
                      {features.includes(f.id) && <Check className="h-3 w-3" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--electric)]/20 text-[var(--electric)] text-sm">
                  4
                </span>
                Design
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-11">
                {designs.map((d) => (
                  <OptionCard
                    key={d.id}
                    active={design === d.id}
                    onClick={() => setDesign(d.id)}
                    label={d.label}
                  />
                ))}
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--electric)]/20 text-[var(--electric)] text-sm">
                  5
                </span>
                Délai de livraison
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-11">
                {deadlines.map((d) => (
                  <OptionCard
                    key={d.id}
                    active={deadline === d.id}
                    onClick={() => setDeadline(d.id)}
                    label={d.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Results Panel */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="glass rounded-3xl p-6 sm:p-8 border border-[var(--electric)]/20 shadow-[0_0_40px_-15px_rgba(var(--electric-rgb),0.3)]">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center mb-6">
                Estimation
              </h3>

              <div className="text-center mb-8">
                <p className="text-lg mb-2">Votre site web coûte entre</p>
                <div className="text-3xl sm:text-4xl font-display font-bold text-[var(--electric)] mb-1">
                  {min.toLocaleString()} {currency.symbol} - {max.toLocaleString()}{" "}
                  {currency.symbol}
                </div>
                <p className="text-xs text-muted-foreground">(±10% de marge d'erreur)</p>
              </div>

              <div className="space-y-3 mb-8 bg-black/20 rounded-xl p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type :</span>
                  <span className="font-medium">{types.find((t) => t.id === type)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pages :</span>
                  <span className="font-medium">
                    {pages.find((p) => p.id === pageCount)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Design :</span>
                  <span className="font-medium">{designs.find((d) => d.id === design)?.label}</span>
                </div>
                {features.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Options :</span>
                    <span className="font-medium text-right max-w-[150px]">
                      {features.length} sélectionnée(s)
                    </span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t border-white/10 flex justify-between text-[var(--neon)]">
                  <span>Délai estimé :</span>
                  <span className="font-bold">
                    {deadlines
                      .find((d) => d.id === deadline)
                      ?.label.split(" (")[1]
                      ?.replace(")", "") || "1-2 semaines"}
                  </span>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full inline-flex h-12 items-center justify-center rounded-full bg-[var(--electric)] px-6 text-base font-bold text-black transition-all hover:scale-105 hover:bg-[var(--neon)]"
              >
                Obtenir mon devis gratuit
              </Link>
            </div>

            <div className="text-center">
              <Link
                to="/outils"
                className="text-sm text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-2"
              >
                &larr; Voir tous nos outils gratuits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DEFINITIONS SECTION */}
      <section className="mx-auto max-w-4xl px-5 sm:px-6 py-16 sm:py-20 border-t border-white/10">
        <h2 className="text-2xl sm:text-3xl font-display font-medium mb-10 text-center">
          Comprendre les prix d'un site web
        </h2>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Qu'est-ce qu'un site vitrine ?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Un site vitrine présente votre entreprise, vos services et vos coordonnées. Idéal pour
              artisans, professions libérales et petites entreprises. Prix moyen : 150€ à 400€.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Qu'est-ce qu'un site e-commerce ?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Un site e-commerce vous permet de vendre vos produits en ligne avec paiement sécurisé,
              gestion des stocks et suivi des commandes. Prix moyen : 350€ à 1 200€.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">C'est quoi le design sur mesure ?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Un design 100% personnalisé signifie un site unique créé spécialement pour votre
              marque. Aucun template générique. Votre identité visuelle est entièrement respectée.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Pourquoi le délai influence le prix ?
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Un site livré en urgence en 3 jours mobilise toute l'équipe exclusivement sur votre
              projet, ce qui justifie un supplément.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Combien coûte un site web en 2025 ?
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Le prix d'un site web varie entre 100€ et 10 000€ selon la complexité. Un site vitrine
              simple coûte entre 150€ et 500€. Un e-commerce complet entre 350€ et 3 000€.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
