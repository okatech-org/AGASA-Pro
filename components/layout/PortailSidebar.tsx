"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    FileText,
    Package,
    Leaf,
    FlaskConical,
    FolderOpen,
    AlertTriangle,
    CreditCard,
    GraduationCap,
    User,
    LogOut,
    HelpCircle,
    ChevronRight,
    ShieldCheck,
    Award,
    Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoUser } from "@/components/shared/DemoUserProvider";

type ModuleItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    requiredModule?: string;
    subItems?: { name: string; href: string }[];
    star?: boolean;
};

function getNavigationForProfile(modulesActifs: string[], scoreSmiley: number | null): { section: string; items: ModuleItem[] }[] {
    const navigation: { section: string; items: ModuleItem[] }[] = [
        {
            section: "PRINCIPAL",
            items: [
                { name: "Tableau de bord", href: "/tableau-de-bord", icon: Home },
                { name: "Notifications", href: "/notifications", icon: Bell },
            ]
        },
        {
            section: "MES DÉMARCHES",
            items: [
                {
                    name: "Agrément",
                    href: "/agrement",
                    icon: FileText,
                    requiredModule: "agrement",
                    subItems: [
                        { name: "Mon certificat", href: "/agrement" },
                        { name: "Renouveler", href: "/agrement/nouvelle-demande?type=renouvellement" },
                    ]
                },
                {
                    name: "Importation",
                    href: "/importation",
                    icon: Package,
                    requiredModule: "importation",
                    star: true,
                    subItems: [
                        { name: "Mes importations", href: "/importation" },
                        { name: "Nouvelle déclaration", href: "/importation/nouvelle" },
                        { name: "Suivi dossiers", href: "/importation" },
                    ]
                },
                {
                    name: "Phytosanitaire",
                    href: "/phytosanitaire",
                    icon: Leaf,
                    requiredModule: "phytosanitaire",
                    star: true,
                    subItems: [
                        { name: "Certificats", href: "/phytosanitaire/certificats" },
                        { name: "Licences", href: "/phytosanitaire/licences" },
                        { name: "Registre des produits", href: "/phytosanitaire/registre" },
                    ]
                },
                {
                    name: "Analyses",
                    href: "/analyses",
                    icon: FlaskConical,
                    requiredModule: "analyses",
                    subItems: [
                        { name: "Mes commandes", href: "/analyses" },
                        { name: "Commander", href: "/analyses/nouvelle" },
                        { name: "Catalogue", href: "/analyses/catalogue" },
                    ]
                },
                {
                    name: "Formation HACCP",
                    href: "/formation",
                    icon: GraduationCap,
                    requiredModule: "formation",
                    subItems: [
                        { name: "Mon parcours", href: "/formation" },
                        { name: "Mes certifications", href: "/formation/certifications" },
                    ]
                },
            ]
        },
        {
            section: "MON ESPACE",
            items: [
                { name: "Mon Dossier", href: "/mon-dossier", icon: FolderOpen, requiredModule: "mon_dossier" },
                { name: "Alertes", href: "/alertes", icon: AlertTriangle },
                { name: "Paiements", href: "/paiements", icon: CreditCard },
            ]
        },
        {
            section: "MON COMPTE",
            items: [
                { name: "Mon Profil", href: "/profil", icon: User },
                ...(scoreSmiley === 5 ? [{ name: "Label Premium", href: "/label-premium", icon: Award }] : []),
                { name: "Aide", href: "#", icon: HelpCircle },
            ]
        }
    ];

    return navigation;
}

export function PortailSidebar() {
    const pathname = usePathname();
    const { operateur, isLoading } = useDemoUser();

    const modulesActifs = operateur?.modulesActifs || [];
    const scoreSmiley = null; // Will be wired later with real data
    const isDemo = operateur?.isDemo ?? true;

    const NAVIGATION = getNavigationForProfile(modulesActifs, scoreSmiley);

    return (
        <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r bg-card h-screen sticky top-8 overflow-y-auto">
            {/* Logo Area */}
            <div className="p-6 border-b sticky top-0 bg-card z-10">
                <Link href="/tableau-de-bord" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--agasa-emerald)] to-[var(--agasa-blue)] flex items-center justify-center text-white font-bold shadow-[var(--shadow-glow)]">
                        AG
                    </div>
                    <div>
                        <span className="font-serif font-bold text-lg leading-none block text-foreground">AGASA</span>
                        <span className="text-caption text-muted-foreground">Portail Opérateur</span>
                    </div>
                </Link>
            </div>

            {/* Bandeau Démo */}
            {isDemo && (
                <div className="bg-[var(--agasa-emerald)]/14 text-[var(--agasa-emerald)] p-3 text-xs flex flex-col gap-1 mx-4 mt-4 rounded-xl border border-[var(--agasa-emerald)]/20">
                    <div className="flex items-center gap-2 font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        MODE DÉMONSTRATION
                    </div>
                    <span className="opacity-80">Les paiements et soumissions ne sont pas réels.</span>
                </div>
            )}

            {/* Profil court */}
            {operateur && (
                <div className="mx-4 mt-4 p-3 bg-muted/50 rounded-xl">
                    <p className="text-sm font-semibold text-foreground truncate">{operateur.raisonSociale}</p>
                    <p className="text-caption text-muted-foreground">{operateur.ville}, {operateur.province}</p>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-8">
                {NAVIGATION.map((group, i) => {
                    const filteredItems = group.items.filter(item =>
                        !item.requiredModule || modulesActifs.includes(item.requiredModule)
                    );

                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={i}>
                            <h3 className="text-overline text-muted-foreground mb-3 px-3">
                                {group.section}
                            </h3>
                            <ul className="space-y-1">
                                {filteredItems.map((item, j) => {
                                    const isActive = pathname.startsWith(item.href);
                                    const Icon = item.icon;

                                    return (
                                        <li key={j}>
                                            <Link
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-nav transition-all duration-200 ${isActive
                                                    ? "bg-[var(--agasa-emerald)]/14 text-[var(--agasa-emerald)] font-semibold shadow-sm"
                                                    : "text-foreground hover:bg-muted"
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.8} />
                                                <span className="flex-1">{item.name}</span>
                                                {item.star && (
                                                    <span className="text-[var(--agasa-gold)] text-xs">★</span>
                                                )}
                                                {item.subItems && (
                                                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-200 ${isActive ? "rotate-90" : ""}`} />
                                                )}
                                            </Link>

                                            {isActive && item.subItems && (
                                                <ul className="mt-1 ml-9 pl-3 border-l-2 border-[var(--agasa-emerald)]/20 space-y-1">
                                                    {item.subItems.map((sub, k) => (
                                                        <li key={k}>
                                                            <Link
                                                                href={sub.href}
                                                                className={`block py-1.5 px-3 text-sm rounded-lg transition-colors duration-200 ${pathname === sub.href
                                                                    ? "text-[var(--agasa-emerald)] font-medium bg-[var(--agasa-emerald)]/5"
                                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                                    }`}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </nav>

            {/* Footer / User Area */}
            <div className="p-4 border-t sticky bottom-0 bg-card z-10 space-y-2">
                <Button variant="ghost" asChild className="w-full justify-start gap-2 h-12 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl">
                    <Link href="/">
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </Link>
                </Button>
            </div>
        </aside>
    );
}
