"use node";

import crypto from "crypto";
import { internalAction, internalMutation, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { CATEGORIES_ACTION, CORTEX, SIGNAL_TYPES, genererCorrelationId } from "../lib/neocortex";

const DEFAULT_CORE_GATEWAY_URL = "https://agasa-core.web.app";
const DEFAULT_TIMEOUT_MS = 10000;

type FluxCode = "F1";

function getCoreGatewayUrl(): string {
    return (process.env.AGASA_CORE_GATEWAY_URL || DEFAULT_CORE_GATEWAY_URL).replace(/\/$/, "");
}

function getGatewaySecret(flux: FluxCode): string {
    const scoped = process.env[`AGASA_GATEWAY_HMAC_SECRET_${flux}`];
    const shared = process.env.AGASA_GATEWAY_HMAC_SECRET || process.env.GATEWAY_HMAC_SECRET;
    const secret = scoped || shared;
    if (!secret) {
        throw new Error(`Secret HMAC manquant pour ${flux} (AGASA_GATEWAY_HMAC_SECRET_${flux} ou AGASA_GATEWAY_HMAC_SECRET)`);
    }
    return secret;
}

function signGatewayPayload(payload: { flux: FluxCode; timestamp: number; data: unknown }, secret: string): string {
    return crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");
}

function withTimeout(signalMs: number) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), signalMs);
    return { controller, clear: () => clearTimeout(timer) };
}

export const pushToCore = internalAction({
    args: {
        typeMessage: v.string(),
        payload: v.any(),
        fluxRefId: v.optional(v.id("fluxInterApps")),
    },
    handler: async (ctx, args) => {
        const internalApi = internal as any;
        const flux: FluxCode = "F1";
        const endpoint = `${getCoreGatewayUrl()}/api/gateway/f1`;
        let lastError = "Échec inconnu";

        for (let attempt = 1; attempt <= 3; attempt++) {
            const timestamp = Date.now();
            const basePayload = { flux, timestamp, data: args.payload };
            const signature = signGatewayPayload(basePayload, getGatewaySecret(flux));
            const body = JSON.stringify({ ...basePayload, signature });
            const timeout = withTimeout(DEFAULT_TIMEOUT_MS);

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Source-App": "AGASA-Pro",
                    },
                    body,
                    signal: timeout.controller.signal,
                });

                const responseBody = await response.text();
                if (!response.ok) {
                    lastError = `HTTP ${response.status} - ${responseBody || "Erreur API Core"}`;
                } else {
                    await ctx.runMutation(internalApi.gateway.outbound.markDispatchSuccess, {
                        fluxRefId: args.fluxRefId,
                        typeMessage: args.typeMessage,
                        payload: JSON.stringify(args.payload),
                        attempt,
                    });
                    timeout.clear();
                    return { success: true, attempt };
                }
            } catch (error) {
                lastError = error instanceof Error ? error.message : "Erreur réseau inconnue";
            } finally {
                timeout.clear();
            }

            if (attempt < 3) {
                await new Promise((resolve) => setTimeout(resolve, 300 * Math.pow(2, attempt)));
            }
        }

        await ctx.runMutation(internalApi.gateway.outbound.markDispatchError, {
            fluxRefId: args.fluxRefId,
            typeMessage: args.typeMessage,
            payload: JSON.stringify(args.payload),
            attempt: 3,
            error: lastError,
        });

        return { success: false, error: lastError };
    },
});

