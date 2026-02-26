/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_mutations from "../admin/mutations.js";
import type * as admin_queries from "../admin/queries.js";
import type * as admins from "../admins.js";
import type * as agrement_mutations from "../agrement/mutations.js";
import type * as agrement_queries from "../agrement/queries.js";
import type * as alertes_queries from "../alertes/queries.js";
import type * as analyses_mutations from "../analyses/mutations.js";
import type * as analyses_queries from "../analyses/queries.js";
import type * as auth from "../auth.js";
import type * as formation_queries from "../formation/queries.js";
import type * as importation_mutations from "../importation/mutations.js";
import type * as importation_queries from "../importation/queries.js";
import type * as monDossier_queries from "../monDossier/queries.js";
import type * as operateurs from "../operateurs.js";
import type * as phytosanitaire_mutations from "../phytosanitaire/mutations.js";
import type * as phytosanitaire_queries from "../phytosanitaire/queries.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/mutations": typeof admin_mutations;
  "admin/queries": typeof admin_queries;
  admins: typeof admins;
  "agrement/mutations": typeof agrement_mutations;
  "agrement/queries": typeof agrement_queries;
  "alertes/queries": typeof alertes_queries;
  "analyses/mutations": typeof analyses_mutations;
  "analyses/queries": typeof analyses_queries;
  auth: typeof auth;
  "formation/queries": typeof formation_queries;
  "importation/mutations": typeof importation_mutations;
  "importation/queries": typeof importation_queries;
  "monDossier/queries": typeof monDossier_queries;
  operateurs: typeof operateurs;
  "phytosanitaire/mutations": typeof phytosanitaire_mutations;
  "phytosanitaire/queries": typeof phytosanitaire_queries;
  seed: typeof seed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
