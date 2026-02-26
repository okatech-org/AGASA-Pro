"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Search, FlaskConical, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

function formatMoney(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

export default function CatalogueAnalysesPage() {
    const catalogue = useQuery(api.analyses.queries.getCatalogueAnalyses, {});
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState<string>("all");
    const [panier, setPanier] = useState<Set<string>>(new Set());

    if (catalogue === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const items = catalogue || [];
    const categories = [...new Set(items.map((i: any) => i.categorie))];
    const filtered = items.filter((i: any) => {
        const matchSearch = !search || i.nom.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "all" || i.categorie === filterCat;
        return matchSearch && matchCat;
    });

    const panierItems = items.filter((i: any) => panier.has(i._id));
    const totalPanier = panierItems.reduce((s: number, i: any) => s + i.tarif, 0);

    const togglePanier = (id: string) => {
        const next = new Set(panier);
        if (next.has(id)) next.delete(id); else next.add(id);
        setPanier(next);
    };

    const catLabels: Record<string, string> = {
        microbiologique: "🦠 Microbiologique", chimique: "⚗️ Chimique",
        physique: "📐 Physique", organoleptique: "👃 Organoleptique",
    };

    return (
        <div className="space-y-6 px-4 md:px-0">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/analyses"><ArrowLeft className="w-5 h-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">📋 Catalogue des Analyses</h1>
                    <p className="text-sm text-muted-foreground">{items.length} paramètres disponibles</p>
                </div>
            </div>

            {/* Recherche + filtres */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Rechercher par nom ou code..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <Button variant={filterCat === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterCat("all")}>Tous</Button>
                    {categories.map((cat: any) => (
                        <Button key={cat} variant={filterCat === cat ? "default" : "outline"} size="sm" onClick={() => setFilterCat(cat)}>
                            {catLabels[cat] || cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Liste */}
            <div className="space-y-2">
                {filtered.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <FlaskConical className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>Aucun résultat pour &quot;{search}&quot;</p>
                    </div>
                ) : (
                    filtered.map((item: any) => {
                        const inPanier = panier.has(item._id);
                        return (
                            <Card key={item._id} className={`shadow-sm cursor-pointer transition-all ${inPanier ? "border-primary bg-primary/5" : "hover:shadow-md"}`} onClick={() => togglePanier(item._id)}>
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-muted-foreground">{item.code}</span>
                                            <Badge variant="outline" className="text-[10px]">{catLabels[item.categorie] || item.categorie}</Badge>
                                        </div>
                                        <p className="font-medium text-sm mt-0.5 truncate">{item.nom}</p>
                                        <p className="text-xs text-muted-foreground">{item.methode} — {item.delaiJours}j</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-3">
                                        <span className="font-bold text-sm whitespace-nowrap">{formatMoney(item.tarif)}</span>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${inPanier ? "bg-primary border-primary text-white" : "border-muted-foreground/30"}`}>
                                            {inPanier && <Check className="w-3.5 h-3.5" />}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Panier flottant */}
            {panier.size > 0 && (
                <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:max-w-md bg-primary text-primary-foreground rounded-xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="font-bold">{panier.size} analyse(s)</span>
                        </div>
                        <span className="text-lg font-extrabold">{formatMoney(totalPanier)}</span>
                    </div>
                    <Button asChild variant="secondary" className="w-full font-bold">
                        <Link href={`/analyses/nouvelle?params=${[...panier].join(",")}`}>
                            Commander ces analyses →
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
