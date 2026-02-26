"use client";

import { useState } from "react";
import {
    DollarSign,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    Download,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const MOCK_PAIEMENTS = [
    { ref: "PAY-2026-000289", date: "18 Fév 2026", type: "Analyse", montant: 140000, mode: "Airtel Money", statut: "confirme" },
    { ref: "PAY-2026-000234", date: "20 Fév 2026", type: "Importation", montant: 625000, mode: "Airtel Money", statut: "confirme" },
    { ref: "PAY-2026-000112", date: "10 Jan 2026", type: "Agrément", montant: 250000, mode: "Moov Money", statut: "confirme" },
];

export default function PaiementsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const total = MOCK_PAIEMENTS.reduce((a, p) => a + p.montant, 0);

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Paiements</h1>
                    <p className="text-muted-foreground mt-1">Historique complet de vos transactions.</p>
                </div>
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className="shadow-sm bg-success/5 border-success/20">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-extrabold text-success">{new Intl.NumberFormat("fr-FR").format(total)}</p>
                        <p className="text-xs text-muted-foreground mt-1">FCFA total payé</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-extrabold">{MOCK_PAIEMENTS.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">Transactions</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-extrabold text-success">100%</p>
                        <p className="text-xs text-muted-foreground mt-1">Confirmés</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="border-b pb-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Rechercher par référence, type..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filtrer</Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground text-xs uppercase border-b font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Référence</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Mode</th>
                                    <th className="px-6 py-3 text-right">Montant</th>
                                    <th className="px-6 py-3 text-center">Statut</th>
                                    <th className="px-6 py-3 text-right">Reçu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {MOCK_PAIEMENTS.map((p) => (
                                    <tr key={p.ref} className="hover:bg-muted/50">
                                        <td className="px-6 py-3 font-mono text-xs font-semibold">{p.ref}</td>
                                        <td className="px-6 py-3 text-muted-foreground">{p.date}</td>
                                        <td className="px-6 py-3"><Badge variant="outline">{p.type}</Badge></td>
                                        <td className="px-6 py-3 text-muted-foreground text-xs">{p.mode}</td>
                                        <td className="px-6 py-3 text-right font-bold">{new Intl.NumberFormat("fr-FR").format(p.montant)} F</td>
                                        <td className="px-6 py-3 text-center">
                                            <Badge className="bg-success/10 text-success border-success/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Confirmé</Badge>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                                        </td>
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
