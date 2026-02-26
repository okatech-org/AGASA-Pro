import { query } from "./_generated/server";
import { v } from "convex/values";

// Données dashboard complètes pour un opérateur
export const getDashboardData = query({
    args: { firebaseUid: v.string() },
    handler: async (ctx, args) => {
        const operateur = await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();

        if (!operateur) return null;

        // Établissements
        const etablissements = await ctx.db
            .query("etablissements")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", operateur._id))
            .collect();

        // Agréments
        const agrements = await ctx.db
            .query("agrements")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", operateur._id))
            .collect();

        // Inspections
        const inspections = await ctx.db
            .query("historiqueInspections")
            .filter((q) => q.eq(q.field("operateurId"), operateur._id))
            .collect();

        // Alertes non lues
        const alertes = await ctx.db
            .query("alertesOperateurs")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", operateur._id))
            .collect();
        const alertesNonLues = alertes.filter(a => !a.lu);

        // Score Smiley (du premier établissement actif)
        const mainEtab = etablissements.find(e => e.statut === "actif");
        const scoreSmiley = mainEtab?.scoreSmiley ?? null;

        // Paiements
        const paiements = await ctx.db
            .query("paiements")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", operateur._id))
            .collect();

        // Importations en cours
        const importations = await ctx.db
            .query("importations")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", operateur._id))
            .collect();

        // Commandes analyses
        const commandesAnalyses = await ctx.db
            .query("commandesAnalyses")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", operateur._id))
            .collect();

        // Certificats phyto
        const certificatsPhyto = await ctx.db
            .query("certificatsPhyto")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", operateur._id))
            .collect();

        // Licences intrants
        const licencesIntrants = await ctx.db
            .query("licencesIntrants")
            .filter((q) => q.eq(q.field("operateurId"), operateur._id))
            .collect();

        // Inscriptions formation (enriched with module data)
        const inscriptionsRaw = await ctx.db
            .query("inscriptionsFormation")
            .filter((q) => q.eq(q.field("operateurId"), operateur._id))
            .collect();

        const inscriptionsFormation = await Promise.all(
            inscriptionsRaw.map(async (insc) => {
                const moduleFormation = await ctx.db.get(insc.moduleFormationId);
                return { ...insc, moduleFormation };
            })
        );

        // Modules de formation (catalogue)
        const modulesFormation = await ctx.db
            .query("modulesFormation")
            .filter((q) => q.eq(q.field("actif"), true))
            .collect();

        // Registre produits autorisés
        const registreProduits = await ctx.db
            .query("registreProduitAutorise")
            .collect();

        // Amendes
        const amendes = await ctx.db
            .query("amendes")
            .filter((q) => q.eq(q.field("operateurId"), operateur._id))
            .collect();

        return {
            operateur,
            etablissements,
            agrements,
            inspections: inspections.sort((a, b) => b.dateInspection - a.dateInspection),
            alertes,
            alertesNonLues: alertesNonLues.length,
            scoreSmiley,
            paiements: paiements.sort((a, b) => b.dateCreation - a.dateCreation),
            importations: importations.sort((a, b) => b.dateCreation - a.dateCreation),
            commandesAnalyses: commandesAnalyses.sort((a, b) => b.dateCreation - a.dateCreation),
            certificatsPhyto,
            licencesIntrants,
            inscriptionsFormation,
            modulesFormation,
            registreProduits,
            amendes,
            stats: {
                importationsEnCours: importations.filter(i => i.statut === "en_cours").length,
                analysesEnCours: commandesAnalyses.filter(c => c.statut === "en_cours").length,
                analysesResultats: commandesAnalyses.filter(c => c.etapeActuelle === "resultats_disponibles").length,
                paiementsMois: paiements
                    .filter(p => p.statut === "confirme" && p.dateCreation > Date.now() - 30 * 24 * 60 * 60 * 1000)
                    .reduce((sum, p) => sum + p.montant, 0),
                certificatsPhytoActifs: certificatsPhyto.filter(c => c.statut === "delivre").length,
                certificatsPhytoEnCours: certificatsPhyto.filter(c => c.statut !== "delivre" && c.statut !== "refuse").length,
                amendesEnCours: amendes.filter(a => a.statut === "en_attente" || a.statut === "en_retard").length,
                formationsCompletees: inscriptionsFormation.filter(f => f.statut === "certifie").length,
                formationsEnCours: inscriptionsFormation.filter(f => f.statut === "en_cours").length,
                formationsProgression: inscriptionsFormation.length > 0
                    ? Math.round(inscriptionsFormation.reduce((sum, f) => sum + f.progression, 0) / inscriptionsFormation.length)
                    : 0,
            },
        };
    },
});

export const getMyEtablissements = query({
    args: { operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("etablissements")
            .withIndex("by_operateurId", (q) => q.eq("operateurId", args.operateurId))
            .collect();
    },
});
