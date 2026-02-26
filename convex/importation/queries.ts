import { query } from "../_generated/server";
import { v } from "convex/values";

export const getMesImportations = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("importations")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect()
            .then((res) => res.sort((a, b) => b.dateCreation - a.dateCreation));
    },
});

export const getImportation = query({
    args: { importId: v.id("importations") },
    handler: async (ctx, args) => {
        const imp = await ctx.db.get(args.importId);
        if (!imp) return null;
        const operateur = await ctx.db.get(imp.operateurId);
        return { ...imp, operateurNom: operateur?.raisonSociale || "" };
    },
});

export const getImportDashboardStats = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const all = await ctx.db
            .query("importations")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();

        const now = Date.now();
        const quarter = 90 * 24 * 60 * 60 * 1000;
        const thisQuarter = all.filter((i) => i.dateCreation > now - quarter);

        return {
            total: all.length,
            enCours: all.filter((i) => i.statut === "en_cours").length,
            amcDelivrees: thisQuarter.filter((i) => i.etapeActuelle === "amc_delivree").length,
            enAttentePaiement: all.filter((i) => i.etapeActuelle === "paiement_en_attente").length,
            montantPayeTrimestre: thisQuarter.reduce((sum, i) => sum + (i.montantTotal || 0), 0),
        };
    },
});
