"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepWizard } from "@/components/shared/StepWizard";
import { HelpTooltip } from "@/components/shared/HelpTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Phone, Mail, Building2, Store, Factory, Truck, Package, Leaf, Coffee, Snowflake, Settings } from "lucide-react";

// Types
type Method = "phone" | "email" | null;
type Activity = "restaurateur" | "importateur" | "industriel" | "distributeur_intrants" | "transporteur" | "commercant" | "hotelier" | "boulanger" | "autre";

const WIZARD_STEPS = [
    { title: "Contact", subtitle: "Numéro ou email" },
    { title: "Vérification", subtitle: "Code de sécurité" },
    { title: "Profil", subtitle: "Informations" },
    { title: "Activité", subtitle: "Votre métier" },
    { title: "Établissement", subtitle: "Premier local" },
];

const ACTIVITIES = [
    { id: "restaurateur", label: "Restaurant / Hôtel / Cantine", icon: Coffee },
    { id: "commercant", label: "Épicerie / Superette", icon: Store },
    { id: "industriel", label: "Usine / Industrie", icon: Factory },
    { id: "transporteur", label: "Transport de denrées", icon: Truck },
    { id: "importateur", label: "Importateur alimentaire", icon: Package },
    { id: "distributeur_intrants", label: "Distributeur d'intrants", icon: Leaf },
    { id: "boulanger", label: "Boulangerie / Pâtisserie", icon: Coffee },
    { id: "autre", label: "Entrepôt / Autre", icon: Snowflake },
];

