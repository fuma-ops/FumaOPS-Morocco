import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useEffect } from "react";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions Légales | FumaOPS" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 sm:px-6 pt-12 sm:pt-20 pb-20 animate-fade-in relative z-10 text-left">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-10 gradient-text glow-primary">
          MENTIONS LÉGALES — FUMAOPS
        </h1>

        <div className="space-y-10 text-white/90 leading-relaxed custom-prose">
          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">ÉDITEUR DU SITE</h2>
            <p className="text-muted-foreground">
              <strong className="text-white">FumaOPS</strong>
              <br />
              Site web : fumaops.com
              <br />
              Email : khfuma@gmail.com
              <br />
              Pays : Maroc
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">HÉBERGEMENT</h2>
            <p className="text-muted-foreground">Hébergeur : Vercel</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">
              DIRECTEUR DE LA PUBLICATION
            </h2>
            <p className="text-muted-foreground">Fuma</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">
              PROPRIÉTÉ INTELLECTUELLE
            </h2>
            <p className="text-muted-foreground">
              L'ensemble du contenu de fumaops.com (textes, visuels, outils, code) est protégé par
              le droit d'auteur. Toute reproduction sans autorisation écrite est interdite.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">PUBLICITÉ</h2>
            <p className="text-muted-foreground">
              Ce site utilise Google AdSense pour afficher des publicités. Google peut utiliser des
              cookies pour personnaliser les annonces affichées.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">CONTACT</h2>
            <p className="text-muted-foreground">khfuma@gmail.com</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
