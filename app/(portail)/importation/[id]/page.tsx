"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { Id } from "@/convex/_generated/dataModel";
import { ProgressionEtapes, type EtapeProgression } from "@/components/shared/ProgressionEtapes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ArrowLeft, CheckCircle2, Clock, FileText, MapPin, Ship,
    Package, AlertCircle,
} from "lucide-react";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }
function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

function getEtapeLabel(etape: string): string {
    const labels: Record<string, string> = {
        brouillon: "Brouillon", soumis: "Dossier soumis", verification_docs: "Vérification docs",
        paiement_en_attente: "Paiement", en_traitement: "En traitement",
        inspection_doc: "Inspection documentaire", inspection_physique: "Inspection physique",
        analyse_labo: "Analyse labo", decision: "Décision",
        amc_delivree: "AMC délivrée ✅", refuse: "Refusé ❌", reexportation: "Réexportation",
    };
    return labels[etape] || etape;
}

export default function ImportationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: importIdStr } = use(params);
    const { firebaseUid } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });

    if (data === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const importation = data?.importations?.find((i: any) => i._id === importIdStr);

    if (!importation) {
        return (
            <div className="p-4 text-center py-16">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted" />
                <h1 className="text-xl font-bold">Dossier introuvable</h1>
                <Button asChild className="mt-4"><Link href="/importation">Retour</Link></Button>
            </div>
        );
    }

    const allEtapes = ["soumis", "verification_docs", "paiement_en_attente", "en_traitement", "inspection_doc", "inspection_physique", "decision", "amc_delivree"];
    const etapesProgression: EtapeProgression[] = allEtapes.map((etape) => {
        const hist = importation.historiqueEtapes?.find((h: any) => h.etape === etape);
        return {
            etape,
            label: getEtapeLabel(etape),
            description: hist?.commentaire || "",
            date: hist ? formatDate(hist.date) : undefined,
        };
    });

    const isTermine = importation.etapeActuelle === "amc_delivree";

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Button variant="ghost" asChild className="mb-2 -ml-4 text-muted-foreground">
                        <Link href="/importation"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold"><span className="font-mono">{importation.numeroDossier}</span></h1>
                        {isTermine ? (
                            <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" /> AMC délivrée</Badge>
                        ) : (
                            <Badge className="bg-blue-100 text-blue-700"><Clock className="w-3 h-3 mr-1" /> En cours</Badge>
                        )}
                    </div>
                </div>
                {importation.amcNumero && (
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                        <Link href={`/importation/${importIdStr}/amc`}>📜 Voir l&apos;AMC</Link>
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 bg-muted/30 border-b">
                            <CardTitle className="text-base flex items-center"><Clock className="w-4 h-4 mr-2 text-primary" /> Progression</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ProgressionEtapes etapes={etapesProgression} etapeActuelle={importation.etapeActuelle} orientation="vertical" size="sm" />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3"><CardTitle className="text-base">📋 Détails</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{importation.typeImportation}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Port</span><span className="font-medium flex items-center gap-1"><Ship className="w-3 h-3" />{importation.portArrivee}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Pays</span><span className="font-medium">{importation.paysOrigine}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Conteneurs</span><span className="font-medium">{importation.nombreConteneurs}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Valeur</span><span className="font-bold">{formatMoney(importation.valeurDeclaree)}</span></div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-3"><CardTitle className="text-base">💰 Prestations</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {importation.prestations?.map((p: any, i: number) => (
                                <div key={i} className="flex justify-between text-sm p-2 rounded bg-muted/50">
                                    <span className="truncate">{getEtapeLabel(p.type)}</span>
                                    <span className="font-semibold whitespace-nowrap">{formatMoney(p.tarif)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Total</span>
                                <span className="text-primary">{formatMoney(importation.montantTotal)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
