import { mutation } from "./_generated/server";

export const populate = mutation({
    args: {},
    handler: async (ctx) => {
        // ============================================================
        // 1. OPÉRATEURS DÉMO
        // ============================================================
        const demoUsers = [
            {
                firebaseUid: "demo-restaurateur",
                email: "demo-restaurateur@agasa.ga",
                telephone: "+24177000001",
                raisonSociale: "Nguema Marie-Claire",
                rccm: "GA-LBV-2015-B-1122",
                nif: "11223344 X",
                typeOperateur: "restaurateur" as const,
                activites: ["restauration"],
                adresseSiege: "Quartier Louis, Libreville",
                ville: "Libreville",
                province: "Estuaire" as const,
                representantNom: "Nguema",
                representantPrenom: "Marie-Claire",
                representantTelephone: "+24177000001",
                modulesActifs: ["agrement", "mon_dossier"],
                statut: "actif" as const,
                isDemo: true,
            },
            {
                firebaseUid: "demo-importateur",
                email: "demo-importateur@agasa.ga",
                telephone: "+24177000002",
                raisonSociale: "SCI Import-Export",
                rccm: "GA-OWE-2010-B-9988",
                nif: "99887766 Y",
                typeOperateur: "importateur" as const,
                activites: ["import_export"],
                adresseSiege: "Zone portuaire, Owendo",
                ville: "Owendo",
                province: "Estuaire" as const,
                representantNom: "Mba",
                representantPrenom: "Jean-Pierre",
                representantTelephone: "+24177000002",
                modulesActifs: ["agrement", "importation", "analyses", "mon_dossier"],
                statut: "actif" as const,
                isDemo: true,
            },
            {
                firebaseUid: "demo-distributeur",
                email: "demo-distributeur@agasa.ga",
                telephone: "+24177000003",
                raisonSociale: "AgriGabon SARL",
                rccm: "GA-OYE-2018-B-3344",
                nif: "33445566 Z",
                typeOperateur: "distributeur_intrants" as const,
                activites: ["distribution_intrants"],
                adresseSiege: "Centre ville, Oyem",
                ville: "Oyem",
                province: "Woleu-Ntem" as const,
                representantNom: "Nzé",
                representantPrenom: "Paul",
                representantTelephone: "+24177000003",
                modulesActifs: ["agrement", "phytosanitaire", "mon_dossier"],
                statut: "actif" as const,
                isDemo: true,
            },
            {
                firebaseUid: "demo-epicier",
                email: "demo-epicier@agasa.ga",
                telephone: "+24177000004",
                raisonSociale: "Ondo Paulette",
                rccm: "GA-FCV-2020-A-5566",
                nif: "55667788 W",
                typeOperateur: "commercant" as const,
                activites: ["commerce_detail"],
                adresseSiege: "Quartier Léon Mba, Franceville",
                ville: "Franceville",
                province: "Haut-Ogooué" as const,
                representantNom: "Ondo",
                representantPrenom: "Paulette",
                representantTelephone: "+24177000004",
                modulesActifs: ["agrement", "mon_dossier"],
                statut: "actif" as const,
                isDemo: true,
            },
            {
                firebaseUid: "demo-industriel",
                email: "demo-industriel@agasa.ga",
                telephone: "+24177000005",
                raisonSociale: "Gabon Fish Processing SA",
                rccm: "GA-POG-2005-B-7788",
                nif: "77889900 V",
                typeOperateur: "industriel" as const,
                activites: ["transformation_poisson"],
                adresseSiege: "Zone industrielle, Port-Gentil",
                ville: "Port-Gentil",
                province: "Ogooué-Maritime" as const,
                representantNom: "Obiang",
                representantPrenom: "Marc",
                representantTelephone: "+24177000005",
                modulesActifs: ["agrement", "importation", "analyses", "phytosanitaire", "formation", "mon_dossier"],
                statut: "actif" as const,
                isDemo: true,
            }
        ];

        const operateurIds: Record<string, any> = {};

        for (const user of demoUsers) {
            const existing = await ctx.db
                .query("operateurs")
                .withIndex("by_firebaseUid", (q) => q.eq("firebaseUid", user.firebaseUid))
                .first();

            if (!existing) {
                const id = await ctx.db.insert("operateurs", {
                    ...user,
                    dateCreation: Date.now(),
                    dateModification: Date.now(),
                } as any);
                operateurIds[user.firebaseUid] = id;
            } else {
                // Update existing demo user to ensure modules match
                await ctx.db.patch(existing._id, {
                    modulesActifs: user.modulesActifs,
                    raisonSociale: user.raisonSociale,
                    email: user.email,
                    telephone: user.telephone,
                    dateModification: Date.now(),
                });
                operateurIds[user.firebaseUid] = existing._id;
            }
        }

        const DAY = 24 * 60 * 60 * 1000;
        const NOW = Date.now();

        // ============================================================
        // 2. RESTAURATEUR — Mme Nguema
        // ============================================================
        if (operateurIds["demo-restaurateur"]) {
            const opId = operateurIds["demo-restaurateur"];
            const existingEtab = await ctx.db.query("etablissements")
                .withIndex("by_operateurId", q => q.eq("operateurId", opId)).first();

            if (!existingEtab) {
                const etabId = await ctx.db.insert("etablissements", {
                    operateurId: opId,
                    nom: "Restaurant Le Baobab",
                    province: "Estuaire",
                    ville: "Libreville",
                    adresse: "Quartier Louis, près de la pharmacie",
                    categorie: "AS_CAT_2",
                    type: "restaurant",
                    statut: "actif",
                    scoreSmiley: 3,
                    dernierScoreSmileyDate: NOW - 42 * DAY,
                    dateCreation: NOW - 365 * DAY,
                });

                // Agrément actif
                await ctx.db.insert("agrements", {
                    operateurId: opId,
                    etablissementId: etabId,
                    type: "premiere_demande",
                    categorie: "AS_CAT_2",
                    etapeActuelle: "agree",
                    numeroDossier: "AGR-2026-00142",
                    piecesJointes: [],
                    montant: 250000,
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 380 * DAY, commentaire: "Dossier soumis" },
                        { etape: "paye", date: NOW - 380 * DAY, commentaire: "Paiement de 250 000 F reçu" },
                        { etape: "verification_documents", date: NOW - 375 * DAY, commentaire: "Documents conformes" },
                        { etape: "inspection_programmee", date: NOW - 370 * DAY, commentaire: "Inspection prévue" },
                        { etape: "agree", date: NOW - 365 * DAY, commentaire: "Avis favorable de la commission" }
                    ],
                    certificat: {
                        numero: "AGR-2026-00142",
                        qrCode: "https://agasa.ga/verify/AGR-2026-00142",
                        dateDelivrance: NOW - 365 * DAY,
                        dateExpiration: NOW + 17 * DAY, // ~17 jours — renouvellement bientôt !
                        pdfUrl: "/certificats/AGR-2026-00142.pdf",
                    },
                    dateExpiration: NOW + 17 * DAY,
                    rappelRenouvellementEnvoye: true,
                    dateCreation: NOW - 380 * DAY,
                    dateModification: NOW - 365 * DAY,
                });

                // 2 inspections
                await ctx.db.insert("historiqueInspections", {
                    operateurId: opId,
                    etablissementId: etabId,
                    typeInspection: "routine",
                    inspecteurRef: "INS-AGASA-001",
                    resultat: "conforme",
                    scoreAttribue: 3,
                    observationsResume: "Hygiène globale acceptable. Points d'amélioration sur la chaîne du froid et le rangement du stock.",
                    dateInspection: NOW - 42 * DAY,
                });
                await ctx.db.insert("historiqueInspections", {
                    operateurId: opId,
                    etablissementId: etabId,
                    typeInspection: "routine",
                    inspecteurRef: "INS-AGASA-002",
                    resultat: "conforme",
                    scoreAttribue: 3,
                    observationsResume: "Première visite d'inspection. Établissement conforme aux normes de base. Plan HACCP à renforcer.",
                    dateInspection: NOW - 200 * DAY,
                });

                // 1 paiement confirmé
                await ctx.db.insert("paiements", {
                    operateurId: opId,
                    reference: "PAY-2026-000142",
                    type: "agrement",
                    entiteRef: "AGR-2026-00142",
                    montant: 250000,
                    modePaiement: "mobile_money_airtel",
                    telephonePaiement: "+24177000001",
                    statut: "confirme",
                    horodatage: NOW - 380 * DAY,
                    dateCreation: NOW - 380 * DAY,
                });
            }
        }

        // ============================================================
        // 3. IMPORTATEUR — M. Mba
        // ============================================================
        if (operateurIds["demo-importateur"]) {
            const opId = operateurIds["demo-importateur"];
            const existingEtab = await ctx.db.query("etablissements")
                .withIndex("by_operateurId", q => q.eq("operateurId", opId)).first();

            if (!existingEtab) {
                const etabId = await ctx.db.insert("etablissements", {
                    operateurId: opId,
                    nom: "Entrepôt SCI Owendo",
                    province: "Estuaire",
                    ville: "Owendo",
                    adresse: "Zone portuaire, Owendo",
                    categorie: "AS_CAT_1",
                    type: "entrepot_frigo",
                    statut: "actif",
                    scoreSmiley: 4,
                    dernierScoreSmileyDate: NOW - 30 * DAY,
                    dateCreation: NOW - 730 * DAY,
                });

                // Agrément CAT 1 actif
                await ctx.db.insert("agrements", {
                    operateurId: opId,
                    etablissementId: etabId,
                    type: "premiere_demande",
                    categorie: "AS_CAT_1",
                    etapeActuelle: "agree",
                    numeroDossier: "AGR-2026-00089",
                    piecesJointes: [],
                    montant: 500000,
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 400 * DAY },
                        { etape: "paye", date: NOW - 400 * DAY },
                        { etape: "agree", date: NOW - 380 * DAY },
                    ],
                    certificat: {
                        numero: "AGR-2026-00089",
                        qrCode: "https://agasa.ga/verify/AGR-2026-00089",
                        dateDelivrance: NOW - 380 * DAY,
                        dateExpiration: NOW + 250 * DAY,
                        pdfUrl: "/certificats/AGR-2026-00089.pdf",
                    },
                    dateExpiration: NOW + 250 * DAY,
                    rappelRenouvellementEnvoye: false,
                    dateCreation: NOW - 400 * DAY,
                    dateModification: NOW - 380 * DAY,
                });

                // 3 dossiers d'importation
                await ctx.db.insert("importations", {
                    operateurId: opId,
                    numeroDossier: "IMP-2026-00089",
                    typeImportation: "alimentaire",
                    portArrivee: "Owendo",
                    paysOrigine: "Chine",
                    descriptionMarchandise: "40T de riz thaïlandais en sacs de 25kg",
                    nombreConteneurs: 3,
                    valeurDeclaree: 25000000,
                    documentsImportation: [],
                    prestations: [
                        { type: "declaration_importation", tarif: 50000, statut: "payee" },
                        { type: "inspection_documentaire", tarif: 225000, statut: "payee" },
                        { type: "certificat_amc", tarif: 200000, statut: "payee" },
                    ],
                    montantTotal: 475000,
                    etapeActuelle: "amc_delivree",
                    amcNumero: "AMC-2026-00089",
                    amcQrCode: "https://agasa.ga/verify/AMC-2026-00089",
                    amcPdfUrl: "/amc/AMC-2026-00089.pdf",
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 60 * DAY },
                        { etape: "en_traitement", date: NOW - 55 * DAY },
                        { etape: "amc_delivree", date: NOW - 40 * DAY },
                    ],
                    statut: "termine",
                    dateCreation: NOW - 60 * DAY,
                    dateModification: NOW - 40 * DAY,
                });

                await ctx.db.insert("importations", {
                    operateurId: opId,
                    numeroDossier: "IMP-2026-00112",
                    typeImportation: "alimentaire",
                    portArrivee: "Owendo",
                    paysOrigine: "Malaisie",
                    descriptionMarchandise: "Huile de palme raffinée, bidons de 5L",
                    nombreConteneurs: 1,
                    valeurDeclaree: 8000000,
                    documentsImportation: [],
                    prestations: [
                        { type: "declaration_importation", tarif: 50000, statut: "payee" },
                        { type: "inspection_documentaire", tarif: 75000, statut: "en_cours" },
                        { type: "certificat_amc", tarif: 200000, statut: "en_attente" },
                    ],
                    montantTotal: 325000,
                    etapeActuelle: "en_traitement",
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 10 * DAY },
                        { etape: "en_traitement", date: NOW - 5 * DAY },
                    ],
                    statut: "en_cours",
                    dateCreation: NOW - 10 * DAY,
                    dateModification: NOW - 5 * DAY,
                });

                await ctx.db.insert("importations", {
                    operateurId: opId,
                    numeroDossier: "IMP-2026-00134",
                    typeImportation: "alimentaire",
                    portArrivee: "Owendo",
                    paysOrigine: "Sénégal",
                    descriptionMarchandise: "Poisson congelé (thon et sardine)",
                    nombreConteneurs: 2,
                    valeurDeclaree: 15000000,
                    documentsImportation: [],
                    prestations: [],
                    montantTotal: 0,
                    etapeActuelle: "brouillon",
                    historiqueEtapes: [],
                    statut: "en_cours",
                    dateCreation: NOW - 2 * DAY,
                    dateModification: NOW - 2 * DAY,
                });

                // 1 commande d'analyse
                await ctx.db.insert("commandesAnalyses", {
                    operateurId: opId,
                    numeroCommande: "ANA-2026-00034",
                    echantillonDescription: "Riz thaïlandais — échantillon conteneur 1/3",
                    matrice: "cereale",
                    parametresSelectionnes: [
                        { parametreCode: "MB001", parametreNom: "Analyse microbiologique standard", tarif: 75000 },
                    ],
                    express: false,
                    montantTotal: 75000,
                    etapeActuelle: "resultats_disponibles",
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 40 * DAY },
                        { etape: "paye", date: NOW - 40 * DAY },
                        { etape: "echantillon_recu", date: NOW - 38 * DAY },
                        { etape: "en_analyse", date: NOW - 35 * DAY },
                        { etape: "resultats_disponibles", date: NOW - 30 * DAY },
                    ],
                    resultats: {
                        rapportRef: "RAP-2026-00034",
                        rapportPdfUrl: "/rapports/RAP-2026-00034.pdf",
                        datePublication: NOW - 30 * DAY,
                        conforme: true,
                    },
                    statut: "termine",
                    dateCreation: NOW - 40 * DAY,
                });

                // Inspections
                await ctx.db.insert("historiqueInspections", {
                    operateurId: opId,
                    etablissementId: etabId,
                    typeInspection: "routine",
                    inspecteurRef: "INS-AGASA-003",
                    resultat: "conforme",
                    scoreAttribue: 4,
                    observationsResume: "Entrepôt bien tenu. Chaîne du froid respectée. Documentation de traçabilité complète.",
                    dateInspection: NOW - 30 * DAY,
                });

                // 5 paiements
                const paiementsImportateur = [
                    { ref: "PAY-2026-000089", type: "agrement" as const, montant: 500000, date: NOW - 400 * DAY },
                    { ref: "PAY-2026-000201", type: "importation" as const, montant: 475000, date: NOW - 60 * DAY },
                    { ref: "PAY-2026-000234", type: "importation" as const, montant: 325000, date: NOW - 10 * DAY },
                    { ref: "PAY-2026-000256", type: "analyse" as const, montant: 75000, date: NOW - 40 * DAY },
                    { ref: "PAY-2026-000278", type: "importation" as const, montant: 50000, date: NOW - 2 * DAY },
                ];
                for (const p of paiementsImportateur) {
                    await ctx.db.insert("paiements", {
                        operateurId: opId,
                        reference: p.ref,
                        type: p.type,
                        entiteRef: p.ref,
                        montant: p.montant,
                        modePaiement: "mobile_money_airtel",
                        statut: "confirme",
                        horodatage: p.date,
                        dateCreation: p.date,
                    });
                }
            }
        }

        // ============================================================
        // 4. DISTRIBUTEUR — M. Nzé
        // ============================================================
        if (operateurIds["demo-distributeur"]) {
            const opId = operateurIds["demo-distributeur"];
            const existingEtab = await ctx.db.query("etablissements")
                .withIndex("by_operateurId", q => q.eq("operateurId", opId)).first();

            if (!existingEtab) {
                const etabId = await ctx.db.insert("etablissements", {
                    operateurId: opId,
                    nom: "Dépôt AgriGabon Oyem",
                    province: "Woleu-Ntem",
                    ville: "Oyem",
                    adresse: "Quartier commercial, Oyem",
                    categorie: "AS_CAT_2",
                    type: "entrepot_frigo",
                    statut: "actif",
                    scoreSmiley: 4,
                    dernierScoreSmileyDate: NOW - 60 * DAY,
                    dateCreation: NOW - 500 * DAY,
                });

                // Agrément CAT 2 actif
                await ctx.db.insert("agrements", {
                    operateurId: opId,
                    etablissementId: etabId,
                    type: "premiere_demande",
                    categorie: "AS_CAT_2",
                    etapeActuelle: "agree",
                    numeroDossier: "AGR-2026-00167",
                    piecesJointes: [],
                    montant: 250000,
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 500 * DAY },
                        { etape: "agree", date: NOW - 480 * DAY },
                    ],
                    certificat: {
                        numero: "AGR-2026-00167",
                        qrCode: "https://agasa.ga/verify/AGR-2026-00167",
                        dateDelivrance: NOW - 480 * DAY,
                        dateExpiration: NOW + 240 * DAY,
                        pdfUrl: "/certificats/AGR-2026-00167.pdf",
                    },
                    dateExpiration: NOW + 240 * DAY,
                    rappelRenouvellementEnvoye: false,
                    dateCreation: NOW - 500 * DAY,
                    dateModification: NOW - 480 * DAY,
                });

                // Licence intrants active
                await ctx.db.insert("licencesIntrants", {
                    operateurId: opId,
                    numeroLicence: "LIC-2026-00008",
                    typeIntrant: "pesticide",
                    montant: 150000,
                    statut: "delivre",
                    dateCreation: NOW - 300 * DAY,
                    dateDelivrance: NOW - 290 * DAY,
                    dateExpiration: NOW + 240 * DAY,
                });

                // 2 certificats phyto
                await ctx.db.insert("certificatsPhyto", {
                    operateurId: opId,
                    type: "importation",
                    numeroCertificat: "PHYTO-2026-00023",
                    produit: "Pesticides organophosphorés — usage agricole",
                    paysOrigine: "Cameroun",
                    quantite: 500,
                    unite: "kg",
                    lotNumero: "LOT-CAM-2026-001",
                    montant: 75000,
                    qrCode: "https://agasa.ga/verify/PHYTO-2026-00023",
                    pdfUrl: "/phyto/PHYTO-2026-00023.pdf",
                    statut: "delivre",
                    dateCreation: NOW - 120 * DAY,
                    dateDelivrance: NOW - 110 * DAY,
                });

                await ctx.db.insert("certificatsPhyto", {
                    operateurId: opId,
                    type: "importation",
                    numeroCertificat: "PHYTO-2026-00041",
                    produit: "Engrais NPK 15-15-15",
                    paysOrigine: "France",
                    quantite: 2000,
                    unite: "kg",
                    lotNumero: "LOT-FR-2026-015",
                    montant: 75000,
                    statut: "en_traitement",
                    dateCreation: NOW - 15 * DAY,
                });

                // Paiements
                const paiementsDist = [
                    { ref: "PAY-2026-000167", type: "agrement" as const, montant: 250000, date: NOW - 500 * DAY },
                    { ref: "PAY-2026-000310", type: "phytosanitaire" as const, montant: 75000, date: NOW - 120 * DAY },
                    { ref: "PAY-2026-000350", type: "phytosanitaire" as const, montant: 75000, date: NOW - 15 * DAY },
                ];
                for (const p of paiementsDist) {
                    await ctx.db.insert("paiements", {
                        operateurId: opId,
                        reference: p.ref,
                        type: p.type,
                        entiteRef: p.ref,
                        montant: p.montant,
                        modePaiement: "mobile_money_moov",
                        statut: "confirme",
                        horodatage: p.date,
                        dateCreation: p.date,
                    });
                }

                // Registre produits phyto (10 produits)
                const existingRegistre = await ctx.db.query("registreProduitAutorise").first();
                if (!existingRegistre) {
                    const produits = [
                        { nom: "Roundup Extra 360", matiere: "Glyphosate 360g/L", formulation: "SL", fabricant: "Monsanto", pays: "USA", usage: "Herbicide non sélectif", cultures: "Toutes cultures", lmr: "0,1 mg/kg", dose: "3-5 L/ha" },
                        { nom: "Décis Expert", matiere: "Deltaméthrine 100g/L", formulation: "EC", fabricant: "Bayer", pays: "Allemagne", usage: "Insecticide", cultures: "Maraîchage, coton", lmr: "0,05 mg/kg", dose: "0,5-1 L/ha" },
                        { nom: "Mancozeb 80 WP", matiere: "Mancozèbe 800g/kg", formulation: "WP", fabricant: "Dow AgroSciences", pays: "France", usage: "Fongicide", cultures: "Cacao, café, légumes", lmr: "0,5 mg/kg", dose: "2-3 kg/ha" },
                        { nom: "NPK 15-15-15", matiere: "Azote-Phosphore-Potassium", formulation: "Granulé", fabricant: "OCP", pays: "Maroc", usage: "Engrais complet", cultures: "Toutes cultures", lmr: "N/A", dose: "200-400 kg/ha" },
                        { nom: "Urée 46%", matiere: "Azote 46%", formulation: "Granulé", fabricant: "Yara", pays: "Norvège", usage: "Engrais azoté", cultures: "Céréales, maraîchage", lmr: "N/A", dose: "100-200 kg/ha" },
                        { nom: "Cypercal 50 EC", matiere: "Cyperméthrine 50g/L", formulation: "EC", fabricant: "Callivoire", pays: "Côte d'Ivoire", usage: "Insecticide", cultures: "Cacao, palmier", lmr: "0,05 mg/kg", dose: "0,5-1 L/ha" },
                        { nom: "Semences maïs TZPB-SR", matiere: "Variété améliorée", formulation: "Semence certifiée", fabricant: "IITA", pays: "Nigeria", usage: "Semence", cultures: "Maïs", lmr: "N/A", dose: "25 kg/ha" },
                        { nom: "Dithane M-45", matiere: "Mancozèbe 800g/kg", formulation: "WP", fabricant: "Corteva", pays: "USA", usage: "Fongicide de contact", cultures: "Légumes, fruitiers", lmr: "0,5 mg/kg", dose: "2 kg/ha" },
                        { nom: "K-Optimal", matiere: "Lambda-cyhalothrine 15g/L + Acétamipride 20g/L", formulation: "EC", fabricant: "Arysta", pays: "France", usage: "Insecticide", cultures: "Coton, cacao", lmr: "0,02 mg/kg", dose: "1 L/ha" },
                        { nom: "SuperGro", matiere: "Oligo-éléments + acides humiques", formulation: "Liquide", fabricant: "GNLD", pays: "USA", usage: "Bio-stimulant", cultures: "Toutes cultures", lmr: "N/A", dose: "1-2 L/ha" },
                    ];

                    for (let i = 0; i < produits.length; i++) {
                        const p = produits[i];
                        await ctx.db.insert("registreProduitAutorise", {
                            nomCommercial: p.nom,
                            matiereActive: p.matiere,
                            formulation: p.formulation,
                            fabricant: p.fabricant,
                            paysOrigine: p.pays,
                            usageAutorise: p.usage,
                            culturesCibles: p.cultures,
                            restrictionsLMR: p.lmr,
                            doseRecommandee: p.dose,
                            numeroHomologation: `HOM-2026-${String(i + 1).padStart(3, "0")}`,
                            dateHomologation: NOW - 365 * DAY,
                            dateExpiration: NOW + 730 * DAY,
                            statut: "autorise",
                        });
                    }
                }
            }
        }

        // ============================================================
        // 5. ÉPICIER — Mme Ondo (agrément EN COURS)
        // ============================================================
        if (operateurIds["demo-epicier"]) {
            const opId = operateurIds["demo-epicier"];
            const existingEtab = await ctx.db.query("etablissements")
                .withIndex("by_operateurId", q => q.eq("operateurId", opId)).first();

            if (!existingEtab) {
                const etabId = await ctx.db.insert("etablissements", {
                    operateurId: opId,
                    nom: "Épicerie du Quartier",
                    province: "Haut-Ogooué",
                    ville: "Franceville",
                    adresse: "Quartier Léon Mba, Franceville",
                    categorie: "AS_CAT_3",
                    type: "epicerie",
                    statut: "actif",
                    dateCreation: NOW - 16 * DAY,
                });

                // Agrément EN COURS — étape 4/5
                await ctx.db.insert("agrements", {
                    operateurId: opId,
                    etablissementId: etabId,
                    type: "premiere_demande",
                    categorie: "AS_CAT_3",
                    etapeActuelle: "inspection_programmee",
                    numeroDossier: "AGR-2026-00198",
                    piecesJointes: [],
                    montant: 100000,
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 16 * DAY, commentaire: "Vos documents ont été envoyés" },
                        { etape: "paye", date: NOW - 16 * DAY, commentaire: "Votre paiement de 100 000 F a été confirmé" },
                        { etape: "verification_documents", date: NOW - 12 * DAY, commentaire: "Vos documents sont conformes" },
                        { etape: "inspection_programmee", date: NOW + 2 * DAY, commentaire: "Un inspecteur visitera votre épicerie le 28 février. Préparez votre établissement !" },
                    ],
                    inspectionProgrammee: {
                        date: NOW + 2 * DAY,
                        inspecteurRef: "INS-AGASA-004",
                        commentaire: "Inspection prévue le 28 février 2026",
                    },
                    rappelRenouvellementEnvoye: false,
                    dateCreation: NOW - 16 * DAY,
                    dateModification: NOW - 12 * DAY,
                });

                // 1 paiement
                await ctx.db.insert("paiements", {
                    operateurId: opId,
                    reference: "PAY-2026-000198",
                    type: "agrement",
                    entiteRef: "AGR-2026-00198",
                    montant: 100000,
                    modePaiement: "mobile_money_airtel",
                    telephonePaiement: "+24177000004",
                    statut: "confirme",
                    horodatage: NOW - 16 * DAY,
                    dateCreation: NOW - 16 * DAY,
                });
            }
        }

        // ============================================================
        // 6. INDUSTRIEL — M. Obiang (TOUS LES MODULES)
        // ============================================================
        if (operateurIds["demo-industriel"]) {
            const opId = operateurIds["demo-industriel"];
            const existingEtab = await ctx.db.query("etablissements")
                .withIndex("by_operateurId", q => q.eq("operateurId", opId)).first();

            if (!existingEtab) {
                const etabId = await ctx.db.insert("etablissements", {
                    operateurId: opId,
                    nom: "Usine de transformation Gabon Fish",
                    province: "Ogooué-Maritime",
                    ville: "Port-Gentil",
                    adresse: "Zone industrielle, Port-Gentil",
                    categorie: "AS_CAT_1",
                    type: "usine",
                    statut: "actif",
                    scoreSmiley: 4,
                    dernierScoreSmileyDate: NOW - 20 * DAY,
                    dateCreation: NOW - 1000 * DAY,
                });

                // Agrément CAT 1 actif
                await ctx.db.insert("agrements", {
                    operateurId: opId,
                    etablissementId: etabId,
                    type: "premiere_demande",
                    categorie: "AS_CAT_1",
                    etapeActuelle: "agree",
                    numeroDossier: "AGR-2026-00045",
                    piecesJointes: [],
                    montant: 500000,
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 400 * DAY },
                        { etape: "agree", date: NOW - 370 * DAY },
                    ],
                    certificat: {
                        numero: "AGR-2026-00045",
                        qrCode: "https://agasa.ga/verify/AGR-2026-00045",
                        dateDelivrance: NOW - 370 * DAY,
                        dateExpiration: NOW + 180 * DAY,
                        pdfUrl: "/certificats/AGR-2026-00045.pdf",
                    },
                    dateExpiration: NOW + 180 * DAY,
                    rappelRenouvellementEnvoye: false,
                    dateCreation: NOW - 400 * DAY,
                    dateModification: NOW - 370 * DAY,
                });

                // 2 importations
                await ctx.db.insert("importations", {
                    operateurId: opId,
                    numeroDossier: "IMP-2026-00145",
                    typeImportation: "alimentaire",
                    portArrivee: "Port-Gentil",
                    paysOrigine: "Sénégal",
                    descriptionMarchandise: "Matières premières de transformation — poisson frais",
                    nombreConteneurs: 2,
                    valeurDeclaree: 20000000,
                    documentsImportation: [],
                    prestations: [
                        { type: "declaration_importation", tarif: 50000, statut: "payee" },
                        { type: "inspection_documentaire", tarif: 150000, statut: "payee" },
                        { type: "certificat_amc", tarif: 200000, statut: "payee" },
                    ],
                    montantTotal: 400000,
                    etapeActuelle: "amc_delivree",
                    amcNumero: "AMC-2026-00145",
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 90 * DAY },
                        { etape: "amc_delivree", date: NOW - 60 * DAY },
                    ],
                    statut: "termine",
                    dateCreation: NOW - 90 * DAY,
                    dateModification: NOW - 60 * DAY,
                });

                await ctx.db.insert("importations", {
                    operateurId: opId,
                    numeroDossier: "IMP-2026-00178",
                    typeImportation: "alimentaire",
                    portArrivee: "Port-Gentil",
                    paysOrigine: "Côte d'Ivoire",
                    descriptionMarchandise: "Emballages alimentaires et additifs autorisés",
                    nombreConteneurs: 1,
                    valeurDeclaree: 5000000,
                    documentsImportation: [],
                    prestations: [
                        { type: "declaration_importation", tarif: 50000, statut: "payee" },
                        { type: "inspection_documentaire", tarif: 75000, statut: "en_cours" },
                    ],
                    montantTotal: 125000,
                    etapeActuelle: "en_traitement",
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 7 * DAY },
                        { etape: "en_traitement", date: NOW - 3 * DAY },
                    ],
                    statut: "en_cours",
                    dateCreation: NOW - 7 * DAY,
                    dateModification: NOW - 3 * DAY,
                });

                // 2 commandes analyses
                await ctx.db.insert("commandesAnalyses", {
                    operateurId: opId,
                    numeroCommande: "ANA-2026-00056",
                    echantillonDescription: "Filets de poisson surgelé — lot production 15/02",
                    matrice: "poisson",
                    parametresSelectionnes: [
                        { parametreCode: "MB001", parametreNom: "Analyse microbiologique standard", tarif: 75000 },
                        { parametreCode: "CH003", parametreNom: "Recherche métaux lourds", tarif: 120000 },
                    ],
                    express: false,
                    montantTotal: 195000,
                    etapeActuelle: "resultats_disponibles",
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 30 * DAY },
                        { etape: "resultats_disponibles", date: NOW - 15 * DAY },
                    ],
                    resultats: {
                        rapportRef: "RAP-2026-00056",
                        rapportPdfUrl: "/rapports/RAP-2026-00056.pdf",
                        datePublication: NOW - 15 * DAY,
                        conforme: true,
                    },
                    statut: "termine",
                    dateCreation: NOW - 30 * DAY,
                });

                await ctx.db.insert("commandesAnalyses", {
                    operateurId: opId,
                    numeroCommande: "ANA-2026-00078",
                    echantillonDescription: "Eau de process — station de traitement",
                    matrice: "eau",
                    parametresSelectionnes: [
                        { parametreCode: "MB005", parametreNom: "Analyse bactériologique eau", tarif: 50000 },
                    ],
                    express: false,
                    montantTotal: 50000,
                    etapeActuelle: "en_analyse",
                    historiqueEtapes: [
                        { etape: "soumis", date: NOW - 5 * DAY },
                        { etape: "echantillon_recu", date: NOW - 3 * DAY },
                        { etape: "en_analyse", date: NOW - 1 * DAY },
                    ],
                    statut: "en_cours",
                    dateCreation: NOW - 5 * DAY,
                });

                // 1 certificat phyto
                await ctx.db.insert("certificatsPhyto", {
                    operateurId: opId,
                    type: "importation",
                    numeroCertificat: "PHYTO-2026-00056",
                    produit: "Produits de nettoyage industriel alimentaire",
                    paysOrigine: "France",
                    quantite: 200,
                    unite: "litres",
                    lotNumero: "LOT-FR-2026-089",
                    montant: 75000,
                    qrCode: "https://agasa.ga/verify/PHYTO-2026-00056",
                    pdfUrl: "/phyto/PHYTO-2026-00056.pdf",
                    statut: "delivre",
                    dateCreation: NOW - 45 * DAY,
                    dateDelivrance: NOW - 35 * DAY,
                });

                // Formations
                const existingFormation = await ctx.db.query("modulesFormation").first();
                if (!existingFormation) {
                    const formHygiene = await ctx.db.insert("modulesFormation", {
                        titre: "Hygiène alimentaire — Les bases",
                        description: "Formation complète sur les principes fondamentaux de l'hygiène alimentaire pour les professionnels.",
                        niveau: "debutant",
                        categorie: "hygiene_generale",
                        contenu: [
                            { ordre: 1, type: "texte", titre: "Introduction à l'hygiène alimentaire", duree: 15 },
                            { ordre: 2, type: "video", titre: "Les 5 clés de la sécurité alimentaire (OMS)", duree: 20, url: "/formations/video-hygiene-1.mp4" },
                            { ordre: 3, type: "texte", titre: "Les dangers microbiologiques", duree: 20 },
                            { ordre: 4, type: "quiz", titre: "Quiz intermédiaire", duree: 10 },
                            { ordre: 5, type: "texte", titre: "Bonnes pratiques de manipulation", duree: 25 },
                            { ordre: 6, type: "video", titre: "Le lavage des mains en démonstration", duree: 10, url: "/formations/video-hygiene-2.mp4" },
                            { ordre: 7, type: "quiz", titre: "Quiz final", duree: 20 },
                        ],
                        quiz: [
                            { question: "À quelle température doit-on conserver la viande crue ?", options: ["Ambiante", "Entre 0 et 4°C", "Entre 10 et 15°C", "Au congélateur uniquement"], reponseCorrecte: 1, explication: "La viande crue doit être conservée entre 0 et 4°C pour limiter la prolifération bactérienne." },
                            { question: "Combien de temps dure un lavage des mains efficace ?", options: ["5 secondes", "10 secondes", "Au moins 20 secondes", "1 minute"], reponseCorrecte: 2, explication: "Un lavage des mains efficace dure au minimum 20 secondes avec du savon." },
                        ],
                        tarif: 50000,
                        dureeEstimee: 120,
                        actif: true,
                    });

                    const formHACCP = await ctx.db.insert("modulesFormation", {
                        titre: "HACCP en pratique",
                        description: "Maîtrisez les 7 principes HACCP et appliquez-les dans votre établissement de transformation alimentaire.",
                        niveau: "intermediaire",
                        categorie: "haccp",
                        contenu: [
                            { ordre: 1, type: "texte", titre: "Introduction au HACCP", duree: 20 },
                            { ordre: 2, type: "texte", titre: "Les 7 principes HACCP", duree: 30 },
                            { ordre: 3, type: "video", titre: "Analyse des dangers en pratique", duree: 25, url: "/formations/video-haccp-1.mp4" },
                            { ordre: 4, type: "texte", titre: "Définir les points critiques (CCP)", duree: 30 },
                            { ordre: 5, type: "texte", titre: "Plan de surveillance et mesures correctives", duree: 25 },
                            { ordre: 6, type: "quiz", titre: "Quiz final HACCP", duree: 30 },
                        ],
                        quiz: [
                            { question: "Combien de principes comporte le système HACCP ?", options: ["5", "7", "10", "12"], reponseCorrecte: 1, explication: "Le système HACCP repose sur 7 principes fondamentaux." },
                            { question: "Que signifie CCP ?", options: ["Contrôle Critique de Production", "Critical Control Point", "Centre de Contrôle Permanent", "Certificat de Conformité des Produits"], reponseCorrecte: 1, explication: "CCP = Critical Control Point (Point de Contrôle Critique)." },
                        ],
                        tarif: 100000,
                        dureeEstimee: 240,
                        actif: true,
                    });

                    // Inscriptions de M. Obiang
                    await ctx.db.insert("inscriptionsFormation", {
                        operateurId: opId,
                        moduleFormationId: formHygiene,
                        progression: 100,
                        quizResultats: [
                            { questionIndex: 0, reponse: 1, correct: true },
                            { questionIndex: 1, reponse: 2, correct: true },
                        ],
                        scoreQuiz: 85,
                        certificat: {
                            numero: "CERT-FORM-2026-00012",
                            qrCode: "https://agasa.ga/verify/CERT-FORM-2026-00012",
                            pdfUrl: "/certifications/CERT-FORM-2026-00012.pdf",
                            dateDelivrance: NOW - 90 * DAY,
                        },
                        statut: "certifie",
                        dateInscription: NOW - 120 * DAY,
                        dateCertification: NOW - 90 * DAY,
                    });

                    await ctx.db.insert("inscriptionsFormation", {
                        operateurId: opId,
                        moduleFormationId: formHACCP,
                        progression: 65,
                        quizResultats: [],
                        statut: "en_cours",
                        dateInscription: NOW - 30 * DAY,
                    });
                }

                // 2 inspections
                await ctx.db.insert("historiqueInspections", {
                    operateurId: opId,
                    etablissementId: etabId,
                    typeInspection: "routine",
                    inspecteurRef: "INS-AGASA-005",
                    resultat: "conforme",
                    scoreAttribue: 4,
                    observationsResume: "Usine aux normes. Plan HACCP bien appliqué. Traçabilité documentée.",
                    dateInspection: NOW - 20 * DAY,
                });
                await ctx.db.insert("historiqueInspections", {
                    operateurId: opId,
                    etablissementId: etabId,
                    typeInspection: "routine",
                    inspecteurRef: "INS-AGASA-003",
                    resultat: "conforme",
                    scoreAttribue: 4,
                    observationsResume: "Bonne gestion de la chaîne du froid. Formation du personnel adéquate.",
                    dateInspection: NOW - 180 * DAY,
                });

                // 8 paiements
                const paiementsInd = [
                    { ref: "PAY-2026-000045", type: "agrement" as const, montant: 500000, date: NOW - 400 * DAY },
                    { ref: "PAY-2026-000145", type: "importation" as const, montant: 400000, date: NOW - 90 * DAY },
                    { ref: "PAY-2026-000178", type: "importation" as const, montant: 125000, date: NOW - 7 * DAY },
                    { ref: "PAY-2026-000256B", type: "analyse" as const, montant: 195000, date: NOW - 30 * DAY },
                    { ref: "PAY-2026-000278B", type: "analyse" as const, montant: 50000, date: NOW - 5 * DAY },
                    { ref: "PAY-2026-000312", type: "phytosanitaire" as const, montant: 75000, date: NOW - 45 * DAY },
                    { ref: "PAY-2026-000345", type: "formation" as const, montant: 50000, date: NOW - 120 * DAY },
                    { ref: "PAY-2026-000367", type: "formation" as const, montant: 100000, date: NOW - 30 * DAY },
                ];
                for (const p of paiementsInd) {
                    await ctx.db.insert("paiements", {
                        operateurId: opId,
                        reference: p.ref,
                        type: p.type,
                        entiteRef: p.ref,
                        montant: p.montant,
                        modePaiement: "mobile_money_airtel",
                        statut: "confirme",
                        horodatage: p.date,
                        dateCreation: p.date,
                    });
                }
            }
        }

        // ============================================================
        // 7. ADMIN SYSTÈME
        // ============================================================
        const adminExists = await ctx.db.query("admins").filter(q => q.eq(q.field("email"), "demo-admin-pro@agasa.ga")).first();
        if (!adminExists) {
            await ctx.db.insert("admins", {
                firebaseUid: "demo-admin-pro",
                email: "demo-admin-pro@agasa.ga",
                nom: "Système",
                prenom: "Admin",
                role: "admin_systeme",
                permissions: ["all"],
                statut: "actif",
                dateCreation: NOW,
            });
        }

        // Supprimer l'ancien admin incomplet s'il existe
        const oldAdmin = await ctx.db.query("admins").filter(q => q.eq(q.field("email"), "admin@agasa.ga")).first();
        if (oldAdmin) {
            await ctx.db.delete(oldAdmin._id);
        }

        return { success: true, message: "Données de démo injectées avec succès pour les 5 profils opérateur + admin." };
    },
});
