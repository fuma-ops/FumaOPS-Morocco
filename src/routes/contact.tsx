import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { useState } from "react";
import { MessageCircle, Mail, MapPin, Phone, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FumaOPS" },
      {
        name: "description",
        content:
          "Contactez FumaOPS pour démarrer votre site e-commerce. Redirection WhatsApp pour un traitement direct.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", activity: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Bonjour FumaOPS,\n\nNom: ${form.name}\nTéléphone: ${form.phone}\nActivité: ${form.activity}\n\n${form.message}`;
    window.open(`https://wa.me/212646340729?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          Contact
        </div>
        <p className="mt-4 text-xl sm:text-2xl font-bold gradient-text" dir="rtl">
          واجد تبدا ؟ هضر معانا
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold">
          Parlons de ton <span className="gradient-text">projet</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Remplis le formulaire — tu seras redirigé vers WhatsApp pour un traitement direct avec
          notre équipe.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-7 md:p-9 neon-border">
          <form onSubmit={submit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Nom complet" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  className="input"
                />
              </Field>
              <Field label="Téléphone" required>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={20}
                  className="input"
                />
              </Field>
            </div>
            <Field label="Type d'activité" required>
              <input
                required
                value={form.activity}
                onChange={(e) => setForm({ ...form, activity: e.target.value })}
                placeholder="Mode, cosmétique, food..."
                maxLength={100}
                className="input"
              />
            </Field>
            <Field label="Message" required>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                className="input resize-none"
              />
            </Field>
            <button
              type="submit"
              className="group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full gradient-primary text-primary-foreground font-medium glow hover:scale-[1.02] transition-transform"
            >
              Envoyer via WhatsApp{" "}
              <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <p className="text-xs text-muted-foreground text-center">
              À l'envoi, tu seras redirigé vers WhatsApp pour discuter directement avec notre
              équipe.
            </p>
          </form>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: MessageCircle,
              t: "WhatsApp",
              v: "+212 646 340 729",
              href: "https://wa.me/212646340729",
            },
            { icon: Phone, t: "Téléphone", v: "+212 646 340 729", href: "tel:+212646340729" },
            {
              icon: Mail,
              t: "Email",
              v: "contact@fumaops.com",
              href: "mailto:contact@fumaops.com",
            },
            { icon: MapPin, t: "Localisation", v: "Maroc · partout" },
          ].map((c) => {
            const inner = (
              <>
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{c.t}</div>
                  <div className="font-medium">{c.v}</div>
                </div>
              </>
            );
            return c.href ? (
              <a
                key={c.t}
                href={c.href}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:glow transition-shadow"
              >
                {inner}
              </a>
            ) : (
              <div key={c.t} className="glass rounded-2xl p-5 flex items-center gap-4">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          padding: 0.875rem 1rem;
          border-radius: 0.875rem;
          background: oklch(1 0 0 / 0.04);
          border: 1px solid oklch(1 0 0 / 0.1);
          color: var(--color-foreground);
          font: inherit;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .input:focus { border-color: var(--neon); box-shadow: 0 0 0 3px oklch(0.72 0.32 320 / 0.2); }
      `}</style>
    </PageShell>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-[var(--neon)]"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
