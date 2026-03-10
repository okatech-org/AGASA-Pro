"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, MoreVertical, Eye, UserCheck, UserX, Bell } from "lucide-react";
import { useState } from "react";
import { useFirebaseSession } from "@/lib/useFirebaseSession";

function formatDate(ts: number) { return new Date(ts).toLocaleDateString("fr-FR"); }

const TYPE_BADGES: Record<string, { icon: string; label: string; color: string }> = {
    restaurateur: { icon: "🍽️", label: "Restaurateur", color: "bg-orange-100 text-orange-700" },
    importateur: { icon: "📦", label: "Importateur", color: "bg-blue-100 text-blue-700" },
    industriel: { icon: "🏭", label: "Industriel", color: "bg-purple-100 text-purple-700" },
    distributeur_intrants: { icon: "🌿", label: "Distributeur", color: "bg-green-100 text-green-700" },
    commercant: { icon: "🏪", label: "Commerçant", color: "bg-yellow-100 text-yellow-700" },
    transporteur: { icon: "🚛", label: "Transporteur", color: "bg-cyan-100 text-cyan-700" },
    boulanger: { icon: "🍞", label: "Boulanger", color: "bg-amber-100 text-amber-700" },
};

const STATUT_BADGES: Record<string, { label: string; color: string }> = {
    actif: { label: "Actif", color: "bg-green-100 text-green-700" },
    suspendu: { label: "Suspendu", color: "bg-red-100 text-red-700" },
    en_attente_verification: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
    desactive: { label: "Désactivé", color: "bg-gray-100 text-gray-500" },
};

export default function AdminOperateursPage() {
    const { uid, isLoading: authLoading } = useFirebaseSession();
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("");
    const [filterStatut, setFilterStatut] = useState<string>("");
    const [filterProvince, setFilterProvince] = useState<string>("");

    const operateurs = useQuery(
        api.admin.queries.listOperateurs,
        uid
            ? {
                adminFirebaseUid: uid,
                typeOperateur: filterType || undefined,
                province: filterProvince || undefined,
                statut: filterStatut || undefined,
            }
            : "skip"
    );

    const updateStatus = useMutation(api.admin.mutations.updateOperateurStatus);

    if (authLoading || operateurs === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-[#1B4F72] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!uid) {
        return <div className="text-sm text-muted-foreground">Connexion administrateur requise.</div>;
    }

    const filtered = operateurs.filter((o: any) =>
        !search || o.raisonSociale.toLowerCase().includes(search.toLowerCase()) ||
        o.rccm.toLowerCase().includes(search.toLowerCase()) ||
        o.nif.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold">👥 Gestion des opérateurs</h1>
                    <p className="text-sm text-muted-foreground">{operateurs.length} opérateurs enregistrés</p>
                </div>
                <Button variant="outline" className="text-sm">📥 Export CSV</Button>
            </div>

            {/* Recherche + filtres */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Rechercher par nom, RCCM ou NIF..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="border rounded-md px-3 py-2 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="">Tous les types</option>
                    {Object.entries(TYPE_BADGES).map(([key, val]) => (
                        <option key={key} value={key}>{val.icon} {val.label}</option>
                    ))}
                </select>
                <select className="border rounded-md px-3 py-2 text-sm" value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
                    <option value="">Tous statuts</option>
                    <option value="actif">Actifs</option>
                    <option value="suspendu">Suspendus</option>
                    <option value="en_attente_verification">En attente</option>
                </select>
            </div>

            {/* Table */}
            <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="text-left p-3 font-semibold text-xs">Raison sociale</th>
                                    <th className="text-left p-3 font-semibold text-xs">Type</th>
                                    <th className="text-left p-3 font-semibold text-xs hidden lg:table-cell">RCCM</th>
                                    <th className="text-left p-3 font-semibold text-xs hidden md:table-cell">Province</th>
                                    <th className="text-center p-3 font-semibold text-xs hidden lg:table-cell">Étab.</th>
                                    <th className="text-center p-3 font-semibold text-xs hidden lg:table-cell">Agr.</th>
                                    <th className="text-left p-3 font-semibold text-xs">Statut</th>
                                    <th className="text-left p-3 font-semibold text-xs hidden md:table-cell">Inscription</th>
                                    <th className="text-right p-3 font-semibold text-xs">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((op: any) => {
                                    const typeBadge = TYPE_BADGES[op.typeOperateur] || { icon: "📋", label: op.typeOperateur, color: "bg-gray-100 text-gray-700" };
                                    const statutBadge = STATUT_BADGES[op.statut] || { label: op.statut, color: "bg-gray-100 text-gray-500" };

                                    return (
                                        <tr key={op._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="p-3 font-medium">{op.raisonSociale}</td>
                                            <td className="p-3">
                                                <Badge className={`${typeBadge.color} text-[10px]`}>{typeBadge.icon} {typeBadge.label}</Badge>
                                            </td>
                                            <td className="p-3 font-mono text-xs text-muted-foreground hidden lg:table-cell">{op.rccm}</td>
                                            <td className="p-3 text-xs hidden md:table-cell">{op.province}</td>
                                            <td className="p-3 text-center hidden lg:table-cell">{op.nbEtablissements}</td>
                                            <td className="p-3 text-center hidden lg:table-cell">{op.nbAgrements}</td>
                                            <td className="p-3">
                                                <Badge className={`${statutBadge.color} text-[10px]`}>{statutBadge.label}</Badge>
                                            </td>
                                            <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{formatDate(op.dateCreation)}</td>
                                            <td className="p-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                                        <Link href={`/admin/operateurs/${op._id}`}><Eye className="w-4 h-4" /></Link>
                                                    </Button>
                                                    {op.statut === "actif" ? (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => updateStatus({ adminFirebaseUid: uid, operateurId: op._id, statut: "suspendu" })}>
                                                            <UserX className="w-4 h-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" onClick={() => updateStatus({ adminFirebaseUid: uid, operateurId: op._id, statut: "actif" })}>
                                                            <UserCheck className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
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
