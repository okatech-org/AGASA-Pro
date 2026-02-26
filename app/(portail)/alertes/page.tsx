"use client";

import { useState } from "react";
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    Clock,
    Info,
    Eye,
    UploadCloud,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_ALERTES = [
    {
        id: "ALT-001",
        type: "rappel_lot",
        titre: "Rappel urgent : Conserves de sardines — Lot N° BF-2026-112",
        message: "Un taux de mercure supérieur à la norme a été détecté dans le lot BF-2026-112 de sardines en conserve importées de Côte d'Ivoire. Veuillez retirer ce lot de la vente immédiatement.",
        actionRequise: "Retirer les produits du lot BF-2026-112 et fournir une preuve de retrait.",
        accuseReception: false,
        lu: false,
        date: "24 Fév 2026",
    },
    {
        id: "ALT-002",
        type: "non_conformite",
        titre: "Avis de non-conformité suite à l'inspection du 15/01/2026",
        message: "L'inspection de votre établissement 'Restaurant Le Baobab' a révélé des points de non-conformité sur la chaine du froid.",
        actionRequise: "Installer un thermomètre enregistreur dans la chambre froide.",
        delaiJours: 15,
        accuseReception: true,
        lu: true,
        date: "15 Jan 2026",
    },
    {
        id: "ALT-003",
        type: "cemac",
        titre: "Alerte CEMAC : Interdiction temporaire de la volaille du Cameroun",
        message: "Suite à un foyer de grippe aviaire détecté au Cameroun, les importations de volaille de ce pays sont temporairement suspendues dans l'espace CEMAC.",
        lu: true,
        date: "10 Jan 2026",
    },
    {
        id: "ALT-004",
        type: "info",
        titre: "Mise à jour de la grille tarifaire 2026",
        message: "La nouvelle grille tarifaire AGASA entre en vigueur le 1er Mars 2026.",
        lu: true,
        date: "5 Jan 2026",
    },
];

export default function AlertesPage() {
    const [filtre, setFiltre] = useState("tous");
    const [selectedAlerte, setSelectedAlerte] = useState<string | null>(null);

    const getTypeConfig = (type: string) => {
        switch (type) {
            case "rappel_lot": return { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Rappel de lot", badgeClass: "bg-destructive text-destructive-foreground" };
            case "non_conformite": return { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100", label: "Non-conformité", badgeClass: "bg-orange-100 text-orange-800" };
            case "cemac": return { icon: Info, color: "text-blue-600", bg: "bg-blue-100", label: "Alerte CEMAC", badgeClass: "bg-blue-100 text-blue-800" };
            case "info": return { icon: Info, color: "text-muted-foreground", bg: "bg-muted", label: "Information", badgeClass: "bg-muted text-muted-foreground" };
            default: return { icon: Bell, color: "text-muted-foreground", bg: "bg-muted", label: type, badgeClass: "" };
        }
    };

    const nonLues = MOCK_ALERTES.filter((a) => !a.lu).length;

    const alertesFiltrees = MOCK_ALERTES.filter((a) => {
        if (filtre === "tous") return true;
        if (filtre === "non_lues") return !a.lu;
        return a.type === filtre;
    });

    const alerteDetail = selectedAlerte ? MOCK_ALERTES.find((a) => a.id === selectedAlerte) : null;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Bell className="w-8 h-8 text-destructive" /> Alertes Opérateurs
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Rappels de lots, avis de non-conformité et alertes régionales CEMAC.
                        {nonLues > 0 && <Badge variant="destructive" className="ml-2">{nonLues} non lue{nonLues > 1 ? "s" : ""}</Badge>}
                    </p>
                </div>
            </div>

            {/* Filtres rapides */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                    { key: "tous", label: `Toutes (${MOCK_ALERTES.length})` },
                    { key: "non_lues", label: `Non lues (${nonLues})` },
                    { key: "rappel_lot", label: "🔴 Rappels" },
                    { key: "non_conformite", label: "🟠 Non-conformité" },
                    { key: "cemac", label: "🔵 CEMAC" },
                ].map((f) => (
                    <Button key={f.key} variant={filtre === f.key ? "default" : "outline"} size="sm" onClick={() => setFiltre(f.key)} className="whitespace-nowrap">
                        {f.label}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* LISTE */}
                <div className={`${alerteDetail ? "lg:col-span-2" : "lg:col-span-5"} space-y-3`}>
                    {alertesFiltrees.map((alerte) => {
                        const config = getTypeConfig(alerte.type);
                        const Icon = config.icon;
                        return (
                            <Card key={alerte.id} onClick={() => setSelectedAlerte(alerte.id)} className={`cursor-pointer transition-all hover:shadow-md ${selectedAlerte === alerte.id ? "ring-2 ring-primary" : ""} ${!alerte.lu ? "border-l-4 border-l-destructive" : ""}`}>
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                        <Icon className={`w-5 h-5 ${config.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <Badge className={config.badgeClass + " text-xs"}>{config.label}</Badge>
                                            {!alerte.lu && <div className="w-2 h-2 rounded-full bg-destructive" />}
                                        </div>
                                        <h3 className={`font-semibold text-sm line-clamp-2 ${!alerte.lu ? "text-foreground" : "text-muted-foreground"}`}>{alerte.titre}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{alerte.date}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* DÉTAIL */}
                {alerteDetail && (
                    <div className="lg:col-span-3 animate-in slide-in-from-right-4 duration-300">
                        <Card className="shadow-md sticky top-4">
                            <CardHeader className="border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge className={getTypeConfig(alerteDetail.type).badgeClass}>{getTypeConfig(alerteDetail.type).label}</Badge>
                                        <CardTitle className="text-xl mt-3">{alerteDetail.titre}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">{alerteDetail.date}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedAlerte(null)}>✕</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <p className="text-muted-foreground leading-relaxed">{alerteDetail.message}</p>

                                {alerteDetail.actionRequise && (
                                    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                                        <h4 className="font-bold text-destructive mb-2 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" /> Action requise
                                        </h4>
                                        <p className="text-sm">{alerteDetail.actionRequise}</p>
                                        {(alerteDetail as any).delaiJours && (
                                            <p className="text-sm mt-2 font-bold text-destructive">⏰ Délai : {(alerteDetail as any).delaiJours} jours</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 pt-4 border-t">
                                    {!alerteDetail.accuseReception && alerteDetail.type === "rappel_lot" && (
                                        <Button className="w-full"><Eye className="w-4 h-4 mr-2" /> J&apos;accuse réception</Button>
                                    )}
                                    {alerteDetail.type === "non_conformite" && (
                                        <Button variant="outline" className="w-full"><UploadCloud className="w-4 h-4 mr-2" /> Soumettre ma preuve de conformité</Button>
                                    )}
                                    {alerteDetail.accuseReception && (
                                        <p className="text-sm text-success flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Accusé de réception envoyé</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
