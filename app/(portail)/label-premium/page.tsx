"use client";

import { useState } from "react";
import {
    Award,
    Star,
    CheckCircle2,
    ShieldCheck,
    Loader2,
    Sparkles,
    Download,
    QrCode,
    TrendingUp,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LabelPremiumPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const score: number = 4; // Change to 5 to test eligible state
    const isEligible = score === 5;

    const handlePay = () => {
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); setIsPaid(true); }, 2500);
    };

    if (isPaid) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                    <Award className="w-14 h-14" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Label Premium Activé ! 🎉</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Votre établissement porte désormais le Label « AGASA Certifié Premium ».
                    Ce badge est visible par tous les citoyens sur l'application AGASA-Citoyen.
                </p>
                <div className="flex gap-3">
                    <Button size="lg"><Download className="w-4 h-4 mr-2" /> Badge numérique HD</Button>
                    <Button variant="outline" size="lg"><QrCode className="w-4 h-4 mr-2" /> QR Code</Button>
                    <Button variant="outline" size="lg"><Download className="w-4 h-4 mr-2" /> Certificat PDF</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-500" /> Label AGASA Certifié Premium
                </h1>
                <p className="text-muted-foreground mt-1">
                    Le label d'excellence pour les établissements les mieux notés du Gabon.
                </p>
            </div>

            {!isEligible ? (
                /* NON ELIGIBLE */
                <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                    <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                            <Award className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Pas encore éligible</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            Pour obtenir le Label Premium, votre établissement doit atteindre le <strong>score Smiley maximum de 5/5</strong> et disposer d'un <strong>agrément sanitaire actif</strong>.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-lg">
                            <span>Votre score actuel :</span>
                            <span className="text-3xl">😊</span>
                            <span className="font-bold text-xl text-primary">{score}/5</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Il vous manque <strong>{5 - score} point{5 - score > 1 ? "s" : ""}</strong>. Continuez à améliorer vos pratiques d'hygiène pour atteindre le niveau maximum.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                /* ELIGIBLE */
                <>
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 border-2 shadow-lg">
                        <CardContent className="p-8 text-center">
                            <div className="inline-block">
                                <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                            </div>
                            <h2 className="text-2xl font-bold text-amber-800 mb-2">
                                🏆 Félicitations ! Vous êtes éligible au Label Premium
                            </h2>
                            <p className="text-amber-700 max-w-lg mx-auto">
                                Votre établissement a atteint le score Smiley maximum (5/5).
                                Vous pouvez maintenant obtenir le label d'excellence AGASA.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: ShieldCheck, title: "Badge numérique vérifiable", desc: "Un badge officiel à afficher dans votre établissement, scannable par QR code." },
                            { icon: Eye, title: "Visibilité accrue", desc: "Votre établissement est mis en avant sur AGASA-Citoyen avec le label doré." },
                            { icon: TrendingUp, title: "Avantage concurrentiel", desc: "Démarquez-vous de vos concurrents avec la certification Premium." },
                            { icon: Star, title: "Reconnaissance officielle", desc: "Le plus haut niveau de conformité sanitaire au Gabon." },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <Card key={i} className="shadow-sm">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                                            <Icon className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <Card className="border-2 border-amber-300 shadow-md">
                        <CardContent className="p-8 text-center">
                            <p className="text-3xl font-extrabold text-primary mb-2">500 000 FCFA / an</p>
                            <p className="text-sm text-muted-foreground mb-6">Renouvellement annuel. Annulé si le score descend en dessous de 5.</p>
                            <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-lg bg-amber-500 hover:bg-amber-600 text-white" onClick={handlePay} disabled={isLoading}>
                                {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Traitement en cours...</> : <><Award className="w-5 h-5 mr-2" /> Obtenir le Label Premium</>}
                            </Button>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
