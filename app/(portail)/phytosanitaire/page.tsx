"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Leaf, Plus, ArrowLeft, BookOpen, Shield, FileText, Search,
    CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import { useState } from "react";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }); }
function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

function getStatusBadge(statut: string) {
    const c: Record<string, { label: string; className: string }> = {
        delivre: { label: "Délivré ✅", className: "bg-green-100 text-green-700" },
        en_traitement: { label: "En traitement", className: "bg-amber-100 text-amber-700" },
        soumis: { label: "Soumis", className: "bg-blue-100 text-blue-700" },
        refuse: { label: "Refusé", className: "bg-red-100 text-red-700" },
    };
    const s = c[statut] || { label: statut.replace(/_/g, " "), className: "bg-gray-100 text-gray-600" };
    return <Badge className={`${s.className} hover:${s.className}`}>{s.label}</Badge>;
}

export default function PhytosanitairePage() {
    const { operateur, firebaseUid } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });
    const [tab, setTab] = useState<"certificats" | "licences" | "registre">("certificats");

    if (!data || !operateur) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const certificats = data.certificatsPhyto || [];
    const licences = data.licencesIntrants || [];
    const registre = data.registreProduits || [];

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/tableau-de-bord"><ArrowLeft className="w-5 h-5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">🌿 Phytosanitaire</h1>
                        <p className="text-sm text-muted-foreground">Certificats, licences et registre</p>
                    </div>
                </div>
                <Button asChild size="sm" className="gap-2">
                    <Link href="/phytosanitaire/certificats/nouveau">
                        <Plus className="w-4 h-4" />
                        Nouveau
                    </Link>
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-emerald-600">{certificats.filter((c: any) => c.statut === "delivre").length}</div>
                        <p className="text-[10px] text-muted-foreground">Certificats actifs</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{licences.filter((l: any) => l.statut === "delivre").length}</div>
                        <p className="text-[10px] text-muted-foreground">Licences actives</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold">{registre.length}</div>
                        <p className="text-[10px] text-muted-foreground">Produits au registre</p>
                    </CardContent>
                </Card>
            </div>

            {/* Onglets */}
            <div className="flex gap-1 overflow-x-auto pb-1">
                {[
                    { key: "certificats" as const, label: "Certificats", icon: FileText },
                    { key: "licences" as const, label: "Licences", icon: Shield },
                    { key: "registre" as const, label: "Registre", icon: BookOpen },
                ].map((t) => (
                    <Button
                        key={t.key}
                        variant={tab === t.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTab(t.key)}
                        className="gap-1.5"
                    >
                        <t.icon className="w-3.5 h-3.5" />
                        {t.label}
                    </Button>
                ))}
            </div>

            {/* Certificats */}
            {tab === "certificats" && (
                <div className="space-y-3">
                    {certificats.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-8 text-center">
                                <FileText className="w-12 h-12 mx-auto mb-3 text-muted" />
                                <p className="font-medium">Aucun certificat</p>
                                <p className="text-sm text-muted-foreground mt-1">Demandez un certificat phytosanitaire pour vos produits.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        certificats.map((cert: any) => (
                            <Card key={cert._id} className="shadow-sm">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm font-bold">{cert.numeroCertificat}</span>
                                        {getStatusBadge(cert.statut)}
                                    </div>
                                    <p className="text-sm">{cert.produit}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div>Origine : <span className="font-medium text-foreground">{cert.paysOrigine}</span></div>
                                        <div>Quantité : <span className="font-medium text-foreground">{cert.quantite} {cert.unite}</span></div>
                                        <div>Lot : <span className="font-medium text-foreground">{cert.lotNumero || "—"}</span></div>
                                        <div>Montant : <span className="font-semibold text-foreground">{formatMoney(cert.montant)}</span></div>
                                    </div>
                                    {cert.dateDelivrance && (
                                        <p className="text-xs text-muted-foreground">Délivré le {formatDate(cert.dateDelivrance)}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Licences */}
            {tab === "licences" && (
                <div className="space-y-3">
                    {licences.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-8 text-center">
                                <Shield className="w-12 h-12 mx-auto mb-3 text-muted" />
                                <p className="font-medium">Aucune licence</p>
                                <p className="text-sm text-muted-foreground mt-1">Demandez votre licence intrants agricoles.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        licences.map((lic: any) => (
                            <Card key={lic._id} className="shadow-sm">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm font-bold">{lic.numeroLicence}</span>
                                        {getStatusBadge(lic.statut)}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div>Type : <span className="font-medium text-foreground capitalize">{lic.typeIntrant}</span></div>
                                        <div>Montant : <span className="font-semibold text-foreground">{formatMoney(lic.montant)}</span></div>
                                    </div>
                                    {lic.dateExpiration && (
                                        <div className={`p-2 rounded-lg text-xs flex items-center gap-2 ${lic.dateExpiration > Date.now() ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                            {lic.dateExpiration > Date.now() ? (
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            ) : (
                                                <AlertCircle className="w-3.5 h-3.5" />
                                            )}
                                            {lic.dateExpiration > Date.now() ? `Valide jusqu'au ${formatDate(lic.dateExpiration)}` : `Expirée le ${formatDate(lic.dateExpiration)}`}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Registre */}
            {tab === "registre" && (
                <div className="space-y-3">
                    {registre.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-8 text-center">
                                <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted" />
                                <p className="font-medium">Registre vide</p>
                                <p className="text-sm text-muted-foreground mt-1">Les produits autorisés apparaîtront ici.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground">{registre.length} produits phytosanitaires autorisés au Gabon</p>
                            {registre.map((prod: any) => (
                                <Card key={prod._id} className="shadow-sm">
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm">{prod.nomCommercial}</span>
                                            <Badge className={`text-[10px] ${prod.statut === "autorise" ? "bg-green-100 text-green-700" : prod.statut === "retire" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                                                {prod.statut === "autorise" ? "Autorisé" : prod.statut === "retire" ? "Retiré" : prod.statut}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{prod.matiereActive} — {prod.formulation}</p>
                                        <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                                            <div>Fabricant : <span className="text-foreground">{prod.fabricant}</span></div>
                                            <div>Pays : <span className="text-foreground">{prod.paysOrigine}</span></div>
                                            <div>Usage : <span className="text-foreground">{prod.usageAutorise}</span></div>
                                            <div>Cultures : <span className="text-foreground">{prod.culturesCibles}</span></div>
                                            <div>Dose : <span className="text-foreground">{prod.doseRecommandee}</span></div>
                                            <div>LMR : <span className="text-foreground">{prod.restrictionsLMR}</span></div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">N° homologation : {prod.numeroHomologation}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
