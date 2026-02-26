"use client";

import { Check, Circle, Loader2 } from "lucide-react";

export type EtapeProgression = {
    etape: string;
    label: string;
    description?: string;
    date?: string;
    commentaire?: string;
};

type ProgressionEtapesProps = {
    etapes: EtapeProgression[];
    etapeActuelle: string;
    orientation?: "vertical" | "horizontal";
    size?: "sm" | "md" | "lg";
    className?: string;
};

export function ProgressionEtapes({
    etapes,
    etapeActuelle,
    orientation = "vertical",
    size = "md",
    className = "",
}: ProgressionEtapesProps) {
    const currentIndex = etapes.findIndex(e => e.etape === etapeActuelle);

    const sizeConfig = {
        sm: { icon: "w-6 h-6", text: "text-xs", title: "text-sm", gap: "gap-3" },
        md: { icon: "w-8 h-8", text: "text-sm", title: "text-base", gap: "gap-4" },
        lg: { icon: "w-10 h-10", text: "text-base", title: "text-lg", gap: "gap-5" },
    }[size];

    if (orientation === "horizontal") {
        return (
            <div className={`flex items-center justify-between w-full ${className}`}>
                {etapes.map((etape, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isFuture = index > currentIndex;

                    return (
                        <div key={etape.etape} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                                <div className={`${sizeConfig.icon} rounded-full flex items-center justify-center font-bold ${isCompleted ? "bg-green-500 text-white" :
                                        isCurrent ? "bg-blue-500 text-white ring-4 ring-blue-200" :
                                            "bg-gray-200 text-gray-400"
                                    }`}>
                                    {isCompleted ? <Check className="w-4 h-4" /> :
                                        isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                            <Circle className="w-3 h-3" />}
                                </div>
                                <span className={`mt-1 ${sizeConfig.text} font-medium text-center max-w-[80px] ${isCurrent ? "text-blue-600" : isFuture ? "text-muted-foreground" : "text-green-600"
                                    }`}>
                                    {etape.label}
                                </span>
                            </div>
                            {index < etapes.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 ${index < currentIndex ? "bg-green-500" : "bg-gray-200"
                                    }`} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Orientation verticale (défaut)
    return (
        <div className={`space-y-0 ${className}`}>
            {etapes.map((etape, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isFuture = index > currentIndex;
                const isLast = index === etapes.length - 1;

                return (
                    <div key={etape.etape} className={`flex ${sizeConfig.gap}`}>
                        {/* Timeline verticale */}
                        <div className="flex flex-col items-center">
                            <div className={`${sizeConfig.icon} rounded-full flex items-center justify-center font-bold shrink-0 transition-all ${isCompleted ? "bg-green-500 text-white" :
                                    isCurrent ? "bg-blue-500 text-white ring-4 ring-blue-100 shadow-md" :
                                        "bg-gray-200 text-gray-400"
                                }`}>
                                {isCompleted ? <Check className="w-4 h-4" /> :
                                    isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                        <span className="text-xs">{index + 1}</span>}
                            </div>
                            {!isLast && (
                                <div className={`w-0.5 flex-1 min-h-[40px] ${isCompleted ? "bg-green-500" : "bg-gray-200"
                                    }`} />
                            )}
                        </div>

                        {/* Contenu */}
                        <div className={`pb-6 ${isCurrent ? "" : ""}`}>
                            <div className={`rounded-xl p-4 ${isCurrent ? "bg-blue-50 border-2 border-blue-200 shadow-sm" :
                                    isCompleted ? "bg-green-50/50" :
                                        "opacity-60"
                                }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`${sizeConfig.title} font-semibold ${isCurrent ? "text-blue-700" :
                                            isCompleted ? "text-green-700" :
                                                "text-muted-foreground"
                                        }`}>
                                        {isCompleted ? "✅" : isCurrent ? "🔵" : "⚪"} Étape {index + 1} — {etape.label}
                                    </span>
                                </div>
                                {etape.date && (
                                    <p className={`${sizeConfig.text} text-muted-foreground`}>
                                        {etape.date}
                                    </p>
                                )}
                                {etape.description && (
                                    <p className={`${sizeConfig.text} mt-1 ${isCurrent ? "text-blue-600 font-medium" : "text-muted-foreground"
                                        }`}>
                                        {etape.description}
                                    </p>
                                )}
                                {etape.commentaire && isCurrent && (
                                    <div className="mt-2 bg-blue-100 rounded-lg p-2.5">
                                        <p className="text-sm text-blue-800 font-medium">
                                            💡 {etape.commentaire}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
