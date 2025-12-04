import { HttpMethod } from "../enum/integration.enums.js";

export interface HttpHeader {
  contentType?: string;     // 'application/json' | 'application/xml' | 'text/plain' | etc
  [key: string]: string | undefined;
}

export interface EndpointConfig {
  timeoutMs?: number;
}

export interface EndpointHttpConfig {
  method: HttpMethod;
  path?: string; // ex.: /v1/drivers
  header?: HttpHeader,
  compression?: { type?: 'gzip' | 'deflate' | 'br' };
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

export interface EndpointTlsConfig  {
  rejectUnauthorized?: boolean;
  ca?: string; // certificado CA em PEM
  cert?: string; // certificado do cliente em PEM
  key?: string; // chave privada do cliente em PEM
}

export interface EndpointRetryPolicy {
  maxAttempts?: number;
  strategy?: 'exponential' | 'fixed';
  delayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

export interface EndpointRateLimitConfig {
  strategy?: 'fixed-window' | 'token-bucket';
  limit?: number;
  intervalMs?: number;
  burst?: number;
}

export interface EndpointBreakerPolicy{ 
  threshold?: number;
  openMs?: number;
  halfOpenMaxAttempts?: number;
}

export interface EndpointIdempotencyConfig {
  strategy: 'header' | 'bodyHash' | 'custom';
  headerName?: string; // ex.: 'Idempotency-Key'
  ttlMs?: number; // tempo de vida da chave de idempotência
}

export interface IntegrationCredentialConfig {
  apiKey?: { headerName?: string; queryName?: string; prefix?: string };
  basic?: { usernameField?: string };
  bearer?: { headerName?: string; prefix?: string };
  oauth2?: {
    tokenUrl: string;
    clientId: string;
    scopes?: string[] | string;
    audience?: string;
    resource?: string;
    authStyle?: 'body' | 'basic' | 'bearer';
  }; 
}


export interface IntegrationCredentialSecrets {
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