export const markDispatchSuccess = internalMutation({
    args: {
        fluxRefId: v.optional(v.id("fluxInterApps")),
        typeMessage: v.string(),
        payload: v.string(),
        attempt: v.number(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        if (args.fluxRefId) {
            const existing = await ctx.db.get(args.fluxRefId);
            if (existing) {
                await ctx.db.patch(args.fluxRefId, {
                    statut: "traite",
                    dateReception: now,
                    tentatives: args.attempt,
                });
                await ctx.db.insert("signaux", {
                    type: SIGNAL_TYPES.FLUX_F1_ENVOYE,
                    source: CORTEX.GATEWAY,
                    destination: CORTEX.HIPPOCAMPE,
                    entiteType: "fluxInterApps",
                    entiteId: String(args.fluxRefId),
                    payload: { typeMessage: args.typeMessage, attempt: args.attempt },
                    confiance: 1,
                    priorite: "NORMAL",
                    correlationId: genererCorrelationId(),
                    traite: false,
                    timestamp: now,
                });

                await ctx.db.insert("historiqueActions", {
                    action: "F1_DISPATCH_SUCCESS",
                    categorie: CATEGORIES_ACTION.SYSTEME,
                    entiteType: "fluxInterApps",
                    entiteId: String(args.fluxRefId),
                    userId: "system",
                    details: { typeMessage: args.typeMessage, attempt: args.attempt },
                    metadata: { source: CORTEX.GATEWAY },
                    timestamp: now,
                });
                return;
            }
        }

        await ctx.db.insert("fluxInterApps", {
            fluxCode: "F1",
            direction: "envoi",
            typeMessage: args.typeMessage,
            payload: args.payload,
            statut: "traite",
            dateEnvoi: now,
            dateReception: now,
            tentatives: args.attempt,
        });

        await ctx.db.insert("signaux", {
            type: SIGNAL_TYPES.FLUX_F1_ENVOYE,
            source: CORTEX.GATEWAY,
            destination: CORTEX.HIPPOCAMPE,
            entiteType: "fluxInterApps",
            entiteId: args.typeMessage,
            payload: { typeMessage: args.typeMessage, attempt: args.attempt },
            confiance: 1,
            priorite: "NORMAL",
            correlationId: genererCorrelationId(),
            traite: false,
            timestamp: now,
        });

        await ctx.db.insert("historiqueActions", {
            action: "F1_DISPATCH_SUCCESS",
            categorie: CATEGORIES_ACTION.SYSTEME,
            entiteType: "fluxInterApps",
            entiteId: args.typeMessage,
            userId: "system",
            details: { typeMessage: args.typeMessage, attempt: args.attempt },
            metadata: { source: CORTEX.GATEWAY },
            timestamp: now,
        });
    },
});

export const markDispatchError = internalMutation({
    args: {
        fluxRefId: v.optional(v.id("fluxInterApps")),
        typeMessage: v.string(),
        payload: v.string(),
        attempt: v.number(),
        error: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        if (args.fluxRefId) {
            const existing = await ctx.db.get(args.fluxRefId);
            if (existing) {
                await ctx.db.patch(args.fluxRefId, {
                    statut: "erreur",
                    tentatives: args.attempt,
                    erreur: args.error,
                    dateReception: now,
                });
                await ctx.db.insert("signaux", {
                    type: SIGNAL_TYPES.FLUX_F1_ERREUR,
                    source: CORTEX.GATEWAY,
                    destination: CORTEX.HIPPOCAMPE,
                    entiteType: "fluxInterApps",
                    entiteId: String(args.fluxRefId),
                    payload: { typeMessage: args.typeMessage, error: args.error, attempt: args.attempt },
                    confiance: 1,
                    priorite: "CRITICAL",
                    correlationId: genererCorrelationId(),
                    traite: false,
                    timestamp: now,
                });

                await ctx.db.insert("historiqueActions", {
                    action: "F1_DISPATCH_ERROR",
                    categorie: CATEGORIES_ACTION.SYSTEME,
                    entiteType: "fluxInterApps",
                    entiteId: String(args.fluxRefId),
                    userId: "system",
                    details: { typeMessage: args.typeMessage, error: args.error, attempt: args.attempt },
                    metadata: { source: CORTEX.GATEWAY },
                    timestamp: now,
                });
                return;
            }
        }

        await ctx.db.insert("fluxInterApps", {
            fluxCode: "F1",
            direction: "envoi",
            typeMessage: args.typeMessage,
            payload: args.payload,
            statut: "erreur",
            dateEnvoi: now,
            dateReception: now,
            tentatives: args.attempt,
            erreur: args.error,
        });

        await ctx.db.insert("signaux", {
            type: SIGNAL_TYPES.FLUX_F1_ERREUR,
            source: CORTEX.GATEWAY,
            destination: CORTEX.HIPPOCAMPE,
            entiteType: "fluxInterApps",
            entiteId: args.typeMessage,
            payload: { typeMessage: args.typeMessage, error: args.error, attempt: args.attempt },
            confiance: 1,
            priorite: "CRITICAL",
            correlationId: genererCorrelationId(),
            traite: false,
            timestamp: now,
        });

        await ctx.db.insert("historiqueActions", {
            action: "F1_DISPATCH_ERROR",
            categorie: CATEGORIES_ACTION.SYSTEME,
            entiteType: "fluxInterApps",
            entiteId: args.typeMessage,
            userId: "system",
            details: { typeMessage: args.typeMessage, error: args.error, attempt: args.attempt },
            metadata: { source: CORTEX.GATEWAY },
            timestamp: now,
        });
    },
});

export const listOutboundFlux = query({
    args: {},
    handler: async (ctx) => {
        const flux = await ctx.db.query("fluxInterApps").collect();
        return flux
            .filter((item) => item.fluxCode === "F1" && item.direction === "envoi")
            .sort((a, b) => (b.dateEnvoi || 0) - (a.dateEnvoi || 0))
            .slice(0, 100);
    },
});
