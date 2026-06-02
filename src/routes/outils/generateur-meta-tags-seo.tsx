import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useState, useEffect } from "react";
import {
  Copy,
  Download,
  Check,
  Globe,
  Image as ImageIcon,
  Twitter,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/outils/generateur-meta-tags-seo")({
  head: () => ({
    meta: [
      { title: "Générateur de Meta Tags SEO Gratuit 2025 | FumaOPS" },
      {
        name: "description",
        content:
          "Générez gratuitement vos meta tags SEO optimisés en 2 minutes. Title, description, Open Graph, Twitter Card. Prêt à copier-coller dans votre site web. Sans inscription — FumaOPS.",
      },
      {
        name: "keywords",
        content:
          "générateur meta tags seo gratuit, créer meta description site web, meta title seo, balises meta seo, open graph generator, meta tags html gratuit, optimiser seo site web, meta description optimisée, balises seo site web, générer title seo, meta tags 2025, référencement naturel balises",
      },
      { property: "og:title", content: "Générateur Meta Tags SEO Gratuit | FumaOPS" },
      {
        property: "og:description",
        content:
          "Créez vos balises SEO optimisées en 2 minutes. Title, description, Open Graph. Gratuit et sans inscription.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "fr" },
    ],
  }),
  component: MetaTagsGeneratorPage,
});

