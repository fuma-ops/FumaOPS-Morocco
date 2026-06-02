import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../../components/Layout";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Download,
  Calendar,
  Wallet,
  TrendingUp,
  Percent,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/outils/budget-planner")({
  component: RouteComponent,
});

// Primary structures
interface PlannerItem {
  name: string;
  actual: number;
}

interface PlannerCategory {
  title: string;
  items: PlannerItem[];
}

interface PlannerIncome {
  id: string;
  source: string;
  amount: number;
  frequency: "Mensuel" | "Annuel" | "Ponctuel";
}

interface Win {
  id: string;
  emoji: string;
  text: string;
}

interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

const getDefaultExpenses = (): PlannerCategory[] => [
  {
    title: "🏠 Logement",
    items: [
      { name: "Loyer / Crédit", actual: 3000 },
      { name: "Électricité", actual: 300 },
      { name: "Internet", actual: 200 }
    ]
  },
  {
    title: "🛒 Alimentation",
    items: [
      { name: "Courses hebdomadaires", actual: 1800 },
      { name: "Restaurants", actual: 400 },
      { name: "Livraisons", actual: 200 }
    ]
  },
  {
    title: "🚗 Transport",
    items: [
      { name: "Carburant", actual: 600 },
      { name: "Tramway / Bus", actual: 200 }
    ]
  },
  {
    title: "📚 Éducation",
    items: [
      { name: "École / Formation", actual: 400 }
    ]
  },
  {
    title: "💊 Santé",
    items: [
      { name: "Médecin / Pharmacie", actual: 150 }
    ]
  },
  {
    title: "🎮 Loisirs",
    items: [
      { name: "Sorties", actual: 500 },
      { name: "Shopping", actual: 300 }
    ]
  },
  {
    title: "💰 Épargne",
    items: [
      { name: "Épargne de secours", actual: 1000 },
      { name: "Investissement", actual: 500 }
    ]
  },
  {
    title: "💳 Dettes",
    items: [
      { name: "Crédit consommation", actual: 400 }
    ]
  },
  {
    title: "📱 Abonnements",
    items: [
      { name: "Téléphone", actual: 120 },
      { name: "Netflix / Spotify", actual: 80 }
    ]
  },
  {
    title: "➕ Divers",
    items: [
      { name: "Imprévus", actual: 300 }
    ]
  }
];

const getDefaultCategoryBudgets = (): Record<string, number> => ({
  "🏠 Logement": 3500,
  "🛒 Alimentation": 2500,
  "🚗 Transport": 1000,
  "📚 Éducation": 500,
  "💊 Santé": 300,
  "🎮 Loisirs": 1000,
  "💰 Épargne": 2000,
  "💳 Dettes": 500,
  "📱 Abonnements": 300,
  "➕ Divers": 500
});

const getDefaultWins = (): Win[] => [
  { id: "win1", emoji: "🥗", text: "J'ai cuisiné à la maison 4 fois" },
  { id: "win2", emoji: "🚭", text: "J'ai refusé 3 achats impulsifs" },
  { id: "win3", emoji: "💰", text: "J'ai épargné 200 MAD de plus" }
];

