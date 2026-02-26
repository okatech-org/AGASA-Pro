"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { StepWizard } from "@/components/shared/StepWizard";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, CheckCircle2, ChevronLeft, ChevronRight, Calculator, UploadCloud, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { HelpTooltip } from "@/components/shared/HelpTooltip";

export default function NouvelleDemandePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Simulation de données (à remplacer par React Hook Form + Zod)
    const [formData, setFormData] = useState({
        typeDemande: "premiere_demande",
        etablissementExistant: "aucun",
        nomEtablissement: "",
        categorie: "CAT2",
        tauxApplicable: 250000,
        // Étape 2: Fichiers
        rccmFile: null,
        pieceIdentiteFile: null,
        planLocauxFile: null,
        // Étape 3: Déclaration
        declarationCertifiee: false,
    });

    const STEPS = [
        { id: 1, title: "Choix de l'Établissement" },
        { id: 2, title: "Pièces Jointes" },
        { id: 3, title: "Vérification & Taxe" },
    ];

    const handleSubmit = async () => {
        setIsLoading(true);
        // Simulation d'appel API
        setTimeout(() => {
            setIsLoading(false);
            // Redirection vers une page de succès ou le paiement
            router.push("/agrement/paiement-demande?id=AGR-2026-9999");
        }, 1500);
    };

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground">
                    <Link href="/agrement">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Retour aux agréments
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Nouvelle demande d'Agrément</h1>
                <p className="text-muted-foreground mt-2">
                    Complétez ce formulaire pour obtenir ou renouveler votre agrément sanitaire.
                </p>
            </div>

            <StepWizard steps={STEPS} currentStep={currentStep} />

            <Card className="mt-8 border-border shadow-sm">
                <CardContent className="p-6 sm:p-8">

                    {/* ÉTAPE 1 : Établissement & Type */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Type de demande <HelpTooltip content="S'il s'agit du premier agrément pour ces locaux, choisissez Première demande." /></Label>
                                <RadioGroup
                                    defaultValue={formData.typeDemande}
                                    onValueChange={(val) => setFormData({ ...formData, typeDemande: val })}
                                    className="grid sm:grid-cols-2 gap-4"
                                >
                                    <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.typeDemande === 'premiere_demande' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}>
                                        <RadioGroupItem value="premiere_demande" id="premiere" className="sr-only" />
                                        <Label htmlFor="premiere" className="cursor-pointer flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.typeDemande === 'premiere_demande' ? 'border-primary' : ''}`}>
                                                {formData.typeDemande === 'premiere_demande' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <span className="font-semibold">Première demande</span>
                                        </Label>
                                    </div>
                                    <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.typeDemande === 'renouvellement' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}>
                                        <RadioGroupItem value="renouvellement" id="renouvellement" className="sr-only" />
                                        <Label htmlFor="renouvellement" className="cursor-pointer flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.typeDemande === 'renouvellement' ? 'border-primary' : ''}`}>
                                                {formData.typeDemande === 'renouvellement' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <span className="font-semibold">Renouvellement</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Établissement concerné <HelpTooltip content="Sélectionnez un établissement enregistré ou déclarez-en un nouveau." /></Label>

                                <div className="grid gap-3">
                                    <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.etablissementExistant === 'eta_1' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`} onClick={() => setFormData({ ...formData, etablissementExistant: 'eta_1' })}>
                                        <div className="flex items-start gap-3">
                                            <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="font-semibold">Restaurant Le Baobab Principal</p>
                                                <p className="text-sm text-muted-foreground">Estuaire, Libreville, Quartier Louis</p>
                                                <Badge variant="outline" className="mt-2 text-xs">A déjà un agrément actif</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.etablissementExistant === 'aucun' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`} onClick={() => setFormData({ ...formData, etablissementExistant: 'aucun' })}>
                                        <div className="flex items-center gap-3">
                                            <Plus className="w-5 h-5 text-primary" />
                                            <p className="font-semibold text-primary">Déclarer un nouvel établissement</p>
                                        </div>
                                    </div>
                                </div>

                                {formData.etablissementExistant === "aucun" && (
                                    <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nomEta">Nom de l'établissement</Label>
                                            <Input id="nomEta" placeholder="Ex: Annexe Port-Gentil" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="prov">Province</Label>
                                                <Input id="prov" placeholder="Estuaire" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="ville">Ville / Quartier</Label>
                                                <Input id="ville" placeholder="Libreville, Akanda..." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Catégorie de risque <HelpTooltip content="La catégorie détermine la rigueur de l'inspection et le tarif applicable." /></Label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.categorie}
                                                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                                            >
                                                <option value="CAT1">Catégorie 1 (DANGER ÉLEVÉ - Industrie)</option>
                                                <option value="CAT2">Catégorie 2 (DANGER MOYEN - Restauration)</option>
                                                <option value="CAT3">Catégorie 3 (DANGER FAIBLE - Épicerie)</option>
                                                <option value="TRANS">Transport (Véhicule Frigorifique)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 2 : Pièces Jointes */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-100 mb-6">
                                <FileText className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">Documents requis pour un établissement de {formData.categorie}</p>
                                    <p>Veuillez fournir des documents lisibles (PDF, JPG ou PNG), taille max 5Mo/fichier.</p>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                {/* Faux composant Upload simple */}
                                <div className="border border-dashed rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <UploadCloud className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <h4 className="font-medium">1. Fiche Circuit / RCCM</h4>
                                    <p className="text-sm text-muted-foreground mb-4">Obligatoire pour vérifier l'entité juridique.</p>
                                    <Button variant="outline" size="sm">Parcourir les fichiers</Button>
                                </div>

                                <div className="border border-dashed rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <UploadCloud className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <h4 className="font-medium">2. Pièce d'identité du gérant</h4>
                                    <p className="text-sm text-muted-foreground mb-4">Valide (CNI, Passeport, ou Carte de Séjour).</p>
                                    <Button variant="outline" size="sm">Parcourir les fichiers</Button>
                                </div>

                                <div className="border border-dashed rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <UploadCloud className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <h4 className="font-medium">3. Plan sommaire des locaux</h4>
                                    <p className="text-sm text-muted-foreground mb-4">Un croquis montrant la disposition suffit pour la Catégorie 2.</p>
                                    <Button variant="outline" size="sm">Parcourir les fichiers</Button>
                                </div>

                                {formData.categorie === "CAT1" && (
                                    <div className="border border-dashed border-destructive/50 rounded-xl p-6 text-center hover:bg-destructive/5 transition-colors cursor-pointer">
                                        <UploadCloud className="w-8 h-8 mx-auto mb-2 text-destructive" />
                                        <h4 className="font-medium text-destructive">4. Plan HACCP (Catégorie 1 uniquement)</h4>
                                        <p className="text-sm text-muted-foreground mb-4">Document clé pour l'industrie.</p>
                                        <Button variant="outline" size="sm">Parcourir les fichiers</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 3 : Rélap & Taxe */}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h3 className="text-lg font-bold mb-4">Récapitulatif de la redevance</h3>
                                <div className="bg-muted/30 border rounded-xl p-6">
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-muted-foreground">Type de prestation</span>
                                        <span className="font-medium">Agrément Sanitaire ({formData.typeDemande === 'premiere_demande' ? 'Première demande' : 'Renouvellement'})</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-muted-foreground">Établissement</span>
                                        <span className="font-medium">{formData.etablissementExistant === 'aucun' ? 'Nouvel Établissement' : 'Le Baobab'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-muted-foreground">Catégorie de risque</span>
                                        <span className="font-medium">{formData.categorie}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 mt-2">
                                        <div className="flex items-center text-lg font-bold text-foreground">
                                            <Calculator className="w-5 h-5 mr-2 text-primary" />
                                            Total à Payer
                                        </div>
                                        <span className="text-2xl font-extrabold text-primary">
                                            {formData.categorie === "CAT1" ? "500 000" : formData.categorie === "CAT2" ? "250 000" : formData.categorie === "CAT3" ? "100 000" : "50 000"} FCFA
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-start gap-3 border border-yellow-200">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-600" />
                                <div className="text-sm">
                                    <p className="font-bold mb-1">Rappel Légal</p>
                                    <p>Toute fausse déclaration expose le contrevenant à des sanctions pénales et au retrait définitif de l'agrément. Les frais de dossier ne sont pas remboursables en cas de refus pour non-conformité majeure après inspection.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 pt-4 border-t">
                                <Checkbox
                                    id="certif"
                                    checked={formData.declarationCertifiee}
                                    onCheckedChange={(c) => setFormData({ ...formData, declarationCertifiee: c as boolean })}
                                    className="mt-1"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="certif" className="text-sm font-medium leading-relaxed">
                                        Je certifie sur l'honneur l'exactitude des informations fournies ainsi que l'authenticité des documents joints. J'ai pris connaissance de la réglementation en vigueur.
                                    </Label>
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>

            {/* NAVIGATION FOOTER */}
            <div className="flex justify-between mt-8">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="w-32"
                >
                    Précédent
                </Button>

                {currentStep < STEPS.length ? (
                    <Button onClick={handleNext} className="w-32">
                        Suivant <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        className="w-auto px-8 bg-success hover:bg-success/90 text-success-foreground"
                        disabled={!formData.declarationCertifiee || isLoading}
                    >
                        {isLoading ? "Enregistrement..." : "Confirmer et Payer"}
                        {!isLoading && <CheckCircle2 className="w-4 h-4 ml-2" />}
                    </Button>
                )}
            </div>
        </div>
    );
}

// Separator helper
const Separator = () => <div className="h-px bg-border my-6" />;
