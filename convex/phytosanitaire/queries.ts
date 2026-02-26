import { query } from "../_generated/server";
import { v } from "convex/values";

export const getMesCertificats = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("certificatsPhyto")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect()
            .then((res) => res.sort((a, b) => b.dateCreation - a.dateCreation));
    },
});

export const getCertificat = query({
    args: { certId: v.id("certificatsPhyto") },
    handler: async (ctx, args) => {
        const cert = await ctx.db.get(args.certId);
        if (!cert) return null;
        const operateur = await ctx.db.get(cert.operateurId);
        return { ...cert, operateurNom: operateur?.raisonSociale || "" };
    },
});

export const getMesLicences = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("licencesIntrants")
            .filter((q) => q.eq(q.field("operateurId"), args.operateurId))
            .collect();
    },
});

export const getRegistreProduits = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("registreProduitAutorise").collect();
    },
});
