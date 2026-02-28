import { PayloadConditionsValue } from "../interfaces/payload-condition.interface.js";

export type IntegrationActions = "create" | "update" | "upsert" | "delete" | "clean" | "view";




export interface ResponseInterpreterSuccessCondition {
  path: string;
  equals?: string | number | boolean | null;
}

export interface ResponseInterpreterRules {
  success?: ResponseInterpreterSuccessCondition | ResponseInterpreterSuccessCondition[];
  message?: string | string[];
  details?: string | string[];
  options?: {
    failureOnMissingPath?: boolean; // se true, falha se o path não existir no payload. Default: false
    retryOnFailure?: boolean; // se true, indica que a falha deve ser considerada para retry. Default: false
  };
}

export interface HttpHeader {
  contentType?: string; // 'application/json' | 'application/xml' | 'text/plain' | etc
  [key: string]: string | undefined;
}

export interface EndpointTlsConfig {
  rejectUnauthorized?: boolean;
  ca?: string; // certificado CA em PEM
  cert?: string; // certificado do cliente em PEM
  key?: string; // chave privada do cliente em PEM
}

export interface RetryPolicy {
  maxAttempts?: number;
  strategy?: "exponential" | "fixed";
  delayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

/** Configuração de rate-limit.
 *  strategy:
 *   - 'token-bucket' (default): limit/intervalMs com burst opcional, distribuído via Redis.
 *   - 'fixed-window': janela fixa local (>= intervalMs entre execuções por instância).
 */
export interface RateLimit {
  strategy?: "fixed-window" | "token-bucket";
  limit?: number;
  intervalMs?: number;
  burst?: number;
}

export interface BreakerPolicy {
  threshold?: number;           // Quantidade de falhas para abrir o circuito
  openMs?: number;              // Tempo em ms que o circuito permanece aberto
  halfOpenMaxAttempts?: number; // Tentativas permitidas no estado half-open
}

/**
 * Configuração agrupada de resiliência para o endpoint.
 * Agrupa retry, rate-limit, circuit breaker e concorrência máxima em um único objeto.
 */
export interface ResiliencePolicy {
  /** Política de retentativa */
  retry?: RetryPolicy;
  /** Rate limiting (token bucket distribuído via Redis) */
  rateLimit?: RateLimit;
  /** Circuit breaker por endpoint */
  breaker?: BreakerPolicy;
  /** Concorrência máxima local por endpoint nesta instância (default: 1) */
  maxConcurrent?: number;
}

// ─── Credential (shapes achatados por tipo) ─────────────────────────
// O campo `type` (AuthType) na entidade MiddlewareAgentCredential discrimina
// qual shape se aplica. Não há mais aninhamento por tipo dentro do JSONB.
//
// Shapes de config (não sensível):
//   API_KEY:                     { headerName?, queryName?, prefix? }
//   BASIC:                       (vazio / null)
//   BEARER_STATIC:               { headerName?, prefix? }
//   OAUTH2_CLIENT_CREDENTIALS:   { tokenUrl, clientId, scopes?, audience?, resource?, authStyle? }
//   OAUTH2_PASSWORD:             { tokenUrl, clientId, scopes? }
//   JWT:                         { algorithm?, headerName?, headerPrefix?, issuer?, subject?, ... }
//
// Shapes de secrets (sensível):
//   API_KEY:                     { value }
//   BASIC:                       { username, password }
//   BEARER_STATIC:               { token }
//   OAUTH2_CLIENT_CREDENTIALS:   { clientSecret }
//   OAUTH2_PASSWORD:             { clientSecret, username, password }
//   JWT:                         { sharedSecret?, privateKey?, passphrase? }
// ─────────────────────────────────────────────────────────────────────

// ─── GraphQL Endpoint Config ────────────────────────────────────────

/**
 * Configuração específica para endpoints GraphQL.
 * Armazenada como JSONB na coluna `graphql_config` de `MiddlewareAgentEndpoint`.
 *
 * O conector GraphQL monta o body `{ query, variables, operationName }` com base nesta config.
 *
 * @example
 * ```json
 * {
 *   "query": "mutation CreateDriver($input: DriverInput!) { createDriver(input: $input) { id name } }",
 *   "operationName": "CreateDriver",
 *   "variablesMapping": "{ \"input\": $ }"
 * }
 * ```
 */
export interface GraphqlEndpointConfig {
  /** Query ou mutation GraphQL a ser enviada (obrigatória) */
  query: string;

  /** Nome da operação (opcional — útil quando a query contém múltiplas operações) */
  operationName?: string;

  /**
   * Variáveis padrão mescladas com o payload (shallow merge).
   * Útil para valores fixos que devem acompanhar toda requisição.
   */
  defaultVariables?: Record<string, unknown>;

  /**
   * Expressão JSONata para mapear o payload transformado (ESB/BRE) para `variables`.
   * Se definido, o resultado da expressão substitui o payload como variables.
   * Se não definido, o payload transformado é enviado diretamente como variables.
   *
   * @example "{ \"input\": $ }"  — envolve o payload inteiro em `input`
   * @example "{ \"id\": $.code, \"name\": $.fullName }" — mapeia campos específicos
   */
  variablesMapping?: string;
}


/** Config não-sensível da credencial. Shape depende de `credential.type`. */
export type CredentialConfig = Record<string, unknown>;

/** Segredos sensíveis da credencial. Shape depende de `credential.type`. */
export type CredentialSecrets = Record<string, unknown>;

/**
 * Configurações de integração para roteamento, transformação, validação e monitoramento.
 * Inclui configurações específicas para cada protocolo de transporte (HTTP, AMQP, etc) e políticas de retry, rate-limit e breaker.
 * Utilizado para definir as rotas de integração de entrada (inbound) e saída (outbound) no middleware.
 * Exemplo:
 * {
 *  "route": "delete",
 *  "conditions": { "left": "mode", "operator": "=", "right": "delete" },
 *  "default": false
 * }
 */
export interface IntegrationInboundRouting {
    route: string;
    conditions?: PayloadConditionsValue;
    default?: boolean;
    onError?: 'ignore' | 'fail';
}

