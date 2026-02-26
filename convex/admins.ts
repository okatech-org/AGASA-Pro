import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Vérifie un administrateur AGASA
export const syncAdmin = mutation({
    args: {
        firebaseUid: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("admins")
            .filter((q) => q.eq(q.field("firebaseUid"), args.firebaseUid))
            .unique();

        if (existing) {
            if (existing.statut !== "actif") {
                throw new Error("Ce compte administrateur est désactivé.");
            }
            return { admin: existing, isNew: false };
        }

        // Sécurité: vérifier si l'email appartient au domaine agasa.ga 
        // ou si c'est le super admin initial
        const isAdminEmail = args.email.endsWith("@agasa.ga") || args.email === "superadmin@agasa-pro.ga";

        if (!isAdminEmail) {
            // Nous ne créons pas automatiquement de comptes admin pour les emails non autorisés
            return { admin: null, isNew: false, error: "Domaine email non autorisé pour l'administration" };
        }

        // Création d'un premier admin
        const isSuperAdmin = args.email === "superadmin@agasa-pro.ga";
        const adminId = await ctx.db.insert("admins", {
            firebaseUid: args.firebaseUid,
            email: args.email,
            nom: isSuperAdmin ? "Super" : "Nouvel",
            prenom: isSuperAdmin ? "Admin" : "Agent",
            role: isSuperAdmin ? "admin_systeme" : "agent_agasa",
            permissions: isSuperAdmin ? ["*"] : [],
            statut: "actif",
            dateCreation: Date.now(),
        });

        const newAdmin = await ctx.db.get(adminId);
        return { admin: newAdmin, isNew: true };
    },
});

export const getAdminProfile = query({
    args: { firebaseUid: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("admins")
            .filter((q) => q.eq(q.field("firebaseUid"), args.firebaseUid))
            .unique();
    },
});
