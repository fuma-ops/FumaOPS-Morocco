import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useEffect } from "react";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de Confidentialité | FumaOPS" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PolitiqueDeConfidentialitePage,
});

function PolitiqueDeConfidentialitePage() {
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date());

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 sm:px-6 pt-12 sm:pt-20 pb-20 animate-fade-in relative z-10 text-left">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4 gradient-text glow-primary">
          POLITIQUE DE CONFIDENTIALITÉ — FUMAOPS
        </h1>
        <p className="text-muted-foreground mb-10">Dernière mise à jour : {date}</p>

        <div className="space-y-10 text-white/90 leading-relaxed custom-prose">
          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">
              1. RESPONSABLE DU TRAITEMENT
            </h2>
            <p>
              FumaOPS
              <br />
              Site web : fumaops.com
              <br />
              Email : khfuma@gmail.com
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">2. DONNÉES COLLECTÉES</h2>
            <p className="mb-2">Dans le cadre de l'utilisation de fumaops.com, nous collectons :</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Nom et prénom (via formulaire de contact)</li>
              <li>Adresse email (via formulaire de contact)</li>
              <li>Téléphone (optionnel, via formulaire)</li>
              <li>Données de navigation (cookies analytiques)</li>
              <li>Cookies publicitaires Google AdSense</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">
              3. FINALITÉ DU TRAITEMENT
            </h2>
            <p className="mb-2">Ces données sont collectées pour :</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Répondre à vos demandes de contact et devis</li>
              <li>Améliorer l'expérience de navigation sur le site</li>
              <li>Afficher des publicités pertinentes (Google AdSense)</li>
              <li>Mesurer l'audience du site (Google Analytics)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">4. BASE LÉGALE</h2>
            <p>
              Le traitement est fondé sur votre consentement et l'exécution d'un contrat,
              conformément au RGPD.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">
              5. CONSERVATION DES DONNÉES
            </h2>
            <p>
              Vos données sont conservées 3 ans maximum après votre dernière interaction avec
              FumaOPS.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">
              6. PARTAGE DES DONNÉES
            </h2>
            <p className="mb-2">
              FumaOPS ne vend aucune donnée personnelle. Les données peuvent être partagées
              uniquement avec :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-2">
              <li>Google Analytics (mesure d'audience)</li>
              <li>Google AdSense (publicité)</li>
            </ul>
            <p>Ces services sont soumis à leur propre politique de confidentialité.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">7. VOS DROITS</h2>
            <p className="mb-2">
              Conformément au RGPD, vous disposez des droits : d'accès, de rectification, de
              suppression, d'opposition et de portabilité.
            </p>
            <p>Pour exercer ces droits : khfuma@gmail.com</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">8. COOKIES</h2>
            <p>
              Ce site utilise des cookies pour analyser le trafic (Google Analytics) et afficher des
              publicités (Google AdSense). Vous pouvez les désactiver dans votre navigateur.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--electric)] mb-3">9. CONTACT</h2>
            <p>
              khfuma@gmail.com
              <br />
              fumaops.com
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
