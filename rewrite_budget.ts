import fs from 'fs';

const code = `import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../../components/Layout";
import { useState } from "react";
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
  ChevronRight
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
    { id: "pink", label: "Pink", color: "#f472b6" },
    { id: "red", label: "Red", color: "#f87171" },
    { id: "blue", label: "Blue", color: "#8EB1D1" },
    { id: "black", label: "Black", color: "#52525b" }
  ] as const;

  // Mock data for the charts
  const donutData = [
    { name: "Housing", value: 35, color: "var(--budget-primary-dark)" },
    { name: "Food", value: 20, color: "var(--budget-primary)" },
    { name: "Transport", value: 15, color: "var(--budget-bg-end)" },
    { name: "Shopping", value: 10, color: "var(--budget-bg-mid)" },
    { name: "Bills", value: 10, color: "var(--budget-accent)" },
    { name: "Other", value: 10, color: "var(--budget-bg-start)" },
  ];

  const lineData = [
    { name: "Week 1", value: 500 },
    { name: "Week 2", value: 1200 },
    { name: "Week 3", value: 1800 },
    { name: "Week 4", value: 2580 },
  ];

  const upcomingBills = [
    { name: "Rent", date: "May 25, 2024", amount: 1200, status: "Upcoming" },
    { name: "Electricity", date: "May 27, 2024", amount: 120, status: "Upcoming" },
    { name: "Internet", date: "May 28, 2024", amount: 60, status: "Upcoming" },
    { name: "Phone", date: "May 30, 2024", amount: 80, status: "Upcoming" },
  ];

  const savingsGoals = [
    { name: "Emergency Fund", current: 2500, target: 5000, percent: 50 },
    { name: "Vacation", current: 1200, target: 3000, percent: 40 },
    { name: "New Laptop", current: 850, target: 1500, percent: 57 },
  ];

  return (
    <PageShell>
      <div className={\`min-h-screen bg-budget-bg-start/30 theme-\${currentTheme} text-budget-text font-serif p-4 sm:p-8\`}>
        
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-4xl font-bold tracking-tight">Budget Tracker</h1>
            
            {/* Theme switcher */}
            <div className="flex items-center gap-2 bg-white/50 p-2 rounded-full shadow-sm">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setCurrentTheme(t.id as any)}
                  title={t.label}
                  className={\`w-6 h-6 rounded-full border border-black/10 transition-all \${currentTheme === t.id ? 'scale-110 shadow-md ring-2 ring-budget-text/20' : 'opacity-70 hover:opacity-100 hover:scale-105'}\`}
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          </div>

          {/* Tagline Box */}
          <div className="bg-budget-bg-start/90 border border-budget-primary/20 rounded-xl p-4 flex items-center justify-center text-budget-primary-dark font-medium text-sm italic shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="flex items-center gap-2">
              <span className="text-lg">📌</span> 
              A budget is telling your money where to go instead of wondering where it went. 
              <span className="text-budget-primary">🤍</span>
            </span>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Sidebar */}
            <div className="col-span-1 lg:col-span-3 space-y-6">
              
              {/* Navigation */}
              <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10">
                <h3 className="text-budget-primary-dark font-bold mb-4 font-sans text-sm tracking-wide">Navigation</h3>
                <nav className="space-y-1 font-sans text-sm font-medium">
                  {[
                    { icon: Home, label: "Dashboard", active: true },
                    { icon: Calendar, label: "Transactions" },
                    { icon: CreditCard, label: "Bills" },
                    { icon: ShoppingBag, label: "Subscriptions" },
                    { icon: Shield, label: "Budget" },
                    { icon: Star, label: "Savings Goals" },
                    { icon: ChartIcon, label: "Reports" },
                  ].map((item, i) => (
                    <a key={i} href="#" className={\`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors \${item.active ? 'bg-budget-bg-start/80 text-budget-text font-bold' : 'text-budget-text/70 hover:bg-budget-bg-start/40 hover:text-budget-text'}\`}>
                      <item.icon className={\`w-4 h-4 \${item.active ? 'text-budget-primary-dark' : 'text-budget-text/50'}\`} strokeWidth={item.active ? 2.5 : 2} />
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Overview */}
              <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-xl opacity-80">🍓</div>
                <h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Quick Overview</h3>
                
                <div className="space-y-4 font-sans text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-budget-text/80 font-medium">This Month</span>
                    <span className="font-bold text-budget-text">$3,240</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-budget-text/80 font-medium">This Week</span>
                    <span className="font-bold text-budget-text">$780</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-budget-primary/10 mt-2">
                    <span className="text-budget-text/80 font-medium">Total Balance</span>
                    <span className="font-bold text-budget-text">$12,850</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-1">
                    <span className="text-budget-text/80 font-medium">Savings Rate</span>
                    <span className="font-bold text-budget-text">28%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 lg:col-span-9 space-y-6">
              
              {/* Top Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Income", amount: "$5,820", sub: "This Month", icon: Wallet },
                  { title: "Total Expenses", amount: "$2,580", sub: "This Month", icon: ShoppingBag },
                  { title: "Total Savings", amount: "$1,650", sub: "This Month", icon: PiggyBank },
                  { title: "Total Balance", amount: "$12,850", sub: "All Accounts", icon: CreditCard },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/90 rounded-xl p-5 shadow-sm border border-budget-primary/10 flex flex-col items-center text-center relative group">
                    <h4 className="text-budget-primary-dark font-bold font-sans text-[11px] tracking-wide mb-3">{stat.title}</h4>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-budget-bg-start/70 p-2 rounded-lg group-hover:bg-budget-primary/20 transition-colors">
                        <stat.icon className="w-6 h-6 text-budget-primary-dark" strokeWidth={1.5} />
                      </div>
                      <span className="text-2xl font-bold font-sans text-budget-text">{stat.amount}</span>
                    </div>
                    <span className="text-[10px] text-budget-text/50 uppercase tracking-widest font-sans font-bold">{stat.sub}</span>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Budget Overview Chart */}
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10">
                  <h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Budget Overview</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-48 h-48 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {donutData.map((entry, index) => (
                              <Cell key={\`cell-\${index}\`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-bold font-sans text-budget-text">$2,580</span>
                        <span className="text-[9px] font-sans text-budget-text/50 uppercase tracking-widest mt-1">Total Expenses</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3 font-sans text-xs w-full">
                      {donutData.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-budget-text/70 flex-1">{item.name}</span>
                          <span className="font-bold text-budget-text/90">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spending Trend Line Chart */}
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10">
                  <h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Spending Trend</h3>
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-budget-primary)" opacity={0.3} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-budget-text)', opacity: 0.6 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-budget-text)', opacity: 0.6 }} tickFormatter={(v) => \`$\${v >= 1000 ? (v/1000)+'k' : v}\`} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                          itemStyle={{ color: 'var(--color-budget-primary-dark)', fontWeight: 'bold' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="var(--color-budget-primary-dark)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-budget-primary-dark)", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Upcoming Bills */}
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-xl opacity-80">🍓</div>
                  <h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Upcoming Bills</h3>
                  
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="text-budget-text/60 font-medium border-b border-budget-primary/10">
                          <th className="pb-3 px-2 font-normal">Bill</th>
                          <th className="pb-3 px-2 font-normal">Due Date</th>
                          <th className="pb-3 px-2 font-normal text-right">Amount</th>
                          <th className="pb-3 px-2 font-normal text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingBills.map((bill, i) => (
                          <tr key={i} className={\`border-b border-budget-primary/5 last:border-0\`}>
                            <td className="py-3.5 px-2 font-bold text-budget-text">{bill.name}</td>
                            <td className="py-3.5 px-2 text-budget-text/70">{bill.date}</td>
                            <td className="py-3.5 px-2 text-right font-bold text-budget-text">\${bill.amount.toLocaleString()}</td>
                            <td className="py-3.5 px-2 text-center">
                              <span className="inline-block bg-budget-bg-start text-budget-primary-dark font-bold px-3 py-1 rounded-full">{bill.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Savings Goals */}
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-xl opacity-80">🍓</div>
                  <h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Savings Goals</h3>
                  
                  <div className="space-y-6 flex flex-col justify-center">
                    {savingsGoals.map((goal, i) => (
                      <div key={i} className="font-sans">
                        <div className="flex justify-between items-end mb-2">
                          <span className="font-bold text-budget-text text-xs">{goal.name}</span>
                          <span className="text-budget-text/60 text-[10px] uppercase tracking-wider font-bold">\${goal.current.toLocaleString()} / \${goal.target.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-budget-bg-start/50 rounded-full h-2.5 overflow-hidden mb-1.5 flex shadow-inner">
                          <div 
                            className="bg-budget-primary-dark rounded-full transition-all duration-1000"
                            style={{ width: \`\${goal.percent}%\` }}
                          />
                        </div>
                        <div className="text-[10px] text-right font-bold text-budget-text">
                          {goal.percent}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
          
        </div>
      </div>
    </PageShell>
  );
}
`

fs.writeFileSync('src/routes/outils/budget-planner.tsx', code);
