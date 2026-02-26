"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDemoUser } from "@/components/shared/DemoUserProvider";
import { ScoreSmiley } from "@/components/shared/ScoreSmiley";
import { AgrementCard } from "@/components/shared/AgrementCard";
import { ProgressionEtapes, type EtapeProgression } from "@/components/shared/ProgressionEtapes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Package, FlaskConical, Leaf, GraduationCap, CreditCard, Bell,
    Phone, BookOpen, ClipboardList, TrendingUp, Clock, FileText,
    ArrowRight, Sparkles, MoreHorizontal,
} from "lucide-react";

// ============================================================
// Utilitaires
// ============================================================

function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(ts: number) {
    return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatMoney(amount: number) {
    return amount.toLocaleString("fr-FR") + " FCFA";
}

function getStatusBadge(statut: string) {
    const config: Record<string, { label: string; className: string }> = {
        amc_delivree: { label: "AMC délivrée", className: "bg-green-100 text-green-700" },
        en_traitement: { label: "En traitement", className: "bg-blue-100 text-blue-700" },
        brouillon: { label: "Brouillon", className: "bg-gray-100 text-gray-600" },
        paiement_en_attente: { label: "En attente de paiement", className: "bg-yellow-100 text-yellow-700" },
        inspection_physique: { label: "Inspection", className: "bg-orange-100 text-orange-700" },
        refuse: { label: "Refusé", className: "bg-red-100 text-red-700" },
        soumis: { label: "Soumis", className: "bg-blue-100 text-blue-700" },
        termine: { label: "Terminé", className: "bg-green-100 text-green-700" },
    };
    const c = config[statut] || { label: statut, className: "bg-gray-100 text-gray-600" };
    return <Badge className={`${c.className} hover:${c.className}`}>{c.label}</Badge>;
}

// ============================================================
// DASHBOARD RESTAURATEUR / ÉPICIER / COMMERÇANT (CAT 2/3, simple)
// ============================================================

function DashboardSimple({ data }: { data: any }) {
    const { operateur } = data;
    const agrement = data.agrements?.[0];
    const isEpicier = operateur.typeOperateur === "commercant";
    const isInProgress = agrement?.etapeActuelle && agrement.etapeActuelle !== "agree" && agrement.etapeActuelle !== "refuse";

    // Étapes pour la barre de progression (épicier/commercial)
    const etapesProgression: EtapeProgression[] = agrement ? [
        {
            etape: "soumis",
            label: "Dossier soumis",
            description: "Vos documents ont été envoyés",
            date: agrement.historiqueEtapes?.find((e: any) => e.etape === "soumis")?.date
                ? formatDateShort(agrement.historiqueEtapes.find((e: any) => e.etape === "soumis").date) : undefined,
        },
        {
            etape: "paye",
            label: "Paiement reçu",
            description: `Votre paiement de ${formatMoney(agrement.montant)} a été confirmé`,
            date: agrement.historiqueEtapes?.find((e: any) => e.etape === "paye")?.date
                ? formatDateShort(agrement.historiqueEtapes.find((e: any) => e.etape === "paye").date) : undefined,
        },
        {
            etape: "verification_documents",
            label: "Documents vérifiés",
            description: "Vos documents sont conformes",
            date: agrement.historiqueEtapes?.find((e: any) => e.etape === "verification_documents")?.date
                ? formatDateShort(agrement.historiqueEtapes.find((e: any) => e.etape === "verification_documents").date) : undefined,
        },
        {
            etape: "inspection_programmee",
            label: "Inspection programmée",
            description: agrement.inspectionProgrammee?.commentaire || "Un inspecteur visitera votre établissement",
            date: agrement.historiqueEtapes?.find((e: any) => e.etape === "inspection_programmee")?.date
                ? formatDateShort(agrement.historiqueEtapes.find((e: any) => e.etape === "inspection_programmee").date) : undefined,
            commentaire: isInProgress && agrement.etapeActuelle === "inspection_programmee" ? "Préparez votre établissement pour la visite !" : undefined,
        },
        {
            etape: "agree",
            label: "Décision",
            description: "L'AGASA prendra sa décision après l'inspection",
        },
    ] : [];

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* Message d'accueil */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 md:p-6">
                <h1 className={`${isEpicier ? "text-xl" : "text-lg"} md:text-2xl font-bold text-green-800`}>
                    Bonjour, {operateur.representantPrenom === operateur.representantNom ? operateur.raisonSociale : `${operateur.representantPrenom === "Marie-Claire" ? "Mme" : operateur.representantPrenom === "Paulette" ? "Mme" : "M."} ${operateur.representantNom}`} 👋
                </h1>
                <p className="text-green-700 mt-1 text-base">
                    {data.etablissements?.[0]?.nom || operateur.raisonSociale} — {operateur.ville}
                </p>
                <p className="text-green-600 text-sm mt-1">
                    {formatDate(Date.now())}
                </p>
            </div>

            {/* Score Smiley (proéminent pour restaurateur, en attente pour épicier) */}
            <ScoreSmiley
                score={data.scoreSmiley}
                variant="large"
                showHelp={true}
                showProgress={true}
            />

            {/* Section principale — Agrément */}
            <div>
                <h2 className="text-lg font-semibold mb-3">
                    {isInProgress ? "📋 Votre demande d'agrément" : "📜 Mon Agrément"}
                </h2>

                {isInProgress ? (
                    /* Barre de progression verticale — cas épicier/demande en cours */
                    <Card className="shadow-md border-blue-200 bg-blue-50/30">
                        <CardContent className="p-5 space-y-4">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                🔵 Demande en cours de traitement
                            </Badge>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">N° dossier</span>
                                <span className="font-mono font-semibold">{agrement.numeroDossier}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Catégorie</span>
                                <span className="font-medium">{agrement.categorie === "AS_CAT_3" ? "AS CAT 3 — Commerce alimentaire" : agrement.categorie === "AS_CAT_2" ? "AS CAT 2 — Restaurant" : agrement.categorie}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Montant payé</span>
                                <span className="font-semibold">{formatMoney(agrement.montant)}</span>
                            </div>

                            <ProgressionEtapes
                                etapes={etapesProgression}
                                etapeActuelle={agrement.etapeActuelle}
                                orientation="vertical"
                                size={isEpicier ? "lg" : "md"}
                                className="mt-4"
                            />

                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                                <p className="text-sm text-green-800 font-medium">
                                    ✅ Votre dossier avance bien ! Vous serez prévenu(e) par SMS à chaque étape.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <AgrementCard
                        agrement={agrement ? {
                            _id: agrement._id,
                            numeroDossier: agrement.numeroDossier,
                            categorie: agrement.categorie,
                            etapeActuelle: agrement.etapeActuelle,
                            dateExpiration: agrement.dateExpiration,
                            certificat: agrement.certificat,
                            etablissementNom: data.etablissements?.[0]?.nom,
                        } : null}
                    />
                )}
            </div>

            {/* Section Inspections (résumé compact) */}
            {data.inspections.length > 0 && (
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-muted-foreground" />
                            Mes Inspections
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{data.inspections.length} inspection(s) reçue(s)</p>
                        {data.inspections.slice(0, 2).map((insp: any, i: number) => (
                            <div key={i} className="flex items-center justify-between py-2 border-t first:border-t-0">
                                <div>
                                    <p className="text-sm font-medium">{formatDateShort(insp.dateInspection)}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{insp.typeInspection.replace("_", " ")}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={`text-xs ${insp.resultat === "conforme" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                        {insp.resultat === "conforme" ? "Conforme" : "Non conforme"}
                                    </Badge>
                                    {insp.scoreAttribue && (
                                        <span className="text-xs text-muted-foreground">{insp.scoreAttribue}/5</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Button asChild variant="ghost" size="sm" className="w-full mt-2">
                            <Link href="/mon-dossier">Voir le détail <ArrowRight className="w-4 h-4 ml-1" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Section Alertes */}
            {data.alertesNonLues > 0 && (
                <Card className="shadow-sm border-orange-200 bg-orange-50/30">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-medium">{data.alertesNonLues} alerte(s) non lue(s)</span>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/alertes">Voir <ArrowRight className="w-4 h-4 ml-1" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Section Aide */}
            <Card className="shadow-sm bg-muted/30">
                <CardContent className="p-5 space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Besoin d&apos;aide ?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        📞 Appelez le <span className="font-semibold text-foreground">+241 11 76 99 99</span> (Helpdesk AGASA)
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                        <BookOpen className="w-4 h-4" />
                        Consultez nos tutoriels
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

// ============================================================
// DASHBOARD IMPORTATEUR (CAT 1, riche)
// ============================================================

function DashboardImportateur({ data }: { data: any }) {
    const { operateur } = data;
    const agrement = data.agrements?.[0];

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* Accueil */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold">Bonjour, M. {operateur.representantNom}</h1>
                <p className="text-muted-foreground">{operateur.raisonSociale} — {operateur.ville}</p>
            </div>

            {/* 4 KPI */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Link href="/importation">
                    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-medium text-muted-foreground">Importations en cours</span>
                            </div>
                            <div className="text-2xl font-bold">{data.stats.importationsEnCours}</div>
                            {data.stats.importationsEnCours > 0 && (
                                <Badge className="bg-orange-100 text-orange-700 text-[10px] mt-1">Action requise</Badge>
                            )}
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/agrement">
                    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-medium text-muted-foreground">Agrément</span>
                            </div>
                            <div className="text-lg font-bold text-green-600">
                                {agrement?.etapeActuelle === "agree" ? "Actif ✅" : "En cours"}
                            </div>
                            {agrement?.dateExpiration && (
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    Expire le {formatDateShort(agrement.dateExpiration)}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/analyses">
                    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FlaskConical className="w-5 h-5 text-purple-600" />
                                <span className="text-xs font-medium text-muted-foreground">Analyses</span>
                            </div>
                            <div className="text-2xl font-bold">{data.commandesAnalyses.length}</div>
                            {data.stats.analysesResultats > 0 && (
                                <Badge className="bg-blue-100 text-blue-700 text-[10px] mt-1">Résultats dispo</Badge>
                            )}
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/paiements">
                    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-5 h-5 text-amber-600" />
                                <span className="text-xs font-medium text-muted-foreground">Paiements du mois</span>
                            </div>
                            <div className="text-lg font-bold">{formatMoney(data.stats.paiementsMois)}</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Importations récentes */}
            {data.importations.length > 0 && (
                <div>
                    <h2 className="text-base font-semibold mb-3">📦 Mes importations récentes</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3">
                        {data.importations.slice(0, 3).map((imp: any) => (
                            <Link key={imp._id} href={`/importation/${imp._id}`} className="min-w-[280px] md:min-w-0">
                                <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-sm font-semibold">{imp.numeroDossier}</span>
                                            {getStatusBadge(imp.etapeActuelle)}
                                        </div>
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <div className="flex justify-between">
                                                <span>Port</span>
                                                <span className="font-medium text-foreground">{imp.portArrivee}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Origine</span>
                                                <span className="font-medium text-foreground">{imp.paysOrigine}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Conteneurs</span>
                                                <span className="font-medium text-foreground">{imp.nombreConteneurs}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Montant</span>
                                                <span className="font-medium text-foreground">{formatMoney(imp.montantTotal)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions rapides */}
            <div>
                <h2 className="text-base font-semibold mb-3">⚡ Actions rapides</h2>
                <div className="grid grid-cols-1 gap-2">
                    <Button asChild variant="outline" className="justify-start gap-3 h-14 text-base font-semibold">
                        <Link href="/importation/nouvelle">
                            <Package className="w-5 h-5 text-blue-600" />
                            Nouvelle déclaration d&apos;importation
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start gap-3 h-14 text-base font-semibold">
                        <Link href="/analyses/nouvelle">
                            <FlaskConical className="w-5 h-5 text-purple-600" />
                            Commander une analyse
                        </Link>
                    </Button>
                    {agrement?.dateExpiration && (agrement.dateExpiration - Date.now()) / (24 * 60 * 60 * 1000) < 90 && (
                        <Button asChild variant="outline" className="justify-start gap-3 h-14 text-base font-semibold border-orange-300">
                            <Link href="/agrement/nouvelle-demande?type=renouvellement">
                                <FileText className="w-5 h-5 text-orange-600" />
                                Renouveler mon agrément
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Score Smiley compact */}
            <ScoreSmiley score={data.scoreSmiley} variant="compact" />
        </div>
    );
}

// ============================================================
// DASHBOARD DISTRIBUTEUR (CAT 2, module phyto)
// ============================================================

function DashboardDistributeur({ data }: { data: any }) {
    const { operateur } = data;
    const agrement = data.agrements?.[0];
    const licenceActive = data.licencesIntrants?.find((l: any) => l.statut === "delivre");

    return (
        <div className="space-y-6 px-4 md:px-0">
            <div>
                <h1 className="text-xl md:text-2xl font-bold">Bonjour, M. {operateur.representantNom}</h1>
                <p className="text-muted-foreground">{operateur.raisonSociale} — {operateur.ville}, {operateur.province}</p>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ClipboardList className="w-5 h-5 text-green-600" />
                            <span className="text-xs font-medium text-muted-foreground">Ma licence</span>
                        </div>
                        <div className="text-sm font-bold text-green-600">
                            {licenceActive ? "Active ✅" : "Aucune"}
                        </div>
                        {licenceActive?.dateExpiration && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                                Expire le {formatDateShort(licenceActive.dateExpiration)}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Link href="/phytosanitaire">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Leaf className="w-5 h-5 text-emerald-600" />
                                <span className="text-xs font-medium text-muted-foreground">Certificats phyto</span>
                            </div>
                            <div className="text-sm font-bold">
                                {data.stats.certificatsPhytoActifs} actifs, {data.stats.certificatsPhytoEnCours} en cours
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/agrement">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-xs font-medium text-muted-foreground">Agrément</span>
                            </div>
                            <div className="text-sm font-bold text-green-600">
                                {agrement?.etapeActuelle === "agree" ? "Actif ✅" : "En cours"}
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/paiements">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-5 h-5 text-amber-600" />
                                <span className="text-xs font-medium text-muted-foreground">Paiements récents</span>
                            </div>
                            <div className="text-lg font-bold">{formatMoney(data.stats.paiementsMois)}</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Certificats en cours */}
            {data.certificatsPhyto.length > 0 && (
                <div>
                    <h2 className="text-base font-semibold mb-3">🌿 Demandes en cours</h2>
                    {data.certificatsPhyto.filter((c: any) => c.statut !== "delivre" && c.statut !== "refuse").map((cert: any) => (
                        <Card key={cert._id} className="shadow-sm mb-2">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">{cert.numeroCertificat}</p>
                                    <p className="text-xs text-muted-foreground">{cert.produit}</p>
                                </div>
                                {getStatusBadge(cert.statut)}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Registre */}
            <Card className="shadow-sm bg-emerald-50/50 border-emerald-200">
                <CardContent className="p-4">
                    <Button asChild variant="outline" className="w-full gap-2 h-12 font-semibold border-emerald-300 text-emerald-700">
                        <Link href="/phytosanitaire/registre">
                            <BookOpen className="w-5 h-5" />
                            📖 Registre des produits phyto autorisés
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Actions rapides */}
            <div>
                <h2 className="text-base font-semibold mb-3">⚡ Actions rapides</h2>
                <div className="grid grid-cols-1 gap-2">
                    <Button asChild variant="outline" className="justify-start gap-3 h-12 font-semibold">
                        <Link href="/phytosanitaire/certificats/nouveau">
                            <Leaf className="w-5 h-5 text-emerald-600" />
                            Demander un certificat phyto
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start gap-3 h-12 font-semibold">
                        <Link href="/phytosanitaire/licences/renouveler">
                            <ClipboardList className="w-5 h-5 text-blue-600" />
                            Renouveler ma licence
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// DASHBOARD INDUSTRIEL (CAT 1, complet)
// ============================================================

function DashboardIndustriel({ data }: { data: any }) {
    const { operateur } = data;
    const agrement = data.agrements?.[0];

    return (
        <div className="space-y-6 px-4 md:px-0">
            <div>
                <h1 className="text-xl md:text-2xl font-bold">Bonjour, M. {operateur.representantNom}</h1>
                <p className="text-muted-foreground">{operateur.raisonSociale} — {operateur.ville}</p>
            </div>

            {/* 6 KPI */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/agrement">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <FileText className="w-4 h-4 text-green-600" />
                                <span className="text-[11px] text-muted-foreground">Agrément CAT 1</span>
                            </div>
                            <div className="text-sm font-bold text-green-600">Actif ✅</div>
                            <p className="text-[10px] text-muted-foreground">
                                Expire {agrement?.dateExpiration ? formatDateShort(agrement.dateExpiration) : "N/A"}
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/importation">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Package className="w-4 h-4 text-blue-600" />
                                <span className="text-[11px] text-muted-foreground">Importations</span>
                            </div>
                            <div className="text-lg font-bold">{data.stats.importationsEnCours} en cours</div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/analyses">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <FlaskConical className="w-4 h-4 text-purple-600" />
                                <span className="text-[11px] text-muted-foreground">Analyses</span>
                            </div>
                            <div className="text-lg font-bold">{data.commandesAnalyses.length}</div>
                            {data.stats.analysesResultats > 0 && (
                                <Badge className="bg-blue-100 text-blue-700 text-[10px]">Résultats</Badge>
                            )}
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/phytosanitaire">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Leaf className="w-4 h-4 text-emerald-600" />
                                <span className="text-[11px] text-muted-foreground">Phyto</span>
                            </div>
                            <div className="text-sm font-bold">{data.stats.certificatsPhytoActifs} certificats</div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/formation">
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <GraduationCap className="w-4 h-4 text-amber-600" />
                                <span className="text-[11px] text-muted-foreground">Formation</span>
                            </div>
                            <div className="text-sm font-bold">{data.stats.formationsProgression}% complété</div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-amber-500 h-1.5 rounded-full"
                                    style={{ width: `${data.stats.formationsProgression}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="shadow-sm">
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-base">{data.scoreSmiley === 5 ? "🤩" : data.scoreSmiley === 4 ? "😊" : "🙂"}</span>
                            <span className="text-[11px] text-muted-foreground">Score Smiley</span>
                        </div>
                        <div className="text-lg font-bold" style={{ color: data.scoreSmiley >= 4 ? "#27AE60" : "#F39C12" }}>
                            {data.scoreSmiley ?? "—"}/5
                        </div>
                        {data.scoreSmiley === 4 && (
                            <p className="text-[10px] text-amber-600">Encore 1pt pour le Label Premium !</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Timeline activité récente */}
            <div>
                <h2 className="text-base font-semibold mb-3">🕐 Activité récente</h2>
                <div className="space-y-2">
                    {data.commandesAnalyses.filter((c: any) => c.etapeActuelle === "resultats_disponibles").slice(0, 1).map((c: any) => (
                        <div key={c._id} className="flex items-center gap-3 p-3 bg-card rounded-lg border text-sm">
                            <FlaskConical className="w-4 h-4 text-purple-600 shrink-0" />
                            <span className="flex-1">Résultats d&apos;analyse disponibles ({c.numeroCommande})</span>
                            <span className="text-xs text-muted-foreground">{formatDateShort(c.dateCreation)}</span>
                        </div>
                    ))}
                    {data.inscriptionsFormation?.filter((f: any) => f.statut === "en_cours").slice(0, 1).map((f: any) => (
                        <div key={f._id} className="flex items-center gap-3 p-3 bg-card rounded-lg border text-sm">
                            <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="flex-1">Formation HACCP : {f.progression}% complété</span>
                            <span className="text-xs text-muted-foreground">En cours</span>
                        </div>
                    ))}
                    {data.certificatsPhyto?.filter((c: any) => c.statut === "delivre").slice(0, 1).map((c: any) => (
                        <div key={c._id} className="flex items-center gap-3 p-3 bg-card rounded-lg border text-sm">
                            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="flex-1">Certificat phyto {c.numeroCertificat} délivré</span>
                            <span className="text-xs text-muted-foreground">{c.dateDelivrance ? formatDateShort(c.dateDelivrance) : ""}</span>
                        </div>
                    ))}
                    {data.importations?.slice(0, 1).map((imp: any) => (
                        <div key={imp._id} className="flex items-center gap-3 p-3 bg-card rounded-lg border text-sm">
                            <Package className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="flex-1">Dossier {imp.numeroDossier} — {imp.etapeActuelle.replace(/_/g, " ")}</span>
                            <span className="text-xs text-muted-foreground">{formatDateShort(imp.dateCreation)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions rapides */}
            <div>
                <h2 className="text-base font-semibold mb-3">⚡ Actions rapides</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                        { href: "/importation/nouvelle", icon: Package, label: "Nouvelle importation", color: "text-blue-600" },
                        { href: "/analyses/nouvelle", icon: FlaskConical, label: "Commander une analyse", color: "text-purple-600" },
                        { href: "/phytosanitaire/certificats/nouveau", icon: Leaf, label: "Certificat phyto", color: "text-emerald-600" },
                        { href: "/formation", icon: GraduationCap, label: "Continuer formation", color: "text-amber-600" },
                        { href: "/agrement/nouvelle-demande?type=renouvellement", icon: FileText, label: "Renouveler agrément", color: "text-green-600" },
                        { href: "/mon-dossier", icon: ClipboardList, label: "Mon dossier complet", color: "text-gray-600" },
                    ].map((action, i) => (
                        <Button key={i} asChild variant="outline" className="flex-col items-center gap-2 h-20 text-xs font-semibold">
                            <Link href={action.href}>
                                <action.icon className={`w-5 h-5 ${action.color}`} />
                                {action.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// COMPOSANT PRINCIPAL — S'ADAPTE AU PROFIL
// ============================================================

export default function TableauDeBordPage() {
    const { operateur, isLoading, firebaseUid } = useDemoUser();
    const dashboardData = useQuery(api.operateurs.getDashboardData, { firebaseUid });

    if (isLoading || dashboardData === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Chargement de votre espace...</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center space-y-3">
                    <p className="text-lg font-semibold">Profil non trouvé</p>
                    <p className="text-sm text-muted-foreground">
                        Veuillez exécuter le script de seed Convex pour initialiser les données de démo.
                    </p>
                </div>
            </div>
        );
    }

    const typeOp = dashboardData.operateur.typeOperateur;

    // Router vers le bon dashboard selon le profil
    switch (typeOp) {
        case "importateur":
            return <DashboardImportateur data={dashboardData} />;
        case "distributeur_intrants":
            return <DashboardDistributeur data={dashboardData} />;
        case "industriel":
            return <DashboardIndustriel data={dashboardData} />;
        case "restaurateur":
        case "commercant":
        case "hotelier":
        case "boulanger":
        default:
            return <DashboardSimple data={dashboardData} />;
    }
}
