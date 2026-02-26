import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const updateOperateurStatus = mutation({
    args: {
        operateurId: v.id("operateurs"),
        statut: v.union(v.literal("actif"), v.literal("suspendu"), v.literal("desactive"), v.literal("en_attente_verification")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.operateurId, { statut: args.statut, dateModification: Date.now() });
        return { success: true };
    },
});

export const validerDocumentsAgrement = mutation({
    args: { agrementId: v.id("agrements") },
    handler: async (ctx, args) => {
        const agr = await ctx.db.get(args.agrementId);
        if (!agr) throw new Error("Agrément introuvable");

        const now = Date.now();
        await ctx.db.patch(args.agrementId, {
            etapeActuelle: "verification_documents",
            historiqueEtapes: [...agr.historiqueEtapes, { etape: "verification_documents", date: now, commentaire: "Documents validés par l'admin", agent: "Admin AGASA" }],
            dateModification: now,
        });
        return { success: true };
    },
});

export const demanderComplementAgrement = mutation({
    args: {
        agrementId: v.id("agrements"),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const agr = await ctx.db.get(args.agrementId);
        if (!agr) throw new Error("Agrément introuvable");

        const now = Date.now();
        const complements = agr.complements || [];
        complements.push({ demande: args.message, dateDemande: now });

        await ctx.db.patch(args.agrementId, {
            etapeActuelle: "demande_complements",
            complements,
            historiqueEtapes: [...agr.historiqueEtapes, { etape: "demande_complements", date: now, commentaire: args.message, agent: "Admin AGASA" }],
            dateModification: now,
        });
        return { success: true };
    },
});

export const programmerInspection = mutation({
    args: {
        agrementId: v.id("agrements"),
        date: v.number(),
        inspecteurRef: v.string(),
    },
    handler: async (ctx, args) => {
        const agr = await ctx.db.get(args.agrementId);
        if (!agr) throw new Error("Agrément introuvable");

        const now = Date.now();
        await ctx.db.patch(args.agrementId, {
            etapeActuelle: "inspection_programmee",
            inspectionProgrammee: { date: args.date, inspecteurRef: args.inspecteurRef },
            historiqueEtapes: [...agr.historiqueEtapes, { etape: "inspection_programmee", date: now, commentaire: `Inspection programmée par ${args.inspecteurRef}`, agent: "Admin AGASA" }],
            dateModification: now,
        });
        return { success: true };
    },
});

export const deciderAgrement = mutation({
    args: {
        agrementId: v.id("agrements"),
        decision: v.union(v.literal("agree"), v.literal("refuse")),
        motif: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const agr = await ctx.db.get(args.agrementId);
        if (!agr) throw new Error("Agrément introuvable");

        const now = Date.now();
        const patch: Record<string, any> = {
            etapeActuelle: args.decision,
            decision: { resultat: args.decision, motif: args.motif || "", date: now, agentRef: "Admin AGASA" },
            historiqueEtapes: [...agr.historiqueEtapes, { etape: args.decision, date: now, commentaire: args.decision === "agree" ? "Agrément accordé" : `Refusé : ${args.motif}`, agent: "Admin AGASA" }],
            dateModification: now,
        };

        if (args.decision === "agree") {
            patch.dateExpiration = now + 365 * 24 * 60 * 60 * 1000;
            patch.certificat = {
                numero: `CERT-AS-${Date.now().toString(36).toUpperCase()}`,
                qrCode: `QR-${Date.now().toString(36).toUpperCase()}`,
                dateDelivrance: now,
                dateExpiration: now + 365 * 24 * 60 * 60 * 1000,
                pdfUrl: `/certificats/${args.agrementId}.pdf`,
            };
        }

        await ctx.db.patch(args.agrementId, patch);
        return { success: true };
    },
});

export const delivrerAMC = mutation({
    args: { importId: v.id("importations") },
    handler: async (ctx, args) => {
        const imp = await ctx.db.get(args.importId);
        if (!imp) throw new Error("Importation introuvable");

        const now = Date.now();
        const amcNumero = `AMC-${Date.now().toString(36).toUpperCase()}`;

        await ctx.db.patch(args.importId, {
            etapeActuelle: "amc_delivree",
            statut: "termine",
            amcNumero,
            amcQrCode: `QR-${amcNumero}`,
            historiqueEtapes: [...imp.historiqueEtapes, { etape: "amc_delivree", date: now, commentaire: "AMC délivrée", agent: "Admin AGASA" }],
            dateModification: now,
        });
        return { success: true, amcNumero };
    },
});

export const confirmerVirement = mutation({
    args: { paiementId: v.id("paiements") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.paiementId, {
            statut: "confirme",
            horodatage: Date.now(),
        });
        return { success: true };
    },
});
