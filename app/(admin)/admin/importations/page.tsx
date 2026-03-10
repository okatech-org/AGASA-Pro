"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Ship } from "lucide-react";
import { useFirebaseSession } from "@/lib/useFirebaseSession";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR"); }
function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

export default function AdminImportationsPage() {
    const { uid, isLoading: authLoading } = useFirebaseSession();
    const importations = useQuery(api.admin.queries.listAllImportations, uid ? { adminFirebaseUid: uid } : "skip");

    if (authLoading || importations === undefined) {
        return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-[#1B4F72] border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (!uid) {
        return <div className="text-sm text-muted-foreground">Connexion administrateur requise.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold">📦 Suivi des importations</h1>
                <p className="text-sm text-muted-foreground">{importations.length} dossiers</p>
            </div>
            <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50"><tr className="border-b">
                                <th className="text-left p-3 text-xs font-semibold">N° dossier</th>
                                <th className="text-left p-3 text-xs font-semibold">Opérateur</th>
                                <th className="text-left p-3 text-xs font-semibold hidden md:table-cell">Port</th>
                                <th className="text-left p-3 text-xs font-semibold hidden md:table-cell">Pays</th>
                                <th className="text-center p-3 text-xs font-semibold hidden lg:table-cell">Cont.</th>
                                <th className="text-right p-3 text-xs font-semibold hidden lg:table-cell">Montant</th>
                                <th className="text-left p-3 text-xs font-semibold">Étape</th>
                                <th className="text-left p-3 text-xs font-semibold hidden md:table-cell">Date</th>
                            </tr></thead>
                            <tbody>
                                {importations.map((imp: any) => (
                                    <tr key={imp._id} className="border-b last:border-0 hover:bg-muted/30">
                                        <td className="p-3 font-mono text-xs">{imp.numeroDossier}</td>
                                        <td className="p-3 font-medium">{imp.operateurNom}</td>
                                        <td className="p-3 text-xs hidden md:table-cell"><Ship className="w-3 h-3 inline mr-1" />{imp.portArrivee}</td>
                                        <td className="p-3 text-xs hidden md:table-cell">{imp.paysOrigine}</td>
                                        <td className="p-3 text-center hidden lg:table-cell">{imp.nombreConteneurs}</td>
                                        <td className="p-3 text-right hidden lg:table-cell font-semibold">{formatMoney(imp.montantTotal)}</td>
                                        <td className="p-3"><Badge variant="outline" className="text-[10px]">{imp.etapeActuelle}</Badge></td>
                                        <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{formatDate(imp.dateCreation)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
