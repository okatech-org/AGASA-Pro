"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    Coffee,
    Package,
    Leaf,
    Store,
    Factory,
    Settings,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DemoPage() {
    const router = useRouter();

    const handleDemoLogin = (role: string) => {
        // Écrire le firebaseUid démo dans localStorage pour que DemoUserProvider le détecte
        const demoUid = `demo-${role}`;
        localStorage.setItem("agasa-demo-uid", demoUid);
        router.push("/tableau-de-bord");
    };

    const PROFILES = [
        {
            id: "restaurateur",
            title: "Petit Restaurateur (CAT 2)",
            name: "Mme Nguema — Restaurant Le Baobab, Libreville",
            icon: Coffee,
            modules: "Agrément + Mon Dossier",
            data: "Agrément actif, 2 inspections, score Smiley 3/5",
            color: "bg-orange-100 text-orange-600 border-orange-200",
            image: "/images/gabon/gabon-public-service.jpg",
        },
        {
            id: "importateur",
            title: "Grand Importateur",
            name: "M. Mba — SCI Import-Export, Owendo",
            icon: Package,
            modules: "Agrément + Importation + Analyses + Mon Dossier",
            data: "3 dossiers d'importation, Agrément CAT 1",
            color: "bg-blue-100 text-blue-600 border-blue-200",
            image: "/images/gabon/libreville-city.jpg",
        },
        {
            id: "distributeur",
            title: "Distributeur d'Intrants Agricoles",
            name: "M. Nzé — AgriGabon SARL, Oyem",
            icon: Leaf,
            modules: "Agrément + Phytosanitaire + Mon Dossier",
            data: "Licence intrants active, 2 certificats phyto",
            color: "bg-green-100 text-green-600 border-green-200",
            image: "/images/gabon/public-health-advice.jpg",
        },
        {
            id: "epicier",
            title: "Épicier (CAT 3)",
            name: "Mme Ondo — Épicerie du Quartier, Franceville",
            icon: Store,
            modules: "Agrément + Mon Dossier",
            data: "Agrément en cours de demande (étape 4/5)",
            color: "bg-purple-100 text-purple-600 border-purple-200",
            image: "/images/gabon/mobile-citizen-service.jpg",
        },
        {
            id: "industriel",
            title: "Industriel (CAT 1)",
            name: "M. Obiang — Gabon Fish Processing, Port-Gentil",
            icon: Factory,
            modules: "Agrément + Import + Analyses + Phyto + Formation",
            data: "Agrément CAT 1, formations HACCP en cours, analyses labo",
            color: "bg-slate-100 text-slate-600 border-slate-200",
            image: "/images/gabon/health-safety-hero.jpg",
        },
        {
            id: "admin",
            title: "Administrateur Système AGASA",
            name: "Admin système — Vue de gestion",
            icon: Settings,
            modules: "Tableau de bord admin, gestion opérateurs, factures...",
            data: "Accès total (Lecture/Écriture restreinte)",
            color: "bg-red-100 text-red-600 border-red-200 flex-col", // flex-col utilisé comme hack pour le rendu du bouton
            image: "/images/gabon/gabon-compliance-council.jpg",
        }
    ];

    return (
        <div className="min-h-screen bg-muted/20">
            {/* HEADER DEMO */}
            <section className="bg-primary text-primary-foreground py-16 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 ring-4 ring-white/20">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                        Essayez AGASA-Pro en un clic
                    </h1>
                    <p className="text-xl opacity-90 mb-6">
                        Choisissez un profil et explorez le portail tel qu'il apparaîtra pour un opérateur réel.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                        🔒 C'est un environnement de démonstration. Les paiements ne sont pas réels.
                    </div>
                </div>
            </section>

            {/* GRILLE PROFILS */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {PROFILES.map((profile, i) => {
                        const Icon = profile.icon;
                        const isAdmin = profile.id === "admin";
                        return (
                            <Card key={i} className={`overflow-hidden border-2 transition-all hover:shadow-lg ${isAdmin ? 'border-primary/50 shadow-md' : 'border-border/50'}`}>
                                <div className="relative w-full aspect-[16/9]">
                                    <Image
                                        src={profile.image}
                                        alt={`Illustration ${profile.title}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div className={`p-4 ${profile.color} flex items-center gap-3 border-b`}>
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg">{profile.title}</h3>
                                </div>

                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Identité</span>
                                            <p className="font-medium text-sm mt-1">{profile.name}</p>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modules Actifs</span>
                                            <p className="text-sm mt-1">{profile.modules}</p>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Données injectées</span>
                                            <p className="text-sm mt-1 italic text-muted-foreground">{profile.data}</p>
                                        </div>
                                    </div>

                                    <Button
                                        className={`w-full mt-6 h-12 text-sm font-bold shadow-sm ${isAdmin ? 'bg-primary text-primary-foreground' : ''}`}
                                        variant={isAdmin ? "default" : "outline"}
                                        onClick={() => handleDemoLogin(profile.id)}
                                    >
                                        Explorer en tant que {isAdmin ? "l'Admin" : profile.title.split(" ")[0].toLowerCase()}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* GUIDE DES PARCOURS */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card border-t max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Guide des parcours</h2>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="border rounded-xl p-4 bg-muted/30">
                        <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden border border-dashed border-muted-foreground/30">
                            <Image src="/images/gabon/gabon-public-service.jpg" alt="Parcours demande agrément" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                        </div>
                        <h3 className="font-bold mb-2">Comment faire une demande d'agrément ?</h3>
                        <p className="text-sm text-muted-foreground">Découvrez le formulaire simplifié en 4 étapes pour soumettre votre demande d'agrément sanitaire CAT 2.</p>
                    </div>

                    <div className="border rounded-xl p-4 bg-muted/30">
                        <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden border border-dashed border-muted-foreground/30">
                            <Image src="/images/gabon/libreville-city.jpg" alt="Parcours déclaration importation" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                        </div>
                        <h3 className="font-bold mb-2">Comment déclarer une importation ?</h3>
                        <p className="text-sm text-muted-foreground">Voir le processus complet de saisie des documents pour obtenir une Autorisation de Mise sur le Marché (AMC).</p>
                    </div>

                    <div className="border rounded-xl p-4 bg-muted/30">
                        <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden border border-dashed border-muted-foreground/30">
                            <Image src="/images/gabon/smartphone-guidance.jpg" alt="Parcours paiement mobile money" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                        </div>
                        <h3 className="font-bold mb-2">Comment payer par Mobile Money ?</h3>
                        <p className="text-sm text-muted-foreground">L'intégration fluide d'Airtel Money et Moov Africa pour le règlement instantané de vos quittances.</p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Button asChild variant="link">
                        <Link href="/">Retour à l'accueil</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
