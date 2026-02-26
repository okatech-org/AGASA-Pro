"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download, Share2, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }

export default function AMCPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: importIdStr } = use(params);
    const { firebaseUid, operateur } = useDemoUser();
    const data = useQuery(api.operateurs.getDashboardData, { firebaseUid });

    if (data === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const importation = data?.importations?.find((i: any) => i._id === importIdStr);

    if (!importation || !importation.amcNumero) {
        return (
            <div className="p-4 text-center py-16">
                <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-muted" />
                <h1 className="text-xl font-bold">AMC non disponible</h1>
                <p className="text-sm text-muted-foreground mt-2">Ce dossier n&apos;a pas encore reçu d&apos;Autorisation de Mise à la Consommation.</p>
                <Button asChild className="mt-4"><Link href={`/importation/${importIdStr}`}>Retour au dossier</Link></Button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href={`/importation/${importIdStr}`}><ArrowLeft className="w-4 h-4 mr-2" /> Retour au dossier</Link>
            </Button>

            {/* AMC officiel */}
            <div className="bg-white border-2 border-green-300 rounded-xl shadow-lg overflow-hidden print:shadow-none">
                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 text-center">
                    <p className="text-xs tracking-widest uppercase opacity-80">République Gabonaise</p>
                    <p className="text-xs tracking-widest uppercase opacity-80 mt-0.5">Union — Travail — Justice</p>
                    <div className="w-16 h-0.5 bg-white/40 mx-auto my-3" />
                    <h1 className="text-lg font-bold tracking-wide">AGENCE GABONAISE DE SÉCURITÉ ALIMENTAIRE</h1>
                </div>

                <div className="text-center py-6 border-b">
                    <h2 className="text-xl font-bold text-green-800">AUTORISATION DE MISE À LA CONSOMMATION (AMC)</h2>
                    <p className="text-sm text-muted-foreground mt-1">N° {importation.amcNumero}</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Opérateur</p>
                            <p className="font-bold mt-1">{operateur?.raisonSociale}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Dossier</p>
                            <p className="font-mono font-bold mt-1">{importation.numeroDossier}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Marchandise</p>
                            <p className="mt-1">{importation.descriptionMarchandise}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Port / Origine</p>
                            <p className="mt-1">{importation.portArrivee} — {importation.paysOrigine}</p>
                        </div>
                    </div>

                    <div className="text-center py-4 border-t">
                        <div className="inline-flex flex-col items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <div className="w-28 h-28 bg-white border rounded-lg flex items-center justify-center mb-2 shadow-inner">
                                <div className="grid grid-cols-5 gap-0.5 p-2">
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.4 ? "bg-gray-900" : "bg-white"}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Scannez pour vérifier via SYDONIA</p>
                            <p className="text-[10px] font-mono">{importation.amcQrCode || importation.amcNumero}</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-green-800">
                            <p className="font-semibold mb-1">Cette AMC autorise la mise à la consommation de la marchandise</p>
                            <p>Le QR code est transmis au système douanier SYDONIA pour faciliter le dédouanement.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 border-t p-4 text-center text-xs text-muted-foreground">
                    <p>AGASA — Décret n°000XX/PR — Vérification : agasa.ga/verifier/{importation.amcNumero}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center print:hidden">
                <Button size="lg" className="gap-2"><Download className="w-4 h-4" /> Télécharger</Button>
                <Button size="lg" variant="outline" className="gap-2"><Share2 className="w-4 h-4" /> Partager</Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => window.print()}><Printer className="w-4 h-4" /> Imprimer</Button>
            </div>
        </div>
    );
}
