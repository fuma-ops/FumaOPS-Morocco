import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Check, Copy, Download, RefreshCw, Palette, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/outils/generateur-palette-couleurs")({
  component: PaletteGeneratorPage,
});

function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    r = 255;
    g = 107;
    b = 0;
  }

  r /= 255;
  g /= 255;
  b /= 255;
  const cmax = Math.max(r, g, b);
  const cmin = Math.min(r, g, b);
  const delta = cmax - cmin;

  let h = 0,
    s = 0,
    l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return [h, +(s * 100).toFixed(1), +(l * 100).toFixed(1)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  let rStr = Math.round((r + m) * 255).toString(16);
  let gStr = Math.round((g + m) * 255).toString(16);
  let bStr = Math.round((b + m) * 255).toString(16);

  if (rStr.length === 1) rStr = "0" + rStr;
  if (gStr.length === 1) gStr = "0" + gStr;
  if (bStr.length === 1) bStr = "0" + bStr;

  return `#${rStr}${gStr}${bStr}`.toUpperCase();
}

function hexToRgb(hex: string): string {
  hex = hex.replace(/^#/, "");
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  return `rgb(${r}, ${g}, ${b})`;
}

type Harmony = "Complémentaire" | "Analogue" | "Triadique" | "Monochromatique" | "Tétradique";
type Ambiance =
  | "Standard"
  | "Professionnel"
  | "Créatif"
  | "Élégant"
  | "Énergique"
  | "Naturel"
  | "Tech";

const harmonies: Harmony[] = [
  "Complémentaire",
  "Analogue",
  "Triadique",
  "Monochromatique",
  "Tétradique",
];
const ambiances: Ambiance[] = [
  "Standard",
  "Professionnel",
  "Créatif",
  "Élégant",
  "Énergique",
  "Naturel",
  "Tech",
];

const generatePalette = (baseHex: string, harmony: Harmony, ambiance: Ambiance) => {
  const [hBase, initialS, initialL] = hexToHsl(baseHex);
  const h = hBase;
  let s = initialS;
  let l = initialL;

  if (ambiance === "Professionnel") {
    s -= 15;
    l += 5;
  } else if (ambiance === "Créatif") {
    s += 15;
  } else if (ambiance === "Élégant") {
    s -= 20;
    l -= 10;
  } else if (ambiance === "Énergique") {
    s += 20;
    l += 10;
  } else if (ambiance === "Naturel") {
    s -= 10;
    l += 5;
  } else if (ambiance === "Tech") {
    s += 10;
    l -= 5;
  }

  const normalizeH = (hue: number) => (hue + 360) % 360;
  const normalizeS = (sat: number) => Math.max(0, Math.min(100, sat));
  const normalizeL = (lig: number) => Math.max(0, Math.min(100, lig));

  s = normalizeS(s);
  l = normalizeL(l);

  let primary = [h, s, l];
  let secondary: number[], accent: number[], light: number[], dark: number[];

  light = [h, normalizeS(s * 0.15), normalizeL(96)];
  dark = [h, normalizeS(s * 0.25), normalizeL(12)];

  if (harmony === "Complémentaire") {
    secondary = [normalizeH(h + 180), s, l];
    accent = [normalizeH(h + 180), normalizeS(s + 20), normalizeL(l - 15)];
  } else if (harmony === "Analogue") {
    secondary = [normalizeH(h - 30), s, l];
    accent = [normalizeH(h + 30), s, l];
  } else if (harmony === "Triadique") {
    secondary = [normalizeH(h + 120), s, l];
    accent = [normalizeH(h + 240), s, l];
  } else if (harmony === "Monochromatique") {
    const m_s = normalizeS(s - 20);
    light = [h, m_s, normalizeL(l + 30)];
    secondary = [h, m_s, normalizeL(l + 15)];
    primary = [h, m_s, l];
    accent = [h, m_s, normalizeL(l - 15)];
    dark = [h, m_s, normalizeL(l - 30)];
  } else if (harmony === "Tétradique") {
    secondary = [normalizeH(h + 90), s, l];
    accent = [normalizeH(h + 180), s, l];
    dark = [normalizeH(h + 270), normalizeS(s * 0.8), normalizeL(15)];
  } else {
    secondary = [normalizeH(h + 180), s, l];
    accent = [normalizeH(h + 180), normalizeS(s + 20), normalizeL(l - 15)];
  }

  return {
    primary: hslToHex(primary[0], primary[1], primary[2]),
    secondary: hslToHex(secondary[0], secondary[1], secondary[2]),
    accent: hslToHex(accent[0], accent[1], accent[2]),
    light: hslToHex(light[0], light[1], light[2]),
    dark: hslToHex(dark[0], dark[1], dark[2]),
  };
};

function PaletteGeneratorPage() {
  const [baseColor, setBaseColor] = useState("#FF6B00");
  const [harmony, setHarmony] = useState<Harmony>("Complémentaire");
  const [ambiance, setAmbiance] = useState<Ambiance>("Standard");

  const [palette, setPalette] = useState(() =>
    generatePalette("#FF6B00", "Complémentaire", "Standard"),
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Générateur de Palette de Couleurs Gratuit pour Site Web 2025 | FumaOPS";
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        if (isProperty) meta.setAttribute("property", name);
        else meta.setAttribute("name", name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };
    const updateLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (link) {
        link.setAttribute("href", href);
      } else {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        link.setAttribute("href", href);
        document.head.appendChild(link);
      }
    };

    updateMeta(
      "description",
      "Créez gratuitement votre palette de couleurs pour site web, logo ou marque en quelques secondes. Export CSS, HEX, RGB instantané. Outil 100% gratuit sans inscription — FumaOPS.",
    );
    updateMeta(
      "keywords",
      "générateur palette couleurs gratuit, palette de couleurs site web, choisir couleurs site web, palette couleurs marque, générateur couleurs css, palette couleurs logo, combinaison couleurs site internet, palette couleurs professionnelle, outil couleurs webdesign, choisir palette couleurs entreprise, couleurs harmonieuses site web, palette couleurs 2025",
    );
    updateMeta("robots", "index, follow");
    updateMeta("language", "fr");
    updateMeta("og:title", "Générateur de Palette de Couleurs Gratuit | FumaOPS", true);
    updateMeta(
      "og:description",
      "Créez votre palette de couleurs pour site web ou marque en quelques secondes. Export CSS/HEX/RGB gratuit.",
      true,
    );
    updateMeta("og:type", "website", true);
    updateLink("canonical", "https://fumaops.com/outils/generateur-palette-couleurs");

    const appSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Générateur de Palette de Couleurs",
      description:
        "Créez gratuitement des palettes de couleurs harmonieuses pour site web, logo et branding",
      url: "https://fumaops.com/outils/generateur-palette-couleurs",
      applicationCategory: "DesignApplication",
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
          name: "Comment créer une palette de couleurs pour son site web ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Choisissez votre couleur principale, sélectionnez un type d'harmonie (complémentaire, analogue, triadique) et notre générateur crée automatiquement une palette harmonieuse avec export CSS inclus. Gratuit et sans inscription.",
          },
        },
        {
          "@type": "Question",
          name: "Combien de couleurs dans une palette de site web ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Idéalement 3 à 5 couleurs : une couleur primaire, une secondaire, une couleur d'accent pour les boutons, une couleur de fond et une pour le texte. Trop de couleurs nuit à la lisibilité du site.",
          },
        },
        {
          "@type": "Question",
          name: "Comment utiliser les codes couleurs CSS sur son site ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Exportez votre palette en CSS variables depuis notre outil. Copiez le fichier dans votre code. Utilisez ensuite var(--color-primary) dans votre CSS pour appliquer vos couleurs partout sur votre site.",
          },
        },
        {
          "@type": "Question",
          name: "Quelle est la différence entre HEX et RGB ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "HEX (#FF6B00) et RGB (255, 107, 0) représentent la même couleur dans deux formats différents. HEX est plus courant en webdesign. RGB est utilisé quand on veut ajouter de la transparence avec rgba().",
          },
        },
        {
          "@type": "Question",
          name: "Quelles couleurs choisir pour un site professionnel ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pour un site professionnel, privilegiez 2-3 couleurs maximum. Le bleu inspire confiance, le vert la croissance, le noir l'élégance. Utilisez notre générateur pour tester différentes combinaisons et visualiser le rendu en direct.",
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

  const handleGenerate = () => {
    setPalette(generatePalette(baseColor, harmony, ambiance));
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseColor, harmony, ambiance]);

  const handleRandomize = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase();
    setBaseColor(randomColor);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const exportCSS = () => {
    const css = `:root {
  --color-primary: ${palette.primary};
  --color-secondary: ${palette.secondary};
  --color-accent: ${palette.accent};
  --color-light: ${palette.light};
  --color-dark: ${palette.dark};
}`;
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  const colors = [
    { key: "primary", label: "Primary", hex: palette.primary, cssVar: "--color-primary" },
    { key: "secondary", label: "Secondary", hex: palette.secondary, cssVar: "--color-secondary" },
    { key: "accent", label: "Accent", hex: palette.accent, cssVar: "--color-accent" },
    { key: "light", label: "Light", hex: palette.light, cssVar: "--color-light" },
    { key: "dark", label: "Dark", hex: palette.dark, cssVar: "--color-dark" },
  ];

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-5 sm:px-6 pt-12 sm:pt-20 pb-20 animate-fade-in relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight gradient-text glow-primary">
          Générateur de Palette de Couleurs Gratuit
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          Créez une palette harmonieuse pour votre site web, votre logo ou votre marque. Résultat
          instantané, export CSS inclus.
        </p>

        <div className="glass p-6 sm:p-10 rounded-3xl border border-white/10 text-left mb-16">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium mb-3 opacity-80">
                Couleur principale
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                  className="w-16 h-12 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                  className="flex-1 appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--electric)] transition-colors uppercase font-mono"
                  placeholder="#FF6B00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 opacity-80">Harmonie</label>
              <div className="relative">
                <select
                  value={harmony}
                  onChange={(e) => setHarmony(e.target.value as Harmony)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[oklch(0.14_0.06_280)] px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                >
                  {harmonies.map((h) => (
                    <option key={h} value={h} className="bg-[oklch(0.14_0.06_280)] text-white">
                      {h}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 opacity-80">
                Ambiance (Optionnel)
              </label>
              <div className="relative">
                <select
                  value={ambiance}
                  onChange={(e) => setAmbiance(e.target.value as Ambiance)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[oklch(0.14_0.06_280)] px-4 py-3 pr-10 text-white outline-none focus:border-[var(--electric)] transition-colors cursor-pointer"
                >
                  {ambiances.map((a) => (
                    <option key={a} value={a} className="bg-[oklch(0.14_0.06_280)] text-white">
                      {a}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleGenerate}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--electric)] px-8 text-base font-bold text-black transition-all hover:scale-[1.02] hover:bg-[var(--neon)]"
            >
              Générer ma palette
            </button>
            <button
              onClick={handleRandomize}
              className="inline-flex h-12 items-center gap-2 justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-6 text-base font-medium text-white transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Régénérer
            </button>
            <button
              onClick={exportCSS}
              className="inline-flex h-12 items-center gap-2 justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-6 text-base font-medium text-white transition-all"
            >
              <Download className="h-4 w-4" />
              Exporter en CSS
            </button>
          </div>
        </div>

        {/* RESULTS: CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {colors.map((c) => (
            <div
              key={c.key}
              className="glass rounded-3xl overflow-hidden border border-white/10 flex flex-col"
            >
              <div
                className="h-32 w-full cursor-pointer relative group flex items-center justify-center transition-colors"
                style={{ backgroundColor: c.hex }}
                onClick={() => copyToClipboard(c.hex, c.key)}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-2">
                  {copiedKey === c.key ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedKey === c.key ? "Copié !" : "Copier"}
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2 text-left bg-[oklch(0.14_0.06_280)]">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </span>
                <div
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => copyToClipboard(c.hex, c.key + "_hex")}
                >
                  <span className="font-mono text-sm uppercase">{c.hex}</span>
                  {copiedKey === c.key + "_hex" ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                  )}
                </div>
                <div
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => copyToClipboard(hexToRgb(c.hex), c.key + "_rgb")}
                >
                  <span className="font-mono text-xs text-muted-foreground">{hexToRgb(c.hex)}</span>
                  {copiedKey === c.key + "_rgb" ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                  )}
                </div>
                <div
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => copyToClipboard(`${c.cssVar}: ${c.hex};`, c.key + "_css")}
                >
                  <span className="font-mono text-xs text-[var(--electric)]">{c.cssVar}</span>
                  {copiedKey === c.key + "_css" ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 text-[var(--electric)]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LIVE PREVIEW */}
        <div className="glass p-8 rounded-3xl border border-white/10 mb-20 text-left max-w-3xl mx-auto shadow-2xl overflow-hidden relative">
          <h3 className="text-xl font-bold mb-6 opacity-80 border-b border-white/10 pb-4">
            Aperçu en temps réel
          </h3>

          <div
            className="rounded-2xl overflow-hidden border border-white/20"
            style={{ backgroundColor: palette.light, color: palette.dark }}
          >
            <header
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: palette.primary, color: palette.light }}
            >
              <div className="font-bold flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Mon Site Web
              </div>
              <nav className="hidden sm:flex gap-4 text-sm font-medium opacity-90">
                <span>Accueil</span>
                <span>Services</span>
                <span>Contact</span>
              </nav>
            </header>
            <main className="p-8 sm:p-12 text-center">
              <h2
                className="text-3xl sm:text-4xl font-black mb-4 tracking-tight"
                style={{ color: palette.primary }}
              >
                Boostez votre créativité
              </h2>
              <p className="max-w-xl mx-auto mb-8 opacity-80" style={{ color: palette.dark }}>
                Une palette générée harmonieusement appliquée à ce composant afin de vous aider à
                visualiser l'impact de vos couleurs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  className="px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: palette.accent, color: palette.light }}
                >
                  Commencer maintenant
                </button>
                <button
                  className="px-8 py-3 rounded-full font-bold border-2 transition-colors hover:bg-black/5"
                  style={{ borderColor: palette.primary, color: palette.primary }}
                >
                  En savoir plus
                </button>
              </div>
            </main>
            <div className="p-8 grid sm:grid-cols-3 gap-6 bg-black/5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl shadow-sm"
                  style={{ backgroundColor: palette.light }}
                >
                  <div
                    className="w-10 h-10 rounded-full mb-4 flex items-center justify-center opacity-80"
                    style={{ backgroundColor: palette.secondary, color: palette.light }}
                  >
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold mb-2" style={{ color: palette.primary }}>
                    Avantage {i}
                  </h4>
                  <p className="text-sm opacity-80" style={{ color: palette.dark }}>
                    Démonstration de l'utilisation de couleurs secondaires et des contrastes.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT & FAQ */}
        <div className="text-left space-y-12 max-w-3xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-4">
              Tout savoir sur les palettes de couleurs
            </h2>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--electric)]">
                Qu'est-ce qu'une palette de couleurs ?
              </h3>
              <p className="text-white/80 leading-relaxed">
                Une palette de couleurs est un ensemble de teintes choisies pour fonctionner
                ensemble de façon harmonieuse. En webdesign, elle définit l'identité visuelle d'un
                site : couleur principale, secondaire, accent, fond et texte. Une bonne palette
                renforce la crédibilité de votre marque et améliore l'expérience de vos visiteurs.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--electric)]">
                Comment choisir les couleurs de son site web ?
              </h3>
              <p className="text-white/80 leading-relaxed">
                Commencez par choisir une couleur principale qui reflète votre activité. Utilisez
                ensuite la roue chromatique pour générer des couleurs harmonieuses. Règle des
                60-30-10 : 60% couleur dominante (fond), 30% secondaire (sections), 10% accent
                (boutons, liens). Évitez plus de 3 couleurs principales pour garder un design
                lisible.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--electric)]">
                Quelles couleurs pour quel secteur ?
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-white/80 marker:text-[var(--electric)]">
                <li>
                  <strong className="text-white">Bleu :</strong> technologie, finance, santé —
                  inspire confiance
                </li>
                <li>
                  <strong className="text-white">Vert :</strong> nature, bio, bien-être — inspire
                  calme
                </li>
                <li>
                  <strong className="text-white">Orange :</strong> énergie, créativité, e-commerce —
                  attire l'attention
                </li>
                <li>
                  <strong className="text-white">Noir/blanc :</strong> luxe, mode, design — inspire
                  élégance
                </li>
                <li>
                  <strong className="text-white">Rouge :</strong> urgence, food, promotions — crée
                  l'émotion
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--electric)]">C'est quoi le code HEX ?</h3>
              <p className="text-white/80 leading-relaxed">
                Le code HEX (hexadécimal) est le code couleur utilisé en webdesign et CSS. Il
                commence par # suivi de 6 chiffres et lettres (ex: #FF6B00 pour l'orange). C'est le
                format standard pour définir les couleurs dans le code de votre site web.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--electric)]">C'est quoi le code RGB ?</h3>
              <p className="text-white/80 leading-relaxed">
                Le RGB (Red, Green, Blue) exprime une couleur par 3 valeurs de 0 à 255. Exemple :
                rgb(255, 107, 0) correspond à l'orange. Utilisé en CSS et dans les outils de design
                comme Figma ou Canva.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--electric)]">
                Pourquoi exporter en CSS ?
              </h3>
              <p className="text-white/80 leading-relaxed">
                L'export CSS variables (:root) vous permet d'intégrer votre palette directement dans
                le code de votre site web. Vous définissez vos couleurs une seule fois et vous les
                réutilisez partout. Si vous changez de couleur, modifiez-la en un seul endroit et
                tout votre site s'adapte.
              </p>
            </div>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-20 pt-16 border-t border-white/10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Votre palette est prête — et votre site web ?
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
              className="text-sm text-muted-foreground hover:text-white transition-colors"
            >
              ← Voir tous nos outils gratuits
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
