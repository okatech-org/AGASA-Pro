import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Smartphone,
    ClipboardCheck,
    CreditCard,
    FileBadge,
    FileText,
    Package,
    Leaf,
    FlaskConical,
    GraduationCap,
    FolderOpen,
    ArrowRight,
    ShieldCheck,
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    Shield,
    Clock,
    Eye,
} from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">

            {/* ═══════════════════════════════════════════
                A. TOPBAR — Info bandeau (desktop only)
               ═══════════════════════════════════════════ */}
            <div className="hidden md:block bg-[var(--agasa-primary)] text-white/80">
                <div className="container-agasa flex items-center justify-between h-10 text-topbar">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" strokeWidth={1.8} />
                            contact@agasa.ga
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
                            Lun-Ven, 08h - 15h30
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" strokeWidth={1.8} />
                            011 76 99 XX
                        </span>
                        <Link href="/connexion" className="text-white font-semibold hover:text-[var(--agasa-emerald)] transition-colors duration-200">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                B. HEADER — Navigation sticky
               ═══════════════════════════════════════════ */}
            <header className="sticky top-0 z-50 h-[72px] flex items-center glass">
                <div className="container-agasa flex items-center justify-between w-full">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--agasa-emerald)] to-[var(--agasa-blue)] flex items-center justify-center text-white shadow-[var(--shadow-glow)]">
                            <Shield className="w-5 h-5" strokeWidth={1.8} />
                        </div>
                        <div>
                            <span className="font-serif font-bold text-xl leading-none block">AGASA</span>
                            <span className="text-caption text-muted-foreground">Sécurité Alimentaire</span>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {["Accueil", "Services", "Tarifs", "FAQ", "Tutoriels"].map((label) => (
                            <Link
                                key={label}
                                href={label === "Accueil" ? "/" : `/${label.toLowerCase()}`}
                                className="text-nav px-4 py-2 rounded-xl hover:bg-muted transition-colors duration-200"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Button variant="agasa" size="default" asChild>
                            <Link href="/connexion">
                                Accéder aux services
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════════════
                C. HERO SECTION
               ═══════════════════════════════════════════ */}
            <section className="relative gradient-hero text-white py-24 md:py-32 px-4 overflow-hidden">
                <Image
                    src="/images/gabon/libreville-city.jpg"
                    alt="Panorama de Libreville"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-slate-950/55" />
                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}></div>

                <div className="relative container-agasa flex flex-col items-center text-center z-10">
                    {/* Badge animé */}
                    <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
                        <span className="pulse-dot"></span>
                        <span className="text-badge text-white/80">Transformation Numérique 2026</span>
                    </div>

                    <h1 className="text-hero max-w-5xl mb-6">
                        Votre guichet unique{" "}
                        <span className="text-gradient">AGASA-Pro</span>
                        <br className="hidden sm:block" />
                        <span className="text-white/70" style={{ fontSize: '0.55em', fontWeight: 500 }}>
                            — en ligne, en quelques clics
                        </span>
                    </h1>

                    <p className="text-lead text-white/70 max-w-[600px] mb-10">
                        Demandez votre agrément sanitaire, déclarez vos importations et gérez toutes vos démarches AGASA depuis votre téléphone.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/inscription" className="btn-primary text-base">
                            Créer mon compte gratuitement
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/demo" className="btn-outline-dark text-base">
                            Voir la démonstration
                        </Link>
                    </div>

                    {/* Bandeau statistiques */}
                    <div className="mt-16 w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { value: "13 742", label: "Opérateurs inscrits" },
                            { value: "9", label: "Provinces couvertes" },
                            { value: "24h", label: "Délai moyen AMC" },
                            { value: "99.5%", label: "Disponibilité" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm text-center">
                                <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                                <div className="text-caption text-white/50 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                D. COMMENT ÇA MARCHE — 4 étapes
               ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 px-4">
                <div className="container-agasa">
                    <div className="text-center mb-14">
                        <span className="text-overline text-[var(--agasa-emerald)] mb-3 block">Comment ça marche</span>
                        <h2 className="text-page-title">4 étapes simples</h2>
                        <p className="text-lead text-muted-foreground mt-4 mx-auto">Oubliez la paperasse. Votre téléphone suffit.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: Smartphone, title: "Inscrivez-vous", desc: "Avec votre numéro de téléphone, en 5 minutes chrono.", image: "/images/gabon/mobile-citizen-service.jpg" },
                            { icon: ClipboardCheck, title: "Faites votre demande", desc: "Remplissez le formulaire guidé étape par étape.", image: "/images/gabon/team-review.jpg" },
                            { icon: CreditCard, title: "Payez en ligne", desc: "Par Mobile Money (Airtel ou Moov) depuis votre téléphone.", image: "/images/gabon/smartphone-guidance.jpg" },
                            { icon: FileBadge, title: "Recevez votre certificat", desc: "Par SMS et sur votre portail, avec QR code vérifiable.", image: "/images/gabon/certificate-verification.jpg" }
                        ].map((step, i) => (
                            <div key={i} className={`flex flex-col items-center text-center p-0 bg-card rounded-2xl border neu-card relative overflow-hidden group animate-fade-in-up stagger-${i + 1}`}>
                                <div className="relative w-full aspect-[16/9]">
                                    <Image
                                        src={step.image}
                                        alt={`Illustration ${step.title}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="icon-container bg-[var(--agasa-emerald)]/12 mb-4 mx-auto">
                                        <step.icon className="w-6 h-6 text-[var(--agasa-emerald)] icon-hover" strokeWidth={1.8} />
                                    </div>
                                    <span className="text-overline text-muted-foreground mb-2">Étape {i + 1}</span>
                                    <h3 className="text-card-title mb-2">{step.title}</h3>
                                    <p className="text-body text-muted-foreground">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                E. VOS SERVICES EN LIGNE
               ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 px-4 bg-muted/30">
                <div className="container-agasa">
                    <div className="text-center mb-14">
                        <span className="text-overline text-[var(--agasa-emerald)] mb-3 block">Services</span>
                        <h2 className="text-page-title">
                            Tout ce que vous pouvez faire sur{" "}
                            <span className="text-gradient">AGASA-Pro</span>
                        </h2>
                        <p className="text-lead text-muted-foreground mt-4 mx-auto">Un seul portail pour l&apos;intégralité de vos obligations sanitaires et phytosanitaires.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { title: "Agrément Sanitaire", icon: FileText, desc: "Demandez, renouvelez et suivez votre agrément en ligne.", color: "var(--agasa-emerald)", image: "/images/gabon/gabon-public-service.jpg" },
                            { title: "Importation", icon: Package, desc: "Déclarez vos importations et obtenez votre AMC en ligne en 24h.", color: "var(--agasa-blue)", image: "/images/gabon/libreville-city.jpg" },
                            { title: "Phytosanitaire", icon: Leaf, desc: "Certificats phyto, licences import et registre des pesticides.", color: "var(--agasa-teal)", image: "/images/gabon/public-health-advice.jpg" },
                            { title: "Analyses Laboratoire", icon: FlaskConical, desc: "Commandez des analyses physico-chimiques ou microbio au LAA.", color: "var(--agasa-violet)", image: "/images/gabon/health-safety-hero.jpg" },
                            { title: "Formation HACCP", icon: GraduationCap, desc: "Formez vos équipes à l'hygiène alimentaire et obtenez un diplôme.", color: "var(--agasa-amber)", image: "/images/gabon/team-review.jpg" },
                            { title: "Mon Dossier", icon: FolderOpen, desc: "Consultez votre historique : inspections, paiements, score Smiley.", color: "var(--agasa-cyan)", image: "/images/gabon/digital-office.jpg" },
                        ].map((service, i) => (
                            <Card key={i} className="group hover:border-[var(--agasa-emerald)]/30 p-0">
                                <div className="relative w-full aspect-[16/9]">
                                    <Image
                                        src={service.image}
                                        alt={`Illustration ${service.title}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <CardContent className="p-6 md:p-8">
                                    <div className="icon-container mb-5" style={{ background: `color-mix(in srgb, ${service.color} 12%, transparent)` }}>
                                        <service.icon className="w-6 h-6 icon-hover" style={{ color: service.color }} strokeWidth={1.8} />
                                    </div>
                                    <h3 className="text-card-title mb-2">{service.title}</h3>
                                    <p className="text-body text-muted-foreground mb-4">{service.desc}</p>
                                    <span className="inline-flex items-center gap-1 text-nav text-[var(--agasa-emerald)] font-semibold">
                                        En savoir plus
                                        <ChevronRight className="w-4 h-4 chevron-hover" />
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                F. BANDEAU D'ASSURANCE
               ═══════════════════════════════════════════ */}
            <section className="py-12 px-4 bg-[var(--agasa-blue)]/[0.04] border-y border-border">
                <div className="container-agasa grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Shield, title: "Sécurité & Souveraineté", desc: "Infrastructure souveraine hébergée au Gabon, données sécurisées." },
                        { icon: Clock, title: "Disponibilité 99.5%", desc: "Plateforme disponible 24h/24, supervision en temps réel." },
                        { icon: Eye, title: "Transparence CTRI", desc: "Traçabilité complète de chaque décision et paiement." },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="icon-container bg-[var(--agasa-blue)]/10 shrink-0">
                                <item.icon className="w-5 h-5 text-[var(--agasa-blue)]" strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground mb-1">{item.title}</p>
                                <p className="text-footer text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                G. TARIFS
               ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 px-4">
                <div className="container-agasa max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="text-overline text-[var(--agasa-emerald)] mb-3 block">Tarification</span>
                        <h2 className="text-page-title">Des tarifs officiels, connus de tous</h2>
                        <p className="text-lead text-muted-foreground mt-4 mx-auto">
                            Les tarifs sont fixés par décret. Aucune négociation, aucun supplément. Vous payez en ligne le montant exact.
                        </p>
                    </div>

                    <div className="bg-card rounded-2xl border overflow-hidden shadow-[var(--shadow-md)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted text-caption uppercase tracking-wider border-b">
                                        <th className="p-4">Catégorie</th>
                                        <th className="p-4">1ère demande</th>
                                        <th className="p-4">Renouvellement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {[
                                        { cat: "Restaurant/Hôtel (CAT 2)", price1: "250 000 FCFA", price2: "150 000 FCFA" },
                                        { cat: "Épicerie (CAT 3)", price1: "100 000 FCFA", price2: "50 000 FCFA" },
                                        { cat: "Industrie (CAT 1)", price1: "500 000 FCFA", price2: "300 000 FCFA" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-muted/30 transition-colors duration-200">
                                            <td className="p-4 font-medium text-body">{row.cat}</td>
                                            <td className="p-4 text-body text-muted-foreground">{row.price1}</td>
                                            <td className="p-4 text-body text-muted-foreground">{row.price2}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-muted/50 border-t flex justify-center">
                            <Button asChild variant="link" className="text-[var(--agasa-emerald)] font-semibold">
                                <Link href="/tarifs">Voir l&apos;intégralité des décrets tarifaires</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                H. PAIEMENT SÉCURISÉ
               ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 px-4 gradient-hero text-white text-center">
                <div className="container-agasa max-w-3xl">
                    <span className="text-overline text-[var(--agasa-emerald)] mb-4 block">Paiement sécurisé</span>
                    <h2 className="text-page-title text-white mb-6">Payez simplement depuis votre téléphone</h2>
                    <p className="text-lead text-white/70 mx-auto mb-10">
                        Zéro cash. Chaque paiement est tracé électroniquement et vous recevez un reçu officiel certifié AGASA.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                        <div className="bg-white text-red-600 px-6 py-4 rounded-2xl font-bold text-lg w-52 shadow-[var(--shadow-elegant)]">Airtel Money</div>
                        <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-lg w-52 shadow-[var(--shadow-elegant)] border border-white/20">Moov Money</div>
                        <div className="bg-card text-foreground px-6 py-4 rounded-2xl font-bold text-lg w-52 shadow-[var(--shadow-elegant)]">Virement Bancaire</div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                I. TÉMOIGNAGES
               ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 px-4">
                <div className="container-agasa">
                    <div className="text-center mb-14">
                        <span className="text-overline text-[var(--agasa-emerald)] mb-3 block">Témoignages</span>
                        <h2 className="text-page-title">Ils nous font confiance</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                text: "J'ai obtenu mon agrément en 15 jours, tout en ligne depuis mon téléphone ! Finis les va-et-vient au bureau de l'AGASA.",
                                name: "Mme Ndong",
                                role: "Restauratrice à Libreville",
                                avatar: "https://i.pravatar.cc/100?img=47",
                                image: "/images/gabon/gabon-public-service.jpg",
                            },
                            {
                                text: "La déclaration d'importation qui me prenait 2 semaines se fait maintenant en 1 jour ouvrable. C'est un gain de temps énorme.",
                                name: "M. Obame",
                                role: "Importateur à Owendo",
                                avatar: "https://i.pravatar.cc/100?img=11",
                                image: "/images/gabon/libreville-city.jpg",
                            },
                            {
                                text: "Je n'y connais rien en informatique et j'ai réussi du premier coup. Le site est clair et on nous explique tout étape par étape.",
                                name: "Mme Ondo",
                                role: "Épicière à Franceville",
                                avatar: "https://i.pravatar.cc/100?img=32",
                                image: "/images/gabon/mobile-citizen-service.jpg",
                            }
                        ].map((testimonial, i) => (
                            <Card key={i} className="border-none neu-card overflow-hidden p-0">
                                <div className="relative w-full aspect-[16/9]">
                                    <Image
                                        src={testimonial.image}
                                        alt={`Illustration témoignage ${testimonial.name}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-8">
                                    <div className="flex text-[var(--agasa-gold)] mb-4">
                                        {"★★★★★".split("").map((star, j) => (
                                            <span key={j} className="text-2xl">{star}</span>
                                        ))}
                                    </div>
                                    <p className="text-body italic mb-6 text-muted-foreground">&ldquo;{testimonial.text}&rdquo;</p>
                                    <div className="flex items-center gap-4">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full ring-2 ring-[var(--agasa-emerald)]/20" />
                                        <div>
                                            <p className="font-bold text-body">{testimonial.name}</p>
                                            <p className="text-caption text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                J. FAQ
               ═══════════════════════════════════════════ */}
            <section className="py-16 md:py-24 px-4 bg-muted/30">
                <div className="container-agasa max-w-3xl">
                    <div className="text-center mb-12">
                        <span className="text-overline text-[var(--agasa-emerald)] mb-3 block">FAQ</span>
                        <h2 className="text-page-title">Questions fréquentes</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {[
                            { q: "C'est gratuit de créer un compte ?", a: "Oui, la création de compte est 100% gratuite. Vous ne payez que lors de la soumission d'une demande officielle (comme l'agrément)." },
                            { q: "J'ai besoin d'un ordinateur ?", a: "Non ! AGASA-Pro a été conçu spécialement pour fonctionner parfaitement sur les smartphones (Android, iPhone), même les plus anciens." },
                            { q: "Comment je paye ?", a: "Le paiement se fait directement sur la plateforme avec votre téléphone via Airtel Money, Moov Africa, ou par virement bancaire classique pour les gros montants." },
                            { q: "C'est sécurisé ?", a: "Totalement. Vos données sont chiffrées. C'est le guichet unique OFFICIEL de l'État Gabonais pour la sécurité alimentaire." },
                            { q: "Je n'ai pas d'email, je peux quand même m'inscrire ?", a: "Oui ! Votre numéro de téléphone gabonais (+241) suffit. Un code vous sera envoyé par SMS." },
                            { q: "Qui peut m'aider si je suis bloqué ?", a: "Un support téléphonique est ouvert du lundi au vendredi. Des tutoriels vidéos sont aussi disponibles sur le site." }
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="bg-card border rounded-2xl px-6">
                                <AccordionTrigger className="text-left text-body font-semibold py-5">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-body text-muted-foreground pb-5">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                K. CTA FINAL
               ═══════════════════════════════════════════ */}
            <section className="py-20 md:py-28 px-4 text-center gradient-hero text-white">
                <div className="container-agasa max-w-2xl">
                    <h2 className="text-page-title text-white mb-6">Prêt à numériser vos démarches AGASA ?</h2>
                    <p className="text-lead text-white/70 mx-auto mb-10">En 5 minutes chrono, avec votre numéro de téléphone.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/inscription" className="btn-primary text-base">
                            Créer mon compte maintenant
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/demo" className="btn-outline-dark text-base">
                            Voir la démonstration
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                L. FOOTER
               ═══════════════════════════════════════════ */}
            <footer className="bg-card border-t py-12 md:py-16 px-4">
                <div className="container-agasa grid gap-10 md:grid-cols-4">
                    {/* Col 1 : Logo */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--agasa-emerald)] to-[var(--agasa-blue)] flex items-center justify-center text-white shadow-[var(--shadow-glow)]">
                                <Shield className="w-5 h-5" strokeWidth={1.8} />
                            </div>
                            <div>
                                <span className="font-serif font-bold text-lg leading-none block">AGASA</span>
                                <span className="text-caption text-muted-foreground">Pro</span>
                            </div>
                        </Link>
                        <p className="text-footer text-muted-foreground">
                            Agence Gabonaise de Sécurité Alimentaire. Guichet unique numérique pour les opérateurs économiques du secteur alimentaire.
                        </p>
                    </div>

                    {/* Col 2 : Liens rapides */}
                    <div>
                        <h4 className="font-serif font-bold text-base mb-4">Le Portail</h4>
                        <ul className="space-y-2 text-footer">
                            <li><Link href="/" className="text-muted-foreground hover:text-[var(--agasa-emerald)] transition-colors duration-200">Accueil</Link></li>
                            <li><Link href="/inscription" className="text-muted-foreground hover:text-[var(--agasa-emerald)] transition-colors duration-200">Inscription / Connexion</Link></li>
                            <li><Link href="/demo" className="text-[var(--agasa-emerald)] hover:text-[var(--agasa-emerald)] transition-colors duration-200 font-medium">Environnement de Démo</Link></li>
                            <li><Link href="/tarifs" className="text-muted-foreground hover:text-[var(--agasa-emerald)] transition-colors duration-200">Grille tarifaire</Link></li>
                        </ul>
                    </div>

                    {/* Col 3 : Contact */}
                    <div>
                        <h4 className="font-serif font-bold text-base mb-4">Contact</h4>
                        <ul className="space-y-3 text-footer text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[var(--agasa-emerald)]" strokeWidth={1.8} />
                                Libreville, Gabon
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 shrink-0 text-[var(--agasa-emerald)]" strokeWidth={1.8} />
                                011 76 99 XX
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 shrink-0 text-[var(--agasa-emerald)]" strokeWidth={1.8} />
                                contact@agasa.ga
                            </li>
                        </ul>
                    </div>

                    {/* Col 4 : Aide */}
                    <div>
                        <h4 className="font-serif font-bold text-base mb-4">Aide & Support</h4>
                        <ul className="space-y-2 text-footer">
                            <li><Link href="/tutoriels" className="text-muted-foreground hover:text-[var(--agasa-emerald)] transition-colors duration-200">Tutoriels vidéos</Link></li>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-[var(--agasa-emerald)] transition-colors duration-200">Foire Aux Questions</Link></li>
                            <li><Link href="/a-propos" className="text-muted-foreground hover:text-[var(--agasa-emerald)] transition-colors duration-200">À propos d&apos;AGASA-Pro</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright bar */}
                <div className="container-agasa mt-12 pt-8 border-t text-footer flex flex-col md:flex-row justify-between items-center text-muted-foreground">
                    <p>© 2026 AGASA — République Gabonaise. Tous droits réservés.</p>
                    <p className="mt-2 md:mt-0">Développé par NTSAGUI Digital</p>
                </div>
            </footer>
        </div>
    );
}
