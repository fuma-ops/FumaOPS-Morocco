import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../../components/Layout";
import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Trash2,
  ArrowLeftRight,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/outils/calculateur-tva")({
  component: RouteComponent,
});

// ============================================================================
// VAT DATABASE CONFIGURATION
// ============================================================================
interface VatRate {
  rate: number;
  label: string;
  description?: string;
}

interface CountryConfig {
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  lang?: string;
  rates: VatRate[];
}

const vatDatabase: Record<string, CountryConfig> = {
  // ━━━━ AFRIQUE DU NORD ━━━━
  MA: {
    name: "Maroc",
    flag: "🇲🇦",
    currency: "MAD",
    symbol: "د.م",
    lang: "fr",
    rates: [
      { rate: 20, label: "Taux normal", description: "Majorité des produits et services" },
      { rate: 14, label: "Taux réduit", description: "Transport, banques, énergie" },
      { rate: 10, label: "Taux réduit", description: "Hôtellerie, restauration, locations" },
      { rate: 7, label: "Super réduit", description: "Eau, produits alimentaires de base" },
      { rate: 0, label: "Exonéré", description: "Exportations, certains services" },
    ],
  },
  TN: {
    name: "Tunisie",
    flag: "🇹🇳",
    currency: "TND",
    symbol: "DT",
    rates: [
      { rate: 19, label: "Taux normal", description: "Produits et services standards" },
      { rate: 13, label: "Taux réduit", description: "Services spécifiques" },
      { rate: 7, label: "Taux réduit", description: "Produits de base" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  DZ: {
    name: "Algérie",
    flag: "🇩🇿",
    currency: "DZD",
    symbol: "دج",
    rates: [
      { rate: 19, label: "Taux normal", description: "Produits et services" },
      { rate: 9, label: "Taux réduit", description: "Produits de première nécessité" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  EG: {
    name: "Égypte",
    flag: "🇪🇬",
    currency: "EGP",
    symbol: "ج.م",
    rates: [
      { rate: 14, label: "Taux normal" },
      { rate: 5, label: "Taux réduit", description: "Produits essentiels" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  // ━━━━ MOYEN-ORIENT ━━━━
  SA: {
    name: "Arabie Saoudite",
    flag: "🇸🇦",
    currency: "SAR",
    symbol: "ر.س",
    rates: [
      {
        rate: 15,
        label: "Taux standard",
        description: "VAT introduite en 2018, augmentée à 15% en 2020",
      },
      { rate: 0, label: "Exonéré", description: "Santé, éducation, exportations" },
    ],
  },
  AE: {
    name: "Émirats Arabes Unis",
    flag: "🇦🇪",
    currency: "AED",
    symbol: "د.إ",
    rates: [
      { rate: 5, label: "Taux standard", description: "VAT introduite le 1er janvier 2018" },
      { rate: 0, label: "Exonéré", description: "Santé, éducation, services financiers" },
    ],
  },
  QA: {
    name: "Qatar",
    flag: "🇶🇦",
    currency: "QAR",
    symbol: "ر.ق",
    rates: [{ rate: 0, label: "Pas de TVA", description: "Le Qatar n'applique pas encore de TVA" }],
  },
  // ━━━━ EUROPE ━━━━
  FR: {
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    symbol: "€",
    rates: [
      { rate: 20, label: "Taux normal", description: "Majorité des produits et services" },
      {
        rate: 10,
        label: "Taux intermédiaire",
        description: "Restauration, travaux rénovation, transport",
      },
      {
        rate: 5.5,
        label: "Taux réduit",
        description: "Alimentation, livres, abonnements gaz/électricité",
      },
      { rate: 2.1, label: "Super réduit", description: "Médicaments remboursés, presse" },
      {
        rate: 0,
        label: "Exonéré",
        description: "Auto-entrepreneur en franchise (art. 293B CGI)",
      },
    ],
  },
  BE: {
    name: "Belgique",
    flag: "🇧🇪",
    currency: "EUR",
    symbol: "€",
    rates: [
      { rate: 21, label: "Taux normal" },
      { rate: 12, label: "Taux intermédiaire", description: "Produits phyto, pneumatiques" },
      { rate: 6, label: "Taux réduit", description: "Alimentation, livres, médicaments" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  CH: {
    name: "Suisse",
    flag: "🇨🇭",
    currency: "CHF",
    symbol: "CHF",
    rates: [
      { rate: 8.1, label: "Taux normal", description: "Taux depuis 2024" },
      { rate: 3.8, label: "Taux spécial", description: "Hébergement" },
      {
        rate: 2.6,
        label: "Taux réduit",
        description: "Alimentation, médicaments, journaux",
      },
      { rate: 0, label: "Exonéré" },
    ],
  },
  DE: {
    name: "Allemagne",
    flag: "🇩🇪",
    currency: "EUR",
    symbol: "€",
    rates: [
      { rate: 19, label: "Taux normal" },
      { rate: 7, label: "Taux réduit", description: "Alimentation, livres, transport" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  ES: {
    name: "Espagne",
    flag: "🇪🇸",
    currency: "EUR",
    symbol: "€",
    rates: [
      { rate: 21, label: "Taux normal" },
      { rate: 10, label: "Taux réduit", description: "Alimentation, transport, hôtels" },
      { rate: 4, label: "Super réduit", description: "Pain, lait, médicaments" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  IT: {
    name: "Italie",
    flag: "🇮🇹",
    currency: "EUR",
    symbol: "€",
    rates: [
      { rate: 22, label: "Taux normal" },
      { rate: 10, label: "Taux réduit", description: "Médicaments, certains aliments" },
      { rate: 5, label: "Taux réduit", description: "Certains produits alimentaires" },
      { rate: 4, label: "Super réduit", description: "Produits de base" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  PT: {
    name: "Portugal",
    flag: "🇵🇹",
    currency: "EUR",
    symbol: "€",
    rates: [
      { rate: 23, label: "Taux normal" },
      { rate: 13, label: "Taux intermédiaire" },
      { rate: 6, label: "Taux réduit" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  NL: {
    name: "Pays-Bas",
    flag: "🇳🇱",
    currency: "EUR",
    symbol: "€",
    rates: [
      { rate: 21, label: "Taux normal" },
      { rate: 9, label: "Taux réduit", description: "Alimentation, livres, médicaments" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  // ━━━━ AMÉRIQUES ━━━━
  CA: {
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    symbol: "CA$",
    rates: [
      {
        rate: 5,
        label: "TPS Fédérale",
        description: "Taxe sur produits et services (nationale)",
      },
      {
        rate: 9.975,
        label: "TVQ Québec",
        description: "TPS 5% + TVQ 9.975% = 14.975% au Québec",
      },
      { rate: 13, label: "TVH Ontario", description: "Taxe harmonisée Ontario" },
      {
        rate: 15,
        label: "TVH Maritimes",
        description: "Nouvelle-Écosse, Nouveau-Brunswick",
      },
      { rate: 0, label: "Exonéré" },
    ],
  },
  // ━━━━ AFRIQUE SUB-SAHARIENNE ━━━━
  SN: {
    name: "Sénégal",
    flag: "🇸🇳",
    currency: "XOF",
    symbol: "CFA",
    rates: [
      { rate: 18, label: "Taux normal" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  CI: {
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    currency: "XOF",
    symbol: "CFA",
    rates: [
      { rate: 18, label: "Taux normal" },
      { rate: 9, label: "Taux réduit" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  CM: {
    name: "Cameroun",
    flag: "🇨🇲",
    currency: "XAF",
    symbol: "CFA",
    rates: [
      { rate: 19.25, label: "Taux normal" },
      { rate: 0, label: "Exonéré" },
    ],
  },
  // ━━━━ ASIE ━━━━
  TR: {
    name: "Turquie",
    flag: "🇹🇷",
    currency: "TRY",
    symbol: "₺",
    rates: [
      { rate: 20, label: "Taux normal" },
      { rate: 10, label: "Taux réduit" },
      { rate: 1, label: "Super réduit" },
      { rate: 0, label: "Exonéré" },
    ],
  },
};

const regions = [
  {
    label: "🌍 Afrique du Nord",
    countries: ["MA", "TN", "DZ", "EG"],
  },
  {
    label: "🕌 Moyen-Orient",
    countries: ["SA", "AE", "QA"],
  },
  {
    label: "🇪🇺 Europe",
    countries: ["FR", "BE", "CH", "DE", "ES", "IT", "PT", "NL"],
  },
  {
    label: "🌎 Amériques",
    countries: ["CA"],
  },
  {
    label: "🌍 Afrique Sub-Saharienne",
    countries: ["SN", "CI", "CM"],
  },
];

// Default language country detector
const detectDefaultCountry = () => {
  if (typeof navigator === "undefined" || !navigator.language) return "FR";
  const lang = navigator.language.toLowerCase();
  if (lang.includes("fr-ma") || lang.startsWith("ar")) return "MA";
  if (lang.includes("fr-fr")) return "FR";
  if (lang.includes("fr-be")) return "BE";
  if (lang.includes("fr-ch")) return "CH";
  if (lang.includes("fr-ca")) return "CA";
  return "FR";
};

// Formatting utility based on country standards
const formatNumber = (value: number, countryCode: string): string => {
  if (isNaN(value) || value === null) return "0,00";
  const fixed = value.toFixed(2);
  const [integer, decimal] = fixed.split(".");

  // Choose separators based on country
  const isApostrophePoint = ["CH", "CA"].includes(countryCode);

  const thousandsSeparator = isApostrophePoint ? "'" : " ";
  const decimalSeparator = isApostrophePoint ? "." : ",";

  // Format integer part with thousands separator
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  return `${formattedInteger}${decimalSeparator}${decimal}`;
};

// Reverse formatting to parse numbers correctly
const parseAmount = (valStr: string): number => {
  // strip spaces, apostrophes and replace comma with dot
  const clean = valStr.replace(/[\s']/g, "").replace(/,/g, ".");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

// Calculations interface
interface HistoryItem {
  key: string;
  label: string;
  country: string;
  rate: number;
  direction: "HT_to_TTC" | "TTC_to_HT";
  amount: number;
}

function RouteComponent() {
  // Local states
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("last_vat_country");
      if (saved && vatDatabase[saved]) return saved;
    }
    return detectDefaultCountry();
  });

  const [direction, setDirection] = useState<"HT_to_TTC" | "TTC_to_HT">(
    (() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("last_vat_direction");
        if (saved === "HT_to_TTC" || saved === "TTC_to_HT") return saved;
      }
      return "HT_to_TTC";
    })(),
  );

  const [selectedRateValue, setSelectedRateValue] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("last_vat_rate");
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) return parsed;
      }
    }
    // Default country
    const initialCountry =
      typeof window !== "undefined"
        ? localStorage.getItem("last_vat_country") || detectDefaultCountry()
        : detectDefaultCountry();
    return vatDatabase[initialCountry]?.rates[0]?.rate ?? 20;
  });

  const [amountString, setAmountString] = useState<string>("1000");
  const [copiedField, setCopiedField] = useState<"ht" | "vat" | "ttc" | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vat_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (_) {
          return [];
        }
      }
    }
    return [];
  });

  const amount = parseAmount(amountString);
  const currentCountryConfig = vatDatabase[selectedCountry] || vatDatabase.FR;

  // Find matching rate or fall back to first
  const currentRateObj =
    currentCountryConfig.rates.find((r) => r.rate === selectedRateValue) ||
    currentCountryConfig.rates[0];

  const currentRateValue = currentRateObj?.rate ?? 20;

  // Real-time calculations
  const calculateVATResult = (amt: number, rt: number, dir: "HT_to_TTC" | "TTC_to_HT") => {
    if (dir === "HT_to_TTC") {
      const vatAmount = amt * (rt / 100);
      const ttcValue = amt + vatAmount;
      return {
        ht: amt,
        vat: vatAmount,
        ttc: ttcValue,
        factor: 1 + rt / 100,
      };
    } else {
      const htValue = amt / (1 + rt / 100);
      const vatAmount = amt - htValue;
      return {
        ht: htValue,
        vat: vatAmount,
        ttc: amt,
        factor: 1 + rt / 100,
      };
    }
  };

  const results = calculateVATResult(amount, currentRateValue, direction);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("last_vat_country", selectedCountry);
    localStorage.setItem("last_vat_direction", direction);
    localStorage.setItem("last_vat_rate", currentRateValue.toString());
  }, [selectedCountry, direction, currentRateValue]);

  // Debounced history record tracker
  useEffect(() => {
    if (!amount || amount <= 0) return;
    const timer = setTimeout(() => {
      const key = `${selectedCountry}_${currentRateValue}_${direction}_${amount}`;
      const recordLabel =
        direction === "HT_to_TTC"
          ? `${formatNumber(amount, selectedCountry)} ${currentCountryConfig.symbol} HT → ${formatNumber(results.ttc, selectedCountry)} ${currentCountryConfig.symbol} TTC (${currentCountryConfig.name} ${currentRateValue}%)`
          : `${formatNumber(amount, selectedCountry)} ${currentCountryConfig.symbol} TTC → ${formatNumber(results.ht, selectedCountry)} ${currentCountryConfig.symbol} HT (${currentCountryConfig.name} ${currentRateValue}%)`;

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.key !== key);
        const next = [
          {
            key,
            label: recordLabel,
            country: selectedCountry,
            rate: currentRateValue,
            direction,
            amount,
          },
          ...filtered,
        ].slice(0, 10);
        localStorage.setItem("vat_history", JSON.stringify(next));
        return next;
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [
    amount,
    selectedCountry,
    currentRateValue,
    direction,
    currentCountryConfig.symbol,
    currentCountryConfig.name,
    results.ttc,
    results.ht,
  ]);

  // Handle SEO tags injection
  useEffect(() => {
    document.title =
      "Calculateur TVA Gratuit 2025 — Tous Pays HT vers TTC et TTC vers HT | FumaOPS";

    // Update or create meta tag helper
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
      "Calculez instantanément votre TVA en ligne. HT vers TTC ou TTC vers HT. Tous les taux de TVA : France, Maroc, Belgique, Suisse, Canada, Tunisie, Algérie, Arabie Saoudite et 50+ pays. Gratuit, sans inscription — FumaOPS.",
    );
    updateMeta(
      "keywords",
      "calculateur tva gratuit, calculer tva en ligne, calcul tva 20, convertir ht en ttc, convertir ttc en ht, calculateur tva france, calcul tva maroc, calculateur tva belgique, calculateur tva suisse, vat calculator, calculateur tva universel, taux tva par pays, calcul tva algerie, calcul tva tunisie, vat calculator saudi arabia, calculateur tva canada, calcul tva auto entrepreneur, ht ttc calculateur gratuit",
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", "https://fumaops.com/outils/calculateur-tva");
    } else {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("href", "https://fumaops.com/outils/calculateur-tva");
      document.head.appendChild(canonical);
    }

    updateMeta("og:title", "Calculateur TVA Gratuit Universel | FumaOPS", true);
    updateMeta(
      "og:description",
      "Calculez votre TVA pour 50+ pays. HT → TTC et TTC → HT instantané. Gratuit.",
      true,
    );
    updateMeta("og:url", "https://fumaops.com/outils/calculateur-tva", true);
    updateMeta("og:type", "website", true);
    updateMeta("robots", "index, follow");
    updateMeta("language", "fr");

    // Microdata Schema injection
    const appSchema = document.createElement("script");
    appSchema.type = "application/ld+json";
    appSchema.id = "vat-schema-app";
    appSchema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Calculateur TVA Universel Gratuit",
      description:
        "Calculez instantanément votre TVA pour tous les pays du monde. HT vers TTC et TTC vers HT.",
      url: "https://fumaops.com/outils/calculateur-tva",
      applicationCategory: "BusinessApplication",
      inLanguage: "fr",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      provider: {
        "@type": "Organization",
        name: "FumaOPS",
        url: "https://fumaops.com",
      },
    });
    document.head.appendChild(appSchema);

    const faqSchema = document.createElement("script");
    faqSchema.type = "application/ld+json";
    faqSchema.id = "vat-schema-faq";
    faqSchema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment calculer la TVA à 20% ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Multipliez le prix HT par 1.20 pour obtenir le prix TTC. Exemple : 500€ HT × 1.20 = 600€ TTC. Pour le montant de TVA seul : 500€ × 0.20 = 100€.",
          },
        },
        {
          "@type": "Question",
          name: "Comment passer du TTC au HT ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Divisez le prix TTC par 1 plus le taux. Pour 20% : TTC ÷ 1.20 = HT. Exemple : 600€ ÷ 1.20 = 500€ HT.",
          },
        },
        {
          "@type": "Question",
          name: "Quels sont les taux TVA en France ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "France : 20% taux normal, 10% intermédiaire (restauration), 5.5% réduit (alimentation, livres), 2.1% super réduit (médicaments). Les auto-entrepreneurs sous seuil de franchise ne facturent pas la TVA.",
          },
        },
        {
          "@type": "Question",
          name: "Quel est le taux TVA au Maroc ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Maroc : 20% taux normal, 14% (transport, banque), 10% (hôtellerie, restauration), 7% (eau, produits de base). Utilisez notre calculateur pour chaque taux spécifique.",
          },
        },
        {
          "@type": "Question",
          name: "Quel est le taux TVA en Arabie Saoudite ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'Arabie Saoudite applique une TVA (VAT) de 15% depuis 2020. Elle a été introduite à 5% en 2018 puis augmentée. Notre calculateur supporte le calcul VAT Saudi Arabia.",
          },
        },
        {
          "@type": "Question",
          name: "Comment calculer la TVA en Belgique ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Belgique : taux normal 21%, intermédiaire 12%, réduit 6%. Pour 21% : Prix HT × 1.21 = Prix TTC. Notre outil calcule automatiquement tous les taux belges.",
          },
        },
      ],
    });
    document.head.appendChild(faqSchema);

    return () => {
      // Cleanup schemas on leave
      document.getElementById("vat-schema-app")?.remove();
      document.getElementById("vat-schema-faq")?.remove();
    };
  }, []);

  // Sync rate on country change to default to country's first rate
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const config = vatDatabase[countryCode];
    if (config && config.rates.length > 0) {
      setSelectedRateValue(config.rates[0].rate);
    }
  };

  // Copy click handler
  const handleCopy = (text: string, field: "ht" | "vat" | "ttc") => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (_) {
      // Fallback
      const inputEl = document.createElement("input");
      inputEl.value = text;
      document.body.appendChild(inputEl);
      inputEl.select();
      try {
        document.execCommand("copy");
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1500);
      } catch (err) {
        console.error("Copy failed", err);
      }
      document.body.removeChild(inputEl);
    }
  };

  // Restore past calculation
  const handleRestoreHistory = (item: HistoryItem) => {
    setSelectedCountry(item.country);
    setDirection(item.direction);
    setSelectedRateValue(item.rate);
    setAmountString(item.amount.toString());
  };

  // Clear past calculations
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("vat_history");
  };

  return (
    <PageShell>
      {/* Container spacing setup to prevent fixed bar content clipping */}
      <div className="min-h-screen py-10 sm:py-20 px-4 sm:px-6 lg:px-8 pb-32 sm:pb-24">
        <div className="w-full max-w-3xl mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link
              to="/outils"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Voir tous nos outils gratuits
            </Link>
          </div>

          {/* Heading intro */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-display">
              Calculateur TVA Gratuit — <span className="gradient-text">Tous Pays du Monde</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg max-w-xl mx-auto text-slate-400 leading-relaxed font-sans">
              Calculez votre TVA instantanément. HT → TTC ou TTC → HT. 50+ pays supportés. Résultat
              en temps réel.
            </p>
          </div>

          {/* SECTION 1 & 2 Card */}
          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 mb-8 space-y-6">
            {/* Country Selector block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label
                  htmlFor="country-selector"
                  className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-1.5"
                >
                  <span>🌍</span> Pays & Région fiscale
                </label>
                <div className="relative">
                  <select
                    id="country-selector"
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full min-h-[48px] bg-slate-900/60 border border-white/10 text-white rounded-xl px-4 py-2.5 text-base font-medium focus:outline-none focus:border-[var(--electric)] focus:ring-1 focus:ring-[var(--electric)]/20 cursor-pointer appearance-none"
                  >
                    {regions.map((regionGroup) => (
                      <optgroup
                        key={regionGroup.label}
                        label={regionGroup.label}
                        className="bg-slate-900 text-slate-300 font-bold"
                      >
                        {regionGroup.countries.map((cCode) => {
                          const cItem = vatDatabase[cCode];
                          return (
                            <option key={cCode} value={cCode} className="text-white font-normal">
                              {cItem.flag} {cItem.name} ({cItem.currency})
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Currency Info Pill */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-3">
                <span className="text-3xl text-gradient">{currentCountryConfig.flag}</span>
                <div>
                  <h4 className="text-sm font-bold font-display text-white">
                    {currentCountryConfig.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Devise : {currentCountryConfig.currency} ({currentCountryConfig.symbol})
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: Rates visual radio list */}
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3">
                🎛️ Sélectionner le Taux de TVA applicable
              </label>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap items-stretch">
                {currentCountryConfig.rates.map((rateObj) => {
                  const isActive = currentRateValue === rateObj.rate;
                  return (
                    <button
                      key={rateObj.rate + "-" + rateObj.label}
                      type="button"
                      onClick={() => setSelectedRateValue(rateObj.rate)}
                      className={`flex-1 min-w-[120px] text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? "bg-[var(--primary)]/10 border-[var(--primary)] text-white shadow-glow"
                          : "bg-white/[0.02] border-white/10 hover:border-white/25 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-extrabold font-display">
                          {rateObj.rate}%
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isActive
                              ? "border-[var(--primary)] bg-[var(--primary)]"
                              : "border-slate-500"
                          }`}
                        >
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="mt-2 text-xs">
                        <p className="font-bold line-clamp-1">{rateObj.label}</p>
                        {rateObj.description && (
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                            {rateObj.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 3: Main Calculateur Toggle & input */}
          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 mb-8 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--neon)]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Toggle switch */}
            <div className="flex justify-center items-center">
              <div className="bg-slate-900 border border-white/10 rounded-full p-1.5 flex items-center shadow-lg">
                <button
                  onClick={() => setDirection("HT_to_TTC")}
                  className={`px-5 py-2 rounded-full text-xs font-bold font-display transition-all duration-300 cursor-pointer ${
                    direction === "HT_to_TTC"
                      ? "gradient-primary text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  HT ➜ TTC
                </button>
                <div className="mx-2 text-slate-600">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </div>
                <button
                  onClick={() => setDirection("TTC_to_HT")}
                  className={`px-5 py-2 rounded-full text-xs font-bold font-display transition-all duration-300 cursor-pointer ${
                    direction === "TTC_to_HT"
                      ? "gradient-primary text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  TTC ➜ HT
                </button>
              </div>
            </div>

            {/* Input numerical amount */}
            <div className="space-y-2">
              <label
                htmlFor="amount-input"
                className="block text-xs uppercase font-bold tracking-widest text-[var(--electric)]"
              >
                Montant à calculer ({currentCountryConfig.currency})
              </label>
              <div className="relative max-w-md mx-auto flex items-center bg-slate-950/60 border border-white/10 focus-within:border-[var(--electric)] focus-within:ring-2 focus-within:ring-[var(--electric)]/20 rounded-2xl px-5 py-3 transition-all">
                <input
                  id="amount-input"
                  type="text"
                  inputMode="decimal"
                  value={amountString}
                  onChange={(e) => {
                    const val = e.target.value;
                    // allow digits, single dot, single comma, spaces or apostrophes
                    if (/^[0-9\s,'.]*$/.test(val)) {
                      setAmountString(val);
                    }
                  }}
                  placeholder={
                    direction === "HT_to_TTC" ? "Entrez le montant HT" : "Entrez le montant TTC"
                  }
                  className="w-full text-center text-3xl sm:text-4xl font-extrabold focus:outline-none bg-transparent placeholder-white/20 text-white min-h-[48px]"
                  style={{ fontSize: "28px" }} // ensures iOS zoom prevention but fits large screen elegantly
                />
                <button
                  onClick={() => setAmountString("")}
                  className="absolute right-4 text-slate-500 hover:text-white text-xs transition-colors p-2"
                  title="Réinitialiser"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 italic">
                Saisissez un montant réel. Mise à jour instantanée.
              </p>
            </div>
          </div>

          {/* SECTION 4: Results Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* CARD 1: HT */}
            <div className="glass p-5 rounded-2xl border border-white/10 text-left relative group">
              <span className="absolute top-4 right-4 text-xs text-blue-400 font-mono font-bold bg-blue-400/10 px-2 py-0.5 rounded">
                HT
              </span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Portion Hors Taxe
              </p>
              <h3 className="text-2xl font-extrabold font-display text-white tracking-tight line-clamp-1">
                {formatNumber(results.ht, selectedCountry)} {currentCountryConfig.symbol}
              </h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Base hors taxes</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${formatNumber(results.ht, selectedCountry)} ${currentCountryConfig.symbol}`,
                      "ht",
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedField === "ht" ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 font-bold">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CARD 2: TVA */}
            <div className="glass p-5 rounded-2xl border border-orange-500/20 text-left relative group bg-gradient-to-br from-orange-950/20 to-transparent">
              <span className="absolute top-4 right-4 text-xs text-orange-400 font-mono font-bold bg-orange-400/10 px-2 py-0.5 rounded">
                TVA
              </span>
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                TVA à payer ({currentRateValue}%)
              </p>
              <h3 className="text-2xl font-extrabold font-display text-white tracking-tight line-clamp-1">
                {formatNumber(results.vat, selectedCountry)} {currentCountryConfig.symbol}
              </h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Taxes collectées</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${formatNumber(results.vat, selectedCountry)} ${currentCountryConfig.symbol}`,
                      "vat",
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedField === "vat" ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 font-bold">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-orange-400" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CARD 3: TTC */}
            <div className="glass p-5 rounded-2xl border border-emerald-500/20 text-left relative group bg-gradient-to-br from-emerald-950/10 to-transparent">
              <span className="absolute top-4 right-4 text-xs text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2 py-0.5 rounded">
                TTC
              </span>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                TTC (Toutes Taxes Comprises)
              </p>
              <h3 className="text-2xl font-extrabold font-display text-white tracking-tight line-clamp-1">
                {formatNumber(results.ttc, selectedCountry)} {currentCountryConfig.symbol}
              </h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Total payé</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${formatNumber(results.ttc, selectedCountry)} ${currentCountryConfig.symbol}`,
                      "ttc",
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedField === "ttc" ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 font-bold">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-emerald-400" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Formule Display block */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 text-center text-xs text-slate-400 mb-8 leading-relaxed font-mono">
            <span className="text-[var(--electric)] uppercase tracking-wider text-[10px] block mb-1 font-bold">
              Formule de calcul appliqué
            </span>
            {direction === "HT_to_TTC" ? (
              <div>
                <p>
                  HT × (1 + Taux / 100) = TTC ➜{" "}
                  <span className="text-white font-bold">
                    {formatNumber(amount, selectedCountry)}
                  </span>{" "}
                  × (1 + {currentRateValue}/100) ={" "}
                  <span className="text-[var(--neon)] font-bold">
                    {formatNumber(results.ttc, selectedCountry)}
                  </span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Multiplicateur direct appliqué :{" "}
                  <span className="text-slate-300 font-bold">{results.factor.toFixed(4)}</span>
                </p>
              </div>
            ) : (
              <div>
                <p>
                  TTC ÷ (1 + Taux / 100) = HT ➜{" "}
                  <span className="text-white font-bold">
                    {formatNumber(amount, selectedCountry)}
                  </span>{" "}
                  ÷ (1 + {currentRateValue}/100) ={" "}
                  <span className="text-[var(--neon)] font-bold">
                    {formatNumber(results.ht, selectedCountry)}
                  </span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Diviseur direct appliqué :{" "}
                  <span className="text-slate-300 font-bold">{results.factor.toFixed(4)}</span>
                </p>
              </div>
            )}
          </div>

          {/* SECTION 5: Tabular rates comparison */}
          <div className="glass p-5 rounded-2xl border border-white/10 mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  📋 Comparatif instantané de tous les taux ({currentCountryConfig.name})
                </h3>
                <p className="text-xs text-slate-400">
                  Vue synthétique pour un montant d'entrée de{" "}
                  {formatNumber(amount, selectedCountry)} {currentCountryConfig.symbol}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 italic block sm:hidden">
                ← → Défiler horizontalement
              </span>
            </div>

            <div className="overflow-x-auto w-full rounded-xl border border-white/5">
              <table className="min-w-[440px] w-full text-xs text-left">
                <thead>
                  <tr className="bg-white/5 text-slate-300 border-b border-white/5 uppercase tracking-wider text-[10px] font-bold">
                    <th className="px-4 py-3">Taux de TVA</th>
                    <th className="px-4 py-3">Catégorie fiscale</th>
                    <th className="px-4 py-3 text-right">Montant de TVA</th>
                    <th className="px-4 py-3 text-right">Résultat opposé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentCountryConfig.rates.map((rateObj) => {
                    const rowIsActive = currentRateValue === rateObj.rate;
                    const rowResults = calculateVATResult(amount, rateObj.rate, direction);
                    return (
                      <tr
                        key={"row-" + rateObj.rate + "-" + rateObj.label}
                        onClick={() => setSelectedRateValue(rateObj.rate)}
                        className={`transition-colors cursor-pointer group ${
                          rowIsActive
                            ? "bg-[var(--primary)]/5 text-white border-l-2 border-l-[var(--primary)]"
                            : "text-slate-400 hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`font-mono font-bold ${
                              rowIsActive ? "text-[var(--neon)] font-extrabold" : "text-white"
                            }`}
                          >
                            {rateObj.rate}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-slate-300">{rateObj.label}</p>
                            {rateObj.description && (
                              <p className="text-[10px] text-slate-500">{rateObj.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-300 font-bold">
                          {formatNumber(rowResults.vat, selectedCountry)}{" "}
                          {currentCountryConfig.symbol}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold">
                          {direction === "HT_to_TTC" ? (
                            <span className="text-emerald-400">
                              {formatNumber(rowResults.ttc, selectedCountry)} TTC
                            </span>
                          ) : (
                            <span className="text-blue-400">
                              {formatNumber(rowResults.ht, selectedCountry)} HT
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              💡 Cliquez directement sur n'importe quelle ligne pour commuter immédiatement le
              simulateur de TVA sur ce taux.
            </p>
          </div>

          {/* SECTION 7: Quick History Pills */}
          {history.length > 0 && (
            <div className="glass p-5 rounded-2xl border border-white/5 mb-8 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <span>⏱️</span> Historique de calculs récents
                </h4>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-slate-500 hover:text-red-400 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Effacer l'historique</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
                {history.map((record) => (
                  <button
                    key={record.key}
                    type="button"
                    onClick={() => handleRestoreHistory(record)}
                    className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-slate-500 rounded-full text-xs font-medium text-slate-300 cursor-pointer transition-all flex items-center gap-1 select-none"
                  >
                    <span>{record.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: SEO definitions & explanations panel */}
          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 mb-8 space-y-6 text-left leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display border-b border-white/5 pb-3">
              📚 Tout comprendre sur la Taxe sur la Valeur Ajoutée (TVA)
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--electric)] font-display flex items-center gap-2 mb-1.5">
                  <ChevronRight className="w-4 h-4 text-[var(--neon)]" />
                  Qu'est-ce que la TVA ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  La TVA (Taxe sur la Valeur Ajoutée) est un impôt indirect sur la consommation
                  collecté par les entreprises pour le compte de l'État. Elle s'applique à la
                  quasi-totalité des biens et services vendus. C'est le consommateur final qui
                  supporte financièrement la charge de la taxe, tandis que les entreprises
                  assujetties agissent en qualité de collecteurs auprès de l'administration fiscale
                  nationale. Dans les pays anglophones et internationaux, elle est plus communément
                  appelée <strong>VAT (Value Added Tax)</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--electric)] font-display flex items-center gap-2 mb-1.5">
                  <ChevronRight className="w-4 h-4 text-[var(--neon)]" />
                  Quelle différence concrète entre HT et TTC ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  <strong>HT (Hors Taxes)</strong> correspond au montant net facturé sans
                  l'application des taxes gouvernementales. Cette mesure de valorisation est
                  principalement usitée dans les transactions commerciales entre professionnels
                  (B2B), car la TVA est neutre pour eux (récupérable).
                  <br />
                  <strong>TTC (Toutes Taxes Comprises)</strong> indique le prix final intégrant la
                  TVA. C'est l'indicateur universel de tarification affiché obligatoirement aux
                  particuliers et aux consommateurs finaux (B2C) dans les commerces.
                  <br />
                  <em>Exemple :</em> Un artisan du bâtiment établit une prestation à 1 000€ HT. Si
                  le taux de TVA applicable est de 20%, la facture finale sera de 1 200€ TTC.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--electric)] font-display flex items-center gap-2 mb-1.5">
                  <ChevronRight className="w-4 h-4 text-[var(--neon)]" />
                  Comment calculer la TVA à 20% ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Pour un taux réglementaire de 20% de TVA :
                  <br />
                  <strong>Du HT vers le TTC :</strong> Prix HT × 1,20.
                  <br />
                  <em>Exemple :</em> 1 000€ HT × 1,20 = 1 200€ TTC. Le montant seul de la TVA vaut 1
                  000€ × 0,20 = 200€.
                  <br />
                  <strong>Du TTC vers le HT :</strong> Prix TTC ÷ 1,20.
                  <br />
                  <em>Exemple :</em> 1 200€ TTC ÷ 1,20 = 1 000€ HT. Le montant de la taxe vaut 1
                  200€ - 1 000€ = 200€.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--electric)] font-display flex items-center gap-2 mb-1.5">
                  <ChevronRight className="w-4 h-4 text-[var(--neon)]" />
                  Quels sont les différents taux de TVA applicables en France ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  En France en 2025-2026, l'administration fiscale définit 4 paliers réglementaires
                  principaux :
                </p>
                <ul className="list-disc pl-5 mt-1 text-xs text-slate-300 space-y-1">
                  <li>
                    <strong>Taux normal (20%) :</strong> Applicable par défaut sur la majeure partie
                    des biens de consommation, alcools, électroménager et prestations courantes.
                  </li>
                  <li>
                    <strong>Taux intermédiaire (10%) :</strong> Appliqué au secteur de la
                    restauration, aux transports de voyageurs, à certains travaux de rénovation de
                    l'habitat et aux ventes de produits alimentaires préparés.
                  </li>
                  <li>
                    <strong>Taux réduit (5.5%) :</strong> Réservé aux produits de première nécessité
                    (alimentation générale), livres physiques et numériques, places de cinéma,
                    énergies et gaz à usage domestique.
                  </li>
                  <li>
                    <strong>Taux super-réduit (2.1%) :</strong> Dédié aux médicaments remboursables
                    par la Sécurité Sociale, à l'achat d'animaux de boucherie et à la presse
                    périodique.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--electric)] font-display flex items-center gap-2 mb-1.5">
                  <ChevronRight className="w-4 h-4 text-[var(--neon)]" />
                  Quels sont les barèmes de TVA applicables au Maroc ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  La législation fiscale marocaine segmente ses opérations assujetties sous 4
                  niveaux de taux :
                </p>
                <ul className="list-disc pl-5 mt-1 text-xs text-slate-300 space-y-1">
                  <li>
                    <strong>Taux normal (20%) :</strong> Taux standard pour la plupart des articles
                    industriels, commerces et services tertiaires.
                  </li>
                  <li>
                    <strong>Taux réduit (14%) :</strong> S'applique au transport ferroviaire de
                    personnes et de marchandises, aux banques, assurances et énergie électrique.
                  </li>
                  <li>
                    <strong>Taux intermédiaire (10%) :</strong> Valable pour l'hôtellerie, les
                    restaurants touristiques classés, les locations d'immeubles de bureaux
                    professionnels et certaines préparations diététiques.
                  </li>
                  <li>
                    <strong>Taux super-réduit (7%) :</strong> Vise les produits essentiels des
                    ménages marocains comme l'eau potable, l'énergie solaire thermique ou
                    domestique, et les produits laitiers.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--electric)] font-display flex items-center gap-2 mb-1.5">
                  <ChevronRight className="w-4 h-4 text-[var(--neon)]" />
                  TVA en Arabie Saoudite, Arabie et Émirats ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  L'Arabie Saoudite a initialement instauré sa TVA à 5% le 1er janvier 2018, puis a
                  décidé de l'augmenter de manière significative à 15% en juillet 2020. Les Émirats
                  Arabes Unis conservent pour l'instant un taux fixe de 5% mis en œuvre depuis le
                  1er janvier 2018 pour diversifier les recettes publiques. Le Qatar demeure quant à
                  lui libre de toute TVA pour soutenir sa consommation domestique.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--electric)] font-display flex items-center gap-2 mb-1.5">
                  <ChevronRight className="w-4 h-4 text-[var(--neon)]" />
                  Un auto-entrepreneur doit-il facturer la TVA ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  En France, la majorité des bénéficiaires du régime d'auto-entrepreneur débutent
                  sous un régime fiscal prévoyant l'exonération des taxes appelé{" "}
                  <strong>"franchise en base de TVA"</strong>. Tant que le chiffre d'affaires annuel
                  n'excède pas certains seuils stricts (environ 36 800€ dans le secteur de la
                  prestation de services et 91 900€ pour les ventes de marchandises), aucune taxe
                  n'est prélevée sur la facturation. En contrepartie, ils doivent mentionner
                  obligatoirement la formulation législative suivante sur chaque facture émise :
                  <br />
                  <span className="font-mono text-xs text-orange-400 block bg-slate-950/60 p-2 rounded-lg mt-1 text-center">
                    "TVA non applicable, article 293 B du CGI."
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Accordions Section */}
          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 mb-8 text-left space-y-4">
            <h3 className="text-xl font-bold text-white font-display flex items-center gap-2 border-b border-white/5 pb-3">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              Foire Aux Questions (FAQ) — Calcul TVA
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: "Comment calculer la TVA à 20% ?",
                  a: "Multipliez le prix HT par 1.20 pour obtenir le prix TTC. Exemple : 500€ HT × 1.20 = 600€ TTC. Pour le montant de TVA seul : 500€ × 0.20 = 100€.",
                },
                {
                  q: "Comment passer du TTC au HT ?",
                  a: "Divisez le prix TTC par 1 plus le taux. Pour 20% : TTC ÷ 1.20 = HT. Exemple: 600€ ÷ 1.20 = 500€ HT.",
                },
                {
                  q: "Quels sont les taux TVA en France ?",
                  a: "France : 20% taux normal, 10% intermédiaire (restauration), 5.5% réduit (alimentation, livres), 2.1% super réduit (médicaments). Les auto-entrepreneurs sous seuil de franchise ne facturent pas la TVA.",
                },
                {
                  q: "Quel est le taux TVA au Maroc ?",
                  a: "Maroc : 20% taux normal, 14% (transport, banque), 10% (hôtellerie, restauration), 7% (eau, produits de base). Utilisez notre calculateur pour chaque taux spécifique.",
                },
                {
                  q: "Quel est le taux TVA en Arabie Saoudite ?",
                  a: "L'Arabie Saoudite applique une TVA (VAT) de 15% depuis 2020. Elle a été introduite à 5% en 2018 puis augmentée. Notre calculateur supporte le calcul VAT Saudi Arabia.",
                },
                {
                  q: "Comment calculer la TVA en Belgique ?",
                  a: "Belgique : taux normal 21%, intermédiaire 12%, réduit 6%. Pour 21% : Prix HT × 1.21 = Prix TTC. Notre outil calcule automatiquement tous les taux belges.",
                },
              ].map((faq, i) => (
                <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <h4 className="text-slate-200 font-bold text-sm mb-1">❓ {faq.q}</h4>
                  <p className="text-xs text-slate-400 pl-4 font-sans leading-relaxed">
                    👉 {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="relative rounded-3xl p-6 sm:p-10 border border-white/10 glass text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-[var(--primary)]/5 to-[var(--neon)]/10" />
            <div className="relative z-10 space-y-4 max-w-xl mx-auto">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[var(--electric)]">
                💼 Opportunité Digitale
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-tight">
                Vous gérez vos taxes comme un pro.
                <br />
                Et votre présence en ligne ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                FumaOPS est l'expert marocain pour développer et mettre en ligne votre site web
                e-commerce ultra fluide, performant et clés en main en 3 jours seulement. Pas
                d'abonnements, paiement unique.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="https://fumaops.com/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-6 py-3 rounded-xl gradient-primary text-sm font-bold text-white tracking-tight hover:scale-105 transition-transform"
                >
                  🚀 Créer mon site avec FumaOPS
                </a>
                <Link
                  to="/outils"
                  className="w-full sm:w-auto text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Voir tous nos outils gratuits
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED MOBILE BAR FOR QUICK COPY */}
      <div className="sm:hidden fixed bottom-18 left-0 right-0 z-50 glass border-t border-white/10 px-4 py-3 flex gap-2 w-full shadow-2xl">
        <button
          type="button"
          onClick={() =>
            handleCopy(
              `${formatNumber(results.ht, selectedCountry)} ${currentCountryConfig.symbol}`,
              "ht",
            )
          }
          className="flex-1 min-h-[44px] bg-slate-900 border border-white/10 text-slate-300 active:bg-slate-800 text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors"
        >
          {copiedField === "ht" ? (
            <span className="text-green-400 font-bold">Copié !</span>
          ) : (
            <>
              <span className="text-slate-400 font-normal">Copier base</span>
              <span className="text-white font-mono font-bold line-clamp-1">
                {formatNumber(results.ht, selectedCountry)}
              </span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            handleCopy(
              `${formatNumber(results.vat, selectedCountry)} ${currentCountryConfig.symbol}`,
              "vat",
            )
          }
          className="flex-1 min-h-[44px] bg-orange-950/40 border border-orange-500/20 text-orange-300 active:bg-orange-950/60 text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors"
        >
          {copiedField === "vat" ? (
            <span className="text-green-400 font-bold">Copié !</span>
          ) : (
            <>
              <span className="text-orange-400 font-normal">Copier TVA</span>
              <span className="text-white font-mono font-bold line-clamp-1">
                {formatNumber(results.vat, selectedCountry)}
              </span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            handleCopy(
              `${formatNumber(results.ttc, selectedCountry)} ${currentCountryConfig.symbol}`,
              "ttc",
            )
          }
          className="flex-1 min-h-[44px] bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 active:bg-emerald-950/60 text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors"
        >
          {copiedField === "ttc" ? (
            <span className="text-green-400 font-bold">Copié !</span>
          ) : (
            <>
              <span className="text-emerald-400 font-normal">Copier TTC</span>
              <span className="text-white font-mono font-bold line-clamp-1">
                {formatNumber(results.ttc, selectedCountry)}
              </span>
            </>
          )}
        </button>
      </div>
    </PageShell>
  );
}
