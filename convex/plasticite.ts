import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { CATEGORIES_ACTION, CORTEX, SIGNAL_TYPES, genererCorrelationId } from "./lib/neocortex";

function parseValue(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export const lireConfig = query({
  args: { cle: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("configSysteme").collect();
    const config = rows.find((row) => row.cle === args.cle);
    if (!config) return null;
    return {
      ...config,
      valeur: parseValue(config.valeur),
    };
  },
});

export const ecrireConfig = mutation({
  args: {
    cle: v.string(),
    valeur: v.any(),
    categorie: v.string(),
    description: v.string(),
    modifiePar: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const rows = await ctx.db.query("configSysteme").collect();
    const existing = rows.find((row) => row.cle === args.cle);

    const payload = {
      cle: args.cle,
      valeur: JSON.stringify(args.valeur),
      categorie: args.categorie,
      description: args.description,
      modifiePar: args.modifiePar,
      dateModification: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("configSysteme", payload);
    }

    await ctx.db.insert("signaux", {
      type: SIGNAL_TYPES.CONFIG_MISE_A_JOUR,
      source: CORTEX.PLASTICITE,
      destination: CORTEX.LIMBIQUE,
      entiteType: "configSysteme",
      entiteId: args.cle,
      payload: { cle: args.cle, categorie: args.categorie },
      confiance: 1,
      priorite: "NORMAL",
      correlationId: genererCorrelationId(),
      traite: false,
      timestamp: now,
    });

    await ctx.db.insert("historiqueActions", {
      action: "CONFIG_MISE_A_JOUR",
      categorie: CATEGORIES_ACTION.SYSTEME,
      entiteType: "configSysteme",
      entiteId: args.cle,
      userId: args.modifiePar,
      details: { valeur: args.valeur },
      metadata: { source: CORTEX.PLASTICITE },
      timestamp: now,
    });

    return { success: true };
  },
});
