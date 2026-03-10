import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { CORTEX, genererCorrelationId } from "./lib/neocortex";

const signalArgs = {
  type: v.string(),
  source: v.string(),
  payload: v.any(),
  confiance: v.number(),
  priorite: v.union(v.literal("LOW"), v.literal("NORMAL"), v.literal("HIGH"), v.literal("CRITICAL")),
  correlationId: v.optional(v.string()),
  destination: v.optional(v.string()),
  entiteType: v.optional(v.string()),
  entiteId: v.optional(v.string()),
} as const;

export const emettreSignal = internalMutation({
  args: signalArgs,
  handler: async (ctx, args) => {
    return ctx.db.insert("signaux", {
      type: args.type,
      source: args.source,
      destination: args.destination ?? CORTEX.METIER,
      entiteType: args.entiteType,
      entiteId: args.entiteId,
      payload: args.payload,
      confiance: Math.max(0, Math.min(1, args.confiance)),
      priorite: args.priorite,
      correlationId: args.correlationId ?? genererCorrelationId(),
      traite: false,
      timestamp: Date.now(),
    });
  },
});

export const emettreSignalPublic = mutation({
  args: signalArgs,
  handler: async (ctx, args) => {
    return ctx.db.insert("signaux", {
      type: args.type,
      source: args.source,
      destination: args.destination ?? CORTEX.METIER,
      entiteType: args.entiteType,
      entiteId: args.entiteId,
      payload: args.payload,
      confiance: Math.max(0, Math.min(1, args.confiance)),
      priorite: args.priorite,
      correlationId: args.correlationId ?? genererCorrelationId(),
      traite: false,
      timestamp: Date.now(),
    });
  },
});

export const listerSignauxNonTraites = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(200, args.limit ?? 50));
    return ctx.db
      .query("signaux")
      .withIndex("by_non_traite", (q) => q.eq("traite", false))
      .order("desc")
      .take(limit);
  },
});
