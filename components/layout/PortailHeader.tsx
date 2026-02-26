"use client";

import Link from "next/link";
import {
    Bell,
    Search,
    Menu,
    ShieldCheck,
    User,
    Settings,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { PortailSidebar } from "./PortailSidebar";
import { useDemoUser } from "@/components/shared/DemoUserProvider";

export function PortailHeader() {
    const { operateur, isLoading } = useDemoUser();

    const raisonSociale = operateur?.raisonSociale || "Chargement...";
    const ville = operateur?.ville || "";
    const isDemo = operateur?.isDemo ?? true;

    return (
        <header className="sticky top-8 z-40 flex w-full h-16 shrink-0 items-center justify-between border-b bg-card px-4 shadow-sm md:px-6">

            {/* Mobile : Logo et Menu Hamburger */}
            <div className="flex items-center gap-3 md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[280px]">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Menu de navigation</SheetTitle>
                        </SheetHeader>
                        <div className="h-full overflow-y-auto pb-20">
                            <PortailSidebar />
                        </div>
                    </SheetContent>
                </Sheet>

                <Link href="/tableau-de-bord" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                        AG
                    </div>
                    <span className="font-bold truncate max-w-[120px]">AGASA-Pro</span>
                </Link>
            </div>

            {/* Desktop : Search Bar */}
            <div className="hidden md:flex flex-1 items-center gap-4 md:ml-4 lg:ml-8 lg:max-w-[500px]">
                <form className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher un dossier, certificat, facture..."
                        className="w-full bg-background pl-9 h-10 border-muted focus-visible:ring-primary"
                    />
                </form>
            </div>

            {/* Spacer for mobile */}
            <div className="flex-1 md:hidden"></div>

            {/* Actions et Profil */}
            <div className="flex items-center gap-2 md:gap-4">
                {isDemo && (
                    <div className="hidden lg:flex items-center gap-2 bg-success/20 text-success px-3 py-1.5 rounded-full text-xs font-semibold border border-success/30">
                        <ShieldCheck className="w-4 h-4" />
                        MODE DÉMO
                    </div>
                )}

                <Button variant="ghost" size="icon" className="relative hover:bg-muted text-muted-foreground hover:text-foreground" asChild>
                    <Link href="/notifications">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Link>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full md:w-auto md:px-2 md:py-1 md:h-auto gap-2">
                            <span className="hidden md:flex flex-col items-end text-sm">
                                <span className="font-semibold leading-none text-foreground">{raisonSociale}</span>
                                <span className="text-xs text-muted-foreground mt-1">{ville}</span>
                            </span>
                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border shadow-sm">
                                <AvatarImage src="" alt={raisonSociale} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {raisonSociale.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal border-b pb-2">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{raisonSociale}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {operateur?.email || ""}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuGroup className="pt-2">
                            <DropdownMenuItem asChild>
                                <Link href="/profil">
                                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Mon profil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/paiements">
                                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Paiements</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                            <Link href="/">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Se déconnecter</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
