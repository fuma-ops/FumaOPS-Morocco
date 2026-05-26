import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
  Printer,
  RotateCcw,
  Trash2,
  Plus,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  Check,
  FileText,
  Eye,
  X,
} from "lucide-react";

export const Route = createFileRoute("/outils/generateur-facture")({
  component: FactureGeneratorPage,
});

interface ProductLine {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  tva: number;
}

interface InvoiceHistoryEntry {
  numero: string;
  client: string;
  montant: number;
  date: string;
  data: {
    entrepriseNom: string;
    entrepriseAdresse: string;
    entrepriseCPVille: string;
    entreprisePays: string;
    entrepriseEmail: string;
    entrepriseTelephone: string;
    entrepriseSiret: string;
    entrepriseTva: string;
    entrepriseLogo: string;
    clientNom: string;
    clientAdresse: string;
    clientCPVille: string;
    clientPays: string;
    clientEmail: string;
    dateEmission: string;
    dateEcheance: string;
    factureDevise: string;
    produits: ProductLine[];
    remisePercent: number;
    acompte: number;
    conditionsPaiement: string;
    modesPaiement: string[];
    ibanRib: string;
    notes: string;
    primaryColor: string;
    factureModele: "cute" | "minimaliste" | "pro" | "moderne" | "classique";
  };
}

