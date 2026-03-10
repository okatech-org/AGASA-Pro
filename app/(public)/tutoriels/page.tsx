import { PlayCircle, FileText, Smartphone } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TutorielsPage() {
    const tutorials = [
        {
            title: "Créer son compte opérateur en 2 minutes",
            duration: "2:45",
            type: "Vidéo",
            icon: Smartphone,
            description: "Découvrez comment vous inscrire sur AGASA-Pro uniquement avec votre numéro de téléphone et votre pièce d'identité.",
            image: "/images/gabon/mobile-citizen-service.jpg",
        },
        {
            title: "Faire une demande d'Agrément Sanitaire (AS)",
            duration: "5:30",
            type: "Vidéo",
            icon: PlayCircle,
            description: "Le guide pas-à-pas pour remplir votre formulaire d'agrément, joindre vos documents (RCCM, bail) et soumettre le dossier.",
            image: "/images/gabon/gabon-public-service.jpg",
        },
        {
            title: "Payer sa quittance par Mobile Money",
            duration: "1:15",
            type: "Vidéo",
            icon: PlayCircle,
            description: "Comment utiliser Airtel Money ou Moov Africa directement depuis le portail pour régler vos frais de dossier en toute sécurité.",
            image: "/images/gabon/smartphone-guidance.jpg",
        },
        {
            title: "Déclarer une Importation (DPI) et obtenir l'AMC",
            duration: "6:20",
            type: "Vidéo",
            icon: PlayCircle,
            description: "La procédure complète pour les importateurs : création de la déclaration, attachement du certificat d'origine, et suivi jusqu'à la délivrance de l'AMC.",
            image: "/images/gabon/libreville-city.jpg",
        },
        {
            title: "Télécharger et imprimer son certificat (QR Code)",
            duration: "1:40",
            type: "Vidéo",
            icon: PlayCircle,
            description: "Où retrouver vos certificats approuvés dans 'Mon Dossier' et comment les les rendre vérifiables par les inspecteurs.",
            image: "/images/gabon/certificate-verification.jpg",
        },
        {
            title: "Guide complet du Portail Opérateur (PDF)",
            duration: "15 pages",
            type: "Document",
            icon: FileText,
            description: "Le manuel d'utilisation complet au format PDF, avec des captures d'écran de chaque étape.",
            image: "/images/gabon/team-review.jpg",
        }
    ];

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Tutoriels & Accompagnement</h1>
                <p className="text-xl text-muted-foreground">
                    Maîtrisez AGASA-Pro en quelques minutes. Regardez nos courtes vidéos explicatives pour vous guider dans chaque démarche.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tutorials.map((tuto, i) => {
                    const Icon = tuto.icon;
                    return (
                        <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow group border-border/50">
                            <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                                <Image
                                    src={tuto.image}
                                    alt={`Illustration ${tuto.title}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-slate-950/25" />
                                <Icon className="relative z-10 w-16 h-16 text-white/75 group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                                    {tuto.duration}
                                </div>
                                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 rounded border shadow-sm">
                                    {tuto.type}
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">{tuto.title}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                                    {tuto.description}
                                </p>
                                <Button className="w-full" variant="secondary">
                                    {tuto.type === "Vidéo" ? "Regarder la vidéo" : "Télécharger le PDF"}
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="mt-16 bg-primary/5 rounded-2xl p-8 text-center border border-primary/10">
                <h2 className="text-2xl font-bold mb-4">Vous êtes toujours bloqué ?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Si malgré nos tutoriels vous rencontrez des difficultés, notre équipe de support dédiée aux opérateurs est là pour vous assister.
                    N'hésitez pas à télécharger notre application de prise en main à distance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-success hover:bg-success/90">
                        Contacter le Support (011 76 99 XX)
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/faq">Consulter la Foire Aux Questions</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
