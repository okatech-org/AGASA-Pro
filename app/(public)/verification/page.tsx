"use client";

import { useState } from "react";
import {
    Search,
    CheckCircle2,
    ShieldCheck,
    AlertTriangle,
    QrCode,
    Building2,
    MapPin,
    Calendar,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function VerificationPage() {
    const [searchRef, setSearchRef] = useState("");
    const [result, setResult] = useState<"idle" | "loading" | "found" | "not_found">("idle");

    const handleSearch = () => {
        if (!searchRef.trim()) return;
        setResult("loading");
        setTimeout(() => {
            if (searchRef.toUpperCase().includes("AGR") || searchRef.toUpperCase().includes("AMC")) {
                setResult("found");
            } else {
                setResult("not_found");
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Header */}
            <div className="bg-primary text-primary-foreground py-6 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <ShieldCheck className="w-8 h-8" />
                        <h1 className="text-2xl sm:text-3xl font-bold">Vérification AGASA-Pro</h1>
                    </div>
                    <p className="text-primary-foreground/80 text-sm sm:text-base">
                        Vérifiez l&apos;authenticité d&apos;un certificat d&apos;agrément sanitaire ou d&apos;une AMC.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Zone de recherche */}
                <Card className="shadow-lg border-2">
                    <CardContent className="p-8">
                        <div className="text-center mb-6">
                            <QrCode className="w-12 h-12 mx-auto text-primary mb-4" />
                            <h2 className="text-xl font-bold mb-2">Entrez le numéro du certificat</h2>
                            <p className="text-sm text-muted-foreground">
                                Scannez le QR code ou saisissez le numéro (ex: AGR-2026-00012 ou AMC-2026-0992)
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Input
                                placeholder="Ex: AGR-2026-00012"
                                className="h-14 text-lg font-mono text-center"
                                value={searchRef}
                                onChange={(e) => { setSearchRef(e.target.value); setResult("idle"); }}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <Button size="lg" className="h-14 px-8" onClick={handleSearch} disabled={result === "loading"}>
                                {result === "loading" ? (
                                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                ) : (
                                    <><Search className="w-5 h-5 mr-2" /> Vérifier</>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Résultat TROUVÉ */}
                {result === "found" && (
                    <Card className="mt-8 shadow-lg border-2 border-success/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardContent className="p-8">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-10 h-10 text-success" />
                                </div>
                                <h3 className="text-2xl font-bold text-success">Certificat Authentique ✅</h3>
                                <p className="text-muted-foreground mt-1">Ce document est valide et enregistré auprès de l&apos;AGASA.</p>
                            </div>

                            <div className="bg-muted/30 rounded-xl p-6 divide-y space-y-0">
                                <div className="flex justify-between py-3"><span className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> N° Certificat</span><span className="font-bold font-mono">{searchRef.toUpperCase()}</span></div>
                                <div className="flex justify-between py-3"><span className="text-muted-foreground flex items-center gap-2"><Building2 className="w-4 h-4" /> Opérateur</span><span className="font-bold">Restaurant Le Baobab</span></div>
                                <div className="flex justify-between py-3"><span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Établissement</span><span className="font-bold">Quartier Louis, Libreville</span></div>
                                <div className="flex justify-between py-3"><span className="text-muted-foreground">Catégorie</span><Badge variant="outline">AS CAT 2</Badge></div>
                                <div className="flex justify-between py-3"><span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Délivré le</span><span className="font-bold">10 Janvier 2026</span></div>
                                <div className="flex justify-between py-3"><span className="text-muted-foreground">Expire le</span><span className="font-bold">10 Janvier 2027</span></div>
                                <div className="flex justify-between py-3 items-center">
                                    <span className="text-muted-foreground flex items-center gap-2"><Star className="w-4 h-4" /> Score Smiley</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">😊</span>
                                        <span className="font-bold text-lg">4/5</span>
                                        <span className="text-sm text-muted-foreground">— Bonne conformité</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs text-muted-foreground mt-6">
                                Vérification effectuée le {new Date().toLocaleDateString("fr-FR")} à {new Date().toLocaleTimeString("fr-FR")}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Résultat NON TROUVÉ */}
                {result === "not_found" && (
                    <Card className="mt-8 shadow-lg border-2 border-destructive/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardContent className="p-8 text-center">
                            <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-10 h-10 text-destructive" />
                            </div>
                            <h3 className="text-2xl font-bold text-destructive">Certificat Non Trouvé ❌</h3>
                            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                                Le numéro « <span className="font-mono font-bold">{searchRef}</span> » ne correspond à aucun certificat enregistré dans notre base de données.
                            </p>
                            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mt-6 text-sm text-left">
                                <p className="font-bold text-destructive mb-2">⚠️ Attention :</p>
                                <p>Si ce certificat vous a été présenté par un opérateur, il s'agit possiblement d'un document frauduleux. Contactez l'AGASA au <strong>+241 XX XX XX XX</strong> pour signaler.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer info */}
                <div className="text-center mt-12 text-sm text-muted-foreground">
                    <p>Ce service est fourni par l&apos;Agence Gabonaise de Sécurité Alimentaire (AGASA).</p>
                    <p className="mt-1">Pour toute question, contactez-nous au <strong>+241 XX XX XX XX</strong>.</p>
                </div>
            </div>
        </div>
    );
}
