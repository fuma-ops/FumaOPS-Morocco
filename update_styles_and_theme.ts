import fs from 'fs';

let styles = fs.readFileSync('src/styles.css', 'utf8');

const themePurple = `
.theme-purple {
  --budget-text: #2e1065;
  --budget-primary: #8b5cf6;
  --budget-primary-dark: #5b21b6;
  --budget-accent: #c4b5fd;
  --budget-bg-start: #f5f3ff;
  --budget-bg-mid: #ede9fe;
  --budget-bg-end: #ddd6fe;
  --budget-destructive: #e11d48;
}
`;

if (!styles.includes('.theme-purple')) {
  styles = styles.replace('.theme-pink', themePurple + '\n.theme-pink');
  fs.writeFileSync('src/styles.css', styles);
}

let planner = fs.readFileSync('src/routes/outils/budget-planner.tsx', 'utf8');

const oldState = `const [currentTheme, setCurrentTheme] = useState<"pink" | "red" | "blue" | "black">("pink");
  const themes = [
    { id: "pink", label: "Rose", color: "#f472b6" },
    { id: "red", label: "Rouge", color: "#f87171" },
    { id: "blue", label: "Bleu", color: "#8EB1D1" },
    { id: "black", label: "Noir", color: "#52525b" }
  ] as const;`;

const newState = `const [currentTheme, setCurrentTheme] = useState<"purple" | "pink" | "red" | "blue" | "black">("purple");
  const themes = [
    { id: "purple", label: "Violet", color: "#8b5cf6" },
    { id: "pink", label: "Rose", color: "#f472b6" },
    { id: "red", label: "Rouge", color: "#f87171" },
    { id: "blue", label: "Bleu", color: "#8EB1D1" },
    { id: "black", label: "Noir", color: "#52525b" }
  ] as const;`;

planner = planner.replace(oldState, newState);

fs.writeFileSync('src/routes/outils/budget-planner.tsx', planner);
