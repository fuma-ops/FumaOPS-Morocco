import fs from 'fs';

let content = fs.readFileSync('src/routes/outils/budget-planner.tsx', 'utf8');

// Add Printer to icons
content = content.replace('Plus,\n  Trash2\n} from "lucide-react";', 'Plus,\n  Trash2,\n  Printer\n} from "lucide-react";');

// In nav items, add Récapitulatif
content = content.replace(
  '{ icon: Star, label: "Épargne" },',
  '{ icon: Star, label: "Épargne" },\n                    { icon: Printer, label: "Récapitulatif" },'
);

// Date logic
content = content.replace(
  'const donutData = categories.map',
  `const currentDate = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });\n  const donutData = categories.map`
);

// Header layout changes
const oldHeader = `<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-4xl font-bold tracking-tight">Budget Tracker</h1>
            <div className="flex items-center gap-2 bg-white/50 p-2 rounded-full shadow-sm">`;

const newHeader = `<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
            <div className="text-2xl font-bold tracking-tight text-budget-text uppercase bg-white/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-budget-primary/20">
              {currentDate}
            </div>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-md text-center" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                Budget Tracker
              </h1>
            </div>

            <div className="flex items-center gap-2 bg-white/70 p-2 rounded-full shadow-sm z-10 backdrop-blur-md">`;

content = content.replace(oldHeader, newHeader);

// Add the recap view
const epargneViewEnd = `)}

            </div>`;

const recapView = `)}

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
                  
                  <div className="w-full overflow-x-auto rounded-lg border border-budget-primary/20 bg-white">
                    <table className="w-full text-left font-sans text-sm">
                      <thead>
                        <tr className="bg-budget-primary/20 text-budget-text font-extrabold uppercase tracking-widest text-[11px] border-b border-budget-primary/30">
                          <th className="py-3 px-4 font-extrabold">Catégorie</th>
                          <th className="py-3 px-4 font-extrabold text-right">Budgeté (MAD)</th>
                          <th className="py-3 px-4 font-extrabold text-right">Actuel (MAD)</th>
                          <th className="py-3 px-4 font-extrabold text-right">Différence</th>
                          <th className="py-3 px-4 font-extrabold text-center">Besoins / Envies</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat, i) => {
                          const catExpenses = expenses.filter(e => e.categoryId === cat.id).reduce((a, b) => a + b.amount, 0);
                          const diff = cat.limit - catExpenses;
                          return (
                            <tr key={cat.id} className="border-b border-budget-primary/10 last:border-0 hover:bg-budget-bg-start/10 transition-colors">
                              <td className="py-3 px-4 font-semibold flex items-center gap-3 text-budget-text">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div> 
                                {cat.name}
                              </td>
                              <td className="py-3 px-4 text-right font-medium">{cat.limit.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right font-bold text-budget-text">{catExpenses.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right font-medium">
                                <span className={diff >= 0 ? "text-emerald-600" : "text-red-500"}>
                                  {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-budget-text/70 uppercase">
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name={\`nw-\${cat.id}\`} defaultChecked={i % 2 === 0} className="w-3 h-3 accent-budget-primary" /> Need
                                  </label>
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name={\`nw-\${cat.id}\`} defaultChecked={i % 2 !== 0} className="w-3 h-3 accent-budget-primary" /> Want
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
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <style>{\`
                    @media print {
                      body * {
                        visibility: hidden;
                      }
                      #budget-planner-app, #budget-planner-app * {
                        display: none;
                      }
                      .animate-fade-in {
                         display: block !important;
                         visibility: visible !important;
                         position: absolute;
                         left: 0;
                         top: 0;
                         width: 100%;
                      }
                      .animate-fade-in * {
                        visibility: visible;
                      }
                    }
                  \`}</style>
                </div>
              )}

            </div>`;

content = content.replace(epargneViewEnd, recapView);

fs.writeFileSync('src/routes/outils/budget-planner.tsx', content);