function MetaTagsGeneratorPage() {
  const [siteName, setSiteName] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [pageLanguage, setPageLanguage] = useState("fr");
  const [pageType, setPageType] = useState("Accueil");

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");

  const [twitterCardType, setTwitterCardType] = useState("summary_large_image");
  const [twitterHandle, setTwitterHandle] = useState("");

  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Score logic
  const calculateScore = () => {
    let score = 0;
    if (seoTitle.length >= 30 && seoTitle.length <= 60) score += 20;
    else if (seoTitle.length > 0) score += 10;

    if (seoDescription.length >= 70 && seoDescription.length <= 160) score += 20;
    else if (seoDescription.length > 0) score += 10;

    if (seoKeywords.trim().length > 0) score += 15;
    if (pageUrl.trim().length > 0) score += 15;

    const actualOgTitle = ogTitle || seoTitle;
    const actualOgDesc = ogDescription || seoDescription;
    if (actualOgTitle && actualOgDesc && ogImage) score += 15;

    if (twitterHandle.trim().length > 0 || twitterCardType) score += 15;

    return Math.min(100, score);
  };

  const score = calculateScore();

  useEffect(() => {
    const appSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Générateur de Meta Tags SEO",
      description:
        "Générez gratuitement vos balises meta SEO optimisées pour Google, Facebook et Twitter",
      url: "https://fumaops.com/outils/generateur-meta-tags-seo",
      applicationCategory: "SEOApplication",
      inLanguage: "fr",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: {
        "@type": "Organization",
        name: "FumaOPS",
        url: "https://fumaops.com",
      },
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment créer des meta tags SEO gratuitement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Utilisez notre générateur gratuit. Remplissez le formulaire avec le titre, la description et l'URL de votre page. Le code HTML est généré instantanément, prêt à copier-coller dans votre site.",
          },
        },
        {
          "@type": "Question",
          name: "Quelle longueur pour un bon meta title ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Entre 50 et 60 caractères. En dessous, vous perdez de l'espace pour vos mots-clés. Au-dessus, Google coupe le titre dans les résultats. Notre outil affiche un indicateur en temps réel.",
          },
        },
        {
          "@type": "Question",
          name: "Les meta keywords sont-ils encore utiles en 2025 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non. Google ignore les meta keywords depuis 2009. Concentrez-vous sur le title, la description et le contenu de vos pages. Ce sont eux qui impactent réellement votre référencement.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il des meta tags différents pour chaque page ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, absolument. Chaque page doit avoir un title et une description uniques qui décrivent précisément son contenu. Dupliquer les mêmes meta tags sur plusieurs pages est une erreur SEO fréquente.",
          },
        },
      ],
    };

    const scriptApp = document.createElement("script");
    scriptApp.type = "application/ld+json";
    scriptApp.text = JSON.stringify(appSchema);
    document.head.appendChild(scriptApp);

    const scriptFAQ = document.createElement("script");
    scriptFAQ.type = "application/ld+json";
    scriptFAQ.text = JSON.stringify(faqSchema);
    document.head.appendChild(scriptFAQ);

    return () => {
      document.head.removeChild(scriptApp);
      document.head.removeChild(scriptFAQ);
    };
  }, []);

  const getTitleColor = (len: number) => {
    if (len === 0) return "bg-white/20";
    if (len < 30 || len > 60) return "bg-red-500";
    if (len >= 50 && len <= 60) return "bg-green-500";
    return "bg-orange-500";
  };

  const getDescColor = (len: number) => {
    if (len === 0) return "bg-white/20";
    if (len < 70 || len > 160) return "bg-red-500";
    if (len >= 120 && len <= 160) return "bg-green-500";
    return "bg-orange-500";
  };

  const generateHtml = () => {
    const actOgTitle = ogTitle || seoTitle || "[titre saisi]";
    const actOgDesc = ogDescription || seoDescription || "[description saisie]";
    const actUrl = pageUrl || "[url saisie]";
    const actType = pageType === "Article de blog" ? "article" : "website";

    return `<!-- SEO de base -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${seoTitle || "[titre saisi]"}</title>
<meta name="description" content="${seoDescription || "[description saisie]"}">
<meta name="keywords" content="${seoKeywords || "[mots-clés saisis]"}">
<meta name="robots" content="index, follow">
<meta name="language" content="${pageLanguage}">
<link rel="canonical" href="${actUrl}">

<!-- Open Graph -->
<meta property="og:title" content="${actOgTitle}">
<meta property="og:description" content="${actOgDesc}">
<meta property="og:url" content="${actUrl}">
<meta property="og:type" content="${actType}">
${ogImage ? `<meta property="og:image" content="${ogImage}">` : `<meta property="og:image" content="[image url]">`}
${siteName ? `<meta property="og:site_name" content="${siteName}">` : `<meta property="og:site_name" content="[nom du site]">`}

<!-- Twitter Card -->
<meta name="twitter:card" content="${twitterCardType}">
<meta name="twitter:title" content="${actOgTitle}">
<meta name="twitter:description" content="${actOgDesc}">
${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : `<meta name="twitter:image" content="[image url]">`}
${twitterHandle ? `<meta name="twitter:site" content="${twitterHandle}">` : `<meta name="twitter:site" content="[compte twitter]">`}`;
  };

  const codeHtml = generateHtml();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meta-tags.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 sm:px-6 pt-12 sm:pt-20 pb-20 animate-fade-in relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight gradient-text glow-primary">
          Générateur de Meta Tags SEO Gratuit
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">
          Créez vos balises SEO optimisées pour Google, Facebook et Twitter en 2 minutes. Résultat
          prêt à copier-coller dans votre site. Sans inscription.
        </p>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10 text-left items-start">
          {/* L'OUTIL FORMULAIRE */}
          <div className="space-y-8">
            {/* SECTION A */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--electric)]" /> SECTION A — INFORMATIONS DE
                BASE
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Nom du site web *
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="ex: FumaOPS"
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    URL de la page *
                  </label>
                  <input
                    type="url"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    placeholder="ex: https://fumaops.com"
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Langue de la page
                  </label>
                  <div className="relative">
                    <select
                      value={pageLanguage}
                      onChange={(e) => setPageLanguage(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-[oklch(0.14_0.06_280)] px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                    >
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                      <option value="ar">Arabe</option>
                      <option value="es">Espagnol</option>
                      <option value="">Autre</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Type de page</label>
                  <div className="relative">
                    <select
                      value={pageType}
                      onChange={(e) => setPageType(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-[oklch(0.14_0.06_280)] px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                    >
                      <option value="Accueil">Accueil</option>
                      <option value="Article de blog">Article de blog</option>
                      <option value="Page produit">Page produit</option>
                      <option value="Page service">Page service</option>
                      <option value="Page contact">Page contact</option>
                      <option value="Autre">Autre</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Search className="h-5 w-5 text-[var(--electric)]" /> SECTION B — SEO GOOGLE
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium opacity-80">
                      Titre de la page (Title) *
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {seoTitle.length} caractères
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Titre principal pour Google"
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors mb-2"
                  />
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${getTitleColor(seoTitle.length)}`}
                      style={{ width: `${Math.min(100, (seoTitle.length / 60) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Idéal : entre 50 et 60 caractères</p>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium opacity-80">
                      Meta Description *
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {seoDescription.length} caractères
                    </span>
                  </div>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Description accrocheuse pour inciter au clic"
                    rows={3}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors mb-2 resize-none"
                  />
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${getDescColor(seoDescription.length)}`}
                      style={{ width: `${Math.min(100, (seoDescription.length / 160) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Idéal : entre 120 et 160 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Mots-clés principaux (séparés par virgules)
                  </label>
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="ex: site web, agence web, création site"
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* SECTION C */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[var(--electric)]" /> SECTION C — OPEN GRAPH
                (Réseaux sociaux)
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Titre Open Graph
                  </label>
                  <input
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder={seoTitle || "Même chose que le Title par défaut"}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Description Open Graph
                  </label>
                  <textarea
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    placeholder={seoDescription || "Même chose que la Meta Description par défaut"}
                    rows={2}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    URL de l'image de partage
                  </label>
                  <input
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="ex: https://fumaops.com/image-partage.jpg"
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors mb-1.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Conseil : Taille recommandée : 1200x630px
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION D */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Twitter className="h-5 w-5 text-blue-400" /> SECTION D — TWITTER CARD
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Type de carte</label>
                  <div className="relative">
                    <select
                      value={twitterCardType}
                      onChange={(e) => setTwitterCardType(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-[oklch(0.14_0.06_280)] px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                    >
                      <option value="summary_large_image">summary_large_image</option>
                      <option value="summary">summary</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">
                    Compte Twitter (optionnel)
                  </label>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="ex: @fumaops"
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--electric)] px-10 text-lg font-bold text-black transition-all hover:scale-[1.02] hover:bg-[var(--neon)]"
              >
                Générer mes Meta Tags
              </button>
            </div>
          </div>

          {/* SIDEBAR PREVIEW & RESULTS */}
          <div className="space-y-8 sticky top-24">
            {/* SCORE SEO */}
            <div className="glass p-6 rounded-3xl border border-white/10 text-center">
              <h3 className="font-bold text-lg mb-4">SCORE SEO</h3>
              <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={score >= 80 ? "#22c55e" : score >= 50 ? "#f97316" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * score) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">{score}</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <p className="text-sm opacity-80">
                {score === 100
                  ? "Parfait ! Vos meta tags sont optimisés."
                  : score >= 80
                    ? "Très bien, mais peut encore être amélioré."
                    : "Complétez les champs pour améliorer votre score."}
              </p>
            </div>

            {/* PREVIEW GOOGLE */}
            <div className="glass p-5 rounded-2xl border border-white/10 bg-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-black leading-tight">
                    {siteName || "fumaops.com"}
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">
                    {pageUrl || "https://fumaops.com"}
                  </div>
                </div>
              </div>
              <h4 className="text-xl text-[#1a0dab] font-medium leading-snug mb-1 truncate hover:underline cursor-pointer">
                {seoTitle || "[Titre de la page — max 60 car]"}
              </h4>
              <p className="text-sm text-[#4d5156] leading-snug line-clamp-2">
                {seoDescription || "[Meta description — max 160 car]"}
              </p>
            </div>

            {/* PREVIEW SOCIAL */}
            <div className="border border-[#ced0d4] rounded-lg overflow-hidden bg-white text-left">
              <div className="w-full aspect-[1200/630] bg-[#e4e6eb] flex items-center justify-center relative overflow-hidden">
                {ogImage ? (
                  <img
                    src={ogImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="p-3 bg-[#f2f3f5] border-t border-[#ced0d4]">
                <div className="text-xs text-[#65676b] uppercase truncate mb-1">
                  {siteName?.toUpperCase() || "FUMAOPS.COM"}
                </div>
                <div className="text-[#050505] font-semibold text-base leading-tight mb-1 line-clamp-1">
                  {ogTitle || seoTitle || "[Titre Open Graph]"}
                </div>
                <div className="text-[#65676b] text-sm line-clamp-1">
                  {ogDescription || seoDescription || "[Description Open Graph]"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CODE OUTPUT */}
        <div className="mt-16 bg-black/50 border border-white/10 p-6 sm:p-8 rounded-3xl text-left relative group">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="Copier le code"
            >
              {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="Télécharger HTML"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <h3 className="font-bold text-lg mb-4 text-white">Code généré :</h3>
          <pre className="overflow-x-auto text-sm font-mono text-gray-300">
            <code>{codeHtml}</code>
          </pre>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleCopy}
              className="inline-flex h-12 items-center gap-2 justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-6 text-base font-medium text-white transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              📋 Copier tout le code
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex h-12 items-center gap-2 justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-6 text-base font-medium text-white transition-all"
            >
              <Download className="h-4 w-4" />
              ⬇️ Télécharger en .html
            </button>
          </div>
        </div>

        {/* DEFINITIONS accordion */}
        <div className="mt-24 text-left max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 border-b border-white/10 pb-4">
            Comprendre les balises Meta SEO
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Qu'est-ce qu'une balise meta ?",
                a: "Une balise meta est un code HTML placé dans le <head> de votre page web. Elle est invisible pour les visiteurs mais essentielle pour Google et les réseaux sociaux. Elle communique les informations clés de votre page : titre, description, langue, image de partage.",
              },
              {
                q: "Pourquoi le meta title est-il si important ?",
                a: "Le meta title est le titre affiché dans les résultats Google. C'est le premier élément que voient les internautes avant de cliquer. Un bon titre entre 50 et 60 caractères contenant votre mot-clé principal peut augmenter significativement votre taux de clics.",
              },
              {
                q: "À quoi sert la meta description ?",
                a: "La meta description est le texte affiché sous le titre dans Google. Elle n'influence pas directement votre position mais impacte votre taux de clics. Entre 120 et 160 caractères, elle doit donner envie à l'internaute de visiter votre page.",
              },
              {
                q: "C'est quoi l'Open Graph ?",
                a: "L'Open Graph est un protocole créé par Facebook qui définit comment votre page s'affiche quand elle est partagée sur les réseaux sociaux (Facebook, LinkedIn, WhatsApp). Sans Open Graph, le partage de votre lien apparaît sans image ni mise en forme soignée.",
              },
              {
                q: "Où placer les meta tags dans mon site ?",
                a: "Tous les meta tags doivent être placés entre les balises <head> et </head> de chaque page de votre site web. Ils doivent être uniques pour chaque page — n'utilisez jamais le même title et la même description partout.",
              },
              {
                q: "Meta tags et SEO : quel impact réel ?",
                a: "Les meta tags sont la base du référencement. Sans eux, Google ne comprend pas clairement le contenu de vos pages. Une page avec des meta tags bien optimisés se positionne plus facilement et génère plus de clics dans les résultats de recherche.",
              },
            ].map((faq, i) => (
              <div key={i} className="glass rounded-xl border border-white/10 overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 font-bold text-lg flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/5"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${expandedFaq === i ? "rotate-90" : ""}`}
                  />
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${expandedFaq === i ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-white/80 leading-relaxed pt-2 border-t border-white/10">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-24 pt-16 border-t border-white/10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Vos meta tags sont prêts — et votre site web ?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex h-14 items-center justify-center rounded-full gradient-primary px-8 text-base font-bold text-white transition-all hover:scale-[1.02] glow"
            >
              Créer mon site web avec FumaOPS
            </Link>
          </div>
          <div className="mt-8">
            <Link
              to="/outils"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              ← Voir tous nos outils gratuits
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
