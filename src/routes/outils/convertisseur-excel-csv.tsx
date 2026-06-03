import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../../components/Layout";
import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  ArrowRightLeft,
  Settings2,
  Lock,
  Download,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Database,
  History,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/outils/convertisseur-excel-csv")({
  component: RouteComponent,
});

type ConversionType =
  | "excel-to-csv-comma"
  | "excel-to-csv-semicolon"
  | "csv-to-excel"
  | "csv-separator-swap";
type EncodingType = "UTF-8" | "UTF-8-BOM" | "ISO-8859-1";

interface ConversionHistoryItem {
  id: string;
  filename: string;
  type: string;
  date: string;
  rowsCount: number;
}

function RouteComponent() {
  const [conversionType, setConversionType] = useState<ConversionType>("excel-to-csv-comma");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detectedSeparator, setDetectedSeparator] = useState<"," | ";" | "\t" | null>(null);

  // Advanced Options
  const [encoding, setEncoding] = useState<EncodingType>("UTF-8-BOM");
  const [useHeader, setUseHeader] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [customSeparator, setCustomSeparator] = useState("");

  // Sheet variables for multi-sheet Excel
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);

  // Conversion state
  const [isConverted, setIsConverted] = useState(false);
  const [convertedText, setConvertedText] = useState<string>("");
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [outputFilename, setOutputFilename] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Stats
  const [totalRows, setTotalRows] = useState(0);
  const [totalCols, setTotalCols] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);

  // Preview data
  const [previewTab, setPreviewTab] = useState<"before" | "after">("before");
  const [beforePreviewData, setBeforePreviewData] = useState<string[][]>([]);
  const [afterPreviewData, setAfterPreviewData] = useState<string[][]>([]);

  // History
  const [historyList, setHistoryList] = useState<ConversionHistoryItem[]>([]);

  // FAQ state
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({
    faq1: false,
    faq2: false,
    faq3: false,
    faq4: false,
    faq5: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSource = conversionType.startsWith("excel") ? "excel" : "csv";

  const currentTarget =
    conversionType === "excel-to-csv-comma"
      ? "csv-comma"
      : conversionType === "excel-to-csv-semicolon"
        ? "csv-semicolon"
        : conversionType === "csv-to-excel"
          ? "excel"
          : "csv-swap";

  const handleSourceChange = (newSrc: "excel" | "csv") => {
    if (newSrc === "excel") {
      changeConversionType("excel-to-csv-comma");
    } else {
      changeConversionType("csv-to-excel");
    }
  };

  const handleTargetChange = (newTgt: string) => {
    if (currentSource === "excel") {
      if (newTgt === "csv-comma") {
        changeConversionType("excel-to-csv-comma");
      } else if (newTgt === "csv-semicolon") {
        changeConversionType("excel-to-csv-semicolon");
      }
    } else {
      if (newTgt === "excel") {
        changeConversionType("csv-to-excel");
      } else if (newTgt === "csv-swap") {
        changeConversionType("csv-separator-swap");
      }
    }
  };

  // HTML Head and Meta injection
  useEffect(() => {
    document.title =
      "Convertisseur Excel CSV Gratuit en Ligne 2025 — XLSX vers CSV et CSV vers Excel | FumaOPS";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Convertissez gratuitement vos fichiers Excel en CSV et CSV en Excel en ligne. Choisissez votre séparateur virgule ou point-virgule. Aperçu instantané, téléchargement immédiat. 100% local, sans inscription — FumaOPS.",
    );

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "convertisseur excel csv gratuit, convertir xlsx en csv en ligne, convertir csv en excel gratuit, csv virgule point virgule convertir, convertir excel en csv gratuit, transformer csv en excel, convertisseur csv xlsx gratuit, csv separateur point virgule virgule, convertir csv point virgule en virgule, excel vers csv gratuit en ligne, convertir fichier excel csv sans logiciel, xlsx to csv free online, csv to excel free converter",
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://fumaops.com/outils/convertisseur-excel-csv");
    
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", "index, follow");

    // JSON-LD WebApplication and FAQ markup
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Convertisseur Excel CSV Gratuit",
      description: "Convertissez Excel en CSV et CSV en Excel gratuitement en ligne",
      url: "https://fumaops.com/outils/convertisseur-excel-csv",
      applicationCategory: "UtilityApplication",
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
    };

    let jsonLd = document.getElementById("jsonld-converter-webapp");
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.id = "jsonld-converter-webapp";
      jsonLd.setAttribute("type", "application/ld+json");
      document.head.appendChild(jsonLd);
    }
    jsonLd.innerHTML = JSON.stringify(jsonLdData);

    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment convertir Excel en CSV gratuitement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sélectionnez le type de conversion Excel vers CSV, déposez votre fichier .xlsx, choisissez votre séparateur virgule ou point-virgule et téléchargez immédiatement. 100% gratuit, sans inscription.",
          },
        },
        {
          "@type": "Question",
          name: "Pourquoi mon CSV s'ouvre dans une seule colonne sur Excel ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Excel français utilise le point-virgule comme séparateur. Si votre fichier utilise la virgule, tout s'affiche dans une seule colonne. Utilisez notre convertisseur CSV virgule vers point-virgule pour régler ce problème.",
          },
        },
        {
          "@type": "Question",
          name: "Mes fichiers sont-ils envoyés sur un serveur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non. Tous vos fichiers sont traités localement dans votre navigateur. Aucune donnée n'est transmise à nos serveurs. Le traitement est 100% privé et local.",
          },
        },
        {
          "@type": "Question",
          name: "Quelle taille de fichier est acceptée ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Notre convertisseur accepte les fichiers jusqu'à 50MB. Pour les très gros fichiers, le traitement peut prendre quelques secondes selon les performances de votre appareil.",
          },
        },
        {
          "@type": "Question",
          name: "Puis-je convertir plusieurs feuilles Excel ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui. Si votre fichier Excel contient plusieurs feuilles, notre outil vous permet de choisir quelle feuille convertir ou de toutes les exporter en fichiers CSV séparés.",
          },
        },
      ],
    };

    let jsonLdFaq = document.getElementById("jsonld-converter-faq");
    if (!jsonLdFaq) {
      jsonLdFaq = document.createElement("script");
      jsonLdFaq.id = "jsonld-converter-faq";
      jsonLdFaq.setAttribute("type", "application/ld+json");
      document.head.appendChild(jsonLdFaq);
    }
    jsonLdFaq.innerHTML = JSON.stringify(faqData);

    // Initial load history
    const saved = localStorage.getItem("fumaops_converter_history_v1");
    if (saved) {
      try {
        setHistoryList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Dynamic responsive accordion defaults
    const handleResize = () => {
      setIsOptionsOpen(window.innerWidth > 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      jsonLd?.remove();
      jsonLdFaq?.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Format Helper
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1014;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Sep detector helper
  const detectSeparator = (text: string): "," | ";" | "\t" => {
    const firstLine = text.split("\n")[0] || "";
    const commas = (firstLine.match(/,/g) || []).length;
    const semicolons = (firstLine.match(/;/g) || []).length;
    const tabs = (firstLine.match(/\t/g) || []).length;

    if (semicolons > commas && semicolons > tabs) return ";";
    if (tabs > commas && tabs > semicolons) return "\t";
    return ",";
  };

  // Drag-and-drop actions
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setError(null);
    setIsConverted(false);
    setConvertedBlob(null);
    setConvertedText("");
    setSheets([]);
    setSelectedSheetIndex(0);

    // File validation
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("Le fichier dépasse la taille maximale autorisée de 50 Mo.");
      return;
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    // Check if correct type
    if (conversionType.startsWith("excel-to-csv")) {
      if (extension !== "xlsx" && extension !== "xls") {
        setError(
          "Veuillez sélectionner un fichier Excel (.xlsx ou .xls) pour ce type de conversion.",
        );
        return;
      }
    } else {
      if (extension !== "csv") {
        setError("Veuillez sélectionner un fichier CSV (.csv) pour ce type de conversion.");
        return;
      }
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);

    // Generate initial filename suggestion
    const nameWithoutExt =
      selectedFile.name.substring(0, selectedFile.name.lastIndexOf(".")) || selectedFile.name;
    const targetExt =
      conversionType.startsWith("excel-to-csv") || conversionType === "csv-separator-swap"
        ? "csv"
        : "xlsx";
    setOutputFilename(`${nameWithoutExt}_converti.${targetExt}`);

    // If CSV file, parse preview and detect separator
    if (extension === "csv") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const textStr = ev.target?.result as string;
        const autoSep = detectSeparator(textStr);
        setDetectedSeparator(autoSep);

        // Generate "Before" preview
        const sepToUse = customSeparator.length === 1 ? customSeparator : autoSep;
        const parsedRows = textStr
          .split("\n")
          .filter((row) => row.trim().length > 0)
          .slice(0, 10)
          .map((row) => {
            return row.split(sepToUse).map((cell) => cell.trim().replace(/^"|"$/g, ""));
          });
        setBeforePreviewData(parsedRows);

        // Stats approximation
        const lines = textStr.split("\n").filter((r) => r.trim().length > 0);
        setTotalRows(lines.length);
        if (lines[0]) {
          setTotalCols(lines[0].split(sepToUse).length);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      // Excel file preview parsing
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          setSheets(workbook.SheetNames);

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          setBeforePreviewData(json.slice(0, 10));
          setTotalRows(json.length);
          if (json[0]) {
            setTotalCols(json[0].length);
          }
        } catch (err) {
          console.error(err);
          setError("Erreur lors de la lecture du fichier Excel.");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // When selection type changes, reset or adapt
  const changeConversionType = (type: ConversionType) => {
    setConversionType(type);
    setFile(null);
    setError(null);
    setIsConverted(false);
    setConvertedBlob(null);
    setConvertedText("");
    setSheets([]);
    setBeforePreviewData([]);
    setAfterPreviewData([]);
    setTotalRows(0);
    setTotalCols(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Convert Code - Core Logic
  const handleConversion = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      if (conversionType === "excel-to-csv-comma" || conversionType === "excel-to-csv-semicolon") {
        const separator = conversionType === "excel-to-csv-comma" ? "," : ";";
        const csvStr = await excelToCSV(file, separator, selectedSheetIndex);

        // Parse CSV string into Blob
        let rawContent = csvStr;
        let blobType = "text/csv;charset=utf-8;";

        if (encoding === "UTF-8-BOM") {
          // Add Byte Order Mark for Excel encoding
          rawContent = "\uFEFF" + csvStr;
        } else if (encoding === "ISO-8859-1") {
          // Standard Latin-1 conversion
          blobType = "text/csv;charset=ISO-8859-1;";
        }

        const blob = new Blob([rawContent], { type: blobType });
        setConvertedBlob(blob);
        setConvertedText(csvStr);
        setConvertedSize(blob.size);

        // Preview
        const lines = csvStr
          .split("\n")
          .filter((r) => r.trim().length > 0)
          .slice(0, 10);
        const previewRows = lines.map((l) =>
          l.split(separator).map((c) => c.trim().replace(/^"|"$/g, "")),
        );
        setAfterPreviewData(previewRows);

        setIsConverted(true);
        setPreviewTab("after");
        addToHistory(file.name, "Excel Vers CSV", lines.length);
      } else if (conversionType === "csv-to-excel") {
        const textStr = await file.text();
        const separator = customSeparator.length === 1 ? customSeparator : detectedSeparator || ",";
        const blob = await csvToExcel(textStr, separator);

        setConvertedBlob(blob);
        setConvertedSize(blob.size);

        // Preview from CSV parsing
        const lines = textStr
          .split("\n")
          .filter((r) => r.trim().length > 0)
          .slice(0, 10);
        const parsedRows = lines.map((l) =>
          l.split(separator).map((c) => c.trim().replace(/^"|"$/g, "")),
        );
        setAfterPreviewData(parsedRows);

        setIsConverted(true);
        setPreviewTab("after");
        addToHistory(file.name, "CSV Vers Excel", lines.length);
      } else if (conversionType === "csv-separator-swap") {
        const textStr = await file.text();
        const autoSep = detectedSeparator || ",";
        const fromSep = customSeparator.length === 1 ? customSeparator : autoSep;
        // Swap targets
        const toSep = fromSep === "," ? ";" : ",";

        const swappedStr = convertCSVSeparator(textStr, fromSep, toSep);

        let rawContent = swappedStr;
        let blobType = "text/csv;charset=utf-8;";
        if (encoding === "UTF-8-BOM") {
          rawContent = "\uFEFF" + swappedStr;
        } else if (encoding === "ISO-8859-1") {
          blobType = "text/csv;charset=ISO-8859-1;";
        }

        const blob = new Blob([rawContent], { type: blobType });
        setConvertedBlob(blob);
        setConvertedText(swappedStr);
        setConvertedSize(blob.size);

        // Preview
        const lines = swappedStr
          .split("\n")
          .filter((r) => r.trim().length > 0)
          .slice(0, 10);
        const previewRows = lines.map((l) =>
          l.split(toSep).map((c) => c.trim().replace(/^"|"$/g, "")),
        );
        setAfterPreviewData(previewRows);

        setIsConverted(true);
        setPreviewTab("after");
        addToHistory(file.name, "Swap Séparateur CSV", lines.length);
      }
    } catch (err: unknown) {
      console.error(err);
      setError(
        "Désolé, une erreur s'est produite lors de la conversion de ce fichier. Vérifiez son encodage ou sa structure.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Convert CSV separator swapping logic
  const convertCSVSeparator = (csvText: string, fromSep: string, toSep: string): string => {
    return csvText
      .split("\n")
      .map((line) => {
        const fields = [];
        let current = "";
        let inQuotes = false;

        for (const char of line) {
          if (char === '"') {
            inQuotes = !inQuotes;
            current += char;
          } else if (char === fromSep && !inQuotes) {
            fields.push(current);
            current = "";
          } else {
            current += char;
          }
        }
        fields.push(current);
        return fields.join(toSep);
      })
      .join("\n");
  };

  // Excel -> CSV core utility
  const excelToCSV = (
    fileObj: File,
    separator: "," | ";",
    sheetIndex: number = 0,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[sheetIndex];
          const worksheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: separator });
          resolve(csv);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(fileObj);
    });
  };

  // CSV -> Excel core utility
  const csvToExcel = (csvText: string, separator: string): Blob => {
    const rows = csvText
      .split("\n")
      .filter((row) => row.trim().length > 0)
      .map((row) => {
        const fields = [];
        let current = "";
        let inQuotes = false;

        for (const char of row) {
          if (char === '"') {
            inQuotes = !inQuotes;
            current += char;
          } else if (char === separator && !inQuotes) {
            fields.push(current.trim().replace(/^"|"$/g, ""));
            current = "";
          } else {
            current += char;
          }
        }
        fields.push(current.trim().replace(/^"|"$/g, ""));
        return fields;
      });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  // Download action
  const handleDownload = () => {
    if (!convertedBlob) return;
    saveAs(convertedBlob, outputFilename);
  };

  const addToHistory = (filename: string, type: string, rows: number) => {
    const newItem: ConversionHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      filename,
      type,
      date:
        new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) +
        " " +
        new Date().toLocaleDateString("fr-FR"),
      rowsCount: rows,
    };

    const updated = [newItem, ...historyList].slice(0, 5);
    setHistoryList(updated);
    localStorage.setItem("fumaops_converter_history_v1", JSON.stringify(updated));
  };

  const toggleFaq = (key: string) => {
    setFaqOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetAll = () => {
    setFile(null);
    setError(null);
    setIsConverted(false);
    setConvertedBlob(null);
    setConvertedText("");
    setSheets([]);
    setSelectedSheetIndex(0);
    setBeforePreviewData([]);
    setAfterPreviewData([]);
    setTotalRows(0);
    setTotalCols(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <PageShell>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Convertisseur Excel ↔ CSV Gratuit
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Convertissez vos fichiers Excel en CSV et CSV en Excel en ligne.
            <br className="hidden sm:block" />
            Choisissez votre séparateur. Vos fichiers restent sur votre appareil.
          </p>
        </div>

        {/* Section 1 - Dual Format Selector */}
        <div className="mb-12 max-w-4xl mx-auto bg-zinc-950/40 border border-white/5 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Decorative subtle gradient background glow */}
          <div className="absolute top-0 right-1/4 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center relative z-10">
            {/* Source Selector (De) */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <label className="block text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                  1
                </span>
                Format Source (De)
              </label>
              <div className="relative">
                <select
                  value={currentSource}
                  onChange={(e) => handleSourceChange(e.target.value as "excel" | "csv")}
                  className="w-full min-h-[50px] bg-zinc-950 hover:bg-zinc-900 border border-white/10 hover:border-white/20 rounded-xl pl-4 pr-10 py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all appearance-none cursor-pointer font-semibold shadow-inner"
                >
                  <option value="excel" className="bg-zinc-950 text-white py-2">
                    📊 Excel (.xlsx, .xls)
                  </option>
                  <option value="csv" className="bg-zinc-950 text-white py-2">
                    📄 CSV (.csv)
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-orange-400">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Visual Flow Indicator */}
            <div className="lg:col-span-1 flex items-center justify-center pt-2 lg:pt-6">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 shadow-md transform rotate-90 lg:rotate-0 transition-transform duration-300">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
            </div>

            {/* Target Selector (Vers) */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <label className="block text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                  2
                </span>
                Format Attendu (Vers)
              </label>
              <div className="relative">
                <select
                  value={currentTarget}
                  onChange={(e) => handleTargetChange(e.target.value)}
                  className="w-full min-h-[50px] bg-zinc-950 hover:bg-zinc-900 border border-white/10 hover:border-white/20 rounded-xl pl-4 pr-10 py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all appearance-none cursor-pointer font-semibold shadow-inner"
                >
                  {currentSource === "excel" ? (
                    <>
                      <option value="csv-comma" className="bg-zinc-950 text-white py-2">
                        📄 CSV - Séparateur Virgule (,)
                      </option>
                      <option value="csv-semicolon" className="bg-zinc-950 text-white py-2">
                        📄 CSV - Séparateur Point-virgule (;)
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="excel" className="bg-zinc-950 text-white py-2">
                        📊 Tableau Excel (.xlsx)
                      </option>
                      <option value="csv-swap" className="bg-zinc-950 text-white py-2">
                        🔄 CSV - Changer le séparateur
                      </option>
                    </>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-orange-400">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 - Drop Zone */}
        {!isConverted && (
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[280px] p-6 text-center ${isDragOver ? "border-orange-500 bg-orange-500/10" : "border-white/20 bg-white/5 hover:border-white/30"} ${loading ? "opacity-50 pointer-events-none" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={conversionType.startsWith("excel-to-csv") ? ".xlsx,.xls" : ".csv"}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 text-orange-400">
                  {conversionType.startsWith("excel-to-csv") ? (
                    <FileSpreadsheet className="w-8 h-8" />
                  ) : (
                    <FileText className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1 truncate max-w-md">{file.name}</h3>
                <p className="text-sm text-slate-400 mb-6">{formatSize(file.size)}</p>

                {detectedSeparator && (
                  <div className="mb-6 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Séparateur détecté :{" "}
                    {detectedSeparator === ","
                      ? "virgule (,)"
                      : detectedSeparator === ";"
                        ? "point-virgule (;)"
                        : "tabulation (\\t)"}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 text-xs sm:text-sm"
                  >
                    Changer de fichier
                  </button>
                  <button
                    onClick={resetAll}
                    className="px-5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium text-xs sm:text-sm"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-orange-400">
                  <Upload className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 hidden sm:block">
                  Glissez votre fichier ici
                </h3>
                <h3 className="text-lg font-semibold text-white mb-2 sm:hidden">
                  Appuyez pour choisir
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                  {conversionType.startsWith("excel-to-csv")
                    ? "Formats acceptés : .xlsx, .xls — Max 50 Mo"
                    : "Format accepté : .csv — Max 50 Mo"}
                </p>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto min-h-[56px] sm:min-h-[44px] px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  📁 Choisir mon fichier
                </button>
              </>
            )}

            {error && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
          </div>
        )}

        {/* Section 4 - Advanced Options */}
        {file && !isConverted && !loading && (
          <div className="mt-6 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden transition-all">
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="w-full px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-white/5 border-b border-white/5"
            >
              <span className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-orange-400" /> Options de configuration avancées
              </span>
              {isOptionsOpen ? (
                <ChevronDown className="w-5 h-5 text-orange-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-500" />
              )}
            </button>

            {isOptionsOpen && (
              <div className="p-6 space-y-6">
                {/* Multi Options Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sheets Select (Excel input only) */}
                  {sheets.length > 1 && (
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                        Choisir la feuille Excel
                      </label>
                      <select
                        value={selectedSheetIndex}
                        onChange={(e) => setSelectedSheetIndex(Number(e.target.value))}
                        className="w-full min-h-[44px] bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-base focus:border-orange-500"
                      >
                        {sheets.map((sheet, idx) => (
                          <option key={idx} value={idx}>
                            {sheet}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Encoding Select Dropdown */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                      Encodage des fichiers texte
                    </label>
                    <div className="relative">
                      <select
                        value={encoding}
                        onChange={(e) => setEncoding(e.target.value as EncodingType)}
                        className="w-full min-h-[44px] bg-zinc-950 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 appearance-none cursor-pointer font-medium"
                      >
                        <option value="UTF-8-BOM" className="bg-zinc-950 text-white">
                          UTF-8 avec BOM (Conseillé pour Excel français)
                        </option>
                        <option value="UTF-8" className="bg-zinc-950 text-white">
                          UTF-8 standard (Idéal web & Linux)
                        </option>
                        <option value="ISO-8859-1" className="bg-zinc-950 text-white">
                          ISO-8859-1 / Latin-1 (Europe Occidentale)
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-orange-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* CSV custom Separator */}
                  {conversionType.startsWith("csv") && (
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                        Séparateur CSV personnalisé (Facultatif)
                      </label>
                      <input
                        type="text"
                        maxLength={1}
                        placeholder={detectedSeparator || ","}
                        value={customSeparator}
                        onChange={(e) => setCustomSeparator(e.target.value)}
                        className="w-full h-11 bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-base focus:border-orange-500 placeholder:text-slate-600 text-center"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Laissez vide pour utiliser le séparateur auto-détecté ou standard.
                      </p>
                    </div>
                  )}

                  {/* Toggle Header Row */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="block text-xs uppercase font-bold text-slate-300 tracking-wider">
                        Première ligne = En-tête
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Traite les premiers éléments comme des noms de colonnes
                      </span>
                    </div>
                    <button
                      onClick={() => setUseHeader(!useHeader)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${useHeader ? "bg-orange-500" : "bg-slate-700"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${useHeader ? "translate-x-7" : "translate-x-1"}`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 6 - Previews Table Section */}
        {file && beforePreviewData.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setPreviewTab("before")}
                className={`py-2 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${previewTab === "before" ? "border-orange-500 text-orange-400 font-bold" : "border-transparent text-slate-400 hover:text-white"}`}
              >
                👁️ Avant conversion (Aperçu)
              </button>
              {isConverted && (
                <button
                  onClick={() => setPreviewTab("after")}
                  className={`py-2 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${previewTab === "after" ? "border-orange-500 text-orange-400 font-bold" : "border-transparent text-slate-400 hover:text-white"}`}
                >
                  ✅ Après conversion (Aperçu)
                </button>
              )}
            </div>

            {/* Table wrapper */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden p-4">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-mono">
                <span>Colonnes max: 8 | Lignes max: 10</span>
                <span className="text-orange-400 animate-pulse">
                  ← Faites défiler horizontalement →
                </span>
              </div>

              <div className="overflow-x-auto w-full max-h-[290px]">
                <table className="min-w-[500px] w-full border-collapse border border-white/10">
                  <tbody>
                    {(previewTab === "before" ? beforePreviewData : afterPreviewData).map(
                      (row, rIdx) => {
                        const isHeader = useHeader && rIdx === 0;
                        return (
                          <tr
                            key={rIdx}
                            className={
                              isHeader
                                ? "bg-orange-500/10"
                                : rIdx % 2 === 0
                                  ? "bg-white/5"
                                  : "bg-transparent"
                            }
                          >
                            {row.slice(0, 8).map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`text-xs sm:text-sm whitespace-nowrap px-3 py-2 border border-white/5 ${isHeader ? "font-bold text-orange-400" : "text-slate-300"}`}
                              >
                                {cell ? String(cell) : ""}
                              </td>
                            ))}
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5 bg-zinc-950/40 p-3 rounded-xl">
                <div className="text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
                    Lignes
                  </span>
                  <span className="text-sm font-semibold text-white font-mono">{totalRows}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
                    Colonnes
                  </span>
                  <span className="text-sm font-semibold text-white font-mono">{totalCols}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
                    Original
                  </span>
                  <span className="text-sm font-semibold text-white font-mono">
                    {formatSize(originalSize)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
                    Converti
                  </span>
                  <span className="text-sm font-semibold text-white font-mono">
                    {isConverted ? formatSize(convertedSize) : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 7 - Convert Button / Success and Output File Name Selection */}
        {file && !isConverted && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleConversion}
              disabled={loading}
              className="w-full sm:w-auto min-h-[56px] sm:min-h-[44px] px-8 py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Conversion...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-5 h-5" /> Convertir maintenant
                </>
              )}
            </button>
          </div>
        )}

        {/* Section 8 - Downloading options */}
        {isConverted && (
          <div className="mt-8 bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(16,185,129,0.1)] max-w-xl mx-auto pb-20 sm:pb-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Conversion réussie !</h3>
              <p className="text-sm text-slate-400">{totalRows} lignes converties avec succès.</p>
            </div>

            {/* Editable Filename */}
            <div className="mb-6">
              <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                Configurez le nom du fichier de sortie
              </label>
              <input
                type="text"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                className="w-full h-11 bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-base focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex gap-3">
              <button
                onClick={resetAll}
                className="flex-1 min-h-[44px] px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Autre fichier
              </button>
              <button
                onClick={handleDownload}
                className="flex-[1.5] min-h-[44px] px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" /> Télécharger mon fichier
              </button>
            </div>
          </div>
        )}

        {/* Mobile Fixed Bottom downloading bar */}
        {isConverted && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-zinc-950/95 backdrop-blur-md border-t border-white/10 z-50 flex gap-2">
            <button
              onClick={resetAll}
              className="flex-1 min-h-[56px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold flex items-center justify-center gap-1.5 active:bg-white/10 text-xs"
            >
              <RotateCcw className="w-4 h-4" /> Recommencer
            </button>
            <button
              onClick={handleDownload}
              className="flex-[1.5] min-h-[56px] px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5 active:bg-emerald-500 text-xs truncate"
            >
              <Download className="w-4 h-4" /> Télécharger
            </button>
          </div>
        )}

        {/* Section 9 - Local History */}
        {historyList.length > 0 && (
          <div className="mt-12 bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <History className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-white text-sm sm:text-base">
                📋 Conversions récentes
              </h3>
            </div>

            <div className="space-y-3">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-zinc-950 border border-white/5 text-xs sm:text-sm animate-in fade-in duration-300 gap-2"
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="font-semibold text-white truncate" title={item.filename}>
                      {item.filename}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] border border-orange-500/20 font-medium">
                      {item.type}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {item.rowsCount} lignes
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500 mt-4 text-center">
              Votre historique reste sur votre appareil uniquement et n'est pas sauvegardé en
              externe.
            </p>
          </div>
        )}

        {/* Permanent Privacy Safeguard */}
        <div className="mt-8 flex items-center justify-center gap-3 bg-zinc-900/30 border border-white/5 rounded-2xl py-4 px-6 text-center max-w-2xl mx-auto">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-400 text-left">
            <strong>🔒 100% Privé et Local.</strong> Vos fichiers sont traités directement dans
            votre navigateur. Aucune donnée n'est envoyée sur nos serveurs. Vous pouvez même
            utiliser cet outil hors connexion.
          </p>
        </div>

        {/* Section 11 - SEO Definitions / Help Accordion */}
        <div className="mt-16 pt-16 border-t border-white/5 max-w-3xl mx-auto pb-10">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Tout comprendre sur Excel et CSV
          </h2>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleFaq("faq1")}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Qu'est-ce qu'un fichier CSV ?
                </h3>
                {faqOpen.faq1 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {faqOpen.faq1 && (
                <div className="px-6 pb-6 text-sm text-slate-400 space-y-2">
                  <p>
                    Un fichier CSV (Comma-Separated Values) est un format texte simple qui stocke
                    des données tabulaires.
                  </p>
                  <p>
                    Chaque ligne représente une ligne du tableau, et chaque valeur est séparée par
                    un délimiteur (virgule, point-virgule ou tabulation).
                  </p>
                  <p>
                    Il est lisible par Excel, Google Sheets, tous les langages de programmation et
                    la majorité des applications de gestion ou d'analyse de données.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleFaq("faq2")}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Quelle différence entre CSV virgule et CSV point-virgule ?
                </h3>
                {faqOpen.faq2 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {faqOpen.faq2 && (
                <div className="px-6 pb-6 text-sm text-slate-400 space-y-2">
                  <p>
                    Le CSV avec virgule (,) est le standard international largement utilisé aux
                    États-Unis, au Royaume-Uni et dans les pays anglophones.
                  </p>
                  <p>
                    Le CSV avec point-virgule (;) est préférentiellement utilisé en Europe (France,
                    Belgique, Espagne, Maroc) car la virgule est réservée au séparateur décimal dans
                    ces pays (ex: 1 000,50 €).
                  </p>
                  <p>
                    Si votre fichier CSV s'ouvre dans une seule colonne sur Excel, c'est
                    généralement un problème de détection de séparateur que notre convertisseur
                    résout instantanément.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleFaq("faq3")}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Pourquoi convertir Excel en CSV ?
                </h3>
                {faqOpen.faq3 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {faqOpen.faq3 && (
                <div className="px-6 pb-6 text-sm text-slate-400 space-y-2">
                  <p>
                    Le format CSV est universel : il est accepté par l'ensemble des bases de données
                    du marché, toutes les plateformes e-commerce (Shopify, WooCommerce), et les APIs
                    d'importation.
                  </p>
                  <p>
                    À l'inverse, Excel (.xlsx) est un format binaire propriétaire plus complexe à
                    traiter automatiquement.
                  </p>
                  <p>
                    La conversion Excel → CSV est indispensable pour importer efficacement vos
                    catalogues de produits, vos bases de clients ou vos flux comptables.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleFaq("faq4")}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Pourquoi mon CSV s'affiche mal dans Excel ?
                </h3>
                {faqOpen.faq4 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {faqOpen.faq4 && (
                <div className="px-6 pb-6 text-sm text-slate-400 space-y-2">
                  <p>
                    Si toutes les colonnes s'affichent amalgamées dans une seule colonne, c'est la
                    conséquence d'un conflit de délimiteurs.
                  </p>
                  <p>
                    Excel Français attend par défaut des point-virgules (;), alors que le fichier
                    utilise très probablement des virgules (,).
                  </p>
                  <p>
                    Notre outil permet de convertir vos CSV à virgule en CSV à point-virgules en un
                    clic pour une lisibilité directe sous Microsoft Excel Windows ou Mac.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleFaq("faq5")}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  UTF-8 BOM : c'est quoi ?
                </h3>
                {faqOpen.faq5 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {faqOpen.faq5 && (
                <div className="px-6 pb-6 text-sm text-slate-400 space-y-1">
                  <p>
                    Le Byte Order Mark (BOM) est une signature de 3 octets au tout début du fichier
                    au format UTF-8.
                  </p>
                  <p>
                    Il indique explicitement à Excel d'ouvrir le fichier avec l'encodage moderne
                    Unicode UTF-8.
                  </p>
                  <p>
                    Elle garantit l'affichage correct des caractères accentués (é, è, à), de la
                    devise € ou de caractères dans d'autres alphabets lors d'une ouverture
                    automatique.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 13 - Final CTA Banner */}
          <div className="mt-16 text-center bg-gradient-to-br from-indigo-950/40 to-slate-900/40 p-10 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-2">Vous maîtrisez vos données.</h3>
            <p className="text-xl text-slate-300 mb-8">Et votre présence en ligne ?</p>
            <Link
              to="/contact"
              className="inline-flex px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
            >
              Créer mon site avec FumaOPS
            </Link>
            <div className="mt-8">
              <Link
                to="/outils"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                ← Voir tous nos outils gratuits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
