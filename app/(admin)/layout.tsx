import { ContextualPageHero } from "@/components/layout/ContextualPageHero";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="px-4 pt-6">
                <ContextualPageHero compact />
            </div>
            {children}
        </div>
    );
}
