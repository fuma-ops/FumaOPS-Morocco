import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { PROJECTS, type Project } from "@/lib/constants";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — FumaOPS" },
      {
        name: "description",
        content:
          "Découvrez nos sites e-commerce : bijouterie, mode, déco, épicerie, restauration, enfants.",
      },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          Portfolio
        </div>
        <p className="mt-4 text-xl sm:text-2xl font-bold gradient-text" dir="rtl">
          شوف الخدمة ديالنا
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold">
          Nos <span className="gradient-text">réalisations</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Des sites web conçus pour générer des ventes.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-8 sm:py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PROJECTS.map((p, i) => (
            <a
              href={p.projectUrl || "#"}
              target={p.projectUrl ? "_blank" : "_self"}
              rel={p.projectUrl ? "noopener noreferrer" : ""}
              key={p.id}
              className={`group relative overflow-hidden rounded-3xl glass hover-lift hover:glow transition-all animate-fade-up delay-${((i % 5) + 1) * 100}`}
            >
              <div className="aspect-square overflow-hidden bg-white/5">
                <img
                  src={p.imageUrl.replace(/^\.\.?\/assets\//, "/")}
                  alt={p.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[var(--neon)]">
                  {p.category}
                </p>
                <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold">{p.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
