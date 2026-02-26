import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const creerDemandeAgrement = mutation({
    args: {
        firebaseUid: v.string(),
        etablissementId: v.id("etablissements"),
        type: v.union(v.literal("premiere_demande"), v.literal("renouvellement"), v.literal("modification")),
        categorie: v.union(v.literal("AS_CAT_1"), v.literal("AS_CAT_2"), v.literal("AS_CAT_3"), v.literal("TRANSPORT")),
    },
    handler: async (ctx, args) => {
        const operateur = await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();
        if (!operateur) throw new Error("Opérateur introuvable");

        const montantParCategorie: Record<string, number> = {
            AS_CAT_1: 500000, AS_CAT_2: 250000, AS_CAT_3: 100000, TRANSPORT: 50000,
        };
        const montant = args.type === "renouvellement"
            ? Math.round(montantParCategorie[args.categorie] * 0.6)
            : montantParCategorie[args.categorie];

        const count = await ctx.db.query("agrements").collect();
        const numero = `AGR-2026-${String(count.length + 1).padStart(5, "0")}`;
        const now = Date.now();

        const id = await ctx.db.insert("agrements", {
            operateurId: operateur._id,
            etablissementId: args.etablissementId,
            type: args.type,
            categorie: args.categorie,
            numeroDossier: numero,
            montant,
            piecesJointes: [],
            etapeActuelle: "brouillon",
            historiqueEtapes: [{ etape: "brouillon", date: now, commentaire: "Demande créée" }],
            rappelRenouvellementEnvoye: false,
            dateCreation: now,
            dateModification: now,
        });

        return { id, numeroDossier: numero, montant };
    },
});

export const soumettreAgrement = mutation({
    args: { agrementId: v.id("agrements") },
    handler: async (ctx, args) => {
        const agrement = await ctx.db.get(args.agrementId);
        if (!agrement) throw new Error("Agrément introuvable");

        const now = Date.now();
        await ctx.db.patch(args.agrementId, {
            etapeActuelle: "soumis",
            historiqueEtapes: [...agrement.historiqueEtapes, { etape: "soumis", date: now, commentaire: "Dossier soumis par l'opérateur" }],
            dateModification: now,
        });

        return { success: true };
    },
});

export const ajouterPieceJointe = mutation({
    args: {
        agrementId: v.id("agrements"),
        nom: v.string(),
        type: v.string(),
        fichierUrl: v.string(),
    },
    handler: async (ctx, args) => {
        const agrement = await ctx.db.get(args.agrementId);
        if (!agrement) throw new Error("Agrément introuvable");

        await ctx.db.patch(args.agrementId, {
            piecesJointes: [...agrement.piecesJointes, {
                nom: args.nom,
                type: args.type,
                fichierUrl: args.fichierUrl,
                dateUpload: Date.now(),
            }],
            dateModification: Date.now(),
        });

        return { success: true };
    },
});
