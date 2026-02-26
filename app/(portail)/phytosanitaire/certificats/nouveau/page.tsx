"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { StepWizard } from "@/components/shared/StepWizard";
import { PaymentFlow } from "@/components/shared/PaymentFlow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Leaf, Package, Plane } from "lucide-react";
import Link from "next/link";

function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

export default function NouveauCertificatPhytoPage() {
    const { firebaseUid } = useDemoUser();
    const creerCert = useMutation(api.phytosanitaire.mutations.creerCertificat);
    const [step, setStep] = useState(0);
    const [type, setType] = useState<"importation" | "exportation">("importation");
    const [produit, setProduit] = useState("");
    const [pays, setPays] = useState("");
    const [quantite, setQuantite] = useState("");
    const [unite, setUnite] = useState("kg");
    const [lot, setLot] = useState("");
    const [result, setResult] = useState<any>(null);

    const montant = type === "importation" ? 75000 : 50000;
    const steps = [
        { title: "Produit", subtitle: "Type et détails" },
        { title: "Paiement", subtitle: formatMoney(montant) },
        { title: "Confirmation", subtitle: "Terminé" },
    ];

    const handleCreer = async () => {
        const res = await creerCert({
            firebaseUid,
            type,
            produit,
            ...(type === "importation" ? { paysOrigine: pays } : { paysDestination: pays }),
            quantite: Number(quantite),
            unite,
            lotNumero: lot,
        });
        setResult(res);
        setStep(1);
    };

    return (
        <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href="/phytosanitaire"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Link>
            </Button>

            <div>
                <h1 className="text-xl font-bold">🌿 Nouveau certificat phytosanitaire</h1>
            </div>

            <StepWizard steps={steps} currentStep={step} />

            {step === 0 && (
                <Card className="shadow-sm">
                    <CardContent className="p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="font-semibold">Type de certificat</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div onClick={() => setType("importation")}
                                    className={`border-2 rounded-xl p-4 cursor-pointer text-center transition-all ${type === "importation" ? "border-primary bg-primary/10" : "hover:bg-muted"}`}>
                                    <Package className="w-6 h-6 mx-auto mb-1" />
                                    <p className="font-medium text-sm">🌿📦 J&apos;importe</p>
                                    <p className="text-xs text-muted-foreground">des intrants au Gabon</p>
                                    <p className="text-xs font-bold mt-1">{formatMoney(75000)}</p>
                                </div>
                                <div onClick={() => setType("exportation")}
                                    className={`border-2 rounded-xl p-4 cursor-pointer text-center transition-all ${type === "exportation" ? "border-primary bg-primary/10" : "hover:bg-muted"}`}>
                                    <Plane className="w-6 h-6 mx-auto mb-1" />
                                    <p className="font-medium text-sm">🌿✈️ J&apos;exporte</p>
                                    <p className="text-xs text-muted-foreground">des produits du Gabon</p>
                                    <p className="text-xs font-bold mt-1">{formatMoney(50000)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="produit" className="font-semibold">Produit</Label>
                            <Input id="produit" placeholder="Ex: Pesticide Roundup 360" value={produit} onChange={(e) => setProduit(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pays" className="font-semibold">{type === "importation" ? "Pays d'origine" : "Pays de destination"}</Label>
                            <Input id="pays" placeholder="Ex: Cameroun" value={pays} onChange={(e) => setPays(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="quantite" className="font-semibold">Quantité</Label>
                                <Input id="quantite" type="number" placeholder="500" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unite" className="font-semibold">Unité</Label>
                                <select id="unite" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={unite} onChange={(e) => setUnite(e.target.value)}>
                                    <option value="kg">Kilogrammes (kg)</option>
                                    <option value="tonnes">Tonnes</option>
                                    <option value="litres">Litres</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lot" className="font-semibold">Numéro de lot</Label>
                            <Input id="lot" placeholder="LOT-2026-XXX" value={lot} onChange={(e) => setLot(e.target.value)} />
                        </div>

                        <Button size="lg" className="w-full h-12" onClick={handleCreer} disabled={!produit || !pays || !quantite || !lot}>
                            Continuer → Paiement ({formatMoney(montant)})
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === 1 && result && (
                <PaymentFlow montant={montant} description={`Certificat phyto ${result.numeroCertificat}`} onSuccess={() => setStep(2)} onCancel={() => setStep(0)} />
            )}

            {step === 2 && result && (
                <Card className="shadow-sm">
                    <CardContent className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold">Demande enregistrée !</h2>
                        <p className="font-mono text-lg text-primary font-bold">{result.numeroCertificat}</p>
                        <p className="text-sm text-muted-foreground">Votre demande sera traitée dans un délai de 5 à 10 jours ouvrés.</p>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/phytosanitaire">Retour au module phyto</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
