import { HttpMethod } from "../enum/integration.enums.js";

export interface ResponseTemplateFieldConfig {
  path: string;
  equals?: string | number | boolean | null;
  fallback?: string;
}

export interface HttpResponseTemplate {
  success?: ResponseTemplateFieldConfig | ResponseTemplateFieldConfig[];
  message?: string | string[];
  details?: string | string[];
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
  responseTemplate?: HttpResponseTemplate;
  compression?: { type?: "gzip" | "deflate" | "br" };
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
  threshold?: number;
  openMs?: number;
  halfOpenMaxAttempts?: number;
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
