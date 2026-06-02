// Static Cost of Living and metadata properties for Budget Planner

export interface Theme {
  id: string;
  name: string;
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  accentPrimary: string;
  accentSecondary: string;
  accentThird: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  gradient: string;
}

export const themes: Record<string, Theme> = {
  pastel: {
    id: "pastel",
    name: "🌸 Cute Pastel",
    bgPrimary: "#FFF0F7",
    bgSecondary: "#FFE4F0",
    bgCard: "#FFFFFF",
    accentPrimary: "#FF69B4",
    accentSecondary: "#C084FC",
    accentThird: "#60D394",
    textPrimary: "#2D1B35",
    textSecondary: "#8B5E7A",
    border: "#FFB3D9",
    gradient: "linear-gradient(135deg, #FFE4F0, #F0E8FF)",
  },
  darkPro: {
    id: "darkPro",
    name: "🖤 Dark Pro",
    bgPrimary: "#0A0A0F",
    bgSecondary: "#111118",
    bgCard: "#1A1A25",
    accentPrimary: "#FF6B00",
    accentSecondary: "#C9A96E",
    accentThird: "#00FF88",
    textPrimary: "#FFFFFF",
    textSecondary: "#888899",
    border: "#2A2A35",
    gradient: "linear-gradient(135deg, #0A0A0F, #1A0A00)",
  },
  nature: {
    id: "nature",
    name: "🌿 Nature",
    bgPrimary: "#F0F7F0",
    bgSecondary: "#E4F0E4",
    bgCard: "#FFFFFF",
    accentPrimary: "#2D8A4E",
    accentSecondary: "#7BC67E",
    accentThird: "#F9A825",
    textPrimary: "#1A2E1A",
    textSecondary: "#5A7A5A",
    border: "#B3D9B3",
    gradient: "linear-gradient(135deg, #E4F0E4, #FFF8E1)",
  },
  ocean: {
    id: "ocean",
    name: "💙 Ocean",
    bgPrimary: "#E8F4FF",
    bgSecondary: "#D0E8FF",
    bgCard: "#FFFFFF",
    accentPrimary: "#0066CC",
    accentSecondary: "#00ACC1",
    accentThird: "#FF6B6B",
    textPrimary: "#0A1A2E",
    textSecondary: "#4A6A8A",
    border: "#99CCFF",
    gradient: "linear-gradient(135deg, #D0E8FF, #E0F7FA)",
  },
  fuma: {
    id: "fuma",
    name: "🔥 FumaOPS",
    bgPrimary: "#0A0A0A",
    bgSecondary: "#111111",
    bgCard: "#1A1A1A",
    accentPrimary: "#FF6B00",
    accentSecondary: "#FF8C00",
    accentThird: "#00FF88",
    textPrimary: "#FFFFFF",
    textSecondary: "#888888",
    border: "#FF6B0033",
    gradient: "linear-gradient(135deg, #1A0500, #0A0A0A)",
  },
};

