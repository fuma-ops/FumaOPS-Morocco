import fs from 'fs';
let content = fs.readFileSync('src/styles.css', 'utf8');
if (!content.includes('shimmer-slide')) {
  content = content.replace('@keyframes shimmer {', '@keyframes shimmer-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }\n  @keyframes shimmer {');
  fs.writeFileSync('src/styles.css', content);
}
let pf = fs.readFileSync('src/routes/outils/budget-planner.tsx', 'utf8');
pf = pf.replace('animate-[shimmer_1.5s_infinite]', 'animate-[shimmer-slide_2s_infinite]');
fs.writeFileSync('src/routes/outils/budget-planner.tsx', pf);
