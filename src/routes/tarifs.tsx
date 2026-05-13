import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { Check, X, Star } from "lucide-react";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs — FumaOPS" },
      {
        name: "description",
        content:
          "Paiement unique, à partir de 2000 DH. Pas d'abonnement. Découvrez si l'offre est faite pour vous.",
      },
    ],
  }),
  component: Tarifs,
});

const plans = [
  {
    name: "Site Vitrine",
    price: "2000 DH",
    desc: "Présence professionnelle, 0 DH/mois. Présentez vos services avec élégance.",
    cta: "Commander mon site",
    highlight: false,
    ar_name: "سيت فيترين",
    ar_desc: "سيت واعر، 0 درهم للشهر، كيقدم لخدمات ديالك.",
  },
  {
    name: "Site E-commerce",
    price: "À partir de 2000 DH",
    desc: "Vente en ligne, réception des commandes (WhatsApp/Email), dashboard complet. 0 DH/mois.",
    cta: "Lancer mon e-shop",
    highlight: true,
    badge: "Plus Populaire",
    ar_name: "سيت إيكوميرس",
    ar_desc: "بيع أونلاين، توصل بلي كوموند فواتساب و إيميل، 0 درهم للشهر.",
  },
  {
    name: "Évolutions & Support",
    price: "À partir de 500 DH",
    desc: "Ajout de fonctionnalités, maintenance avancée et support 30 jours inclus.",
    cta: "Nous contacter",
    highlight: false,
    ar_name: "تطوير و مواكبة",
    ar_desc: "زيادة داكشي اللي خاصك و كنبقاو متبعين معاك.",
  },
];

const yes = [
  { fr: "Débutant ou e-commerçant en croissance", ar: "يلاه بادي أو باغي تكبر مشروعك" },
  {
    fr: "Moins de 500 commandes / jour (scalable jusqu'à 10 000+ vues/jour, parfait Ads / TikTok)",
    ar: "عندك قل من 500 طلبية في النهار",
  },
  { fr: "Volonté d'être propriétaire du site", ar: "باغي تملك الموقع ديالك بصفة نهائية" },
  {
    fr: "Vente avec Paiement à la Livraison (Cash on Delivery)",
    ar: "كتبيع بالدفع عند الاستلام (Cash on Delivery)",
  },
  { fr: "Gestion depuis un téléphone mobile", ar: "باغي تسير كلشي غير من التيليفون ديالك" },
];
const no = [
  {
    fr: "+ de 500 commandes/jour avec logistique d'entrepôt et ERP lourd",
    ar: "عندك كثر من 500 طلبية في النهار وستوك كبير",
  },
  {
    fr: "Exigence absolue de paiement par carte bancaire / CMI",
    ar: "ضروري عندك الخلاص بالبطاقة البنكية",
  },
  {
    fr: "Système par abonnement avec hotline 24/7 type Shopify",
    ar: "باغي نظام بإشتراك شهري بحال شوبيفاي",
  },
];

function Tarifs() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          <span dir="rtl">ادفع مرة واحدة فقط</span> · Payez une seule fois
        </div>
        <p className="mt-4 text-xl sm:text-2xl font-bold gradient-text" dir="rtl">
          ثمن واضح بلا مفاجآت
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold">
          Des <span className="gradient-text">tarifs honnêtes</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Paiement unique. Pas d'abonnement. Le site est à toi, à vie.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-8 sm:py-10 grid md:grid-cols-3 gap-4 sm:gap-5">
        {plans.map((p, i) => (
          <div
            key={p.name}
            className={`relative rounded-3xl p-6 sm:p-7 hover-lift transition-all animate-fade-up delay-${(i + 1) * 100} ${p.highlight ? "glass neon-border glow md:scale-105" : "glass hover:glow"}`}
          >
            {p.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-xs font-semibold flex items-center gap-1 glow">
                <Star className="h-3 w-3 animate-pulse-glow" /> {p.badge}
              </div>
            )}
            <h3 className="font-display text-lg sm:text-xl font-bold">{p.name}</h3>
            <div
              className={`mt-2 text-2xl sm:text-3xl font-bold ${p.highlight ? "gradient-text" : ""}`}
            >
              {p.price}
            </div>
            <p className="mt-3 text-sm text-muted-foreground min-h-[60px]">{p.desc}</p>
            <Link
              to="/contact"
              className={`group mt-6 inline-flex w-full justify-center items-center gap-2 px-5 py-3 rounded-full font-medium transition-all ${p.highlight ? "gradient-primary text-primary-foreground glow hover:scale-105" : "glass hover:bg-white/10"}`}
            >
              {p.cta} <Star className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform" />
            </Link>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-6 py-12 sm:py-16">
        <p className="text-center text-xl sm:text-2xl font-bold gradient-text" dir="rtl">
          واش هاد العرض مناسب ليك ؟
        </p>
        <h2 className="mt-2 text-center text-3xl sm:text-4xl md:text-5xl font-bold">
          Est-ce <span className="gradient-text">fait pour toi</span> ?
        </h2>
        <p className="mt-3 text-center text-sm sm:text-base text-muted-foreground">
          On préfère être honnête dès le départ.
        </p>

        <div className="mt-8 sm:mt-10 grid md:grid-cols-2 gap-4 sm:gap-5">
          <div className="glass rounded-3xl p-6 sm:p-7 hover-lift">
            <div className="flex flex-col gap-1.5 mb-5">
              <div className="flex items-center gap-2 text-[var(--neon)]">
                <Check className="h-5 w-5" />{" "}
                <span className="font-semibold">C'est fait pour toi SI</span>
              </div>
              <span className="text-[var(--neon)] text-xs font-semibold pl-7" dir="rtl">
                هاد العرض مناسب ليك يالكان :
              </span>
            </div>
            <ul className="space-y-4">
              {yes.map((x, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-[var(--neon)]" />
                  <div className="flex flex-col gap-1">
                    <span>{x.fr}</span>
                    <span className="text-[var(--neon)] font-medium text-xs" dir="rtl">
                      {x.ar}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-3xl p-6 sm:p-7 hover-lift">
            <div className="flex flex-col gap-1.5 mb-5">
              <div className="flex items-center gap-2 text-destructive">
                <X className="h-5 w-5" />{" "}
                <span className="font-semibold">Ce n'est PAS pour toi SI</span>
              </div>
              <span className="text-destructive text-xs font-semibold pl-7" dir="rtl">
                هاد العرض ماصالحش ليك يالكان :
              </span>
            </div>
            <ul className="space-y-4">
              {no.map((x, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <X className="h-5 w-5 shrink-0 mt-0.5 text-destructive" />
                  <div className="flex flex-col gap-1">
                    <span>{x.fr}</span>
                    <span className="text-destructive/80 font-medium text-xs" dir="rtl">
                      {x.ar}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
