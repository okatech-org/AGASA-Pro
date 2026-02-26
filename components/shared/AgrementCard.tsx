"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, RefreshCw, ClipboardList, Sparkles } from "lucide-react";

type AgrementData = {
    _id: string;
    numeroDossier: string;
    categorie: string;
    etapeActuelle: string;
    dateExpiration?: number;
    certificat?: {
        numero: string;
        dateDelivrance: number;
        dateExpiration: number;
    };
    etablissementNom?: string;
};

type AgrementCardProps = {
    agrement?: AgrementData | null;
    variant?: "full" | "compact";
    className?: string;
};

function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function daysUntil(timestamp: number) {
    const diff = timestamp - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getCategorieLabel(cat: string) {
    const labels: Record<string, string> = {
        AS_CAT_1: "AS CAT 1 — Industriel / Importateur",
        AS_CAT_2: "AS CAT 2 — Restaurant / Commerce",
        AS_CAT_3: "AS CAT 3 — Petit commerce alimentaire",
        TRANSPORT: "Transport alimentaire",
    };
    return labels[cat] || cat;
}

export function AgrementCard({ agrement, variant = "full", className = "" }: AgrementCardProps) {
    // Pas d'agrément
    if (!agrement) {
        return (
            <Card className={`shadow-md border-2 border-dashed border-muted ${className}`}>
                <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Vous n&apos;avez pas encore d&apos;agrément sanitaire.</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            L&apos;agrément est obligatoire pour exercer votre activité.
                        </p>
                    </div>
                    <Button asChild size="lg" className="w-full gap-2 h-14 text-base font-bold shadow-md">
                        <Link href="/agrement/nouvelle-demande">
                            <Sparkles className="w-5 h-5" />
                            Faire ma demande d&apos;agrément
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const isActive = agrement.etapeActuelle === "agree";
    const isInProgress = !isActive && agrement.etapeActuelle !== "refuse";
    const isRefused = agrement.etapeActuelle === "refuse";

    const expirationDays = agrement.certificat?.dateExpiration
        ? daysUntil(agrement.certificat.dateExpiration)
        : agrement.dateExpiration
            ? daysUntil(agrement.dateExpiration)
            : null;
    const showRenewalWarning = expirationDays !== null && expirationDays <= 90 && expirationDays > 0;

    // Agrément actif
    if (isActive) {
        return (
            <Card className={`shadow-md border-green-200 bg-white ${className}`}>
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-2">
                                ✅ Agrément actif
                            </Badge>
                            {agrement.etablissementNom && (
                                <p className="text-sm text-muted-foreground">{agrement.etablissementNom}</p>
                            )}
                        </div>
                        {showRenewalWarning && (
                            <Badge variant="outline" className="border-orange-300 text-orange-600 bg-orange-50">
                                Renouvellement bientôt
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-2">
                        {agrement.certificat && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">N° certificat</span>
                                <span className="font-mono font-semibold">{agrement.certificat.numero}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Catégorie</span>
                            <span className="font-medium">{getCategorieLabel(agrement.categorie)}</span>
                        </div>
                        {agrement.certificat?.dateExpiration && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Expire le</span>
                                <span className="font-medium">{formatDate(agrement.certificat.dateExpiration)}</span>
                            </div>
                        )}
                        {expirationDays !== null && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Dans</span>
                                <span className={`font-bold ${showRenewalWarning ? "text-orange-600" : "text-green-600"}`}>
                                    {expirationDays} jours
                                </span>
                            </div>
                        )}
                    </div>

                    {variant === "full" && (
                        <div className="grid grid-cols-1 gap-2 pt-2">
                            <Button asChild variant="outline" className="w-full gap-2 h-12 text-sm font-semibold">
                                <Link href={`/agrement/${agrement._id}`}>
                                    <FileText className="w-4 h-4" />
                                    Voir mon certificat
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full gap-2 h-12 text-sm font-semibold">
                                <Link href={`/agrement/${agrement._id}/certificat`}>
                                    <Download className="w-4 h-4" />
                                    Télécharger le PDF
                                </Link>
                            </Button>
                            {showRenewalWarning && (
                                <Button asChild className="w-full gap-2 h-12 text-sm font-semibold bg-orange-500 hover:bg-orange-600">
                                    <Link href="/agrement/nouvelle-demande?type=renouvellement">
                                        <RefreshCw className="w-4 h-4" />
                                        Renouveler
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Agrément en cours
    if (isInProgress) {
        const ETAPE_LABELS: Record<string, { label: string; step: number }> = {
            brouillon: { label: "Brouillon", step: 0 },
            soumis: { label: "Dossier soumis", step: 1 },
            paiement_en_attente: { label: "Paiement en attente", step: 1 },
            paye: { label: "Paiement reçu", step: 2 },
            verification_documents: { label: "Documents vérifiés", step: 3 },
            demande_complements: { label: "Complément demandé", step: 3 },
            inspection_programmee: { label: "Inspection programmée", step: 4 },
            inspection_realisee: { label: "Inspection réalisée", step: 4 },
            decision_en_cours: { label: "Décision en cours", step: 5 },
        };
        const etapeInfo = ETAPE_LABELS[agrement.etapeActuelle] || { label: agrement.etapeActuelle, step: 0 };
        const totalSteps = 5;

        return (
            <Card className={`shadow-md border-blue-200 bg-blue-50/30 ${className}`}>
                <CardContent className="p-5 space-y-4">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        🔵 Demande en cours
                    </Badge>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">N° dossier</span>
                            <span className="font-mono font-semibold">{agrement.numeroDossier}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Étape actuelle</span>
                            <span className="font-medium text-blue-700">{etapeInfo.label}</span>
                        </div>
                    </div>

                    {/* Mini barre de progression */}
                    <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progression</span>
                            <span>{etapeInfo.step}/{totalSteps}</span>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 flex-1 rounded-full ${i < etapeInfo.step ? "bg-blue-500" :
                                            i === etapeInfo.step ? "bg-blue-300 animate-pulse" :
                                                "bg-gray-200"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {variant === "full" && (
                        <Button asChild variant="outline" className="w-full gap-2 h-12 text-sm font-semibold">
                            <Link href={`/agrement/${agrement._id}`}>
                                <ClipboardList className="w-4 h-4" />
                                Suivre ma demande
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Agrément refusé
    return (
        <Card className={`shadow-md border-red-200 bg-red-50/30 ${className}`}>
            <CardContent className="p-5 space-y-4">
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                    ❌ Demande refusée
                </Badge>
                <p className="text-sm text-muted-foreground">
                    Votre demande d&apos;agrément a été refusée. Consultez les détails pour connaître le motif.
                </p>
                <Button asChild variant="outline" className="w-full gap-2 h-12 text-sm font-semibold">
                    <Link href={`/agrement/${agrement._id}`}>
                        Voir les détails
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
