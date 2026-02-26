import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // === OPÉRATEURS & AUTHENTIFICATION ===
    operateurs: defineTable({
        firebaseUid: v.string(), // unique
        email: v.optional(v.string()),
        telephone: v.optional(v.string()), // Format +241XXXXXXXX
        raisonSociale: v.string(),
        rccm: v.string(),
        nif: v.string(),
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
        activites: v.array(v.string()), // Permet multi-activités
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
        representantNom: v.string(),
        representantPrenom: v.string(),
        representantTelephone: v.string(),
        modulesActifs: v.array(v.string()), // ["agrement", "importation", ...]
        statut: v.union(
            v.literal("en_attente_verification"),
            v.literal("actif"),
            v.literal("suspendu"),
            v.literal("desactive")
        ),
        dateCreation: v.number(),
        dateModification: v.number(),
        mandataires: v.optional(
            v.array(
                v.object({
                    nom: v.string(),
                    prenom: v.string(),
                    email: v.optional(v.string()),
                    telephone: v.string(),
                    role: v.string(),
                })
            )
        ),
        avatar: v.optional(v.string()),
        isDemo: v.boolean(),
    })
        .index("by_firebaseUid", ["firebaseUid"])
        .index("by_email", ["email"])
        .index("by_telephone", ["telephone"])
        .index("by_rccm", ["rccm"])
        .index("by_nif", ["nif"])
        .index("by_province", ["province"])
        .index("by_statut", ["statut"]),

    etablissements: defineTable({
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
        gpsLatitude: v.optional(v.number()),
        gpsLongitude: v.optional(v.number()),
        telephone: v.optional(v.string()),
        nombreEmployes: v.optional(v.number()),
        scoreSmiley: v.optional(v.number()), // 0-5
        dernierScoreSmileyDate: v.optional(v.number()),
        statut: v.union(v.literal("actif"), v.literal("suspendu"), v.literal("ferme")),
        dateCreation: v.number(),
    })
        .index("by_operateurId", ["operateurId"])
        .index("by_province", ["province"])
        .index("by_categorie", ["categorie"])
        .index("by_statut", ["statut"]),

    // === MODULE AGRÉMENT (Pilier 1) ===
    agrements: defineTable({
        operateurId: v.id("operateurs"),
        etablissementId: v.id("etablissements"),
        type: v.union(
            v.literal("premiere_demande"),
            v.literal("renouvellement"),
            v.literal("modification")
        ),
        categorie: v.union(
            v.literal("AS_CAT_1"),
            v.literal("AS_CAT_2"),
            v.literal("AS_CAT_3"),
            v.literal("TRANSPORT")
        ),
        numeroDossier: v.string(), // AGR-2026-XXXXX
        montant: v.number(),
        paiementId: v.optional(v.id("paiements")),
        piecesJointes: v.array(
            v.object({
                nom: v.string(),
                type: v.string(), // plan_haccp, rccm, bail, plan_locaux, autre
                fichierUrl: v.string(),
                dateUpload: v.number(),
            })
        ),
        etapeActuelle: v.union(
            v.literal("brouillon"),
            v.literal("soumis"),
            v.literal("paiement_en_attente"),
            v.literal("paye"),
            v.literal("verification_documents"),
            v.literal("demande_complements"),
            v.literal("inspection_programmee"),
            v.literal("inspection_realisee"),
            v.literal("decision_en_cours"),
            v.literal("agree"),
            v.literal("refuse")
        ),
        historiqueEtapes: v.array(
            v.object({
                etape: v.string(),
                date: v.number(),
                commentaire: v.optional(v.string()),
                agent: v.optional(v.string()),
            })
        ),
        complements: v.optional(
            v.array(
                v.object({
                    demande: v.string(),
                    dateDemande: v.number(),
                    reponse: v.optional(v.string()),
                    dateReponse: v.optional(v.number()),
                    fichierUrl: v.optional(v.string()),
                })
            )
        ),
        inspectionProgrammee: v.optional(
            v.object({
                date: v.number(),
                inspecteurRef: v.string(),
                commentaire: v.optional(v.string()),
            })
        ),
        decision: v.optional(
            v.object({
                resultat: v.union(v.literal("agree"), v.literal("refuse")),
                motif: v.optional(v.string()),
                date: v.number(),
                agentRef: v.string(),
            })
        ),
        certificat: v.optional(
            v.object({
                numero: v.string(),
                qrCode: v.string(),
                dateDelivrance: v.number(),
                dateExpiration: v.number(),
                pdfUrl: v.string(),
            })
        ),
        dateExpiration: v.optional(v.number()),
        rappelRenouvellementEnvoye: v.boolean(),
        dateCreation: v.number(),
        dateModification: v.number(),
    })
        .index("by_operateurId", ["operateurId"])
        .index("by_etablissementId", ["etablissementId"])
        .index("by_numeroDossier", ["numeroDossier"])
        .index("by_etapeActuelle", ["etapeActuelle"])
        .index("by_categorie", ["categorie"])
        .index("by_dateExpiration", ["dateExpiration"]),

    grillesTarifaires: defineTable({
        categorie: v.union(
            v.literal("AS_CAT_1"),
            v.literal("AS_CAT_2"),
            v.literal("AS_CAT_3"),
            v.literal("TRANSPORT")
        ),
        typeDemande: v.union(
            v.literal("premiere_demande"),
            v.literal("renouvellement"),
            v.literal("modification")
        ),
        montant: v.number(),
        baseLegale: v.string(),
        actif: v.boolean(),
    }),

    // === MODULE IMPORTATION — GUI (Pilier 2) ===
    importations: defineTable({
        operateurId: v.id("operateurs"),
        numeroDossier: v.string(), // IMP-2026-XXXXX
        typeImportation: v.union(v.literal("alimentaire"), v.literal("phytosanitaire"), v.literal("mixte")),
        portArrivee: v.union(
            v.literal("Owendo"),
            v.literal("Port-Gentil"),
            v.literal("Aéroport_LBV"),
            v.literal("Frontière_terrestre")
        ),
        paysOrigine: v.string(),
        descriptionMarchandise: v.string(),
        nombreConteneurs: v.number(),
        valeurDeclaree: v.number(), // FCFA
        documentsImportation: v.array(
            v.object({
                type: v.string(), // manifeste, certificat_sanitaire_origine, etc.
                nom: v.string(),
                fichierUrl: v.string(),
                dateUpload: v.number(),
            })
        ),
        prestations: v.array(
            v.object({
                type: v.union(
                    v.literal("declaration_importation"),
                    v.literal("inspection_documentaire"),
                    v.literal("inspection_physique"),
                    v.literal("certificat_amc"),
                    v.literal("analyse_urgence"),
                    v.literal("certificat_reexportation")
                ),
                tarif: v.number(),
                statut: v.union(
                    v.literal("en_attente"),
                    v.literal("payee"),
                    v.literal("en_cours"),
                    v.literal("terminee")
                ),
                paiementId: v.optional(v.id("paiements")),
                dateRealisation: v.optional(v.number()),
            })
        ),
        montantTotal: v.number(),
        sydoniRef: v.optional(v.string()),
        amcNumero: v.optional(v.string()),
        amcQrCode: v.optional(v.string()),
        amcPdfUrl: v.optional(v.string()),
        etapeActuelle: v.union(
            v.literal("brouillon"),
            v.literal("soumis"),
            v.literal("verification_docs"),
            v.literal("paiement_en_attente"),
            v.literal("en_traitement"),
            v.literal("inspection_doc"),
            v.literal("inspection_physique"),
            v.literal("analyse_labo"),
            v.literal("decision"),
            v.literal("amc_delivree"),
            v.literal("reexportation"),
            v.literal("refuse")
        ),
        historiqueEtapes: v.array(
            v.object({
                etape: v.string(),
                date: v.number(),
                commentaire: v.optional(v.string()),
                agent: v.optional(v.string()),
            })
        ),
        statut: v.union(v.literal("en_cours"), v.literal("termine"), v.literal("refuse"), v.literal("annule")),
        dateCreation: v.number(),
        dateModification: v.number(),
    })
        .index("by_operateurId", ["operateurId"])
        .index("by_numeroDossier", ["numeroDossier"])
        .index("by_etapeActuelle", ["etapeActuelle"])
        .index("by_statut", ["statut"]),

    // === MODULE PHYTOSANITAIRE (Pilier 5) ===
    certificatsPhyto: defineTable({
        operateurId: v.id("operateurs"),
        type: v.union(v.literal("importation"), v.literal("exportation")),
        numeroCertificat: v.string(),
        produit: v.string(),
        paysOrigine: v.optional(v.string()),
        paysDestination: v.optional(v.string()),
        quantite: v.number(),
        unite: v.string(),
        lotNumero: v.string(),
        montant: v.number(),
        paiementId: v.optional(v.id("paiements")),
        qrCode: v.optional(v.string()),
        pdfUrl: v.optional(v.string()),
        statut: v.union(
            v.literal("brouillon"),
            v.literal("soumis"),
            v.literal("paye"),
            v.literal("en_traitement"),
            v.literal("delivre"),
            v.literal("refuse")
        ),
        dateCreation: v.number(),
        dateDelivrance: v.optional(v.number()),
    })
        .index("by_operateurId", ["operateurId"])
        .index("by_statut", ["statut"]),

    homologationsPesticides: defineTable({
        operateurId: v.id("operateurs"),
        nomCommercial: v.string(),
        matiereActive: v.string(),
        formulation: v.string(),
        usageAutorise: v.string(),
        restrictionsLMR: v.string(),
        montant: v.number(),
        paiementId: v.optional(v.id("paiements")),
        dossierCPAC: v.array(
            v.object({
                nom: v.string(),
                url: v.string(),
            })
        ),
        statut: v.union(
            v.literal("soumis"),
            v.literal("paye"),
            v.literal("en_evaluation"),
            v.literal("homologue"),
            v.literal("refuse")
        ),
        dateCreation: v.number(),
        dateHomologation: v.optional(v.number()),
        dateExpiration: v.optional(v.number()),
    }),

    licencesIntrants: defineTable({
        operateurId: v.id("operateurs"),
        numeroLicence: v.string(),
        typeIntrant: v.union(
            v.literal("pesticide"),
            v.literal("engrais"),
            v.literal("semence"),
            v.literal("autre")
        ),
        montant: v.number(),
        paiementId: v.optional(v.id("paiements")),
        pdfUrl: v.optional(v.string()),
        qrCode: v.optional(v.string()),
        statut: v.union(
            v.literal("soumis"),
            v.literal("paye"),
            v.literal("en_traitement"),
            v.literal("delivre"),
            v.literal("refuse"),
            v.literal("expire")
        ),
        dateCreation: v.number(),
        dateDelivrance: v.optional(v.number()),
        dateExpiration: v.optional(v.number()),
    }),

    registreProduitAutorise: defineTable({
        nomCommercial: v.string(),
        matiereActive: v.string(),
        formulation: v.string(),
        fabricant: v.string(),
        paysOrigine: v.string(),
        usageAutorise: v.string(),
        culturesCibles: v.string(),
        restrictionsLMR: v.string(),
        doseRecommandee: v.string(),
        numeroHomologation: v.string(),
        dateHomologation: v.number(),
        dateExpiration: v.number(),
        statut: v.union(v.literal("autorise"), v.literal("suspendu"), v.literal("retire")),
    }),

    // === MODULE ANALYSES (Pilier 3) ===
    commandesAnalyses: defineTable({
        operateurId: v.id("operateurs"),
        numeroCommande: v.string(),
        echantillonDescription: v.string(),
        matrice: v.union(
            v.literal("viande"),
            v.literal("poisson"),
            v.literal("cereale"),
            v.literal("fruit_legume"),
            v.literal("produit_laitier"),
            v.literal("eau"),
            v.literal("autre")
        ),
        parametresSelectionnes: v.array(
            v.object({
                parametreCode: v.string(),
                parametreNom: v.string(),
                tarif: v.number(),
            })
        ),
        express: v.boolean(),
        montantTotal: v.number(),
        paiementId: v.optional(v.id("paiements")),
        etapeActuelle: v.union(
            v.literal("brouillon"),
            v.literal("soumis"),
            v.literal("paye"),
            v.literal("echantillon_recu"),
            v.literal("en_analyse"),
            v.literal("resultats_disponibles")
        ),
        historiqueEtapes: v.array(
            v.object({
                etape: v.string(),
                date: v.number(),
                commentaire: v.optional(v.string()),
            })
        ),
        resultats: v.optional(
            v.object({
                rapportRef: v.string(),
                rapportPdfUrl: v.string(),
                datePublication: v.number(),
                conforme: v.boolean(),
            })
        ),
        statut: v.union(v.literal("en_cours"), v.literal("termine"), v.literal("annule")),
        dateCreation: v.number(),
    })
        .index("by_operateurId", ["operateurId"])
        .index("by_statut", ["statut"])
        .index("by_etapeActuelle", ["etapeActuelle"]),

    catalogueAnalyses: defineTable({
        code: v.string(),
        nom: v.string(),
        categorie: v.union(
            v.literal("microbiologique"),
            v.literal("chimique"),
            v.literal("physique"),
            v.literal("organoleptique")
        ),
        methode: v.string(),
        description: v.string(),
        tarif: v.number(),
        delaiJours: v.number(),
        actif: v.boolean(),
    }),

    // === MODULE ALERTES OPÉRATEURS ===
    alertesOperateurs: defineTable({
        operateurId: v.id("operateurs"),
        type: v.union(
            v.literal("rappel_lot"),
            v.literal("non_conformite"),
            v.literal("cemac"),
            v.literal("info")
        ),
        titre: v.string(),
        message: v.string(),
        details: v.string(),
        lotConcerne: v.optional(v.string()),
        actionRequise: v.optional(v.string()),
        delaiMiseConformite: v.optional(v.number()), // jours
        preuveConformite: v.optional(
            v.object({
                fichierUrl: v.string(),
                dateEnvoi: v.number(),
                statut: v.string(),
            })
        ),
        accuseReception: v.boolean(),
        dateAccuseReception: v.optional(v.number()),
        lu: v.boolean(),
        sourceRef: v.string(),
        dateCreation: v.number(),
    })
        .index("by_operateurId", ["operateurId"])
        .index("by_type", ["type"])
        .index("by_lu", ["lu"]),

    // === MODULE FORMATION HACCP (Premium) ===
    modulesFormation: defineTable({
        titre: v.string(),
        description: v.string(),
        niveau: v.union(v.literal("debutant"), v.literal("intermediaire"), v.literal("avance")),
        categorie: v.union(
            v.literal("hygiene_generale"),
            v.literal("haccp"),
            v.literal("manioc"),
            v.literal("poisson"),
            v.literal("alimentation_rue"),
            v.literal("conservation"),
            v.literal("etiquetage")
        ),
        contenu: v.array(
            v.object({
                ordre: v.number(),
                type: v.union(v.literal("video"), v.literal("texte"), v.literal("quiz")),
                titre: v.string(),
                duree: v.optional(v.number()),
                url: v.optional(v.string()),
            })
        ),
        quiz: v.array(
            v.object({
                question: v.string(),
                options: v.array(v.string()),
                reponseCorrecte: v.number(), // Index
                explication: v.string(),
            })
        ),
        tarif: v.number(),
        dureeEstimee: v.number(),
        actif: v.boolean(),
    }),

    inscriptionsFormation: defineTable({
        operateurId: v.id("operateurs"),
        moduleFormationId: v.id("modulesFormation"),
        progression: v.number(), // 0-100
        quizResultats: v.array(
            v.object({
                questionIndex: v.number(),
                reponse: v.number(),
                correct: v.boolean(),
            })
        ),
        scoreQuiz: v.optional(v.number()),
        paiementId: v.optional(v.id("paiements")),
        certificat: v.optional(
            v.object({
                numero: v.string(),
                qrCode: v.string(),
                pdfUrl: v.string(),
                dateDelivrance: v.number(),
            })
        ),
        statut: v.union(
            v.literal("inscrit"),
            v.literal("en_cours"),
            v.literal("quiz_passe"),
            v.literal("certifie"),
            v.literal("echec")
        ),
        dateInscription: v.number(),
        dateCertification: v.optional(v.number()),
    }),

    // === MODULE MON DOSSIER ===
    historiqueInspections: defineTable({
        operateurId: v.id("operateurs"),
        etablissementId: v.optional(v.id("etablissements")),
        dateInspection: v.number(),
        inspecteurRef: v.string(),
        typeInspection: v.union(
            v.literal("routine"),
            v.literal("ciblee"),
            v.literal("suite_signalement"),
            v.literal("renouvellement")
        ),
        resultat: v.union(
            v.literal("conforme"),
            v.literal("non_conforme"),
            v.literal("mise_en_demeure"),
            v.literal("fermeture")
        ),
        scoreAttribue: v.optional(v.number()), // 0-5
        observationsResume: v.string(),
        pvRef: v.optional(v.string()),
        rapportPdfUrl: v.optional(v.string()),
    }),

    amendes: defineTable({
        operateurId: v.id("operateurs"),
        etablissementId: v.optional(v.id("etablissements")),
        reference: v.string(),
        motif: v.string(),
        montant: v.number(),
        baseLegale: v.string(),
        pvRef: v.string(),
        dateEcheance: v.number(),
        statut: v.union(
            v.literal("en_attente"),
            v.literal("paye"),
            v.literal("en_retard"),
            v.literal("recouvrement_force")
        ),
        paiementId: v.optional(v.id("paiements")),
        dateCreation: v.number(),
    }),

    // === PAIEMENTS ===
    paiements: defineTable({
        operateurId: v.id("operateurs"),
        reference: v.string(), // PAY-2026-XXXXXX
        type: v.union(
            v.literal("agrement"),
            v.literal("importation"),
            v.literal("phytosanitaire"),
            v.literal("analyse"),
            v.literal("formation"),
            v.literal("amende"),
            v.literal("label_premium")
        ),
        entiteRef: v.string(), // ID de la demande liée
        montant: v.number(), // FCFA
        modePaiement: v.union(
            v.literal("mobile_money_airtel"),
            v.literal("mobile_money_moov"),
            v.literal("virement_bancaire"),
            v.literal("carte_bancaire")
        ),
        telephonePaiement: v.optional(v.string()),
        transactionExterneRef: v.optional(v.string()),
        statut: v.union(
            v.literal("initie"),
            v.literal("en_attente"),
            v.literal("confirme"),
            v.literal("echoue"),
            v.literal("rembourse"),
            v.literal("annule")
        ),
        recuPdfUrl: v.optional(v.string()),
        horodatage: v.optional(v.number()),
        dateCreation: v.number(),
    })
        .index("by_operateurId", ["operateurId"])
        .index("by_reference", ["reference"])
        .index("by_type", ["type"])
        .index("by_statut", ["statut"]),

    // === LABEL PREMIUM ===
    labelsPremium: defineTable({
        operateurId: v.id("operateurs"),
        etablissementId: v.optional(v.id("etablissements")),
        annee: v.number(),
        montant: v.number(),
        paiementId: v.optional(v.id("paiements")),
        badgeNumeriqueUrl: v.optional(v.string()),
        qrCode: v.optional(v.string()),
        statut: v.union(
            v.literal("demande"),
            v.literal("paye"),
            v.literal("actif"),
            v.literal("expire")
        ),
        dateCreation: v.number(),
        dateActivation: v.optional(v.number()),
        dateExpiration: v.optional(v.number()),
    }),

    // === SYSTÈME ===
    admins: defineTable({
        firebaseUid: v.string(), // unique
        email: v.string(),
        nom: v.string(),
        prenom: v.string(),
        role: v.union(
            v.literal("admin_systeme"),
            v.literal("agent_agasa"),
            v.literal("superviseur"),
            v.literal("demo")
        ),
        permissions: v.array(v.string()),
        statut: v.union(v.literal("actif"), v.literal("inactif")),
        dateCreation: v.number(),
    }),

    auditLogs: defineTable({
        userId: v.string(),
        userType: v.union(v.literal("operateur"), v.literal("admin")),
        action: v.string(),
        module: v.string(),
        details: v.string(),
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        entiteType: v.optional(v.string()),
        entiteId: v.optional(v.string()),
        timestamp: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_module", ["module"])
        .index("by_timestamp", ["timestamp"]),

    notifications: defineTable({
        destinataireId: v.string(),
        destinataireType: v.union(v.literal("operateur"), v.literal("admin")),
        titre: v.string(),
        message: v.string(),
        type: v.union(
            v.literal("info"),
            v.literal("alerte"),
            v.literal("action"),
            v.literal("paiement"),
            v.literal("rappel")
        ),
        lien: v.optional(v.string()),
        canaux: v.object({
            inApp: v.boolean(),
            sms: v.boolean(),
            email: v.boolean(),
        }),
        lu: v.boolean(),
        dateCreation: v.number(),
    })
        .index("by_destinataireId_lu", ["destinataireId", "lu"]),

    fluxInterApps: defineTable({
        fluxCode: v.union(v.literal("F1"), v.literal("F2")),
        direction: v.union(v.literal("envoi"), v.literal("reception")),
        typeMessage: v.string(),
        payload: v.string(), // JSON string
        statut: v.union(
            v.literal("envoye"),
            v.literal("recu"),
            v.literal("traite"),
            v.literal("erreur")
        ),
        dateEnvoi: v.optional(v.number()),
        dateReception: v.optional(v.number()),
        tentatives: v.optional(v.number()),
        erreur: v.optional(v.string()),
    }),

    configSysteme: defineTable({
        cle: v.string(),
        valeur: v.string(), // JSON stringifié
        categorie: v.string(),
        description: v.string(),
        modifiePar: v.string(),
        dateModification: v.number(),
    }),
});
