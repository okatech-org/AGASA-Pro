"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, AlertCircle, Check } from "lucide-react";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR"); }
function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

const STATUT_BADGES: Record<string, { label: string; color: string }> = {
    en_attente: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
    confirme: { label: "Confirmé", color: "bg-green-100 text-green-700" },
    echoue: { label: "Échoué", color: "bg-red-100 text-red-700" },
    rembourse: { label: "Remboursé", color: "bg-gray-100 text-gray-600" },
};

export default function AdminPaiementsPage() {
    const paiements = useQuery(api.admin.queries.listAllPaiements, {});
    const confirmer = useMutation(api.admin.mutations.confirmerVirement);

    if (paiements === undefined) {
        return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-[#1B4F72] border-t-transparent rounded-full animate-spin" /></div>;
    }

    const confirmed = paiements.filter((p: any) => p.statut === "confirme");
    const pending = paiements.filter((p: any) => p.statut === "en_attente");
    const totalMois = confirmed.reduce((s: number, p: any) => s + p.montant, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold">💰 Réconciliation paiements</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="shadow-sm"><CardContent className="p-4">
                    <Wallet className="w-5 h-5 text-[#1B4F72] mb-2" />
                    <p className="text-2xl font-extrabold">{formatMoney(totalMois)}</p>
                    <p className="text-xs text-muted-foreground">Total encaissé</p>
                </CardContent></Card>
                <Card className="shadow-sm"><CardContent className="p-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 mb-2" />
                    <p className="text-2xl font-extrabold">{pending.length}</p>
                    <p className="text-xs text-muted-foreground">En attente de réconciliation</p>
                </CardContent></Card>
                <Card className="shadow-sm"><CardContent className="p-4">
                    <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
                    <p className="text-2xl font-extrabold">{paiements.length > 0 ? Math.round((confirmed.length / paiements.length) * 100) : 100}%</p>
                    <p className="text-xs text-muted-foreground">Taux de succès</p>
                </CardContent></Card>
            </div>

            <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50"><tr className="border-b">
                                <th className="text-left p-3 text-xs font-semibold">Date</th>
                                <th className="text-left p-3 text-xs font-semibold">Réf.</th>
                                <th className="text-left p-3 text-xs font-semibold">Opérateur</th>
                                <th className="text-left p-3 text-xs font-semibold hidden md:table-cell">Type</th>
                                <th className="text-right p-3 text-xs font-semibold">Montant</th>
                                <th className="text-left p-3 text-xs font-semibold hidden md:table-cell">Mode</th>
                                <th className="text-left p-3 text-xs font-semibold">Statut</th>
                                <th className="text-right p-3 text-xs font-semibold">Action</th>
                            </tr></thead>
                            <tbody>
                                {paiements.map((p: any) => {
                                    const badge = STATUT_BADGES[p.statut] || { label: p.statut, color: "bg-gray-100" };
                                    return (
                                        <tr key={p._id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-3 text-xs">{formatDate(p.datePaiement)}</td>
                                            <td className="p-3 font-mono text-xs">{p.referenceTransaction}</td>
                                            <td className="p-3 font-medium">{p.operateurNom}</td>
                                            <td className="p-3 text-xs hidden md:table-cell">{p.typePrestation}</td>
                                            <td className="p-3 text-right font-bold">{formatMoney(p.montant)}</td>
                                            <td className="p-3 text-xs hidden md:table-cell">{p.modePaiement}</td>
                                            <td className="p-3"><Badge className={`${badge.color} text-[10px]`}>{badge.label}</Badge></td>
                                            <td className="p-3 text-right">
                                                {p.statut === "en_attente" && p.modePaiement === "virement" && (
                                                    <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => confirmer({ paiementId: p._id })}>
                                                        <Check className="w-3 h-3" /> Confirmer
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
