import fs from "fs";

let content = fs.readFileSync("src/routes/outils/budget-planner.tsx", "utf-8");

// Map exact hex brackets to the new theme variables
const replacements = [
  { search: /\[#1C2B48\]/gi, replace: "budget-text" },
  { search: /\[#162D4A\]/gi, replace: "budget-text" },
  { search: /\[#3F111B\]/gi, replace: "budget-text" },
  { search: /text-\[#1C2B48\]/gi, replace: "text-budget-text" }, // Catch-all for any leftover

  { search: /\[#8EB1D1\]/gi, replace: "budget-primary" },
  { search: /\[#FF5F7E\]/gi, replace: "budget-primary" },
  
  { search: /\[#5C82A6\]/gi, replace: "budget-primary-dark" },
  { search: /\[#344E73\]/gi, replace: "budget-primary-dark" },

  { search: /\[#A7C7E7\]/gi, replace: "budget-accent" },
  { search: /\[#7BA1C7\]/gi, replace: "budget-accent" },

  { search: /\[#C4D8E5\]/gi, replace: "budget-bg-start" },
  { search: /\[#A1C1DF\]/gi, replace: "budget-bg-start" },

  { search: /\[#E8ECEF\]/gi, replace: "budget-bg-mid" },
  { search: /\[#D0DEEB\]/gi, replace: "budget-bg-mid" },

  { search: /\[#FF2E56\]/gi, replace: "budget-destructive" },
];

for (const r of replacements) {
  content = content.replace(r.search, r.replace);
}

// Add Playfair font to some classes (section titles etc)
content = content.replace(/className="section-title"/g, 'className="text-xl font-serif font-black text-budget-text flex items-center gap-2"');

fs.writeFileSync("src/routes/outils/budget-planner.tsx", content);
console.log("Refactored tailwind classes!");
