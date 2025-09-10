/**
 * NestJS/Node shared type utilities (types only, no runtime).
 */

/** Brand primitive types to distinguish IDs across domains. */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/** Generic entity identifier (override in downstream apps if needed). */
export type EntityId = Brand<string, 'EntityId'>;

/** Nullable helper. */
export type Nullable<T> = T | null;

/** Optional helper. */
export type Optional<T> = T | undefined;

/** Promise or value. */
export type MaybePromise<T> = T | Promise<T>;

/** Deep partial helper for DTOs. */
export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

/** Common request-scoped user payload injected by auth guards. */
export interface RequestUser {
  sub: EntityId;
  email?: string;
  roles?: string[];
  permissions?: string[];
  // ISO timestamp in UTC
  iat?: number;
  // ISO timestamp in UTC
  exp?: number;
}

/** Standard tracing headers passed across services. */
export interface TraceHeaders {
  /** Correlation ID for distributed tracing. */
  'x-request-id'?: string;
  /** Parent trace/span id if any. */
  'x-trace-id'?: string;
}

/**
 * Simplified NestJS execution context information that can be stored or re-used in DTOs.
 */
export interface ExecutionContextInfo {
  requestId?: string;
  user?: RequestUser | null;
}
