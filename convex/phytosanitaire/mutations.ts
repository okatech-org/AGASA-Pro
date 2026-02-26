import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const creerCertificat = mutation({
    args: {
        firebaseUid: v.string(),
        type: v.union(v.literal("importation"), v.literal("exportation")),
        produit: v.string(),
        paysOrigine: v.optional(v.string()),
        paysDestination: v.optional(v.string()),
        quantite: v.number(),
        unite: v.string(),
        lotNumero: v.string(),
    },
    handler: async (ctx, args) => {
        const operateur = await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();
        if (!operateur) throw new Error("Opérateur introuvable");

        const count = await ctx.db.query("certificatsPhyto").collect();
        const numero = `PHYTO-2026-${String(count.length + 1).padStart(5, "0")}`;
        const montant = args.type === "importation" ? 75000 : 50000;
        const now = Date.now();

        const id = await ctx.db.insert("certificatsPhyto", {
            operateurId: operateur._id,
            type: args.type,
            numeroCertificat: numero,
            produit: args.produit,
            paysOrigine: args.paysOrigine,
            paysDestination: args.paysDestination,
            quantite: args.quantite,
            unite: args.unite,
            lotNumero: args.lotNumero,
            montant,
            statut: "soumis",
            dateCreation: now,
        });

        return { id, numeroCertificat: numero, montant };
    },
});

export const renouvelerLicence = mutation({
    args: {
        firebaseUid: v.string(),
        typeIntrant: v.union(v.literal("pesticide"), v.literal("engrais"), v.literal("semence"), v.literal("autre")),
    },
    handler: async (ctx, args) => {
        const operateur = await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();
        if (!operateur) throw new Error("Opérateur introuvable");

        const count = await ctx.db.query("licencesIntrants").collect();
        const numero = `LIC-2026-${String(count.length + 1).padStart(5, "0")}`;
        const now = Date.now();

        const id = await ctx.db.insert("licencesIntrants", {
            operateurId: operateur._id,
            numeroLicence: numero,
            typeIntrant: args.typeIntrant,
            montant: 150000,
            statut: "soumis",
            dateCreation: now,
        });

        return { id, numeroLicence: numero, montant: 150000 };
    },
});
