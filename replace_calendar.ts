import fs from 'fs';

let content = fs.readFileSync('src/routes/outils/budget-planner.tsx', 'utf8');

if (!content.includes("import { CustomCalendar }")) {
  content = content.replace("import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';", "import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';\nimport { CustomCalendar } from '../../components/CustomCalendar';");
}

const oldInputBlock = `<div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-5 py-3 rounded-2xl backdrop-blur-md border border-white/30 w-fit shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
              <input 
                type="month" 
                value={selectedMonthRaw} 
                onChange={e => setSelectedMonthRaw(e.target.value)} 
                className="bg-transparent font-bold tracking-wide text-white uppercase outline-none custom-month-input cursor-pointer" 
                style={{ fontFamily: "'Setta', cursive", fontSize: '1.4rem' }}
              />
            </div>`;

const newCalendarBlock = `<CustomCalendar selectedMonthRaw={selectedMonthRaw} onMonthChange={setSelectedMonthRaw} />`;

content = content.replace(oldInputBlock, newCalendarBlock);

fs.writeFileSync('src/routes/outils/budget-planner.tsx', content);
