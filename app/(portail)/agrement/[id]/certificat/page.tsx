"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Download, Share2, Printer, Shield, CheckCircle2,
} from "lucide-react";
import Link from "next/link";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }

export default function CertificatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: agrementIdStr } = use(params);
    const agrementId = agrementIdStr as Id<"agrements">;
    const agrement = useQuery(api.agrement.queries.getAgrement, { agrementId });

    if (agrement === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!agrement || !agrement.certificat) {
        return (
            <div className="p-4 sm:p-8 text-center py-16">
                <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-xl font-bold mb-2">Certificat non disponible</h1>
                <p className="text-muted-foreground mb-4">Ce dossier n&apos;a pas encore de certificat délivré.</p>
                <Button asChild><Link href="/agrement">Retour</Link></Button>
            </div>
        );
    }

    const cert = agrement.certificat;
    const daysRemaining = Math.ceil((cert.dateExpiration - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6">
            {/* Bouton retour */}
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href={`/agrement/${agrementIdStr}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour au dossier
                </Link>
            </Button>

            {/* Certificat officiel */}
            <div className="bg-white border-2 border-green-300 rounded-xl shadow-lg overflow-hidden print:shadow-none print:border">
                {/* En-tête officiel */}
                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 text-center">
                    <p className="text-xs tracking-widest uppercase opacity-80">République Gabonaise</p>
                    <p className="text-xs tracking-widest uppercase opacity-80 mt-0.5">Union — Travail — Justice</p>
                    <div className="w-16 h-0.5 bg-white/40 mx-auto my-3" />
                    <h1 className="text-lg font-bold tracking-wide">AGENCE GABONAISE DE SÉCURITÉ ALIMENTAIRE</h1>
                    <p className="text-xs opacity-80 mt-1">AGASA</p>
                </div>

                {/* Titre du certificat */}
                <div className="text-center py-6 border-b">
                    <h2 className="text-xl font-bold text-green-800 tracking-wide">CERTIFICAT D&apos;AGRÉMENT SANITAIRE</h2>
                    <p className="text-sm text-muted-foreground mt-1">N° {cert.numero}</p>
                </div>

                {/* Contenu */}
                <div className="p-6 space-y-6">
                    {/* Infos bénéficiaire */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Opérateur</p>
                            <p className="text-base font-bold mt-1">{agrement.operateurNom}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Établissement</p>
                            <p className="text-base font-bold mt-1">{agrement.etablissementNom}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Catégorie</p>
                            <p className="text-base font-semibold mt-1">{agrement.categorie}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Adresse</p>
                            <p className="text-base mt-1">{agrement.etablissementAdresse}</p>
                        </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Date de délivrance</p>
                            <p className="font-semibold mt-1">{formatDate(cert.dateDelivrance)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Date d&apos;expiration</p>
                            <p className="font-semibold mt-1">{formatDate(cert.dateExpiration)}</p>
                            {daysRemaining > 0 && daysRemaining <= 90 && (
                                <Badge className="bg-amber-100 text-amber-700 mt-1 text-xs">
                                    Expire dans {daysRemaining} jours
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* QR Code */}
                    <div className="text-center py-4">
                        <div className="inline-flex flex-col items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            {/* Simulated QR Code placeholder */}
                            <div className="w-32 h-32 bg-white border rounded-lg flex items-center justify-center mb-2 shadow-inner">
                                <div className="grid grid-cols-5 gap-0.5 p-2">
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.4 ? "bg-gray-900" : "bg-white"}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground max-w-[200px]">
                                Scannez ce QR code pour vérifier l&apos;authenticité de ce certificat
                            </p>
                            <p className="text-[10px] font-mono text-muted-foreground mt-1">{cert.qrCode}</p>
                        </div>
                    </div>

                    {/* Message pédagogique */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-green-800">
                            <p className="font-semibold mb-1">Affichez ce certificat dans votre établissement</p>
                            <p>Le QR code permet à vos clients et aux inspecteurs de vérifier votre conformité sanitaire en temps réel.</p>
                        </div>
                    </div>
                </div>

                {/* Pied officiel */}
                <div className="bg-gray-50 border-t p-4 text-center text-xs text-muted-foreground">
                    <p>Ce document est délivré par l&apos;AGASA conformément au Décret n°000XX/PR/AGASA</p>
                    <p className="mt-0.5">Toute contrefaçon sera poursuivie — Vérification en ligne : agasa.ga/verifier/{cert.qrCode}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center print:hidden">
                <Button size="lg" className="gap-2">
                    <Download className="w-4 h-4" /> Télécharger le PDF
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" /> Partager
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" /> Imprimer
                </Button>
            </div>
        </div>
    );
}
