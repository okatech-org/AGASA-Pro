"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { ScoreSmiley } from "@/components/shared/ScoreSmiley";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ClipboardList, CreditCard, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";

function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
function formatDateShort(ts: number) {
    return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
function formatMoney(n: number) {
    return n.toLocaleString("fr-FR") + " FCFA";
}

export default function MonDossierPage() {
    const { operateur, firebaseUid } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });
    const [activeTab, setActiveTab] = useState<"inspections" | "paiements" | "amendes">("inspections");

    if (!data || !operateur) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isIndustriel = operateur.typeOperateur === "industriel";
    const tabs = isIndustriel
        ? ["inspections", "paiements", "amendes", "importations", "analyses", "formations"] as const
        : ["inspections", "paiements", "amendes"] as const;

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* En-tête */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/tableau-de-bord"><ArrowLeft className="w-5 h-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">Mon Dossier</h1>
                    <p className="text-sm text-muted-foreground">{operateur.raisonSociale}</p>
                </div>
            </div>

            {/* Score Smiley proéminent */}
            <ScoreSmiley
                score={data.scoreSmiley}
                variant="large"
                showHelp={true}
                showProgress={true}
            />

            {/* Graphique d'évolution du score (placeholder) */}
            {data.inspections.length >= 2 && (
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="w-4 h-4" />
                            Évolution du score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="flex items-end gap-2 h-16">
                            {data.inspections.slice(0, 5).reverse().map((insp: any, i: number) => {
                                const score = insp.scoreAttribue || 0;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                        <div
                                            className="w-full rounded-t-md transition-all"
                                            style={{
                                                height: `${(score / 5) * 100}%`,
                                                minHeight: "8px",
                                                backgroundColor: score >= 4 ? "#27AE60" : score >= 3 ? "#F39C12" : "#E74C3C",
                                            }}
                                        />
                                        <span className="text-[9px] text-muted-foreground">{score}/5</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Onglets */}
            <div className="flex gap-1 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1">
                {tabs.map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab(tab as any)}
                        className="shrink-0 capitalize"
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            {/* Contenu des onglets */}
            {activeTab === "inspections" && (
                <div className="space-y-3">
                    {data.inspections.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-6 text-center text-muted-foreground">
                                <ClipboardList className="w-10 h-10 mx-auto mb-3 text-muted" />
                                <p className="font-medium">Aucune inspection</p>
                                <p className="text-sm">Vos inspections apparaîtront ici après la première visite de l&apos;AGASA.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        data.inspections.map((insp: any) => (
                            <Card key={insp._id} className="shadow-sm">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-semibold">{formatDate(insp.dateInspection)}</span>
                                        </div>
                                        <Badge className={`text-xs ${insp.resultat === "conforme" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {insp.resultat === "conforme" ? "✅ Conforme" : "❌ Non conforme"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Score attribué :</span>
                                        <span className="font-bold" style={{
                                            color: (insp.scoreAttribue || 0) >= 4 ? "#27AE60" :
                                                (insp.scoreAttribue || 0) >= 3 ? "#F39C12" : "#E74C3C"
                                        }}>
                                            {insp.scoreAttribue}/5
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground capitalize">{insp.typeInspection.replace(/_/g, " ")}</p>
                                    {insp.observationsResume && (
                                        <p className="text-sm bg-muted/50 rounded-lg p-3">{insp.observationsResume}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === "paiements" && (
                <div className="space-y-3">
                    {data.paiements.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-6 text-center text-muted-foreground">
                                <CreditCard className="w-10 h-10 mx-auto mb-3 text-muted" />
                                <p className="font-medium">Aucun paiement</p>
                            </CardContent>
                        </Card>
                    ) : (
                        data.paiements.map((p: any) => (
                            <Card key={p._id} className="shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold font-mono">{p.reference}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{p.type.replace(/_/g, " ")}</p>
                                        <p className="text-xs text-muted-foreground">{formatDate(p.dateCreation)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{formatMoney(p.montant)}</p>
                                        <Badge className={`text-xs ${p.statut === "confirme" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {p.statut === "confirme" ? "✅ Confirmé" : p.statut === "en_attente" ? "⏳ En attente" : p.statut}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === "amendes" && (
                <div className="space-y-3">
                    {data.amendes.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-6 text-center text-green-600">
                                <div className="text-3xl mb-2">✅</div>
                                <p className="font-medium">Aucune amende</p>
                                <p className="text-sm text-muted-foreground">Vous êtes en règle. Continuez ainsi !</p>
                            </CardContent>
                        </Card>
                    ) : (
                        data.amendes.map((a: any) => (
                            <Card key={a._id} className="shadow-sm border-red-200">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <div>
                                            <p className="text-sm font-semibold">{a.motif}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(a.dateCreation)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-red-600">{formatMoney(a.montant)}</p>
                                        <Badge className="text-xs bg-red-100 text-red-700">{a.statut}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
