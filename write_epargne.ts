import fs from 'fs';

let content = fs.readFileSync('src/routes/outils/budget-planner.tsx', 'utf8');

// 1. Add state logic for newGoal
const stateAnchor = "const [savingsGoals, setSavingsGoals] = useState(defaultSavingsGoals);";
const newStates = `const [savingsGoals, setSavingsGoals] = useState(defaultSavingsGoals);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });`;
content = content.replace(stateAnchor, newStates);

// 2. Add helper functions
const funcAnchor = "const addBill = () => {";
const newFuncs = `const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    setSavingsGoals([...savingsGoals, { id: Date.now().toString(), name: newGoal.name, current: 0, target: parseFloat(newGoal.target) }]);
    setNewGoal({ name: '', target: '' });
  };
  const deleteGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(s => s.id !== id));
  };
  const addFundsToGoal = (id: string, amountToAdd: number) => {
    setSavingsGoals(savingsGoals.map(s => {
      if (s.id === id) {
        return { ...s, current: Math.min(s.current + amountToAdd, s.target) };
      }
      return s;
    }));
  };

  const addBill = () => {`;
content = content.replace(funcAnchor, newFuncs);

// 3. Replace the View: EPARGNE
const viewOld = `{/* View: EPARGNE */}
              {activeTab === "Épargne" && (
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 animate-fade-in font-sans">
                  <h2 className="text-xl font-bold mb-6 text-budget-text">Objectifs d'Épargne</h2>
                  <div className="p-6 text-center italic text-budget-text/60 border border-budget-primary/10 rounded-lg bg-budget-bg-start/10">
                    Module d'édition des objectifs à venir.
                  </div>
                </div>
              )}`;

const viewNew = `{/* View: EPARGNE */}
              {activeTab === "Épargne" && (
                <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-budget-primary/10 animate-fade-in font-sans">
                  <h2 className="text-xl font-bold mb-6 text-budget-text">Objectifs d'Épargne</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-budget-text/70 uppercase mb-1">Nom de l'objectif</label>
                      <input type="text" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="Ex: Voyage, Voiture..." />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-budget-text/70 uppercase mb-1">Objectif Cible (MAD)</label>
                      <input type="number" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} className="w-full bg-white border border-budget-primary/20 rounded-md px-3 py-2 outline-none focus:border-budget-primary" placeholder="0.00" />
                    </div>
                    <div className="flex items-end">
                      <button onClick={addGoal} className="w-full sm:w-auto bg-budget-accent hover:bg-budget-accent/90 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center justify-center gap-2">
                        <Plus size={18} /> Ajouter
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {savingsGoals.map(sg => {
                      const percentage = Math.min(100, Math.round((sg.current / sg.target) * 100));
                      return (
                        <div key={sg.id} className="bg-white border border-budget-primary/10 rounded-xl p-5 shadow-sm relative">
                          <button onClick={() => deleteGoal(sg.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                          <div className="flex justify-between items-center mb-2 pr-8">
                            <h3 className="font-bold text-budget-text text-lg">{sg.name}</h3>
                            <div className="text-right">
                              <span className="text-budget-primary-dark font-extrabold text-xl">{sg.current.toLocaleString()}</span>
                              <span className="text-budget-text/50 text-sm"> / {sg.target.toLocaleString()} MAD</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden relative">
                            <div className="bg-gradient-to-r from-budget-bg-start to-budget-primary h-3 rounded-full transition-all duration-1000 relative" style={{ width: \`\${percentage}%\` }}>
                              <div className="absolute inset-0 bg-white/20" style={{ backgroundSize: '1rem 1rem', backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)' }}></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-budget-primary-dark bg-budget-bg-start/20 px-2 py-1 rounded-full">{percentage}% Atteint</span>
                            <div className="flex items-center gap-2">
                               <button onClick={() => addFundsToGoal(sg.id, 100)} className="text-xs bg-budget-primary/10 hover:bg-budget-primary/20 text-budget-primary-dark font-semibold py-1 px-3 rounded-md transition-colors">+ 100</button>
                               <button onClick={() => addFundsToGoal(sg.id, 500)} className="text-xs bg-budget-primary/10 hover:bg-budget-primary/20 text-budget-primary-dark font-semibold py-1 px-3 rounded-md transition-colors">+ 500</button>
                               <button onClick={() => addFundsToGoal(sg.id, 1000)} className="text-xs bg-budget-primary/10 hover:bg-budget-primary/20 text-budget-primary-dark font-semibold py-1 px-3 rounded-md transition-colors">+ 1000</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {savingsGoals.length === 0 && <div className="text-center italic text-budget-text/50 p-6">Aucun objectif d'épargne.</div>}
                  </div>
                </div>
              )}`;

content = content.replace(viewOld, viewNew);

fs.writeFileSync('src/routes/outils/budget-planner.tsx', content);
