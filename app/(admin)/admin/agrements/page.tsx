"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Eye, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useFirebaseSession } from "@/lib/useFirebaseSession";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR"); }

const ETAPE_BADGES: Record<string, { label: string; color: string }> = {
    brouillon: { label: "Brouillon", color: "bg-gray-100 text-gray-600" },
    soumis: { label: "Soumis", color: "bg-blue-100 text-blue-700" },
    paye: { label: "Payé", color: "bg-cyan-100 text-cyan-700" },
    verification_documents: { label: "Vérif. docs", color: "bg-indigo-100 text-indigo-700" },
    demande_complements: { label: "Compléments", color: "bg-orange-100 text-orange-700" },
    inspection_programmee: { label: "Inspection", color: "bg-amber-100 text-amber-700" },
    inspection_realisee: { label: "Inspecté", color: "bg-yellow-100 text-yellow-700" },
    decision_en_cours: { label: "Décision", color: "bg-purple-100 text-purple-700" },
    agree: { label: "Agréé ✅", color: "bg-green-100 text-green-700" },
    refuse: { label: "Refusé ❌", color: "bg-red-100 text-red-700" },
};

export default function AdminAgrementsPage() {
    const { uid, isLoading: authLoading } = useFirebaseSession();
    const [filterCat, setFilterCat] = useState<string>("");
    const [filterEtape, setFilterEtape] = useState<string>("");
    const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

    const agrements = useQuery(
        api.admin.queries.listAllAgrements,
        uid
            ? {
                adminFirebaseUid: uid,
                categorie: filterCat || undefined,
                etape: filterEtape || undefined,
            }
            : "skip"
    );

    if (authLoading || agrements === undefined) {
        return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-[#1B4F72] border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (!uid) {
        return <div className="text-sm text-muted-foreground">Connexion administrateur requise.</div>;
    }

    const kanbanEtapes = ["soumis", "paye", "verification_documents", "demande_complements", "inspection_programmee", "inspection_realisee", "decision_en_cours", "agree", "refuse"];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold">📜 Suivi des agréments</h1>
                    <p className="text-sm text-muted-foreground">{agrements.length} dossiers</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>Table</Button>
                    <Button variant={viewMode === "kanban" ? "default" : "outline"} size="sm" onClick={() => setViewMode("kanban")}>Kanban</Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <select className="border rounded-md px-3 py-2 text-sm" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                    <option value="">Toutes catégories</option>
                    <option value="AS_CAT_1">CAT 1</option>
                    <option value="AS_CAT_2">CAT 2</option>
                    <option value="AS_CAT_3">CAT 3</option>
                    <option value="TRANSPORT">Transport</option>
                </select>
                <select className="border rounded-md px-3 py-2 text-sm" value={filterEtape} onChange={(e) => setFilterEtape(e.target.value)}>
                    <option value="">Toutes étapes</option>
                    {Object.entries(ETAPE_BADGES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
            </div>

            {viewMode === "table" ? (
                <Card className="shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="text-left p-3 text-xs font-semibold">N° dossier</th>
                                        <th className="text-left p-3 text-xs font-semibold">Opérateur</th>
                                        <th className="text-left p-3 text-xs font-semibold hidden md:table-cell">Établissement</th>
                                        <th className="text-left p-3 text-xs font-semibold">Cat.</th>
                                        <th className="text-left p-3 text-xs font-semibold">Étape</th>
                                        <th className="text-left p-3 text-xs font-semibold hidden lg:table-cell">Province</th>
                                        <th className="text-left p-3 text-xs font-semibold hidden lg:table-cell">Date</th>
                                        <th className="text-center p-3 text-xs font-semibold">Délai</th>
                                        <th className="text-right p-3 text-xs font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agrements.map((agr: any) => {
                                        const badge = ETAPE_BADGES[agr.etapeActuelle] || { label: agr.etapeActuelle, color: "bg-gray-100" };
                                        const isLate = agr.delaiJours > 21 && !["agree", "refuse"].includes(agr.etapeActuelle);
                                        return (
                                            <tr key={agr._id} className="border-b last:border-0 hover:bg-muted/30">
                                                <td className="p-3 font-mono text-xs">{agr.numeroDossier}</td>
                                                <td className="p-3 font-medium text-sm">{agr.operateurNom}</td>
                                                <td className="p-3 text-xs hidden md:table-cell">{agr.etablissementNom}</td>
                                                <td className="p-3"><Badge variant="outline" className="text-[10px]">{agr.categorie}</Badge></td>
                                                <td className="p-3"><Badge className={`${badge.color} text-[10px]`}>{badge.label}</Badge></td>
                                                <td className="p-3 text-xs hidden lg:table-cell">{agr.operateurProvince}</td>
                                                <td className="p-3 text-xs hidden lg:table-cell">{formatDate(agr.dateCreation)}</td>
                                                <td className="p-3 text-center">
                                                    <span className={`text-xs font-bold ${isLate ? "text-red-600" : "text-muted-foreground"}`}>
                                                        {agr.delaiJours}j {isLate && "⚠️"}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                        <Link href={`/admin/agrements/${agr._id}`}><Eye className="w-4 h-4" /></Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* Vue Kanban */
                <div className="flex gap-3 overflow-x-auto pb-4">
                    {kanbanEtapes.map((etape) => {
                        const badge = ETAPE_BADGES[etape] || { label: etape, color: "" };
                        const cards = agrements.filter((a: any) => a.etapeActuelle === etape);
                        return (
                            <div key={etape} className="min-w-[240px] flex-shrink-0">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className="text-xs font-bold text-muted-foreground">{badge.label}</span>
                                    <Badge variant="outline" className="text-[10px]">{cards.length}</Badge>
                                </div>
                                <div className="space-y-2 bg-muted/30 rounded-lg p-2 min-h-[200px]">
                                    {cards.map((agr: any) => (
                                        <Link key={agr._id} href={`/admin/agrements/${agr._id}`}>
                                            <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                                <CardContent className="p-3 space-y-1">
                                                    <p className="font-medium text-sm truncate">{agr.operateurNom}</p>
                                                    <p className="text-xs text-muted-foreground">{agr.etablissementNom}</p>
                                                    <div className="flex justify-between items-center">
                                                        <Badge variant="outline" className="text-[9px]">{agr.categorie}</Badge>
                                                        <span className={`text-[10px] font-bold ${agr.delaiJours > 21 ? "text-red-600" : "text-muted-foreground"}`}>{agr.delaiJours}j</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
