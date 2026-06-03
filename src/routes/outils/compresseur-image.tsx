import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../../components/Layout";
import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Download,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Trash2,
  ChevronDown,
  ChevronRight,
  Lock,
  CheckCircle2,
  RotateCcw,
  BarChart3,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/outils/compresseur-image")({
  component: RouteComponent,
});

type CompressionLevel = "max" | "balanced" | "quality";
type OutputFormat = "same" | "jpeg" | "png" | "webp";

interface ImageResult {
  original: File;
  compressed: File | Blob;
  name: string;
  originalSize: number;
  compressedSize: number;
  reduction: number;
  url: string;
  originalUrl: string;
}

function RouteComponent() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

  const [niveau, setNiveau] = useState<CompressionLevel>("balanced");
  const [format, setFormat] = useState<OutputFormat>("same");
  const [resizeOn, setResizeOn] = useState(false);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [isDragOver, setIsDragOver] = useState(false);

  const [openFaq1, setOpenFaq1] = useState(false);
  const [openFaq2, setOpenFaq2] = useState(false);
  const [openFaq3, setOpenFaq3] = useState(false);
  const [openFaq4, setOpenFaq4] = useState(false);
  const [openFaq5, setOpenFaq5] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Compresseur Image Gratuit en Ligne 2025 — Sans Perte de Qualité | FumaOPS";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Compressez vos images gratuitement en ligne. Réduisez la taille de vos JPG, PNG, WebP jusqu'à 90% sans perte visible. Traitement 100% local — vos images ne quittent pas votre appareil. Gratuit, sans inscription — FumaOPS.",
    );

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "compresseur image gratuit, compresser image en ligne, réduire taille image, compression image sans perte, compresser photo gratuit, optimiser image web, réduire poids image, compresser jpg gratuit, compresser png gratuit, outil compression image, compresser image pour site web, réduire taille photo en ligne",
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://fumaops.com/outils/compresseur-image");
    
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", "index, follow");

    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Compresseur Image Gratuit",
      description: "Compressez vos images JPG PNG WebP gratuitement sans perte de qualité",
      url: "https://fumaops.com/outils/compresseur-image",
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

    let jsonLd = document.getElementById("jsonld-webapp");
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.id = "jsonld-webapp";
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
          name: "Comment compresser une image gratuitement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Glissez votre image dans notre outil, choisissez le niveau de compression et téléchargez instantanément. 100% gratuit, sans inscription, traitement local.",
          },
        },
        {
          "@type": "Question",
          name: "Mes images sont-elles envoyées sur un serveur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non. Toutes vos images sont traitées localement dans votre navigateur. Elles ne quittent jamais votre appareil. FumaOPS ne stocke aucune de vos images.",
          },
        },
        {
          "@type": "Question",
          name: "Combien d'images puis-je compresser ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Autant que vous voulez, sans limite. Notre outil est 100% gratuit sans inscription ni restriction quotidienne.",
          },
        },
        {
          "@type": "Question",
          name: "Quels formats sont acceptés ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "JPG, PNG et WebP sont acceptés. Vous pouvez aussi convertir vos images en WebP pour une compression optimale.",
          },
        },
        {
          "@type": "Question",
          name: "Jusqu'à combien puis-je réduire une image ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En mode Maximum, la réduction peut atteindre 85 à 90% du poids original sans différence visible à l'œil nu. Une image de 5MB devient environ 500KB.",
          },
        },
      ],
    };

    let jsonLdFaq = document.getElementById("jsonld-faq");
    if (!jsonLdFaq) {
      jsonLdFaq = document.createElement("script");
      jsonLdFaq.id = "jsonld-faq";
      jsonLdFaq.setAttribute("type", "application/ld+json");
      document.head.appendChild(jsonLdFaq);
    }
    jsonLdFaq.innerHTML = JSON.stringify(faqData);

    return () => {
      // clean up some tags if needed
      jsonLd?.remove();
      jsonLdFaq?.remove();
      canonical?.remove();
    };
  }, []);

  // Use useEffect to cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      results.forEach((res) => {
        URL.revokeObjectURL(res.url);
        URL.revokeObjectURL(res.originalUrl);
      });
    };
  }, [results]);

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
      const selectedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (selectedFiles.length > 0) {
        setFiles((prev) => [...prev, ...selectedFiles]);
        setResults([]);
      }
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
      setResults([]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const getOptions = (
    level: string,
    originalSizeMB: number,
    maxW?: number,
    outFormat?: OutputFormat,
  ) => ({
    maxSizeMB: Math.min(
      level === "max" ? 0.2 : level === "balanced" ? 0.5 : 1,
      originalSizeMB * (level === "max" ? 0.15 : level === "balanced" ? 0.35 : 0.65),
    ),
    maxWidthOrHeight: maxW || 1920,
    useWebWorker: true,
    initialQuality: level === "max" ? 0.5 : level === "balanced" ? 0.7 : 0.85,
    fileType: outFormat !== "same" ? `image/${outFormat}` : undefined,
    alwaysKeepResolution: false,
    onProgress: (p: number) => setProgress(p),
  });

  const compressImages = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setProgress(0);
    const newResults: ImageResult[] = [];

    const finalMaxWidth = resizeOn ? maxWidth : undefined;

    for (let i = 0; i < files.length; i++) {
      setCurrentProcessingIndex(i + 1);
      const file = files[i];
      try {
        const originalSizeMB = file.size / (1024 * 1024);
        const compressed = await imageCompression(
          file,
          getOptions(niveau, originalSizeMB, finalMaxWidth, format),
        );
        newResults.push({
          original: file,
          compressed,
          name: file.name,
          originalSize: file.size,
          compressedSize: compressed.size,
          reduction: Math.round((1 - compressed.size / file.size) * 100),
          url: URL.createObjectURL(compressed),
          originalUrl: URL.createObjectURL(file),
        });
      } catch (err) {
        console.error(err);
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  const downloadAll = async () => {
    if (results.length === 0) return;

    if (results.length === 1) {
      // Single file download
      const res = results[0];
      const ext = format !== "same" ? format : res.name.split(".").pop() || "jpg";
      const newName = `compressed_${res.name.substring(0, res.name.lastIndexOf(".")) || res.name}.${ext}`;
      saveAs(res.compressed, newName);
      return;
    }

    // Zip download
    const zip = new JSZip();

    results.forEach((res) => {
      const ext = format !== "same" ? format : res.name.split(".").pop() || "jpg";
      const newName = `compressed_${res.name.substring(0, res.name.lastIndexOf(".")) || res.name}.${ext}`;
      zip.file(newName, res.compressed);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "images-compressees-fumaops.zip");
  };

  const downloadSingle = (res: ImageResult) => {
    const ext = format !== "same" ? format : res.name.split(".").pop() || "jpg";
    const newName = `compressed_${res.name.substring(0, res.name.lastIndexOf(".")) || res.name}.${ext}`;
    saveAs(res.compressed, newName);
  };

  const removeResult = (index: number) => {
    setResults((prev) => {
      const newResults = [...prev];
      URL.revokeObjectURL(newResults[index].url);
      URL.revokeObjectURL(newResults[index].originalUrl);
      newResults.splice(index, 1);
      return newResults;
    });
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const resetAll = () => {
    results.forEach((res) => {
      URL.revokeObjectURL(res.url);
      URL.revokeObjectURL(res.originalUrl);
    });
    setFiles([]);
    setResults([]);
    setProgress(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const originalTotal = results.reduce((acc, r) => acc + r.originalSize, 0);
  const compressedTotal = results.reduce((acc, r) => acc + r.compressedSize, 0);
  const savedTotal = originalTotal - compressedTotal;
  const totalReductionInfo = originalTotal > 0 ? Math.round((savedTotal / originalTotal) * 100) : 0;

  return (
    <PageShell>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Compresseur d'Image Gratuit en Ligne
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Réduisez le poids de vos images jusqu'à 90% en quelques secondes.
            <br className="hidden sm:block" />
            JPG, PNG, WebP acceptés. Vos images restent sur votre appareil —{" "}
            <br className="hidden sm:block" />
            rien n'est envoyé sur nos serveurs.
          </p>
        </div>

        {/* Privacy note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-8 bg-zinc-900/50 border border-white/5 rounded-xl py-3 px-4 sm:w-max max-w-full mx-auto text-center sm:text-left">
          <Lock className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
          <span className="text-xs sm:text-sm text-slate-400">
            <strong>Traitement 100% local.</strong> Vos images ne sont jamais envoyées sur nos
            serveurs. Confidentialité garantie.
          </span>
        </div>

        {/* Section 1 - Drop Zone */}
        {results.length === 0 && (
          <div
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[280px] p-6 text-center ${isDragOver ? "border-orange-500 bg-orange-500/10" : "border-white/20 bg-white/5 hover:border-white/30"} ${loading ? "opacity-50 pointer-events-none" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-medium text-white mb-2">Compression en cours...</h3>
                <p className="text-slate-400 text-sm">
                  {currentProcessingIndex} / {files.length} images
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-xs mt-6 bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-orange-500 h-2.5 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{progress}%</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-orange-400">
                  <ImageIcon className="w-8 h-8" />
                </div>

                <h3 className="text-lg sm:text-xl font-medium text-white mb-2 hidden sm:block">
                  Glissez vos images ici
                </h3>
                <h3 className="text-lg font-medium text-white mb-2 sm:hidden">
                  Appuyez pour choisir
                </h3>
                <p className="text-slate-400 text-sm mb-6 max-w-xs">
                  JPG, PNG, WebP — Max 10MB.
                  <br />
                  Vous pouvez sélectionner plusieurs fichiers.
                </p>

                {/* Desktop Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="hidden sm:inline-flex px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition-colors shadow-lg"
                >
                  Parcourir les fichiers
                </button>

                {/* Mobile Buttons */}
                <div className="flex sm:hidden flex-col gap-3 w-full max-w-xs">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <UploadCloud className="w-5 h-5" /> Choisir mes images
                  </button>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full px-6 py-3 rounded-xl bg-white/10 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform border border-white/10"
                  >
                    <Camera className="w-5 h-5" /> Prendre une photo
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* List Selection Before Compress */}
        {files.length > 0 && results.length === 0 && !loading && (
          <div className="mt-8 space-y-8">
            {/* Selected files preview block */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-orange-400" />
                  {files.length} {files.length > 1 ? "images sélectionnées" : "image sélectionnée"}
                </h3>
                <button
                  onClick={resetAll}
                  className="text-slate-400 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Tout retirer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-zinc-950 p-2 sm:p-3 rounded-xl border border-white/5"
                  >
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm text-slate-200 truncate font-medium">{f.name}</span>
                      <span className="text-xs text-slate-500">{formatSize(f.size)}</span>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-xl text-slate-300 text-sm font-medium transition-colors"
              >
                + Ajouter plus d'images
              </button>
            </div>

            {/* Section 2 - Compression Options */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg font-bold text-white mb-6">Options de compression</h3>

              <div className="space-y-8">
                {/* Niveau */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3 block">
                    Niveau de compression
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setNiveau("max")}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${niveau === "max" ? "border-orange-500 bg-orange-500/10" : "border-white/10 hover:border-white/20 bg-white/5"}`}
                    >
                      <span className="text-xl mb-1">🚀</span>
                      <span className="font-semibold text-white">Maximum</span>
                      <span className="text-xs text-emerald-400 mt-1 font-medium">
                        Réduction ~85-90%
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Idéal web et email</span>
                    </button>

                    <button
                      onClick={() => setNiveau("balanced")}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${niveau === "balanced" ? "border-orange-500 bg-orange-500/10" : "border-white/10 hover:border-white/20 bg-white/5"}`}
                    >
                      <div className="absolute -top-3 px-2 py-0.5 bg-orange-500 text-white text-[10px] uppercase font-bold rounded-full">
                        Recommandé
                      </div>
                      <span className="text-xl mb-1">⚖️</span>
                      <span className="font-semibold text-white">Équilibré</span>
                      <span className="text-xs text-emerald-400 mt-1 font-medium">
                        Réduction ~60-75%
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Idéal réseaux sociaux
                      </span>
                    </button>

                    <button
                      onClick={() => setNiveau("quality")}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${niveau === "quality" ? "border-orange-500 bg-orange-500/10" : "border-white/10 hover:border-white/20 bg-white/5"}`}
                    >
                      <span className="text-xl mb-1">💎</span>
                      <span className="font-semibold text-white">Qualité</span>
                      <span className="text-xs text-emerald-400 mt-1 font-medium">
                        Réduction ~30-40%
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Idéal pour impression
                      </span>
                    </button>
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Format de sortie
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(["same", "jpeg", "png", "webp"] as OutputFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`py-2 px-3 rounded-lg border font-medium text-sm transition-all ${format === fmt ? "border-orange-500 bg-orange-500/10 text-white" : "border-white/10 hover:border-white/20 bg-white/5 text-slate-300"}`}
                      >
                        {fmt === "same" ? "Même format" : fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resizing */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">
                      Réduire la taille maximale
                    </label>
                    <button
                      onClick={() => setResizeOn(!resizeOn)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${resizeOn ? "bg-orange-500" : "bg-slate-700"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${resizeOn ? "translate-x-7" : "translate-x-1"}`}
                      ></div>
                    </button>
                  </div>

                  {resizeOn && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex justify-between text-xs text-white mb-2 font-mono">
                        <span>480px</span>
                        <span className="font-bold text-orange-400 text-sm">{maxWidth}px</span>
                        <span>3840px</span>
                      </div>
                      <input
                        type="range"
                        min="480"
                        max="3840"
                        step="10"
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(Number(e.target.value))}
                        className="w-full accent-orange-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-2">
                        La largeur de l'image ne dépassera pas cette valeur. Les proportions sont
                        conservées.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3 - Action Button */}
            <button
              onClick={compressImages}
              disabled={files.length === 0}
              className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2 text-lg mx-auto"
            >
              🗜️ Compresser mes images
            </button>
          </div>
        )}

        {/* Section 6 - Results */}
        {results.length > 0 && !loading && (
          <div className="mt-8 space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20 sm:pb-0">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
                <span className="text-slate-400 text-sm font-medium mb-1">
                  Taille originale totale
                </span>
                <span className="text-2xl font-bold text-white font-mono">
                  {formatSize(originalTotal)}
                </span>
              </div>
              <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="text-emerald-400 text-sm font-medium mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Taille compressée totale
                </span>
                <span className="text-2xl font-bold text-white font-mono">
                  {formatSize(compressedTotal)}
                </span>
              </div>
              <div
                className={`bg-zinc-900 border rounded-2xl p-5 flex flex-col justify-center items-center text-center ${totalReductionInfo > 50 ? "border-emerald-500/50" : "border-orange-500/50"}`}
              >
                <span className="text-slate-400 text-sm font-medium mb-1">Économie totale</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">
                    {formatSize(savedTotal)}
                  </span>
                  <span
                    className={`text-sm font-bold ${totalReductionInfo > 50 ? "text-emerald-400" : "text-orange-400"}`}
                  >
                    (-{totalReductionInfo}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Results List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((res, i) => {
                const isGreen = res.reduction > 60;
                const isOrange = res.reduction >= 30 && res.reduction <= 60;
                const badgeColor = isGreen
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : isOrange
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    : "bg-slate-500/20 text-slate-400 border-slate-500/30";
                const barColor = isGreen
                  ? "bg-emerald-500"
                  : isOrange
                    ? "bg-orange-500"
                    : "bg-slate-500";

                return (
                  <div
                    key={i}
                    className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
                  >
                    <div className="flex gap-1 p-3 border-b border-white/5 bg-zinc-950/50">
                      <div className="flex-1 relative aspect-square max-h-[140px] rounded-lg overflow-hidden bg-black/50 border border-white/5">
                        <img
                          src={res.originalUrl}
                          className="w-full h-full object-cover opacity-80"
                          alt="Original"
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded font-medium border border-white/10">
                          Avant
                        </span>
                      </div>
                      <div className="flex-1 relative aspect-square max-h-[140px] rounded-lg overflow-hidden bg-black/50 border border-white/5">
                        <img src={res.url} className="w-full h-full object-cover" alt="Compressé" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-500/80 backdrop-blur-sm text-white text-[10px] rounded font-medium border border-emerald-500/20">
                          Après
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          className="text-sm font-medium text-white truncate w-full mb-2"
                          title={res.name}
                        >
                          {res.name}
                        </h4>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-400">
                            <span className="line-through opacity-70">
                              {formatSize(res.originalSize)}
                            </span>{" "}
                            →{" "}
                            <span className="font-bold text-white">
                              {formatSize(res.compressedSize)}
                            </span>
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                          >
                            -{res.reduction}%
                          </span>
                        </div>

                        {/* Visual Reduction Bar */}
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full ${barColor}`}
                            style={{ width: `${100 - res.reduction}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => downloadSingle(res)}
                          className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Télécharger
                        </button>
                        <button
                          onClick={() => removeResult(i)}
                          className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg transition-colors"
                          title="Retirer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Global Actions Desktop */}
            <div className="hidden sm:flex flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={resetAll}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold flex items-center gap-2 transition-colors border border-white/10"
              >
                <RotateCcw className="w-5 h-5" /> Nouvelles images
              </button>
              <button
                onClick={downloadAll}
                className="px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center gap-2 shadow-lg transition-colors active:scale-95"
              >
                <Download className="w-5 h-5" /> Tout télécharger{" "}
                {results.length > 1 ? "(.zip)" : ""}
              </button>
            </div>
          </div>
        )}

        {/* Mobile Fixed Bottom Bar */}
        {results.length > 0 && !loading && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-zinc-950/90 backdrop-blur-md border-t border-white/10 z-50 flex gap-2">
            <button
              onClick={resetAll}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold flex items-center justify-center gap-1.5 active:bg-white/10 text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Nouvelles
            </button>
            <button
              onClick={downloadAll}
              className="flex-[1.5] px-4 py-3 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center gap-1.5 active:bg-orange-500 text-sm"
            >
              <Download className="w-4 h-4" /> Tout télécharger
            </button>
          </div>
        )}

        {/* Section 10 - SEO Context Area */}
        <div className="mt-20 pt-16 border-t border-white/5 max-w-3xl mx-auto pb-10">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Tout savoir sur la compression d'images
          </h2>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenFaq1(!openFaq1)}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Pourquoi compresser ses images ?
                </h3>
                {openFaq1 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq1 && (
                <div className="px-6 pb-6 text-sm text-slate-400">
                  <p className="mb-2">
                    Les images non compressées ralentissent votre site web. Google pénalise les
                    sites lents dans ses résultats de recherche.
                  </p>
                  <p className="mb-2">
                    Une image de 3MB peut être réduite à 300KB sans différence visible, ce qui
                    accélère le chargement de 70%.
                  </p>
                  <p>
                    <strong>Core Web Vitals :</strong> Google mesure la vitesse de chargement (LCP)
                    comme critère SEO. Des images légères = meilleur classement Google.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenFaq2(!openFaq2)}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Quelle différence entre JPG PNG et WebP ?
                </h3>
                {openFaq2 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq2 && (
                <div className="px-6 pb-6 text-sm text-slate-400 space-y-2">
                  <p>
                    <strong>JPG :</strong> idéal pour les photos, compression avec légère perte de
                    qualité invisible. Taille typique : 3-8x plus petit que PNG.
                  </p>
                  <p>
                    <strong>PNG :</strong> idéal pour logos et icônes, supporte la transparence,
                    fichiers plus lourds.
                  </p>
                  <p>
                    <strong>WebP :</strong> format moderne Google, 30% plus léger que JPG à qualité
                    égale. Supporté par tous les navigateurs modernes.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenFaq3(!openFaq3)}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Compression avec ou sans perte ?
                </h3>
                {openFaq3 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq3 && (
                <div className="px-6 pb-6 text-sm text-slate-400 space-y-2">
                  <p>
                    <strong>Sans perte (lossless) :</strong> qualité identique à l'original,
                    réduction modérée (~20-30%).
                  </p>
                  <p>
                    <strong>Avec perte (lossy) :</strong> légère dégradation invisible à l'œil,
                    réduction maximale (~80-90%).
                  </p>
                  <p>
                    Pour le web, la compression avec perte légère est fortement recommandée car le
                    résultat visuel reste identique tout en économisant massivement sur le poids.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenFaq4(!openFaq4)}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Quelle taille d'image pour un site web ?
                </h3>
                {openFaq4 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq4 && (
                <div className="px-6 pb-6 text-sm text-slate-400">
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      <strong>Image hero pleine largeur :</strong> max 500KB
                    </li>
                    <li>
                      <strong>Image dans un article :</strong> max 200KB
                    </li>
                    <li>
                      <strong>Miniature / thumbnail :</strong> max 50KB
                    </li>
                    <li>
                      <strong>Logo :</strong> max 20KB
                    </li>
                  </ul>
                  <p className="mt-3">
                    <strong>Résolution max recommandée :</strong> 1920px de largeur.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenFaq5(!openFaq5)}
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none text-left"
              >
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base pr-4">
                  Vos images sont-elles en sécurité ?
                </h3>
                {openFaq5 ? (
                  <ChevronDown className="w-5 h-5 text-orange-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq5 && (
                <div className="px-6 pb-6 text-sm text-slate-400 space-y-2">
                  <p>
                    <strong>Oui, absolument.</strong> Notre compresseur fonctionne entièrement dans
                    votre navigateur (via JavaScript local).
                  </p>
                  <p>
                    Aucune image n'est transmise ni stockée sur nos serveurs. Le traitement est 100%
                    privé.
                  </p>
                  <p className="text-emerald-400 font-medium">
                    Vous pouvez vérifier cela en coupant votre connexion internet : l'outil
                    continuera de fonctionner !
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 12 - Final CTA */}
          <div className="mt-16 text-center bg-gradient-to-br from-indigo-950/40 to-slate-900/40 p-10 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-2">Vos images sont optimisées.</h3>
            <p className="text-xl text-slate-300 mb-8">Et votre futur site web ?</p>
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
