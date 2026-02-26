"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users, FileText, Package, Wallet, Trophy, AlertTriangle,
    TrendingUp, TrendingDown,
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Area, AreaChart,
} from "recharts";

function formatMoney(n: number) { return n.toLocaleString("fr-FR"); }

const COLORS = ["#1B4F72", "#2E86C1", "#48C9B0", "#F39C12", "#E74C3C"];

export default function AdminDashboardPage() {
    const stats = useQuery(api.admin.queries.getAdminDashboardStats, {});

    if (stats === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-[#1B4F72] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Données pour les graphiques
    const provinceData = Object.entries(stats.parProvince || {})
        .map(([name, value]) => ({ name, value: value as number }))
        .sort((a, b) => b.value - a.value);

    const categorieData = Object.entries(stats.parCategorie || {})
        .map(([name, value]) => ({ name, value: value as number }));

    const pipelineData = [
        { etape: "Brouillon", count: stats.pipeline?.brouillon || 0 },
        { etape: "Soumis", count: stats.pipeline?.soumis || 0 },
        { etape: "Payé", count: stats.pipeline?.paye || 0 },
        { etape: "Vérif. docs", count: stats.pipeline?.verification_documents || 0 },
        { etape: "Inspection", count: stats.pipeline?.inspection_programmee || 0 },
        { etape: "Décision", count: stats.pipeline?.decision_en_cours || 0 },
        { etape: "Agréé", count: stats.pipeline?.agree || 0 },
    ];

    const revPilierData = Object.entries(stats.revParPilier || {})
        .map(([name, value]) => ({ name, value: value as number }));

    return (
        <div className="space-y-6">
            {/* KPI MACRO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-[#1B4F72]" />
                            <Badge className="bg-green-100 text-green-700 text-[10px]">+{stats.nouveauxMois} ce mois</Badge>
                        </div>
                        <p className="text-2xl font-extrabold">{stats.totalOperateurs}</p>
                        <p className="text-xs text-muted-foreground">Opérateurs inscrits</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-5 h-5 text-[#1B4F72]" />
                            <span className="text-xs text-muted-foreground">{stats.agrementsEnCours} en traitement</span>
                        </div>
                        <p className="text-2xl font-extrabold">{stats.agrementsActifs}</p>
                        <p className="text-xs text-muted-foreground">Agréments actifs</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <Package className="w-5 h-5 text-[#1B4F72] mb-2" />
                        <p className="text-2xl font-extrabold">{stats.importationsEnCours}</p>
                        <p className="text-xs text-muted-foreground">Importations en cours</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Wallet className="w-5 h-5 text-[#1B4F72]" />
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-2xl font-extrabold">{formatMoney(stats.revenusMois)}</p>
                        <p className="text-xs text-muted-foreground">Revenus encaissés ce mois</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <Trophy className="w-5 h-5 text-[#1B4F72] mb-2" />
                        <p className="text-2xl font-extrabold">{stats.tauxRecouvrement}%</p>
                        <p className="text-xs text-muted-foreground">Taux recouvrement amendes</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <AlertTriangle className="w-5 h-5 text-[#1B4F72]" />
                            {stats.alertesEnAttente > 0 && <Badge className="bg-red-500 text-white text-xs">{stats.alertesEnAttente}</Badge>}
                        </div>
                        <p className="text-2xl font-extrabold">{stats.alertesEnAttente}</p>
                        <p className="text-xs text-muted-foreground">Alertes en attente</p>
                    </CardContent>
                </Card>
            </div>

            {/* GRAPHIQUES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenus par pilier */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">Revenus par pilier (ce mois)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={revPilierData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(v) => v != null ? formatMoney(Number(v)) + " FCFA" : ""} />
                                <Bar dataKey="value" fill="#1B4F72" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Agréments par catégorie */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">Agréments par catégorie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={categorieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}>
                                    {categorieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Opérateurs par province */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">Opérateurs par province</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={provinceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fontSize: 11 }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#2E86C1" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* PIPELINE AGRÉMENTS */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Pipeline des agréments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 overflow-x-auto">
                        {pipelineData.map((step, i) => (
                            <div key={i} className="flex-1 min-w-[100px] text-center">
                                <div className={`h-2 rounded-full mb-2 ${step.count > 0 ? "bg-[#1B4F72]" : "bg-muted"}`} />
                                <p className="text-2xl font-extrabold">{step.count}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{step.etape}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ACTIVITÉ RÉCENTE */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.recentLogs.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">Aucune activité récente.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b">
                                    <th className="text-left p-2 text-xs text-muted-foreground">Date</th>
                                    <th className="text-left p-2 text-xs text-muted-foreground">Utilisateur</th>
                                    <th className="text-left p-2 text-xs text-muted-foreground">Action</th>
                                    <th className="text-left p-2 text-xs text-muted-foreground">Module</th>
                                </tr></thead>
                                <tbody>
                                    {stats.recentLogs.map((log: any, i: number) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="p-2 text-xs text-muted-foreground">{new Date(log.dateAction).toLocaleDateString("fr-FR")}</td>
                                            <td className="p-2 font-medium">{log.userName || log.userId?.substring(0, 8)}</td>
                                            <td className="p-2">{log.action}</td>
                                            <td className="p-2"><Badge variant="outline" className="text-[10px]">{log.module}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
