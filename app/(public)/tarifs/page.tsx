import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TarifsPage() {
    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Grille Tarifaire Officielle</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Tous les tarifs appliqués sur AGASA-Pro sont conformes au Décret N°000152/PR/MAEPDR du 14 Juin 2017 fixant les taux des redevances et frais liés aux prestations de l'AGASA.
                </p>
            </div>

            {/* Agréments Sanitaires */}
            <div className="mb-16">
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl mb-6">
                    <Image src="/images/gabon/gabon-public-service.jpg" alt="Agrément sanitaire AGASA-Pro" fill sizes="(max-width: 768px) 100vw, 960px" className="object-cover" />
                </div>
                <h2 className="text-2xl font-bold border-b pb-2 mb-6 text-primary flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-2" /> Agrément Sanitaire
                </h2>
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted text-muted-foreground text-sm font-semibold border-b">
                                <th className="p-4">Catégorie d'Établissement</th>
                                <th className="p-4">Première Demande</th>
                                <th className="p-4">Renouvellement (Annuel)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr className="hover:bg-muted/30">
                                <td className="p-4 font-medium flex flex-col">
                                    <span>Catégorie 1 (AS_CAT_1)</span>
                                    <span className="text-sm text-muted-foreground font-normal">Transformation industrielle, Abattoirs, Grandes surfaces (Supermarchés +1000m²)...</span>
                                </td>
                                <td className="p-4 font-bold text-lg">500 000 FCFA</td>
                                <td className="p-4 text-muted-foreground">300 000 FCFA</td>
                            </tr>
                            <tr className="hover:bg-muted/30 bg-primary/5 border-l-4 border-l-primary/50">
                                <td className="p-4 font-medium flex flex-col">
                                    <span>Catégorie 2 (AS_CAT_2)</span>
                                    <span className="text-sm text-muted-foreground font-normal">Restaurants, Hôtels, Moyennes surfaces (Supérettes), Boulangeries industrielles...</span>
                                </td>
                                <td className="p-4 font-bold text-lg text-primary">250 000 FCFA</td>
                                <td className="p-4 text-muted-foreground font-medium">150 000 FCFA</td>
                            </tr>
                            <tr className="hover:bg-muted/30">
                                <td className="p-4 font-medium flex flex-col">
                                    <span>Catégorie 3 (AS_CAT_3)</span>
                                    <span className="text-sm text-muted-foreground font-normal">Épiceries de quartier, Boutiques alimentation générale, Fast-food, Cantines scolaires...</span>
                                </td>
                                <td className="p-4 font-bold text-lg">100 000 FCFA</td>
                                <td className="p-4 text-muted-foreground">50 000 FCFA</td>
                            </tr>
                            <tr className="hover:bg-muted/30">
                                <td className="p-4 font-medium flex flex-col">
                                    <span>Véhicules de Transport (AS_TRANS)</span>
                                    <span className="text-sm text-muted-foreground font-normal">Camions frigorifiques, véhicules de livraison de denrées...</span>
                                </td>
                                <td className="p-4 font-bold text-lg">50 000 FCFA <span className="text-sm font-normal text-muted-foreground">/véhicule</span></td>
                                <td className="p-4 text-muted-foreground">30 000 FCFA <span className="text-sm font-normal text-muted-foreground">/véhicule</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Prestations Importation */}
            <div className="mb-16">
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl mb-6">
                    <Image src="/images/gabon/libreville-city.jpg" alt="Prestations à l'importation AGASA-Pro" fill sizes="(max-width: 768px) 100vw, 960px" className="object-cover" />
                </div>
                <h2 className="text-2xl font-bold border-b pb-2 mb-6 text-primary flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-2" /> Prestations à l'Importation (Frais Variables)
                </h2>
                <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                        Les frais liés à l'importation de denrées alimentaires (DPI, DI) dépendent de la nature, du volume et du fret de la marchandise.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                        <li><strong>Inspection documentaire :</strong> Variable selon la déclaration douanière.</li>
                        <li><strong>Inspection physique au débarquement :</strong> Basée sur le type de conteneur (20 pieds / 40 pieds / Vrac).</li>
                        <li><strong>Autorisation de Mise sur le Marché (AMC) :</strong> Délivrée après conformité.</li>
                    </ul>
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                        <p className="text-sm font-medium">💡 Votre facture d'importation est calculée automatiquement par le système AGASA-Pro lors de la soumission de votre dossier, en stricte application du décret officiel.</p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12 space-x-4">
                <Button asChild size="lg" className="px-8">
                    <Link href="/inscription">Créer mon compte</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        </div>
    );
}
