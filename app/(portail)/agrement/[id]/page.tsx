"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ProgressionEtapes, type EtapeProgression } from "@/components/shared/ProgressionEtapes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, CheckCircle2, Clock, FileText, Download, AlertCircle,
    FileBadge, MessageSquare, Calendar,
} from "lucide-react";
import Link from "next/link";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }
function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

function getEtapeLabel(etape: string): string {
    const labels: Record<string, string> = {
        brouillon: "Brouillon", soumis: "Dossier soumis", paiement_en_attente: "Paiement en attente",
        paye: "Paiement reçu", verification_documents: "Vérification documentaire",
        demande_complements: "Compléments demandés", inspection_programmee: "Inspection programmée",
        inspection_realisee: "Inspection réalisée", decision_en_cours: "Décision en cours",
        agree: "Agréé ✅", refuse: "Refusé ❌",
    };
    return labels[etape] || etape;
}

export default function DetailDemandePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: agrementIdStr } = use(params);
    const agrementId = agrementIdStr as Id<"agrements">;
    const agrement = useQuery(api.agrement.queries.getAgrement, { agrementId });

    if (agrement === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!agrement) {
        return (
            <div className="p-4 sm:p-8 max-w-5xl mx-auto text-center py-16">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-xl font-bold mb-2">Dossier introuvable</h1>
                <p className="text-muted-foreground mb-4">Ce dossier n&apos;existe pas ou vous n&apos;y avez pas accès.</p>
                <Button asChild><Link href="/agrement">Retour aux agréments</Link></Button>
            </div>
        );
    }

    const isAgree = agrement.etapeActuelle === "agree";
    const isRefuse = agrement.etapeActuelle === "refuse";
    const isEnCours = !isAgree && !isRefuse;

    // Build progression etapes
    const allEtapes = ["soumis", "paye", "verification_documents", "inspection_programmee", "inspection_realisee", "decision_en_cours", "agree"];
    const currentIdx = allEtapes.indexOf(agrement.etapeActuelle);
    const etapesProgression: EtapeProgression[] = allEtapes.map((etape, i) => {
        const histEntry = agrement.historiqueEtapes.find((h: any) => h.etape === etape);
        return {
            etape,
            label: getEtapeLabel(etape),
            description: histEntry?.commentaire || "",
            date: histEntry ? formatDate(histEntry.date) : undefined,
        };
    });

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Button variant="ghost" asChild className="mb-2 -ml-4 text-muted-foreground">
                        <Link href="/agrement"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Dossier <span className="font-mono">{agrement.numeroDossier}</span>
                        </h1>
                        {isAgree && <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Agréé</Badge>}
                        {isRefuse && <Badge className="bg-red-100 text-red-700"><AlertCircle className="w-3 h-3 mr-1" /> Refusé</Badge>}
                        {isEnCours && <Badge className="bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1" /> En cours</Badge>}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {agrement.etablissementNom} — {agrement.type === "premiere_demande" ? "Première demande" : "Renouvellement"} ({agrement.categorie})
                    </p>
                </div>
                {isAgree && agrement.certificat && (
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                        <Link href={`/agrement/${agrementIdStr}/certificat`}>
                            <FileBadge className="w-4 h-4 mr-2" /> Voir le certificat
                        </Link>
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Timeline colonne gauche */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader className="bg-muted/30 border-b pb-3">
                            <CardTitle className="text-lg flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-primary" /> Progression du dossier
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ProgressionEtapes etapes={etapesProgression} etapeActuelle={agrement.etapeActuelle} orientation="vertical" />
                        </CardContent>
                    </Card>

                    {/* Inspection programmée */}
                    {agrement.inspectionProgrammee && isEnCours && (
                        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
                            <CardContent className="p-4 flex gap-3">
                                <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-amber-900">
                                        Inspection prévue le {formatDate(agrement.inspectionProgrammee.date)}
                                    </p>
                                    <p className="text-sm text-amber-800 mt-1">
                                        Inspecteur : {agrement.inspectionProgrammee.inspecteurRef}
                                    </p>
                                    {agrement.inspectionProgrammee.commentaire && (
                                        <p className="text-sm text-amber-700 mt-1">{agrement.inspectionProgrammee.commentaire}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Compléments demandés */}
                    {agrement.complements && agrement.complements.length > 0 && (
                        <Card className="border-orange-200 bg-orange-50/50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base text-orange-800 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" /> Compléments demandés
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {agrement.complements.map((comp: any, i: number) => (
                                    <div key={i} className="p-3 bg-white rounded-lg border border-orange-100">
                                        <p className="text-sm font-medium">{comp.demande}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{formatDate(comp.dateDemande)}</p>
                                        {comp.reponse && (
                                            <p className="text-xs text-green-600 mt-1">✅ Réponse fournie le {formatDate(comp.dateReponse)}</p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Décision */}
                    {agrement.decision && (
                        <Card className={`shadow-sm ${agrement.decision.resultat === "agree" ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {agrement.decision.resultat === "agree" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className={`font-bold ${agrement.decision.resultat === "agree" ? "text-green-700" : "text-red-700"}`}>
                                        {agrement.decision.resultat === "agree" ? "Agrément accordé" : "Agrément refusé"}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Décision du {formatDate(agrement.decision.date)} — Agent : {agrement.decision.agentRef}
                                </p>
                                {agrement.decision.motif && (
                                    <p className="text-sm mt-2 p-2 bg-white/80 rounded">{agrement.decision.motif}</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Colonne droite */}
                <div className="space-y-4">
                    {/* Paiement */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Détails de paiement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Montant</span><span className="font-bold">{formatMoney(agrement.montant)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Catégorie</span><span className="font-medium">{agrement.categorie}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{agrement.type === "premiere_demande" ? "1ère demande" : "Renouvellement"}</span></div>
                        </CardContent>
                    </Card>

                    {/* Pièces jointes */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Pièces fournies</CardTitle>
                            <CardDescription>{agrement.piecesJointes.length} document(s)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {agrement.piecesJointes.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">Aucun document joint.</p>
                            ) : (
                                agrement.piecesJointes.map((doc: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-md border text-sm hover:bg-muted transition-colors">
                                        <div className="flex items-center gap-2 truncate">
                                            <FileText className="w-4 h-4 text-primary shrink-0" />
                                            <div className="truncate">
                                                <p className="font-medium truncate">{doc.nom}</p>
                                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-muted-foreground shrink-0" />
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Certificat si agréé */}
                    {agrement.certificat && (
                        <Card className="shadow-sm border-green-200 bg-green-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base text-green-700 flex items-center">
                                    <FileBadge className="w-4 h-4 mr-2" /> Certificat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">N°</span><span className="font-mono font-bold">{agrement.certificat.numero}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Délivré le</span><span>{formatDate(agrement.certificat.dateDelivrance)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Expire le</span><span className="font-semibold">{formatDate(agrement.certificat.dateExpiration)}</span></div>
                                <Button asChild size="sm" className="w-full mt-2 gap-2">
                                    <Link href={`/agrement/${agrementIdStr}/certificat`}>
                                        <FileBadge className="w-4 h-4" /> Voir le certificat
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
