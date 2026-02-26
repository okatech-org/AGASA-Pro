"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

interface PaymentFlowProps {
    montant: number;
    description: string;
    onSuccess: (transactionRef: string) => void;
    onCancel?: () => void;
    disabled?: boolean;
}

export function PaymentFlow({ montant, description, onSuccess, onCancel, disabled }: PaymentFlowProps) {
    const [methode, setMethode] = useState<"airtel" | "moov" | "virement">("airtel");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handlePaiement = () => {
        setStatus("loading");
        // Simulation USSD push
        setTimeout(() => {
            setStatus("success");
            const ref = `TRX-${Date.now().toString(36).toUpperCase()}`;
            setTimeout(() => onSuccess(ref), 2000);
        }, 3000);
    };

    if (status === "success") {
        return (
            <div className="text-center py-8 animate-in zoom-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Paiement confirmé !</h3>
                <p className="text-muted-foreground">Redirection en cours...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <ShieldCheck className="w-10 h-10 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-bold">Paiement sécurisé</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="bg-muted/30 border-b pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Total à payer</CardTitle>
                        <span className="text-xl font-extrabold text-primary">
                            {montant.toLocaleString("fr-FR")} FCFA
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-5">
                    {/* Méthode de paiement */}
                    <div className="space-y-3">
                        <Label className="font-semibold">Mode de paiement</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => setMethode("airtel")}
                                className={`border-2 rounded-xl p-3 cursor-pointer flex flex-col items-center justify-center transition-all h-20 font-bold text-sm ${methode === "airtel" ? "border-red-500 bg-red-50 text-red-600 shadow" : "hover:bg-muted text-muted-foreground"}`}
                            >
                                Airtel Money
                            </div>
                            <div
                                onClick={() => setMethode("moov")}
                                className={`border-2 rounded-xl p-3 cursor-pointer flex flex-col items-center justify-center transition-all h-20 font-bold text-sm ${methode === "moov" ? "border-blue-500 bg-blue-50 text-blue-600 shadow" : "hover:bg-muted text-muted-foreground"}`}
                            >
                                Moov Africa
                            </div>
                        </div>
                        <div
                            onClick={() => setMethode("virement")}
                            className={`border-2 rounded-xl p-3 cursor-pointer flex items-center justify-center transition-all h-12 font-bold text-sm ${methode === "virement" ? "border-primary bg-primary/10 text-primary shadow" : "hover:bg-muted text-muted-foreground"}`}
                        >
                            Virement bancaire
                        </div>
                    </div>

                    {methode !== "virement" ? (
                        <div className="space-y-4 pt-3 border-t animate-in fade-in">
                            <div className="space-y-2">
                                <Label htmlFor="phone-pf">Numéro de téléphone</Label>
                                <div className="flex gap-2">
                                    <div className="bg-muted px-3 py-2 flex items-center rounded-md border font-mono text-sm">+241</div>
                                    <Input
                                        id="phone-pf"
                                        placeholder={`${methode === "airtel" ? "077" : "066"} XX XX XX`}
                                        type="tel"
                                        className="font-mono"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        maxLength={9}
                                    />
                                </div>
                            </div>

                            <div className="bg-primary/5 p-3 rounded-lg text-sm text-primary">
                                💡 Un écran USSD va s&apos;afficher sur votre téléphone. Validez avec votre code secret.
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-12 font-bold"
                                onClick={handlePaiement}
                                disabled={status === "loading" || phone.length < 8 || disabled}
                            >
                                {status === "loading" ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> En attente de validation...</>
                                ) : (
                                    `Payer ${montant.toLocaleString("fr-FR")} FCFA`
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-3 border-t animate-in fade-in">
                            <p className="text-sm text-muted-foreground">Effectuez le virement sur le compte ci-dessous. Traitement sous 24-48h ouvrables.</p>
                            <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                                <div className="flex justify-between"><span className="text-muted-foreground">Banque</span><span>UGB Gabon</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Bénéficiaire</span><span>AGASA Recettes</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">IBAN</span><span>GA51 1002 0000 1234 5678 90</span></div>
                            </div>
                            <Button variant="outline" className="w-full" disabled>
                                J&apos;ai effectué le virement <span className="text-xs ml-1 opacity-60">(Bientôt)</span>
                            </Button>
                        </div>
                    )}

                    {onCancel && (
                        <Button variant="ghost" className="w-full" onClick={onCancel}>
                            Annuler
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
