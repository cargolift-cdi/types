import { HttpMethod } from "../enum/integration.enums.js";
import { PayloadConditionsValue } from "../interfaces/payload-condition.interface.js";

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

export interface EndpointConfig {
  timeoutMs?: number;
}

/** Configurações específicas quando transportProtocol é HTTP/REST.
  * Exemplo de configuração de template de resposta:
   "responseTemplate": {
    "success": { "path": "data.success", "equals": true },
    "message": "data.message",
    "details": ["data", "errors"],
    "failureType": "business",
    "failureStatus": 422
  }
  */
export interface HttpConfig {
  method: HttpMethod;
  path?: string; // ex.: /v1/drivers
  header?: HttpHeader;
  queryParams?: Record<string, string>;
  responseInterpreter?: ResponseInterpreterRules;
  compression?: { type?: "gzip" | "deflate" | "br" };
  onError?: {
    retryStatusCodes?: number[]; // ex.: [500, 502, 503, 504]
  };
}

export interface EndpointQueueConfig {
  topic?: string;
  queue?: string;
  exchange?: string;
  routingKey?: string;
  partitionKey?: string;
  messageKey?: string;
  properties?: Record<string, any>; // propriedades específicas do broker
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

export interface Credential {
  apiKey?: { headerName?: string; queryName?: string; prefix?: string };
  basic?: { usernameField?: string };
  bearer?: { headerName?: string; prefix?: string };
  oauth2?: {
    tokenUrl: string;
    clientId: string;
    scopes?: string[] | string;
    audience?: string;
    resource?: string;
    authStyle?: "body" | "basic" | "bearer";
  };
}

export interface CredentialSecrets {
  apiKey?: { value: string };
  basic?: { username: string; password: string };
  bearer?: { token: string };
  oauth2?: {
    clientSecret: string;
    username?: string;
    password?: string;
    privateKey?: string;
  };
}


export interface IntegrationInboundRouting {
    route: string;
    conditions?: PayloadConditionsValue;
    default?: boolean;
    onError?: 'ignore' | 'fail';
}

