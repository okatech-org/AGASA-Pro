import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

const actionArgs = {
  action: v.string(),
  categorie: v.string(),
  entiteType: v.string(),
  entiteId: v.optional(v.string()),
  userId: v.optional(v.string()),
  details: v.any(),
  metadata: v.optional(v.any()),
} as const;

export const loguerAction = internalMutation({
  args: actionArgs,
  handler: async (ctx, args) => {
    return ctx.db.insert("historiqueActions", {
      action: args.action,
      categorie: args.categorie,
      entiteType: args.entiteType,
      entiteId: args.entiteId,
      userId: args.userId,
      details: args.details,
      metadata: args.metadata,
      timestamp: Date.now(),
    });
  },
});

export const loguerActionPublic = mutation({
  args: actionArgs,
  handler: async (ctx, args) => {
    return ctx.db.insert("historiqueActions", {
      action: args.action,
      categorie: args.categorie,
      entiteType: args.entiteType,
      entiteId: args.entiteId,
      userId: args.userId,
      details: args.details,
      metadata: args.metadata,
      timestamp: Date.now(),
    });
  },
});

export const listerHistorique = query({
  args: {
    entiteType: v.optional(v.string()),
    entiteId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(200, args.limit ?? 50));
    const rows = await ctx.db
      .query("historiqueActions")
      .withIndex("by_timestamp")
      .order("desc")
      .take(500);

    return rows
      .filter((item) => (args.entiteType ? item.entiteType === args.entiteType : true))
      .filter((item) => (args.entiteId ? item.entiteId === args.entiteId : true))
      .slice(0, limit);
  },
});
