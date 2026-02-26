"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { AgrementCard } from "@/components/shared/AgrementCard";
import { ProgressionEtapes, type EtapeProgression } from "@/components/shared/ProgressionEtapes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText, Download, RefreshCw, HelpCircle, Sparkles, Upload } from "lucide-react";

function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function formatMoney(n: number) {
    return n.toLocaleString("fr-FR") + " FCFA";
}

export default function AgrementPage() {
    const { operateur, firebaseUid } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });

    if (!data || !operateur) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const agrements = data.agrements || [];
    const etablissements = data.etablissements || [];
    const isSimple = ["restaurateur", "commercant", "hotelier", "boulanger"].includes(operateur.typeOperateur);
    const mainAgrement = agrements[0];

    // Étapes de progression pour agrément en cours
    const etapesProgression: EtapeProgression[] = mainAgrement ? [
        { etape: "soumis", label: "Dossier déposé", description: "Votre demande a été enregistrée" },
        { etape: "paye", label: "Paiement confirmé", description: `Montant: ${formatMoney(mainAgrement.montant)}` },
        { etape: "verification_documents", label: "Vérification", description: "Documents en cours de vérification" },
        { etape: "inspection_programmee", label: "Inspection", description: mainAgrement.inspectionProgrammee?.commentaire || "Inspection de votre établissement" },
        { etape: "agree", label: "Décision", description: "Agrément accordé ou refusé" },
    ] : [];

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* En-tête */}
            <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="icon" asChild className="shrink-0">
                    <Link href="/tableau-de-bord"><ArrowLeft className="w-5 h-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">Mon Agrément Sanitaire</h1>
                    <p className="text-sm text-muted-foreground">
                        {etablissements[0]?.nom || operateur.raisonSociale}
                    </p>
                </div>
            </div>

            {/* Catégorie info */}
            {mainAgrement && (
                <Card className="shadow-sm bg-blue-50/50 border-blue-200">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="text-sm">
                            <span className="text-xs text-muted-foreground">Catégorie</span>
                            <p className="font-semibold">{
                                mainAgrement.categorie === "AS_CAT_1" ? "AS CAT 1 — Grande entreprise" :
                                    mainAgrement.categorie === "AS_CAT_2" ? "AS CAT 2 — Restaurant / Commerce" :
                                        mainAgrement.categorie === "AS_CAT_3" ? "AS CAT 3 — Petit commerce" :
                                            mainAgrement.categorie
                            }</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary font-mono">{mainAgrement.numeroDossier}</Badge>
                    </CardContent>
                </Card>
            )}

            {/* Card status principal */}
            {mainAgrement?.etapeActuelle === "agree" ? (
                /* Agrément actif complet */
                <div className="space-y-4">
                    <AgrementCard
                        agrement={{
                            _id: mainAgrement._id,
                            numeroDossier: mainAgrement.numeroDossier,
                            categorie: mainAgrement.categorie,
                            etapeActuelle: mainAgrement.etapeActuelle,
                            dateExpiration: mainAgrement.dateExpiration,
                            certificat: mainAgrement.certificat,
                            etablissementNom: etablissements[0]?.nom,
                        }}
                    />

                    {/* Historique des étapes */}
                    {mainAgrement.historiqueEtapes && mainAgrement.historiqueEtapes.length > 0 && (
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">📋 Historique du dossier</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {mainAgrement.historiqueEtapes.reverse().map((e: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 py-2 border-t first:border-t-0 text-sm">
                                        <span className="text-green-600">✅</span>
                                        <div className="flex-1">
                                            <p className="font-medium capitalize">{e.etape.replace(/_/g, " ")}</p>
                                            {e.commentaire && <p className="text-xs text-muted-foreground">{e.commentaire}</p>}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{formatDate(e.date)}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : mainAgrement?.etapeActuelle === "refuse" ? (
                <AgrementCard
                    agrement={{
                        _id: mainAgrement._id,
                        numeroDossier: mainAgrement.numeroDossier,
                        categorie: mainAgrement.categorie,
                        etapeActuelle: mainAgrement.etapeActuelle,
                    }}
                />
            ) : mainAgrement ? (
                /* Agrément en cours */
                <Card className="shadow-md border-blue-200 bg-blue-50/30">
                    <CardContent className="p-5 space-y-4">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            🔵 Demande en cours de traitement
                        </Badge>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">N° dossier</span>
                                <span className="font-mono font-semibold">{mainAgrement.numeroDossier}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Montant payé</span>
                                <span className="font-semibold">{formatMoney(mainAgrement.montant)}</span>
                            </div>
                        </div>

                        <ProgressionEtapes
                            etapes={etapesProgression}
                            etapeActuelle={mainAgrement.etapeActuelle}
                            orientation="vertical"
                            size={isSimple ? "lg" : "md"}
                            className="mt-4"
                        />

                        {/* Prochaine étape */}
                        <div className="bg-blue-100 rounded-xl p-4">
                            <p className="text-sm text-blue-800 font-medium">
                                💡 Prochaine étape : {
                                    mainAgrement.etapeActuelle === "soumis" ? "Effectuer le paiement" :
                                        mainAgrement.etapeActuelle === "paye" || mainAgrement.etapeActuelle === "paiement_en_attente" ? "Vérification de vos documents par l'AGASA" :
                                            mainAgrement.etapeActuelle === "verification_documents" ? "Programmation de l'inspection" :
                                                mainAgrement.etapeActuelle === "inspection_programmee" ? "L'inspecteur viendra à votre établissement" :
                                                    "L'AGASA va rendre sa décision"
                                }
                            </p>
                        </div>

                        {/* Documents soumis */}
                        {mainAgrement.piecesJointes?.length > 0 && (
                            <div className="border-t pt-4">
                                <p className="text-sm font-semibold mb-2">📎 Documents soumis</p>
                                {mainAgrement.piecesJointes.map((doc: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-sm py-1">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        <span>{doc.nom || doc}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Compléments demandés par l'AGASA */}
                        {mainAgrement.complements && mainAgrement.complements.length > 0 && (
                            <div className="border-t pt-4 space-y-3">
                                {mainAgrement.complements.filter((c: any) => !c.reponse).map((comp: any, i: number) => (
                                    <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-orange-500 text-lg flex-shrink-0">⚠️</span>
                                            <div>
                                                <p className="font-semibold text-orange-800 text-sm">
                                                    L&apos;AGASA vous demande un document complémentaire
                                                </p>
                                                <p className="text-sm text-orange-700 mt-1">{comp.demande}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{formatDate(comp.dateDemande)}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="w-full gap-2 border-orange-300 text-orange-700 hover:bg-orange-100">
                                            <Upload className="w-4 h-4" />
                                            Envoyer le document
                                        </Button>
                                        <p className="text-xs text-orange-600 text-center">
                                            Pas d&apos;inquiétude, c&apos;est fréquent. Fournissez le document demandé et votre dossier reprendra son cours.
                                        </p>
                                    </div>
                                ))}
                                {mainAgrement.complements.filter((c: any) => c.reponse).map((comp: any, i: number) => (
                                    <div key={`done-${i}`} className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                                        <p className="text-green-700 font-medium">✅ {comp.demande}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Complément fourni le {formatDate(comp.dateReponse)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                /* Pas d'agrément */
                <AgrementCard agrement={null} />
            )}

            {/* Bouton renouvellement si agrément actif + < 90j avant expiration */}
            {mainAgrement?.etapeActuelle === "agree" && mainAgrement?.dateExpiration &&
                (mainAgrement.dateExpiration - Date.now()) < 90 * 24 * 60 * 60 * 1000 && (
                    <Card className="shadow-sm border-amber-200 bg-amber-50/50">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm text-amber-800">🔄 Renouvellement bientôt</p>
                                <p className="text-xs text-amber-700">
                                    Votre agrément expire dans {Math.ceil((mainAgrement.dateExpiration - Date.now()) / (1000 * 60 * 60 * 24))} jours
                                </p>
                            </div>
                            <Button asChild size="sm" className="gap-2">
                                <Link href="/agrement/renouvellement">
                                    <RefreshCw className="w-4 h-4" /> Renouveler
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

            {/* Aide */}
            <Card className="shadow-sm bg-muted/30">
                <CardContent className="p-4 flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">❓ Questions fréquentes</p>
                        <p>L&apos;agrément sanitaire est obligatoire pour toute activité liée à l&apos;alimentation au Gabon.</p>
                        <p className="mt-1">
                            Contactez-nous au <span className="font-semibold text-foreground">+241 11 76 99 99</span>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
