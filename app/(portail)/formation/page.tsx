"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
    GraduationCap, PlayCircle, Award, Clock, CheckCircle2, Lock,
    ChevronRight, Download, Star, ArrowLeft,
} from "lucide-react";
import { useState } from "react";

function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

function getNiveauBadge(niveau: string) {
    const c: Record<string, { label: string; className: string }> = {
        debutant: { label: "🟢 Débutant", className: "bg-green-100 text-green-700" },
        intermediaire: { label: "🟡 Intermédiaire", className: "bg-amber-100 text-amber-700" },
        avance: { label: "🔴 Avancé", className: "bg-red-100 text-red-700" },
    };
    const s = c[niveau] || { label: niveau, className: "bg-gray-100 text-gray-600" };
    return <Badge className={`${s.className} hover:${s.className}`}>{s.label}</Badge>;
}

export default function FormationPage() {
    const { operateur, firebaseUid } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });
    const [tab, setTab] = useState<"mes_formations" | "catalogue">("mes_formations");

    if (!data || !operateur) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const inscriptions = data.inscriptionsFormation || [];
    const modulesFormation = data.modulesFormation || [];

    const enCours = inscriptions.filter((i: any) => i.statut === "en_cours").length;
    const certifiees = inscriptions.filter((i: any) => i.statut === "certifie").length;

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* En-tête */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/tableau-de-bord"><ArrowLeft className="w-5 h-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">🎓 Formation AGASA</h1>
                    <p className="text-sm text-muted-foreground">E-learning en sécurité alimentaire</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-amber-600">{enCours}</div>
                        <p className="text-[10px] text-muted-foreground">En cours</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-green-200 bg-green-50/50">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{certifiees}</div>
                        <p className="text-[10px] text-muted-foreground">Certifiées</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold">{modulesFormation.length}</div>
                        <p className="text-[10px] text-muted-foreground">Modules dispo</p>
                    </CardContent>
                </Card>
            </div>

            {/* Onglets */}
            <div className="flex gap-2">
                <Button variant={tab === "mes_formations" ? "default" : "outline"} size="sm" onClick={() => setTab("mes_formations")} className="gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Mes formations
                </Button>
                <Button variant={tab === "catalogue" ? "default" : "outline"} size="sm" onClick={() => setTab("catalogue")} className="gap-1.5">
                    <Star className="w-3.5 h-3.5" />
                    Catalogue
                </Button>
            </div>

            {/* Mes formations */}
            {tab === "mes_formations" && (
                <div className="space-y-3">
                    {inscriptions.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-8 text-center">
                                <GraduationCap className="w-12 h-12 mx-auto mb-3 text-muted" />
                                <p className="font-medium">Aucune formation en cours</p>
                                <p className="text-sm text-muted-foreground mt-1">Parcourez le catalogue pour vous inscrire.</p>
                                <Button onClick={() => setTab("catalogue")} className="mt-4" size="sm">Voir le catalogue</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        inscriptions.map((insc: any) => {
                            const module = insc.moduleFormation;
                            const isCertified = insc.statut === "certifie";

                            return (
                                <Card key={insc._id} className={`shadow-sm ${isCertified ? "border-green-200" : ""}`}>
                                    <CardContent className="p-4 space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm">{module?.titre || "Module"}</span>
                                            {isCertified ? (
                                                <Badge className="bg-green-100 text-green-700 gap-1">
                                                    <Award className="w-3 h-3" />
                                                    Certifié
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-amber-100 text-amber-700 gap-1">
                                                    <PlayCircle className="w-3 h-3" />
                                                    En cours
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Progression */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Progression</span>
                                                <span className="font-semibold text-foreground">{insc.progression}%</span>
                                            </div>
                                            <Progress value={insc.progression} className="h-2" />
                                        </div>

                                        {/* Quiz / Score */}
                                        {insc.scoreQuiz != null && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">Score quiz :</span>
                                                <span className={`font-bold ${insc.scoreQuiz >= 70 ? "text-green-600" : "text-red-600"}`}>
                                                    {insc.scoreQuiz}/100
                                                </span>
                                            </div>
                                        )}

                                        {/* Certificat */}
                                        {insc.certificat && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-green-600" />
                                                    <span className="text-xs font-medium text-green-700">
                                                        Certificat {insc.certificat.numero}
                                                    </span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                                    <Download className="w-3.5 h-3.5" />
                                                    PDF
                                                </Button>
                                            </div>
                                        )}

                                        {/* CTA continuer */}
                                        {!isCertified && (
                                            <Button asChild variant="outline" size="sm" className="w-full gap-2">
                                                <Link href={`/formation/${insc.moduleFormationId}`}>
                                                    <PlayCircle className="w-4 h-4" />
                                                    Continuer la formation
                                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                                </Link>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}

            {/* Catalogue */}
            {tab === "catalogue" && (
                <div className="space-y-3">
                    {modulesFormation.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-8 text-center">
                                <Star className="w-12 h-12 mx-auto mb-3 text-muted" />
                                <p className="font-medium">Catalogue indisponible</p>
                            </CardContent>
                        </Card>
                    ) : (
                        modulesFormation.map((mod: any) => {
                            const isInscrit = inscriptions.some((i: any) => i.moduleFormationId === mod._id);

                            return (
                                <Card key={mod._id} className="shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{mod.titre}</span>
                                            {getNiveauBadge(mod.niveau)}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{mod.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {mod.dureeEstimee ? `${Math.floor(mod.dureeEstimee / 60)}h${mod.dureeEstimee % 60 ? (mod.dureeEstimee % 60) + "min" : ""}` : "—"}</span>
                                            <span className="flex items-center gap-1">{mod.contenu?.length || 0} modules</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <span className="font-bold text-primary">{formatMoney(mod.tarif)}</span>
                                            {isInscrit ? (
                                                <Badge className="bg-green-100 text-green-700">Inscrit</Badge>
                                            ) : (
                                                <Button size="sm" className="gap-1.5">
                                                    <GraduationCap className="w-4 h-4" />
                                                    S&apos;inscrire
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
