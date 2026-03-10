import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./_auth";

export const getAdminDashboardStats = query({
    args: { adminFirebaseUid: v.string() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx, args.adminFirebaseUid);
        const operateurs = await ctx.db.query("operateurs").collect();
        const agrements = await ctx.db.query("agrements").collect();
        const importations = await ctx.db.query("importations").collect();
        const paiements = await ctx.db.query("paiements").collect();
        const alertes = await ctx.db.query("alertesOperateurs").filter((q) => q.eq(q.field("lu"), false)).collect();

        const now = Date.now();
        const thisMonth = 30 * 24 * 60 * 60 * 1000;
        const opThisMonth = operateurs.filter((o) => o.dateCreation > now - thisMonth);
        const agrActifs = agrements.filter((a) => a.etapeActuelle === "agree");
        const impEnCours = importations.filter((i) => i.statut === "en_cours");

        const revenusMois = paiements
            .filter((p) => p.dateCreation > now - thisMonth && p.statut === "confirme")
            .reduce((s, p) => s + p.montant, 0);

        // Amendes
        const amendes = await ctx.db.query("amendes").collect();
        const totalAmendes = amendes.reduce((s, a) => s + a.montant, 0);
        const amendesPayees = amendes.filter((a) => a.statut === "paye").reduce((s, a) => s + a.montant, 0);
        const tauxRecouvrement = totalAmendes > 0 ? Math.round((amendesPayees / totalAmendes) * 100) : 100;

        // Répartition par province
        const parProvince: Record<string, number> = {};
        operateurs.forEach((o) => { parProvince[o.province] = (parProvince[o.province] || 0) + 1; });

        // Agréments par catégorie
        const parCategorie: Record<string, number> = {};
        agrActifs.forEach((a) => { parCategorie[a.categorie] = (parCategorie[a.categorie] || 0) + 1; });

        // Pipeline agréments
        const pipeline: Record<string, number> = {};
        agrements.forEach((a) => { pipeline[a.etapeActuelle] = (pipeline[a.etapeActuelle] || 0) + 1; });

        // Revenus par pilier (approx)
        const revParPilier = {
            Agrément: paiements.filter((p) => p.type === "agrement" && p.dateCreation > now - thisMonth).reduce((s, p) => s + p.montant, 0),
            Import: paiements.filter((p) => p.type === "importation" && p.dateCreation > now - thisMonth).reduce((s, p) => s + p.montant, 0),
            Labo: paiements.filter((p) => p.type === "analyse" && p.dateCreation > now - thisMonth).reduce((s, p) => s + p.montant, 0),
            Phyto: paiements.filter((p) => p.type === "phytosanitaire" && p.dateCreation > now - thisMonth).reduce((s, p) => s + p.montant, 0),
            Amendes: amendesPayees,
        };

        // Activité récente
        const auditLogs = await ctx.db.query("auditLogs").collect();
        const recentLogs = auditLogs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

        return {
            totalOperateurs: operateurs.length,
            nouveauxMois: opThisMonth.length,
            agrementsActifs: agrActifs.length,
            agrementsEnCours: agrements.filter((a) => !["agree", "refuse"].includes(a.etapeActuelle)).length,
            importationsEnCours: impEnCours.length,
            revenusMois,
            tauxRecouvrement,
            alertesEnAttente: alertes.length,
            parProvince,
            parCategorie,
            pipeline,
            revParPilier,
            recentLogs,
        };
    },
});

export const listOperateurs = query({
    args: {
        adminFirebaseUid: v.string(),
        typeOperateur: v.optional(v.string()),
        province: v.optional(v.string()),
        statut: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx, args.adminFirebaseUid);
        let results = await ctx.db.query("operateurs").collect();

        if (args.typeOperateur) results = results.filter((o) => o.typeOperateur === args.typeOperateur);
        if (args.province) results = results.filter((o) => o.province === args.province);
        if (args.statut) results = results.filter((o) => o.statut === args.statut);

        // Enrichir avec count agrements + etablissements
        return await Promise.all(
            results.sort((a, b) => b.dateCreation - a.dateCreation).map(async (op) => {
                const etabs = await ctx.db.query("etablissements").withIndex("by_operateurId", (q) => q.eq("operateurId", op._id)).collect();
                const agrs = await ctx.db.query("agrements").withIndex("by_operateurId", (q) => q.eq("operateurId", op._id)).collect();
                return { ...op, nbEtablissements: etabs.length, nbAgrements: agrs.length };
            })
        );
    },
});

export const getOperateurAdmin = query({
    args: { adminFirebaseUid: v.string(), operateurId: v.id("operateurs") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx, args.adminFirebaseUid);
        const op = await ctx.db.get(args.operateurId);
        if (!op) return null;

        const etabs = await ctx.db.query("etablissements").withIndex("by_operateurId", (q) => q.eq("operateurId", op._id)).collect();
        const agrs = await ctx.db.query("agrements").withIndex("by_operateurId", (q) => q.eq("operateurId", op._id)).collect();
        const imps = await ctx.db.query("importations").withIndex("by_operateurId", (q) => q.eq("operateurId", op._id)).collect();
        const paiements = await ctx.db.query("paiements").filter((q) => q.eq(q.field("operateurId"), op._id)).collect();
        const amendes = await ctx.db.query("amendes").filter((q) => q.eq(q.field("operateurId"), op._id)).collect();

        return { ...op, etablissements: etabs, agrements: agrs, importations: imps, paiements, amendes };
    },
});

export const listAllAgrements = query({
    args: {
        adminFirebaseUid: v.string(),
        categorie: v.optional(v.string()),
        etape: v.optional(v.string()),
        province: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx, args.adminFirebaseUid);
        let results = await ctx.db.query("agrements").collect();

        if (args.categorie) results = results.filter((a) => a.categorie === args.categorie);
        if (args.etape) results = results.filter((a) => a.etapeActuelle === args.etape);

        return await Promise.all(
            results.sort((a, b) => a.dateCreation - b.dateCreation).map(async (agr) => {
                const op = await ctx.db.get(agr.operateurId);
                const etab = await ctx.db.get(agr.etablissementId);
                return {
                    ...agr,
                    operateurNom: op?.raisonSociale || "",
                    operateurProvince: op?.province || "",
                    etablissementNom: etab?.nom || "",
                    delaiJours: Math.ceil((Date.now() - agr.dateCreation) / (1000 * 60 * 60 * 24)),
                };
            })
        );
    },
});

export const listAllImportations = query({
    args: { adminFirebaseUid: v.string() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx, args.adminFirebaseUid);
        const results = await ctx.db.query("importations").collect();
        return await Promise.all(
            results.sort((a, b) => b.dateCreation - a.dateCreation).map(async (imp) => {
                const op = await ctx.db.get(imp.operateurId);
                return { ...imp, operateurNom: op?.raisonSociale || "" };
            })
        );
    },
});

export const listAllPaiements = query({
    args: { adminFirebaseUid: v.string() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx, args.adminFirebaseUid);
        const results = await ctx.db.query("paiements").collect();
        return await Promise.all(
            results.sort((a, b) => b.dateCreation - a.dateCreation).map(async (p) => {
                const op = await ctx.db.get(p.operateurId);
                return { ...p, operateurNom: op?.raisonSociale || "" };
            })
        );
    },
});

export const getAuditLogs = query({
    args: { adminFirebaseUid: v.string() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx, args.adminFirebaseUid);
        const logs = await ctx.db.query("auditLogs").collect();
        return logs.sort((a, b) => b.timestamp - a.timestamp);
    },
});
