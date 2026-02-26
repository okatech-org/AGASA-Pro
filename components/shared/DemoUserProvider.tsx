"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Profils démo disponibles
export const DEMO_PROFILES = [
    { firebaseUid: "demo-restaurateur", label: "🍽️ Mme Nguema — Restaurateur (CAT 2)", shortLabel: "Restaurateur" },
    { firebaseUid: "demo-importateur", label: "📦 M. Mba — Importateur (CAT 1)", shortLabel: "Importateur" },
    { firebaseUid: "demo-distributeur", label: "🌿 M. Nzé — Distributeur Intrants (CAT 2)", shortLabel: "Distributeur" },
    { firebaseUid: "demo-epicier", label: "🏪 Mme Ondo — Épicier (CAT 3)", shortLabel: "Épicier" },
    { firebaseUid: "demo-industriel", label: "🏭 M. Obiang — Industriel (CAT 1)", shortLabel: "Industriel" },
] as const;

type DemoProfile = typeof DEMO_PROFILES[number];

type Operateur = {
    _id: any;
    firebaseUid: string;
    email?: string;
    telephone?: string;
    raisonSociale: string;
    rccm: string;
    nif: string;
    typeOperateur: string;
    activites: string[];
    adresseSiege: string;
    ville: string;
    province: string;
    representantNom: string;
    representantPrenom: string;
    representantTelephone: string;
    modulesActifs: string[];
    statut: string;
    isDemo: boolean;
    dateCreation: number;
    dateModification: number;
};

type DemoUserContextType = {
    operateur: Operateur | null | undefined;
    isLoading: boolean;
    currentProfile: DemoProfile;
    switchProfile: (uid: string) => void;
    firebaseUid: string;
};

const DemoUserContext = createContext<DemoUserContextType | null>(null);

export function DemoUserProvider({ children }: { children: ReactNode }) {
    const [currentUid, setCurrentUid] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("agasa-demo-uid") || "demo-restaurateur";
        }
        return "demo-restaurateur";
    });

    const operateur = useQuery(api.auth.getMyProfile, { firebaseUid: currentUid });

    const currentProfile = DEMO_PROFILES.find(p => p.firebaseUid === currentUid) || DEMO_PROFILES[0];

    const switchProfile = (uid: string) => {
        setCurrentUid(uid);
        if (typeof window !== "undefined") {
            localStorage.setItem("agasa-demo-uid", uid);
        }
    };

    return (
        <DemoUserContext.Provider
            value={{
                operateur: operateur as Operateur | null | undefined,
                isLoading: operateur === undefined,
                currentProfile,
                switchProfile,
                firebaseUid: currentUid,
            }}
        >
            {children}
        </DemoUserContext.Provider>
    );
}

export function useDemoUser() {
    const ctx = useContext(DemoUserContext);
    if (!ctx) throw new Error("useDemoUser must be used within DemoUserProvider");
    return ctx;
}

// Composant de sélection de profil démo (barre flottante en haut)
export function DemoProfileSwitcher() {
    const { currentProfile, switchProfile } = useDemoUser();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider">DÉMO</span>
                    <span className="hidden sm:inline">Mode démonstration — Sélectionnez un profil opérateur</span>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                    >
                        <span>{currentProfile.shortLabel}</span>
                        <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                            {DEMO_PROFILES.map((profile) => (
                                <button
                                    key={profile.firebaseUid}
                                    onClick={() => { switchProfile(profile.firebaseUid); setIsOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${currentProfile.firebaseUid === profile.firebaseUid
                                            ? "bg-primary/5 text-primary font-semibold"
                                            : "text-gray-700"
                                        }`}
                                >
                                    {profile.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
