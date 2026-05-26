import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Globe,
  Instagram,
  MessageCircle,
  Wifi,
  Type,
  Download,
  Printer,
  Check,
  Trash2,
  ChevronRight,
  Upload,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/outils/generateur-qr-code")({
  component: QRCodeGeneratorPage,
});

// TYPES & CONFIGS
interface WindowWithQR {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  QRCode?: any;
}

interface StickerPalette {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  motif: string;
  accent: string;
}

interface StickerPattern {
  id: string;
  name: string;
  emoji: string;
}

const STICKER_PALETTES: StickerPalette[] = [
  {
    id: "simple_black",
    name: "Simple Black",
    emoji: "🖤",
    bg: "#FFFFFF",
    motif: "#E5E5E5",
    accent: "#000000",
  },
  {
    id: "blue_white",
    name: "Blue & White",
    emoji: "💙",
    bg: "#FFFFFF",
    motif: "#D0E1FD",
    accent: "#1A56DB",
  },
  {
    id: "cotton",
    name: "Cotton Candy",
    emoji: "🌸",
    bg: "#FFD6E7",
    motif: "#FFB3D1",
    accent: "#FF69B4",
  },
  {
    id: "lemon",
    name: "Lemon Fresh",
    emoji: "🍋",
    bg: "#FFFDE7",
    motif: "#FFF176",
    accent: "#F9A825",
  },
  {
    id: "sage",
    name: "Sage Dream",
    emoji: "🌿",
    bg: "#E8F5E9",
    motif: "#C8E6C9",
    accent: "#66BB6A",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    emoji: "🫐",
    bg: "#E8EAF6",
    motif: "#C5CAE9",
    accent: "#5C6BC0",
  },
  {
    id: "peach",
    name: "Peach Fuzz",
    emoji: "🍑",
    bg: "#FFF3E0",
    motif: "#FFE0B2",
    accent: "#FF8A65",
  },
  {
    id: "midnight",
    name: "Midnight",
    emoji: "🖤",
    bg: "#1A1A2E",
    motif: "#16213E",
    accent: "#E94560",
  },
  {
    id: "cherry",
    name: "Cherry Pop",
    emoji: "❤️",
    bg: "#FCE4EC",
    motif: "#F8BBD9",
    accent: "#E91E63",
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    emoji: "🌊",
    bg: "#E0F7FA",
    motif: "#B2EBF2",
    accent: "#00ACC1",
  },
  {
    id: "lavender",
    name: "Lavender Haze",
    emoji: "🌙",
    bg: "#F3E5F5",
    motif: "#E1BEE7",
    accent: "#9C27B0",
  },
  {
    id: "creamsicle",
    name: "Creamsicle",
    emoji: "🧡",
    bg: "#FFF8E1",
    motif: "#FFECB3",
    accent: "#FF6B00",
  },
  {
    id: "cloud",
    name: "Cloud Nine",
    emoji: "🤍",
    bg: "#FAFAFA",
    motif: "#F5F5F5",
    accent: "#9E9E9E",
  },
  {
    id: "tropical",
    name: "Tropical",
    emoji: "🌺",
    bg: "#E8F5E9",
    motif: "#DCEDC8",
    accent: "#FF5722",
  },
];

const STICKER_PATTERNS: StickerPattern[] = [
  { id: "polka_dots", name: "Polka Dots", emoji: "⭕" },
  { id: "diagonals", name: "Rayures diagonales", emoji: "〰️" },
  { id: "stars", name: "Étoiles", emoji: "✦" },
  { id: "hearts", name: "Cœurs", emoji: "♥" },
  { id: "flowers", name: "Fleurs", emoji: "✿" },
  { id: "checkerboard", name: "Damier", emoji: "▦" },
  { id: "triangles", name: "Triangles", emoji: "△" },
  { id: "fine_dots", name: "Points fins", emoji: "· · ·" },
];

// REACT USE QR CODE DATA URL HOOK
function useQRCodeDataUrl(text: string, colorDark: string, colorLight: string, libLoaded: boolean) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    const win = window as unknown as WindowWithQR;
    if (!text || !libLoaded || !win.QRCode) {
      setDataUrl("");
      return;
    }
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);

    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    try {
      new win.QRCode(tempDiv, {
        text,
        width: 256,
        height: 256,
        colorDark,
        colorLight,
        correctLevel: win.QRCode.CorrectLevel.M,
      });

      const checkAndExtract = () => {
        if (!isMounted) return;
        const canvas = tempDiv.querySelector("canvas");
        const img = tempDiv.querySelector("img");
        if (canvas) {
          setDataUrl(canvas.toDataURL("image/png"));
          try {
            document.body.removeChild(tempDiv);
          } catch (_) {
            /* ignore child removal error */
          }
        } else if (img && img.src) {
          setDataUrl(img.src);
          try {
            document.body.removeChild(tempDiv);
          } catch (_) {
            /* ignore child removal error */
          }
        } else {
          timer = setTimeout(checkAndExtract, 30);
        }
      };
      timer = setTimeout(checkAndExtract, 30);
    } catch (e) {
      console.error(e);
      try {
        document.body.removeChild(tempDiv);
      } catch (_) {
        /* ignore error */
      }
    }

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      try {
        document.body.removeChild(tempDiv);
      } catch (_) {
        /* ignore error */
      }
    };
  }, [text, colorDark, colorLight, libLoaded]);

  return dataUrl;
}

// GET RAW MODULE DATA FOR STYLE REDRAW
const getQRModules = (text: string): boolean[][] | null => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as unknown as any;
  if (!win.QRCode || !text) return null;
  const tempDiv = document.createElement("div");
  const qrcode = new win.QRCode(tempDiv, {
    text,
    width: 256,
    height: 256,
    correctLevel: win.QRCode.CorrectLevel.M,
  });
  return qrcode._oQRCode?.modules || null;
};

// HELPERS DRAWING ON CANVAS
const drawRoundRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
  }
};

const defineShapePath = (
  ctx: CanvasRenderingContext2D,
  shape: string,
  cx: number,
  cy: number,
  size: number,
) => {
  ctx.beginPath();
  if (shape === "circle" || shape === "rond") {
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  } else if (shape === "diamond" || shape === "losange") {
    ctx.moveTo(cx, cy - size / 2);
    ctx.lineTo(cx + size / 2, cy);
    ctx.lineTo(cx, cy + size / 2);
    ctx.lineTo(cx - size / 2, cy);
  } else if (shape === "rounded" || shape === "arrondi") {
    const r = size * 0.15;
    drawRoundRectPath(ctx, cx - size / 2, cy - size / 2, size, size, r);
  } else {
    // square / carré
    ctx.rect(cx - size / 2, cy - size / 2, size, size);
  }
  ctx.closePath();
};

const drawStar4 = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx - r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - r);
  ctx.closePath();
  ctx.fill();
};

const drawHeart = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.2);
  ctx.bezierCurveTo(
    cx - size * 0.5,
    cy - size * 0.6,
    cx - size,
    cy - size * 0.1,
    cx,
    cy + size * 0.6,
  );
  ctx.bezierCurveTo(
    cx + size,
    cy - size * 0.1,
    cx + size * 0.5,
    cy - size * 0.6,
    cx,
    cy - size * 0.2,
  );
  ctx.closePath();
  ctx.fill();
};

const drawFlower = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
  const oldFill = ctx.fillStyle;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const px = cx + Math.cos(angle) * r * 0.35;
    const py = cy + Math.sin(angle) * r * 0.35;
    ctx.beginPath();
    ctx.arc(px, py, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.fillStyle = oldFill;
};