export const countries = [
  { code: "MA", name: "Maroc", flag: "🇲🇦", currency: "MAD" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR" },
  { code: "BE", name: "Belgique", flag: "🇧🇪", currency: "EUR" },
  { code: "CH", name: "Suisse", flag: "🇨🇭", currency: "CHF" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳", currency: "TND" },
  { code: "DZ", name: "Algérie", flag: "🇩🇿", currency: "DZD" },
  { code: "SN", name: "Sénégal", flag: "🇸🇳", currency: "XOF" },
  { code: "AUTRE", name: "Autre", flag: "🌍", currency: "EUR" },
];

export const citiesPerCountry: Record<string, string[]> = {
  MA: [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Tanger",
    "Fès",
    "Agadir",
    "Meknès",
    "Oujda",
    "Autre ville",
  ],
  FR: [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Bordeaux",
    "Nantes",
    "Lille",
    "Strasbourg",
    "Nice",
    "Montpellier",
    "Autre ville",
  ],
  BE: ["Bruxelles", "Liège", "Anvers", "Gand", "Autre ville"],
  CH: ["Genève", "Lausanne", "Zurich", "Berne", "Autre ville"],
  CA: ["Montréal", "Toronto", "Québec", "Vancouver", "Autre ville"],
  TN: ["Tunis", "Sfax", "Sousse", "Autre ville"],
  DZ: ["Alger", "Oran", "Constantine", "Autre ville"],
  SN: ["Dakar", "Saint-Louis", "Thiès", "Autre ville"],
  AUTRE: ["Autre ville"],
};

export interface SchoolCosts {
  creche: number;
  maternelle_public: number;
  maternelle_prive: number;
  primaire_public: number;
  primaire_prive: number;
  college_public: number;
  college_prive: number;
  lycee_public: number;
  lycee_prive: number;
  universite_public: number;
  universite_prive: number;
}

export interface CityCost {
  food_adult: number;
  food_child: number;
  transport_public: number;
  transport_car: number;
  utilities: number;
  internet: number;
  phone: number;
  school: SchoolCosts;
  leisure_mult: number;
}

// Fallback template for any missing city config
const defaultSchoolTemplate: SchoolCosts = {
  creche: 1200,
  maternelle_public: 0,
  maternelle_prive: 800,
  primaire_public: 0,
  primaire_prive: 800,
  college_public: 0,
  college_prive: 1000,
  lycee_public: 0,
  lycee_prive: 1200,
  universite_public: 100,
  universite_prive: 2500,
};

const makeCityCost = (override: Partial<CityCost>): CityCost => {
  return {
    food_adult: 1500,
    food_child: 750,
    transport_public: 200,
    transport_car: 1200,
    utilities: 500,
    internet: 200,
    phone: 100,
    school: { ...defaultSchoolTemplate },
    leisure_mult: 1.0,
    ...override,
  };
};

export const costOfLiving: Record<string, Record<string, CityCost>> = {
  MA: {
    Casablanca: makeCityCost({
      food_adult: 1800,
      food_child: 900,
      transport_public: 300,
      transport_car: 1500,
      utilities: 600,
      internet: 199,
      phone: 150,
      school: {
        creche: 1500,
        maternelle_public: 0,
        maternelle_prive: 1200,
        primaire_public: 0,
        primaire_prive: 1000,
        college_public: 0,
        college_prive: 1500,
        lycee_public: 0,
        lycee_prive: 2000,
        universite_public: 500,
        universite_prive: 3000,
      },
    }),
    Rabat: makeCityCost({
      food_adult: 1600,
      food_child: 800,
      transport_public: 250,
      transport_car: 1300,
      utilities: 550,
      internet: 199,
      phone: 150,
      school: {
        creche: 1400,
        maternelle_public: 0,
        maternelle_prive: 1100,
        primaire_public: 0,
        primaire_prive: 900,
        college_public: 0,
        college_prive: 1300,
        lycee_public: 0,
        lycee_prive: 1800,
        universite_public: 400,
        universite_prive: 2500,
      },
    }),
    Marrakech: makeCityCost({ food_adult: 1500, food_child: 750 }),
    Tanger: makeCityCost({ food_adult: 1500, food_child: 750 }),
    Fès: makeCityCost({ food_adult: 1300, food_child: 650 }),
    Agadir: makeCityCost({ food_adult: 1400, food_child: 700 }),
    Meknès: makeCityCost({ food_adult: 1300, food_child: 650 }),
    Oujda: makeCityCost({ food_adult: 1200, food_child: 600 }),
    "Autre ville": makeCityCost({ food_adult: 1200, food_child: 600 }),
  },
  FR: {
    Paris: makeCityCost({
      food_adult: 450,
      food_child: 250,
      transport_public: 86,
      transport_car: 400,
      utilities: 150,
      internet: 30,
      phone: 20,
      school: {
        creche: 300,
        maternelle_public: 0,
        maternelle_prive: 400,
        primaire_public: 0,
        primaire_prive: 400,
        college_public: 0,
        college_prive: 500,
        lycee_public: 0,
        lycee_prive: 600,
        universite_public: 170,
        universite_prive: 800,
      },
    }),
    Lyon: makeCityCost({
      food_adult: 380,
      food_child: 200,
      transport_public: 70,
      transport_car: 300,
      utilities: 130,
      internet: 25,
      phone: 15,
      school: {
        creche: 250,
        maternelle_public: 0,
        maternelle_prive: 300,
        primaire_public: 0,
        primaire_prive: 300,
        college_public: 0,
        college_prive: 400,
        lycee_public: 0,
        lycee_prive: 500,
        universite_public: 170,
        universite_prive: 600,
      },
    }),
    Marseille: makeCityCost({ food_adult: 350, food_child: 180 }),
    Toulouse: makeCityCost({ food_adult: 350, food_child: 180 }),
    Bordeaux: makeCityCost({ food_adult: 360, food_child: 190 }),
    Nantes: makeCityCost({ food_adult: 340, food_child: 170 }),
    Lille: makeCityCost({ food_adult: 340, food_child: 170 }),
    Strasbourg: makeCityCost({ food_adult: 340, food_child: 170 }),
    Nice: makeCityCost({ food_adult: 370, food_child: 190 }),
    Montpellier: makeCityCost({ food_adult: 330, food_child: 170 }),
    "Autre ville": makeCityCost({ food_adult: 300, food_child: 150 }),
  },
  BE: {
    Bruxelles: makeCityCost({
      food_adult: 400,
      food_child: 220,
      transport_public: 50,
      transport_car: 350,
      utilities: 140,
      internet: 45,
      phone: 25,
      school: {
        creche: 250,
        maternelle_public: 0,
        maternelle_prive: 300,
        primaire_public: 0,
        primaire_prive: 300,
        college_public: 0,
        college_prive: 400,
        lycee_public: 0,
        lycee_prive: 500,
        universite_public: 100,
        universite_prive: 600,
      },
    }),
    Liège: makeCityCost({ food_adult: 350, food_child: 180 }),
    Anvers: makeCityCost({ food_adult: 380, food_child: 200 }),
    Gand: makeCityCost({ food_adult: 370, food_child: 190 }),
    "Autre ville": makeCityCost({ food_adult: 320, food_child: 160 }),
  },
  CH: {
    Genève: makeCityCost({
      food_adult: 700,
      food_child: 400,
      transport_public: 100,
      transport_car: 600,
      utilities: 250,
      internet: 60,
      phone: 40,
      school: {
        creche: 800,
        maternelle_public: 0,
        maternelle_prive: 900,
        primaire_public: 0,
        primaire_prive: 900,
        college_public: 0,
        college_prive: 1100,
        lycee_public: 0,
        lycee_prive: 1300,
        universite_public: 500,
        universite_prive: 2500,
      },
    }),
    Lausanne: makeCityCost({ food_adult: 650, food_child: 360, transport_public: 90 }),
    Zurich: makeCityCost({ food_adult: 720, food_child: 420, transport_public: 100 }),
    Berne: makeCityCost({ food_adult: 620, food_child: 340, transport_public: 85 }),
    "Autre ville": makeCityCost({ food_adult: 550, food_child: 300, transport_public: 80 }),
  },
  CA: {
    Montréal: makeCityCost({
      food_adult: 500,
      food_child: 280,
      transport_public: 94,
      transport_car: 450,
      utilities: 150,
      internet: 60,
      phone: 45,
      school: {
        creche: 200,
        maternelle_public: 0,
        maternelle_prive: 450,
        primaire_public: 0,
        primaire_prive: 450,
        college_public: 0,
        college_prive: 500,
        lycee_public: 0,
        lycee_prive: 600,
        universite_public: 250,
        universite_prive: 1200,
      },
    }),
    Toronto: makeCityCost({ food_adult: 600, food_child: 320, transport_public: 140 }),
    Québec: makeCityCost({ food_adult: 480, food_child: 260, transport_public: 90 }),
    Vancouver: makeCityCost({ food_adult: 620, food_child: 340, transport_public: 130 }),
    "Autre ville": makeCityCost({ food_adult: 450, food_child: 240, transport_public: 85 }),
  },
  TN: {
    Tunis: makeCityCost({
      food_adult: 500,
      food_child: 250,
      transport_public: 60,
      transport_car: 400,
      utilities: 100,
      internet: 50,
      phone: 30,
      school: {
        creche: 400,
        maternelle_public: 0,
        maternelle_prive: 300,
        primaire_public: 0,
        primaire_prive: 300,
        college_public: 0,
        college_prive: 400,
        lycee_public: 0,
        lycee_prive: 450,
        universite_public: 100,
        universite_prive: 1000,
      },
    }),
    Sfax: makeCityCost({ food_adult: 450, food_child: 220 }),
    Sousse: makeCityCost({ food_adult: 460, food_child: 230 }),
    "Autre ville": makeCityCost({ food_adult: 400, food_child: 200 }),
  },
  DZ: {
    Alger: makeCityCost({
      food_adult: 8000,
      food_child: 4000,
      transport_public: 2000,
      transport_car: 8000,
      utilities: 3000,
      internet: 2500,
      phone: 1500,
      school: {
        creche: 6000,
        maternelle_public: 0,
        maternelle_prive: 5000,
        primaire_public: 0,
        primaire_prive: 5000,
        college_public: 0,
        college_prive: 6000,
        lycee_public: 0,
        lycee_prive: 7000,
        universite_public: 1000,
        universite_prive: 15000,
      },
    }),
    Oran: makeCityCost({ food_adult: 7500, food_child: 3800 }),
    Constantine: makeCityCost({ food_adult: 7200, food_child: 3600 }),
    "Autre ville": makeCityCost({ food_adult: 6500, food_child: 3200 }),
  },
  SN: {
    Dakar: makeCityCost({
      food_adult: 80000,
      food_child: 40000,
      transport_public: 15000,
      transport_car: 90000,
      utilities: 35000,
      internet: 25000,
      phone: 10000,
      school: {
        creche: 50000,
        maternelle_public: 0,
        maternelle_prive: 40000,
        primaire_public: 0,
        primaire_prive: 45000,
        college_public: 0,
        college_prive: 50000,
        lycee_public: 0,
        lycee_prive: 60000,
        universite_public: 10000,
        universite_prive: 120000,
      },
    }),
    "Saint-Louis": makeCityCost({ food_adult: 60000, food_child: 30000 }),
    Thiès: makeCityCost({ food_adult: 65000, food_child: 33000 }),
    "Autre ville": makeCityCost({ food_adult: 50000, food_child: 25000 }),
  },
  AUTRE: {
    "Autre ville": makeCityCost({
      food_adult: 300,
      food_child: 150,
      transport_public: 60,
      transport_car: 300,
      utilities: 100,
      internet: 30,
      phone: 15,
      school: {
        creche: 300,
        maternelle_public: 0,
        maternelle_prive: 250,
        primaire_public: 0,
        primaire_prive: 250,
        college_public: 0,
        college_prive: 300,
        lycee_public: 0,
        lycee_prive: 350,
        universite_public: 100,
        universite_prive: 1000,
      },
    }),
  },
};

export const tipsOfTheMonth = [
  "🏦 Payez-vous en premier : épargnez dès réception du salaire ou des revenus.",
  "📊 Règle 50/30/20 : 50% pour les besoins essentiels, 30% pour les envies, et 20% pour l'épargne.",
  "🎯 Un objectif sans plan d'action reste un simple rêve. Planifiez-le dès maintenant.",
  "💡 Réduisez les abonnements inutilisés ou doublons : une méthode d'économie simple et ultra rapide.",
];

export function estimateRent(city: string, adults: number, children: number): number {
  // Estimate rent based on family size and basic city multiplier ratios
  const baseRooms = Math.min(4, Math.max(1, adults + Math.ceil(children / 2)));
  const costScaleMap: Record<string, number> = {
    Paris: 1000,
    Lyon: 700,
    Marseille: 600,
    Bruxelles: 800,
    Genève: 1800,
    Casablanca: 3500,
    Rabat: 3000,
    Montréal: 1100,
    Tunis: 500,
    Alger: 25000,
    Dakar: 180000,
  };
  const scale = costScaleMap[city] || 500;
  return Math.round(scale * (0.8 + baseRooms * 0.35));
}
