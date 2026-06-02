import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../../components/Layout";
import { useState, useMemo } from "react";
import {
  Home,
  Calendar,
  Wallet,
  ShoppingBag,
  Shield,
  Star,
  PieChart as ChartIcon,
  CreditCard,
  PiggyBank,
  Plus,
  Trash2,
  Printer
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

export const Route = createFileRoute("/outils/budget-planner")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentTheme, setCurrentTheme] = useState<"pink" | "red" | "blue" | "black">("pink");
  const themes = [
    { id: "pink", label: "Rose", color: "#f472b6" },
    { id: "red", label: "Rouge", color: "#f87171" },
    { id: "blue", label: "Bleu", color: "#8EB1D1" },
    { id: "black", label: "Noir", color: "#52525b" }
  ] as const;

  const [activeTab, setActiveTab] = useState("Dashboard");

  // STATE LOGIC
  const [incomes, setIncomes] = useState<{id: string, source: string, amount: number}[]>([
    { id: '1', source: 'Salaire', amount: 8000 }
  ]);
  const [newIncome, setNewIncome] = useState({ source: '', amount: '' });

  const [categories, setCategories] = useState<{id: string, name: string, color: string, limit: number}[]>([
    { id: 'c1', name: "Logement", color: "var(--budget-primary-dark)", limit: 3000 },
    { id: 'c2', name: "Alimentation", color: "var(--budget-primary)", limit: 2000 },
    { id: 'c3', name: "Transport", color: "var(--budget-bg-end)", limit: 1000 },
    { id: 'c4', name: "Shopping", color: "var(--budget-bg-mid)", limit: 800 },
    { id: 'c5', name: "Factures", color: "var(--budget-accent)", limit: 500 },
    { id: 'c6', name: "Divers", color: "var(--budget-bg-start)", limit: 500 },
  ]);

  const [expenses, setExpenses] = useState<{id: string, categoryId: string, name: string, amount: number}[]>([
    { id: 'e1', categoryId: 'c1', name: 'Loyer', amount: 2500 },
    { id: 'e2', categoryId: 'c2', name: 'Courses', amount: 1500 },
    { id: 'e3', categoryId: 'c3', name: 'Essence', amount: 400 },
  ]);
  const [newExpense, setNewExpense] = useState({ categoryId: 'c1', name: '', amount: '' });

  const [upcomingBills, setUpcomingBills] = useState<{id: string, name: string, date: string, amount: number, status: string}[]>([
    { id: 'b1', name: "Loyer", date: "25 May, 2026", amount: 2500, status: "À payer" },
    { id: 'b2', name: "Électricité", date: "27 May, 2026", amount: 350, status: "À payer" },
    { id: 'b3', name: "Internet", date: "28 May, 2026", amount: 250, status: "À payer" },
  ]);
  const [newBill, setNewBill] = useState({ name: '', date: '', amount: '' });

  const [savingsGoals, setSavingsGoals] = useState<{id: string, name: string, current: number, target: number}[]>([
    { id: 's1', name: "Fonds d'urgence", current: 5000, target: 20000 },
    { id: 's2', name: "Voyage d'été", current: 3000, target: 8000 },
    { id: 's3', name: "Nouvel Ordinateur", current: 1500, target: 15000 },
  ]);

  // CALCULATIONS
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSavings = savingsGoals.reduce((acc, curr) => acc + curr.current, 0);
  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((totalSavings / (totalIncome * 12)) * 100) : 0; // rough monthly rate vs total savings logic, but let's just make it a nice metric: (Total Balance) / Income
  const monthlySavingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // Chart Data
  const currentDate = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const donutData = categories.map(cat => {
    const catExpenses = expenses.filter(e => e.categoryId === cat.id).reduce((a, b) => a + b.amount, 0);
    return { name: cat.name, value: catExpenses, color: cat.color };
  }).filter(c => c.value > 0);

  // Add functionality
  const addIncome = () => {
    if (!newIncome.source || !newIncome.amount) return;
    setIncomes([...incomes, { id: Date.now().toString(), source: newIncome.source, amount: parseFloat(newIncome.amount) }]);
    setNewIncome({ source: '', amount: '' });
  };
  const deleteIncome = (id: string) => setIncomes(incomes.filter(i => i.id !== id));

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    setExpenses([...expenses, { id: Date.now().toString(), categoryId: newExpense.categoryId, name: newExpense.name, amount: parseFloat(newExpense.amount) }]);
    setNewExpense({ ...newExpense, name: '', amount: '' });
  };
  const deleteExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));

  const addBill = () => {
    if (!newBill.name || !newBill.date || !newBill.amount) return;
    setUpcomingBills([...upcomingBills, { id: Date.now().toString(), name: newBill.name, date: newBill.date, amount: parseFloat(newBill.amount), status: 'À payer' }]);
    setNewBill({ name: '', date: '', amount: '' });
  };
  const deleteBill = (id: string) => setUpcomingBills(upcomingBills.filter(b => b.id !== id));

  return (
    <PageShell>
      <div className={`min-h-screen bg-budget-bg-start/30 theme-${currentTheme} text-budget-text font-serif p-4 sm:p-8`}>
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-budget-text uppercase bg-white/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-budget-primary/20 w-fit" style={{ fontFamily: "'Setta', cursive" }}>
              {currentDate}
            </div>
            
            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center my-4 md:my-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white text-center" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)', fontFamily: "'Oliver', sans-serif" }}>
                Budget Tracker
              </h1>
            </div>

            <div className="flex items-center gap-2 bg-white/70 p-2 rounded-full shadow-sm z-10 backdrop-blur-md w-fit md:ml-auto">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setCurrentTheme(t.id as any)}
                  title={t.label}
                  className={`w-6 h-6 rounded-full border border-black/10 transition-all ${currentTheme === t.id ? 'scale-110 shadow-md ring-2 ring-budget-text/20' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-budget-bg-start/90 border border-budget-primary/20 rounded-xl p-4 flex items-center justify-center text-budget-primary-dark font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-center" style={{ fontFamily: "'Sophia', cursive", fontSize: '1.25rem' }}>
              Un budget consiste à dire à votre argent où aller plutôt que de vous demander où il est allé. 
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar */}
            <div className="col-span-1 lg:col-span-3 space-y-6">
              <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10">
                <h3 className="text-budget-primary-dark font-bold mb-4 font-sans text-sm tracking-wide">Navigation</h3>
                <nav className="space-y-1 font-sans text-sm font-medium">
                  {[
                    { icon: Home, label: "Dashboard" },
                    { icon: Wallet, label: "Revenus" },
                    { icon: Calendar, label: "Dépenses" },
                    { icon: CreditCard, label: "Factures & Abonnements" },
                    { icon: Star, label: "Épargne" },
                    { icon: Printer, label: "Récapitulatif" },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === item.label ? 'bg-budget-bg-start/80 text-budget-text font-bold' : 'text-budget-text/70 hover:bg-budget-bg-start/40 hover:text-budget-text'}`}
                    >
                      <item.icon className={`w-4 h-4 ${activeTab === item.label ? 'text-budget-primary-dark' : 'text-budget-text/50'}`} strokeWidth={activeTab === item.label ? 2.5 : 2} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-xl opacity-80">🍓</div>
                <h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Aperçu Rapide</h3>
                <div className="space-y-4 font-sans text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-budget-text/80 font-medium">Revenus (Mois)</span>
                    <span className="font-bold text-budget-text">{totalIncome.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-budget-text/80 font-medium">Dépenses (Mois)</span>
                    <span className="font-bold text-budget-text">{totalExpenses.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-budget-primary/10 mt-2">
                    <span className="text-budget-text/80 font-medium">Solde Total</span>
                    <span className="font-bold text-budget-text">{totalBalance.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-1">
                    <span className="text-budget-text/80 font-medium">Taux d'Épargne</span>
                    <span className="font-bold text-budget-text">{monthlySavingsRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 lg:col-span-9 space-y-6">
              
              {/* TOP STATS - Display across all tabs for easy viewing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Revenus", amount: `${totalIncome.toLocaleString()} MAD`, sub: "Ce mois", icon: Wallet },
                  { title: "Total Dépenses", amount: `${totalExpenses.toLocaleString()} MAD`, sub: "Ce mois", icon: ShoppingBag },
                  { title: "Total Épargnes", amount: `${totalSavings.toLocaleString()} MAD`, sub: "Global", icon: PiggyBank },
                  { title: "Solde", amount: `${totalBalance.toLocaleString()} MAD`, sub: "Tous comptes", icon: CreditCard },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/90 rounded-xl p-5 shadow-sm border border-budget-primary/10 flex flex-col items-center text-center relative group">
                    <h4 className="text-budget-primary-dark font-bold font-sans text-[11px] tracking-wide mb-3">{stat.title}</h4>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-budget-bg-start/70 p-2 rounded-lg group-hover:bg-budget-primary/20 transition-colors">
                        <stat.icon className="w-6 h-6 text-budget-primary-dark" strokeWidth={1.5} />
                      </div>
                      <span className="text-2xl font-bold font-sans text-budget-text truncate">{stat.amount}</span>
                    </div>
                    <span className="text-[10px] text-budget-text/50 uppercase tracking-widest font-sans font-bold">{stat.sub}</span>
                  </div>
                ))}
              </div>

              {activeTab === "Dashboard" && (
                <>
                  {/* Dashboard Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Aperçu Budget</h3>
                        <button onClick={() => setActiveTab('Dépenses')} className="text-xs font-sans text-budget-primary-dark underline">Gérer</button>
                      </div>
                      {donutData.length > 0 ? (
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="w-48 h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                                  {donutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-lg font-bold font-sans text-budget-text">{totalExpenses} <span className="text-xs">MAD</span></span>
                              <span className="text-[9px] font-sans text-budget-text/50 uppercase tracking-widest mt-1">Dépenses</span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-3 font-sans text-xs w-full">
                            {donutData.map((item, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-budget-text/70 flex-1 truncate">{item.name}</span>
                                <span className="font-bold text-budget-text/90">{Math.round((item.value/totalExpenses)*100)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 flex items-center justify-center text-budget-text/50 text-sm italic">Ajoutez des dépenses pour voir le graphique</div>
                      )}
                    </div>

                    {/* Spend Trend dummy for visual dashboard completeness */}
                    <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10">
                      <h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Tendance Dépenses (Mock)</h3>
                      <div className="w-full h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[{n:'Sem 1',v:500},{n:'Sem 2',v:1200},{n:'Sem 3',v:1800},{n:'Sem 4',v:totalExpenses||2580}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-budget-primary)" opacity={0.3} />
                            <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-budget-text)', opacity: 0.6 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-budget-text)', opacity: 0.6 }} tickFormatter={(v) => `${v}`} />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="v" stroke="var(--color-budget-primary-dark)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-budget-primary-dark)", strokeWidth: 2, stroke: "#fff" }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Bottom Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bills */}
                    <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 relative overflow-hidden">
                      <div className="absolute top-4 right-4 text-xl opacity-80">🍓</div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Factures Éminentes</h3>
                        <button onClick={() => setActiveTab('Factures & Abonnements')} className="text-xs font-sans text-budget-primary-dark underline">Gérer</button>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <table className="w-full text-left font-sans text-xs">
                          <thead>
                            <tr className="text-budget-text/60 font-medium border-b border-budget-primary/10">
                              <th className="pb-3 px-2 font-normal">Facture</th>
                              <th className="pb-3 px-2 font-normal text-right">Montant</th>
                            </tr>
                          </thead>
                          <tbody>
                            {upcomingBills.slice(0,4).map((bill, i) => (
                              <tr key={i} className="border-b border-budget-primary/5 last:border-0">
                                <td className="py-3.5 px-2 font-bold text-budget-text">{bill.name}</td>
                                <td className="py-3.5 px-2 text-right font-bold text-budget-text">{bill.amount.toLocaleString()}</td>
                              </tr>
                            ))}
                            {upcomingBills.length === 0 && (
                              <tr><td colSpan={2} className="py-4 text-center text-budget-text/50 italic">Aucune facture</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Savings Goals */}
                    <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 relative overflow-hidden">
                      <div className="absolute top-4 right-4 text-xl opacity-80">🍓</div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Objectifs d'Épargne</h3>
                        <button onClick={() => setActiveTab('Épargne')} className="text-xs font-sans text-budget-primary-dark underline">Gérer</button>
                      </div>
                      <div className="space-y-6 flex flex-col justify-center">
                        {savingsGoals.slice(0,3).map((goal, i) => {
                          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                          return (
                          <div key={i} className="font-sans">
                            <div className="flex justify-between items-end mb-2">
                              <span className="font-bold text-budget-text text-xs">{goal.name}</span>
                              <span className="text-budget-text/60 text-[10px] uppercase tracking-wider font-bold">{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-budget-bg-start/50 rounded-full h-2.5 overflow-hidden mb-1.5 flex shadow-inner">
                              <div className="bg-budget-primary-dark rounded-full transition-all duration-1000" style={{ width: `${percent}%` }} />
                            </div>
                            <div className="text-[10px] text-right font-bold text-budget-text">{percent}%</div>
                          </div>
                        )})}
                        {savingsGoals.length === 0 && (
                          <div className="text-center text-budget-text/50 italic py-4">Aucun objectif défini</div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* View: REVENUS */}
              {activeTab === "Revenus" && (
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 animate-fade-in font-sans">
                  <h2 className="text-xl font-bold mb-6 text-budget-text">Gérer mes Revenus</h2>
                  <div className="flex items-end gap-3 mb-6 bg-budget-bg-start/20 p-4 rounded-xl">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-budget-text/60 mb-1">Source</label>
                      <input type="text" value={newIncome.source} onChange={e => setNewIncome({...newIncome, source: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="Ex: Salaire..." />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-budget-text/60 mb-1">Montant (MAD)</label>
                      <input type="number" value={newIncome.amount} onChange={e => setNewIncome({...newIncome, amount: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="0.00" />
                    </div>
                    <button onClick={addIncome} className="bg-budget-primary-dark hover:bg-budget-primary-dark/80 text-white font-bold h-[42px] px-6 rounded-md transition-colors flex items-center gap-2"><Plus size={16}/> Ajouter</button>
                  </div>

                  <div className="space-y-2">
                    {incomes.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-budget-primary/5 rounded-lg shadow-sm">
                        <span className="font-medium text-budget-text">{item.source}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-budget-primary-dark">{item.amount.toLocaleString()} MAD</span>
                          <button onClick={() => deleteIncome(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                    {incomes.length === 0 && <div className="text-center italic text-budget-text/50 p-6">Aucun revenu ajouté.</div>}
                  </div>
                </div>
              )}

              {/* View: DEPENSES */}
              {activeTab === "Dépenses" && (
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 animate-fade-in font-sans">
                  <h2 className="text-xl font-bold mb-6 text-budget-text">Gérer mes Dépenses</h2>
                  <div className="flex flex-wrap items-end gap-3 mb-6 bg-budget-bg-start/20 p-4 rounded-xl">
                    <div className="w-full sm:flex-1">
                      <label className="block text-xs font-bold text-budget-text/60 mb-1">Catégorie</label>
                      <select value={newExpense.categoryId} onChange={e => setNewExpense({...newExpense, categoryId: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="w-full sm:flex-1">
                      <label className="block text-xs font-bold text-budget-text/60 mb-1">Dépense</label>
                      <input type="text" value={newExpense.name} onChange={e => setNewExpense({...newExpense, name: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="Ex: Essence..." />
                    </div>
                    <div className="w-full sm:flex-1">
                      <label className="block text-xs font-bold text-budget-text/60 mb-1">Montant (MAD)</label>
                      <input type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="0.00" />
                    </div>
                    <button onClick={addExpense} className="w-full sm:w-auto bg-budget-primary-dark hover:bg-budget-primary-dark/80 text-white font-bold h-[42px] px-6 rounded-md transition-colors flex items-center justify-center gap-2"><Plus size={16}/> Ajouter</button>
                  </div>

                  <div className="space-y-6">
                    {categories.map(cat => {
                      const catExpenses = expenses.filter(e => e.categoryId === cat.id);
                      if (catExpenses.length === 0) return null;
                      return (
                        <div key={cat.id}>
                          <h3 className="font-bold text-sm text-budget-text/80 mb-3 border-b border-budget-primary/10 pb-2">{cat.name}</h3>
                          <div className="space-y-2">
                            {catExpenses.map(item => (
                              <div key={item.id} className="flex justify-between items-center p-3 sm:px-4 bg-white border border-budget-primary/5 rounded-lg shadow-sm">
                                <span className="font-medium text-budget-text text-sm">{item.name}</span>
                                <div className="flex items-center gap-4">
                                  <span className="font-bold text-budget-primary-dark text-sm">{item.amount.toLocaleString()} MAD</span>
                                  <button onClick={() => deleteExpense(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* View: FACTURES */}
              {activeTab === "Factures & Abonnements" && (
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 animate-fade-in font-sans">
                  <h2 className="text-xl font-bold mb-6 text-budget-text">Factures & Abonnements</h2>
                  <div className="flex flex-wrap items-end gap-3 mb-6 bg-budget-bg-start/20 p-4 rounded-xl">
                    <div className="w-full sm:flex-1">
                      <label className="block text-xs font-bold text-budget-text/60 mb-1">Nom</label>
                      <input type="text" value={newBill.name} onChange={e => setNewBill({...newBill, name: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="Ex: Netflix..." />
                    </div>
                    <div className="w-full sm:flex-1">
                      <label className="block text-xs font-bold text-budget-text/60 mb-1">Date</label>
                      <input type="text" value={newBill.date} onChange={e => setNewBill({...newBill, date: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="Ex: 5 Juin" />
                    </div>
                    <div className="w-full sm:flex-1">
                      <label className="block text-xs font-bold text-budget-text/60 mb-1">Montant (MAD)</label>
                      <input type="number" value={newBill.amount} onChange={e => setNewBill({...newBill, amount: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="0.00" />
                    </div>
                    <button onClick={addBill} className="w-full sm:w-auto bg-budget-primary-dark hover:bg-budget-primary-dark/80 text-white font-bold h-[42px] px-6 rounded-md transition-colors flex justify-center items-center gap-2"><Plus size={16}/> Ajouter</button>
                  </div>

                  <div className="space-y-2">
                    {upcomingBills.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-budget-primary/5 rounded-lg shadow-sm">
                        <div>
                           <div className="font-bold text-budget-text">{item.name}</div>
                           <div className="text-xs text-budget-text/60">{item.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-budget-primary-dark">{item.amount.toLocaleString()} MAD</span>
                          <button onClick={() => deleteBill(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                    {upcomingBills.length === 0 && <div className="text-center italic text-budget-text/50 p-6">Aucune facture.</div>}
                  </div>
                </div>
              )}

              {/* View: EPARGNE */}
              {activeTab === "Épargne" && (
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 animate-fade-in font-sans">
                  <h2 className="text-xl font-bold mb-6 text-budget-text">Objectifs d'Épargne</h2>
                  <div className="p-6 text-center italic text-budget-text/60 border border-budget-primary/10 rounded-lg bg-budget-bg-start/10">
                    Module d'édition des objectifs à venir.
                  </div>
                </div>
              )}

              {/* View: RECAPITULATIF */}
              {activeTab === "Récapitulatif" && (
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 animate-fade-in font-sans">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-budget-text flex items-center gap-2 uppercase tracking-wide">
                      EXPENSES <span className="text-budget-primary">🤍</span>
                    </h2>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 bg-budget-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-budget-primary-dark transition text-sm shadow-sm"
                    >
                      <Printer size={16} /> Imprimer
                    </button>
                  </div>
                  
                  <div className="w-full overflow-x-auto rounded-lg border border-budget-primary/20 bg-white" id="printable-recap">
                    <table className="w-full text-left font-sans text-sm print-table">
                      <thead>
                        <tr className="bg-budget-primary/20 text-budget-text font-extrabold uppercase tracking-widest text-[11px] border-b border-budget-primary/30 print-header">
                          <th className="py-3 px-4 font-extrabold">Catégorie</th>
                          <th className="py-3 px-4 font-extrabold text-right">Budgeté (MAD)</th>
                          <th className="py-3 px-4 font-extrabold text-right">Actuel (MAD)</th>
                          <th className="py-3 px-4 font-extrabold text-right">Différence</th>
                          <th className="py-3 px-4 font-extrabold text-center print-hide">Besoins / Envies</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat, i) => {
                          const catExpenses = expenses.filter(e => e.categoryId === cat.id).reduce((a, b) => a + b.amount, 0);
                          const diff = cat.limit - catExpenses;
                          return (
                            <tr key={cat.id} className="border-b border-budget-primary/10 last:border-0 hover:bg-budget-bg-start/10 transition-colors bg-white">
                              <td className="py-3 px-4 font-semibold flex items-center gap-3 text-budget-text">
                                <div className="w-3 h-3 rounded-full print-hide" style={{ backgroundColor: cat.color }}></div> 
                                {cat.name}
                              </td>
                              <td className="py-3 px-4 text-right font-medium">{cat.limit.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right font-bold text-budget-text">{catExpenses.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right font-medium">
                                <span className={diff >= 0 ? "text-emerald-600 print-emerald" : "text-red-500 print-red"}>
                                  {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center print-hide">
                                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-budget-text/70 uppercase">
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name={`nw-${cat.id}`} defaultChecked={i % 2 === 0} className="w-3 h-3 accent-budget-primary" /> Need
                                  </label>
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name={`nw-${cat.id}`} defaultChecked={i % 2 !== 0} className="w-3 h-3 accent-budget-primary" /> Want
                                  </label>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-budget-primary/10 font-bold border-t-2 border-budget-primary/30">
                          <td className="py-4 px-4 text-budget-text text-xs tracking-wider uppercase">Total Dépenses</td>
                          <td className="py-4 px-4 text-right text-budget-text">{categories.reduce((a,b)=>a+b.limit,0).toLocaleString()}</td>
                          <td className="py-4 px-4 text-right font-black text-budget-primary-dark">{totalExpenses.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right text-budget-text">
                            -
                          </td>
                          <td className="print-hide"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <style>{`
                    @media print {
                      body * {
                        visibility: hidden;
                      }
                      .print-hide { display: none !important; }
                      body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                      #printable-recap, #printable-recap * {
                         visibility: visible;
                      }
                      #printable-recap {
                         position: absolute;
                         left: 0;
                         top: 0;
                         width: 100vw;
                         padding: 2cm;
                         margin: 0;
                         border: none;
                         box-shadow: none;
                      }
                      .print-header { background-color: #f472b620 !important; }
                      .print-emerald { color: #059669 !important; }
                      .print-red { color: #ef4444 !important; }
                    }
                  `}</style>
                </div>
              )}

            </div>
          </div>
          
        </div>
      </div>
    </PageShell>
  );
}
