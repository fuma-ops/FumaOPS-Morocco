import { Link } from "@tanstack/react-router";
import { MessageCircle, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/about", label: "Qui sommes-nous" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/processus", label: "Processus" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 glass relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
        <div className="h-full w-1/3 gradient-primary blur-[1px] animate-navbar-line relative" />
        <div className="absolute top-0 left-0 h-full w-1/4 gradient-primary animate-navbar-line" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <div className="relative h-10 w-10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <div className="absolute inset-0 rounded-xl bg-[conic-gradient(from_0deg,transparent_60%,oklch(0.65_0.28_305_/_1)_80%,transparent_100%)] animate-rotate-border" />
            <div className="absolute inset-0 rounded-xl bg-[conic-gradient(from_0deg,transparent_60%,oklch(0.65_0.28_305_/_1)_80%,transparent_100%)] animate-rotate-border blur-[6px]" />
            <div className="absolute inset-[2px] rounded-[10px] bg-background flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 gradient-primary opacity-30" />
              <Sparkles className="relative z-10 h-5 w-5 text-white group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Fuma<span className="gradient-text">OPS</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 rounded-full text-sm text-white hover:text-white/80 transition-all font-medium"
              activeProps={{
                className: "px-4 py-2 rounded-full text-sm gradient-text font-bold bg-white/5",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-primary text-white text-sm font-bold glow hover:scale-105 transition-transform"
          >
            Démarrer
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors text-white"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 animate-fade-up relative z-10 glass">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm text-white hover:bg-white/5 font-medium"
                activeProps={{
                  className: "px-4 py-3 rounded-xl text-sm gradient-text font-bold bg-white/10",
                }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full gradient-primary text-white text-sm font-bold glow"
            >
              Démarrer mon site
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 sm:mt-32 border-t border-white/10 bg-background/80 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-white/[0.02] -z-10" />
      <div className="mx-auto max-w-7xl px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold">
              Fuma<span className="gradient-text">OPS</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Sites e-commerce sur mesure pour les commerçants marocains. Paiement unique, livré en 3
            jours.
          </p>
          <p className="mt-2 text-sm text-[var(--neon)]" dir="rtl">
            موقعك الإلكتروني، ملك ليك
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-foreground transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Tarifs</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <span className="text-foreground font-medium block">Site Vitrine</span>
              <span className="text-xs">0 DH/mois · Payez 2000 DH</span>
            </li>
            <li>
              <span className="text-foreground font-medium block">Site E-commerce</span>
              <span className="text-xs">À partir de 2000 DH · WhatsApp Ready</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              WhatsApp :{" "}
              <a className="text-foreground" href="https://wa.me/212646340729">
                +212 646 340 729
              </a>
            </li>
            <li>
              Email :{" "}
              <a className="text-foreground" href="mailto:contact@fumaops.com">
                contact@fumaops.com
              </a>
            </li>
            <li>Maroc — partout</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FumaOPS. Tous droits réservés.
      </div>
    </footer>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/212646340729"
      target="_blank"
      rel="noopener"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 h-14 w-14 rounded-full gradient-primary flex items-center justify-center glow hover:scale-110 transition-transform group"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
      <span className="absolute inset-0 rounded-full animate-ping opacity-30 gradient-primary" />
    </a>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
