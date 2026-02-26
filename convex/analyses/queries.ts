import { query } from "../_generated/server";
import { v } from "convex/values";

export const getMesCommandes = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const commandes = await ctx.db
            .query("commandesAnalyses")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();
        return commandes.sort((a, b) => b.dateCreation - a.dateCreation);
    },
});

export const getCommande = query({
    args: { commandeId: v.id("commandesAnalyses") },
    handler: async (ctx, args) => {
        const cmd = await ctx.db.get(args.commandeId);
        if (!cmd) return null;
        const operateur = await ctx.db.get(cmd.operateurId);
        return { ...cmd, operateurNom: operateur?.raisonSociale || "" };
    },
});

export const getCatalogueAnalyses = query({
    args: {},
    handler: async (ctx) => {
        const catalogue = await ctx.db.query("catalogueAnalyses").collect();
        return catalogue;
    },
});
