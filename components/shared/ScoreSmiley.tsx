"use client";

import { HelpCircle } from "lucide-react";
import { useState } from "react";

const SMILEY_CONFIG: Record<number, { emoji: string; label: string; color: string; bgColor: string }> = {
    0: { emoji: "😡", label: "Non conforme", color: "#E74C3C", bgColor: "bg-red-50" },
    1: { emoji: "😟", label: "Insuffisant", color: "#E67E22", bgColor: "bg-orange-50" },
    2: { emoji: "😐", label: "À améliorer", color: "#F39C12", bgColor: "bg-yellow-50" },
    3: { emoji: "🙂", label: "Conformité acceptable", color: "#F39C12", bgColor: "bg-yellow-50" },
    4: { emoji: "😊", label: "Bonne conformité", color: "#27AE60", bgColor: "bg-green-50" },
    5: { emoji: "🤩", label: "Excellence — Label Premium", color: "#1B6B3A", bgColor: "bg-emerald-50" },
};

type ScoreSmileyProps = {
    score: number | null | undefined;
    variant?: "large" | "compact" | "mini";
    showHelp?: boolean;
    showProgress?: boolean;
    className?: string;
};

export function ScoreSmiley({ score, variant = "large", showHelp = true, showProgress = true, className = "" }: ScoreSmileyProps) {
    const [helpOpen, setHelpOpen] = useState(false);

    // Score null = pas encore inspecté
    if (score === null || score === undefined) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <span className="text-3xl">⏳</span>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Score Smiley</p>
                    <p className="text-xs text-muted-foreground">En attente de la première inspection</p>
                </div>
            </div>
        );
    }

    const config = SMILEY_CONFIG[Math.min(Math.max(Math.round(score), 0), 5)];

    if (variant === "mini") {
        return (
            <div className={`flex items-center gap-1.5 ${className}`}>
                <span className="text-lg">{config.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: config.color }}>{score}/5</span>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <span className="text-2xl">{config.emoji}</span>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: config.color }}>{score}/5</span>
                        <span className="text-xs text-muted-foreground">{config.label}</span>
                    </div>
                    {showProgress && (
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div
                                    key={i}
                                    className="h-1.5 w-6 rounded-full"
                                    style={{ backgroundColor: i <= score ? config.color : "#E5E7EB" }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Variant "large" (défaut)
    return (
        <div className={`${config.bgColor} rounded-2xl p-6 text-center relative ${className}`}>
            <div className="text-5xl mb-3">{config.emoji}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: config.color }}>
                {score}/5
            </div>
            <p className="text-sm font-medium" style={{ color: config.color }}>
                {config.label}
            </p>

            {showProgress && (
                <div className="flex justify-center gap-2 mt-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className="h-3 w-10 rounded-full transition-all"
                            style={{ backgroundColor: i <= score ? config.color : "#E5E7EB" }}
                        />
                    ))}
                </div>
            )}

            {showHelp && (
                <>
                    <button
                        onClick={() => setHelpOpen(!helpOpen)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    {helpOpen && (
                        <div className="mt-4 bg-white/80 rounded-lg p-3 text-left text-xs text-muted-foreground">
                            <p className="font-medium text-foreground mb-1">❓ Qu&apos;est-ce que le Score Smiley ?</p>
                            <p>Ce score est mis à jour après chaque inspection par l&apos;AGASA. Il est visible par vos clients et reflète le niveau d&apos;hygiène de votre établissement.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
