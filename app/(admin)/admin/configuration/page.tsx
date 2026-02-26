"use client";

import { useState } from "react";
import {
    Settings,
    Save,
    DollarSign,
    Bell,
    Shield,
    Clock,
    Users,
    Plus,
    CheckCircle2,
    AlertTriangle,
    Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function AdminConfigPage() {
    const [activeSection, setActiveSection] = useState("tarifs");

    const sections = [
        { key: "tarifs", label: "Grille Tarifaire", icon: DollarSign },
        { key: "relances", label: "Rappels Automatiques", icon: Clock },
        { key: "notifications", label: "Notifications", icon: Bell },
        { key: "maintenance", label: "Mode Maintenance", icon: Wrench },
        { key: "admins", label: "Comptes Admin", icon: Users },
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configuration Système</h1>
                <p className="text-muted-foreground mt-1">Paramètres globaux de la plateforme AGASA-Pro.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {/* SIDEBAR */}
                <div className="space-y-1">
                    {sections.map((s) => {
                        const Icon = s.icon;
                        return (
                            <button key={s.key} onClick={() => setActiveSection(s.key)}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === s.key ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}>
                                <Icon className="w-4 h-4" /> {s.label}
                            </button>
                        );
                    })}
                </div>

                {/* CONTENU */}
                <div className="md:col-span-3">
                    {/* TARIFS */}
                    {activeSection === "tarifs" && (
                        <Card className="shadow-sm">
                            <CardHeader className="border-b">
                                <CardTitle className="text-lg">Grille Tarifaire</CardTitle>
                                <CardDescription>Modifiez les tarifs par catégorie et type de demande.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-wider">Agrément Sanitaire</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { cat: "AS CAT 1 — Première demande", val: "300 000" },
                                        { cat: "AS CAT 2 — Première demande", val: "250 000" },
                                        { cat: "AS CAT 3 — Première demande", val: "150 000" },
                                        { cat: "Transport — Première demande", val: "200 000" },
                                    ].map((t) => (
                                        <div key={t.cat} className="space-y-1">
                                            <Label className="text-xs">{t.cat}</Label>
                                            <div className="flex items-center gap-2">
                                                <Input defaultValue={t.val} className="font-mono" />
                                                <span className="text-xs text-muted-foreground shrink-0">FCFA</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-wider">GUI Importation</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "Déclaration d'Importation", val: "50 000" },
                                        { label: "Inspection documentaire (×conteneur)", val: "75 000" },
                                        { label: "Inspection physique (×conteneur)", val: "150 000" },
                                        { label: "Certificat AMC", val: "200 000" },
                                    ].map((t) => (
                                        <div key={t.label} className="space-y-1">
                                            <Label className="text-xs">{t.label}</Label>
                                            <div className="flex items-center gap-2">
                                                <Input defaultValue={t.val} className="font-mono" />
                                                <span className="text-xs text-muted-foreground shrink-0">FCFA</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button className="mt-4"><Save className="w-4 h-4 mr-2" /> Enregistrer les tarifs</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* RELANCES */}
                    {activeSection === "relances" && (
                        <Card className="shadow-sm">
                            <CardHeader className="border-b">
                                <CardTitle className="text-lg">Rappels Automatiques</CardTitle>
                                <CardDescription>Configurez les délais de relance pour les renouvellements d'agrément.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {[
                                    { label: "1er rappel avant expiration", val: 60 },
                                    { label: "2ème rappel (plus urgent)", val: 30 },
                                    { label: "Dernier rappel (alerte rouge)", val: 7 },
                                ].map((r) => (
                                    <div key={r.label} className="flex items-center gap-4">
                                        <Label className="flex-1">{r.label}</Label>
                                        <Input defaultValue={r.val} type="number" className="w-24 font-mono text-center" />
                                        <span className="text-sm text-muted-foreground">jours</span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <Checkbox id="auto-suspend" defaultChecked />
                                    <Label htmlFor="auto-suspend">Suspension automatique le jour de l'expiration</Label>
                                </div>
                                <Button className="mt-4"><Save className="w-4 h-4 mr-2" /> Enregistrer</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeSection === "notifications" && (
                        <Card className="shadow-sm">
                            <CardHeader className="border-b">
                                <CardTitle className="text-lg">Configuration des Notifications</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {[
                                    { canal: "In-App (portail)", enabled: true },
                                    { canal: "SMS (via Firebase)", enabled: true },
                                    { canal: "Email", enabled: false },
                                ].map((n) => (
                                    <div key={n.canal} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">{n.canal}</span>
                                        </div>
                                        <Badge className={n.enabled ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>{n.enabled ? "Activé" : "Désactivé"}</Badge>
                                    </div>
                                ))}
                                <Button className="mt-4"><Save className="w-4 h-4 mr-2" /> Enregistrer</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* MAINTENANCE */}
                    {activeSection === "maintenance" && (
                        <Card className="shadow-sm">
                            <CardHeader className="border-b">
                                <CardTitle className="text-lg">Mode Maintenance</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="bg-muted/30 p-6 rounded-xl border text-center">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-success" />
                                    <h3 className="text-xl font-bold text-success mb-2">Plateforme opérationnelle</h3>
                                    <p className="text-muted-foreground mb-6">La plateforme fonctionne normalement. Activez le mode maintenance pour bloquer l'accès des opérateurs pendant une mise à jour.</p>
                                    <Button variant="destructive"><AlertTriangle className="w-4 h-4 mr-2" /> Activer le mode maintenance</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ADMINS */}
                    {activeSection === "admins" && (
                        <Card className="shadow-sm">
                            <CardHeader className="border-b flex flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg">Comptes Administrateurs</CardTitle>
                                    <CardDescription>Gérez les accès à l'espace d'administration.</CardDescription>
                                </div>
                                <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {[
                                        { nom: "Admin Système", email: "admin@agasa.ga", role: "admin_systeme", statut: "actif" },
                                        { nom: "Agent Ndong", email: "ndong@agasa.ga", role: "agent_agasa", statut: "actif" },
                                        { nom: "Superviseur Mba", email: "mba@agasa.ga", role: "superviseur", statut: "actif" },
                                    ].map((a, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {a.nom.split(" ").map((n) => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{a.nom}</p>
                                                    <p className="text-xs text-muted-foreground">{a.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="capitalize text-xs">{a.role.replace("_", " ")}</Badge>
                                                <Badge className="bg-success/10 text-success border-success/20 text-xs">Actif</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
