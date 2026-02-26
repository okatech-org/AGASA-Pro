import { PortailSidebar } from "@/components/layout/PortailSidebar";
import { PortailHeader } from "@/components/layout/PortailHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { DemoUserProvider, DemoProfileSwitcher } from "@/components/shared/DemoUserProvider";

export default function PortailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DemoUserProvider>
            {/* Barre de sélection de profil démo */}
            <DemoProfileSwitcher />

            <div className="flex min-h-screen bg-muted/30 pt-8">
                {/* Sidebar Desktop/Tablette */}
                <PortailSidebar />

                <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                    {/* Header (Top) */}
                    <PortailHeader />

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto md:p-6 lg:p-8 pb-24 md:pb-6 relative z-0">
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            {children}
                        </div>
                    </main>

                    {/* Mobile Bottom Navigation */}
                    <MobileNav />
                </div>
            </div>
        </DemoUserProvider>
    );
}

