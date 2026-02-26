"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    FlaskConical, Plus, ArrowLeft, ArrowRight, Download, Clock,
    CheckCircle2, AlertCircle, Zap,
} from "lucide-react";
import { useState } from "react";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }); }
function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

function getStatusBadge(etape: string) {
    const c: Record<string, { label: string; className: string; icon?: React.ReactNode }> = {
        soumis: { label: "Soumis", className: "bg-blue-100 text-blue-700" },
        paye: { label: "Payé", className: "bg-blue-100 text-blue-700" },
        echantillon_recu: { label: "Échantillon reçu", className: "bg-purple-100 text-purple-700" },
        en_analyse: { label: "En analyse 🔬", className: "bg-amber-100 text-amber-700" },
        resultats_disponibles: { label: "Résultats dispo ✅", className: "bg-green-100 text-green-700" },
    };
    const s = c[etape] || { label: etape.replace(/_/g, " "), className: "bg-gray-100 text-gray-600" };
    return <Badge className={`${s.className} hover:${s.className}`}>{s.label}</Badge>;
}

export default function AnalysesPage() {
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

    const commandes = data.commandesAnalyses || [];
    const filtered = filter === "all" ? commandes :
        filter === "en_cours" ? commandes.filter((c: any) => c.statut === "en_cours") :
            commandes.filter((c: any) => c.statut === "termine");

    const enCours = commandes.filter((c: any) => c.statut === "en_cours").length;
    const resultats = commandes.filter((c: any) => c.etapeActuelle === "resultats_disponibles").length;

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/tableau-de-bord"><ArrowLeft className="w-5 h-5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">🔬 Mes Analyses</h1>
                        <p className="text-sm text-muted-foreground">{commandes.length} commande(s)</p>
                    </div>
                </div>
                <Button asChild size="sm" className="gap-2">
                    <Link href="/analyses/nouvelle">
                        <Plus className="w-4 h-4" />
                        Nouvelle
                    </Link>
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold">{commandes.length}</div>
                        <p className="text-[10px] text-muted-foreground">Total</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-amber-600">{enCours}</div>
                        <p className="text-[10px] text-muted-foreground">En cours</p>
                    </CardContent>
                </Card>
                <Card className={`shadow-sm ${resultats > 0 ? "border-green-200 bg-green-50/50" : ""}`}>
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{resultats}</div>
                        <p className="text-[10px] text-muted-foreground">Résultats</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
                {[
                    { key: "all" as const, label: "Toutes" },
                    { key: "en_cours" as const, label: "En cours" },
                    { key: "termine" as const, label: "Terminées" },
                ].map((f) => (
                    <Button key={f.key} variant={filter === f.key ? "default" : "outline"} size="sm" onClick={() => setFilter(f.key)}>
                        {f.label}
                    </Button>
                ))}
            </div>

            {/* Liste */}
            {filtered.length === 0 ? (
                <Card className="shadow-sm">
                    <CardContent className="p-8 text-center">
                        <FlaskConical className="w-12 h-12 mx-auto mb-3 text-muted" />
                        <p className="font-medium">Aucune analyse</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Commandez une analyse de laboratoire pour vos produits.
                        </p>
                        <Button asChild className="mt-4" size="sm">
                            <Link href="/analyses/nouvelle">Commander une analyse</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((cmd: any) => (
                        <Card key={cmd._id} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4 space-y-3">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-sm font-bold">{cmd.numeroCommande}</span>
                                    {getStatusBadge(cmd.etapeActuelle)}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground line-clamp-1">{cmd.echantillonDescription}</p>

                                {/* Paramètres */}
                                <div className="flex flex-wrap gap-1">
                                    {cmd.parametresSelectionnes?.map((p: any, i: number) => (
                                        <Badge key={i} variant="outline" className="text-[10px]">{p.parametreNom}</Badge>
                                    ))}
                                    {cmd.express && (
                                        <Badge className="bg-orange-100 text-orange-700 text-[10px]">
                                            <Zap className="w-3 h-3 mr-0.5" /> Express
                                        </Badge>
                                    )}
                                </div>

                                {/* Détails */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Matrice : <span className="font-medium text-foreground capitalize">{cmd.matrice}</span></span>
                                    <span className="font-semibold text-foreground">{formatMoney(cmd.montantTotal)}</span>
                                </div>

                                {/* Résultats si disponibles */}
                                {cmd.resultats && (
                                    <div className={`rounded-lg p-3 flex items-center justify-between ${cmd.resultats.conforme ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                                        <div className="flex items-center gap-2">
                                            {cmd.resultats.conforme ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-red-600" />
                                            )}
                                            <span className={`text-xs font-medium ${cmd.resultats.conforme ? "text-green-700" : "text-red-700"}`}>
                                                {cmd.resultats.conforme ? "Conforme" : "Non conforme"}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                            <Download className="w-3.5 h-3.5" />
                                            Rapport
                                        </Button>
                                    </div>
                                )}

                                {/* Date */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                                    <span>{formatDate(cmd.dateCreation)}</span>
                                    <span className="capitalize">{cmd.matrice}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
