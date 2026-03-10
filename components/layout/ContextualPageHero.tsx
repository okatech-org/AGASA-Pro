"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

type HeroItem = {
  pattern: RegExp;
  title: string;
  subtitle: string;
  image: string;
};

const HERO_ITEMS: HeroItem[] = [
  {
    pattern: /^\/tarifs/,
    title: "Tarification officielle AGASA-Pro",
    subtitle: "Des coûts clairs, réglementés et transparents pour les opérateurs gabonais.",
    image: "/images/gabon/gabon-compliance-council.jpg",
  },
  {
    pattern: /^\/faq/,
    title: "Assistance opérateurs",
    subtitle: "Réponses rapides pour vos démarches sanitaires et phytosanitaires.",
    image: "/images/gabon/team-review.jpg",
  },
  {
    pattern: /^\/tutoriels/,
    title: "Tutoriels AGASA-Pro",
    subtitle: "Guides visuels pour réussir chaque démarche du premier coup.",
    image: "/images/gabon/mobile-citizen-service.jpg",
  },
  {
    pattern: /^\/verification/,
    title: "Vérification des certificats",
    subtitle: "Contrôlez instantanément l'authenticité d'un document AGASA.",
    image: "/images/gabon/certificate-verification.jpg",
  },
  {
    pattern: /^\/demo/,
    title: "Démonstration du portail opérateur",
    subtitle: "Explorez les parcours métiers avec des profils prêts à l'emploi.",
    image: "/images/gabon/gabon-operators-meeting.jpg",
  },
  {
    pattern: /^\/connexion|^\/inscription/,
    title: "Accès sécurisé AGASA-Pro",
    subtitle: "Connectez-vous pour gérer vos obligations réglementaires en ligne.",
    image: "/images/gabon/digital-office.jpg",
  },
  {
    pattern: /^\/tableau-de-bord|^\/agrement/,
    title: "Gestion des agréments",
    subtitle: "Suivez vos demandes, décisions et certificats sans paperasse.",
    image: "/images/gabon/gabon-public-service.jpg",
  },
  {
    pattern: /^\/importation/,
    title: "Importation alimentaire",
    subtitle: "Déclarez vos flux et obtenez vos autorisations dans un cadre sécurisé.",
    image: "/images/gabon/libreville-city.jpg",
  },
  {
    pattern: /^\/phytosanitaire/,
    title: "Conformité phytosanitaire",
    subtitle: "Encadrez vos produits agricoles avec des preuves traçables.",
    image: "/images/gabon/public-health-advice.jpg",
  },
  {
    pattern: /^\/analyses|^\/formation/,
    title: "Analyses et compétences",
    subtitle: "Laboratoire, contrôle qualité et formations pour renforcer la conformité.",
    image: "/images/gabon/health-safety-hero.jpg",
  },
  {
    pattern: /^\/paiements|^\/notifications|^\/profil/,
    title: "Pilotage opérateur",
    subtitle: "Paiements, alertes et informations centralisés dans un seul espace.",
    image: "/images/gabon/smartphone-guidance.jpg",
  },
  {
    pattern: /^\/admin/,
    title: "Administration AGASA-Pro",
    subtitle: "Supervision des opérateurs, audit et gouvernance de la plateforme.",
    image: "/images/gabon/gabon-compliance-council.jpg",
  },
];

function findHero(pathname: string) {
  return HERO_ITEMS.find((item) => item.pattern.test(pathname));
}

type ContextualPageHeroProps = {
  compact?: boolean;
};

export function ContextualPageHero({ compact = false }: ContextualPageHeroProps) {
  const pathname = usePathname();

  if (!pathname || pathname === "/") {
    return null;
  }

  const hero = findHero(pathname);
  if (!hero) {
    return null;
  }

  return (
    <section className={`max-w-7xl mx-auto px-4 ${compact ? "pt-0" : "pt-24 md:pt-28"} mb-6 md:mb-8`}>
      <div className="relative overflow-hidden rounded-2xl min-h-[220px] md:min-h-[280px] border border-border shadow-[var(--shadow-md)]">
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/55 to-emerald-950/40" />
        <div className="relative z-10 p-6 md:p-10 max-w-2xl">
          <span className="text-overline text-[var(--agasa-emerald)]">AGASA-Pro</span>
          <h1 className="mt-2 text-white">{hero.title}</h1>
          <p className="mt-3 text-base md:text-lg text-white/85 font-sans leading-[1.7]">
            {hero.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
