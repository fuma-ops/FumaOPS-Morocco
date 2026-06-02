import fs from 'fs';

let content = fs.readFileSync('src/routes/outils/budget-planner.tsx', 'utf8');

// 1. Remove the "Commencer le planning" button from the sidebar
const startPlanningStr = `<h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Aperçu Rapide</h3>
                <button onClick={() => setActiveTab('Dépenses')} className="w-full mb-4 bg-budget-primary hover:bg-budget-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm uppercase tracking-wide text-xs">
                  Commencer le planning
                </button>`;
const startPlanningNew = `<h3 className="text-budget-primary-dark font-bold mb-6 font-sans text-sm tracking-wide">Aperçu Rapide</h3>`;
content = content.replace(startPlanningStr, startPlanningNew);


// 2. Add custom CSS for calendar picker in the global block (at the end of the file or in styles.css)
// Wait, we can just use inline style for calendar wrapper, but native calendar styling works better with a CSS block.
const styleBlockPattern = `</style>
                </div>`;
const newStyleBlock = `
                    }
                    /* Styling the month input */
                    .custom-month-input::-webkit-calendar-picker-indicator {
                       filter: invert(1) brightness(100);
                       cursor: pointer;
                       opacity: 0.8;
                    }
                    .custom-month-input::-webkit-calendar-picker-indicator:hover {
                       opacity: 1;
                    }
                  </style>
                </div>`;
if (content.includes(styleBlockPattern)) {
    content = content.replace(styleBlockPattern, newStyleBlock);
} else {
    // Inject style at the end of the main div
    content = content.replace('</PageShell>', `  <style>{\`
    .custom-month-input::-webkit-calendar-picker-indicator {
      filter: invert(1) brightness(100);
      cursor: pointer;
      opacity: 0.8;
    }
    .custom-month-input::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
  \`}</style>\n    </PageShell>`);
}

// 3. Update the Month Input and Header Layout
const headerOld = `<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
            <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-budget-primary/20 w-fit">
              <input 
                type="month" 
                value={selectedMonthRaw} 
                onChange={e => setSelectedMonthRaw(e.target.value)} 
                className="bg-transparent font-bold tracking-tight text-budget-text uppercase outline-none" 
                style={{ fontFamily: "'Setta', cursive", fontSize: '1.2rem' }}
              />
            </div>
            
            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center my-4 md:my-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white text-center" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)', fontFamily: "'Oliver', sans-serif" }}>
                Budget Tracker
              </h1>
            </div>

            <div className="flex items-center gap-2 bg-white/70 p-2 rounded-full shadow-sm z-10 backdrop-blur-md w-fit md:ml-auto">`;

const headerNew = `<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative">
            <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-5 py-3 rounded-2xl backdrop-blur-md border border-white/30 w-fit shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
              <input 
                type="month" 
                value={selectedMonthRaw} 
                onChange={e => setSelectedMonthRaw(e.target.value)} 
                className="bg-transparent font-bold tracking-wide text-white uppercase outline-none custom-month-input cursor-pointer" 
                style={{ fontFamily: "'Setta', cursive", fontSize: '1.4rem' }}
              />
            </div>
            
            <div className="xl:absolute xl:left-1/2 xl:top-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 flex items-center justify-center my-2 xl:my-0">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white text-center drop-shadow-2xl" style={{ textShadow: '0 8px 30px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)', fontFamily: "'Oliver', sans-serif" }}>
                Budget Tracker
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 z-10 xl:ml-auto">
              <button 
                onClick={() => setActiveTab('Dépenses')} 
                className="bg-white/10 hover:bg-white/30 border border-white/40 text-white font-black py-2.5 px-6 rounded-full transition-all flex justify-center items-center backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] uppercase tracking-wider text-[11px] sm:text-xs"
              >
                Comencer le Planning
              </button>

              <div className="flex items-center gap-2 bg-white/20 p-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] backdrop-blur-md border border-white/30">`;

content = content.replace(headerOld, headerNew);

fs.writeFileSync('src/routes/outils/budget-planner.tsx', content);
