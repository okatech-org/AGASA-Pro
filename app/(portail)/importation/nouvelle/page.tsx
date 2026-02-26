"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { StepWizard } from "@/components/shared/StepWizard";
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    UploadCloud,
    Ship,
    FileText,
    Calculator,
    AlertCircle,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { HelpTooltip } from "@/components/shared/HelpTooltip";

type Prestation = {
    type: string;
    label: string;
    tarif: number;
    obligatoire: boolean;
    checked: boolean;
};

export default function NouvelleImportationPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        typeImportation: "alimentaire",
        portArrivee: "Owendo",
        paysOrigine: "",
        description: "",
        nombreConteneurs: 1,
        valeurDeclaree: 0,
        declarationCertifiee: false,
    });

    const [prestations, setPrestations] = useState<Prestation[]>([
        { type: "declaration_importation", label: "Déclaration d'Importation (DI)", tarif: 50000, obligatoire: true, checked: true },
        { type: "inspection_documentaire", label: "Inspection Documentaire", tarif: 75000, obligatoire: true, checked: true },
        { type: "inspection_physique", label: "Inspection Physique (si ciblée)", tarif: 150000, obligatoire: false, checked: false },
        { type: "certificat_amc", label: "Certificat Sanitaire + AMC", tarif: 200000, obligatoire: true, checked: true },
        { type: "analyse_urgence", label: "Analyse en urgence (24h)", tarif: 200000, obligatoire: false, checked: false },
    ]);

    const STEPS = [
        { id: 1, title: "Marchandise" },
        { id: 2, title: "Documents" },
        { id: 3, title: "Prestations" },
        { id: 4, title: "Récapitulatif" },
        { id: 5, title: "Paiement" },
        { id: 6, title: "Confirmation" },
    ];

    const montantTotal = useMemo(() => {
        return prestations
            .filter((p) => p.checked)
            .reduce((acc, p) => {
                if (p.type === "inspection_documentaire" || p.type === "inspection_physique") {
                    return acc + p.tarif * formData.nombreConteneurs;
                }
                return acc + p.tarif;
            }, 0);
    }, [prestations, formData.nombreConteneurs]);

    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setCurrentStep(6);
        }, 3000);
    };

    const togglePrestation = (index: number) => {
        if (prestations[index].obligatoire) return;
        setPrestations((prev) =>
            prev.map((p, i) => (i === index ? { ...p, checked: !p.checked } : p))
        );
    };

    const formatFCFA = (n: number) =>
        new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

    // ÉTAPE 6 — Confirmation
    if (currentStep === 6) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Déclaration Soumise !</h1>
                <p className="text-xl text-muted-foreground mb-2">
                    Votre dossier d'importation a été créé avec succès.
                </p>
                <div className="bg-muted p-6 rounded-xl text-left w-full max-w-sm border shadow-sm mb-8 mt-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">N° de dossier</span>
                        <span className="font-mono font-bold">IMP-2026-0123</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Montant payé</span>
                        <span className="font-bold text-primary">{formatFCFA(montantTotal)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t mt-2">
                        <span className="text-muted-foreground">Statut</span>
                        <Badge className="bg-success text-success-foreground">Payé</Badge>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                    Vous recevrez un SMS à chaque étape du traitement de votre dossier.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg">
                        <Link href="/importation/IMP-2026-0123">Suivre mon dossier</Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                        <Link href="/importation">Retour au tableau de bord</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground">
                    <Link href="/importation">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Retour aux importations
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Nouvelle Déclaration d&apos;Importation</h1>
                <p className="text-muted-foreground mt-2">
                    Déclarez votre importation et obtenez votre Autorisation de Mise à la Consommation (AMC).
                </p>
            </div>

            <StepWizard steps={STEPS} currentStep={currentStep} />

            <Card className="mt-8 border-border shadow-sm">
                <CardContent className="p-6 sm:p-8">

                    {/* ÉTAPE 1 — Marchandise */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">
                                    Type d&apos;importation <HelpTooltip content="Choisissez le type de votre cargaison principale." />
                                </Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {["alimentaire", "phytosanitaire", "mixte"].map((type) => (
                                        <div
                                            key={type}
                                            onClick={() => setFormData({ ...formData, typeImportation: type })}
                                            className={`border-2 rounded-xl p-4 cursor-pointer text-center font-semibold capitalize transition-all ${formData.typeImportation === type ? "border-primary bg-primary/5 text-primary shadow-sm" : "hover:bg-muted text-muted-foreground"}`}
                                        >
                                            {type === "alimentaire" ? "🍖 " : type === "phytosanitaire" ? "🌿 " : "📦 "}
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Port d&apos;arrivée</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={formData.portArrivee}
                                    onChange={(e) => setFormData({ ...formData, portArrivee: e.target.value })}
                                >
                                    <option value="Owendo">Port d'Owendo</option>
                                    <option value="Port-Gentil">Port-Gentil</option>
                                    <option value="Aéroport_LBV">Aéroport de Libreville</option>
                                    <option value="Frontière_terrestre">Frontière terrestre</option>
                                </select>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pays">Pays d&apos;origine</Label>
                                    <Input
                                        id="pays"
                                        placeholder="Ex: France, Brésil, Cameroun..."
                                        value={formData.paysOrigine}
                                        onChange={(e) => setFormData({ ...formData, paysOrigine: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="conteneurs">Nombre de conteneurs</Label>
                                    <Input
                                        id="conteneurs"
                                        type="number"
                                        min={1}
                                        value={formData.nombreConteneurs}
                                        onChange={(e) => setFormData({ ...formData, nombreConteneurs: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc">Description de la marchandise</Label>
                                <Textarea
                                    id="desc"
                                    placeholder="Décrivez la nature de votre marchandise (ex: Viande bovine congelée, produits laitiers...)"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="valeur">
                                    Valeur déclarée (FCFA) <HelpTooltip content="La valeur totale de votre cargaison en Francs CFA." />
                                </Label>
                                <Input
                                    id="valeur"
                                    type="number"
                                    placeholder="Ex: 85 000 000"
                                    value={formData.valeurDeclaree || ""}
                                    onChange={(e) => setFormData({ ...formData, valeurDeclaree: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 2 — Documents */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-100 mb-4">
                                <FileText className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">Documents requis pour une importation {formData.typeImportation}</p>
                                    <p>Formats acceptés : PDF, JPG, PNG — Max 10 Mo par fichier. Sur mobile, vous pouvez prendre une photo directe.</p>
                                </div>
                            </div>

                            {[
                                { label: "Manifeste de bord", desc: "Document du navire listant la cargaison", obligatoire: true },
                                { label: "Certificat sanitaire du pays d'origine", desc: "Délivré par l'autorité sanitaire du pays exportateur", obligatoire: true },
                                { label: "Facture commerciale", desc: "Facture d'achat de la marchandise", obligatoire: true },
                                { label: "Liste de colisage", desc: "Détail du contenu de chaque conteneur", obligatoire: true },
                                { label: "Certificat phytosanitaire", desc: "Si produits végétaux uniquement", obligatoire: formData.typeImportation !== "alimentaire" },
                                { label: "Autres documents", desc: "Tout document complémentaire utile", obligatoire: false },
                            ].map((doc, i) => (
                                <div key={i} className={`border ${doc.obligatoire ? "border-dashed" : "border-dashed border-muted-foreground/30"} rounded-xl p-5 text-center hover:bg-muted/50 transition-colors cursor-pointer`}>
                                    <UploadCloud className="w-7 h-7 mx-auto mb-2 text-muted-foreground" />
                                    <h4 className="font-medium">
                                        {i + 1}. {doc.label}
                                        {doc.obligatoire && <span className="text-destructive ml-1">*</span>}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">{doc.desc}</p>
                                    <Button variant="outline" size="sm">Parcourir / 📸 Photo</Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ÉTAPE 3 — Prestations */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-2">Prestations requises</h3>
                                <p className="text-sm text-muted-foreground">
                                    Les prestations obligatoires sont pré-cochées. Vous pouvez ajouter des options supplémentaires.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {prestations.map((p, i) => {
                                    const tarifAffiche = p.type === "inspection_documentaire" || p.type === "inspection_physique"
                                        ? p.tarif * formData.nombreConteneurs
                                        : p.tarif;

                                    return (
                                        <div
                                            key={p.type}
                                            onClick={() => togglePrestation(i)}
                                            className={`border-2 rounded-xl p-4 flex items-start gap-4 transition-all ${p.checked ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted"} ${p.obligatoire ? "cursor-default" : "cursor-pointer"}`}
                                        >
                                            <Checkbox checked={p.checked} disabled={p.obligatoire} className="mt-1" />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold">{p.label}</h4>
                                                        {p.obligatoire && <Badge variant="outline" className="mt-1 text-xs">Obligatoire</Badge>}
                                                    </div>
                                                    <div className="text-right shrink-0 ml-4">
                                                        <p className="font-bold text-primary">{formatFCFA(tarifAffiche)}</p>
                                                        {(p.type === "inspection_documentaire" || p.type === "inspection_physique") && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatFCFA(p.tarif)} × {formData.nombreConteneurs} conteneurs
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-muted rounded-xl p-6 border mt-6">
                                <div className="flex justify-between items-center text-xl">
                                    <div className="flex items-center font-bold">
                                        <Calculator className="w-5 h-5 mr-2 text-primary" />
                                        Total estimé
                                    </div>
                                    <span className="text-2xl font-extrabold text-primary">{formatFCFA(montantTotal)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 4 — Récapitulatif */}
                    {currentStep === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-lg font-bold">Vérifiez votre déclaration</h3>

                            <div className="bg-muted/30 border rounded-xl divide-y">
                                <div className="p-4 flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium capitalize">{formData.typeImportation}</span></div>
                                <div className="p-4 flex justify-between"><span className="text-muted-foreground">Port d'arrivée</span><span className="font-medium">{formData.portArrivee}</span></div>
                                <div className="p-4 flex justify-between"><span className="text-muted-foreground">Pays d'origine</span><span className="font-medium">{formData.paysOrigine || "—"}</span></div>
                                <div className="p-4 flex justify-between"><span className="text-muted-foreground">Marchandise</span><span className="font-medium max-w-[250px] text-right">{formData.description || "—"}</span></div>
                                <div className="p-4 flex justify-between"><span className="text-muted-foreground">Conteneurs</span><span className="font-bold">{formData.nombreConteneurs}</span></div>
                                <div className="p-4 flex justify-between"><span className="text-muted-foreground">Valeur déclarée</span><span className="font-bold">{formatFCFA(formData.valeurDeclaree)}</span></div>
                            </div>

                            <h4 className="font-bold mt-4">Prestations sélectionnées</h4>
                            <div className="space-y-2">
                                {prestations.filter((p) => p.checked).map((p) => (
                                    <div key={p.type} className="flex justify-between text-sm border-b pb-2">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-success" /> {p.label}
                                        </span>
                                        <span className="font-mono font-bold">{formatFCFA(p.type.includes("inspection") ? p.tarif * formData.nombreConteneurs : p.tarif)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-primary/5 border-primary/20 border rounded-xl p-6 mt-4 flex justify-between items-center">
                                <span className="text-xl font-bold flex items-center"><Calculator className="w-5 h-5 mr-2 text-primary" /> Total à payer</span>
                                <span className="text-3xl font-extrabold text-primary">{formatFCFA(montantTotal)}</span>
                            </div>

                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-start gap-3 border border-yellow-200">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-600" />
                                <p className="text-sm">
                                    <span className="font-bold">Rappel :</span> Après soumission et paiement, le dossier sera traité par les services de l'AGASA. L'AMC sera délivrée une fois toutes les vérifications effectuées.
                                </p>
                            </div>

                            <div className="flex items-start space-x-3 pt-4 border-t">
                                <Checkbox
                                    id="certif"
                                    checked={formData.declarationCertifiee}
                                    onCheckedChange={(c) => setFormData({ ...formData, declarationCertifiee: c as boolean })}
                                    className="mt-1"
                                />
                                <Label htmlFor="certif" className="text-sm font-medium leading-relaxed">
                                    Je certifie sur l'honneur l'exactitude des informations fournies et l'authenticité des documents joints.
                                </Label>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 5 — Paiement */}
                    {currentStep === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center mb-6">
                                <ShieldCheck className="w-10 h-10 mx-auto text-primary mb-3" />
                                <h3 className="text-xl font-bold">Paiement Sécurisé</h3>
                                <p className="text-3xl font-extrabold text-primary mt-2">{formatFCFA(montantTotal)}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 rounded-xl p-4 cursor-pointer text-center font-bold border-red-600 bg-red-50 text-red-600 shadow-sm h-20 flex items-center justify-center">
                                    Airtel Money
                                </div>
                                <div className="border-2 rounded-xl p-4 cursor-pointer text-center font-bold hover:bg-muted text-muted-foreground h-20 flex items-center justify-center">
                                    Moov Africa
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Numéro de téléphone</Label>
                                    <div className="flex gap-2">
                                        <div className="bg-muted px-4 py-2 flex items-center rounded-md border font-mono">+241</div>
                                        <Input placeholder="077 12 34 56" type="tel" className="font-mono text-lg" maxLength={9} />
                                    </div>
                                </div>
                                <div className="bg-primary/5 p-4 rounded-lg text-sm text-primary">
                                    💡 Un écran de confirmation USSD va s'afficher sur votre téléphone pour valider la transaction.
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full h-14 text-lg font-bold shadow-lg"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            En attente de validation...
                                        </>
                                    ) : (
                                        `Payer ${formatFCFA(montantTotal)}`
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* NAVIGATION */}
            {currentStep < 5 && (
                <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="w-32">
                        Précédent
                    </Button>
                    <Button onClick={handleNext} className="w-32" disabled={currentStep === 4 && !formData.declarationCertifiee}>
                        Suivant <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
            {currentStep === 5 && (
                <div className="flex justify-start mt-8">
                    <Button variant="outline" onClick={handlePrev} className="w-32">
                        Précédent
                    </Button>
                </div>
            )}
        </div>
    );
}
