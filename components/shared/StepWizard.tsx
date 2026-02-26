"use client";

import * as React from "react";
import { Check } from "lucide-react";

interface StepWizardProps {
    steps: { title: string; subtitle?: string }[];
    currentStep: number;
}

export function StepWizard({ steps, currentStep }: StepWizardProps) {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full"></div>
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = currentStep > index;
                    const isCurrent = currentStep === index;

                    return (
                        <div key={index} className="flex flex-col items-center relative z-10 bg-background px-2">
                            <div
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 transition-colors duration-300 ${isCompleted
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : isCurrent
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "bg-background border-muted text-muted-foreground"
                                    }`}
                            >
                                {isCompleted ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : index + 1}
                            </div>
                            <div className="mt-2 text-center max-w-[80px] md:max-w-[100px]">
                                <div
                                    className={`text-xs md:text-sm font-semibold ${isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                >
                                    {step.title}
                                </div>
                                {step.subtitle && (
                                    <div className="text-[10px] md:text-xs text-muted-foreground hidden md:block mt-1">
                                        {step.subtitle}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
