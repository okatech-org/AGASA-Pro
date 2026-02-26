"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    FileText,
    FolderOpen,
    AlertTriangle,
    User,
    Package,
    Leaf,
    MoreHorizontal,
    Bell,
    FlaskConical,
    GraduationCap,
} from "lucide-react";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { useState } from "react";

type NavItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
    special?: boolean;
};

function getMobileNavForProfile(typeOperateur: string, modulesActifs: string[], alertesNonLues: number): NavItem[] {
    const base: NavItem[] = [
        { name: "Accueil", href: "/tableau-de-bord", icon: Home },
    ];

    if (typeOperateur === "restaurateur" || typeOperateur === "commercant" || typeOperateur === "hotelier" || typeOperateur === "boulanger") {
        // CAT 2/3 simples: Accueil | Agrément | Dossier | Alertes | Profil
        return [
            ...base,
            { name: "Agrément", href: "/agrement", icon: FileText },
            { name: "Dossier", href: "/mon-dossier", icon: FolderOpen },
            { name: "Alertes", href: "/alertes", icon: AlertTriangle, badge: alertesNonLues || undefined },
            { name: "Profil", href: "/profil", icon: User },
        ];
    }

    if (typeOperateur === "importateur") {
        return [
            ...base,
            { name: "Import", href: "/importation", icon: Package },
            { name: "Agrément", href: "/agrement", icon: FileText },
            { name: "Alertes", href: "/alertes", icon: AlertTriangle, badge: alertesNonLues || undefined },
            { name: "Profil", href: "/profil", icon: User },
        ];
    }

    if (typeOperateur === "distributeur_intrants") {
        return [
            ...base,
            { name: "Phyto", href: "/phytosanitaire", icon: Leaf },
            { name: "Agrément", href: "/agrement", icon: FileText },
            { name: "Alertes", href: "/alertes", icon: AlertTriangle, badge: alertesNonLues || undefined },
            { name: "Profil", href: "/profil", icon: User },
        ];
    }

    if (typeOperateur === "industriel") {
        // "Plus" menu for secondary modules
        return [
            ...base,
            { name: "Import", href: "/importation", icon: Package },
            { name: "Agrément", href: "/agrement", icon: FileText },
            { name: "Alertes", href: "/alertes", icon: AlertTriangle, badge: alertesNonLues || undefined },
            { name: "Plus", href: "#more", icon: MoreHorizontal },
        ];
    }

    // Default
    return [
        ...base,
        { name: "Agrément", href: "/agrement", icon: FileText },
        { name: "Dossier", href: "/mon-dossier", icon: FolderOpen },
        { name: "Alertes", href: "/alertes", icon: AlertTriangle, badge: alertesNonLues || undefined },
        { name: "Profil", href: "/profil", icon: User },
    ];
}

export function MobileNav() {
    const pathname = usePathname();
    const { operateur } = useDemoUser();
    const [moreOpen, setMoreOpen] = useState(false);

    const typeOperateur = operateur?.typeOperateur || "autre";
    const modulesActifs = operateur?.modulesActifs || [];

    const NAV_ITEMS = getMobileNavForProfile(typeOperateur, modulesActifs, 0);

    const moreItems = [
        { name: "Analyses", href: "/analyses", icon: FlaskConical, module: "analyses" },
        { name: "Phyto", href: "/phytosanitaire", icon: Leaf, module: "phytosanitaire" },
        { name: "Formation", href: "/formation", icon: GraduationCap, module: "formation" },
        { name: "Dossier", href: "/mon-dossier", icon: FolderOpen, module: "mon_dossier" },
        { name: "Profil", href: "/profil", icon: User },
    ].filter(item => !item.module || modulesActifs.includes(item.module));

    return (
        <>
            {/* More menu overlay */}
            {moreOpen && (
                <div className="md:hidden fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
                    <div className="absolute bottom-[64px] right-2 bg-card rounded-xl shadow-xl border border-border p-2 w-48"
                        onClick={e => e.stopPropagation()}>
                        {moreItems.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
                                    onClick={() => setMoreOpen(false)}
                                >
                                    <Icon className="w-5 h-5 text-muted-foreground" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-background border-t border-border z-50 px-2 flex justify-between items-center shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)]">
                {NAV_ITEMS.map((item, i) => {
                    const isMore = item.href === "#more";
                    const isActive = !isMore && (
                        pathname === item.href ||
                        (item.href !== "/tableau-de-bord" && pathname.startsWith(item.href))
                    );
                    const Icon = item.icon;

                    if (isMore) {
                        return (
                            <button
                                key={i}
                                onClick={() => setMoreOpen(!moreOpen)}
                                className={`flex flex-col items-center justify-center w-16 h-full relative transition-colors ${moreOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-medium">Plus</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={i}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-16 h-full relative transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <div className="relative">
                                <Icon className={`w-6 h-6 mb-1 ${isActive ? "fill-primary/20 bg-primary/10 rounded-lg p-1 w-8 h-8 -mx-1" : ""}`} />
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-background">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
