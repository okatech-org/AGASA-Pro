"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Eye, EyeOff } from "lucide-react";
import { useMutation } from "convex/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/convex/_generated/api";

type Method = "phone" | "email";

export default function ConnexionPage() {
    const router = useRouter();
    const enableDemoMode = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";
    const [method, setMethod] = useState<Method>(enableDemoMode ? "phone" : "email");
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const syncOperateur = useMutation(api.auth.syncOperateur);

    const handleLogin = async () => {
        setError(null);
        setIsLoading(true);
        try {
            if (method === "phone") {
                if (!enableDemoMode) {
                    throw new Error("Connexion téléphone indisponible hors mode démonstration.");
                }
                localStorage.setItem("agasa-demo-uid", "demo-restaurateur");
                router.push("/tableau-de-bord");
                return;
            }

            if (!auth) {
                throw new Error("Service d'authentification indisponible.");
            }
            const creds = await signInWithEmailAndPassword(auth, email.trim(), password);
            await syncOperateur({
                firebaseUid: creds.user.uid,
                email: creds.user.email || email.trim(),
            });
            router.push("/tableau-de-bord");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Connexion impossible";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4 shadow-lg">
                        <span className="text-2xl font-bold text-white tracking-widest leading-none">AGASA<span className="text-accent">-Pro</span></span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Connexion</h1>
                    <p className="text-muted-foreground mt-2">Accédez à votre espace opérateur sécurisé</p>
                </div>

                <Card className="shadow-xl border-border/50">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex bg-muted p-1 rounded-lg mb-6">
                            <button
                                className={`flex-1 py-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${method === "phone" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                disabled={!enableDemoMode}
                                onClick={() => {
                                    setMethod("phone");
                                    setOtpSent(false);
                                }}
                            >
                                <Phone className="w-4 h-4" />
                                Par téléphone
                            </button>
                            <button
                                className={`flex-1 py-3 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${method === "email" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                    }`}
                                onClick={() => setMethod("email")}
                            >
                                <Mail className="w-4 h-4" />
                                Par email
                            </button>
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 mb-4">{error}</p>
                        )}

                        <div className="min-h-[220px]">
                            {method === "phone" ? (
                                <div className="space-y-6 animate-in fade-in zoom-in-95">
                                    {!otpSent ? (
                                        <>
                                            <div className="space-y-3">
                                                <Label htmlFor="phone">Numéro de téléphone</Label>
                                                <div className="flex shadow-sm rounded-md">
                                                    <div className="flex items-center justify-center px-4 border border-r-0 rounded-l-md bg-muted text-muted-foreground font-medium">
                                                        +241
                                                    </div>
                                                    <Input
                                                        id="phone"
                                                        placeholder="0X XX XX XX"
                                                        className="rounded-l-none text-lg h-12"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full text-lg h-12 mt-4"
                                                disabled={phone.length < 8}
                                                onClick={() => setOtpSent(true)}
                                            >
                                                Recevoir un code
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-6 text-center animate-in slide-in-from-right-4">
                                            <p className="text-sm text-muted-foreground">
                                                Code envoyé au +241 {phone}
                                            </p>
                                            <div className="flex justify-center gap-2">
                                                {otp.map((digit, i) => (
                                                    <Input
                                                        key={i}
                                                        id={`login-otp-${i}`}
                                                        maxLength={1}
                                                        className="w-12 h-14 text-center text-2xl"
                                                        value={digit}
                                                        onChange={(e) => {
                                                            const newOtp = [...otp];
                                                            newOtp[i] = e.target.value;
                                                            setOtp(newOtp);
                                                            if (e.target.value && i < 5) {
                                                                document.getElementById(`login-otp-${i + 1}`)?.focus();
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                                                document.getElementById(`login-otp-${i - 1}`)?.focus();
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <Button variant="ghost" className="text-xs text-muted-foreground mt-2" onClick={() => setOtpSent(false)}>
                                                Modifier le numéro
                                            </Button>
                                            <Button
                                                className="w-full text-lg h-12 bg-success hover:bg-success/90 text-success-foreground mt-4"
                                                disabled={otp.some(d => !d) || isLoading}
                                                onClick={handleLogin}
                                            >
                                                {isLoading ? "Connexion..." : "Se connecter au portail"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-5 animate-in fade-in zoom-in-95">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Adresse email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="exemple@entreprise.ga"
                                            className="h-12 text-base"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2 relative">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Mot de passe</Label>
                                            <Link href="/mot-de-passe-oublie" className="text-xs text-primary hover:underline font-medium">
                                                Mot de passe oublié ?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                className="h-12 text-base pr-10"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full text-lg h-12 mt-6 bg-success hover:bg-success/90 text-success-foreground"
                                        disabled={!email || !password || isLoading}
                                        onClick={handleLogin}
                                    >
                                        {isLoading ? "Connexion..." : "Se connecter"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-border text-center">
                            <p className="text-sm text-muted-foreground">
                                Pas encore de compte ?{" "}
                                <Link href="/inscription" className="text-primary font-semibold hover:underline">
                                    Inscrivez-vous gratuitement
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
