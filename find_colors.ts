import fs from "fs";
const content = fs.readFileSync("src/routes/outils/budget-planner.tsx", "utf-8");
const matches = content.match(/#[0-9A-Fa-f]{6}/g) || [];
const counts = matches.reduce((acc, c) => ({...acc, [c.toUpperCase()]: (acc[c.toUpperCase()] || 0) + 1}), {});
console.log(Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(x=>x.join(': ')).join('\n'));
