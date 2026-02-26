"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image"; // Pour les logos Airtem/Moov si disponibles, on simule ici
import Link from "next/link";

export default function PaiementDemandePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <PaiementDemandeContent />
        </Suspense>
    );
}

function PaiementDemandeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dossierId = searchParams.get("id") || "AGR-2026-XXXX";

    const [methode, setMethode] = useState<"airtel" | "moov" | "virement">("airtel");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handlePaiement = () => {
        setStatus("loading");

        // Simulation d'attente USSD Push
        setTimeout(() => {
            setStatus("success");

            // Redirection vers le dossier après succès
            setTimeout(() => {
                router.push(`/agrement/${dossierId}`);
            }, 3000);
        }, 4000);
    };

    if (status === "success") {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Paiement Confirmé !</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Votre redevance d'agrément a été réglée avec succès.
                </p>
                <div className="bg-muted p-6 rounded-xl text-left w-full max-w-sm border shadow-sm mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Reçu N°</span>
                        <span className="font-mono font-bold">RCU-109283</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Demande N°</span>
                        <span className="font-mono font-bold">{dossierId}</span>
                    </div>
                    <div className="flex justify-between mb-2 border-t pt-2 mt-2">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-bold">{new Date().toLocaleDateString("fr-FR")}</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground italic">Redirection automatique vers votre dossier...</p>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-8 max-w-2xl mx-auto">
            <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground">
                <Link href="/agrement">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour ou Annuler
                </Link>
            </Button>

            <div className="text-center mb-8">
                <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-4" />
                <h1 className="text-3xl font-bold tracking-tight">Paiement Sécurisé</h1>
                <p className="text-muted-foreground mt-2">Dossier de demande : <span className="font-mono font-bold">{dossierId}</span></p>
            </div>

            <Card className="shadow-lg border-border">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="flex justify-between items-center text-xl">
                        <span>Redevance d'Agrément Sanitaire</span>
                        <span className="text-2xl font-extrabold text-primary">250 000 FCFA</span>
                    </CardTitle>
                    <CardDescription>
                        Frais de traitement du dossier, d'inspection et de délivrance du certificat (Valable 1 an).
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 space-y-8">

                    <div className="space-y-4">
                        <Label className="text-lg font-bold">Choisissez votre moyen de paiement</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setMethode("airtel")}
                                className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center transition-all h-24 font-bold ${methode === "airtel" ? "border-red-600 bg-red-50 text-red-600 shadow-md" : "hover:bg-muted text-muted-foreground"}`}
                            >
                                <span className={methode === "airtel" ? "text-xl" : ""}>Airtel Money</span>
                            </div>
                            <div
                                onClick={() => setMethode("moov")}
                                className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center transition-all h-24 font-bold ${methode === "moov" ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md" : "hover:bg-muted text-muted-foreground"}`}
                            >
                                <span className={methode === "moov" ? "text-xl" : ""}>Moov Africa</span>
                            </div>
                        </div>
                        <div
                            onClick={() => setMethode("virement")}
                            className={`border-2 rounded-xl p-4 cursor-pointer flex items-center justify-center transition-all h-16 font-bold ${methode === "virement" ? "border-primary bg-primary/10 text-primary shadow-md" : "hover:bg-muted text-muted-foreground"}`}
                        >
                            Virement Bancaire Classique
                        </div>
                    </div>

                    {methode !== "virement" ? (
                        <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Numéro de téléphone</Label>
                                <div className="flex gap-2">
                                    <div className="bg-muted px-4 py-2 flex items-center justify-center rounded-md border font-mono">
                                        +241
                                    </div>
                                    <Input
                                        id="phone"
                                        placeholder={`Ex: ${methode === 'airtel' ? '077' : '066'} 12 34 56`}
                                        type="tel"
                                        className="font-mono text-lg"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        maxLength={9}
                                    />
                                </div>
                            </div>

                            <div className="bg-primary/5 p-4 rounded-lg text-sm text-primary mb-6">
                                💡 Un écran de confirmation USSD va s'afficher sur votre téléphone. Composez votre code secret {methode === "airtel" ? "*150*..." : "*555*..."} pour valider la transaction.
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-14 text-lg font-bold shadow-lg"
                                onClick={handlePaiement}
                                disabled={status === "loading" || phone.length < 8}
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        En attente de validation sur votre téléphone...
                                    </>
                                ) : (
                                    `Payer 250 000 FCFA`
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-sm text-muted-foreground">
                                Veuillez effectuer le virement sur le compte de l'AGASA. Le traitement prendra 24h à 48h ouvrables.
                            </p>
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-muted-foreground">Banque</span><span>UGB Gabon</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Bénéficiaire</span><span>AGASA Recettes</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">IBAN</span><span>GA51 1002 0000 1234 5678 90</span></div>
                                <div className="flex justify-between text-primary font-bold"><span className="text-muted-foreground font-normal">Motif (A copier impérativement)</span><span>{dossierId}</span></div>
                            </div>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full h-14 text-lg font-bold mt-4"
                                disabled
                            >
                                J'ai effectué le virement
                                <br /><span className="text-xs font-normal ml-2 opacity-70">(Bientôt disponible)</span>
                            </Button>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}