export default function InscriptionPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [method, setMethod] = useState<Method>(null);

    // States complets du formulaire
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [activity, setActivity] = useState<Activity[]>([]);

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
        else router.push("/tableau-de-bord");
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    // Rendu par étape
    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-6 animate-in fade-in zoom-in-95">
                        <h2 className="text-2xl font-bold text-center">Comment souhaitez-vous créer votre compte ?</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Button
                                variant={method === 'phone' ? 'default' : 'outline'}
                                className="h-24 flex flex-col items-center justify-center gap-2 text-lg"
                                onClick={() => setMethod('phone')}
                            >
                                <Phone className="w-8 h-8" />
                                Par numéro de téléphone
                                <span className="text-xs font-normal opacity-80">(Recommandé)</span>
                            </Button>

                            <Button
                                variant={method === 'email' ? 'default' : 'outline'}
                                className="h-24 flex flex-col items-center justify-center gap-2 text-lg"
                                onClick={() => setMethod('email')}
                            >
                                <Mail className="w-8 h-8" />
                                Par adresse email
                            </Button>
                        </div>

                        {method === 'phone' && (
                            <div className="space-y-4 animate-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Numéro de téléphone gabonais</Label>
                                    <div className="flex">
                                        <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                                            +241
                                        </div>
                                        <Input
                                            id="phone"
                                            placeholder="0X XX XX XX"
                                            className="rounded-l-none"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {method === 'email' && (
                            <div className="space-y-4 animate-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Adresse email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemple@entreprise.ga"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <Input id="password" type="password" />
                                    <p className="text-xs text-muted-foreground">8 caractères minimum (1 majuscule, 1 chiffre)</p>
                                </div>
                            </div>
                        )}

                        <p className="text-center text-sm text-muted-foreground pt-4">
                            Pas d'inquiétude, votre inscription prend moins de 5 minutes.
                        </p>

                        <Button
                            className="w-full text-lg h-12"
                            disabled={!method || (method === 'phone' && phone.length < 8) || (method === 'email' && !email.includes('@'))}
                            onClick={handleNext}
                        >
                            Continuer
                        </Button>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-center">Vérification de sécurité</h2>

                        <p className="text-center text-muted-foreground">
                            {method === 'phone'
                                ? `Nous avons envoyé un code à 6 chiffres au +241 ${phone}. Entrez-le ci-dessous.`
                                : `Cliquez sur le lien envoyé à ${email} ou entrez le code reçu ci-dessous.`}
                        </p>

                        <div className="flex justify-center gap-2 py-4">
                            {otp.map((digit, i) => (
                                <Input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 h-14 text-center text-2xl"
                                    value={digit}
                                    onChange={(e) => {
                                        const newOtp = [...otp];
                                        newOtp[i] = e.target.value;
                                        setOtp(newOtp);
                                        // Focus au suivant si rempli
                                        if (e.target.value && i < 5) {
                                            document.getElementById(`otp-${i + 1}`)?.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Supprimer et retour en arrière
                                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                            document.getElementById(`otp-${i - 1}`)?.focus();
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                Je n'ai pas reçu le code (60s)
                            </Button>
                        </div>

                        <Button
                            className="w-full text-lg h-12"
                            disabled={otp.some(d => !d)}
                            onClick={handleNext}
                        >
                            Vérifier et continuer
                        </Button>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-center">Parlez-nous de vous</h2>
                        <p className="text-center text-muted-foreground">
                            Ces informations permettront à l'AGASA de vous identifier.
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="raisonsociale" className="flex items-center">
                                    Raison sociale <span className="text-destructive ml-1">*</span>
                                </Label>
                                <Input id="raisonsociale" placeholder="Nom de votre entreprise ou votre nom complet" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="rccm" className="flex items-center">
                                        RCCM
                                        <HelpTooltip content="Votre numéro RCCM figure sur votre extrait K-bis (Registre du Commerce)." />
                                    </Label>
                                    <Input id="rccm" placeholder="Ex: GA-LBV-2000-B-1234" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nif" className="flex items-center">
                                        NIF
                                        <HelpTooltip content="Votre Numéro d'Identification Fiscale figure sur votre attestation fiscale." />
                                    </Label>
                                    <Input id="nif" placeholder="Ex: 123456789 X" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <h3 className="font-semibold mb-4">La personne à contacter (Représentant)</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nom">Nom <span className="text-destructive">*</span></Label>
                                        <Input id="nom" placeholder="Votre nom" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="prenom">Prénom <span className="text-destructive">*</span></Label>
                                        <Input id="prenom" placeholder="Votre prénom" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full text-lg h-12" onClick={handleNext}>
                            Continuer
                        </Button>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-center">Quelle est votre activité ?</h2>
                        <p className="text-center text-muted-foreground">
                            Sélectionnez toutes les activités qui correspondent à votre entreprise.
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {ACTIVITIES.map((act) => {
                                const isSelected = activity.includes(act.id as Activity);
                                const Icon = act.icon;

                                return (
                                    <Card
                                        key={act.id}
                                        className={`cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setActivity(activity.filter(a => a !== act.id));
                                            } else {
                                                setActivity([...activity, act.id as Activity]);
                                            }
                                        }}
                                    >
                                        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-32 gap-3">
                                            <div className={`p-2 rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-medium leading-tight">{act.label}</span>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="bg-primary/10 p-4 rounded-md flex gap-3 text-sm mt-4">
                            <span className="text-2xl">💡</span>
                            <p>
                                En fonction de vos choix, nous personnaliserons votre portail avec les modules pertinents (Agréments, Importations, etc.)
                            </p>
                        </div>

                        <Button
                            className="w-full text-lg h-12"
                            disabled={activity.length === 0}
                            onClick={handleNext}
                        >
                            Continuer
                        </Button>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-2xl font-bold text-center">Ajoutez votre premier établissement</h2>
                        <p className="text-center text-muted-foreground">
                            Déclarez le principal local ou véhicule de votre activité.
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="etabNom">Nom de l'établissement <span className="text-destructive">*</span></Label>
                                <Input id="etabNom" placeholder="Ex: Restaurant Le Baobab, PK8" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categorie" className="flex items-center">
                                    Catégorie de risque Sanitaire
                                    <HelpTooltip content="Sélectionnez la catégorie (AS CAT 1, 2, 3 ou Transport) correspondant à votre activité" />
                                </Label>
                                <div className="grid gap-2">
                                    {[
                                        { id: "cat1", label: "⭐ CAT 1 — Risque élevé (Usines, abattoirs, etc.)" },
                                        { id: "cat2", label: "⭐⭐ CAT 2 — Risque modéré (Restaurants, hôtels, etc.)" },
                                        { id: "cat3", label: "⭐⭐⭐ CAT 3 — Risque bas (Épiceries, dépôts, etc.)" },
                                        { id: "transport", label: "🚛 Transport (Véhicules frigorifiques, motos)" },
                                    ].map((cat) => (
                                        <Label
                                            key={cat.id}
                                            className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                                        >
                                            <Checkbox id={cat.id} />
                                            <span className="font-normal">{cat.label}</span>
                                        </Label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="ville">Ville <span className="text-destructive">*</span></Label>
                                    <Input id="ville" placeholder="Ex: Libreville" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="province">Province <span className="text-destructive">*</span></Label>
                                    <select
                                        id="province"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Sélectionnez une province</option>
                                        <option value="estuaire">Estuaire</option>
                                        <option value="haut-ogooue">Haut-Ogooué</option>
                                        <option value="moyen-ogooue">Moyen-Ogooué</option>
                                        <option value="ngounie">Ngounié</option>
                                        <option value="nyanga">Nyanga</option>
                                        <option value="ogooue-ivindo">Ogooué-Ivindo</option>
                                        <option value="ogooue-lolo">Ogooué-Lolo</option>
                                        <option value="ogooue-maritime">Ogooué-Maritime</option>
                                        <option value="woleu-ntem">Woleu-Ntem</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full text-lg h-12 bg-success hover:bg-success/90 text-success-foreground" onClick={() => router.push('/tableau-de-bord')}>
                            Créer mon compte et accéder au portail
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4">
                        <span className="text-2xl font-bold text-white tracking-widest leading-none">AGASA<span className="text-accent">-Pro</span></span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Inscription Opérateur</h1>
                    <p className="text-muted-foreground mt-2">Votre guichet unique pour toutes vos démarches</p>
                </div>

                <Card className="shadow-lg border-border/50">
                    <CardContent className="p-6 md:p-10">
                        <StepWizard steps={WIZARD_STEPS} currentStep={step} />

                        <div className="mt-8 min-h-[400px]">
                            {renderStep()}
                        </div>

                        {step > 0 && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
                                    ← Retour à l'étape précédente
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
