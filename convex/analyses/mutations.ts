import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const commanderAnalyses = mutation({
    args: {
        firebaseUid: v.string(),
        matrice: v.union(
            v.literal("viande"), v.literal("poisson"), v.literal("cereale"),
            v.literal("fruit_legume"), v.literal("produit_laitier"), v.literal("eau"), v.literal("autre")
        ),
        echantillonDescription: v.string(),
        parametresSelectionnes: v.array(v.object({
            parametreCode: v.string(),
            parametreNom: v.string(),
            tarif: v.number(),
        })),
        express: v.boolean(),
    },
    handler: async (ctx, args) => {
        const operateur = await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();
        if (!operateur) throw new Error("Opérateur introuvable");

        const count = await ctx.db.query("commandesAnalyses").collect();
        const numero = `ANA-2026-${String(count.length + 1).padStart(5, "0")}`;
        const now = Date.now();

        const totalParametres = args.parametresSelectionnes.reduce((s, p) => s + p.tarif, 0);
        const fraisExpress = args.express ? 200000 : 0;
        const montantTotal = totalParametres + fraisExpress;

        const id = await ctx.db.insert("commandesAnalyses", {
            operateurId: operateur._id,
            numeroCommande: numero,
            matrice: args.matrice,
            echantillonDescription: args.echantillonDescription,
            parametresSelectionnes: args.parametresSelectionnes,
            express: args.express,
            montantTotal,
            statut: "en_cours",
            etapeActuelle: "soumis",
            historiqueEtapes: [{ etape: "soumis", date: now, commentaire: "Commande créée" }],
            dateCreation: now,
        });

        return { id, numeroCommande: numero, montantTotal };
    },
});

export const soumettreCommande = mutation({
    args: { commandeId: v.id("commandesAnalyses") },
    handler: async (ctx, args) => {
        const cmd = await ctx.db.get(args.commandeId);
        if (!cmd) throw new Error("Commande introuvable");

        await ctx.db.patch(args.commandeId, {
            etapeActuelle: "paye",
        });
        return { success: true };
    },
});
