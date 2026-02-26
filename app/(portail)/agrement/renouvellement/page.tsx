"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { StepWizard } from "@/components/shared/StepWizard";
import { PaymentFlow } from "@/components/shared/PaymentFlow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, CheckCircle2, Upload, FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

export default function RenouvellementPage() {
    const { operateur, firebaseUid } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });
    const creerDemande = useMutation(api.agrement.mutations.creerDemandeAgrement);
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [agrementCree, setAgrementCree] = useState<any>(null);

    if (!data || !operateur) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Chercher l'agrément actif à renouveler
    const agrementActif = data.agrements?.find((a: any) => a.etapeActuelle === "agree");
    const etab = data.etablissements?.[0];
    const categorie = etab?.categorie || "AS_CAT_2";

    const montantParCategorie: Record<string, number> = {
        AS_CAT_1: 300000, AS_CAT_2: 150000, AS_CAT_3: 60000, TRANSPORT: 30000,
    };
    const montant = montantParCategorie[categorie] || 150000;

    const steps = [
        { title: "Documents", subtitle: "PMS actualisé" },
        { title: "Paiement", subtitle: formatMoney(montant) },
        { title: "Confirmation", subtitle: "Récapitulatif" },
    ];

    const handleCreerEtSoumettre = async () => {
        if (!etab) return;
        const result = await creerDemande({
            firebaseUid,
            etablissementId: etab._id,
            type: "renouvellement",
            categorie: categorie as any,
        });
        setAgrementCree(result);
        setStep(1);
    };

    return (
        <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href="/agrement"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Link>
            </Button>

            <div>
                <h1 className="text-xl font-bold">🔄 Renouvellement d&apos;agrément</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Le renouvellement est plus simple ! Seul votre Plan de Maîtrise Sanitaire mis à jour est nécessaire.
                </p>
            </div>

            <StepWizard steps={steps} currentStep={step} />

            {/* Étape 1 - Documents */}
            {step === 0 && (
                <Card className="shadow-sm">
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h3 className="font-bold mb-1">Documents pour le renouvellement</h3>
                            <p className="text-sm text-muted-foreground">
                                Un seul document est nécessaire pour le renouvellement.
                            </p>
                        </div>

                        {agrementActif && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                <span className="text-green-700">
                                    Agrément actuel : <span className="font-mono font-bold">{agrementActif.certificat?.numero}</span>
                                </span>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                            <p className="font-medium">Plan de Maîtrise Sanitaire (PMS)</p>
                            <p className="text-xs text-muted-foreground mt-1">Version actualisée — PDF ou image</p>
                            <Button variant="outline" size="sm" className="mt-3 gap-2">
                                <FileText className="w-4 h-4" /> Choisir un fichier
                            </Button>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                            💡 Le PMS doit refléter vos pratiques actuelles. Si rien n&apos;a changé, renvoyez la même version.
                        </div>

                        <Button size="lg" className="w-full h-12" onClick={handleCreerEtSoumettre}>
                            Continuer → Paiement ({formatMoney(montant)})
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Étape 2 - Paiement */}
            {step === 1 && (
                <PaymentFlow
                    montant={montant}
                    description={`Renouvellement agrément ${categorie}`}
                    onSuccess={() => setStep(2)}
                    onCancel={() => setStep(0)}
                />
            )}

            {/* Étape 3 - Confirmation */}
            {step === 2 && (
                <Card className="shadow-sm">
                    <CardContent className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold">Demande de renouvellement enregistrée !</h2>
                        {agrementCree && (
                            <p className="font-mono text-lg text-primary font-bold">
                                {agrementCree.numeroDossier}
                            </p>
                        )}
                        <div className="bg-muted rounded-lg p-3 text-sm text-left space-y-1.5">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <span className="font-medium">Renouvellement</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Catégorie</span>
                                <span className="font-medium">{categorie}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Montant</span>
                                <span className="font-bold">{formatMoney(montant)}</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Vous recevrez un SMS à chaque avancée du dossier.
                        </p>
                        <Button asChild size="lg" className="w-full gap-2">
                            <Link href="/agrement">Retour à mes agréments</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
