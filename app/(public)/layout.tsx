import { ContextualPageHero } from "@/components/layout/ContextualPageHero";

// Simplification temporaire pour les autres pages publiques 
// qui ne sont pas la page d'accueil (qui a son propre design complet)
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-muted/20 flex-col">
            <main className="flex-1 w-full relative z-0">
                <ContextualPageHero />
                {children}
            </main>
        </div>
    );
}
