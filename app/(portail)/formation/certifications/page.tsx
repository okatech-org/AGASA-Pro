"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft, Award, Download, GraduationCap } from "lucide-react";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }

export default function CertificationsPage() {
    const { operateur, firebaseUid } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });

    if (!data || !operateur) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const certifiees = (data.inscriptionsFormation || []).filter((i: any) => i.statut === "certifie");

    return (
        <div className="space-y-6 px-4 md:px-0">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/formation"><ArrowLeft className="w-5 h-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">🏆 Mes Certifications</h1>
                    <p className="text-sm text-muted-foreground">{certifiees.length} certification(s) obtenue(s)</p>
                </div>
            </div>

            {certifiees.length === 0 ? (
                <Card className="shadow-sm">
                    <CardContent className="p-8 text-center">
                        <GraduationCap className="w-12 h-12 mx-auto mb-3 text-muted" />
                        <p className="font-medium">Aucune certification</p>
                        <p className="text-sm text-muted-foreground mt-1">Complétez une formation et réussissez le quiz pour obtenir votre certificat.</p>
                        <Button asChild className="mt-4" size="sm">
                            <Link href="/formation">Voir les formations</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {certifiees.map((insc: any) => (
                        <Card key={insc._id} className="shadow-sm border-green-200 bg-green-50/30">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold">{insc.moduleFormation?.titre || "Formation"}</span>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700">Certifié ✅</Badge>
                                </div>

                                {insc.certificat && (
                                    <div className="bg-white rounded-lg border p-3 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">N° certificat</span>
                                            <span className="font-mono font-bold">{insc.certificat.numero}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Obtenu le</span>
                                            <span>{formatDate(insc.certificat.dateObtention)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Valide jusqu&apos;au</span>
                                            <span className="font-semibold">{formatDate(insc.certificat.dateExpiration)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Score quiz</span>
                                            <span className="font-bold text-green-600">{insc.scoreQuiz}/100</span>
                                        </div>
                                    </div>
                                )}

                                <Button variant="outline" size="sm" className="w-full gap-2">
                                    <Download className="w-4 h-4" /> Télécharger le certificat PDF
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
