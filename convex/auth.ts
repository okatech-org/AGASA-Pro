import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Vérifie ou crée un opérateur lors de la connexion
export const syncOperateur = mutation({
    args: {
        firebaseUid: v.string(),
        email: v.optional(v.string()),
        telephone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();

        if (existing) {
            return { operateur: existing, isNew: false };
        }

        // Création d'un nouveau compte opérateur
        const operateurId = await ctx.db.insert("operateurs", {
            firebaseUid: args.firebaseUid,
            email: args.email,
            telephone: args.telephone,
            raisonSociale: "Nouveau Profil",
            rccm: "",
            nif: "",
            typeOperateur: "autre",
            activites: [],
            adresseSiege: "",
            ville: "",
            province: "Estuaire",
            representantNom: "",
            representantPrenom: "",
            representantTelephone: args.telephone || "",
            modulesActifs: [],
            statut: "en_attente_verification",
            dateCreation: Date.now(),
            dateModification: Date.now(),
            isDemo: false,
        });

        const newOperateur = await ctx.db.get(operateurId);
        return { operateur: newOperateur, isNew: true };
    },
});

// Met à jour le profil étape 3
export const completeProfile = mutation({
    args: {
        operateurId: v.id("operateurs"),
        raisonSociale: v.string(),
        rccm: v.string(),
        nif: v.string(),
        representantNom: v.string(),
        representantPrenom: v.string(),
        representantTelephone: v.string(),
        adresseSiege: v.string(),
        ville: v.string(),
        province: v.union(
            v.literal("Estuaire"),
            v.literal("Haut-Ogooué"),
            v.literal("Moyen-Ogooué"),
            v.literal("Ngounié"),
            v.literal("Nyanga"),
            v.literal("Ogooué-Ivindo"),
            v.literal("Ogooué-Lolo"),
            v.literal("Ogooué-Maritime"),
            v.literal("Woleu-Ntem")
        ),
    },
    handler: async (ctx, args) => {
        const { operateurId, ...profileData } = args;
        await ctx.db.patch(operateurId, {
            ...profileData,
            dateModification: Date.now(),
        });
        return true;
    },
});

// Met à jour les activités et déduit les modules actifs étape 4
export const setActivites = mutation({
    args: {
        operateurId: v.id("operateurs"),
        typeOperateur: v.union(
            v.literal("restaurateur"),
            v.literal("importateur"),
            v.literal("industriel"),
            v.literal("distributeur_intrants"),
            v.literal("transporteur"),
            v.literal("commercant"),
            v.literal("hotelier"),
            v.literal("boulanger"),
            v.literal("autre")
        ),
        activites: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const modulesMap: Record<string, string[]> = {
            restaurateur: ["agrement", "mon_dossier", "analyses"],
            hotelier: ["agrement", "mon_dossier"],
            boulanger: ["agrement", "mon_dossier"],
            commercant: ["agrement", "mon_dossier"],
            industriel: ["agrement", "mon_dossier", "analyses"],
            transporteur: ["agrement", "mon_dossier"],
            importateur: ["agrement", "importation", "analyses", "mon_dossier"],
            distributeur_intrants: ["agrement", "phytosanitaire", "mon_dossier"],
            autre: ["agrement", "mon_dossier"],
        };

        const modulesActifs = modulesMap[args.typeOperateur] || ["agrement", "mon_dossier"];

        // Si le typeOperateur n'est pas "autre", on écrase les modules s'ils n'étaient pas déjà définis
        await ctx.db.patch(args.operateurId, {
            typeOperateur: args.typeOperateur,
            activites: args.activites,
            modulesActifs,
            dateModification: Date.now(),
        });
        return modulesActifs;
    },
});

// Ajout d'établissement (Étape 5 de l'inscription)
export const addEtablissement = mutation({
    args: {
        operateurId: v.id("operateurs"),
        nom: v.string(),
        type: v.union(
            v.literal("restaurant"),
            v.literal("hotel"),
            v.literal("cantine"),
            v.literal("boulangerie"),
            v.literal("epicerie"),
            v.literal("superette"),
            v.literal("abattoir"),
            v.literal("usine"),
            v.literal("entrepot_frigo"),
            v.literal("vehicule_frigo"),
            v.literal("camion_livraison"),
            v.literal("marche"),
            v.literal("autre")
        ),
        categorie: v.union(
            v.literal("AS_CAT_1"),
            v.literal("AS_CAT_2"),
            v.literal("AS_CAT_3"),
            v.literal("TRANSPORT")
        ),
        adresse: v.string(),
        ville: v.string(),
        province: v.string(),
    },
    handler: async (ctx, args) => {
        const etablissementId = await ctx.db.insert("etablissements", {
            ...args,
            statut: "actif",
            dateCreation: Date.now(),
        });

        // Passer le profil à actif si c'est son premier établissement
        const operateur = await ctx.db.get(args.operateurId);
        if (operateur?.statut === "en_attente_verification") {
            await ctx.db.patch(args.operateurId, {
                statut: "actif",
                dateModification: Date.now(),
            });
        }

        return etablissementId;
    },
});

// Récupérer le profil connecté
export const getMyProfile = query({
    args: { firebaseUid: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("operateurs")
            .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .unique();
    },
});

// Journaliser la connexion
export const logLogin = mutation({
    args: {
        operateurId: v.string(), // On peut logger l'uid firebase en string avant d'avoir le vrai ID si besoin
        ip: v.optional(v.string()),
        userAgent: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("auditLogs", {
            userId: args.operateurId,
            userType: "operateur",
            action: "connexion",
            module: "auth",
            details: "Connexion réussie",
            ipAddress: args.ip,
            userAgent: args.userAgent,
            timestamp: Date.now(),
        });
    },
});
