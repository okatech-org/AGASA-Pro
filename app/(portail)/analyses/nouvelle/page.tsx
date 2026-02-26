"use client";

import { useState, Suspense } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { StepWizard } from "@/components/shared/StepWizard";
import { PaymentFlow } from "@/components/shared/PaymentFlow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Zap, FlaskConical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

const MATRICES = [
    { value: "viande" as const, label: "🥩 Viande" },
    { value: "poisson" as const, label: "🐟 Poisson" },
    { value: "cereale" as const, label: "🌾 Céréale" },
    { value: "fruit_legume" as const, label: "🥬 Fruit/Légume" },
    { value: "produit_laitier" as const, label: "🧀 Produit laitier" },
    { value: "eau" as const, label: "💧 Eau" },
    { value: "autre" as const, label: "📦 Autre" },
];

export default function NouvelleAnalysePage() {
    const { firebaseUid } = useDemoUser();
    const commander = useMutation(api.analyses.mutations.commanderAnalyses);
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [matrice, setMatrice] = useState<typeof MATRICES[number]["value"]>("viande");
    const [description, setDescription] = useState("");
    const [express, setExpress] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Mock paramètres sélectionnés
    const parametres = [
        { parametreCode: "MICRO-001", parametreNom: "Flore mésophile aérobie", tarif: 25000 },
        { parametreCode: "MICRO-002", parametreNom: "Coliformes totaux", tarif: 25000 },
        { parametreCode: "MICRO-003", parametreNom: "Salmonella spp.", tarif: 35000 },
    ];
    const totalParametres = parametres.reduce((s, p) => s + p.tarif, 0);
    const fraisExpress = express ? 200000 : 0;
    const montantTotal = totalParametres + fraisExpress;

    const steps = [
        { title: "Échantillon", subtitle: "Description" },
        { title: "Paiement", subtitle: formatMoney(montantTotal) },
        { title: "Confirmation", subtitle: "Terminé" },
    ];

    const handleCommander = async () => {
        const res = await commander({
            firebaseUid,
            matrice,
            echantillonDescription: description,
            parametresSelectionnes: parametres,
            express,
        });
        setResult(res);
        setStep(1);
    };

    return (
        <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href="/analyses"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Link>
            </Button>

            <div>
                <h1 className="text-xl font-bold">🔬 Commander une analyse</h1>
                <p className="text-sm text-muted-foreground mt-1">Décrivez votre échantillon et choisissez les paramètres.</p>
            </div>

            <StepWizard steps={steps} currentStep={step} />

            {step === 0 && (
                <Card className="shadow-sm">
                    <CardContent className="p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="font-semibold">Type de matrice</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {MATRICES.map((m) => (
                                    <div key={m.value} onClick={() => setMatrice(m.value)}
                                        className={`border-2 rounded-xl p-3 cursor-pointer text-center text-sm font-medium transition-all ${matrice === m.value ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                                        {m.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc" className="font-semibold">Description de l&apos;échantillon</Label>
                            <Textarea id="desc" placeholder="Ex: Filets de poisson congelé, lot #2026-03-A, provenance Sénégal" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold">Paramètres sélectionnés</Label>
                            <div className="space-y-1">
                                {parametres.map((p) => (
                                    <div key={p.parametreCode} className="flex justify-between text-sm p-2 rounded bg-muted/50">
                                        <span>{p.parametreNom}</span>
                                        <span className="font-semibold">{formatMoney(p.tarif)}</span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" size="sm" asChild className="w-full mt-2">
                                <Link href="/analyses/catalogue">📋 Modifier depuis le catalogue</Link>
                            </Button>
                        </div>

                        <div onClick={() => setExpress(!express)}
                            className={`border-2 rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${express ? "border-orange-400 bg-orange-50" : "hover:bg-muted"}`}>
                            <div className="flex items-center gap-2">
                                <Zap className={`w-5 h-5 ${express ? "text-orange-500" : "text-muted-foreground"}`} />
                                <div>
                                    <p className="font-medium text-sm">Analyse Express (24h)</p>
                                    <p className="text-xs text-muted-foreground">+200 000 FCFA</p>
                                </div>
                            </div>
                            <Badge className={express ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}>
                                {express ? "Activé" : "Standard"}
                            </Badge>
                        </div>

                        <div className="bg-muted rounded-lg p-3 flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-extrabold text-primary">{formatMoney(montantTotal)}</span>
                        </div>

                        <Button size="lg" className="w-full h-12" onClick={handleCommander} disabled={!description}>
                            Continuer → Paiement
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === 1 && result && (
                <PaymentFlow montant={montantTotal} description={`Analyses ${result.numeroCommande}`} onSuccess={() => setStep(2)} onCancel={() => setStep(0)} />
            )}

            {step === 2 && result && (
                <Card className="shadow-sm">
                    <CardContent className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold">Commande enregistrée !</h2>
                        <p className="font-mono text-lg text-primary font-bold">{result.numeroCommande}</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 text-left">
                            <p className="font-semibold mb-1">📍 Prochaine étape</p>
                            <p>Déposez votre échantillon au Laboratoire d&apos;Analyses de l&apos;AGASA (LAA), Libreville. Présentez le numéro de commande ci-dessus.</p>
                        </div>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/analyses">Retour à mes analyses</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