function FactureGeneratorPage() {
  const [openBloc1, setOpenBloc1] = useState(true);
  const [openBloc2, setOpenBloc2] = useState(true);
  const [openBloc3, setOpenBloc3] = useState(true);
  const [openBloc4, setOpenBloc4] = useState(true);
  const [openBloc5, setOpenBloc5] = useState(false);
  const [openBloc6, setOpenBloc6] = useState(false);

  // Logo upload state
  const [entrepriseLogo, setEntrepriseLogo] = useState(
    () => localStorage.getItem("f_ent_logo") || "",
  );

  // Company Profile states
  const [entrepriseNom, setEntrepriseNom] = useState(() => localStorage.getItem("f_ent_nom") || "");
  const [entrepriseAdresse, setEntrepriseAdresse] = useState(
    () => localStorage.getItem("f_ent_adr") || "",
  );
  const [entrepriseCPVille, setEntrepriseCPVille] = useState(
    () => localStorage.getItem("f_ent_cpville") || "",
  );
  const [entreprisePays, setEntreprisePays] = useState(
    () => localStorage.getItem("f_ent_pays") || "France",
  );
  const [entrepriseEmail, setEntrepriseEmail] = useState(
    () => localStorage.getItem("f_ent_email") || "",
  );
  const [entrepriseTelephone, setEntrepriseTelephone] = useState(
    () => localStorage.getItem("f_ent_tel") || "",
  );
  const [entrepriseSiret, setEntrepriseSiret] = useState(
    () => localStorage.getItem("f_ent_siret") || "",
  );
  const [entrepriseTva, setEntrepriseTva] = useState(() => localStorage.getItem("f_ent_tva") || "");

  // Client states
  const [clientNom, setClientNom] = useState("");
  const [clientAdresse, setClientAdresse] = useState("");
  const [clientCPVille, setClientCPVille] = useState("");
  const [clientPays, setClientPays] = useState("France");
  const [clientEmail, setClientEmail] = useState("");

  // Invoice Details
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [nextSequence, setNextSequence] = useState(() => {
    const stored = localStorage.getItem("f_invoice_next_seq");
    return stored ? parseInt(stored, 10) : 1;
  });

  const getNextInvoiceNum = (seqVal: number) => {
    return `FAC-2025-${String(seqVal).padStart(3, "0")}`;
  };

  const [factureNumero, setFactureNumero] = useState("");
  useEffect(() => {
    if (!factureNumero) {
      setFactureNumero(getNextInvoiceNum(nextSequence));
    }
  }, [nextSequence, factureNumero]);

  const [dateEmission, setDateEmission] = useState(getTodayDateStr());
  const [dateEcheance, setDateEcheance] = useState("");
  const [factureDevise, setFactureDevise] = useState("EUR €");

  // Items / Products
  const [produits, setProduits] = useState<ProductLine[]>([
    {
      id: "1",
      description: "",
      quantite: 1,
      prixUnitaire: 0,
      tva: 20,
    },
  ]);

  const handleAddLine = () => {
    setProduits([
      ...produits,
      {
        id: Date.now().toString(),
        description: "",
        quantite: 1,
        prixUnitaire: 0,
        tva: 20,
      },
    ]);
  };

  const handleRemoveLine = (id: string) => {
    if (produits.length > 1) {
      setProduits(produits.filter((p) => p.id !== id));
    } else {
      setProduits([
        {
          id: Date.now().toString(),
          description: "",
          quantite: 1,
          prixUnitaire: 0,
          tva: 20,
        },
      ]);
    }
  };

  const handleEditLine = (id: string, field: keyof ProductLine, val: string | number) => {
    setProduits(
      produits.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: val };
        }
        return p;
      }),
    );
  };

  // Complementary & Customizations
  const [conditionsPaiement, setConditionsPaiement] = useState("30 jours");
  const [modesPaiement, setModesPaiement] = useState<string[]>([]);
  const [ibanRib, setIbanRib] = useState("");
  const [notes, setNotes] = useState("");

  const [primaryColor, setPrimaryColor] = useState("#FF6B00");
  const [factureModele, setFactureModele] = useState<"cute" | "minimaliste" | "pro">("cute");

  const [remisePercent, setRemisePercent] = useState<number>(0);
  const [acompte, setAcompte] = useState<number>(0);

  // History & Persistence
  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistoryEntry[]>(() => {
    const stored = localStorage.getItem("fuma_invoice_history");
    return stored ? JSON.parse(stored) : [];
  });

  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  const t = (key: string) => {
    const translations: Record<string, { fr: string; en: string }> = {
      facture: { fr: "FACTURE", en: "INVOICE" },
      dateEmission: { fr: "DATE ÉMISSION", en: "ISSUE DATE" },
      client: { fr: "CLIENT", en: "CLIENT" },
      // Add more as needed based on the UI
    };
    return translations[key]?.[lang] || key;
  };

  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarScale, setSidebarScale] = useState(0.48);

  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = useState(0.44);

  const inlineMobileContainerRef = useRef<HTMLDivElement>(null);
  const [inlineMobileScale, setInlineMobileScale] = useState(0.44);

  // Resize listener for sidebar on desktop/tablet/laptop
  useEffect(() => {
    if (!sidebarContainerRef.current) return;
    const calculateScale = () => {
      const rect = sidebarContainerRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        const newScale = (rect.width - 24) / 794;
        setSidebarScale(Math.max(0.15, Math.min(1.2, newScale)));
      }
    };
    calculateScale();
    const observer = new ResizeObserver(() => calculateScale());
    if (sidebarContainerRef.current) {
      observer.observe(sidebarContainerRef.current);
    }
    window.addEventListener("resize", calculateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculateScale);
    };
  }, []);

  // Resize listener for inline mobile preview
  useEffect(() => {
    if (!inlineMobileContainerRef.current) return;
    const calculateScale = () => {
      const rect = inlineMobileContainerRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        const newScale = (rect.width - 24) / 794;
        setInlineMobileScale(Math.max(0.15, Math.min(1.0, newScale)));
      }
    };
    calculateScale();
    const timer = setTimeout(calculateScale, 100);
    const observer = new ResizeObserver(() => calculateScale());
    if (inlineMobileContainerRef.current) {
      observer.observe(inlineMobileContainerRef.current);
    }
    window.addEventListener("resize", calculateScale);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", calculateScale);
    };
  }, []);

  // Resize listener for mobile preview modal
  useEffect(() => {
    if (!mobilePreviewOpen || !mobileContainerRef.current) return;
    const calculateScale = () => {
      const rect = mobileContainerRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        const newScale = (rect.width - 24) / 794;
        setMobileScale(Math.max(0.15, Math.min(1.0, newScale)));
      }
    };
    const timer = setTimeout(calculateScale, 100);
    const observer = new ResizeObserver(() => calculateScale());
    if (mobileContainerRef.current) {
      observer.observe(mobileContainerRef.current);
    }
    window.addEventListener("resize", calculateScale);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", calculateScale);
    };
  }, [mobilePreviewOpen]);

  // Save company profile automatically to local storage
  useEffect(() => {
    localStorage.setItem("f_ent_nom", entrepriseNom || "");
    localStorage.setItem("f_ent_adr", entrepriseAdresse || "");
    localStorage.setItem("f_ent_cpville", entrepriseCPVille || "");
    localStorage.setItem("f_ent_pays", entreprisePays || "France");
    localStorage.setItem("f_ent_email", entrepriseEmail || "");
    localStorage.setItem("f_ent_tel", entrepriseTelephone || "");
    localStorage.setItem("f_ent_siret", entrepriseSiret || "");
    localStorage.setItem("f_ent_tva", entrepriseTva || "");
    localStorage.setItem("f_ent_logo", entrepriseLogo || "");
  }, [
    entrepriseNom,
    entrepriseAdresse,
    entrepriseCPVille,
    entreprisePays,
    entrepriseEmail,
    entrepriseTelephone,
    entrepriseSiret,
    entrepriseTva,
    entrepriseLogo,
  ]);

  // SEO & external scripts loading
  useEffect(() => {
    document.title = "Générateur de Facture Gratuit en Ligne 2025 — PDF Instantané | FumaOPS";

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Créez votre facture professionnelle gratuitement en ligne. Export PDF immédiat, calcul TVA automatique, sans inscription. Idéal pour freelances, auto-entrepreneurs et PME. FumaOPS — outil 100% gratuit.",
    );

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "générateur facture gratuit, créer facture en ligne gratuit, modèle facture pdf gratuit, facture auto entrepreneur gratuit, faire une facture gratuitement, générateur facture pdf, facture freelance gratuite, modèle facture sans tva, créer facture téléchargement immédiat, facture professionnelle gratuite, outil facturation gratuit en ligne, modèle facture maroc gratuit",
    );

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://fumaops.com/outils/generateur-facture");

    // Robots meta
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", "index, follow");

    // Language
    let metaLang = document.querySelector('meta[name="language"]');
    if (!metaLang) {
      metaLang = document.createElement("meta");
      metaLang.setAttribute("name", "language");
      document.head.appendChild(metaLang);
    }
    metaLang.setAttribute("content", "fr");

    // Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", "Générateur de Facture Gratuit — PDF Instantané | FumaOPS");

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute(
      "content",
      "Créez votre facture pro en 2 minutes. Export PDF immédiat. Gratuit, sans inscription.",
    );

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement("meta");
      ogType.setAttribute("property", "og:type");
      document.head.appendChild(ogType);
    }
    ogType.setAttribute("content", "website");

    // Structured WebApplication JSON-LD
    let scriptApp = document.getElementById("structured-invoice-app");
    if (!scriptApp) {
      scriptApp = document.createElement("script");
      scriptApp.setAttribute("type", "application/ld+json");
      scriptApp.setAttribute("id", "structured-invoice-app");
      document.head.appendChild(scriptApp);
    }
    scriptApp.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Générateur de Facture Gratuit",
      description: "Créez et téléchargez des factures professionnelles en PDF gratuitement",
      url: "https://fumaops.com/outils/generateur-facture",
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

    // Structured FAQ Page JSON-LD
    let scriptFaq = document.getElementById("structured-invoice-faq");
    if (!scriptFaq) {
      scriptFaq = document.createElement("script");
      scriptFaq.setAttribute("type", "application/ld+json");
      scriptFaq.setAttribute("id", "structured-invoice-faq");
      document.head.appendChild(scriptFaq);
    }
    scriptFaq.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment créer une facture gratuitement en ligne ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Utilisez notre générateur gratuit. Remplissez vos informations, ajoutez vos produits ou services, et téléchargez votre facture en PDF en 2 minutes. Sans inscription, sans limite, sans abonnement.",
          },
        },
        {
          "@type": "Question",
          name: "Puis-je créer une facture sans numéro TVA ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui. Si vous êtes auto-entrepreneur en franchise de TVA, sélectionnez TVA 0% et notre outil ajoute automatiquement la mention légale obligatoire : TVA non applicable, art. 293 B du CGI.",
          },
        },
        {
          "@type": "Question",
          name: "Mes données de facturation sont-elles sauvegardées ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Vos informations sont sauvegardées uniquement sur votre appareil via le stockage local du navigateur. FumaOPS ne collecte ni ne stocke aucune donnée de facturation sur ses serveurs.",
          },
        },
        {
          "@type": "Question",
          name: "Le PDF généré est-il légalement valable ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, si vous renseignez correctement toutes les mentions obligatoires. Notre générateur vous guide pour inclure tous les éléments requis par la loi française et marocaine.",
          },
        },
        {
          "@type": "Question",
          name: "Puis-je créer plusieurs factures gratuitement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, sans limite. Notre générateur est 100% gratuit, sans inscription et sans restriction sur le nombre de factures créées. Vos informations entreprise sont mémorisées pour accélérer les prochaines factures.",
          },
        },
      ],
    });

    // Add CSS stylesheet for Poppins
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Dancing+Script:wght@500;600;700&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // Add html2pdf script
    const scriptUrl = document.createElement("script");
    scriptUrl.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    scriptUrl.async = true;
    document.body.appendChild(scriptUrl);

    return () => {
      fontLink.remove();
      scriptUrl.remove();
    };
  }, []);

  // calculations
  const listCouples = produits.map((p) => {
    const ht = p.quantite * p.prixUnitaire;
    const tvaVal = ht * (p.tva / 100);
    const ttc = ht + tvaVal;
    return { id: p.id, ht, tvaVal, ttc };
  });

  const sousTotalHT = listCouples.reduce((acc, c) => acc + c.ht, 0);
  const remiseMontant = sousTotalHT * (remisePercent / 100);
  const baseTVA = sousTotalHT - remiseMontant;

  const discountFactor = sousTotalHT > 0 ? baseTVA / sousTotalHT : 1;
  const tvaTotale = listCouples.reduce((acc, c) => acc + c.tvaVal * discountFactor, 0);
  const totalTTC = baseTVA + tvaTotale;
  const resteAPayer = totalTTC - acompte;

  const currencySymbol = () => {
    return factureDevise.split(" ")[1] || "€";
  };

  const getCompanyIdLabel = (pays: string) => {
    if (pays === "France") return "SIRET / SIREN";
    if (pays === "Maroc") return "N° RC / ICE";
    return "RC / Tax ID / Registration";
  };

  // Logo file upload handler
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La taille du logo ne doit pas dépasser 2 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setEntrepriseLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setEntrepriseLogo("");
  };

  // Add into local storage history listing
  const saveToHistory = (newEntry: InvoiceHistoryEntry) => {
    setInvoiceHistory((prev) => {
      const filtered = prev.filter((item) => item.numero !== newEntry.numero);
      const updated = [newEntry, ...filtered].slice(0, 10);
      localStorage.setItem("fuma_invoice_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleLoadInvoice = (entry: InvoiceHistoryEntry) => {
    const d = entry.data;
    setEntrepriseNom(d.entrepriseNom || "");
    setEntrepriseAdresse(d.entrepriseAdresse || "");
    setEntrepriseCPVille(d.entrepriseCPVille || "");
    setEntreprisePays(d.entreprisePays || "France");
    setEntrepriseEmail(d.entrepriseEmail || "");
    setEntrepriseTelephone(d.entrepriseTelephone || "");
    setEntrepriseSiret(d.entrepriseSiret || "");
    setEntrepriseTva(d.entrepriseTva || "");
    setEntrepriseLogo(d.entrepriseLogo || "");
    setClientNom(d.clientNom || "");
    setClientAdresse(d.clientAdresse || "");
    setClientCPVille(d.clientCPVille || "");
    setClientPays(d.clientPays || "France");
    setClientEmail(d.clientEmail || "");
    setFactureNumero(entry.numero);
    setDateEmission(d.dateEmission || getTodayDateStr());
    setDateEcheance(d.dateEcheance || "");
    setFactureDevise(d.factureDevise || "EUR €");
    setProduits(d.produits || []);
    setRemisePercent(d.remisePercent || 0);
    setAcompte(d.acompte || 0);
    setConditionsPaiement(d.conditionsPaiement || "30 jours");
    setModesPaiement(d.modesPaiement || []);
    setIbanRib(d.ibanRib || "");
    setNotes(d.notes || "");
    setPrimaryColor(d.primaryColor || "#FF6B00");
    const savedModele = d.factureModele || "pro";
    if (savedModele === "moderne" || savedModele === "classique") {
      setFactureModele(savedModele === "moderne" ? "pro" : "cute");
    } else {
      setFactureModele(savedModele as "cute" | "minimaliste" | "pro");
    }
  };

  const handleDeleteHistoryItem = (numero: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInvoiceHistory((prev) => {
      const updated = prev.filter((item) => item.numero !== numero);
      localStorage.setItem("fuma_invoice_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleNewFacture = () => {
    setClientNom("");
    setClientAdresse("");
    setClientCPVille("");
    setClientPays("France");
    setClientEmail("");
    setDateEmission(getTodayDateStr());
    setDateEcheance("");
    setProduits([
      {
        id: Date.now().toString(),
        description: "",
        quantite: 1,
        prixUnitaire: 0,
        tva: 20,
      },
    ]);
    setRemisePercent(0);
    setAcompte(0);
    setConditionsPaiement("30 jours");
    setModesPaiement([]);
    setIbanRib("");
    setNotes("");
    setFactureNumero(getNextInvoiceNum(nextSequence));
  };

  // html2pdf trigger
  const handleDownloadPDF = () => {
    const element = document.getElementById("invoice-render-pdf");
    if (!element) return;

    // save current invoice to local storage history
    const currentEntry: InvoiceHistoryEntry = {
      numero: factureNumero,
      client: clientNom || "Client Sans Nom",
      montant: totalTTC,
      date: dateEmission,
      data: {
        entrepriseNom,
        entrepriseAdresse,
        entrepriseCPVille,
        entreprisePays,
        entrepriseEmail,
        entrepriseTelephone,
        entrepriseSiret,
        entrepriseTva,
        entrepriseLogo,
        clientNom,
        clientAdresse,
        clientCPVille,
        clientPays,
        clientEmail,
        dateEmission,
        dateEcheance,
        factureDevise,
        produits,
        remisePercent,
        acompte,
        conditionsPaiement,
        modesPaiement,
        ibanRib,
        notes,
        primaryColor,
        factureModele,
      },
    };
    saveToHistory(currentEntry);

    // auto increment if it was matching current sequence
    if (factureNumero === getNextInvoiceNum(nextSequence)) {
      const nextSeq = nextSequence + 1;
      setNextSequence(nextSeq);
      localStorage.setItem("f_invoice_next_seq", nextSeq.toString());
    }

    // @ts-expect-error html2pdf is loaded dynamically from CDN via script tag
    if (window.html2pdf) {
      const options = {
        margin: 0,
        filename: `Facture-${factureNumero}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2.5,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };
      // @ts-expect-error html2pdf is loaded dynamically from CDN via script tag
      window.html2pdf().set(options).from(element).save();
    } else {
      window.print();
    }
  };

  const handlePrintAction = () => {
    window.print();
  };

  const hasFranceTva0 = entreprisePays === "France" && produits.some((p) => p.tva === 0);
  const isMaroc = entreprisePays === "Maroc";

  const getAutoLegalMention = () => {
    if (hasFranceTva0) {
      return "TVA non applicable, art. 293 B du CGI (Franchise en base)";
    }
    if (isMaroc) {
      return "Facture conforme aux dispositions de l'article 145 du Code Général des Impôts (CGI) marocain.";
    }
    return "";
  };

  // COMPONENT RENDER SHEET FOR THE FACTURE
  const InvoiceSheet = () => {
    const isCute = factureModele === "cute";
    const isMinimaliste = factureModele === "minimaliste";
    const isPro = factureModele === "pro";

    return (
      <div
        className="w-[794px] min-h-[1100px] flex flex-col justify-between p-12 bg-white text-slate-850"
        style={{
          fontFamily: isCute
            ? "'Poppins', sans-serif"
            : isPro
              ? "'Montserrat', sans-serif"
              : "'Poppins', sans-serif",
          backgroundColor: isCute ? "#FAF7F2" : "#FFFFFF",
        }}
      >
        <div>
          {/* TOP HEADER */}
          {isCute && (
            <div className="mb-8">
              {/* Logo / Badge */}
              <div className="flex justify-between items-start">
                <div>
                  {entrepriseLogo ? (
                    <img
                      src={entrepriseLogo}
                      alt="Logo"
                      className="max-h-16 max-w-[150px] object-contain mb-3 rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="text-xs font-bold tracking-widest uppercase mb-2 px-3.5 py-1.5 rounded-full inline-block"
                      style={{ backgroundColor: primaryColor + "15", color: primaryColor }}
                    >
                      ✿ {entrepriseNom ? entrepriseNom.substring(0, 3).toUpperCase() : "ECO"}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <h1
                    className="text-4xl font-extrabold tracking-[0.18em] uppercase"
                    style={{ color: primaryColor }}
                  >
                    {t("facture")}
                  </h1>
                </div>
              </div>

              {/* Subtitle brand cursive element */}
              <div className="text-center my-6">
                <h2
                  className="font-['Dancing_Script'] text-5xl font-bold tracking-wide italic leading-normal"
                  style={{ color: primaryColor }}
                >
                  {entrepriseNom || "Audrey Moreau"}
                </h2>
                <p className="text-[10px] tracking-[0.18em] text-slate-500 font-semibold uppercase mt-2">
                  {entrepriseAdresse
                    ? `${entrepriseAdresse} — ${entrepriseCPVille}`
                    : "CRÉATION, ARTISANAT ET CONSEIL D'INTÉRIEUR"}
                </p>
              </div>

              {/* Unique colored pills side-by-side */}
              <div className="flex justify-between items-center my-6 gap-2">
                <div
                  className="px-5 py-2.5 rounded-xl text-white font-extrabold text-[11px] tracking-wider uppercase shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t("facture")} N°{factureNumero}
                </div>
                <div
                  className="px-5 py-2.5 rounded-xl text-white font-extrabold text-[11px] tracking-wider uppercase shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t("dateEmission")}: {dateEmission}
                </div>
              </div>
            </div>
          )}

          {isMinimaliste && (
            <div className="pb-8 mb-8 flex justify-between items-start border-b border-slate-100">
              <div>
                <h1 className="text-5xl font-extrabold tracking-tighter text-slate-950 mb-4">
                  {t("facture")}
                </h1>
                <p className="text-xs font-bold text-slate-900">
                  {entrepriseNom || "Éco-Prestataire S.A.S"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {entrepriseAdresse || "8 Avenue des Créateurs"} |{" "}
                  {entrepriseCPVille || "75001 Paris"} | {entreprisePays}
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                {entrepriseLogo ? (
                  <img
                    src={entrepriseLogo}
                    alt="Logo"
                    className="max-h-14 max-w-[130px] object-contain mb-3 rounded grayscale"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border border-dashed border-slate-300 flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono tracking-wider uppercase mb-2">
                    <span>Logo</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isPro && (
            <div className="border-b pb-6 mb-8 flex justify-between items-start">
              <div className="flex items-center gap-4">
                {entrepriseLogo ? (
                  <img
                    src={entrepriseLogo}
                    alt="Logo"
                    className="max-h-16 max-w-[140px] object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    ■
                  </div>
                )}
                <div>
                  <h2 className="text-md font-black uppercase tracking-wider text-slate-900 leading-tight">
                    {entrepriseNom || "JHON COMPANY"}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">
                    {entrepriseCPVille || "75001 PARIS"} — {entreprisePays}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-black text-slate-900 tracking-wider">FACTURE</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                  DATE ÉMISSION. {dateEmission}
                </p>
              </div>
            </div>
          )}

          {/* SENDER & CLIENT INFORMATION BOXES */}
          {isCute && (
            <div className="grid grid-cols-2 gap-8 mb-8 py-2">
              <div className="text-xs text-slate-600 leading-relaxed bg-[#FAF7F2] p-1">
                <span
                  className="font-bold block border-b pb-1 mb-2 uppercase tracking-widest text-[9px]"
                  style={{ color: primaryColor, borderBottomColor: primaryColor + "25" }}
                >
                  ÉMETTEUR ENTRPRISE
                </span>
                <p className="font-semibold text-slate-800">{entrepriseNom || "Audrey Moreau"}</p>
                {entrepriseEmail && <p>Email : {entrepriseEmail}</p>}
                {entrepriseTelephone && <p>Tél : {entrepriseTelephone}</p>}
                {entrepriseSiret && (
                  <p>
                    {getCompanyIdLabel(entreprisePays)} : {entrepriseSiret}
                  </p>
                )}
                {entrepriseTva && <p>TVA Intracom. : {entrepriseTva}</p>}
              </div>

              <div className="bg-white/60 border border-slate-200/50 p-5 rounded-2xl text-xs leading-relaxed shadow-sm">
                <span className="font-bold text-slate-400 block border-b border-slate-100 pb-1 mb-2 uppercase tracking-widest text-[9px]">
                  FACTURÉ À (CLIENT) :
                </span>
                <p
                  className="font-extrabold text-sm uppercase tracking-wide"
                  style={{ color: primaryColor }}
                >
                  {clientNom || "Henriette Poulain"}
                </p>
                {clientAdresse && <p className="mt-1.5 text-slate-600">{clientAdresse}</p>}
                {clientCPVille && <p className="text-slate-600">{clientCPVille}</p>}
                <p className="text-slate-600">{clientPays}</p>
                {clientEmail && (
                  <p className="mt-1 text-slate-400 italic font-mono text-[11px]">{clientEmail}</p>
                )}
              </div>
            </div>
          )}

          {isMinimaliste && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-8 mb-4">
                <div>
                  <h2 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wide">
                    Vendeur
                  </h2>
                  <p className="text-xs font-bold text-slate-800">
                    {entrepriseNom || "Éco-Prestataire S.A.S"}
                  </p>
                  <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                    {entrepriseAdresse && <p>{entrepriseAdresse}</p>}
                    {entrepriseCPVille && <p>{entrepriseCPVille}</p>}
                    {entreprisePays && <p>{entreprisePays}</p>}
                    {entrepriseEmail && <p>Email: {entrepriseEmail}</p>}
                    {entrepriseTelephone && <p>Tél: {entrepriseTelephone}</p>}
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wide">
                    Client
                  </h2>
                  <p className="text-xs font-bold text-slate-800">{clientNom || "Client Futur"}</p>
                  <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                    {clientAdresse && <p>{clientAdresse}</p>}
                    {clientCPVille && <p>{clientCPVille}</p>}
                    {clientPays && <p>{clientPays}</p>}
                    {clientEmail && <p>Email: {clientEmail}</p>}
                  </div>
                </div>
              </div>

              {/* Minimal Key-Value metadata list (exactly like Image 2) */}
              <div className="grid grid-cols-5 gap-2 border-y border-slate-100 py-3.5 my-6 text-[10.5px]">
                <div>
                  <span className="block font-bold text-slate-900 mb-0.5">Date de facturation</span>
                  <span className="text-slate-600">{dateEmission}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-900 mb-0.5">Numéro de facture</span>
                  <span className="text-slate-600">{factureNumero}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-900 mb-0.5">Échéance</span>
                  <span className="text-slate-600">{dateEcheance || "—"}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-900 mb-0.5">Paiement à</span>
                  <span className="text-slate-600">{conditionsPaiement || "30 jours"}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-900 mb-0.5">Référence</span>
                  <span className="text-slate-600">{factureNumero}</span>
                </div>
              </div>
            </div>
          )}

          {isPro && (
            <div className="my-8">
              <div className="grid grid-cols-2 gap-6">
                <div
                  className="p-5 rounded-xl border"
                  style={{
                    backgroundColor: primaryColor + "05",
                    borderColor: primaryColor + "15",
                  }}
                >
                  <span className="text-[9px] font-extrabold text-slate-400 block mb-2 uppercase tracking-widest">
                    INVOICE TO
                  </span>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                    {clientNom || "JHON DOE"}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-1.5 space-y-0.5 leading-relaxed">
                    {clientAdresse && <p>{clientAdresse}</p>}
                    {clientCPVille && <p>{clientCPVille}</p>}
                    <p>{clientPays}</p>
                    {clientEmail && <p className="mt-1 font-mono text-slate-400">{clientEmail}</p>}
                  </div>
                </div>
                <div
                  className="p-5 rounded-xl border"
                  style={{
                    backgroundColor: primaryColor + "05",
                    borderColor: primaryColor + "15",
                  }}
                >
                  <span className="text-[9px] font-extrabold text-slate-400 block mb-2 uppercase tracking-widest">
                    SENDER PROFILE
                  </span>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                    {entrepriseNom || "JHON COMPANY"}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-1.5 space-y-0.5 leading-relaxed">
                    {entrepriseAdresse && <p>{entrepriseAdresse}</p>}
                    {entrepriseCPVille && <p>{entrepriseCPVille}</p>}
                    {entrepriseEmail && <p>Email: {entrepriseEmail}</p>}
                    {entrepriseTelephone && <p>Tél : {entrepriseTelephone}</p>}
                  </div>
                </div>
              </div>

              {/* Professional horizontal metadata line */}
              <div className="flex justify-between items-center py-3 border-b border-slate-200 text-[11px] mt-4 font-semibold">
                <span className="text-slate-500">
                  ÉCHÉANCE DE PAIEMENT : {dateEcheance || dateEmission}
                </span>
                <span className="text-slate-900 uppercase">
                  RÉFÉRENCE FACTURE : N°{factureNumero}
                </span>
              </div>
            </div>
          )}

          {/* TABLE OF PRODUCTS */}
          <div className="mb-8">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                {isCute && (
                  <tr
                    className="text-white text-[11px] font-extrabold uppercase tracking-widest rounded-lg overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <th className="py-3 px-4 rounded-l-xl">Description</th>
                    <th className="py-3 px-3 text-center w-16">Qté</th>
                    <th className="py-3 px-3 text-right w-28">Prix Unit. HT</th>
                    <th className="py-3 px-3 text-center w-16">TVA</th>
                    <th className="py-3 px-4 text-right w-28 rounded-r-xl">Total TTC</th>
                  </tr>
                )}
                {isMinimaliste && (
                  <tr className="border-y-2 border-slate-950 text-slate-950 font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-1">Description</th>
                    <th className="py-3 px-3 text-center w-16">Qté</th>
                    <th className="py-3 px-3 text-right w-28">Prix Unit. HT</th>
                    <th className="py-3 px-3 text-center w-16">TVA</th>
                    <th className="py-3 px-1 text-right w-28">Total TTC</th>
                  </tr>
                )}
                {isPro && (
                  <tr
                    className="text-slate-900 border-b-2 font-black text-[11px] uppercase tracking-wider"
                    style={{ borderColor: primaryColor }}
                  >
                    <th className="py-3 px-1" style={{ color: primaryColor }}>
                      ITEM DESCRIPTION
                    </th>
                    <th className="py-3 px-3 text-center w-16">QTY</th>
                    <th className="py-3 px-3 text-right w-28">PRICE HT</th>
                    <th className="py-3 px-3 text-center w-16 font-semibold text-slate-400">TVA</th>
                    <th className="py-3 px-1 text-right w-28 text-slate-900">TOTAL TTC</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {produits.map((item, idx) => {
                  const itemHT = item.quantite * item.prixUnitaire;
                  const itemTVA = itemHT * (item.tva / 100);
                  const itemTTC = itemHT + itemTVA;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100"
                      style={
                        isCute && idx % 2 === 1
                          ? { backgroundColor: primaryColor + "06" }
                          : isPro && idx % 2 === 1
                            ? { backgroundColor: "#F9FAFB" }
                            : {}
                      }
                    >
                      <td
                        className={`py-3.5 px-1 font-semibold text-slate-800 ${
                          isCute ? "pl-4" : ""
                        }`}
                      >
                        {item.description || "Service ou produit de qualité"}
                      </td>
                      <td className="py-3.5 px-3 text-center">{item.quantite}</td>
                      <td className="py-3.5 px-3 text-right">
                        {item.prixUnitaire.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500">{item.tva}%</td>
                      <td
                        className={`py-3.5 px-1 text-right font-bold text-slate-900 ${
                          isCute ? "pr-4" : ""
                        }`}
                      >
                        {itemTTC.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* RECAP / SUMMARY TOTALS */}
          {isCute && (
            <div className="flex justify-end mb-8">
              <div className="w-80 bg-white/50 p-5 rounded-2xl border border-slate-200/50 space-y-2 text-xs shadow-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-total HT :</span>
                  <span>
                    {sousTotalHT.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {currencySymbol()}
                  </span>
                </div>
                {remisePercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise ({remisePercent}%) :</span>
                    <span>
                      -
                      {remiseMontant.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {currencySymbol()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>TVA Totale :</span>
                  <span>
                    {tvaTotale.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {currencySymbol()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-black border-t border-slate-100 pt-3 text-slate-900">
                  <span className="text-[10px] tracking-wider text-slate-400 font-bold">
                    NET À PAYER
                  </span>
                  <span className="text-lg font-black" style={{ color: primaryColor }}>
                    {totalTTC.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {currencySymbol()}
                  </span>
                </div>
                {acompte > 0 && (
                  <>
                    <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                      <span>Acompte versé :</span>
                      <span>
                        -
                        {acompte.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold border-t border-slate-100 pt-1.5 text-slate-900">
                      <span>Reste à payer :</span>
                      <span>
                        {resteAPayer.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {isMinimaliste && (
            <div className="flex justify-end mb-8 mt-4">
              <div className="w-64 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Total HT :</span>
                  <span className="font-semibold text-slate-900">
                    {sousTotalHT.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {currencySymbol()}
                  </span>
                </div>
                {remisePercent > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Remise ({remisePercent}%) :</span>
                    <span>
                      -
                      {remiseMontant.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {currencySymbol()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Total TVA :</span>
                  <span className="font-semibold text-slate-900">
                    {tvaTotale.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {currencySymbol()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-900/15 pt-2 font-extrabold text-sm text-slate-950">
                  <span>Total TTC :</span>
                  <span>
                    {totalTTC.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {currencySymbol()}
                  </span>
                </div>
                {acompte > 0 && (
                  <>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Acompte :</span>
                      <span>
                        -
                        {acompte.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-dotted border-slate-400 pt-1.5 text-[11px] font-bold">
                      <span>Reste à payer :</span>
                      <span>
                        {resteAPayer.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {isPro && (
            <div className="flex justify-between items-start my-8">
              {/* Pro Left Panel: terms and bank details */}
              <div className="text-[11px] text-slate-500 space-y-3 max-w-[400px]">
                <div>
                  <h4 className="font-bold text-slate-800 mb-0.5 uppercase tracking-wide text-[10px]">
                    INFO DE DIRECT PAIEMENT
                  </h4>
                  {ibanRib ? (
                    <p className="font-mono text-[10.5px] break-all text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-1 max-w-[340px]">
                      {ibanRib}
                    </p>
                  ) : (
                    <p className="italic text-slate-400">Aucun RIB renseigné</p>
                  )}
                  <p className="text-[10.5px] mt-1.5">
                    Modes : {modesPaiement.join(", ") || "Virement / Versement"}
                  </p>
                </div>
                {notes && (
                  <div>
                    <h4 className="font-bold text-slate-800 mb-0.5 uppercase tracking-wide text-[10px]">
                      TERMES & CONDITIONS :
                    </h4>
                    <p className="italic">"{notes}"</p>
                  </div>
                )}
              </div>

              {/* Pro Right Panel: Subtotals and final large Highlight block for total due (exactly like Image 3) */}
              <div className="w-72 space-y-2 pb-2 text-right">
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Sous-total HT :</span>
                    <span className="font-semibold text-slate-800">
                      {sousTotalHT.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {currencySymbol()}
                    </span>
                  </div>
                  {remisePercent > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Remise ({remisePercent}%) :</span>
                      <span>
                        -
                        {remiseMontant.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>TVA totale :</span>
                    <span className="font-semibold text-slate-800">
                      {tvaTotale.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {currencySymbol()}
                    </span>
                  </div>
                </div>

                {/* Big patterned or shaded frame for Total Due */}
                <div
                  className="p-4 rounded-xl text-white text-left shadow-md flex justify-between items-center mt-3"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider block text-white/80">
                      TOTAL À PAYER
                    </span>
                    <span className="text-md font-black tracking-tight font-mono">
                      {totalTTC.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {currencySymbol()}
                    </span>
                  </div>
                  <span className="text-xl font-light">✓</span>
                </div>

                {acompte > 0 && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    <p>
                      Acompte versé : -{acompte} {currencySymbol()}
                    </p>
                    <p className="font-bold text-slate-800 mt-0.5 text-xs">
                      Reste à charger : {resteAPayer.toLocaleString("fr-FR")} {currencySymbol()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER */}
        <div>
          {/* CUTE STYLE FOOTER BAND */}
          {isCute && (
            <div className="mt-8">
              <div
                className="w-full rounded-2xl p-4 text-center flex flex-col items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              >
                <p className="font-['Dancing_Script'] text-3xl font-bold text-white tracking-widest leading-none py-1">
                  {notes ? notes : "Merci pour votre confiance !"}
                </p>
              </div>

              {/* Automatic legal lines in cute footer */}
              {getAutoLegalMention() && (
                <p className="text-[9px] text-slate-450 italic text-center mt-2 font-mono">
                  {getAutoLegalMention()}
                </p>
              )}
            </div>
          )}

          {/* MINIMAL STYLE FOOTER COLS */}
          {isMinimaliste && (
            <div className="border-t border-slate-200/60 pt-6 mt-12 grid grid-cols-3 gap-6 text-[10px] text-slate-400 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px] mb-1">
                  Mon Entreprise
                </h4>
                <p className="font-bold text-slate-800">
                  {entrepriseNom || "Éco-Prestataire S.A.S"}
                </p>
                {entrepriseSiret && (
                  <p>
                    {getCompanyIdLabel(entreprisePays)} : {entrepriseSiret}
                  </p>
                )}
                {entrepriseTva && <p>TVA : {entrepriseTva}</p>}
                {getAutoLegalMention() && (
                  <p className="italic text-slate-500 mt-1">{getAutoLegalMention()}</p>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px] mb-1">
                  Coordonnées
                </h4>
                {entrepriseEmail && <p>Email: {entrepriseEmail}</p>}
                {entrepriseTelephone && <p>Tél: {entrepriseTelephone}</p>}
                <p>
                  www.
                  {entrepriseNom
                    ? entrepriseNom.toLowerCase().replace(/[^a-z0-9]/g, "")
                    : "monsite"}
                  .com
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px] mb-1">
                  Détails bancaires
                </h4>
                {ibanRib ? (
                  <p className="font-mono break-all text-[9.5px] text-slate-500 leading-normal">
                    {ibanRib}
                  </p>
                ) : (
                  <p className="italic text-slate-300">Aucun RIB renseigné</p>
                )}
                <p className="mt-1 font-semibold text-slate-600">
                  Règlement : {conditionsPaiement} ({modesPaiement.join(", ") || "Transfert"})
                </p>
              </div>
            </div>
          )}

          {/* PRO STYLE FOOTER SIGNATURE & LOGOS */}
          {isPro && (
            <div className="border-t border-slate-100 pt-6 mt-8">
              {/* Account manager signature block EXACTLY like Image 3 */}
              <div className="flex justify-end text-center mb-6">
                <div className="w-56 border-t border-slate-200/80 pt-2.5">
                  <span className="text-[9px] font-black text-slate-400 block uppercase tracking-widest">
                    RESPONSABLE COMPTE
                  </span>
                  <div className="font-['Dancing_Script'] text-2xl text-slate-700 italic my-1.5 leading-none">
                    {entrepriseNom || "John Doe"}
                  </div>
                  <span className="text-[8px] text-slate-450 block tracking-widest font-black uppercase">
                    SIGNATURE VALIDE
                  </span>
                </div>
              </div>

              {/* Metadata bullet line */}
              <div className="text-center text-[10px] text-slate-400 font-medium tracking-wider flex items-center justify-center gap-4 pt-3.5 border-t border-slate-100 uppercase">
                {entrepriseTelephone && <span>TEL : {entrepriseTelephone}</span>}
                {entrepriseEmail && <span>| EMAIL : {entrepriseEmail}</span>}
                <span>| FACTURE OFFICIELLE</span>
              </div>
            </div>
          )}

          {/* BRAND CREDIT FOOTER */}
          <div className="text-center text-[9px] text-slate-350 mt-6 font-light tracking-widest uppercase flex items-center justify-center gap-1">
            <span>Facture sécurisée sur</span>
            <span className="font-bold text-slate-450">fumaops.com</span>
            <span>— 100% Gratuit.</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageShell>
      {/* Dynamic styles to strictly apply responsive CSS rules */}
      <style>{`
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .form-row { grid-template-columns: 1fr 1fr; }
        }
        .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .invoice-table { min-width: 500px; width: 100%; }
        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (min-width: 640px) {
          .btn-group { flex-direction: row; }
        }
        .apercu-desktop {
          display: none;
        }
        @media (min-width: 768px) {
          .apercu-desktop { display: block; }
        }

        /* Responsive invoice preview box and scaling */
        .invoice-preview-box {
          width: 387px;
          height: 542px;
          transition: all 0.2s ease-in-out;
        }
        .invoice-preview-scale {
          transform: scale(0.488);
          transform-origin: top left;
          transition: all 0.2s ease-in-out;
        }
        @media (min-width: 1200px) {
          .invoice-preview-box {
            width: 440px;
            height: 615px;
          }
          .invoice-preview-scale {
            transform: scale(0.554);
          }
        }
        @media (min-width: 1400px) {
          .invoice-preview-box {
            width: 490px;
            height: 685px;
          }
          .invoice-preview-scale {
            transform: scale(0.617);
          }
        }
      `}</style>

      {/* HEADER HERO AREA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14 pb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[10px] tracking-widest uppercase font-semibold text-orange-300">
            Outil de Gestion Offert
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-white mb-0">
            {lang === "fr" ? "Générateur de Facture" : "Invoice Generator"}{" "}
            <span className="gradient-text font-semibold">
              {lang === "fr" ? "Gratuit" : "Free"}
            </span>
          </h1>
          <div className="flex bg-slate-800 rounded-lg p-1 text-xs shrink-0 mx-auto sm:mx-0">
            <button
              onClick={() => setLang("fr")}
              className={`px-3 py-1 rounded ${lang === "fr" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400"}`}
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded ${lang === "en" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400"}`}
            >
              EN
            </button>
          </div>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8">
          {lang === "fr"
            ? "Créez et téléchargez votre facture professionnelle en PDF en 2 minutes. Sans inscription, sans limite de facturation."
            : "Create and download your professional invoice in PDF in 2 minutes. No sign-up, no billing limits."}
        </p>
      </section>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full max-w-7xl grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8">
        {/* FORM SIDE (LEFT) */}
        <div className="space-y-6 min-w-0 w-full">
          {/* MES FACTURES RECENTES SECTION */}
          {invoiceHistory.length > 0 && (
            <div className="glass shadow-2xl rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-orange-400" />
                Mes factures récentes
              </h3>
              <div className="font-mono text-xs text-slate-400 mb-4 bg-orange-500/5 p-2 rounded-lg border border-orange-500/10 flex items-center gap-2">
                <span>💾 Vos données restent sur votre appareil. Nous ne stockons rien.</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {invoiceHistory.map((item) => (
                  <div
                    key={item.numero}
                    onClick={() => handleLoadInvoice(item)}
                    className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 hover:border-orange-500/30 transition-all text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-slate-200">{item.numero}</p>
                      <p className="text-slate-400 truncate">{item.client}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-orange-400">
                        {item.montant.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {item.data.factureDevise.split(" ")[1] || "€"}
                      </span>
                      <button
                        onClick={(e) => handleDeleteHistoryItem(item.numero, e)}
                        className="p-1 rounded-md text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                        title="Supprimer de l'historique"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCORDION 1 — SENDER */}
          <div className="glass shadow-2xl rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setOpenBloc1(!openBloc1)}
              className="w-full px-6 py-4 flex justify-between items-center bg-white/5 border-b border-white/10"
            >
              <span className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs">
                  1
                </span>
                Votre Entreprise
              </span>
              {openBloc1 ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
            {openBloc1 && (
              <div className="p-6 space-y-4">
                {/* Logo add */}
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-xl bg-orange-500/15 border border-orange-500/20 text-xs font-semibold text-orange-300 hover:bg-orange-500/25 cursor-pointer transition-all"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Ajouter votre logo
                    </label>
                  </div>
                  {entrepriseLogo ? (
                    <div className="flex items-center gap-2.5">
                      <div className="h-20 w-20 relative bg-white border border-slate-200 rounded-lg p-1.5 flex items-center justify-center">
                        <img
                          src={entrepriseLogo}
                          alt="Logo miniature"
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white p-0.5 shrink-0 shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground italic">
                        Chargé (80x80px max)
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground italic">
                      Aucun logo sélectionné
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nom / Raison sociale *
                    </label>
                    <input
                      type="text"
                      value={entrepriseNom}
                      onChange={(e) => setEntrepriseNom(e.target.value)}
                      placeholder="e.g. Éco-Prestataire S.A.S"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      value={entrepriseAdresse}
                      onChange={(e) => setEntrepriseAdresse(e.target.value)}
                      placeholder="e.g. 8 Avenue des Créateurs"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Code postal + Ville *
                    </label>
                    <input
                      type="text"
                      value={entrepriseCPVille}
                      onChange={(e) => setEntrepriseCPVille(e.target.value)}
                      placeholder="e.g. 75001 Paris"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Pays *
                    </label>
                    <select
                      value={entreprisePays}
                      onChange={(e) => setEntreprisePays(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-[#121214] border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    >
                      <option value="France">France</option>
                      <option value="Maroc">Maroc</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Canada">Canada</option>
                      <option value="Algérie">Algérie</option>
                      <option value="Tunisie">Tunisie</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={entrepriseEmail}
                      onChange={(e) => setEntrepriseEmail(e.target.value)}
                      placeholder="e.g. contact@entreprise.fr"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      value={entrepriseTelephone}
                      onChange={(e) => setEntrepriseTelephone(e.target.value)}
                      placeholder="e.g. +33 1 23 45 67 89"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {getCompanyIdLabel(entreprisePays)}
                    </label>
                    <input
                      type="text"
                      value={entrepriseSiret}
                      onChange={(e) => setEntrepriseSiret(e.target.value)}
                      placeholder={
                        entreprisePays === "Maroc" ? "N° RC / ICE marocain" : "Siret / Siren"
                      }
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Numéro de TVA intracommunautaire
                    </label>
                    <input
                      type="text"
                      value={entrepriseTva}
                      onChange={(e) => setEntrepriseTva(e.target.value)}
                      placeholder="e.g. FR12345678901"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 2 — CLIENT */}
          <div className="glass shadow-2xl rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setOpenBloc2(!openBloc2)}
              className="w-full px-6 py-4 flex justify-between items-center bg-white/5 border-b border-white/10"
            >
              <span className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs">
                  2
                </span>
                Client Destinataire
              </span>
              {openBloc2 ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
            {openBloc2 && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nom du client / Société *
                  </label>
                  <input
                    type="text"
                    value={clientNom}
                    onChange={(e) => setClientNom(e.target.value)}
                    placeholder="e.g. Client Futur S.A.R.L"
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Adresse client *
                  </label>
                  <input
                    type="text"
                    value={clientAdresse}
                    onChange={(e) => setClientAdresse(e.target.value)}
                    placeholder="e.g. 42 Rue de l'Efficacité"
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="form-row">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Code postal + Ville
                    </label>
                    <input
                      type="text"
                      value={clientCPVille}
                      onChange={(e) => setClientCPVille(e.target.value)}
                      placeholder="e.g. 75002 Paris"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Pays client
                    </label>
                    <select
                      value={clientPays}
                      onChange={(e) => setClientPays(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-[#121214] border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    >
                      <option value="France">France</option>
                      <option value="Maroc">Maroc</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Canada">Canada</option>
                      <option value="Algérie">Algérie</option>
                      <option value="Tunisie">Tunisie</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email client
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. achat@clientfutur.com"
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 3 — INVOICE DETAILS */}
          <div className="glass shadow-2xl rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setOpenBloc3(!openBloc3)}
              className="w-full px-6 py-4 flex justify-between items-center bg-white/5 border-b border-white/10"
            >
              <span className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs">
                  3
                </span>
                Détails de la Facture
              </span>
              {openBloc3 ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
            {openBloc3 && (
              <div className="p-6 space-y-4">
                <div className="form-row">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Numéro de facture *
                    </label>
                    <input
                      type="text"
                      value={factureNumero}
                      onChange={(e) => setFactureNumero(e.target.value)}
                      placeholder="FAC-2025-001"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Date d'émission *
                    </label>
                    <input
                      type="date"
                      value={dateEmission}
                      onChange={(e) => setDateEmission(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Date d'échéance
                    </label>
                    <input
                      type="date"
                      value={dateEcheance}
                      onChange={(e) => setDateEcheance(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Devise (Monnaie d'affichage)
                    </label>
                    <select
                      value={factureDevise}
                      onChange={(e) => setFactureDevise(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-[#121214] border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    >
                      <option value="EUR €">Euro (EUR €)</option>
                      <option value="MAD د.م">Dirham Marocain (MAD د.م)</option>
                      <option value="CHF CHF">Franc Suisse (CHF)</option>
                      <option value="CAD $">Dollar Canadien (CAD $)</option>
                      <option value="USD $">Dollar US (USD $)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 4 — ITEMS / SERVICES TABLE */}
          <div className="glass shadow-2xl rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setOpenBloc4(!openBloc4)}
              className="w-full px-6 py-4 flex justify-between items-center bg-white/5 border-b border-white/10"
            >
              <span className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs">
                  4
                </span>
                Prestations, Produits & Services
              </span>
              {openBloc4 ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
            {openBloc4 && (
              <div className="p-6 space-y-6">
                {/* Horizontal scroll support on mobile */}
                <div className="table-wrapper w-full max-w-full overflow-x-auto">
                  <table className="invoice-table text-left text-xs text-slate-300 gap-y-4 w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/5 font-semibold text-slate-400">
                        <th className="pb-3 pr-2">Description</th>
                        <th className="pb-3 px-2 w-16 text-center">Qté</th>
                        <th className="pb-3 px-2 w-24">Prix Unit HT</th>
                        <th className="pb-3 px-2 w-20">TVA %</th>
                        <th className="pb-3 px-2 w-24 text-right">Total TTC</th>
                        <th className="pb-3 w-10 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {produits.map((p) => {
                        const rowHT = p.quantite * p.prixUnitaire;
                        const rowTTVVal = rowHT * (p.tva / 100);
                        const rowTTC = rowHT + rowTTVVal;

                        return (
                          <tr key={p.id}>
                            <td className="py-3 pr-2">
                              <input
                                type="text"
                                value={p.description}
                                onChange={(e) =>
                                  handleEditLine(p.id, "description", e.target.value)
                                }
                                placeholder="Service de création web, etc."
                                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-xs focus:ring-orange-500 highlight duration-150"
                              />
                            </td>
                            <td className="py-3 px-2 text-center">
                              <input
                                type="number"
                                min="1"
                                value={p.quantite || ""}
                                onChange={(e) =>
                                  handleEditLine(
                                    p.id,
                                    "quantite",
                                    parseInt(e.target.value, 10) || 0,
                                  )
                                }
                                className="w-16 h-10 rounded-lg bg-white/5 border border-white/10 text-center text-slate-100 text-xs outline-none"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="number"
                                step="any"
                                value={p.prixUnitaire || ""}
                                onChange={(e) =>
                                  handleEditLine(
                                    p.id,
                                    "prixUnitaire",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="w-24 h-10 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-xs px-2"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <select
                                value={p.tva}
                                onChange={(e) =>
                                  handleEditLine(p.id, "tva", parseFloat(e.target.value) || 0)
                                }
                                className="w-20 h-10 rounded-lg bg-[#121214] border border-white/10 text-slate-100 text-[11px] px-1"
                              >
                                <option value="0">0%</option>
                                <option value="5.5">5.5%</option>
                                <option value="7">7% (MA)</option>
                                <option value="10">10%</option>
                                <option value="14">14% (MA)</option>
                                <option value="20">20%</option>
                              </select>
                            </td>
                            <td className="py-3 px-2 text-right font-bold text-slate-100">
                              {rowTTC.toLocaleString("fr-FR", {
                                minimumFractionDigits: 2,
                              })}{" "}
                              {currencySymbol()}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleRemoveLine(p.id)}
                                className="p-1 rounded-md text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleAddLine}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une ligne
                </button>

                {/* RECAPITULATIF REFRESHED UNDER THE PRODUCTS */}
                <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-3 max-w-[280px]">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Remise (%) :
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={remisePercent || ""}
                        onChange={(e) =>
                          setRemisePercent(
                            Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)),
                          )
                        }
                        className="w-24 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Acompte déjà versé ({currencySymbol()}) :
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={acompte || ""}
                        onChange={(e) => setAcompte(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-xs"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-64 bg-white/5 p-4 rounded-xl border border-white/10 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Sous-total HT :</span>
                      <span>
                        {sousTotalHT.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </span>
                    </div>
                    {remisePercent > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Remise ({remisePercent}%) :</span>
                        <span>
                          -
                          {remiseMontant.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          {currencySymbol()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>TVA Totale :</span>
                      <span>
                        {tvaTotale.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-slate-100 text-sm">
                      <span>Total TTC :</span>
                      <span className="text-orange-400">
                        {totalTTC.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        {currencySymbol()}
                      </span>
                    </div>
                    {acompte > 0 && (
                      <div className="flex justify-between font-bold text-slate-200 border-t border-white/10 pt-2">
                        <span>Reste à payer :</span>
                        <span>
                          {resteAPayer.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          {currencySymbol()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 5 — COMPLEMENTARY DETAILS */}
          <div className="glass shadow-2xl rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setOpenBloc5(!openBloc5)}
              className="w-full px-6 py-4 flex justify-between items-center bg-white/5 border-b border-white/10"
            >
              <span className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs">
                  5
                </span>
                Infos Complémentaires & Règlements
              </span>
              {openBloc5 ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
            {openBloc5 && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Conditions de paiement
                  </label>
                  <select
                    value={conditionsPaiement}
                    onChange={(e) => setConditionsPaiement(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#121214] border border-white/10 text-slate-100 text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="30 jours">30 jours</option>
                    <option value="15 jours">15 jours</option>
                    <option value="À réception">À réception</option>
                    <option value="Immédiat">Immédiat</option>
                    <option value="Personnalisé">Personnalisé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Mode(s) de règlement autorisé(s)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {["Virement", "Chèque", "Espèces", "PayPal", "Stripe", "Autre"].map((mode) => {
                      const isChecked = modesPaiement.includes(mode);
                      return (
                        <label
                          key={mode}
                          className="flex items-center gap-2 cursor-pointer bg-white/5 border border-white/5 p-2 rounded-lg hover:border-orange-500/30 transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setModesPaiement([...modesPaiement, mode]);
                              } else {
                                setModesPaiement(modesPaiement.filter((m) => m !== mode));
                              }
                            }}
                            className="accent-orange-500 h-4 w-4"
                          />
                          <span>{mode}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {modesPaiement.includes("Virement") && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      IBAN / Code RIB pour virement bancaire
                    </label>
                    <input
                      type="text"
                      value={ibanRib}
                      onChange={(e) => setIbanRib(e.target.value)}
                      placeholder="e.g. FR76 3000 6000 0012 3456 7890 123"
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs font-mono outline-none focus:ring-orange-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Notes ou mentions particulières à afficher
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Merci pour votre fidélité. Pénalités de retard à 3 fois le taux d'intérêt légal."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 6 — PERSONALIZATION */}
          <div className="glass shadow-2xl rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setOpenBloc6(!openBloc6)}
              className="w-full px-6 py-4 flex justify-between items-center bg-white/5 border-b border-white/10"
            >
              <span className="font-semibold text-sm tracking-wide text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs">
                  6
                </span>
                Personnalisation du Design
              </span>
              {openBloc6 ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
            {openBloc6 && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Couleur principale de la facture ({primaryColor})
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-20 rounded bg-white/5 outline-none cursor-pointer border-none"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {["#FF6B00", "#1A56DB", "#10B981", "#7C3AED", "#111827"].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setPrimaryColor(col)}
                          className="h-6 w-6 rounded-full border border-white/20 relative"
                          style={{ backgroundColor: col }}
                        >
                          {primaryColor === col && (
                            <Check className="h-3.5 w-3.5 text-white absolute inset-0 m-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Modèle de structure de facture
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: "cute",
                        name: "Cute Mignon",
                        desc: "Handwritten & Pastel",
                      },
                      {
                        id: "minimaliste",
                        name: "Minimal Simple",
                        desc: "Épuré & Tidy line",
                      },
                      {
                        id: "pro",
                        name: "Pro Corporate",
                        desc: "Structure & Badge pro",
                      },
                    ].map((modelOpt) => (
                      <button
                        key={modelOpt.id}
                        type="button"
                        onClick={() =>
                          setFactureModele(modelOpt.id as "cute" | "minimaliste" | "pro")
                        }
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                          factureModele === modelOpt.id
                            ? "bg-orange-500/10 border-orange-500 text-white"
                            : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        <span className="text-xs font-bold">{modelOpt.name}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">
                          {modelOpt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE PREVIEW CONTAINER (ONLY ON MOBILE/TABLET SIDE) */}
          <div className="md:hidden space-y-4 pt-6" ref={inlineMobileContainerRef}>
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-4 w-4" /> {lang === "fr" ? "Aperçu Mobile" : "Mobile Preview"}
            </h2>
            <div className="flex justify-center">
              <div
                className="relative overflow-hidden shadow-2xl rounded-lg bg-white mx-auto"
                style={{
                  width: `${794 * inlineMobileScale}px`,
                  height: `${1100 * inlineMobileScale}px`,
                  transition: "width 0.15s ease-out, height 0.15s ease-out",
                }}
              >
                <div
                  style={{
                    transform: `scale(${inlineMobileScale})`,
                    transformOrigin: "top left",
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  <InvoiceSheet />
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS UNDER FORM (DESKTOP) */}
          <div className="hidden lg:flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-xs font-bold text-white transition-all shadow-lg hover:scale-[1.01] hover:brightness-110 active:scale-95"
            >
              <Download className="h-4 w-4" />
              Télécharger PDF
            </button>
            <button
              onClick={handlePrintAction}
              className="px-5 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
            <button
              onClick={handleNewFacture}
              className="px-5 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <RotateCcw className="h-4 w-4 text-orange-400" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* APERÇU SIDE (RIGHT) */}
        <div className="min-w-0">
          {/* APERÇU CONTAINER ON DESKTOP */}
          <div className="apercu-desktop sticky top-24" ref={sidebarContainerRef}>
            <div className="glass p-5 rounded-2xl border border-white/10 mb-4">
              <span className="text-xs font-bold text-slate-400 block border-b border-white/5 pb-2 mb-4 uppercase tracking-wider">
                Aperçu de la Facture finale (Page A4)
              </span>
              <div
                className="relative overflow-hidden shadow-2xl rounded-xl border border-slate-200 bg-slate-100 mx-auto"
                style={{
                  width: `${794 * sidebarScale}px`,
                  height: `${1100 * sidebarScale}px`,
                  transition: "width 0.15s ease-out, height 0.15s ease-out",
                }}
              >
                {/* Scale content precisely across screen widths */}
                <div
                  style={{
                    transform: `scale(${sidebarScale})`,
                    transformOrigin: "top left",
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  <InvoiceSheet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FIXED BOTTOM ACTION STRIP */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-[100] bg-[#0c0c0e]/95 border-t border-white/10 p-3 flex gap-2">
        <button
          onClick={() => setMobilePreviewOpen(true)}
          className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white transition-all active:scale-95"
        >
          <Eye className="h-4 w-4 text-orange-400" />
          Aperçu
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 text-xs font-bold text-white transition-all active:scale-95 shadow-md"
        >
          <Download className="h-4 w-4" />
          Télécharger PDF
        </button>
        <button
          onClick={handlePrintAction}
          className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 transition-all active:scale-95"
        >
          <Printer className="h-4 w-4" />
        </button>
      </div>

      {/* MOBILE FULLSCREEN PREVIEW MODAL */}
      {mobilePreviewOpen && (
        <div className="md:hidden fixed inset-0 z-[1000] bg-black/90 flex flex-col justify-between overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-950">
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-orange-400" />
              Aperçu Mobile de la Facture
            </span>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="p-1.5 rounded-full bg-white/5 text-slate-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="flex-1 overflow-auto p-4 flex justify-center bg-slate-900"
            ref={mobileContainerRef}
          >
            <div className="bg-white text-slate-800 shadow-2xl rounded-lg overflow-x-auto p-2 self-start mx-auto">
              {/* Scaled so it displays naturally without horizontal breakages on small phones */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: `${794 * mobileScale}px`,
                  height: `${1100 * mobileScale}px`,
                  transition: "width 0.15s ease-out, height 0.15s ease-out",
                }}
              >
                <div
                  style={{
                    transform: `scale(${mobileScale})`,
                    transformOrigin: "top left",
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  <InvoiceSheet />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 border-t border-white/10 flex gap-2">
            <button
              onClick={() => {
                handleDownloadPDF();
                setMobilePreviewOpen(false);
              }}
              className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 text-xs font-bold text-white"
            >
              <Download className="h-4 w-4" />
              Télécharger PDF
            </button>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="px-5 h-11 inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* OFFSCREEN FACTURE RENDER CONTAINER DESIGNED EXCLUSIVELY FOR PDF EXPORT */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none w-[794px] h-[1100px] overflow-hidden">
        <div id="invoice-render-pdf" className="w-[794px] min-h-[1100px] bg-white p-0">
          <InvoiceSheet />
        </div>
      </div>

      {/* SEO ACCORDION / GENERAL DEFINITIONS */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 border-t border-white/5 mt-16 text-slate-300">
        <h2 className="text-2xl font-bold font-display text-white text-center mb-8 flex items-center justify-center gap-2">
          <HelpCircle className="h-6 w-6 text-orange-400" />
          Tout savoir sur la facturation
        </h2>

        <div className="space-y-4 font-sans max-w-3xl mx-auto">
          {[
            {
              id: 0,
              q: "Quelles mentions obligatoires sur une facture ?",
              a: "Une facture professionnelle doit obligatoirement contenir : un numéro de facture unique et chronologique, la date d’émission, les coordonnées complètes du vendeur et du client, la description détaillée des produits ou services, les prix HT, le taux et le montant de TVA, le total TTC et les conditions de paiement. En France, l'absence d’une de ces mentions obligatoires expose à une amende de 15€ par mention manquante.",
            },
            {
              id: 1,
              q: "Comment numéroter ses factures ?",
              a: "Le numéro de facture doit être unique, chronologique, et continu sans interruption ni trou. Le format recommandé inclut généralement l’année d’activité en cours, comme FAC-2025-001, FAC-2025-002, etc. Notre générateur prend soin de gérer et d'incrémenter automatiquement ce numéro grâce à son historique.",
            },
            {
              id: 2,
              q: "Quelle TVA appliquer sur ma facture ?",
              a: "En France : la TVA standard de base est de 20%, intermédiaire de 10%, et réduite de 5.5%. Si vous êtes auto-entrepreneur bénéficiant d'une franchise de TVA (chiffre d'affaires inférieur à 36 800 €), vous sélectionnez une TVA à 0% et notre outil incorpore de facto la mention légale CGI : 'TVA non applicable, art. 293 B du CGI'. Au Maroc, les taux principaux ajustables sont de 20%, 14%, 10% ou 7% de TVA selon la nature de votre prestation.",
            },
            {
              id: 3,
              q: "Quel délai de paiement légal appliquer ?",
              a: "En France, les délais légaux de paiement standards s'élèvent à un délai maximal de 30 jours à compter de la réception de la facture, ou peuvent passer exceptionnellement à 60 jours si convenu au contrat par écrit entre les deux parties professionnelles. En outre, tout retard fait courir des pénalités légales au client débiteur.",
            },
            {
              id: 4,
              q: "Comment envoyer une facture à un client ?",
              a: "Vous pouvez livrer vos factures par email sous format de pièce jointe PDF verrouillé, par voie postale standard, ou à travers un portail de facturation dédié. L’emploi généralisé du PDF est hautement conseillé au motif qu'il assure une intégrité parfaite de la page et de sa présentation graphique chez votre destinataire.",
            },
          ].map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full text-left py-4 px-6 font-semibold text-xs sm:text-sm text-slate-100 flex justify-between items-center hover:bg-white/5"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-orange-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-400 leading-relaxed font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION (CTA) */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 mb-16 text-center">
        <div className="glass p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-orange-500/5 to-purple-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 gradient-primary rounded-full blur-[80px] opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 gradient-primary rounded-full blur-[80px] opacity-20 pointer-events-none" />

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
            Vous facturez comme un pro. Et votre site web ?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Développez vos opportunités d’affaires avec un site vitrine ou e-commerce d'exception
            codé et optimisé sous 3 jours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://fumaops.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 h-11 bg-orange-500 text-xs font-bold text-white rounded-xl shadow-lg hover:brightness-110 hover:scale-[1.01] active:scale-95 transition-all"
            >
              Créer mon site avec FumaOPS → 3 jours
            </a>
            <Link
              to="/outils"
              className="inline-flex items-center gap-1.5 px-5 h-11 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              ← Voir tous nos outils gratuits
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
