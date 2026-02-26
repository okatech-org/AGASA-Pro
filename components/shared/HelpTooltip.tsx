"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";

interface HelpTooltipProps {
    content: string;
}

export function HelpTooltip({ content }: HelpTooltipProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative inline-flex items-center ml-2">
            <button
                type="button"
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Aide"
            >
                <HelpCircle className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-64 p-3 mt-2 text-sm bg-popover text-popover-foreground rounded-md shadow-md border animate-in fade-in zoom-in-95 left-1/2 -translate-x-1/2 top-full md:left-full md:-translate-x-0 md:top-1/2 md:-translate-y-1/2 md:ml-2">
                    {content}
                </div>
            )}
        </div>
    );
}
