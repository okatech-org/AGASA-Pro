import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getMesFormations = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const inscriptions = await ctx.db
            .query("inscriptionsFormation")
            .filter((q) => q.eq(q.field("operateurId"), args.operateurId))
            .collect();

        return await Promise.all(
            inscriptions.map(async (insc) => {
                const mod = await ctx.db.get(insc.moduleFormationId);
                return { ...insc, moduleFormation: mod };
            })
        );
    },
});

export const getFormation = query({
    args: { moduleId: v.id("modulesFormation") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.moduleId);
    },
});

export const getCertifications = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        const inscriptions = await ctx.db
            .query("inscriptionsFormation")
            .filter((q) => q.eq(q.field("operateurId"), args.operateurId))
            .collect();

        const certifiees = inscriptions.filter((i) => i.statut === "certifie");
        return await Promise.all(
            certifiees.map(async (insc) => {
                const mod = await ctx.db.get(insc.moduleFormationId);
                return { ...insc, moduleFormation: mod };
            })
        );
    },
});

export const inscrireFormation = mutation({
    args: {
        firebaseUid: v.string(),
        moduleFormationId: v.id("modulesFormation"),
    },
    handler: async (ctx, args) => {
        const operateur = await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();
        if (!operateur) throw new Error("Opérateur introuvable");

        const id = await ctx.db.insert("inscriptionsFormation", {
            operateurId: operateur._id,
            moduleFormationId: args.moduleFormationId,
            progression: 0,
            quizResultats: [],
            statut: "en_cours",
            dateInscription: Date.now(),
        });

        return { id };
    },
});

export const updateProgression = mutation({
    args: {
        inscriptionId: v.id("inscriptionsFormation"),
        progression: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.inscriptionId, {
            progression: args.progression,
        });
        return { success: true };
    },
});

export const soumettreQuiz = mutation({
    args: {
        inscriptionId: v.id("inscriptionsFormation"),
        reponses: v.array(v.object({
            questionIndex: v.number(),
            reponse: v.number(),
            correct: v.boolean(),
        })),
    },
    handler: async (ctx, args) => {
        const insc = await ctx.db.get(args.inscriptionId);
        if (!insc) throw new Error("Inscription introuvable");

        const score = Math.round((args.reponses.filter(r => r.correct).length / args.reponses.length) * 100);
        const certifie = score >= 70;

        const patch: Record<string, any> = {
            scoreQuiz: score,
            quizResultats: args.reponses,
            progression: certifie ? 100 : insc.progression,
            statut: certifie ? "certifie" : "echec",
        };

        if (certifie) {
            patch.dateCertification = Date.now();
            patch.certificat = {
                numero: `CERT-HACCP-${Date.now().toString(36).toUpperCase()}`,
                qrCode: `QR-CERT-${Date.now().toString(36).toUpperCase()}`,
                pdfUrl: `/certifications/${args.inscriptionId}.pdf`,
                dateDelivrance: Date.now(),
            };
        }

        await ctx.db.patch(args.inscriptionId, patch);
        return { success: true, certifie, score };
    },
});
