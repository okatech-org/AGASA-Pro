import Link from "next/link";
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
    ShieldCheck
} from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. HERO SECTION */}
            <section className="relative bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center z-10">
                    <div className="inline-flex items-center justify-center p-4 bg-background rounded-full mb-8 shadow-2xl">
                        <span className="text-3xl font-bold text-primary tracking-widest leading-none">AGASA<span className="text-accent">-Pro</span></span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl">
                        Votre guichet unique AGASA<br className="hidden sm:block" />
                        <span className="text-accent">— en ligne, en quelques clics</span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl opacity-90 leading-relaxed font-medium">
                        Demandez votre agrément sanitaire, déclarez vos importations et gérez toutes vos démarches AGASA depuis votre téléphone.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button asChild size="lg" className="h-14 px-8 text-lg bg-success hover:bg-success/90 text-success-foreground font-bold shadow-lg shadow-success/20 w-full sm:w-auto">
                            <Link href="/inscription">
                                Créer mon compte gratuitement
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg bg-transparent border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground font-semibold w-full sm:w-auto">
                            <Link href="/demo">
                                Voir la démonstration
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center gap-3 bg-primary-foreground/10 px-6 py-3 rounded-full backdrop-blur-sm border border-primary-foreground/20">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-muted overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Utilisateur" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium">Déjà <strong className="text-accent font-bold">13 742</strong> opérateurs inscrits dans les 9 provinces</p>
                    </div>
                </div>
            </section>

            {/* 2. SECTION "COMMENT CA MARCHE ?" */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">4 étapes simples</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Oubliez la paperasse. Votre téléphone suffit.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: Smartphone, title: "Inscrivez-vous", desc: "Avec votre numéro de téléphone, en 5 minutes chrono." },
                            { icon: ClipboardCheck, title: "Faites votre demande", desc: "Remplissez le formulaire guidé étape par étape." },
                            { icon: CreditCard, title: "Payez en ligne", desc: "Par Mobile Money (Airtel ou Moov) depuis votre téléphone." },
                            { icon: FileBadge, title: "Recevez votre certificat", desc: "Par SMS et sur votre portail, avec QR code vérifiable." }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-muted/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground mb-2 tracking-widest uppercase">Étape {i + 1}</span>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. SECTION "VOS SERVICES EN LIGNE" */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tout ce que vous pouvez faire sur AGASA-Pro</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Un seul portail pour l'intégralité de vos obligations sanitaires et phytosanitaires.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { title: "Agrément Sanitaire", icon: FileText, desc: "Demandez, renouvelez et suivez votre agrément en ligne." },
                            { title: "Importation", icon: Package, desc: "Déclarez vos importations et obtenez votre AMC en ligne en 24h." },
                            { title: "Phytosanitaire", icon: Leaf, desc: "Certificats phyto, licences import et registre des pesticides." },
                            { title: "Analyses Laboratoire", icon: FlaskConical, desc: "Commandez des analyses physico-chimiques ou microbio au LAA." },
                            { title: "Formation HACCP", icon: GraduationCap, desc: "Formez vos équipes à l'hygiène alimentaire et obtenez un diplôme." },
                            { title: "Mon Dossier", icon: FolderOpen, desc: "Consultez votre historique : inspections, paiements, score Smiley." }
                        ].map((service, i) => (
                            <Card key={i} className="group hover:border-primary/50 transition-colors">
                                <CardContent className="p-6">
                                    <service.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                    <p className="text-muted-foreground">{service.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. SECTION "LES TARIFS" */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-muted rounded-full mb-4">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Des tarifs officiels, connus de tous</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Les tarifs sont fixés par décret. Aucune négociation, aucun supplément. Vous payez en ligne le montant exact.
                        </p>
                    </div>

                    <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted text-muted-foreground text-sm font-semibold tracking-wide border-b">
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
                                        <tr key={i} className="hover:bg-muted/30">
                                            <td className="p-4 font-medium">{row.cat}</td>
                                            <td className="p-4 text-muted-foreground">{row.price1}</td>
                                            <td className="p-4 text-muted-foreground">{row.price2}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-muted/50 border-t flex justify-center">
                            <Button asChild variant="link" className="text-primary font-semibold">
                                <Link href="/tarifs">Voir l'intégralité des décrets tarifaires</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. SECTION "PAIEMENT SECURISE" */}
            <section className="py-20 px-4 bg-primary text-primary-foreground text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Payez simplement depuis votre téléphone</h2>
                    <p className="text-lg mb-10 opacity-90">
                        Zéro cash. Chaque paiement est tracé électroniquement et vous recevez un reçu officiel certifié AGASA.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                        {/* Simulation of logos */}
                        <div className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold text-xl w-48 shadow-lg">Airtel Money</div>
                        <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-xl w-48 shadow-lg border-2 border-white">Moov Money</div>
                        <div className="bg-background text-foreground px-6 py-3 rounded-lg font-bold text-xl w-48 shadow-lg">Virement Bancaire</div>
                    </div>
                </div>
            </section>

            {/* 6. SECTION "TEMOIGNAGES" */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight">Ils nous font confiance</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                text: "J'ai obtenu mon agrément en 15 jours, tout en ligne depuis mon téléphone ! Finis les va-et-vient au bureau de l'AGASA.",
                                name: "Mme Ndong",
                                role: "Restauratrice à Libreville",
                                avatar: "https://i.pravatar.cc/100?img=47"
                            },
                            {
                                text: "La déclaration d'importation qui me prenait 2 semaines se fait maintenant en 1 jour ouvrable. C'est un gain de temps énorme.",
                                name: "M. Obame",
                                role: "Importateur à Owendo",
                                avatar: "https://i.pravatar.cc/100?img=11"
                            },
                            {
                                text: "Je n'y connais rien en informatique et j'ai réussi du premier coup. Le site est clair et on nous explique tout étape par étape.",
                                name: "Mme Ondo",
                                role: "Épicière à Franceville",
                                avatar: "https://i.pravatar.cc/100?img=32"
                            }
                        ].map((testimonial, i) => (
                            <Card key={i} className="border-none shadow-md bg-card">
                                <CardContent className="p-8">
                                    <div className="flex text-accent mb-4">
                                        {"★★★★★".split("").map((star, j) => (
                                            <span key={j} className="text-2xl">{star}</span>
                                        ))}
                                    </div>
                                    <p className="text-lg italic mb-6 text-muted-foreground">"{testimonial.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full ring-2 ring-primary/20" />
                                        <div>
                                            <p className="font-bold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. SECTION FAQ SIMPLIFIEE */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">Questions fréquentes</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {[
                            { q: "C'est gratuit de créer un compte ?", a: "Oui, la création de compte est 100% gratuite. Vous ne payez que lors de la soumission d'une demande officielle (comme l'agrément)." },
                            { q: "J'ai besoin d'un ordinateur ?", a: "Non ! AGASA-Pro a été conçu spécialement pour fonctionner parfaitement sur les smartphones (Android, iPhone), même les plus anciens." },
                            { q: "Comment je paye ?", a: "Le paiement se fait directement sur la plateforme avec votre téléphone via Airtel Money, Moov Africa, ou par virement bancaire classique pour les gros montants." },
                            { q: "C'est sécurisé ?", a: "Totalement. Vos données sont chiffrées. C'est le guichet unique OFFICIEL de l'État Gabonais pour la sécurité alimentaire." },
                            { q: "Je n'ai pas d'email, je peux quand même m'inscrire ?", a: "Oui ! Votre numéro de téléphone gabonais (+241) suffit. Un code vous sera envoyé par SMS." },
                            { q: "Qui peut m'aider si je suis bloqué ?", a: "Un support téléphonique est ouvert du lundi au vendredi. Des tutoriels vidéos sont aussi disponibles sur le site." }
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`}>
                                <AccordionTrigger className="text-left text-lg font-medium">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* 8. CTA FINAL */}
            <section className="py-24 px-4 text-center bg-card border-t shadow-inner">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-8">Prêt à numériser vos démarches AGASA ?</h2>
                    <Button asChild size="lg" className="h-16 px-10 text-xl w-full sm:w-auto shadow-lg shadow-primary/20 bg-success hover:bg-success/90 text-success-foreground">
                        <Link href="/inscription">
                            Créer mon compte maintenant
                        </Link>
                    </Button>
                    <p className="mt-4 text-muted-foreground">En 5 minutes chrono, avec votre numéro de téléphone.</p>
                </div>
            </section>

            {/* 9. FOOTER */}
            <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 border-t-4 border-primary">
                <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                                AG
                            </div>
                            <span className="font-bold text-xl text-white">AGASA-Pro</span>
                        </div>
                        <p className="text-sm opacity-80 mb-4">
                            Agence Gabonaise de Sécurité Alimentaire.
                            Guichet unique numérique pour les opérateurs économiques du secteur alimentaire.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Le Portail</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                            <li><Link href="/inscription" className="hover:text-white transition-colors">Inscription / Connexion</Link></li>
                            <li><Link href="/demo" className="text-accent hover:text-white transition-colors font-medium">Environnement de Démo</Link></li>
                            <li><Link href="/tarifs" className="hover:text-white transition-colors">Grille tarifaire</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Aide & Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/tutoriels" className="hover:text-white transition-colors">Tutoriels vidéos</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">Foire Aux Questions</Link></li>
                            <li><Link href="/a-propos" className="hover:text-white transition-colors">À propos d'AGASA-Pro</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Nous contacter</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4 text-success">📞 Besoin d'aide ?</h4>
                        <p className="text-sm mb-2">Notre centre d'appels est disponible pour vous accompagner :</p>
                        <p className="text-2xl font-bold text-white tracking-wide">011 76 99 XX</p>
                        <p className="text-xs opacity-70 mt-2">Lun-Ven, 08h00 - 15h30</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center opacity-70">
                    <p>© 2026 AGASA — République Gabonaise. Tous droits réservés.</p>
                    <p className="mt-2 md:mt-0">Développé par NTSAGUI Digital</p>
                </div>
            </footer>
        </div>
    );
}
