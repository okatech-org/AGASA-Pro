"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { ProgressionEtapes, type EtapeProgression } from "@/components/shared/ProgressionEtapes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Package, Plus, Search, Clock, Ship, FileText, ArrowRight, ArrowLeft,
    CheckCircle2, AlertCircle,
} from "lucide-react";
import { useState } from "react";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }); }
function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

function getStatusBadge(etape: string) {
    const c: Record<string, { label: string; className: string }> = {
        brouillon: { label: "Brouillon", className: "bg-gray-100 text-gray-600" },
        soumis: { label: "Soumis", className: "bg-blue-100 text-blue-700" },
        en_traitement: { label: "En traitement", className: "bg-amber-100 text-amber-700" },
        inspection_physique: { label: "Inspection", className: "bg-orange-100 text-orange-700" },
        amc_delivree: { label: "AMC délivrée ✅", className: "bg-green-100 text-green-700" },
        refuse: { label: "Refusé", className: "bg-red-100 text-red-700" },
    };
    const s = c[etape] || { label: etape.replace(/_/g, " "), className: "bg-gray-100 text-gray-600" };
    return <Badge className={`${s.className} hover:${s.className}`}>{s.label}</Badge>;
}

export default function ImportationPage() {
    const { operateur, firebaseUid } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });
    const [filter, setFilter] = useState<"all" | "en_cours" | "termine">("all");

    if (!data || !operateur) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const importations = data.importations || [];
    const filtered = filter === "all" ? importations :
        filter === "en_cours" ? importations.filter((i: any) => i.statut === "en_cours") :
            importations.filter((i: any) => i.statut === "termine");

    // KPIs
    const enCours = importations.filter((i: any) => i.statut === "en_cours").length;
    const terminees = importations.filter((i: any) => i.statut === "termine").length;
    const totalMontant = importations.reduce((sum: number, i: any) => sum + (i.montantTotal || 0), 0);

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/tableau-de-bord"><ArrowLeft className="w-5 h-5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">📦 Mes Importations</h1>
                        <p className="text-sm text-muted-foreground">{importations.length} dossier(s)</p>
                    </div>
                </div>
                <Button asChild size="sm" className="gap-2">
                    <Link href="/importation/nouvelle">
                        <Plus className="w-4 h-4" />
                        Nouveau
                    </Link>
                </Button>
            </div>

            {/* KPIs compacts */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{enCours}</div>
                        <p className="text-[10px] text-muted-foreground">En cours</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{terminees}</div>
                        <p className="text-[10px] text-muted-foreground">Terminés</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-sm font-bold">{formatMoney(totalMontant)}</div>
                        <p className="text-[10px] text-muted-foreground">Total frais</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                    { key: "all" as const, label: "Tous" },
                    { key: "en_cours" as const, label: "En cours" },
                    { key: "termine" as const, label: "Terminés" },
                ].map((f) => (
                    <Button
                        key={f.key}
                        variant={filter === f.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                    </Button>
                ))}
            </div>

            {/* Liste des dossiers */}
            {filtered.length === 0 ? (
                <Card className="shadow-sm">
                    <CardContent className="p-8 text-center">
                        <Package className="w-12 h-12 mx-auto mb-3 text-muted" />
                        <p className="font-medium">Aucune importation</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {filter === "all"
                                ? "Déposez votre première déclaration d'importation."
                                : `Aucun dossier ${filter === "en_cours" ? "en cours" : "terminé"}.`}
                        </p>
                        <Button asChild className="mt-4" size="sm">
                            <Link href="/importation/nouvelle">Nouvelle déclaration</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((imp: any) => (
                        <Link key={imp._id} href={`/importation/${imp._id}`}>
                            <Card className="shadow-sm hover:shadow-md transition-shadow mb-3">
                                <CardContent className="p-4 space-y-3">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm font-bold">{imp.numeroDossier}</span>
                                        {getStatusBadge(imp.etapeActuelle)}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground line-clamp-1">{imp.descriptionMarchandise}</p>

                                    {/* Détails */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <Ship className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">Port:</span>
                                            <span className="font-medium">{imp.portArrivee}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-muted-foreground">Origine:</span>
                                            <span className="font-medium">{imp.paysOrigine}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Package className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">Conteneurs:</span>
                                            <span className="font-medium">{imp.nombreConteneurs}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-muted-foreground">Frais:</span>
                                            <span className="font-semibold">{formatMoney(imp.montantTotal)}</span>
                                        </div>
                                    </div>

                                    {/* AMC si délivrée */}
                                    {imp.amcNumero && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            <span className="text-xs font-medium text-green-700">
                                                AMC : {imp.amcNumero}
                                            </span>
                                        </div>
                                    )}

                                    {/* Date */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                                        <span>{formatDate(imp.dateCreation)}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
