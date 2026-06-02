import fs from 'fs';

let content = fs.readFileSync('src/routes/outils/budget-planner.tsx', 'utf8');

// 1. Move "Commencer le Planning" header button
const oldRightButton = `<button 
                onClick={() => setActiveTab('Dépenses')} 
                className="bg-pink-500 hover:bg-pink-600 border border-pink-400/50 text-white font-extrabold py-2.5 px-6 rounded-full transition-all flex justify-center items-center shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_4px_25px_rgba(236,72,153,0.5)] uppercase tracking-wider text-[11px] sm:text-xs"
              >
                Commencer le Planning
              </button>`;

content = content.replace(oldRightButton, '');

// 2. Wrap CustomCalendar and insert the new button
const oldCalendar = `<CustomCalendar selectedMonthRaw={selectedMonthRaw} onMonthChange={setSelectedMonthRaw} />`;

const animatedCommencer = `<div className="flex flex-wrap items-center gap-4">
              <CustomCalendar selectedMonthRaw={selectedMonthRaw} onMonthChange={setSelectedMonthRaw} />
              <button 
                onClick={() => setActiveTab('Dépenses')} 
                className="relative bg-white/10 hover:bg-white/20 transition-all px-6 py-3 rounded-2xl backdrop-blur-md border-[2.5px] border-purple-400/80 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] group overflow-hidden"
              >
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/0 via-purple-300/30 to-purple-500/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                 <span className="relative font-extrabold tracking-wide text-white uppercase" style={{ fontSize: '1rem' }}>
                   Commencer
                 </span>
              </button>
            </div>`;

content = content.replace(oldCalendar, animatedCommencer);

// 3. Fix the strawberries overlap
const overlap1 = `<div className="flex justify-between items-center mb-6">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Factures & Abonnements</h3>
                        <button onClick={() => setActiveTab('Factures & Abonnements')} className="text-xs font-sans text-budget-primary-dark underline">Gérer</button>
                      </div>`;
const fixOverlap1 = `<div className="flex justify-between items-center mb-6 pr-8 relative z-10">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Factures & Abonnements</h3>
                        <button onClick={() => setActiveTab('Factures & Abonnements')} className="text-xs font-sans text-budget-primary-dark underline">Gérer</button>
                      </div>`;
content = content.replace(overlap1, fixOverlap1);

const overlap2 = `<div className="flex justify-between items-center mb-6">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Objectifs d'Épargne</h3>
                        <button onClick={() => setActiveTab('Épargne')} className="text-xs font-sans text-budget-primary-dark underline">Gérer</button>
                      </div>`;
const fixOverlap2 = `<div className="flex justify-between items-center mb-6 pr-8 relative z-10">
                        <h3 className="text-budget-primary-dark font-bold font-sans text-sm tracking-wide">Objectifs d'Épargne</h3>
                        <button onClick={() => setActiveTab('Épargne')} className="text-xs font-sans text-budget-primary-dark underline">Gérer</button>
                      </div>`;
content = content.replace(overlap2, fixOverlap2);

fs.writeFileSync('src/routes/outils/budget-planner.tsx', content);
