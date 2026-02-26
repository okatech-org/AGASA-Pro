import { query } from "../_generated/server";
import { v } from "convex/values";

export const getMesAgrements = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const agrements = await ctx.db
            .query("agrements")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();

        // Enrichir avec le nom de l'établissement
        const enriched = await Promise.all(
            agrements.map(async (agr) => {
                const etab = await ctx.db.get(agr.etablissementId);
                return {
                    ...agr,
                    etablissementNom: etab?.nom || "Établissement",
                    etablissementType: etab?.type || "",
                    etablissementCategorie: etab?.categorie || "",
                };
            })
        );

        return enriched.sort((a, b) => b.dateCreation - a.dateCreation);
    },
});

export const getAgrement = query({
    args: { agrementId: v.id("agrements") },
    handler: async (ctx, args) => {
        const agrement = await ctx.db.get(args.agrementId);
        if (!agrement) return null;

        const etab = await ctx.db.get(agrement.etablissementId);
        const operateur = await ctx.db.get(agrement.operateurId);

        return {
            ...agrement,
            etablissementNom: etab?.nom || "",
            etablissementAdresse: etab?.adresse || "",
            etablissementType: etab?.type || "",
            operateurNom: operateur?.raisonSociale || "",
            operateurProvince: operateur?.province || "",
        };
    },
});