const drawSocialIcon = (
  ctx: CanvasRenderingContext2D,
  name: string,
  x: number,
  y: number,
  size: number,
  color: string,
  scale: number,
) => {
  ctx.save();
  if (name === "instagram") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    drawRoundRectPath(ctx, x + 2, y + 2, size - 4, size - 4, 5 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size * 0.23, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + size * 0.73, y + size * 0.27, size * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  } else if (name === "youtube") {
    ctx.fillStyle = color;
    ctx.beginPath();
    drawRoundRectPath(ctx, x + 1, y + 4, size - 2, size - 8, 4 * scale);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(x + size * 0.4, y + size * 0.35);
    ctx.lineTo(x + size * 0.65, y + size * 0.5);
    ctx.lineTo(x + size * 0.4, y + size * 0.65);
    ctx.closePath();
    ctx.fill();
  } else if (name === "whatsapp") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size * 0.42, 0.15 * Math.PI, 1.85 * Math.PI);
    ctx.lineTo(x + size * 0.2, y + size * 0.84);
    ctx.lineTo(x + size * 0.35, y + size * 0.73);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.8 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size * 0.18, 0.9 * Math.PI, 1.5 * Math.PI);
    ctx.stroke();
  } else if (name === "facebook") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${size * 0.8}px 'Poppins', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("f", x + size * 0.55, y + size * 0.52);
  } else if (name === "tiktok") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(x + size * 0.55, y + size * 0.4, size * 0.18, Math.PI, 1.5 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.55, y + size * 0.4);
    ctx.lineTo(x + size * 0.55, y + size * 0.65);
    ctx.stroke();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(x + size * 0.43, y + size * 0.65, size * 0.13, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "pinterest") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold italic ${size * 0.75}px 'Playfair Display', serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("P", x + size * 0.5, y + size * 0.48);
  }
  ctx.restore();
};

