import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

const IS_DEMO_MODE =
    process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true" ||
    process.env.ENABLE_DEMO_MODE === "true";

export async function requireAdmin(ctx: Ctx, adminFirebaseUid: string) {
    if (!adminFirebaseUid) {
        throw new Error("Identité administrateur requise");
    }

    const admin = await ctx.db
        .query("admins")
        .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", adminFirebaseUid))
        .first();

    if (!admin) {
        if (IS_DEMO_MODE && adminFirebaseUid.startsWith("demo-")) {
            return {
                firebaseUid: adminFirebaseUid,
                role: "admin_systeme",
                statut: "actif",
                permissions: ["*"],
            };
        }
        throw new Error("Administrateur introuvable");
    }

    if (admin.statut !== "actif") {
        throw new Error("Compte administrateur inactif");
    }

    if (admin.role !== "admin_systeme" && admin.role !== "superviseur") {
        throw new Error("Privilèges insuffisants");
    }

    return admin;
}
