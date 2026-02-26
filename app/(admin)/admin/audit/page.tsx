"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ShieldAlert } from "lucide-react";
import { useState } from "react";

function formatDateTime(ts: number) { return new Date(ts).toLocaleString("fr-FR"); }

export default function AdminAuditPage() {
    const logs = useQuery(api.admin.queries.getAuditLogs, {});
    const [search, setSearch] = useState("");

    if (logs === undefined) {
        return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-[#1B4F72] border-t-transparent rounded-full animate-spin" /></div>;
    }

    const filtered = logs.filter((l: any) =>
        !search || (l.action || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.userName || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.details || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold">📝 Journal d&apos;audit</h1>
                <p className="text-sm text-muted-foreground">{logs.length} entrées</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-sm text-amber-800">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                Les journaux d&apos;audit sont protégés. Aucune modification possible. Rétention : 7 ans.
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher dans les logs..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50"><tr className="border-b">
                                <th className="text-left p-3 text-xs font-semibold">Date/Heure</th>
                                <th className="text-left p-3 text-xs font-semibold">Utilisateur</th>
                                <th className="text-left p-3 text-xs font-semibold hidden md:table-cell">Type</th>
                                <th className="text-left p-3 text-xs font-semibold">Action</th>
                                <th className="text-left p-3 text-xs font-semibold hidden lg:table-cell">Module</th>
                                <th className="text-left p-3 text-xs font-semibold hidden lg:table-cell">Détails</th>
                            </tr></thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Aucun log trouvé.</td></tr>
                                ) : (
                                    filtered.slice(0, 50).map((log: any, i: number) => (
                                        <tr key={log._id || i} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-3 text-xs font-mono text-muted-foreground">{formatDateTime(log.dateAction)}</td>
                                            <td className="p-3 font-medium text-sm">{log.userName || "Système"}</td>
                                            <td className="p-3 hidden md:table-cell"><Badge variant="outline" className="text-[10px]">{log.userType || "admin"}</Badge></td>
                                            <td className="p-3 text-sm">{log.action}</td>
                                            <td className="p-3 hidden lg:table-cell"><Badge variant="outline" className="text-[10px]">{log.module}</Badge></td>
                                            <td className="p-3 text-xs text-muted-foreground hidden lg:table-cell truncate max-w-[200px]">{log.details}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