function RouteComponent() {
  // Calendar Navigation date - Defaulting to May 2026 as per user context
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 4));

  // Key states loaded and synchronized in local storage
  const [plannerIncomes, setPlannerIncomes] = useState<PlannerIncome[]>([]);
  const [plannerExpenses, setPlannerExpenses] = useState<PlannerCategory[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});
  const [wins, setWins] = useState<Win[]>([]);
  const [monthlyNotes, setMonthlyNotes] = useState<string>("");

  // Savings goals (persisted globally across months)
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);

  // Editing paths
  const [editingIncomeField, setEditingIncomeField] = useState<{ id: string; field: "source" | "amount" } | null>(null);
  const [editingExpenseField, setEditingExpenseField] = useState<{ catIndex: number; itemIndex: number; field: "name" | "actual" } | null>(null);
  const [editingBudgetCategory, setEditingBudgetCategory] = useState<string | null>(null);

  // Draft inputs
  const [quickAddQuery, setQuickAddQuery] = useState("");
  const [selectedQuickAddCategory, setSelectedQuickAddCategory] = useState("➕ Divers");
  const [tempBudgetValue, setTempBudgetValue] = useState("");
  const [newExpenseInputs, setNewExpenseInputs] = useState<Record<number, { name: string; actual: string }>>({});

  // Savings goals wizard/form state
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [goalFormStep, setGoalFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalCurrent, setNewGoalCurrent] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");

  // Wins Form state
  const [newWinText, setNewWinText] = useState("");
  const [newWinEmoji, setNewWinEmoji] = useState("🥗");

  // Notifications
  const [notification, setNotification] = useState<{ text: string; type: "success" | "info" } | null>(null);
  const [flashedElement, setFlashedElement] = useState<string | null>(null);

  // Accordion expanded indices
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({
    0: true, // Expand Logement by default
    1: true, // Expand Alimentation by default
  });

  const isLoadedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger brief discrete toast messages
  const triggerToast = (text: string, type: "success" | "info" = "success") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  // Helper animation effect for updated component IDs
  const triggerFlash = (elementId: string) => {
    setFlashedElement(elementId);
    setTimeout(() => {
      setFlashedElement(null);
    }, 800);
  };

  // Monthly data load triggers
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const recordsKey = `budget_${year}_${month}`;
    const storedSnapshot = localStorage.getItem(recordsKey);

    isLoadedRef.current = false;

    if (storedSnapshot) {
      try {
        const parsed = JSON.parse(storedSnapshot);

        if (Array.isArray(parsed.incomes)) {
          setPlannerIncomes(parsed.incomes.map((inc: any) => ({
            id: inc.id || Math.random().toString(),
            source: inc.source || inc.label || "Source",
            amount: typeof inc.amount === 'number' ? inc.amount : (inc.actual || inc.budgeted || 0),
            frequency: inc.frequency || "Mensuel"
          })));
        } else {
          setPlannerIncomes([
            { id: "1", source: "Salaire net principal", amount: 8000, frequency: "Mensuel" }
          ]);
        }

        if (Array.isArray(parsed.expenses)) {
          setPlannerExpenses(parsed.expenses.map((cat: any) => ({
            title: cat.title,
            items: cat.items.map((it: any) => ({
              name: it.name,
              actual: typeof it.actual === 'number' ? it.actual : (it.budgeted || 0)
            }))
          })));
        } else {
          setPlannerExpenses(getDefaultExpenses());
        }

        if (parsed.categoryBudgets) {
          setCategoryBudgets(parsed.categoryBudgets);
        } else {
          setCategoryBudgets(getDefaultCategoryBudgets());
        }

        setMonthlyNotes(parsed.notes || "");

        if (Array.isArray(parsed.wins)) {
          setWins(parsed.wins);
        } else {
          setWins(getDefaultWins());
        }

      } catch (e) {
        console.error("Failed parsing monthly layout data, loading default states.", e);
        setPlannerIncomes([{ id: "1", source: "Salaire net principal", amount: 8000, frequency: "Mensuel" }]);
        setPlannerExpenses(getDefaultExpenses());
        setCategoryBudgets(getDefaultCategoryBudgets());
        setWins(getDefaultWins());
        setMonthlyNotes("");
      }
    } else {
      setPlannerIncomes([
        { id: "1", source: "Salaire net principal", amount: 8000, frequency: "Mensuel" }
      ]);
      setPlannerExpenses(getDefaultExpenses());
      setCategoryBudgets(getDefaultCategoryBudgets());
      setMonthlyNotes("");
      setWins(getDefaultWins());
    }

    // Load active savings goals globally
    const storedGoals = localStorage.getItem("budget_goals");
    if (storedGoals) {
      try {
        setSavingGoals(JSON.parse(storedGoals));
      } catch (err) {
        console.error("Failed loading goal structures", err);
      }
    } else {
      setSavingGoals([
        { id: "1", name: "Fonds d'Urgence", targetAmount: 15000, currentAmount: 3500, targetDate: "2026-12" },
        { id: "2", name: "Vacances d'Été ✈️", targetAmount: 6000, currentAmount: 2000, targetDate: "2026-08" },
      ]);
    }

    setTimeout(() => {
      isLoadedRef.current = true;
    }, 100);

  }, [currentDate]);

  // Autosave Monthly Snapshot Triggers
  useEffect(() => {
    if (!isLoadedRef.current) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const recordsKey = `budget_${year}_${month}`;

    const snapshot = {
      incomes: plannerIncomes,
      expenses: plannerExpenses,
      categoryBudgets,
      notes: monthlyNotes,
      wins
    };

    localStorage.setItem(recordsKey, JSON.stringify(snapshot));
  }, [plannerIncomes, plannerExpenses, categoryBudgets, monthlyNotes, wins]);

  // Navigation handlers
  const navMonth = (offset: number) => {
    const nextLocal = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(nextLocal);
  };

  const formatMonthlyDateStr = () => {
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  // Calculations Core engine
  const totalActualIncomes = plannerIncomes.reduce((acc, row) => {
    if (row.frequency === "Annuel") return acc + (row.amount / 12);
    return acc + row.amount;
  }, 0);

  const getExpensesCategorySum = (category: PlannerCategory, field: "actual" = "actual") => {
    return category.items.reduce((acc, x) => acc + x[field], 0);
  };

  const totalActualExpenses = plannerExpenses.reduce((acc, cat) => acc + getExpensesCategorySum(cat), 0);

  const actualRemainingAmount = totalActualIncomes - totalActualExpenses;

  // Budget Health algorithm
  const healthPercent = totalActualIncomes > 0 
    ? Math.max(0, Math.round(100 - (totalActualExpenses / totalActualIncomes) * 100))
    : 0;

  // Month Forecast with dynamic parameters
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const daysInCurrentMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
  
  const currentSelectedDay = (() => {
    const today = new Date();
    if (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()) {
      return today.getDate();
    }
    return daysInCurrentMonth;
  })();

  const projectedDailyAverage = currentSelectedDay > 0 ? (totalActualExpenses / currentSelectedDay) : 0;
  const projectedMonthlyExpenseEnd = projectedDailyAverage * daysInCurrentMonth;
  const forecastAmount = totalActualIncomes - projectedMonthlyExpenseEnd;

  // Income modification triggers
  const addNewIncomeType = () => {
    const nextId = Date.now().toString();
    const newInc: PlannerIncome = { id: nextId, source: "Revenu additionnel", amount: 1500, frequency: "Mensuel" };
    setPlannerIncomes((p) => [...p, newInc]);
    triggerToast("✓ Source de revenu ajoutée", "success");
    triggerFlash(`income-row-${nextId}`);
  };

  const handleSaveIncomeSource = (id: string, value: string) => {
    setPlannerIncomes((prev) => prev.map((x) => (x.id === id ? { ...x, source: value } : x)));
    setEditingIncomeField(null);
    triggerFlash(`income-row-${id}`);
    triggerToast("✓ Source sauvegardée", "success");
  };

  const handleSaveIncomeAmount = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    setPlannerIncomes((prev) => prev.map((x) => (x.id === id ? { ...x, amount: num } : x)));
    setEditingIncomeField(null);
    triggerFlash(`income-row-${id}`);
    triggerToast("✓ Revenu sauvegardé", "success");
  };

  // Accordion modifiers
  const toggleAccordion = (index: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Add subcategory item functions
  const handleSaveNewExpense = (catIdx: number) => {
    const inp = newExpenseInputs[catIdx];
    if (!inp || !inp.name.trim()) {
      triggerToast("Le nom de la dépense est requis", "info");
      return;
    }
    const val = parseFloat(inp.actual) || 0;

    setPlannerExpenses((prev) => {
      const dup = [...prev];
      dup[catIdx] = {
        ...dup[catIdx],
        items: [...dup[catIdx].items, { name: inp.name.trim(), actual: val }],
      };
      return dup;
    });

    setNewExpenseInputs((prev) => {
      const dup = { ...prev };
      delete dup[catIdx];
      return dup;
    });

    triggerToast(`✓ Dépense added to ${plannerExpenses[catIdx].title}`, "success");
  };

  const handleDeleteExpenseItem = (catIdx: number, itemIdx: number) => {
    setPlannerExpenses((prev) => {
      const dup = [...prev];
      dup[catIdx] = {
        ...dup[catIdx],
        items: dup[catIdx].items.filter((_, idx) => idx !== itemIdx),
      };
      return dup;
    });
    triggerToast("Dépense retirée !", "info");
  };

  // Budget category popup save
  const handleSaveCategoryBudget = () => {
    if (!editingBudgetCategory) return;
    const val = parseFloat(tempBudgetValue) || 0;

    setCategoryBudgets((prev) => ({
      ...prev,
      [editingBudgetCategory]: val,
    }));

    setEditingBudgetCategory(null);
    triggerToast(`✓ Limite de ${editingBudgetCategory} mise à jour !`, "success");
  };

  // Wins functions
  const handleAddWin = () => {
    if (!newWinText.trim()) {
      triggerToast("Saisissez une description !", "info");
      return;
    }
    const newEntry: Win = {
      id: Date.now().toString(),
      emoji: newWinEmoji,
      text: newWinText.trim(),
    };
    setWins((prev) => [...prev, newEntry]);
    setNewWinText("");
    triggerToast("✓ Victoire ajoutée !", "success");
  };

  // Saving goals functions
  const handleAddGoalAction = () => {
    if (!newGoalName.trim() || !newGoalTarget) {
      triggerToast("Le nom et la cible sont requis !", "info");
      return;
    }
    const newG: SavingGoal = {
      id: Date.now().toString(),
      name: newGoalName.trim(),
      targetAmount: parseFloat(newGoalTarget) || 0,
      currentAmount: parseFloat(newGoalCurrent) || 0,
      targetDate: newGoalDate || "2026-12",
    };

    const nextGoals = [...savingGoals, newG];
    setSavingGoals(nextGoals);
    localStorage.setItem("budget_goals", JSON.stringify(nextGoals));

    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalCurrent("");
    setNewGoalDate("");
    setShowAddGoalForm(false);
    setGoalFormStep(1);
    triggerToast("✓ Nouvel objectif d'épargne créé !", "success");
  };

  const handleDeleteSavingGoal = (gid: string) => {
    const nextGoals = savingGoals.filter((x) => x.id !== gid);
    setSavingGoals(nextGoals);
    localStorage.setItem("budget_goals", JSON.stringify(nextGoals));
    triggerToast("Objectif d'épargne supprimé", "info");
  };

  const calculateGoalInstallment = (target: number, current: number, targetMonthStr: string) => {
    const [tYear, tMonth] = targetMonthStr.split("-").map(Number);
    if (!tYear || !tMonth) return 0;

    const curYear = currentDate.getFullYear();
    const curMonth = currentDate.getMonth() + 1;

    const diffMonths = (tYear - curYear) * 12 + (tMonth - curMonth);
    const needed = Math.max(0, target - current);

    if (diffMonths <= 0) return needed;
    return Math.round(needed / diffMonths);
  };

  // Export/Import triggers
  const handleExportDataAsJSON = () => {
    const backup: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("budget_") || k === "budget_goals")) {
        backup[k] = localStorage.getItem(k) || "";
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fumaops_budget_backup_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.json`;
    link.click();
    triggerToast("✓ Rapports de données exportés !", "success");
  };

  const handleRestoreDataFromJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const payload = JSON.parse(event.target?.result as string);
        Object.entries(payload).forEach(([k, val]) => {
          if (typeof val === "string") {
            localStorage.setItem(k, val);
          }
        });
        triggerToast("✓ Toutes les données importées !", "success");
        setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        triggerToast("Format de fichier invalide", "info");
      }
    };
    reader.readAsText(file);
  };

  // Smart regex quick parser
  const handleQuickAdd = () => {
    if (!quickAddQuery.trim()) {
      triggerToast("Saisissez une description rapide", "info");
      return;
    }

    const numberRegex = /(\d+(?:\.\d+)?)/;
    const match = quickAddQuery.match(numberRegex);

    if (!match) {
      triggerToast("Veuillez inclure un montant (ex: 'Courses 120')", "info");
      return;
    }

    const parsedAmount = parseFloat(match[1]);
    let parsedDesc = quickAddQuery
      .replace(numberRegex, "")
      .replace(/MAD|EUR|USD|\$|dirham|dh/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!parsedDesc) {
      parsedDesc = "Achat rapide";
    }

    const targetCategory = selectedQuickAddCategory || "➕ Divers";

    if (targetCategory === "Revenus 💰") {
      const newInc: PlannerIncome = {
        id: Date.now().toString(),
        source: parsedDesc,
        amount: parsedAmount,
        frequency: "Mensuel",
      };
      setPlannerIncomes((prev) => [...prev, newInc]);
      triggerToast(`✓ Revenu ajouté : ${parsedDesc} (+${parsedAmount} MAD) !`, "success");
    } else {
      setPlannerExpenses((prev) => {
        return prev.map((cat) => {
          if (cat.title === targetCategory) {
            return {
              ...cat,
              items: [...cat.items, { name: parsedDesc, actual: parsedAmount }],
            };
          }
          return cat;
        });
      });
      triggerToast(`✓ Dépense ajoutée : ${parsedDesc} (${parsedAmount} MAD) !`, "success");
    }

    setQuickAddQuery("");
    setSelectedQuickAddCategory("➕ Divers");
  };

  // Pie chart computations
  const chartData = plannerExpenses
    .map((cat) => ({
      name: cat.title.replace(/[^\w\sÀ-ÿ]/g, "").trim(),
      value: getExpensesCategorySum(cat),
    }))
    .filter((d) => d.value > 0);

  // Coordinated premium cool blue-grey palette matching user request
  const COLORS = [
    "#8EB1D1", // Cool Cerulean
    "#A7C7E7", // Baby Blue Eyes
    "#1C2B48", // Midnight Blue
    "#C4D8E5", // Light Blue Grey
    "#E8ECEF", // Platinum
    "#5C82A6", // Medium Cerulean
    "#7BA1C7", // Lighter Cerulean
    "#344E73", // Secondary Midnight Blue
    "#A1C1DF", // Soft cerulean
    "#D0DEEB"  // Soft light blue eye
  ];

  return (
    <PageShell>
      <div 
        id="budget-planner-app" 
        className="budget-page-wrapper text-[#1C2B48] font-sans bg-gradient-to-tr from-[#C4D8E5]/45 via-[#E8ECEF]/35 to-[#8EB1D1]/40 backdrop-blur-2xl max-w-7xl mx-4 sm:mx-6 lg:mx-auto my-6 sm:my-12 rounded-[2rem] sm:rounded-[3rem] shadow-[0_24px_80px_rgba(28,43,72,0.12)] border border-white/60 p-6 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute top-10 left-[-15%] w-[450px] h-[450px] rounded-full bg-[#8EB1D1]/25 blur-[90px] pointer-events-none animate-float" />
        <div className="absolute top-[35%] right-[-20%] w-[550px] h-[550px] rounded-full bg-[#A7C7E7]/20 blur-[100px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-[8%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/20 blur-[90px] pointer-events-none animate-float delay-300" />
        <div className="absolute top-[65%] left-[25%] w-[250px] h-[250px] rounded-full bg-[#C4D8E5]/25 blur-[70px] pointer-events-none animate-float" />
        <div className="absolute top-[15%] left-[45%] w-[320px] h-[320px] rounded-full bg-white/10 blur-[80px] pointer-events-none" />

        {/* Fixed Toast notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1C2B48]/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-white/20"
            >
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-ping" />
              {notification.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer app let container */}
        <div className="budget-container relative z-10">
          
          {/* Back link breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2B48]/75 select-none animate-fade-in">
            <Link to="/" className="hover:text-white transition-all underline decoration-[#1C2B48]/20 hover:decoration-[#1C2B48]">Tableau de bord</Link>
            <span>/</span>
            <span className="text-[#1C2B48]">Premium Budget Planner</span>
          </div>

          {/* SECTION 1 — HEADER NAVIGATION MOIS */}
          <div id="section-header-nav" className="budget-card flex flex-col sm:flex-row gap-5 items-center justify-between">
            <div className="flex items-center gap-5 justify-between w-full sm:w-auto">
              <button
                id="btn-prev-month"
                onClick={() => navMonth(-1)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 border border-white/50 text-[#1C2B48] hover:bg-white/65 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-[#8EB1D1]" />
              </button>
              
              <div className="flex flex-col items-center min-w-[140px] select-none text-center">
                <span className="text-xl font-black text-[#1C2B48] uppercase tracking-wider">
                  {formatMonthlyDateStr()}
                </span>
                <span className="text-[10px] font-extrabold text-[#1C2B48]/65 uppercase tracking-widest mt-0.5">Planificateur Mensuel</span>
              </div>

              <button
                id="btn-next-month"
                onClick={() => navMonth(1)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 border border-white/50 text-[#1C2B48] hover:bg-white/65 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-[#8EB1D1]" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleRestoreDataFromJSON}
              />
              <button
                id="btn-import-data"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-2xl border border-white/50 bg-white/35 hover:bg-white/60 text-[#1C2B48] transition-all cursor-pointer shadow-sm active:scale-95 w-full sm:w-auto"
              >
                <Upload className="w-4 h-4 text-[#8EB1D1]" /> Importer
              </button>
              <button
                id="btn-export-data"
                onClick={handleExportDataAsJSON}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-2xl border border-white/50 bg-white/35 hover:bg-white/60 text-[#1C2B48] transition-all cursor-pointer shadow-sm active:scale-95 w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-[#8EB1D1]" /> Exporter
              </button>
            </div>
          </div>

          {/* SECTION 2 — BARRE RÉSUMÉ TOP */}
          <div id="section-summary-row" className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4.5 select-none">
            
            {/* Card 1: Income */}
            <div className="metric-card flex flex-col justify-between bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-white/10 border border-white/45 shadow-[0_8px_32px_rgba(16,185,129,0.08)]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0D4B2A]">Revenus 💚</span>
              <div className="metric-value text-[#064221] my-1">
                {totalActualIncomes.toLocaleString()} <span className="text-xs font-black">MAD</span>
              </div>
              <span className="text-[10px] font-extrabold text-[#0D4B2A]/70 block">Rentrées mensuelles</span>
            </div>
 
            {/* Card 2: Spending */}
            <div className="metric-card flex flex-col justify-between bg-gradient-to-br from-rose-500/20 via-pink-400/15 to-white/10 border border-white/45 shadow-[0_8px_32px_rgba(244,63,94,0.08)]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-900">Dépenses 🔴</span>
              <div className="metric-value text-rose-950 my-1">
                {totalActualExpenses.toLocaleString()} <span className="text-xs font-black">MAD</span>
              </div>
              <div className="text-[10px] font-extrabold text-rose-900/80">
                {totalActualExpenses > totalActualIncomes ? (
                  <span className="text-red-700 flex items-center gap-0.5 animate-pulse">⚠️ Dépassement</span>
                ) : (
                  <span>{projectedDailyAverage.toFixed(1)} MAD/jr moy</span>
                )}
              </div>
            </div>
 
            {/* Card 3: Remaining */}
            <div className={`metric-card flex flex-col justify-between border border-white/45 shadow-[0_8px_32px_rgba(14,165,233,0.08)] ${actualRemainingAmount >= 0 ? 'bg-gradient-to-br from-[#8EB1D1]/20 via-[#E8ECEF]/15 to-white/10 text-[#1C2B48]' : 'bg-gradient-to-br from-rose-600/25 via-[#FFE4F0]/15 to-white/10 text-rose-950'}`}>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#162D4A]">Solde Restant 💙</span>
              <div className="metric-value my-1">
                {actualRemainingAmount.toLocaleString()} <span className="text-xs font-black">MAD</span>
              </div>
              <span className="text-[10px] font-extrabold text-[#1C2B48]/75">
                {actualRemainingAmount >= 0 ? "Solde positif 😊" : "Budget dépassé 😟"}
              </span>
            </div>
 
            {/* Card 4: Budget Health */}
            <div className="metric-card flex flex-col justify-between bg-gradient-to-br from-[#A7C7E7]/25 via-[#E8ECEF]/15 to-white/10 border border-white/45 shadow-[0_8px_32px_rgba(28,43,72,0.06)]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1C2B48]">Score de santé ❄️</span>
              <div className="metric-value text-[#1C2B48] my-1">
                {healthPercent}%
              </div>
              <div className="w-full bg-white/45 rounded-full h-1.5 mt-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    healthPercent < 50 ? "bg-red-500" : healthPercent < 80 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-extrabold text-[#1C2B48]/70 block pt-1">Santé globale</span>
            </div>
 
            {/* Card 5: Month Forecast */}
            <div className={`metric-card flex flex-col justify-between border border-white/45 shadow-[0_8px_32px_rgba(28,43,72,0.06)] col-span-1 ${forecastAmount >= 0 ? 'bg-gradient-to-br from-[#C4D8E5]/30 via-[#E8ECEF]/15 to-white/10 text-[#1C2B48]' : 'bg-gradient-to-br from-rose-600/25 via-[#FFE4F0]/15 to-white/10 text-rose-950'}`}>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1C2B48]/80">Prévision fin 🟠</span>
              <div className="metric-value my-1">
                {Math.round(forecastAmount).toLocaleString()} <span className="text-xs font-black">MAD</span>
              </div>
              <span className="text-[10px] font-extrabold text-[#1C2B48]/75 block leading-tight">
                {forecastAmount >= 0 ? "Projection d'épargne" : "Déficit estimé"}
              </span>
            </div>
 
          </div>
 
          {/* SECTION 3 — QUICK ADD */}
          <div id="section-quick-add" className="quick-add-card space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-black text-[#1C2B48] uppercase tracking-wider select-none">
              <span className="text-sm">⚡</span>
              <span>Ajout Rapide Intelligent</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full flex-grow">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8EB1D1]">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  className="quick-add-input w-full pl-10 pr-4 py-3 placeholder:text-[#1C2B48]/40 text-sm focus:outline-none"
                  placeholder="Ex: 'Café 15' ou 'Loyer 3000'..."
                  value={quickAddQuery}
                  onChange={(e) => setQuickAddQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd(); }}
                />
              </div>

              <div className="w-full sm:w-auto min-w-[210px]">
                <select
                  className="quick-add-input w-full py-3 px-4 text-[#1C2B48] cursor-pointer focus:outline-none"
                  value={selectedQuickAddCategory}
                  onChange={(e) => setSelectedQuickAddCategory(e.target.value)}
                >
                  <option value="" className="text-[#1C2B48]">Sélectionner une catégorie...</option>
                  <option value="Revenus 💰" className="text-[#1C2B48] font-bold">Revenus 💰</option>
                  {plannerExpenses.map((cat) => (
                    <option key={cat.title} value={cat.title} className="text-[#1C2B48]">{cat.title}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleQuickAdd}
                className="btn-add-primary w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" /> Ajouter
              </button>
            </div>
          </div>

          {/* MAIN COLUMN & SIDEBAR RESPONSIVE GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* LEFT MAIN COL: Dépenses, Revenus, Wins, Notes */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              
              {/* SECTION 4 — REVENUS & OBJECTIFS */}
              <div id="section-revenues-list" className="budget-card space-y-4">
                <div className="section-header">
                  <div className="section-title">
                    <span className="text-lg">💶</span>
                    <span>Rentrées d'Argent</span>
                  </div>
                  <button 
                    onClick={addNewIncomeType}
                    className="text-xs font-bold text-[#1C2B48] bg-white/50 border border-white/60 hover:bg-white px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Source
                  </button>
                </div>

                <div className="space-y-2">
                  {/* Grid Headers */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-xs font-black text-[#1C2B48]/60 pb-2.5 px-3 border-b border-white/20 select-none uppercase tracking-wider">
                    <div className="col-span-6">Source de revenus</div>
                    <div className="col-span-3 text-right">Montant</div>
                    <div className="col-span-2 text-center">Intervalle</div>
                    <div className="col-span-1 text-center">×</div>
                  </div>

                  {plannerIncomes.map((inc) => (
                    <div
                      key={inc.id}
                      id={`income-row-${inc.id}`}
                      className={`income-row grid grid-cols-1 sm:grid-cols-12 gap-3 items-center ${
                        flashedElement === `income-row-${inc.id}` ? "bg-emerald-400/25 border-emerald-300" : ""
                      }`}
                    >
                      <div className="col-span-6 flex items-center gap-2">
                        {editingIncomeField?.id === inc.id && editingIncomeField?.field === "source" ? (
                          <input 
                            type="text"
                            autoFocus
                            className="w-full px-3 py-2 border border-[#8EB1D1]/40 bg-white/90 rounded-xl focus:outline-none focus:border-[#8EB1D1] text-xs font-black text-[#1C2B48] shadow-inner"
                            value={inc.source}
                            onChange={(e) => {
                              setPlannerIncomes((p) => p.map((x) => (x.id === inc.id ? { ...x, source: e.target.value } : x)));
                            }}
                            onBlur={() => handleSaveIncomeSource(inc.id, inc.source)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveIncomeSource(inc.id, inc.source); }}
                          />
                        ) : (
                          <div 
                            onClick={() => setEditingIncomeField({ id: inc.id, field: "source" })}
                            className="text-xs font-extrabold text-[#1C2B48] cursor-pointer hover:bg-white/40 p-1.5 rounded-xl w-full transition-all flex items-center gap-1"
                          >
                            <span>💰</span> <span>{inc.source}</span>
                          </div>
                        )}
                      </div>

                      <div className="col-span-3 text-right">
                        {editingIncomeField?.id === inc.id && editingIncomeField?.field === "amount" ? (
                          <input 
                            type="number"
                            autoFocus
                            className="w-full px-3 py-2 border border-[#8EB1D1]/40 bg-white/90 rounded-xl focus:outline-none focus:border-[#8EB1D1] text-xs font-black text-right text-[#1C2B48] shadow-inner"
                            value={inc.amount}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setPlannerIncomes((p) => p.map((x) => (x.id === inc.id ? { ...x, amount: val } : x)));
                            }}
                            onBlur={() => handleSaveIncomeAmount(inc.id, inc.amount.toString())}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveIncomeAmount(inc.id, inc.amount.toString()); }}
                          />
                        ) : (
                          <div 
                            onClick={() => setEditingIncomeField({ id: inc.id, field: "amount" })}
                            className="text-xs font-black text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer p-1.5 px-3 rounded-xl text-right transition-all inline-block w-auto border border-emerald-500/20 shadow-2xs"
                          >
                            {inc.amount.toLocaleString()} MAD
                          </div>
                        )}
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <select
                          className="text-[10px] font-black py-1.5 px-2.5 bg-white/40 border border-white/50 text-[#1C2B48] rounded-xl focus:outline-none focus:border-[#8EB1D1] cursor-pointer shadow-inner"
                          value={inc.frequency}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setPlannerIncomes((p) => p.map((x) => (x.id === inc.id ? { ...x, frequency: val } : x)));
                            triggerToast("✓ Fréquence sauvegardée", "success");
                          }}
                        >
                          <option value="Mensuel" className="text-[#1C2B48]">Mensuel</option>
                          <option value="Annuel" className="text-[#1C2B48]">Annuel</option>
                          <option value="Ponctuel" className="text-[#1C2B48]">Ponctuel</option>
                        </select>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => {
                            setPlannerIncomes((p) => p.filter((x) => x.id !== inc.id));
                            triggerToast("Revenu supprimé", "info");
                          }}
                          className="p-2 text-stone-400 hover:text-[#1C2B48] hover:bg-stone-100/50 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-[#8EB1D1]" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/25 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span className="text-[11px] text-[#1C2B48]/60 font-semibold leading-relaxed italic">
                    Astuce : Cliquez sur une valeur pour la modifier instantanément.
                  </span>
                  <div className="text-xs font-black text-emerald-800 bg-emerald-500/15 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs">
                    Total mensuel : {totalActualIncomes.toLocaleString()} MAD
                  </div>
                </div>

              </div>

              {/* SECTION 5 — DÉPENSES PAR CATÉGORIE Accordion */}
              <div id="section-expenses-categorized" className="space-y-4">
                <div className="section-header">
                  <div className="section-title">
                    <span className="text-lg">💸</span>
                    <span>Dépenses par catégorie</span>
                  </div>
                  <span className="section-total-pill uppercase tracking-wider">
                    Total : {totalActualExpenses.toLocaleString()} MAD
                  </span>
                </div>

                <div className="space-y-3.5">
                  {plannerExpenses.map((cat, catIdx) => {
                    const spentSum = getExpensesCategorySum(cat);
                    const budgetLimit = cat.budget;
                    const ratio = budgetLimit > 0 ? (spentSum / budgetLimit) * 100 : 0;
                    const isExpanded = expandedCategoryIndices.includes(catIdx);
                    return (
                      <div 
                        key={cat.title} 
                        id={`expense-category-${catIdx}`}
                        className={`bg-white/30 border rounded-3xl backdrop-blur-md transition-all duration-300 overflow-hidden ${
                          isExpanded 
                            ? "border-white/75 shadow-[0_12px_36px_rgba(28,43,72,0.1)] bg-white/45" 
                            : "border-white/45 hover:border-white/75 hover:shadow-[0_8px_24px_rgba(28,43,72,0.05)] hover:bg-white/35"
                        }`}
                      >
                        
                        {/* ACCORDION BAR HEADER */}
                        <div 
                           onClick={() => toggleAccordion(catIdx)} 
                          className="p-4.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 cursor-pointer select-none font-sans"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black">{cat.title.split(" ")[0]}</span>
                            <span className="text-sm font-black text-[#1C2B48]">{cat.title.split(" ").slice(1).join(" ")}</span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-[#1C2B48]/80">
                                {spentSum.toLocaleString()} / {budgetLimit.toLocaleString()} MAD
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingBudgetCategory(cat.title);
                                  setTempBudgetValue(budgetLimit.toString());
                                }}
                                className="p-1 px-1.5 bg-white/50 hover:bg-white border border-white/60 text-[#8EB1D1] hover:text-[#1C2B48] hover:scale-110 active:scale-95 rounded-lg transition-all text-xs cursor-pointer shadow-2xs"
                                title="Modifier le prévisionnel"
                              >
                                ✏️
                              </button>
                            </div>

                            <div className="text-xs font-black px-3 py-1.5 rounded-2xl bg-white/60 hover:bg-white border border-white/65 text-[#1C2B48] shadow-2xs transition-all">
                              {isExpanded ? "▲ Fermer" : "▼ Détails"}
                            </div>
                          </div>
                        </div>

                        {/* CAT SPENT METER */}
                        <div className="px-4.5 pb-3.5 bg-white/10 space-y-1.5 border-t border-white/20">
                          <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden shadow-inner">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                ratio < 60 ? "bg-emerald-500" : ratio <= 100 ? "bg-amber-500" : "bg-red-500 animate-pulse"
                              }`}
                              style={{ width: `${Math.min(100, ratio)}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black">
                            <span className="text-[#1C2B48]/60 uppercase tracking-wider">Taux d'utilisation</span>
                            <span className={ratio > 100 ? "text-red-500 font-extrabold animate-bounce" : "text-[#1C2B48]"}>
                              {Math.round(ratio)}% {ratio > 100 ? "⚠️ Dépassement de budget !" : ""}
                            </span>
                          </div>
                        </div>

                        {/* ACCORDION CONTENT LINES */}
                        {isExpanded && (
                          <div className="p-4.5 border-t border-white/20 space-y-3 bg-white/15">
                            <div className="space-y-2">
                              {cat.items.map((it, itemIdx) => (
                                <div 
                                  key={`${it.name}-${itemIdx}`} 
                                  className="flex items-center justify-between p-3 rounded-2xl border border-white/50 bg-white/55 hover:bg-white/80 transition-all duration-250 shadow-2xs"
                                >
                                  {/* Subcategory name inline editor */}
                                  <div className="flex-grow">
                                    {editingExpenseField?.catIndex === catIdx && editingExpenseField?.itemIndex === itemIdx && editingExpenseField?.field === "name" ? (
                                      <input 
                                        type="text"
                                        autoFocus
                                        className="px-3 py-1.5 border border-[#FF5F7E]/40 text-xs font-black rounded-xl bg-white focus:outline-none focus:border-[#FF5F7E]"
                                        value={it.name}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setPlannerExpenses((p) => {
                                            const dup = [...p];
                                            dup[catIdx].items[itemIdx].name = val;
                                            return dup;
                                          });
                                                              ) : (
                                      <span 
                                        onClick={() => setEditingExpenseField({ catIndex: catIdx, itemIndex: itemIdx, field: "name" })}
                                        className="text-xs font-black text-[#1C2B48] cursor-pointer hover:underline flex items-center gap-1.5"
                                      >
                                        <span className="text-[#8EB1D1]">🔹</span> <span>{it.name}</span>
                                      </span>
                                    )}
                                  </div>
 
                                  {/* Subcategory amount inline editor */}
                                  <div className="flex items-center gap-3">
                                    {editingExpenseField?.catIndex === catIdx && editingExpenseField?.itemIndex === itemIdx && editingExpenseField?.field === "actual" ? (
                                      <input 
                                        type="number"
                                        autoFocus
                                        className="w-24 px-3 py-1.5 text-xs text-right font-black border border-[#8EB1D1]/40 rounded-xl bg-white focus:outline-none focus:border-[#8EB1D1]"          type="number"
                                        autoFocus
                                        className="w-24 px-3 py-1.5 text-xs text-right font-black border border-[#FF5F7E]/40 rounded-xl bg-white focus:outline-none focus:border-[#FF5F7E]"
                                        value={it.actual}
                                        onChange={(e) => {
                                          const num = parseFloat(e.target.value) || 0;
                                          setPlannerExpenses((p) => {
                                            const dup = [...p];
                                            dup[catIdx].items[itemIdx].actual = num;
                                            return dup;
                                          });
                                        }}
                                        onBlur={() => setEditingExpenseField(null)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingExpenseField(null); }}
                                      />
                                    ) : (
                                      <span 
                                        onClick={() => setEditingExpenseField({ catIndex: catIdx, itemIndex: itemIdx, field: "actual" })}
                                        className="text-xs font-black text-rose-800 bg-rose-500/10 border border-rose-500/15 cursor-pointer hover:bg-rose-500/20 px-3 py-1.5 rounded-xl shadow-2xs"
                                      >
                                        {it.actual.toLocaleString()} MAD
                                      </span>
                                    )}

                                    <button 
                                      onClick={() => handleDeleteExpenseItem(catIdx, itemIdx)}
                                      className="p-1.5 text-stone-300 hover:text-[#5C82A6] hover:bg-sky-50/50 rounded-xl transition-all cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4 text-[#8EB1D1]" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* INLINE DRAFT EXPENSE FORM WRAPPER */}
                            {newExpenseInputs[catIdx] ? (
                              <div className="flex flex-wrap items-center gap-2.5 py-2.5 px-3.5 border border-dashed border-white/60 bg-white/40 rounded-2xl mt-3">
                                <input 
                                  type="text"
                                  placeholder="Nom de rubrique (ex: Courses)"
                                  className="flex-grow min-w-[130px] px-3.5 py-2 border border-white/50 bg-white/80 rounded-xl focus:outline-none focus:bg-white text-xs font-black text-[#3F111B]"
                                  value={newExpenseInputs[catIdx].name}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setNewExpenseInputs((p) => ({ ...p, [catIdx]: { ...p[catIdx], name: v } }));
                                  }}
                                />
                                <input 
                                  type="number"
                                  placeholder="Montant"
                                  className="w-28 px-3.5 py-2 border border-white/50 bg-white/80 rounded-xl focus:outline-none focus:bg-white text-xs font-black text-[#3F111B]"
                                  value={newExpenseInputs[catIdx].actual}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setNewExpenseInputs((p) => ({ ...p, [catIdx]: { ...p[catIdx], actual: v } }));
                                  }}
                                />
                                <button 
                                  onClick={() => handleSaveNewExpense(catIdx)}
                                  className="p-2 px-3 text-xs font-black bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all cursor-pointer"
                                >
                                  ✓ Confirm
                                </button>
                                <button 
                                  onClick={() => setNewExpenseInputs((p) => {
                                    const dup = { ...p };
                                    delete dup[catIdx];
                                    return dup;
                                  })}
                                  className="p-2 px-3 text-xs font-black bg-white/55 text-stone-700 rounded-xl hover:bg-white/85 transition-all cursor-pointer"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setNewExpenseInputs((p) => ({ ...p, [catIdx]: { name: "", actual: "" } }))}
                                className="text-xs font-black text-[#8EB1D1] hover:text-[#5C82A6] hover:underline flex items-center gap-1.5 py-2 pl-2.5 cursor-pointer uppercase tracking-wider"
                              >
                                + Ajouter une dépense
                              </button>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MOBILE ONLY DONUT SECTION (RENDERS BETWEEN EXPENSES & WINS) */}
              <div className="block lg:hidden bg-white/30 border border-white/45 p-5 rounded-3xl backdrop-blur-md shadow-lg space-y-4">
                <div className="section-header">
                  <div className="section-title">
                    <span className="text-lg">📊</span>
                    <span>Répartition des charges</span>
                  </div>
                </div>
                {chartData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="h-[240px] flex justify-center items-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            dataKey="value"
                            paddingAngle={4}
                            stroke="rgba(255, 255, 255, 0.5)"
                            strokeWidth={3}
                            animationDuration={600}
                          >
                            {chartData.map((_, index) => (
                              <Cell key={`cell-mob-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(val: number) => [`${val.toLocaleString()} MAD`, "Rapport"]}
                            contentStyle={{ background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(8px)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.5)", padding: "10px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none font-sans">
                        <span className="text-[9px] font-black text-[#3F111B]/60 uppercase tracking-widest leading-none">Dépenses</span>
                        <span className="text-sm font-black text-[#3F111B] mt-1">{totalActualExpenses.toLocaleString()} MAD</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-black px-1">
                      {chartData.map((entry, index) => {
                        const pct = totalActualExpenses > 0 ? Math.round((entry.value / totalActualExpenses) * 100) : 0;
                        return (
                          <div key={entry.name} className="flex items-center gap-1.5 truncate">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="truncate text-[#3F111B]">{entry.name}</span>
                            <span className="text-[#3F111B]/60 font-black ml-auto">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                   {/* SECTION 6 — WINS 🏆 */}
              <div id="section-wins-list" className="bg-white/30 border border-white/45 p-5 rounded-3xl backdrop-blur-md shadow-lg space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <h2 className="text-sm font-black text-[#1C2B48] uppercase tracking-wider">Mes victoires du mois</h2>
                  </div>
                  <span className="text-[10px] font-black bg-[#8EB1D1] text-[#1C2B48] px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                    {wins.length} Gagné
                  </span>
                </div>
 
                <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
                  {wins.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center gap-1.5 bg-white/70 shadow-2xs px-3.5 py-1.5 rounded-full border border-white/50 text-xs font-black text-[#1C2B48] hover:scale-105 transition-all group relative select-none"
                    >
                      <span className="text-sm">{w.emoji}</span>
                      <span>{w.text}</span>
                      <button
                        onClick={() => {
                          setWins((prev) => prev.filter((x) => x.id !== w.id));
                          triggerToast("Victoire retirée", "info");
                        }}
                        className="text-[#8EB1D1] hover:text-[#5C82A6] font-bold pl-1.5 cursor-pointer transition-all text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
 
                  {wins.length === 0 && (
                    <span className="text-xs font-semibold text-[#1C2B48]/60 leading-relaxed italic pl-1">
                      Aucune victoire renseignée pour le moment. Renseignez votre premier succès ! 🎉
                    </span>
                  )}      {wins.length === 0 && (
                    <span className="text-xs font-semibold text-[#3F111B]/60 leading-relaxed italic pl-1">
                      Aucune victoire renseignée pour le moment. Renseignez votre premier succès ! 🎉
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 pt-3.5 border-t border-white/20">
                  <div className="flex gap-1 bg-white/30 p-1.5 rounded-full border border-white/30">
                    {["🥗", "🚭", "💰", "🏆", "🚶", "🚲", "🎯", "💡"].map((em) => (
                      <button
                        key={em}
                        onClick={() => setNewWinEmoji(em)}
                        className={`text-lg p-1 rounded-full hover:scale-120 active:scale-95 transition-all cursor-pointer ${
                          newWinEmoji === em ? "bg-white shadow-md border border-[#FF5F7E]/40" : "opacity-40"
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-1 w-full gap-2">
                    <input 
                      type="text"
                      placeholder="Ex : J'ai évité le shopping inutile..."
                      className="flex-grow px-4.5 py-2 text-xs font-black border border-white/50 bg-white/60 rounded-full focus:outline-none focus:bg-white text-[#3F111B] placeholder-[#3F111B]/40 shadow-inner"
                      value={newWinText}
                      onChange={(e) => setNewWinText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddWin(); }}
                    />
                    <button 
                      onClick={handleAddWin}
                      className="px-5 py-2 rounded-full bg-[#FF5F7E] hover:bg-[#FF2E56] text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>

              </div>

              {/* SECTION 8 — NOTES DU MOIS 📝 */}
              <div id="section-monthly-notes" className="bg-white/30 border border-white/45 p-5 rounded-3xl backdrop-blur-md shadow-lg space-y-3">
                <div className="section-header">
                  <div className="section-title">
                    <span className="text-lg">📝</span>
                    <span>Notes du mois</span>
                  </div>
                </div>
                <div>
                  <textarea
                    className="w-full h-24 p-3.5 bg-white/45 border border-white/50 hover:bg-white/65 focus:bg-white rounded-2xl focus:outline-none focus:border-[#FF5F7E] transition-all text-xs font-black text-[#3F111B] placeholder-[#3F111B]/40 shadow-inner"
                    placeholder="Notez vos observations, rappels ou projets pour ce mois..."
                    value={monthlyNotes}
                    onChange={(e) => setMonthlyNotes(e.target.value)}
                  />
                  <div className="text-right text-[10px] font-black text-[#3F111B]/50 mt-1 italic uppercase tracking-wider">
                    Sauvegarde automatique instantanée Locale
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SIDEBAR COL: Donut, Objectifs Epargne (sticky on Desktop) */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8 lg:sticky lg:top-6">
              
              {/* SECTION 9 — DONUT CHART (DESKTOP ONLY) */}
              <div className="hidden lg:block bg-white/30 border border-white/45 p-5 rounded-3xl backdrop-blur-md shadow-lg space-y-4">
                <div className="section-header">
                  <div className="section-title">
                    <span className="text-lg">📊</span>
                    <span>Répartition des charges</span>
                  </div>
                </div>
                {chartData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="h-[240px] flex justify-center items-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            dataKey="value"
                            paddingAngle={4}
                            stroke="rgba(255, 255, 255, 0.5)"
                            strokeWidth={3}
                            animationDuration={600}
                          >
                            {chartData.map((_, index) => (
                              <Cell key={`cell-desk-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(val: number) => [`${val.toLocaleString()} MAD`, "Dépense"]}
                            contentStyle={{ background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(8px)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.5)", padding: "10px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none font-sans">
                        <span className="text-[10px] font-black text-[#3F111B]/60 uppercase tracking-widest leading-none">Dépenses</span>
                        <span className="text-base font-black text-[#3F111B] mt-1">{totalActualExpenses.toLocaleString()} MAD</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-black px-1">
                      {chartData.map((entry, index) => {
                        const pct = totalActualExpenses > 0 ? Math.round((entry.value / totalActualExpenses) * 100) : 0;
                        return (
                          <div key={entry.name} className="flex items-center gap-1.5 truncate">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="truncate text-[#3F111B]">{entry.name}</span>
                            <span className="text-[#3F111B]/60 font-black ml-auto">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs font-black text-[#3F111B]/50 italic">
                    Aucune dépense enregistrée pour le moment.
                  </div>
                )}
              </div>

              {/* SECTION 7 — OBJECTIFS D'ÉPARGNE 🎯 */}
              <div id="section-saving-goals" className="bg-white/30 border border-white/45 p-5 rounded-3xl backdrop-blur-md shadow-lg space-y-4">
                <div className="section-header">
                  <div className="section-title">
                    <span className="text-lg">🎯</span>
                    <span>Mes objectifs</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowAddGoalForm(true);
                      setGoalFormStep(1);
                    }}
                    className="text-xs font-black text-[#FF5F7E] bg-white/60 hover:bg-white border border-white/65 hover:text-[#FF2E56] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs uppercase tracking-wider"
                  >
                    + Nouveau
                  </button>
                </div>

                {/* Formulaire ajout objectif (UN CHAMP A LA FOIS!) */}
                {showAddGoalForm && (
                  <div className="p-4 border border-dashed border-[#FF5F7E]/40 rounded-3xl bg-white/45 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-[10px] font-black text-[#FF5F7E] uppercase tracking-wider">Étape {goalFormStep}/4</span>
                      <button 
                        onClick={() => {
                          setShowAddGoalForm(false);
                          setGoalFormStep(1);
                        }}
                        className="text-stone-400 hover:text-[#FF2E56] text-xs font-black cursor-pointer transition-all"
                      >
                        Annuler
                      </button>
                    </div>

                    <div>
                      {goalFormStep === 1 && (
                        <div className="space-y-1.5 font-sans">
                          <label className="block text-xs font-black text-[#3F111B]/80">1. Quel est le nom de l'objectif ?</label>
                          <input 
                            type="text"
                            placeholder="ex : Vacances été ✈️"
                            className="w-full px-3.5 py-2.5 border border-white/60 bg-white/70 focus:bg-white rounded-xl focus:outline-none focus:border-[#FF5F7E] text-xs font-black text-[#3F111B] placeholder-[#3F111B]/40 shadow-inner"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') setGoalFormStep(2); }}
                            autoFocus
                          />
                        </div>
                      )}

                      {goalFormStep === 2 && (
                        <div className="space-y-1.5 font-sans">
                          <label className="block text-xs font-black text-[#3F111B]/80">2. Quel est le montant cible à épargner ?</label>
                          <input 
                            type="number"
                            placeholder="ex : 12000 (MAD)"
                            className="w-full px-3.5 py-2.5 border border-white/60 bg-white/70 focus:bg-white rounded-xl focus:outline-none focus:border-[#FF5F7E] text-xs font-black text-[#3F111B] placeholder-[#3F111B]/40 shadow-inner"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') setGoalFormStep(3); }}
                            autoFocus
                          />
                        </div>
                      )}

                      {goalFormStep === 3 && (
                        <div className="space-y-1.5 font-sans">
                          <label className="block text-xs font-black text-[#3F111B]/80">3. Quel est votre montant déjà acquis ?</label>
                          <input 
                            type="number"
                            placeholder="ex : 4000 (MAD)"
                            className="w-full px-3.5 py-2.5 border border-white/60 bg-white/70 focus:bg-white rounded-xl focus:outline-none focus:border-[#FF5F7E] text-xs font-black text-[#3F111B] placeholder-[#3F111B]/40 shadow-inner"
                            value={newGoalCurrent}
                            onChange={(e) => setNewGoalCurrent(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') setGoalFormStep(4); }}
                            autoFocus
                          />
                        </div>
                      )}

                      {goalFormStep === 4 && (
                        <div className="space-y-1.5 font-sans">
                          <label className="block text-xs font-black text-[#3F111B]/80">4. Quelle est la date d'échéance ?</label>
                          <input 
                            type="month"
                            className="w-full px-3.5 py-2.5 border border-white/60 bg-white/70 focus:bg-white rounded-xl focus:outline-none focus:border-[#FF5F7E] text-xs font-black text-[#3F111B] placeholder-[#3F111B]/40 shadow-inner"
                            value={newGoalDate}
                            onChange={(e) => setNewGoalDate(e.target.value)}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        disabled={goalFormStep === 1}
                        onClick={() => setGoalFormStep((prev) => (prev - 1) as any)}
                        className="px-3.5 py-1.5 text-xs font-black text-[#3F111B]/80 rounded-xl bg-white/50 border border-white/60 hover:bg-white disabled:opacity-45 cursor-pointer text-center"
                      >
                        Précédent
                      </button>
                      
                      {goalFormStep < 4 ? (
                        <button
                          type="button"
                          onClick={() => setGoalFormStep((prev) => (prev + 1) as any)}
                          className="px-4 py-1.5 text-xs font-black bg-[#FF5F7E] hover:bg-[#FF2E56] text-white rounded-xl cursor-pointer shadow-2xs"
                        >
                          Suivant
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleAddGoalAction}
                          className="px-4 py-1.5 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl cursor-pointer shadow-2xs"
                        >
                          Créer
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Goals Lists with pastel presets */}
                <div className="space-y-4">
                  {savingGoals.map((g, idx) => {
                    const presetList = [
                      "bg-white/55 border-rose-200/40 text-[#3F111B]",
                      "bg-white/45 border-orange-200/35 text-[#3F111B]",
                      "bg-white/50 border-emerald-200/35 text-[#3F111B]",
                      "bg-white/60 border-amber-200/35 text-[#3F111B]",
                      "bg-white/40 border-purple-200/35 text-[#3F111B]"
                    ];
                    const chosenBg = presetList[idx % presetList.length];
                    const ratio = g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0;
                    const remains = Math.max(0, g.targetAmount - g.currentAmount);

                    return (
                      <div 
                        key={g.id} 
                        className={`${chosenBg} border p-4.5 rounded-2xl relative shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group`}
                      >
                        <button
                          onClick={() => handleDeleteSavingGoal(g.id)}
                          className="absolute top-3 right-3 p-1 text-stone-400 hover:text-[#FF2E56] bg-white/60 hover:bg-white rounded-full cursor-pointer transition-all leading-none"
                        >
                          &times;
                        </button>
                        
                        <div className="flex items-center gap-2 text-sm font-black text-[#3F111B] mb-1">
                          <span>🚀</span>
                          <span className="truncate max-w-[140px] uppercase tracking-wider">{g.name}</span>
                        </div>

                        <div className="text-xs font-black text-[#3F111B]/60">
                          {g.currentAmount.toLocaleString()} / {g.targetAmount.toLocaleString()} MAD
                        </div>

                        <div className="w-full bg-white/70 rounded-full h-2 mt-2.5 overflow-hidden shadow-inner border border-white/20">
                          <div 
                            className="h-full bg-[#FF5F7E] rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>
                        <div className="text-right text-[9px] font-black text-[#3F111B]/60 mt-1">{ratio}%</div>

                        <div className="text-xs text-[#FF5F7E] font-black leading-normal italic mt-2 border-t border-white/20 pt-2 text-center">
                          "Encore {remains.toLocaleString()} MAD, soit {calculateGoalInstallment(g.targetAmount, g.currentAmount, g.targetDate)} MAD/mois"
                        </div>
                      </div>
                    );
                  })}
                  
                  {savingGoals.length === 0 && (
                    <div className="text-xs font-black text-[#3F111B]/50 italic py-6 text-center">
                      Aucun objectif défini. Lancez un défi épargne ! 🎯
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* SECTION 10 — FIXED BOTTOM MOBILE BAR WITH CENTURED GREEN BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/85 backdrop-blur-md border-t border-white/30 p-3 shadow-[0_-4px_16px_rgba(255,95,126,0.1)] z-40 flex justify-center">
          <button 
            onClick={() => {
              // Expand the first category, and auto fill its inputs draft!
              setExpandedCategories((p) => ({ ...p, [0]: true }));
              setNewExpenseInputs((p) => ({ ...p, [0]: { name: "", actual: "" } }));
              // Scroll cleanly to the view
              const el = document.getElementById("expense-category-0");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              triggerToast("✓ Saisie de dépense activée en haut pour Logement !", "success");
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-6 rounded-2xl transition-all active:scale-95 text-center flex items-center justify-center gap-2 shadow-md cursor-pointer uppercase tracking-wider text-xs"
          >
            <Plus className="w-4 h-4 focus:outline-none" /> Ajouter une dépense
          </button>
        </div>

        {/* DIALOG POPUP MODAL FOR CATEGORY BUDGET PENCIL EDIT */}
        <AnimatePresence>
          {editingBudgetCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingBudgetCategory(null)}
                className="fixed inset-0 bg-[#3F111B]/45 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl relative max-w-sm w-full z-10 border border-white/50"
              >
                <h3 className="text-base font-black text-[#3F111B] mb-1">🎯 Budget limit prévu</h3>
                <p className="text-xs font-black text-[#3F111B]/60 mb-4">Prévision de budget pour la catégorie :</p>
                
                <div className="bg-white/40 p-4 rounded-2xl mb-4 text-center border border-white/50 shadow-inner">
                  <span className="text-sm font-black text-[#3F111B] block mb-2">{editingBudgetCategory}</span>
                  <div className="relative max-w-[170px] mx-auto">
                    <input 
                      type="number"
                      className="w-full text-center py-2 px-3 bg-white border border-white/50 rounded-xl focus:outline-none focus:border-[#FF5F7E] text-[18px] font-black text-[#3F111B]"
                      value={tempBudgetValue}
                      onChange={(e) => setTempBudgetValue(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveCategoryBudget();
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">MAD</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingBudgetCategory(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white/45 border border-white/55 text-[#3F111B]/80 font-black text-xs transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveCategoryBudget}
                    className="flex-1 py-2.5 rounded-xl bg-[#FF5F7E] hover:bg-[#FF2E56] text-white font-black text-xs transition-all cursor-pointer shadow-md uppercase tracking-wider"
                  >
                    Confirmer
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageShell>
  );
}
