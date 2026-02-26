"use client";

import { useState } from "react";
import {
    Bell,
    CheckCircle2,
    DollarSign,
    FileText,
    AlertTriangle,
    Info,
    Check,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const MOCK_NOTIFICATIONS = [
    { id: 1, titre: "Agrément délivré", message: "Votre certificat d'agrément sanitaire AGR-2026-00012 a été délivré. Vous pouvez le télécharger.", type: "info", lien: "/agrement/AGR-2026-00012/certificat", lu: false, date: "Il y a 2h" },
    { id: 2, titre: "Paiement confirmé", message: "Votre paiement de 250 000 FCFA pour l'agrément a été confirmé par Airtel Money.", type: "paiement", lu: false, date: "Il y a 5h" },
    { id: 3, titre: "Inspection programmée", message: "Une inspection de votre établissement 'Restaurant Le Baobab' est programmée le 25 Mars 2026.", type: "action", lu: true, date: "Hier" },
    { id: 4, titre: "Rappel : renouvellement agrément", message: "Votre agrément expire dans 60 jours. Pensez à le renouveler pour éviter toute interruption.", type: "rappel", lu: true, date: "Il y a 3 jours" },
    { id: 5, titre: "Alerte CEMAC", message: "Nouvelle alerte réglementaire concernant les produits laitiers importés. Consultez vos alertes.", type: "alerte", lien: "/alertes", lu: true, date: "Il y a 1 semaine" },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const nonLues = notifications.filter((n) => !n.lu).length;

    const getTypeConfig = (type: string) => {
        switch (type) {
            case "info": return { icon: Info, color: "text-blue-600", bg: "bg-blue-100" };
            case "paiement": return { icon: DollarSign, color: "text-success", bg: "bg-success/10" };
            case "action": return { icon: FileText, color: "text-primary", bg: "bg-primary/10" };
            case "rappel": return { icon: Bell, color: "text-amber-600", bg: "bg-amber-100" };
            case "alerte": return { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" };
            default: return { icon: Bell, color: "text-muted-foreground", bg: "bg-muted" };
        }
    };

    const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                    {nonLues > 0 && <p className="text-muted-foreground mt-1">{nonLues} notification{nonLues > 1 ? "s" : ""} non lue{nonLues > 1 ? "s" : ""}</p>}
                </div>
                {nonLues > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllRead}>
                        <Check className="w-4 h-4 mr-2" /> Tout marquer comme lu
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.map((notif) => {
                    const config = getTypeConfig(notif.type);
                    const Icon = config.icon;
                    const content = (
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-semibold text-sm ${!notif.lu ? "text-foreground" : "text-muted-foreground"}`}>{notif.titre}</h3>
                                    {!notif.lu && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                                <p className="text-xs text-muted-foreground mt-2">{notif.date}</p>
                            </div>
                        </CardContent>
                    );
                    return (
                        <Card key={notif.id} className={`transition-all hover:shadow-md ${!notif.lu ? "border-l-4 border-l-primary bg-primary/[0.02]" : ""}`}>
                            {notif.lien ? (
                                <Link href={notif.lien} className="block">{content}</Link>
                            ) : (
                                <div className="block">{content}</div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
