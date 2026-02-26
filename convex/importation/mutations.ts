import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const creerDeclaration = mutation({
    args: {
        firebaseUid: v.string(),
        typeImportation: v.union(v.literal("alimentaire"), v.literal("phytosanitaire"), v.literal("mixte")),
        portArrivee: v.union(v.literal("Owendo"), v.literal("Port-Gentil"), v.literal("Aéroport_LBV"), v.literal("Frontière_terrestre")),
        paysOrigine: v.string(),
        descriptionMarchandise: v.string(),
        nombreConteneurs: v.number(),
        valeurDeclaree: v.number(),
    },
    handler: async (ctx, args) => {
        const operateur = await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();
        if (!operateur) throw new Error("Opérateur introuvable");

        const count = await ctx.db.query("importations").collect();
        const numero = `IMP-2026-${String(count.length + 1).padStart(5, "0")}`;
        const now = Date.now();

        const fraisDeclaration = 50000;
        const fraisInspection = 75000 * args.nombreConteneurs;
        const fraisCertificat = 200000;
        const montantTotal = fraisDeclaration + fraisInspection + fraisCertificat;

        const id = await ctx.db.insert("importations", {
            operateurId: operateur._id,
            numeroDossier: numero,
            typeImportation: args.typeImportation,
            portArrivee: args.portArrivee,
            paysOrigine: args.paysOrigine,
            descriptionMarchandise: args.descriptionMarchandise,
            nombreConteneurs: args.nombreConteneurs,
            valeurDeclaree: args.valeurDeclaree,
            documentsImportation: [],
            montantTotal,
            statut: "en_cours",
            etapeActuelle: "brouillon",
            prestations: [
                { type: "declaration_importation", tarif: fraisDeclaration, statut: "en_attente" },
                { type: "inspection_documentaire", tarif: fraisInspection, statut: "en_attente" },
                { type: "certificat_amc", tarif: fraisCertificat, statut: "en_attente" },
            ],
            historiqueEtapes: [{ etape: "brouillon", date: now, commentaire: "Déclaration créée" }],
            dateCreation: now,
            dateModification: now,
        });

        return { id, numeroDossier: numero, montantTotal };
    },
});

export const soumettreImportation = mutation({
    args: { importId: v.id("importations") },
    handler: async (ctx, args) => {
        const imp = await ctx.db.get(args.importId);
        if (!imp) throw new Error("Importation introuvable");

        const now = Date.now();
        await ctx.db.patch(args.importId, {
            etapeActuelle: "soumis",
            historiqueEtapes: [...imp.historiqueEtapes, { etape: "soumis", date: now, commentaire: "Dossier soumis par l'opérateur" }],
            dateModification: now,
        });

        return { success: true };
    },
});

export const sauvegarderBrouillon = mutation({
    args: {
        importId: v.id("importations"),
        descriptionMarchandise: v.optional(v.string()),
        paysOrigine: v.optional(v.string()),
        nombreConteneurs: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const imp = await ctx.db.get(args.importId);
        if (!imp) throw new Error("Importation introuvable");

        const patch: Record<string, any> = { dateModification: Date.now() };
        if (args.descriptionMarchandise) patch.descriptionMarchandise = args.descriptionMarchandise;
        if (args.paysOrigine) patch.paysOrigine = args.paysOrigine;
        if (args.nombreConteneurs) patch.nombreConteneurs = args.nombreConteneurs;

        await ctx.db.patch(args.importId, patch);
        return { success: true };
    },
});
