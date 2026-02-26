import { query } from "../_generated/server";
import { v } from "convex/values";

export const getMesAlertes = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const alertes = await ctx.db
            .query("alertesOperateurs")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();
        return alertes.sort((a, b) => b.dateCreation - a.dateCreation);
    },
});

export const getAlertesNonLues = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const alertes = await ctx.db
            .query("alertesOperateurs")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();
        return alertes.filter(a => !a.lu).length;
    },
});
