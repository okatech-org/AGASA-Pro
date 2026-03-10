"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ENABLE_DEMO_MODE = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";
const DEMO_ADMIN_UID = process.env.NEXT_PUBLIC_DEMO_ADMIN_UID || "demo-admin";

export function useFirebaseSession() {
    const [uid, setUid] = useState<string | null>(ENABLE_DEMO_MODE ? DEMO_ADMIN_UID : null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setUid(ENABLE_DEMO_MODE ? DEMO_ADMIN_UID : null);
            setIsLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.uid) {
                setUid(user.uid);
            } else if (ENABLE_DEMO_MODE) {
                setUid(DEMO_ADMIN_UID);
            } else {
                setUid(null);
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    return {
        uid,
        isLoading,
        isAuthenticated: !!uid,
    };
}
