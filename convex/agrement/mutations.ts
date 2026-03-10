import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { CATEGORIES_ACTION, CORTEX, SIGNAL_TYPES, genererCorrelationId } from "../lib/neocortex";

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

        await ctx.db.insert("signaux", {
            type: SIGNAL_TYPES.DOSSIER_CREE,
            source: CORTEX.METIER,
            destination: CORTEX.LIMBIQUE,
            entiteType: "agrements",
            entiteId: String(id),
            payload: {
                numeroDossier: numero,
                categorie: args.categorie,
                type: args.type,
            },
            confiance: 1,
            priorite: "NORMAL",
            correlationId: genererCorrelationId(),
            traite: false,
            timestamp: now,
        });

        await ctx.db.insert("historiqueActions", {
            action: "AGREMENT_CREE",
            categorie: CATEGORIES_ACTION.METIER,
            entiteType: "agrements",
            entiteId: String(id),
            userId: String(operateur._id),
            details: {
                numeroDossier: numero,
                categorie: args.categorie,
                type: args.type,
                montant,
            },
            metadata: { source: CORTEX.METIER },
            timestamp: now,
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

        await ctx.db.insert("signaux", {
            type: SIGNAL_TYPES.DOSSIER_SOUMIS,
            source: CORTEX.METIER,
            destination: CORTEX.GATEWAY,
            entiteType: "agrements",
            entiteId: String(args.agrementId),
            payload: {
                numeroDossier: agrement.numeroDossier,
                etape: "soumis",
            },
            confiance: 1,
            priorite: "HIGH",
            correlationId: genererCorrelationId(),
            traite: false,
            timestamp: now,
        });

        await ctx.db.insert("historiqueActions", {
            action: "AGREMENT_SOUMIS",
            categorie: CATEGORIES_ACTION.METIER,
            entiteType: "agrements",
            entiteId: String(args.agrementId),
            details: {
                numeroDossier: agrement.numeroDossier,
            },
            metadata: { source: CORTEX.METIER },
            timestamp: now,
        });

        const operateur = await ctx.db.get(agrement.operateurId);
        const etablissement = await ctx.db.get(agrement.etablissementId);
        const payload = {
            type: "demande_agrement",
            source: "AGASA-Pro",
            demandeId: String(args.agrementId),
            numeroDossier: agrement.numeroDossier,
            categorie: agrement.categorie,
            typeDemande: agrement.type,
            montant: agrement.montant,
            operateur: operateur
                ? {
                    id: String(operateur._id),
                    raisonSociale: operateur.raisonSociale,
                    rccm: operateur.rccm,
                    nif: operateur.nif,
                    province: operateur.province,
                }
                : null,
            etablissement: etablissement
                ? {
                    id: String(etablissement._id),
                    nom: etablissement.nom,
                    ville: etablissement.ville,
                    province: etablissement.province,
                    categorie: etablissement.categorie,
                }
                : null,
            dateSoumission: now,
        };

        const fluxRefId = await ctx.db.insert("fluxInterApps", {
            fluxCode: "F1",
            direction: "envoi",
            typeMessage: "demande_agrement",
            payload: JSON.stringify(payload),
            statut: "envoye",
            dateEnvoi: now,
            tentatives: 0,
        });

        const internalApi = internal as any;
        await ctx.scheduler.runAfter(0, internalApi.gateway.outbound.pushToCore, {
            typeMessage: "demande_agrement",
            payload,
            fluxRefId,
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
