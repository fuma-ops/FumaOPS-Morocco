import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Check, Copy, Download, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/outils/generateur-politique-confidentialite")({
  component: GeneratorPage,
});

function GeneratorPage() {
  // Form state for Politique de Confidentialité
  const [pcSiteName, setPcSiteName] = useState("");
  const [pcCompany, setPcCompany] = useState("");
  const [pcEmail, setPcEmail] = useState("");
  const [pcCountry, setPcCountry] = useState("France");
  const [pcTypeVitrine, setPcTypeVitrine] = useState(false);
  const [pcTypeEcom, setPcTypeEcom] = useState(false);
  const [pcTypeBlog, setPcTypeBlog] = useState(false);
  const [pcTypeApp, setPcTypeApp] = useState(false);
  const [pcTypePortfolio, setPcTypePortfolio] = useState(false);
  const [pcDataNom, setPcDataNom] = useState(false);
  const [pcDataEmail, setPcDataEmail] = useState(false);
  const [pcDataTel, setPcDataTel] = useState(false);
  const [pcDataAddress, setPcDataAddress] = useState(false);
  const [pcDataPay, setPcDataPay] = useState(false);
  const [pcDataAnalytics, setPcDataAnalytics] = useState(false);
  const [pcDataAds, setPcDataAds] = useState(false);
  const [pcGa, setPcGa] = useState("Non");
  const [pcAds, setPcAds] = useState("Non");
  const [pcThirdParty, setPcThirdParty] = useState("Non");
  const [pcThirdPartyDetails, setPcThirdPartyDetails] = useState("");

  const [generatedPc, setGeneratedPc] = useState<string | null>(null);

  // Form state for Mentions Légales
  const [mlSiteName, setMlSiteName] = useState("");
  const [mlType, setMlType] = useState("Particulier");
  const [mlOwner, setMlOwner] = useState("");
  const [mlAddress, setMlAddress] = useState("");
  const [mlEmail, setMlEmail] = useState("");
  const [mlPhone, setMlPhone] = useState("");
  const [mlSiret, setMlSiret] = useState("");
  const [mlHost, setMlHost] = useState("");
  const [mlHostAddress, setMlHostAddress] = useState("");

  const [generatedMl, setGeneratedMl] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Générateur Politique de Confidentialité Gratuit RGPD 2025 | FumaOPS";

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
      "Générez gratuitement votre politique de confidentialité et mentions légales conformes au RGPD en 2 minutes. Document complet, prêt à copier-coller sur votre site web. Sans inscription.",
    );
    updateMeta(
      "keywords",
      "générateur politique de confidentialité gratuit, politique de confidentialité rgpd, mentions légales site web, modèle politique de confidentialité, créer politique de confidentialité, mentions légales obligatoires, rgpd site web gratuit, politique confidentialité e-commerce, template mentions légales, générateur mentions légales gratuit, politique de confidentialité 2025",
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute(
        "href",
        "https://fumaops.com/outils/generateur-politique-confidentialite",
      );
    } else {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute(
        "href",
        "https://fumaops.com/outils/generateur-politique-confidentialite",
      );
      document.head.appendChild(canonical);
    }

    updateMeta("og:title", "Générateur Politique de Confidentialité RGPD Gratuit", true);
    updateMeta(
      "og:description",
      "Créez votre politique de confidentialité conforme RGPD en 2 minutes. Gratuit, sans inscription.",
      true,
    );
    updateMeta("og:type", "website", true);
    updateMeta("robots", "index, follow");
    updateMeta("language", "fr");

    // Add structured data
    const scriptApp = document.createElement("script");
    scriptApp.type = "application/ld+json";
    scriptApp.id = "schema-app-pc";
    scriptApp.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Générateur Politique de Confidentialité RGPD",
      description:
        "Générez gratuitement votre politique de confidentialité et mentions légales conformes au RGPD",
      url: "https://fumaops.com/outils/generateur-politique-confidentialite",
      applicationCategory: "LegalApplication",
      inLanguage: "fr",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: {
        "@type": "Organization",
        name: "FumaOPS",
        url: "https://fumaops.com",
      },
    });
    document.head.appendChild(scriptApp);

    const scriptFaq = document.createElement("script");
    scriptFaq.type = "application/ld+json";
    scriptFaq.id = "schema-faq-pc";
    scriptFaq.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "La politique de confidentialité est-elle obligatoire ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui. Depuis le RGPD de 2018, tout site web qui collecte des données personnelles (formulaire, cookies, newsletter) est obligé d'afficher une politique de confidentialité. Sans elle, vous risquez des sanctions.",
          },
        },
        {
          "@type": "Question",
          name: "Comment créer une politique de confidentialité gratuite ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Utilisez notre générateur gratuit. Remplissez le formulaire en 2 minutes et obtenez un document complet conforme au RGPD, prêt à copier-coller sur votre site web.",
          },
        },
        {
          "@type": "Question",
          name: "Quelle est la différence entre mentions légales et politique de confidentialité ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les mentions légales identifient le responsable du site (nom, adresse, hébergeur). La politique de confidentialité explique comment les données personnelles des visiteurs sont collectées et utilisées. Les deux documents sont obligatoires.",
          },
        },
        {
          "@type": "Question",
          name: "Où placer la politique de confidentialité sur mon site ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dans une page dédiée accessible depuis le footer de votre site. L'URL recommandée : /politique-de-confidentialite. Elle doit être visible et accessible en permanence.",
          },
        },
      ],
    });
    document.head.appendChild(scriptFaq);

    return () => {
      const el1 = document.getElementById("schema-app-pc");
      const el2 = document.getElementById("schema-faq-pc");
      if (el1) el1.remove();
      if (el2) el2.remove();
    };
  }, []);

  const generatePC = (e: React.FormEvent) => {
    e.preventDefault();

    const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date());

    const dataList = [];
    if (pcDataNom) dataList.push("Nom et prénom");
    if (pcDataEmail) dataList.push("Adresse email");
    if (pcDataTel) dataList.push("Numéro de téléphone");
    if (pcDataAddress) dataList.push("Adresse postale");
    if (pcDataPay) dataList.push("Données de paiement");
    if (pcDataAnalytics) dataList.push("Cookies analytiques");
    if (pcDataAds) dataList.push("Cookies publicitaires");

    const dataString =
      dataList.length > 0 ? dataList.join(", ") : "Aucune donnée spécifique listée";

    let purposes = "assurer le bon fonctionnement du site, traiter vos demandes de contact";
    if (pcTypeEcom) {
      purposes += ", traiter vos commandes et paiements, gérer la relation client";
    }

    let thirdPartyStr = "";
    if (pcThirdParty === "Oui" && pcThirdPartyDetails) {
      thirdPartyStr = `\nCe site peut également utiliser ou faire appel à des services tiers : ${pcThirdPartyDetails}.`;
    }

    const template = `POLITIQUE DE CONFIDENTIALITÉ

Dernière mise à jour : ${date}

1. RESPONSABLE DU TRAITEMENT
${pcCompany || "[Nom entreprise]"} — ${pcEmail || "[Email]"}
Site web : ${pcSiteName || "[Nom du site]"}

2. DONNÉES COLLECTÉES
Dans le cadre de l'utilisation de ${pcSiteName || "notre site"}, nous collectons les données suivantes : ${dataString}.

3. FINALITÉ DU TRAITEMENT
Ces données sont collectées pour : ${purposes}.

4. BASE LÉGALE
Le traitement est fondé sur votre consentement et/ou l'exécution d'un contrat conformément au Règlement Général sur la Protection des Données (RGPD).

5. CONSERVATION DES DONNÉES
Vos données sont conservées pendant une durée maximale de 3 ans à compter de votre dernière interaction.

6. VOS DROITS
Conformément au RGPD, vous disposez des droits suivants : droit d'accès, rectification, suppression, opposition, portabilité. Pour exercer ces droits : ${pcEmail || "nous contacter"}.

7. COOKIES
${pcGa === "Oui" ? "Ce site utilise Google Analytics pour mesurer l'audience. Vous pouvez désactiver ces cookies dans les paramètres de votre navigateur." : "Ce site n'utilise pas de trackers analytiques intrusifs."}
${pcAds === "Oui" ? "Ce site utilise des cookies publicitaires pour afficher des annonces personnalisées." : ""}${thirdPartyStr}

8. CONTACT
Pour toute question : ${pcEmail || "[Email]"}
`;
    setGeneratedPc(template);
  };

  const generateML = (e: React.FormEvent) => {
    e.preventDefault();

    const template = `MENTIONS LÉGALES

Conformément aux dispositions légales en vigueur, voici les mentions légales du site ${mlSiteName || "[Nom du site]"}.

ÉDITEUR DU SITE
${mlType} : ${mlOwner || "[Nom entreprise ou de la personne]"}
Adresse : ${mlAddress || "[Adresse]"}
Email : ${mlEmail || "[Email]"}
${mlPhone ? `Téléphone : ${mlPhone}` : ""}
${mlSiret ? `SIRET/RC : ${mlSiret}` : ""}

HÉBERGEMENT
Ce site est hébergé par : ${mlHost || "[Hébergeur]"}
Adresse de l'hébergeur : ${mlHostAddress || "[Adresse hébergeur]"}

DIRECTEUR DE LA PUBLICATION
${mlOwner || "[Nom du responsable]"}

PROPRIÉTÉ INTELLECTUELLE
L'ensemble du contenu de ce site (textes, images, vidéos) est protégé par le droit d'auteur. Toute reproduction est interdite sans autorisation préalable.

CONTACT
${mlEmail || "[Email de contact]"}
`;
    setGeneratedMl(template);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Document copié dans le presse-papier !");
  };

  const handleDownload = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-5 sm:px-6 pt-12 sm:pt-20 pb-16 text-center animate-fade-in relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium mb-4 leading-tight">
          Générateur de Politique de Confidentialité
          <br className="hidden sm:block" /> et{" "}
          <span className="gradient-text glow-primary">Mentions Légales Gratuit</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
          Créez vos documents légaux conformes au RGPD en 2 minutes. Gratuit, sans inscription, prêt
          à publier.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-5 flex flex-col gap-12 sm:gap-16 pb-20 relative z-10">
        {/* SECTION 1 */}
        <section>
          <div className="glass rounded-[2rem] p-6 sm:p-10 border border-[var(--electric)]/20 shadow-[0_0_40px_-15px_rgba(var(--electric-rgb),0.2)]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--electric)]/20 text-[var(--electric)] text-sm">
                1
              </span>
              Générer ma Politique de Confidentialité
            </h2>

            <form onSubmit={generatePC} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Nom du site web
                  </label>
                  <input
                    required
                    placeholder="ex: monsite.com"
                    value={pcSiteName}
                    onChange={(e) => setPcSiteName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Nom de l'entreprise ou responsable
                  </label>
                  <input
                    required
                    placeholder="SARL Mon Entreprise"
                    value={pcCompany}
                    onChange={(e) => setPcCompany(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Email de contact
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="contact@monsite.com"
                    value={pcEmail}
                    onChange={(e) => setPcEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Pays</label>
                  <div className="relative">
                    <select
                      value={pcCountry}
                      onChange={(e) => setPcCountry(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                    >
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">France</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Belgique</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Suisse</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Canada</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Maroc</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Tunisie</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Autre</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 opacity-80">Type de site</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30">
                    <input
                      type="checkbox"
                      checked={pcTypeVitrine}
                      onChange={(e) => setPcTypeVitrine(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Site vitrine
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30">
                    <input
                      type="checkbox"
                      checked={pcTypeEcom}
                      onChange={(e) => setPcTypeEcom(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    E-commerce
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30">
                    <input
                      type="checkbox"
                      checked={pcTypeBlog}
                      onChange={(e) => setPcTypeBlog(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Blog
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30">
                    <input
                      type="checkbox"
                      checked={pcTypeApp}
                      onChange={(e) => setPcTypeApp(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Application
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30">
                    <input
                      type="checkbox"
                      checked={pcTypePortfolio}
                      onChange={(e) => setPcTypePortfolio(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Portfolio
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 opacity-80">
                  Données collectées
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pcDataNom}
                      onChange={(e) => setPcDataNom(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Nom et prénom
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pcDataEmail}
                      onChange={(e) => setPcDataEmail(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Email
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pcDataTel}
                      onChange={(e) => setPcDataTel(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Téléphone
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pcDataAddress}
                      onChange={(e) => setPcDataAddress(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Adresse postale
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pcDataPay}
                      onChange={(e) => setPcDataPay(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Paiement
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pcDataAnalytics}
                      onChange={(e) => setPcDataAnalytics(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Cookies analytiques
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pcDataAds}
                      onChange={(e) => setPcDataAds(e.target.checked)}
                      className="accent-[var(--electric)]"
                    />{" "}
                    Cookies publicitaires
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Utilise Google Analytics ?
                  </label>
                  <div className="relative">
                    <select
                      value={pcGa}
                      onChange={(e) => setPcGa(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                    >
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Oui</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Non</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Utilise des publicités ?
                  </label>
                  <div className="relative">
                    <select
                      value={pcAds}
                      onChange={(e) => setPcAds(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                    >
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Oui</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Non</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Outils tiers ?
                  </label>
                  <div className="relative">
                    <select
                      value={pcThirdParty}
                      onChange={(e) => setPcThirdParty(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                    >
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Oui</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Non</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {pcThirdParty === "Oui" && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium mb-2 opacity-80">Lesquels ?</label>
                  <input
                    placeholder="ex: Stripe, Mailchimp, Sendinblue..."
                    value={pcThirdPartyDetails}
                    onChange={(e) => setPcThirdPartyDetails(e.target.value)}
                    className="w-full rounded-xl border border-[var(--electric)]/50 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex h-12 items-center justify-center rounded-full bg-[var(--electric)] px-6 text-base font-bold text-black transition-all hover:scale-[1.02] hover:bg-[var(--neon)]"
              >
                Générer ma Politique de Confidentialité
              </button>
            </form>

            {generatedPc && (
              <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-[var(--electric)]">
                    Votre document est prêt !
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCopy(generatedPc)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium border border-white/20"
                    >
                      <Copy className="h-4 w-4" /> 📋 Copier
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(generatedPc, "politique-de-confidentialite.txt")
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--electric)]/20 text-[var(--electric)] hover:bg-[var(--electric)]/30 transition-colors text-sm font-medium border border-[var(--electric)]/40"
                    >
                      <Download className="h-4 w-4" /> ⬇️ Télécharger
                    </button>
                  </div>
                </div>
                <div className="bg-black/40 rounded-xl p-6 border border-white/10 max-h-[400px] overflow-y-auto w-full group">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground group-hover:text-white/90 transition-colors">
                    {generatedPc}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2 */}
        <section>
          <div className="glass rounded-[2rem] p-6 sm:p-10 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white text-sm border border-white/20">
                2
              </span>
              Générer mes Mentions Légales
            </h2>

            <form onSubmit={generateML} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Nom du site web
                  </label>
                  <input
                    required
                    placeholder="ex: monsite.com"
                    value={mlSiteName}
                    onChange={(e) => setMlSiteName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Type de structure
                  </label>
                  <div className="relative">
                    <select
                      value={mlType}
                      onChange={(e) => setMlType(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white outline-none focus:border-white/30 transition-colors cursor-pointer"
                    >
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Particulier</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">
                        Auto-entrepreneur
                      </option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">SARL</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">SAS / SASU</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Association</option>
                      <option className="bg-[oklch(0.14_0.06_280)] text-white">Autre</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Nom entreprise ou propriétaire
                  </label>
                  <input
                    required
                    placeholder="Dupont Jean, ou SARL XYZ"
                    value={mlOwner}
                    onChange={(e) => setMlOwner(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Adresse complète
                  </label>
                  <input
                    required
                    placeholder="123 rue de la Paix, 75000 Paris"
                    value={mlAddress}
                    onChange={(e) => setMlAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Email de contact
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="contact@monsite.com"
                    value={mlEmail}
                    onChange={(e) => setMlEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Téléphone (optionnel)
                  </label>
                  <input
                    placeholder="+33 6 00 00 00 00"
                    value={mlPhone}
                    onChange={(e) => setMlPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Numéro SIRET / RC (optionnel)
                  </label>
                  <input
                    placeholder="123 456 789 00010"
                    value={mlSiret}
                    onChange={(e) => setMlSiret(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="p-5 bg-white/5 rounded-xl border border-white/10 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    Hébergeur du site
                  </label>
                  <input
                    required
                    placeholder="ex: OVH, Hostinger, o2switch"
                    value={mlHost}
                    onChange={(e) => setMlHost(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    Adresse de l'hébergeur
                  </label>
                  <input
                    required
                    placeholder="2 rue Kellermann, 59100 Roubaix"
                    value={mlHostAddress}
                    onChange={(e) => setMlHostAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex h-12 items-center justify-center rounded-full bg-white text-black px-6 text-base font-bold transition-all hover:scale-[1.02] hover:bg-gray-200"
              >
                Générer mes Mentions Légales
              </button>
            </form>

            {generatedMl && (
              <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Vos mentions légales sont prêtes !
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCopy(generatedMl)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium border border-white/20"
                    >
                      <Copy className="h-4 w-4" /> 📋 Copier
                    </button>
                    <button
                      onClick={() => handleDownload(generatedMl, "mentions-legales.txt")}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium border border-white/20"
                    >
                      <Download className="h-4 w-4" /> ⬇️ Télécharger
                    </button>
                  </div>
                </div>
                <div className="bg-black/40 rounded-xl p-6 border border-white/10 max-h-[400px] overflow-y-auto w-full group">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground group-hover:text-white/90 transition-colors">
                    {generatedMl}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="glass rounded-[2rem] p-6 sm:p-10 border border-white/10">
          <h2 className="text-2xl sm:text-3xl font-display font-medium mb-10 text-center">
            Pourquoi ces documents sont-ils obligatoires ?
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">
                Qu'est-ce que la politique de confidentialité ?
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                La politique de confidentialité est un document légal qui explique à vos visiteurs
                quelles données personnelles vous collectez, comment vous les utilisez et comment
                ils peuvent exercer leurs droits. Elle est obligatoire dès que votre site collecte
                des données (formulaire, cookies, newsletter).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-[var(--electric)] mb-2">
                Qu'est-ce que le RGPD et pourquoi est-ce important ?
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Le RGPD (Règlement Général sur la Protection des Données) est une loi européenne en
                vigueur depuis 2018. Elle protège les données personnelles des internautes. Tout
                site web qui collecte des données doit être conforme au RGPD, sous peine d'amendes
                pouvant atteindre 20 millions d'euros ou 4% du chiffre d'affaires annuel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">
                Qu'est-ce que les mentions légales ?
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Les mentions légales identifient le responsable d'un site web. En France, elles sont
                obligatoires pour tout site professionnel selon la loi pour la Confiance dans
                l'Économie Numérique (LCEN). Elles doivent mentionner l'éditeur du site, l'hébergeur
                et les coordonnées de contact.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-[var(--neon)]/30 shadow-[0_0_20px_-10px_rgba(var(--neon-rgb),0.2)]">
              <h3 className="text-lg font-bold text-white mb-4">
                Comment intégrer ces documents dans mon site web ?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
                <li>Générez vos documents avec notre outil ci-dessus.</li>
                <li>
                  Créez deux nouvelles pages sur votre site :{" "}
                  <span className="text-[var(--neon)]">/politique-de-confidentialite</span> et{" "}
                  <span className="text-[var(--neon)]">/mentions-legales</span>.
                </li>
                <li>Copiez-collez le document généré dans chaque page.</li>
                <li>Ajoutez les liens dans le footer de votre site.</li>
                <li>
                  Si vous utilisez des cookies, ajoutez une bannière de consentement visible au
                  premier chargement.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">Quels sites sont concernés ?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tout site web sans exception : site vitrine, e-commerce, blog, portfolio, site
                associatif. Dès lors qu'il est accessible au public et/ou collecte des données.
              </p>
            </div>
          </div>
        </section>

        {/* PIED DE PAGE DE L'OUTIL */}
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
          <Link
            to="/outils"
            className="text-sm text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-2"
          >
            &larr; Voir tous nos outils gratuits
          </Link>
          <div className="hidden sm:block text-white/20">|</div>
          <Link
            to="/contact"
            className="text-sm text-[var(--electric)] hover:text-[var(--neon)] transition-colors inline-flex items-center gap-2"
          >
            Besoin d'un site web professionnel ? &rarr;
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