const drawPattern = (
  ctx: CanvasRenderingContext2D,
  patternId: string,
  color: string,
  targetSize: number,
  scale: number,
) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (patternId === "polka_dots") {
    const spacing = 20 * scale;
    const r = 2 * scale;
    for (let x = 10 * scale; x < targetSize + spacing; x += spacing) {
      for (let y = 10 * scale; y < targetSize + spacing; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (patternId === "diagonals") {
    ctx.lineWidth = 2 * scale;
    const spacing = 15 * scale;
    for (let i = -targetSize; i < targetSize * 2; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + targetSize, targetSize);
      ctx.stroke();
    }
  } else if (patternId === "stars") {
    const spacing = 25 * scale;
    const r = 4 * scale;
    for (let x = 12 * scale; x < targetSize + spacing; x += spacing) {
      for (let y = 12 * scale; y < targetSize + spacing; y += spacing) {
        drawStar4(ctx, x, y, r);
      }
    }
  } else if (patternId === "hearts") {
    const spacing = 22 * scale;
    const r = 8 * scale;
    for (let x = 11 * scale; x < targetSize + spacing; x += spacing) {
      for (let y = 11 * scale; y < targetSize + spacing; y += spacing) {
        drawHeart(ctx, x, y, r);
      }
    }
  } else if (patternId === "flowers") {
    const spacing = 25 * scale;
    const r = 10 * scale;
    for (let x = 12 * scale; x < targetSize + spacing; x += spacing) {
      for (let y = 12 * scale; y < targetSize + spacing; y += spacing) {
        drawFlower(ctx, x, y, r);
      }
    }
  } else if (patternId === "checkerboard") {
    const size = 15 * scale;
    for (let x = 0; x < targetSize; x += size * 2) {
      for (let y = 0; y < targetSize; y += size * 2) {
        ctx.fillRect(x, y, size, size);
        ctx.fillRect(x + size, y + size, size, size);
      }
    }
  } else if (patternId === "triangles") {
    const spacing = 20 * scale;
    const r = 8 * scale;
    for (let x = 10 * scale; x < targetSize + spacing; x += spacing) {
      for (let y = 10 * scale; y < targetSize + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, y - r / 2);
        ctx.lineTo(x + r / 2, y + r / 2);
        ctx.lineTo(x - r / 2, y + r / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else if (patternId === "fine_dots") {
    const spacing = 12 * scale;
    const r = 1 * scale;
    for (let x = 6 * scale; x < targetSize + spacing; x += spacing) {
      for (let y = 6 * scale; y < targetSize + spacing; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

function QRCodeGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"generator" | "stickers">("generator");
  const [libLoaded, setLibLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [printImageSrc, setPrintImageSrc] = useState<string | null>(null);

  // CLASSIQUE STATE
  const [classicType, setClassicType] = useState<string>("url");
  const [classicUrl, setClassicUrl] = useState("https://fumaops.com");
  const [classicWhatsapp, setClassicWhatsapp] = useState("");
  const [classicInstagram, setClassicInstagram] = useState("");
  const [classicWifiSsid, setClassicWifiSsid] = useState("");
  const [classicWifiPass, setClassicWifiPass] = useState("");
  const [classicWifiType, setClassicWifiType] = useState("WPA");
  const [classicText, setClassicText] = useState("");
  const [classicShape, setClassicShape] = useState("square");
  const [classicDotColor, setClassicDotColor] = useState("#000000");
  const [classicBgColor, setClassicBgColor] = useState("#FFFFFF");
  const [classicDotStyle, setClassicDotStyle] = useState("square");
  const [classicFrameOn, setClassicFrameOn] = useState(false);
  const [classicFrameThickness, setClassicFrameThickness] = useState(8);
  const [classicFrameColor, setClassicFrameColor] = useState("#000000");
  const [classicFrameRadius, setClassicFrameRadius] = useState(16);
  const [classicFrameText, setClassicFrameText] = useState("Scan me !");
  const [classicFrameFont, setClassicFrameFont] = useState("Poppins");
  const [classicFrameTextSize, setClassicFrameTextSize] = useState(16);
  const [classicFrameTextColor, setClassicFrameTextColor] = useState("#000000");
  const [classicSelectedSocials, setClassicSelectedSocials] = useState<string[]>([]);
  const [classicLogoUrl, setClassicLogoUrl] = useState<string | null>(null);

  // STSTICKER STATE
  const [stickerUrl, setStickerUrl] = useState("https://instagram.com/fumaops");
  const [stickerShape, setStickerShape] = useState("circle");
  const [stickerPalette, setStickerPalette] = useState<StickerPalette>(STICKER_PALETTES[0]);
  const [stickerPattern, setStickerPattern] = useState("polka_dots");
  const [stickerTextPosition, setStickerTextPosition] = useState<
    "none" | "top" | "bottom" | "both"
  >("both");
  const [stickerTextTop, setStickerTextTop] = useState("Scan me ♥");
  const [stickerTextBottom, setStickerTextBottom] = useState("FumaOPS");
  const [stickerFontFamily, setStickerFontFamily] = useState("Pacifico");
  const [stickerTextSize, setStickerTextSize] = useState(24);
  const [stickerTextColor, setStickerTextColor] = useState(STICKER_PALETTES[0].accent);
  const [stickerSocials, setStickerSocials] = useState<string[]>(["instagram", "tiktok"]);

  // CANVAS REFS
  const classicCanvasRef = useRef<HTMLCanvasElement>(null);
  const stickerCanvasRef = useRef<HTMLCanvasElement>(null);

  // INITIAL LOAD & LIBS
  useEffect(() => {
    document.title = "Générateur QR Code Gratuit & Personnalisé | Free QR Code Generator | FumaOPS";

    // SEO Meta updates
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Générateur de QR Code Gratuit, personnalisé et illimité. Créez des designs élégants ou d'adorables templates de stickers QR de qualité HD sans aucune inscription. 100% Free Custom QR Code Creator.",
    );

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "qr code, code qr, qr code gratuit, code qr gratuit, générateur qr code, free qr code, free qr code generator, custom qr code, sticker qr code, qr code mignon, cute qr code, generateur qr code personnalisé, FumaOPS",
    );

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.async = true;
    script.onload = () => setLibLoaded(true);
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@600;700&family=Dancing+Script:wght@700&family=Pacifico&family=DynaPuff:wght@600;700&family=Chewy&family=Caveat:wght@700&family=Special+Elite&family=Abril+Fatface&family=VT323&family=Cinzel+Decorative:wght@700&family=Sacramento&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const saved = localStorage.getItem("fumaops_history_unified");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (_) {
        /* ignore invalid json */
      }
    }
  }, []);

  // UPDATE STICKER COLOR WHEN PALETTE CHANGES
  const handleSelectPalette = (palette: StickerPalette) => {
    setStickerPalette(palette);
    setStickerTextColor(palette.accent);
  };

  // GET CLASSIC QR STRING
  const getClassicQrText = useCallback(() => {
    if (classicType === "url") return classicUrl || "https://fumaops.com";
    if (classicType === "whatsapp")
      return `https://wa.me/${classicWhatsapp.replace(/\+/g, "").replace(/\s+/g, "")}`;
    if (classicType === "instagram")
      return `https://instagram.com/${classicInstagram.replace(/@/g, "").trim()}`;
    if (classicType === "wifi")
      return `WIFI:S:${classicWifiSsid};T:${classicWifiType};P:${classicWifiPass};;`;
    return classicText || "FumaOPS";
  }, [
    classicType,
    classicUrl,
    classicWhatsapp,
    classicInstagram,
    classicWifiSsid,
    classicWifiType,
    classicWifiPass,
    classicText,
  ]);

  // DATA REFACTORS TO REACTIVE DATA URLS
  const classicQrText = getClassicQrText();
  const classicQrDataUrl = useQRCodeDataUrl(
    classicQrText,
    classicDotColor,
    classicBgColor,
    libLoaded,
  );
  const stickerQrDataUrl = useQRCodeDataUrl(
    stickerUrl,
    stickerPalette.accent,
    "#FFFFFF",
    libLoaded,
  );

  // CORE DRAWING LOGIC FOR CLASSIC QR
  const renderClassicToCanvas = useCallback(
    async (canvas: HTMLCanvasElement, targetSize: number, onlyQrTransparent: boolean = false) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Wait for font to load if needed
      if (
        document.fonts &&
        classicFrameFont &&
        classicFrameOn &&
        classicFrameText &&
        !onlyQrTransparent
      ) {
        try {
          await document.fonts.load(`24px "${classicFrameFont}"`);
        } catch (e) {
          console.warn("Failed to load classic frame font:", classicFrameFont, e);
        }
      }

      const scale = targetSize / 500;
      ctx.clearRect(0, 0, targetSize, targetSize);

      let qrSize = 280 * scale;
      const cx = targetSize / 2;
      let cy = targetSize / 2;

      if (onlyQrTransparent) {
        qrSize = targetSize * 0.95;
      } else if (classicFrameOn) {
        qrSize = 240 * scale;
        if (classicFrameText) cy = targetSize / 2 - 25 * scale;
      }

      // DRAW BASE FRAME (IF ENABLED)
      if (classicFrameOn && !onlyQrTransparent) {
        const fx = cx - qrSize / 2 - 15 * scale;
        const fy = cy - qrSize / 2 - 15 * scale;
        const fw = qrSize + 30 * scale;
        const fh = classicFrameText ? qrSize + 72 * scale : qrSize + 30 * scale;

        ctx.save();
        ctx.strokeStyle = classicFrameColor;
        ctx.lineWidth = classicFrameThickness * scale;
        ctx.lineJoin = "round";
        ctx.beginPath();
        drawRoundRectPath(ctx, fx, fy, fw, fh, classicFrameRadius * scale);
        ctx.stroke();
        ctx.restore();

        if (classicFrameText) {
          ctx.save();
          ctx.fillStyle = classicFrameTextColor;
          ctx.font = `600 ${classicFrameTextSize * scale}px "${classicFrameFont}", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(classicFrameText, cx, cy + qrSize / 2 + 32 * scale);
          ctx.restore();
        }
      }

      // DRAW SOCIAL NETWORKS (IF CHECKED)
      if (classicSelectedSocials.length > 0 && !onlyQrTransparent) {
        const iconSize = 22 * scale;
        const spacing = 10 * scale;
        const totalW =
          classicSelectedSocials.length * iconSize + (classicSelectedSocials.length - 1) * spacing;
        const startX = cx - totalW / 2;
        const iconY =
          classicFrameOn && classicFrameText
            ? cy + qrSize / 2 + 56 * scale
            : cy + qrSize / 2 + 22 * scale;

        classicSelectedSocials.forEach((social, index) => {
          const ix = startX + index * (iconSize + spacing);
          let bColor = "#000000";
          if (social === "instagram") bColor = "#E1306C";
          else if (social === "tiktok") bColor = "#010101";
          else if (social === "whatsapp") bColor = "#25D366";
          else if (social === "facebook") bColor = "#1877F2";
          else if (social === "youtube") bColor = "#FF0000";
          else if (social === "pinterest") bColor = "#BD081C";

          drawSocialIcon(ctx, social, ix, iconY, iconSize, bColor, scale);
        });
      }

      // DRAW SHAPED QR CODE BLOCK
      ctx.save();
      defineShapePath(ctx, classicShape, cx, cy, qrSize);
      ctx.clip();
      if (!onlyQrTransparent) {
        ctx.fillStyle = classicBgColor;
        ctx.fillRect(cx - qrSize / 2, cy - qrSize / 2, qrSize, qrSize);
      }

      if (classicQrDataUrl) {
        try {
          const modules = getQRModules(classicQrText);
          if (modules && modules.length > 0) {
            const N = modules.length;
            const cellSize = qrSize / N;
            ctx.fillStyle = classicDotColor;
            for (let r = 0; r < N; r++) {
              for (let c = 0; c < N; c++) {
                if (modules[r][c]) {
                  const px = cx - qrSize / 2 + c * cellSize;
                  const py = cy - qrSize / 2 + r * cellSize;
                  if (classicDotStyle === "round") {
                    ctx.beginPath();
                    ctx.arc(px + cellSize / 2, py + cellSize / 2, cellSize * 0.44, 0, Math.PI * 2);
                    ctx.fill();
                  } else if (classicDotStyle === "small_square") {
                    ctx.fillRect(
                      px + cellSize * 0.15,
                      py + cellSize * 0.15,
                      cellSize * 0.7,
                      cellSize * 0.7,
                    );
                  } else {
                    ctx.fillRect(px, py, cellSize, cellSize);
                  }
                }
              }
            }
          } else {
            const img = await loadImage(classicQrDataUrl);
            ctx.drawImage(img, cx - qrSize / 2, cy - qrSize / 2, qrSize, qrSize);
          }
        } catch (e) {
          console.error(e);
        }
      }
      ctx.restore();

      // INTERIOR LOGO ACCENT
      if (classicLogoUrl) {
        try {
          const img = await loadImage(classicLogoUrl);
          const lSize = qrSize * 0.22;
          ctx.save();
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          drawRoundRectPath(
            ctx,
            cx - lSize / 2 - 4 * scale,
            cy - lSize / 2 - 4 * scale,
            lSize + 8 * scale,
            lSize + 8 * scale,
            6 * scale,
          );
          ctx.fill();

          ctx.beginPath();
          drawRoundRectPath(ctx, cx - lSize / 2, cy - lSize / 2, lSize, lSize, 5 * scale);
          ctx.clip();
          ctx.drawImage(img, cx - lSize / 2, cy - lSize / 2, lSize, lSize);
          ctx.restore();
        } catch (e) {
          /* ignore loading/drawing error */
        }
      }
    },
    [
      classicQrText,
      classicQrDataUrl,
      classicDotColor,
      classicBgColor,
      classicShape,
      classicDotStyle,
      classicFrameOn,
      classicFrameThickness,
      classicFrameColor,
      classicFrameRadius,
      classicFrameText,
      classicFrameFont,
      classicFrameTextSize,
      classicFrameTextColor,
      classicSelectedSocials,
      classicLogoUrl,
    ],
  );

  // CORE DRAWING LOGIC FOR STSTICKER QR
  const renderStickerToCanvas = useCallback(
    async (canvas: HTMLCanvasElement, targetSize: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Wait for font to load if needed
      if (document.fonts && stickerFontFamily) {
        try {
          await document.fonts.load(`24px "${stickerFontFamily}"`);
        } catch (e) {
          console.warn("Failed to load sticker font:", stickerFontFamily, e);
        }
      }

      const scale = targetSize / 500;
      ctx.clearRect(0, 0, targetSize, targetSize);

      const cornerRadius = 32 * scale;

      // 1. STICKER WHITE CONTOUR CUTOUT (WITH SHADOW)
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.14)";
      ctx.shadowBlur = 12 * scale;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 6 * scale;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      drawRoundRectPath(
        ctx,
        12 * scale,
        12 * scale,
        targetSize - 24 * scale,
        targetSize - 24 * scale,
        cornerRadius + 4 * scale,
      );
      ctx.fill();
      ctx.restore();

      // 2. FILL CUTE BACKGROUND PATTERN INSIDE ROUNDED STICKER
      ctx.save();
      ctx.beginPath();
      drawRoundRectPath(
        ctx,
        20 * scale,
        20 * scale,
        targetSize - 40 * scale,
        targetSize - 40 * scale,
        cornerRadius,
      );
      ctx.clip();

      ctx.fillStyle = stickerPalette.bg;
      ctx.fillRect(0, 0, targetSize, targetSize);

      drawPattern(ctx, stickerPattern, stickerPalette.motif, targetSize, scale);
      ctx.restore();

      const topEnabled = stickerTextPosition === "top" || stickerTextPosition === "both";
      const bottomEnabled = stickerTextPosition === "bottom" || stickerTextPosition === "both";
      const hasSocials = stickerSocials.length > 0;

      // 3. WHITE RETINAL BASEPLATE BEHIND QR CODE
      // Dynamically calculate qrSize & center cy to prevent text overlapping with the QR code
      let qrSize = targetSize * 0.54;
      let cy = targetSize / 2;

      if (topEnabled && bottomEnabled) {
        cy = 232 * scale;
        qrSize = hasSocials ? targetSize * 0.48 : targetSize * 0.51;
      } else if (topEnabled) {
        cy = 258 * scale;
        qrSize = targetSize * 0.53;
      } else if (bottomEnabled) {
        cy = 224 * scale;
        qrSize = hasSocials ? targetSize * 0.49 : targetSize * 0.52;
      } else {
        cy = targetSize / 2;
        qrSize = targetSize * 0.54;
      }

      const cx = targetSize / 2;

      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      defineShapePath(ctx, stickerShape, cx, cy, qrSize + 22 * scale);
      ctx.fill();
      ctx.restore();

      // 4. DRAW THE THEMATIC QR CODE
      if (stickerQrDataUrl) {
        try {
          const img = await loadImage(stickerQrDataUrl);
          ctx.save();
          defineShapePath(ctx, stickerShape, cx, cy, qrSize);
          ctx.clip();
          ctx.drawImage(img, cx - qrSize / 2, cy - qrSize / 2, qrSize, qrSize);
          ctx.restore();
        } catch (e) {
          /* ignore image error */
        }
      }

      // 5. EMBED STICKER TEXTS
      ctx.save();
      ctx.fillStyle = stickerTextColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (topEnabled && stickerTextTop) {
        ctx.font = `bold ${stickerTextSize * scale}px "${stickerFontFamily}", sans-serif`;
        ctx.fillText(stickerTextTop.toUpperCase(), cx, 66 * scale);
      }

      if (bottomEnabled && stickerTextBottom) {
        ctx.font = `bold ${stickerTextSize * scale}px "${stickerFontFamily}", sans-serif`;
        const tY = hasSocials ? 412 * scale : 434 * scale;
        ctx.fillText(stickerTextBottom.toUpperCase(), cx, tY);
      }
      ctx.restore();

      // 6. DRAW ASSOCIATE SOCIAL CHIPS (CUTE)
      if (stickerSocials.length > 0) {
        const iconSize = 22 * scale;
        const spacing = 10 * scale;
        const totalW = stickerSocials.length * iconSize + (stickerSocials.length - 1) * spacing;
        const startX = cx - totalW / 2;
        const iconY = bottomEnabled ? 444 * scale : 434 * scale;

        stickerSocials.forEach((social, index) => {
          const ix = startX + index * (iconSize + spacing);
          drawSocialIcon(ctx, social, ix, iconY, iconSize, stickerPalette.accent, scale);
        });
      }
    },
    [
      stickerShape,
      stickerPalette,
      stickerPattern,
      stickerTextPosition,
      stickerTextTop,
      stickerTextBottom,
      stickerFontFamily,
      stickerTextSize,
      stickerTextColor,
      stickerSocials,
      stickerQrDataUrl,
    ],
  );

  // ATTACH REAL-TIME REDRAWS
  useEffect(() => {
    if (classicCanvasRef.current) {
      renderClassicToCanvas(classicCanvasRef.current, 500);
    }
  }, [renderClassicToCanvas]);

  useEffect(() => {
    if (stickerCanvasRef.current) {
      renderStickerToCanvas(stickerCanvasRef.current, 500);
    }
  }, [renderStickerToCanvas]);

  // EXPORT TRIGGERS
  const handleDownloadFile = async (targetSize: number, onlyQrTransparent: boolean = false) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = targetSize;
    offscreen.height = targetSize;

    if (onlyQrTransparent) {
      await renderClassicToCanvas(offscreen, targetSize, true);
    } else if (activeTab === "generator") {
      await renderClassicToCanvas(offscreen, targetSize, false);
    } else {
      await renderStickerToCanvas(offscreen, targetSize);
    }

    const dataUrl = offscreen.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = onlyQrTransparent
      ? `qrcode-transparent-${targetSize}px.png`
      : `qrcode-${activeTab}-${targetSize}px.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Save history unit
    const id = Date.now().toString();
    const historyItem = {
      id,
      activeTab,
      thumb: dataUrl,
      settings: {
        classicType,
        classicUrl,
        classicWhatsapp,
        classicInstagram,
        classicWifiSsid,
        classicWifiPass,
        classicWifiType,
        classicText,
        classicShape,
        classicDotColor,
        classicBgColor,
        classicDotStyle,
        classicFrameOn,
        classicFrameThickness,
        classicFrameColor,
        classicFrameRadius,
        classicFrameText,
        classicFrameFont,
        classicFrameTextSize,
        classicFrameTextColor,
        classicSelectedSocials,
        classicLogoUrl,

        stickerUrl,
        stickerShape,
        stickerPaletteId: stickerPalette.id,
        stickerPattern,
        stickerTextPosition,
        stickerTextTop,
        stickerTextBottom,
        stickerFontFamily,
        stickerTextSize,
        stickerTextColor,
        stickerSocials,
      },
    };

    const nextHistory = [historyItem, ...history.filter((x) => x.id !== id).slice(0, 4)];
    setHistory(nextHistory);
    localStorage.setItem("fumaops_history_unified", JSON.stringify(nextHistory));

    setCopied(true);
    setTimeout(() => setCopied(false), 6000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleApplyHistory = (item: any) => {
    setActiveTab(item.activeTab);
    const s = item.settings;
    if (item.activeTab === "generator") {
      setClassicType(s.classicType ?? "url");
      setClassicUrl(s.classicUrl ?? "");
      setClassicWhatsapp(s.classicWhatsapp ?? "");
      setClassicInstagram(s.classicInstagram ?? "");
      setClassicWifiSsid(s.classicWifiSsid ?? "");
      setClassicWifiPass(s.classicWifiPass ?? "");
      setClassicWifiType(s.classicWifiType ?? "WPA");
      setClassicText(s.classicText ?? "");
      setClassicShape(s.classicShape ?? "square");
      setClassicDotColor(s.classicDotColor ?? "#000000");
      setClassicBgColor(s.classicBgColor ?? "#FFFFFF");
      setClassicDotStyle(s.classicDotStyle ?? "square");
      setClassicFrameOn(s.classicFrameOn ?? false);
      setClassicFrameThickness(s.classicFrameThickness ?? 8);
      setClassicFrameColor(s.classicFrameColor ?? "#000000");
      setClassicFrameRadius(s.classicFrameRadius ?? 16);
      setClassicFrameText(s.classicFrameText ?? "");
      setClassicFrameFont(s.classicFrameFont ?? "Poppins");
      setClassicFrameTextSize(s.classicFrameTextSize ?? 16);
      setClassicFrameTextColor(s.classicFrameTextColor ?? "#000000");
      setClassicSelectedSocials(s.classicSelectedSocials ?? []);
      setClassicLogoUrl(s.classicLogoUrl ?? null);
    } else {
      setStickerUrl(s.stickerUrl ?? "https://instagram.com/fumaops");
      setStickerShape(s.stickerShape ?? "circle");
      const foundPal =
        STICKER_PALETTES.find((p) => p.id === s.stickerPaletteId) || STICKER_PALETTES[0];
      setStickerPalette(foundPal);
      setStickerPattern(s.stickerPattern ?? "polka_dots");
      setStickerTextPosition(s.stickerTextPosition ?? "both");
      setStickerTextTop(s.stickerTextTop ?? "");
      setStickerTextBottom(s.stickerTextBottom ?? "");
      setStickerFontFamily(s.stickerFontFamily ?? "Pacifico");
      setStickerTextSize(s.stickerTextSize ?? 24);
      setStickerTextColor(s.stickerTextColor ?? foundPal.accent);
      setStickerSocials(s.stickerSocials ?? []);
    }
  };

  const handlePrintAction = () => {
    const canvas = activeTab === "generator" ? classicCanvasRef.current : stickerCanvasRef.current;
    if (!canvas) return;
    setPrintImageSrc(canvas.toDataURL("image/png"));
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setClassicLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <PageShell>
      {/* Dynamic Overlay Print frame container */}
      {printImageSrc && (
        <div id="print-section" className="hidden">
          <img src={printImageSrc} className="max-w-md" alt="Print preview" />
        </div>
      )}

      {/* COMPACT STYLES FOR SCREEN PRINTING */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-section, #print-section * {
            visibility: visible !important;
            display: flex !important;
          }
          #print-section {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
          }
        }
      `}</style>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-20 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 tracking-tight gradient-text glow-primary">
          Générateur de QR Code Gratuit & Mignon 🚀
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-10">
          Créez de sublimes QR codes personnalisés (100% Free & Gratuit) ou générez d'adorables
          templates de Stickers uniques. Sans inscription, téléchargement haute définition
          instantané.
        </p>

        {/* CUTE TABS */}
        <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1.5 mb-10 sm:mb-12">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === "generator"
                ? "bg-[var(--electric)] text-black shadow-[0_0_15px_rgba(204,255,0,0.25)]"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            🎨 Générateur Classique
          </button>
          <button
            onClick={() => setActiveTab("stickers")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "stickers"
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-black shadow-[0_0_15px_rgba(244,114,182,0.25)]"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            ✨ Templates Stickers
          </button>
        </div>

        {/* TWO-COLUMN GRID */}
        <div className="grid lg:grid-cols-12 gap-8 text-left">
          {/* LEFT: OPTIONS CONTROL PANEL */}
          <div className="lg:col-span-7 space-y-6">
            {activeTab === "generator" ? (
              <>
                {/* CLASSIQUE STEP 1: INPUT CONTENT */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--electric)] text-black flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    URL & Contenu du QR Code
                  </h2>

                  {/* SELECT INPUT TYPE */}
                  <div className="grid grid-cols-5 gap-1 mb-4">
                    {[
                      { id: "url", label: "Lien", icon: Globe },
                      { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                      { id: "instagram", label: "Insta", icon: Instagram },
                      { id: "wifi", label: "WiFi", icon: Wifi },
                      { id: "text", label: "Texte", icon: Type },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setClassicType(opt.id)}
                        className={`py-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          classicType === opt.id
                            ? "border-[var(--electric)] bg-[var(--electric)]/10 text-[var(--electric)]"
                            : "border-white/5 bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        <opt.icon className="h-4 w-4" />
                        <span className="text-[10px] font-bold">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* FORM FIELDS ACCORDING TO TYPE */}
                  <div className="space-y-3">
                    {classicType === "url" && (
                      <input
                        type="url"
                        value={classicUrl}
                        onChange={(e) => setClassicUrl(e.target.value)}
                        placeholder="https://votre-site-web.com"
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-[var(--electric)] focus:ring-[var(--electric)] focus:outline-none text-sm text-white font-mono"
                      />
                    )}
                    {classicType === "whatsapp" && (
                      <input
                        type="tel"
                        value={classicWhatsapp}
                        onChange={(e) => setClassicWhatsapp(e.target.value)}
                        placeholder="Numéro avec indicatif (ex: 33600000000)"
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-[var(--electric)] focus:ring-[var(--electric)] focus:outline-none text-sm text-white font-mono"
                      />
                    )}
                    {classicType === "instagram" && (
                      <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-[var(--electric)]">
                        <span className="p-3 text-white/50 bg-white/5 select-none text-sm">@</span>
                        <input
                          type="text"
                          value={classicInstagram}
                          onChange={(e) => setClassicInstagram(e.target.value)}
                          placeholder="votre_compte"
                          className="flex-1 bg-transparent border-0 p-3 text-sm text-white focus:outline-none focus:ring-0 font-mono"
                        />
                      </div>
                    )}
                    {classicType === "wifi" && (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={classicWifiSsid}
                          onChange={(e) => setClassicWifiSsid(e.target.value)}
                          placeholder="Nom du WiFi (SSID)"
                          className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-[var(--electric)] focus:outline-none text-sm"
                        />
                        <input
                          type="password"
                          value={classicWifiPass}
                          onChange={(e) => setClassicWifiPass(e.target.value)}
                          placeholder="Mot de passe"
                          className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-[var(--electric)] focus:outline-none text-sm"
                        />
                        <select
                          value={classicWifiType}
                          onChange={(e) => setClassicWifiType(e.target.value)}
                          className="col-span-2 bg-neutral-900 border border-white/10 p-3 rounded-xl focus:border-[var(--electric)] text-sm text-white/80 focus:outline-none"
                        >
                          <option value="WPA">WPA/WPA2 (Sûr)</option>
                          <option value="WEP">WEP (Ancien)</option>
                          <option value="nopass">Sans clé</option>
                        </select>
                      </div>
                    )}
                    {classicType === "text" && (
                      <textarea
                        value={classicText}
                        onChange={(e) => setClassicText(e.target.value)}
                        placeholder="Tapez le texte à encoder"
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-[var(--electric)] focus:outline-none text-sm text-white font-mono"
                      />
                    )}
                  </div>
                </div>

                {/* CLASSIQUE STEP 2: SHAPE */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--electric)] text-black flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    Forme du QR Code
                  </h2>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "square", name: "Carré Classique" },
                      { id: "circle", name: "Masque Rond" },
                      { id: "diamond", name: "Losange (45°)" },
                      { id: "rounded", name: "Coins Arrondis" },
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        onClick={() => setClassicShape(sh.id)}
                        className={`px-2 py-3 rounded-xl text-center border text-[11px] font-bold transition-all ${
                          classicShape === sh.id
                            ? "border-[var(--electric)] bg-[var(--electric)]/10 text-white"
                            : "border-white/5 hover:bg-white/5 text-white/60"
                        }`}
                      >
                        {sh.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CLASSIQUE STEP 3: STYLE & COLORS */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--electric)] text-black flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    Aspect des Points & Couleurs
                  </h2>

                  <div className="space-y-4">
                    {/* Style selector */}
                    <div>
                      <span className="text-xs font-bold text-white/80 block mb-2">
                        Style des points
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "square", label: "■ Carrés" },
                          { id: "round", label: "● Ronds" },
                          { id: "small_square", label: "▪ Petits carrés" },
                        ].map((st) => (
                          <button
                            key={st.id}
                            onClick={() => setClassicDotStyle(st.id)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              classicDotStyle === st.id
                                ? "border-[var(--electric)] bg-[var(--electric)]/10 text-white"
                                : "border-white/5 hover:bg-white/5 text-white/55"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-white/80 block mb-1">Points</label>
                        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-2">
                          <input
                            type="color"
                            value={classicDotColor}
                            onChange={(e) => setClassicDotColor(e.target.value)}
                            className="w-7 h-7 bg-transparent rounded cursor-pointer border-0 shrink-0"
                          />
                          <input
                            type="text"
                            value={classicDotColor}
                            onChange={(e) => setClassicDotColor(e.target.value)}
                            className="bg-transparent text-xs w-full font-mono text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-white/80 block mb-1">Fond</label>
                        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-2">
                          <input
                            type="color"
                            value={classicBgColor}
                            onChange={(e) => setClassicBgColor(e.target.value)}
                            className="w-7 h-7 bg-transparent rounded cursor-pointer border-0 shrink-0"
                          />
                          <input
                            type="text"
                            value={classicBgColor}
                            onChange={(e) => setClassicBgColor(e.target.value)}
                            className="bg-transparent text-xs w-full font-mono text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CLASSIQUE STEP 4: FRAME OPTIONS */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[var(--electric)] text-black flex items-center justify-center font-bold text-xs">
                        4
                      </span>
                      Cadre Simple (Optionnel)
                    </h2>
                    <button
                      onClick={() => setClassicFrameOn(!classicFrameOn)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        classicFrameOn ? "bg-green-500 text-black" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {classicFrameOn ? "Activé 🟢" : "Désactivé ⚪"}
                    </button>
                  </div>

                  {classicFrameOn && (
                    <div className="space-y-4 pt-1 animate-in fade-in slide-in-from-top-1">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Custom frame text */}
                        <div className="col-span-2">
                          <label className="text-[11px] font-bold block mb-1 text-white/75">
                            Texte sous le QR Code
                          </label>
                          <input
                            type="text"
                            value={classicFrameText}
                            onChange={(e) => setClassicFrameText(e.target.value)}
                            placeholder="Scannez-moi !"
                            className="w-full bg-white/5 border border-white/10 p-2 text-sm rounded-xl text-white focus:outline-none focus:border-[var(--electric)]"
                          />
                        </div>

                        {/* Text typography */}
                        <div>
                          <label className="text-[11px] font-bold block mb-1 text-white/75">
                            Police d'écriture
                          </label>
                          <select
                            value={classicFrameFont}
                            onChange={(e) => setClassicFrameFont(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none"
                          >
                            <option value="DynaPuff">DynaPuff (Cute Bubble 🎈)</option>
                            <option value="Chewy">Chewy (Cute Handmade 🍬)</option>
                            <option value="Caveat">Caveat (Cute Handwriting ✍️)</option>
                            <option value="Pacifico">Pacifico (Artistic Brush 🌸)</option>
                            <option value="Dancing Script">
                              Dancing Script (Elegant Cursive ✨)
                            </option>
                            <option value="Special Elite">
                              Special Elite (Vintage Typewriter ⏳)
                            </option>
                            <option value="Abril Fatface">
                              Abril Fatface (Retro Editorial 📰)
                            </option>
                            <option value="VT323">VT323 (8-bit Pixel Retro 👾)</option>
                            <option value="Cinzel Decorative">
                              Cinzel Dec. (Vintage Luxury 👑)
                            </option>
                            <option value="Sacramento">Sacramento (Delicate Script ✒️)</option>
                            <option value="Poppins">Poppins (Modern Rounded ⚡)</option>
                            <option value="Playfair Display">Playfair (Elegant Serif 🏛️)</option>
                          </select>
                        </div>

                        {/* Text size */}
                        <div>
                          <label className="text-[11px] font-bold block mb-1 text-white/75">
                            Taille du Texte ({classicFrameTextSize}px)
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="36"
                            value={classicFrameTextSize}
                            onChange={(e) => setClassicFrameTextSize(Number(e.target.value))}
                            className="w-full accent-[var(--electric)] mt-2"
                          />
                        </div>

                        {/* Border thickness */}
                        <div>
                          <label className="text-[11px] font-bold block mb-1 text-white/75">
                            Épaisseur Cadre ({classicFrameThickness}px)
                          </label>
                          <input
                            type="range"
                            min="2"
                            max="20"
                            value={classicFrameThickness}
                            onChange={(e) => setClassicFrameThickness(Number(e.target.value))}
                            className="w-full accent-[var(--electric)] mt-2"
                          />
                        </div>

                        {/* Rounding radius */}
                        <div>
                          <label className="text-[11px] font-bold block mb-1 text-white/75">
                            Rayon coins ({classicFrameRadius}px)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={classicFrameRadius}
                            onChange={(e) => setClassicFrameRadius(Number(e.target.value))}
                            className="w-full accent-[var(--electric)] mt-2"
                          />
                        </div>

                        {/* Frame color picker */}
                        <div>
                          <label className="text-[11px] font-bold block mb-1 text-white/75">
                            Couleur Cadre
                          </label>
                          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={classicFrameColor}
                              onChange={(e) => setClassicFrameColor(e.target.value)}
                              className="w-6 h-6 bg-transparent rounded cursor-pointer border-0 shrink-0"
                            />
                            <input
                              type="text"
                              value={classicFrameColor}
                              onChange={(e) => setClassicFrameColor(e.target.value)}
                              className="bg-transparent text-[10px] w-full font-mono text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Text color picker */}
                        <div>
                          <label className="text-[11px] font-bold block mb-1 text-white/75">
                            Couleur Texte
                          </label>
                          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={classicFrameTextColor}
                              onChange={(e) => setClassicFrameTextColor(e.target.value)}
                              className="w-6 h-6 bg-transparent rounded cursor-pointer border-0 shrink-0"
                            />
                            <input
                              type="text"
                              value={classicFrameTextColor}
                              onChange={(e) => setClassicFrameTextColor(e.target.value)}
                              className="bg-transparent text-[10px] w-full font-mono text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CLASSIQUE STEP 5: ADD SOCIAL CHIPS */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--electric)] text-black flex items-center justify-center font-bold text-xs">
                      5
                    </span>
                    Icônes réseaux sociaux (Optionnel)
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "instagram", label: "Instagram" },
                      { id: "tiktok", label: "TikTok" },
                      { id: "whatsapp", label: "WhatsApp" },
                      { id: "facebook", label: "Facebook" },
                      { id: "youtube", label: "YouTube" },
                    ].map((sc) => {
                      const active = classicSelectedSocials.includes(sc.id);
                      return (
                        <button
                          key={sc.id}
                          onClick={() => {
                            if (active)
                              setClassicSelectedSocials(
                                classicSelectedSocials.filter((s) => s !== sc.id),
                              );
                            else setClassicSelectedSocials([...classicSelectedSocials, sc.id]);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            active
                              ? "border-[var(--electric)] bg-[var(--electric)]/10 text-[var(--electric)]"
                              : "border-white/5 hover:bg-white/5 text-white/60"
                          }`}
                        >
                          {sc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CLASSIQUE STEP 6: CENTRE LOGO */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[var(--electric)] text-black flex items-center justify-center font-bold text-xs">
                        6
                      </span>
                      Logo au Centre
                    </h2>
                    {classicLogoUrl && (
                      <button
                        onClick={() => setClassicLogoUrl(null)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold"
                      >
                        Effacer logo
                      </button>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-4 text-center hover:border-[var(--electric)] transition-all relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-6 w-6 mx-auto mb-2 text-white/50" />
                    <p className="text-xs text-white/80 font-bold">
                      Importez votre logo (PNG, JPG)
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      S'affiche automatiquement au cœur du QR
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* STICKER STEP 1: SHAPE */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-400 text-black flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    Forme du QR Code Sticker
                  </h2>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "square", name: "■ Carré" },
                      { id: "circle", name: "● Cercle" },
                      { id: "diamond", name: "◆ Losange" },
                      { id: "rounded", name: "▢ Arrondi" },
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        onClick={() => setStickerShape(sh.id)}
                        className={`py-3 rounded-xl text-center border text-xs font-bold transition-all ${
                          stickerShape === sh.id
                            ? "border-pink-400 bg-pink-400/10 text-white"
                            : "border-white/5 hover:bg-white/5 text-white/60"
                        }`}
                      >
                        {sh.name}
                      </button>
                    ))}
                  </div>

                  {/* STICKER URL CONTENT */}
                  <div className="mt-4 flex flex-col gap-1.5 text-left">
                    <label className="text-[11px] font-bold text-white/80">
                      Lien du QR Code (URL/Instagram/TikTok...)
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 p-2.5 text-sm rounded-xl text-white focus:outline-none focus:border-pink-400 font-mono"
                      value={stickerUrl}
                      onChange={(e) => setStickerUrl(e.target.value)}
                      placeholder="https://instagram.com/votre_profil"
                    />
                  </div>
                </div>

                {/* STICKER STEP 2: PALETTES */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-400 text-black flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    Palette de Couleurs Cute
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {STICKER_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        onClick={() => handleSelectPalette(pal)}
                        className={`p-2 rounded-2xl border text-center transition-all ${
                          stickerPalette.id === pal.id
                            ? "border-pink-400 bg-white/5"
                            : "border-white/5 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex justify-center gap-1 mb-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                            style={{ backgroundColor: pal.bg }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                            style={{ backgroundColor: pal.motif }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                            style={{ backgroundColor: pal.accent }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-white block truncate">
                          {pal.emoji} {pal.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* STICKER STEP 3: BACKGROUND REPEAT MOTIFS */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-400 text-black flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    Motif de Fond Répété
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STICKER_PATTERNS.map((pt) => (
                      <button
                        key={pt.id}
                        onClick={() => setStickerPattern(pt.id)}
                        className={`py-2 rounded-xl text-center border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                          stickerPattern === pt.id
                            ? "border-pink-400 bg-pink-400/10 text-white"
                            : "border-white/5 hover:bg-white/5 text-white/60"
                        }`}
                      >
                        <span>{pt.emoji}</span>
                        <span>{pt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* STICKER STEP 4: CUSTOM TEXT */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-pink-400 text-black flex items-center justify-center font-bold text-xs">
                        4
                      </span>
                      Textes Personnalisés
                    </h2>
                    <select
                      value={stickerTextPosition}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setStickerTextPosition(e.target.value as "none" | "top" | "bottom" | "both")
                      }
                      className="bg-neutral-900 border border-white/10 p-1 px-2.5 rounded-full text-xs text-white"
                    >
                      <option value="both">Haut & Bas</option>
                      <option value="top">Haut uniquement</option>
                      <option value="bottom">Bas uniquement</option>
                      <option value="none">Aucun texte</option>
                    </select>
                  </div>

                  {stickerTextPosition !== "none" && (
                    <div className="space-y-3 pt-1">
                      {(stickerTextPosition === "top" || stickerTextPosition === "both") && (
                        <input
                          type="text"
                          value={stickerTextTop}
                          onChange={(e) => setStickerTextTop(e.target.value)}
                          placeholder="Texte du haut"
                          className="w-full bg-white/5 border border-white/10 p-2 text-sm rounded-xl text-white outline-none"
                        />
                      )}
                      {(stickerTextPosition === "bottom" || stickerTextPosition === "both") && (
                        <input
                          type="text"
                          value={stickerTextBottom}
                          onChange={(e) => setStickerTextBottom(e.target.value)}
                          placeholder="Texte du bas"
                          className="w-full bg-white/5 border border-white/10 p-2 text-sm rounded-xl text-white outline-none"
                        />
                      )}

                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {/* Font selections */}
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold block mb-1 opacity-70">
                            Style d'écriture
                          </label>
                          <select
                            value={stickerFontFamily}
                            onChange={(e) => setStickerFontFamily(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 p-2 rounded-xl text-xs text-white"
                          >
                            <option value="DynaPuff">DynaPuff (Cute Bubble 🎈)</option>
                            <option value="Chewy">Chewy (Cute Handmade 🍬)</option>
                            <option value="Caveat">Caveat (Cute Handwriting ✍️)</option>
                            <option value="Pacifico">Pacifico (Artistic Brush 🌸)</option>
                            <option value="Dancing Script">
                              Dancing Script (Elegant Cursive ✨)
                            </option>
                            <option value="Special Elite">
                              Special Elite (Vintage Typewriter ⏳)
                            </option>
                            <option value="Abril Fatface">
                              Abril Fatface (Retro Editorial 📰)
                            </option>
                            <option value="VT323">VT323 (8-bit Pixel Retro 👾)</option>
                            <option value="Cinzel Decorative">
                              Cinzel Dec. (Vintage Luxury 👑)
                            </option>
                            <option value="Sacramento">Sacramento (Delicate Script ✒️)</option>
                            <option value="Poppins">Poppins (Modern Rounded ⚡)</option>
                            <option value="Playfair Display">Playfair (Elegant Serif 🏛️)</option>
                          </select>
                        </div>

                        {/* Size sliders */}
                        <div>
                          <label className="text-[10px] font-bold block mb-0.5 opacity-70">
                            Taille ({stickerTextSize}px)
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="36"
                            value={stickerTextSize}
                            onChange={(e) => setStickerTextSize(Number(e.target.value))}
                            className="w-full accent-pink-400"
                          />
                        </div>

                        {/* Custom color sticker text */}
                        <div className="col-span-3">
                          <label className="text-[10px] font-bold block mb-1 opacity-70">
                            Couleur du texte
                          </label>
                          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={stickerTextColor}
                              onChange={(e) => setStickerTextColor(e.target.value)}
                              className="w-6 h-6 bg-transparent rounded cursor-pointer border-0 shrink-0"
                            />
                            <input
                              type="text"
                              value={stickerTextColor}
                              onChange={(e) => setStickerTextColor(e.target.value)}
                              className="bg-transparent text-[10px] w-full font-mono text-white focus:outline-none"
                            />
                            <button
                              onClick={() => setStickerTextColor(stickerPalette.accent)}
                              className="text-[10px] text-pink-300 font-bold hover:underline shrink-0"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* STICKER STEP 5: SOCIAL ICONS */}
                <div className="glass p-5 sm:p-6 rounded-3xl border border-white/10">
                  <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-400 text-black flex items-center justify-center font-bold text-xs">
                      5
                    </span>
                    Icônes réseaux sociaux
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "instagram", label: "Instagram" },
                      { id: "tiktok", label: "TikTok" },
                      { id: "whatsapp", label: "WhatsApp" },
                      { id: "facebook", label: "Facebook" },
                      { id: "pinterest", label: "Pinterest" },
                    ].map((sc) => {
                      const active = stickerSocials.includes(sc.id);
                      return (
                        <button
                          key={sc.id}
                          onClick={() => {
                            if (active)
                              setStickerSocials(stickerSocials.filter((s) => s !== sc.id));
                            else setStickerSocials([...stickerSocials, sc.id]);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            active
                              ? "border-pink-400 bg-pink-400/10 text-pink-300"
                              : "border-white/5 hover:bg-white/5 text-white/60"
                          }`}
                        >
                          {sc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: REAL-TIME PREVIEW STICKY SECTION */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center sticky top-24">
              <span
                className={`text-[10px] font-bold tracking-widest uppercase mb-1 px-2 py-0.5 rounded-full ${
                  activeTab === "generator"
                    ? "bg-[var(--electric)] text-black"
                    : "bg-pink-400 text-black"
                }`}
              >
                Aperçu de votre Sticker
              </span>
              <p className="text-[11px] opacity-60 mb-6">Redessiné en temps réel</p>

              {/* STICKER STAGE PREVIEW FRAME */}
              <div
                className="relative w-full aspect-square max-w-[280px] rounded-3xl overflow-hidden p-6 flex items-center justify-center shadow-inner"
                style={{ backgroundColor: "#F0F0F0" }}
              >
                <canvas
                  ref={classicCanvasRef}
                  width={500}
                  height={500}
                  className={`w-full h-full object-contain rounded-xl ${
                    activeTab === "generator" ? "block" : "hidden"
                  }`}
                  style={{ width: "240px", height: "240px" }}
                />
                <canvas
                  ref={stickerCanvasRef}
                  width={500}
                  height={500}
                  className={`w-full h-full object-contain rounded-xl ${
                    activeTab === "stickers" ? "block" : "hidden"
                  }`}
                  style={{ width: "240px", height: "240px" }}
                />
              </div>

              {/* COMPLEMENTARY FEEDBACK BANNER */}
              {copied && (
                <div className="mt-6 p-3 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs rounded-2xl flex flex-col text-left leading-relaxed animate-in fade-in zoom-in w-full">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="h-4 w-4" /> ✅ Sticker sauvegardé !
                  </span>
                  <span className="opacity-80 mt-1">
                    Besoin d'un site web pro à la hauteur ?{" "}
                    <Link to="/contact" className="underline font-bold hover:text-white">
                      FumaOPS le conçoit en 3 jours ! 🚀
                    </Link>
                  </span>
                </div>
              )}

              {/* ACTION BUTTON CONTROLS */}
              <div className="mt-6 w-full space-y-2">
                <button
                  onClick={() => handleDownloadFile(1000)}
                  className={`w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-bold text-black transition-all hover:scale-[1.01] active:scale-95 shadow-md ${
                    activeTab === "generator"
                      ? "bg-[var(--electric)] hover:bg-white shadow-[0_4px_12px_rgba(204,255,0,0.15)]"
                      : "bg-gradient-to-r from-pink-400 to-purple-400 hover:brightness-110 shadow-[0_4px_12px_rgba(244,114,182,0.15)]"
                  }`}
                >
                  <Download className="h-4 w-4" />
                  Télécharger Haute Déf (1000px)
                </button>

                <button
                  onClick={() => handleDownloadFile(500)}
                  className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-4 text-xs font-bold text-white transition-all hover:bg-white/10 active:scale-95"
                >
                  <Download className="h-4 w-4 opacity-75" />
                  Télécharger Taille Standard (500px)
                </button>

                <button
                  onClick={() => handleDownloadFile(1000, true)}
                  className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 px-4 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/25 active:scale-95"
                >
                  <Sparkles className="h-4 w-4 animate-pulse text-emerald-300 shrink-0" />
                  Télécharger QR Uniquement (Fond Transparent 💎)
                </button>

                <button
                  onClick={handlePrintAction}
                  className="w-full h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-500/15 border border-purple-500/20 px-4 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-500/25 active:scale-95"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer le Sticker
                </button>
              </div>

              {/* RETRIEVAL HISTORY CAROUSEL */}
              <div className="mt-6 w-full pt-5 border-t border-white/10 text-left">
                <h3 className="text-xs font-bold flex items-center gap-1.5 mb-3 text-white/90">
                  <RotateCcw className="h-3.5 w-3.5" /> Créations récentes ({history.length} / 5)
                </h3>
                {history.length > 0 ? (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleApplyHistory(item)}
                        className="flex-shrink-0 relative group rounded-xl overflow-hidden border border-white/10 w-14 h-14 hover:border-pink-400 bg-neutral-900 transition-all"
                      >
                        <img
                          src={item.thumb}
                          alt="historique"
                          className="w-full h-full object-cover p-0.5"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white">Éditer</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-white/45 italic">
                    Aucune création encore sauvegardée sur cet appareil.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE EDUCATION / ACCORDION */}
        <div className="mt-28 text-left max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b border-white/10 pb-3">
            FAQ — Tout savoir sur les QR codes
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Pourquoi opter pour un QR code personnalisé ?",
                a: "Un QR code assorti à vos couleurs ou arborant un motif adorable renforce instantanément l'identité de votre entreprise. Il rassure vos clients et améliore naturellement les scans de vos cartes de visite, tables de restaurant ou supports publicitaires.",
              },
              {
                q: "Un QR code coloré ou en forme est-il lisible par tous les mobiles ?",
                a: "Oui ! Les algorithmes d'erreur de QRCode.js garantissent une correction d'erreur de niveau intermédiaire (Médium/Élevé). Ainsi, même avec une forme originale, un logo au centre ou des contrastes colorés, n'importe quel smartphone moderne détectera et lira parfaitement l'information.",
              },
              {
                q: "Quelle est la taille minimale recommandée pour l'impression ?",
                a: "Nous vous recommandons une dimension minimale de 2,5 cm par 2,5 cm une fois imprimé pour assurer un scan fulgurant. Grâce à notre option de téléchargement Haute Définition (1000px), vous conservez une netteté absolue sans aucune pixellisation pour l'impression grand format.",
              },
            ].map((faq, i) => (
              <div key={i} className="glass rounded-2xl border border-white/5 overflow-hidden">
                <button
                  className="w-full text-left px-5 py-3.5 font-bold text-sm sm:text-base flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${expandedFaq === i ? "rotate-90" : ""}`}
                  />
                </button>
                <div
                  className={`px-5 overflow-hidden transition-all duration-300 ${expandedFaq === i ? "max-h-64 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-white/70 leading-relaxed text-xs sm:text-sm pt-2 border-t border-white/5">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="mt-24 pt-10 border-t border-white/10 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Besoin d'aller au-delà des QR codes ?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            Vos nouveaux QR codes méritent un espace d'accueil professionnel et rapide. Donnez vie à
            un site vitrine ou e-commerce adorable avec FumaOPS.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full gradient-primary px-6 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.02] glow w-full sm:w-auto"
            >
              Créer mon site web pro avec FumaOPS 🚀
            </Link>
            <Link
              to="/outils"
              className="text-white/60 hover:text-white text-xs font-semibold hover:underline"
            >
              ← Autre outil gratuit
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
