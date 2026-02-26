import { query } from "../_generated/server";
import { v } from "convex/values";

export const getMonDossier = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const etablissements = await ctx.db
            .query("etablissements")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();

        const mainEtab = etablissements.find(e => e.statut === "actif");

        const inspections = await ctx.db
            .query("historiqueInspections")
            .filter((q) => q.eq(q.field("operateurId"), args.operateurId))
            .collect();

        const paiements = await ctx.db
            .query("paiements")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();

        const amendes = await ctx.db
            .query("amendes")
            .filter((q) => q.eq(q.field("operateurId"), args.operateurId))
            .collect();

        return {
            scoreSmiley: mainEtab?.scoreSmiley ?? null,
            etablissement: mainEtab,
            inspections: inspections.sort((a, b) => b.dateInspection - a.dateInspection),
            paiements: paiements
                .filter(p => p.statut === "confirme")
                .sort((a, b) => b.dateCreation - a.dateCreation),
            amendes: amendes.sort((a, b) => b.dateCreation - a.dateCreation),
        };
    },
});

export const getMesInspections = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const inspections = await ctx.db
            .query("historiqueInspections")
            .filter((q) => q.eq(q.field("operateurId"), args.operateurId))
            .collect();
        return inspections.sort((a, b) => b.dateInspection - a.dateInspection);
    },
});

export const getMesPaiements = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const paiements = await ctx.db
            .query("paiements")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();
        return paiements.sort((a, b) => b.dateCreation - a.dateCreation);
    },
});

export const getMesAmendes = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const amendes = await ctx.db
            .query("amendes")
            .filter((q) => q.eq(q.field("operateurId"), args.operateurId))
            .collect();
        return amendes.sort((a, b) => b.dateCreation - a.dateCreation);
    },
});
