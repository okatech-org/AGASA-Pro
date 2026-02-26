"use client";

import { useState } from "react";
import {
    User,
    Building2,
    Phone,
    Mail,
    MapPin,
    Shield,
    FileText,
    Save,
    Bell,
    Lock,
    Edit2,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function ProfilPage() {
    const [activeTab, setActiveTab] = useState("entreprise");

    const tabs = [
        { id: "entreprise", label: "Infos Entreprise", icon: Building2 },
        { id: "responsable", label: "Responsable", icon: User },
        { id: "etablissements", label: "Établissements", icon: MapPin },
        { id: "securite", label: "Sécurité & Alertes", icon: Shield },
    ];

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
                <p className="text-muted-foreground mt-1">Gérez les informations de votre entreprise et vos paramètres de compte.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {/* Navigation Sidebar */}
                <div className="space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "hover:bg-muted text-muted-foreground"
                                    }`}
                            >
                                <Icon className="w-4 h-4" /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3">

                    {/* TAB 1: Entreprise */}
                    {activeTab === "entreprise" && (
                        <Card className="shadow-sm border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CardHeader className="border-b bg-muted/20">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl">Informations de l'Entreprise</CardTitle>
                                        <CardDescription>Données légales et administratives.</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm"><Edit2 className="w-4 h-4 mr-2" /> Modifier</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-2xl">
                                        LR
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Restaurant Le Baobab</h3>
                                        <Badge variant="outline" className="mt-1">Opérateur : Restauration (CAT 2)</Badge>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Raison Sociale</Label>
                                        <Input defaultValue="Restaurant Le Baobab" readOnly className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Forme Juridique</Label>
                                        <Input defaultValue="SARL" readOnly className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="w-3 h-3" /> N° RCCM
                                        </Label>
                                        <Input defaultValue="GA-LBV-2023-B-5678" readOnly className="font-mono bg-muted/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="w-3 h-3" /> NIF
                                        </Label>
                                        <Input defaultValue="9876543210" readOnly className="font-mono bg-muted/50" />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> Siège Social
                                        </Label>
                                        <Input defaultValue="Quartier Louis, Libreville, Estuaire, Gabon" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button><Save className="w-4 h-4 mr-2" /> Sauvegarder</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* TAB 2: Responsable */}
                    {activeTab === "responsable" && (
                        <Card className="shadow-sm border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-xl">Responsable Légal</CardTitle>
                                <CardDescription>Personne de contact principal pour l'AGASA.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Nom</Label>
                                        <Input defaultValue="Nguema" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Prénom</Label>
                                        <Input defaultValue="Marie" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                            <Mail className="w-3 h-3" /> Email Pro
                                        </Label>
                                        <Input defaultValue="contact@lebaobab.ga" type="email" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                            <Phone className="w-3 h-3" /> Téléphone (WhatsApp)
                                        </Label>
                                        <Input defaultValue="+241 77 12 34 56" type="tel" />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Pièce d'identité fournie</Label>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-medium text-sm">CNI_Nguema_Marie.pdf</p>
                                                    <p className="text-xs text-muted-foreground">Téléchargé le 15 Mar 2024</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-success border-success/30 bg-success/10 text-xs">Vérifiée</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button><Save className="w-4 h-4 mr-2" /> Mettre à jour</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* TAB 3: Établissements */}
                    {activeTab === "etablissements" && (
                        <Card className="shadow-sm border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CardHeader className="border-b bg-muted/20 flex flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl">Vos Établissements</CardTitle>
                                    <CardDescription>Gérez les sites liés à votre entreprise.</CardDescription>
                                </div>
                                <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Ajouter un site</Button>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {[
                                        { nom: "Le Baobab - Centre Ville", type: "Restauration", adresse: "Quartier Louis, Libreville", agrement: "AGR-2023-0100", score: 4 },
                                        { nom: "Le Baobab - Akanda", type: "Restauration Rapide", adresse: "Angondjé, Akanda", agrement: "AGR-2025-0450", score: 3 },
                                    ].map((etab, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-muted flex flex-col items-center justify-center shrink-0">
                                                    <Building2 className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{etab.nom}</h4>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" /> {etab.adresse}
                                                    </p>
                                                    <div className="flex gap-2 mt-2">
                                                        <Badge variant="secondary" className="text-xs">{etab.type}</Badge>
                                                        <Badge variant="outline" className="text-xs text-success border-success/30 bg-success/10">{etab.agrement}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                                <div className="flex items-center gap-1 text-sm bg-muted/50 px-2 py-1 rounded-md">
                                                    <span className="text-base">😊</span>
                                                    <span className="font-bold">{etab.score}/5</span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="hidden sm:flex shrink-0">Gérer</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* TAB 4: Sécurité */}
                    {activeTab === "securite" && (
                        <Card className="shadow-sm border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle className="text-xl">Sécurité & Notifications</CardTitle>
                                <CardDescription>Paramétrez l'accès à votre compte.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">

                                {/* Password Section */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><Lock className="w-5 h-5" /> Mot de passe</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Mot de passe actuel</Label>
                                            <Input type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nouveau mot de passe</Label>
                                            <Input type="password" />
                                        </div>
                                        <div className="space-y-2 sm:col-start-2">
                                            <Label>Confirmer le nouveau mot de passe</Label>
                                            <Input type="password" />
                                        </div>
                                    </div>
                                    <Button variant="outline">Mettre à jour le mot de passe</Button>
                                </div>

                                <Separator />

                                {/* Notifications Section */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><Bell className="w-5 h-5" /> Préférences de Notification</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Notifications par SMS (Firebase)</Label>
                                                <p className="text-sm text-muted-foreground">Recevez les alertes urgentes et OTP sur votre numéro.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Rappels de conformité</Label>
                                                <p className="text-sm text-muted-foreground">Rappels pour vos renouvellements d'agrément (60 jrs avant).</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Alertes CEMAC et Sanitaires</Label>
                                                <p className="text-sm text-muted-foreground">Informations critiques sur la sécurité alimentaire.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button><Save className="w-4 h-4 mr-2" /> Enregistrer les préférences</Button>
                                </div>

                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}
