import fs from 'fs';

let content = fs.readFileSync('src/routes/outils/budget-planner.tsx', 'utf8');

const oldStateLogic = `  // STATE LOGIC
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
  ]);`;

const newStateLogic = `  // STATE LOGIC
  const [selectedMonthRaw, setSelectedMonthRaw] = useState(() => {
    const d = new Date();
    return \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}\`;
  });

  const defaultCategories = [
    { id: 'c1', name: "Logement", color: "var(--budget-primary-dark)", limit: 3000 },
    { id: 'c2', name: "Alimentation", color: "var(--budget-primary)", limit: 2000 },
    { id: 'c3', name: "Transport", color: "var(--budget-bg-end)", limit: 1000 },
    { id: 'c4', name: "Shopping", color: "var(--budget-bg-mid)", limit: 800 },
    { id: 'c5', name: "Factures", color: "var(--budget-accent)", limit: 500 },
    { id: 'c6', name: "Divers", color: "var(--budget-bg-start)", limit: 500 },
  ];

  const defaultSavingsGoals = [
    { id: 's1', name: "Fonds d'urgence", current: 5000, target: 20000 },
    { id: 's2', name: "Voyage d'été", current: 3000, target: 8000 },
    { id: 's3', name: "Nouvel Ordinateur", current: 1500, target: 15000 },
  ];

  const [dataMap, setDataMap] = useState<Record<string, any>>(() => {
    const d = new Date();
    const current = \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}\`;
    return {
      [current]: {
        incomes: [{ id: '1', source: 'Salaire', amount: 8000 }],
        expenses: [
          { id: 'e1', categoryId: 'c1', name: 'Loyer', amount: 2500 },
          { id: 'e2', categoryId: 'c2', name: 'Courses', amount: 1500 },
          { id: 'e3', categoryId: 'c3', name: 'Essence', amount: 400 },
        ],
        upcomingBills: [
          { id: 'b1', name: "Loyer", date: "25 May, 2026", amount: 2500, status: "À payer" },
          { id: 'b2', name: "Électricité", date: "27 May, 2026", amount: 350, status: "À payer" },
          { id: 'b3', name: "Internet", date: "28 May, 2026", amount: 250, status: "À payer" },
        ]
      }
    };
  });

  const currentData = dataMap[selectedMonthRaw] || { incomes: [], expenses: [], upcomingBills: [] };
  const incomes = currentData.incomes;
  const expenses = currentData.expenses;
  const upcomingBills = currentData.upcomingBills;

  const updateDataForMonth = (key: string, newValueFn: any) => {
    setDataMap(prev => {
      const existing = prev[selectedMonthRaw] || { incomes: [], expenses: [], upcomingBills: [] };
      const nextValue = typeof newValueFn === 'function' ? newValueFn(existing[key]) : newValueFn;
      return {
        ...prev,
        [selectedMonthRaw]: {
          ...existing,
          [key]: nextValue
        }
      };
    });
  };

  const setIncomes = (val: any) => updateDataForMonth('incomes', val);
  const setExpenses = (val: any) => updateDataForMonth('expenses', val);
  const setUpcomingBills = (val: any) => updateDataForMonth('upcomingBills', val);

  const [newIncome, setNewIncome] = useState({ source: '', amount: '' });
  const [categories, setCategories] = useState(defaultCategories);
  const [newExpense, setNewExpense] = useState({ categoryId: 'c1', name: '', amount: '' });
  const [newBill, setNewBill] = useState({ name: '', date: '', amount: '' });
  const [savingsGoals, setSavingsGoals] = useState(defaultSavingsGoals);

  const resetCurrentMonth = () => {
    setDataMap(prev => ({ ...prev, [selectedMonthRaw]: { incomes: [], expenses: [], upcomingBills: [] } }));
  };
`;

content = content.replace(oldStateLogic, newStateLogic);

// Replace currentDate reference
content = content.replace(
  "const currentDate = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });",
  "// currentDate removed"
);

content = content.replace(
  `<div className="text-xl sm:text-2xl font-bold tracking-tight text-budget-text uppercase bg-white/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-budget-primary/20 w-fit" style={{ fontFamily: "'Setta', cursive" }}>
              {currentDate}
            </div>`,
  `<div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-budget-primary/20 w-fit">
              <input 
                type="month" 
                value={selectedMonthRaw} 
                onChange={e => setSelectedMonthRaw(e.target.value)} 
                className="bg-transparent font-bold tracking-tight text-budget-text uppercase outline-none" 
                style={{ fontFamily: "'Setta', cursive", fontSize: '1.2rem' }}
              />
            </div>`
);

// Commencer le planning button
const startPlanningStr = `<h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Aperçu Rapide</h3>`;
const startPlanningNew = `<h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Aperçu Rapide</h3>
                <button onClick={() => setActiveTab('Dépenses')} className="w-full mb-4 bg-budget-primary hover:bg-budget-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm uppercase tracking-wide text-xs">
                  Commencer le planning
                </button>`;
content = content.replace(startPlanningStr, startPlanningNew);

// Add "Dashboard header Reset button"
const dashHeaderStr = `<div className="flex justify-between items-center mb-6">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Aperçu Budget</h3>
                        <button onClick={() => setActiveTab('Dépenses')} className="text-xs font-sans text-budget-primary-dark underline">Gérer</button>
                      </div>`;
const dashHeaderNew = `<div className="flex justify-between items-center mb-6">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Aperçu Budget</h3>
                        <div className="flex items-center gap-3">
                           <button onClick={resetCurrentMonth} className="text-xs font-sans text-red-500 hover:text-red-700 underline font-semibold">Réinitialiser ce mois</button>
                           <button onClick={() => setActiveTab('Dépenses')} className="text-xs font-sans text-budget-primary-dark underline font-semibold">Gérer</button>
                        </div>
                      </div>`;
content = content.replace(dashHeaderStr, dashHeaderNew);

fs.writeFileSync('src/routes/outils/budget-planner.tsx', content);
