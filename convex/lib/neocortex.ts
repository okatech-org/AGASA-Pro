export const SIGNAL_TYPES = {
  DOSSIER_CREE: "DOSSIER_CREE",
  DOSSIER_SOUMIS: "DOSSIER_SOUMIS",
  FLUX_F1_ENVOYE: "FLUX_F1_ENVOYE",
  FLUX_F1_ERREUR: "FLUX_F1_ERREUR",
  CONFIG_MISE_A_JOUR: "CONFIG_MISE_A_JOUR",
} as const;

export const CORTEX = {
  LIMBIQUE: "LIMBIQUE",
  HIPPOCAMPE: "HIPPOCAMPE",
  PLASTICITE: "PLASTICITE",
  GATEWAY: "GATEWAY",
  METIER: "METIER",
} as const;

export const CATEGORIES_ACTION = {
  METIER: "METIER",
  SYSTEME: "SYSTEME",
  UTILISATEUR: "UTILISATEUR",
} as const;

export const genererCorrelationId = (): string => {
  const random = Math.random().toString(36).slice(2, 10);
  return `corr_${Date.now()}_${random}`;
};
